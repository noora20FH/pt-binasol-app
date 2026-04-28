<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Film;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
                        'name'  => $c->name,
                        'role'  => $c->role,
                        'image' => $c->image ? Storage::url($c->image) : null,
                    ]),

                    'episodes' => $film->episodes->map(fn($e) => [
                        'id'       => $e->id,
                        'number'   => $e->number,
                        'title'    => $e->title,
                        'duration' => $e->duration,
                    ]),

                    'platforms' => $film->filmPlatforms->map(fn($p) => [
                        'platform_name' => $p->platform_name,
                        'url'           => $p->url,
                    ]),
                ];
            });

        return inertia('Admin/FilmManagement', [
            'films' => $films,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/FilmForm', [
            'film' => null,
            'mode' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres'      => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:10',
            'year'        => 'nullable|integer',
            'poster'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'banner'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_featured' => 'boolean',
        ]);

        $film = Film::create($validated);

        // Upload poster & banner
        if ($request->hasFile('poster')) {
            $film->poster = $request->file('poster')->store('films/posters', 'public');
        }
        if ($request->hasFile('banner')) {
            $film->banner = $request->file('banner')->store('films/banners', 'public');
        }
        $film->save();

        // === CASTS (PERBAIKAN UTAMA) ===
        $castsData = $request->input('casts', []);
        foreach ($castsData as $castData) {
            if (empty($castData['name'])) continue;

            $cast = [
                'name' => $castData['name'],
                'role' => $castData['role'] ?? null,
            ];

            if (isset($castData['image']) && $castData['image'] instanceof \Illuminate\Http\UploadedFile) {
                $cast['image'] = $castData['image']->store('casts/images', 'public');
            }

            $film->castMembers()->create($cast);
        }

        // === EPISODES ===
        if ($request->filled('episodes')) {
            $episodesData = $request->episodes;
            if (is_string($episodesData)) {
                $episodesData = json_decode($episodesData, true);
            }

            if (is_array($episodesData)) {
                foreach ($episodesData as $ep) {
                    $film->episodes()->create([
                        'number'   => $ep['number'] ?? null,
                        'title'    => $ep['title'] ?? null,
                        'duration' => $ep['duration'] ?? null,
                    ]);
                }
            }
        }

        // === PLATFORMS ===
        $platformsData = $request->input('platforms', []);
        foreach ($platformsData as $platform) {
            if (!empty($platform['platform_name'])) {
                $film->filmPlatforms()->create([
                    'platform_name' => $platform['platform_name'],
                    'url'           => $platform['url'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil ditambahkan!');
    }

    public function edit(Film $film)
    {
        $film->load(['castMembers', 'episodes', 'filmPlatforms']);

        return inertia('Admin/FilmForm', [
            'film' => [
                'id'          => $film->id,
                'title'       => $film->title,
                'description' => $film->description,
                'genres'      => $film->genres,
                'rating'      => $film->rating,
                'year'        => $film->year,
                'poster'      => $film->poster ? Storage::url($film->poster) : null,
                'banner'      => $film->banner ? Storage::url($film->banner) : null,
                'is_featured' => $film->is_featured,

                'casts'     => $film->castMembers->map(fn($c) => [
                    'name'  => $c->name,
                    'role'  => $c->role,
                    'image' => $c->image ? Storage::url($c->image) : null,
                ]),

                'episodes'  => $film->episodes->map(fn($e) => [
                    'number'   => $e->number,
                    'title'    => $e->title,
                    'duration' => $e->duration,
                ]),

                'platforms' => $film->filmPlatforms->map(fn($p) => [
                    'platform_name' => $p->platform_name,
                    'url'           => $p->url,
                ]),
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'genres'       => 'nullable|string',
            'rating'       => 'nullable|numeric|min:0|max:10',
            'year'         => 'nullable|integer',
            'is_featured'  => 'boolean',
            'poster'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'banner'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'episodes'     => 'nullable|json',
            'platforms'    => 'nullable|array',
            'platforms.*.platform_name' => 'required|string|max:255',
            'platforms.*.url' => 'required|url|max:500',
        ]);

        // Update data utama + file
        if ($request->hasFile('poster')) {
            if ($film->poster && Storage::disk('public')->exists($film->poster)) {
                Storage::disk('public')->delete($film->poster);
            }
            $validated['poster'] = $request->file('poster')->store('films/posters', 'public');
        }

        if ($request->hasFile('banner')) {
            if ($film->banner && Storage::disk('public')->exists($film->banner)) {
                Storage::disk('public')->delete($film->banner);
            }
            $validated['banner'] = $request->file('banner')->store('films/banners', 'public');
        }

        $film->update(collect($validated)->except(['episodes', 'platforms'])->toArray());

        // === CASTS (replace all) ===
        $film->castMembers()->delete();
        $castsData = $request->input('casts', []);
        foreach ($castsData as $castData) {
            if (empty($castData['name'])) continue;

            $cast = [
                'name' => $castData['name'],
                'role' => $castData['role'] ?? null,
            ];

            if (isset($castData['image']) && $castData['image'] instanceof \Illuminate\Http\UploadedFile) {
                $cast['image'] = $castData['image']->store('casts/images', 'public');
            }

            $film->castMembers()->create($cast);
        }

        // === EPISODES (replace all) ===
        $film->episodes()->delete();
        if ($request->filled('episodes')) {
            $episodesData = json_decode($request->episodes, true) ?? [];
            foreach ($episodesData as $ep) {
                if (!empty($ep['title'])) {
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
            if (!empty($platform['platform_name'])) {
                $film->filmPlatforms()->create([
                    'platform_name' => $platform['platform_name'],
                    'url'           => $platform['url'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil diperbarui!');
    }

    public function destroy(Film $film)
    {
        $film->delete();
        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil dihapus!');
    }
}
