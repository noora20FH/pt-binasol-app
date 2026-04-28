<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminFilmController extends Controller
{
    public function index()
    {
        $films = Film::with(['castMembers', 'episodes', 'filmPlatforms'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($film) {
                return [
                    'id'          => $film->id,
                    'title'       => $film->title,
                    'description' => $film->description,
                    'genres'      => $film->genres,
                    'rating'      => $film->rating,
                    'year'        => $film->year,
                    'poster'      => $film->poster ? Storage::url($film->poster) : null,
                    'banner'      => $film->banner ? Storage::url($film->banner) : null,
                    'is_featured' => $film->is_featured,

                    'casts' => $film->castMembers->map(fn($c) => [
                        'name'       => $c->name,
                        'role'       => $c->role,
                        'image'      => $c->image ? Storage::url($c->image) : null,
                        'image_path' => $c->image,                    // ← TAMBAHAN UTAMA
                    ]),

                    // episodes & platforms tetap sama
                    'episodes' => $film->episodes->map(fn($e) => [
                        'id'       => $e->id,
                        'number'   => $e->number,
                        'title'    => $e->title,
                        'duration' => $e->duration,
                    ]),

                    'platforms' => $film->filmPlatforms->map(fn($p) => [
                        'id'            => $p->id,
                        'platform_name' => $p->platform_name,
                        'url'           => $p->url,
                    ]),
                ];
            });

        return inertia('Admin/FilmManagement', [
            'films' => $films,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres'      => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:10',
            'year'        => 'nullable|integer|min:1900|max:' . date('Y'),
            'poster'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',   // 10 MB
            'banner'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',   // 10 MB
            'is_featured' => 'boolean',
            'casts'       => 'nullable|array',
            'casts.*.image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240', // 10 MB untuk setiap cast
            'episodes'    => 'nullable|json',
            'platforms'   => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            $film = Film::create([
                'title'       => $validated['title'],
                'description' => $validated['description'] ?? null,
                'genres'      => $validated['genres'] ?? null,
                'rating'      => $validated['rating'] ?? null,
                'year'        => $validated['year'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
            ]);

            // Upload Poster & Banner
            if ($request->hasFile('poster')) {
                $film->poster = $request->file('poster')->store('films/posters', 'public');
            }
            if ($request->hasFile('banner')) {
                $film->banner = $request->file('banner')->store('films/banners', 'public');
            }
            $film->save();

            // === CASTS ===
            $castsData = $request->input('casts', []);
            foreach ($castsData as $index => $castData) {
                if (empty($castData['name'] ?? null)) continue;

                $cast = [
                    'name' => $castData['name'],
                    'role' => $castData['role'] ?? null,
                ];

                if ($request->hasFile("casts.{$index}.image")) {
                    $cast['image'] = $request->file("casts.{$index}.image")
                        ->store('casts/images', 'public');
                }

                $film->castMembers()->create($cast);
            }

            // === EPISODES (JSON dari FormData) ===
            if ($request->filled('episodes')) {
                $episodesData = json_decode($request->episodes, true) ?? [];
                foreach ($episodesData as $ep) {
                    if (!empty($ep['title'] ?? null)) {
                        $film->episodes()->create([
                            'number'   => $ep['number'] ?? null,
                            'title'    => $ep['title'],
                            'duration' => $ep['duration'] ?? null,
                        ]);
                    }
                }
            }

            // === PLATFORMS ===
            $platformsData = $request->input('platforms', []);
            foreach ($platformsData as $platform) {
                if (!empty($platform['platform_name'] ?? null)) {
                    $film->filmPlatforms()->create([
                        'platform_name' => $platform['platform_name'],
                        'url'           => $platform['url'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.films.index')
                ->with('success', 'Film berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan film: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres'      => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:10',
            'year'        => 'nullable|integer|min:1900|max:' . date('Y'),
            'poster'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',   // 10 MB
            'banner'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',   // 10 MB
            'is_featured' => 'boolean',
            'casts'       => 'nullable|array',
            'casts.*.image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240', // 10 MB untuk setiap cast
            'episodes'    => 'nullable|json',
            'platforms'   => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            // Update data utama
            $film->update([
                'title'       => $validated['title'],
                'description' => $validated['description'] ?? null,
                'genres'      => $validated['genres'] ?? null,
                'rating'      => $validated['rating'] ?? null,
                'year'        => $validated['year'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
            ]);

            // Handle Poster
            if ($request->hasFile('poster')) {
                if ($film->poster && Storage::disk('public')->exists($film->poster)) {
                    Storage::disk('public')->delete($film->poster);
                }
                $film->poster = $request->file('poster')->store('films/posters', 'public');
            }

            // Handle Banner
            if ($request->hasFile('banner')) {
                if ($film->banner && Storage::disk('public')->exists($film->banner)) {
                    Storage::disk('public')->delete($film->banner);
                }
                $film->banner = $request->file('banner')->store('films/banners', 'public');
            }
            $film->save();

            // === CASTS (replace all) ===
            $film->castMembers()->delete();

            $castsData = $request->input('casts', []);
            foreach ($castsData as $index => $castData) {
                if (empty($castData['name'] ?? null)) continue;

                $cast = [
                    'name' => $castData['name'],
                    'role' => $castData['role'] ?? null,
                ];

                if ($request->hasFile("casts.{$index}.image")) {
                    // Upload gambar baru
                    $cast['image'] = $request->file("casts.{$index}.image")
                        ->store('casts/images', 'public');
                } elseif (isset($castData['image_path']) && $castData['image_path']) {
                    // ← PERBAIKAN: gunakan gambar lama jika tidak ada upload baru
                    $cast['image'] = $castData['image_path'];
                }

                $film->castMembers()->create($cast);
            }

            // === EPISODES (replace all) ===
            $film->episodes()->delete();
            if ($request->filled('episodes')) {
                $episodesData = json_decode($request->episodes, true) ?? [];
                foreach ($episodesData as $ep) {
                    if (!empty($ep['title'] ?? null)) {
                        $film->episodes()->create([
                            'number'   => $ep['number'] ?? null,
                            'title'    => $ep['title'],
                            'duration' => $ep['duration'] ?? null,
                        ]);
                    }
                }
            }

            // === PLATFORMS (replace all) ===
            $film->filmPlatforms()->delete();
            $platformsData = $request->input('platforms', []);
            foreach ($platformsData as $platform) {
                if (!empty($platform['platform_name'] ?? null)) {
                    $film->filmPlatforms()->create([
                        'platform_name' => $platform['platform_name'],
                        'url'           => $platform['url'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.films.index')
                ->with('success', 'Film berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui film: ' . $e->getMessage()]);
        }
    }

    public function destroy(Film $film)
    {
        // Hapus file fisik
        if ($film->poster && Storage::disk('public')->exists($film->poster)) {
            Storage::disk('public')->delete($film->poster);
        }
        if ($film->banner && Storage::disk('public')->exists($film->banner)) {
            Storage::disk('public')->delete($film->banner);
        }

        $film->delete();

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil dihapus!');
    }
}
