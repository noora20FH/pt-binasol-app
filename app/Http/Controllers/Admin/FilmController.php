<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Film;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class FilmController extends Controller
{
    public function index()
    {
        $films = Film::with(['castMembers', 'episodes.platforms'])
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
                    'created_at'  => $film->created_at?->toIso8601String(),
                    'updated_at'  => $film->updated_at?->toIso8601String(),
                    'casts' => $film->castMembers->map(fn($c) => [
                        'id'    => $c->id,
                        'name'  => $c->name,
                        'role'  => $c->role,
                        'image' => $c->image ? Storage::url($c->image) : null,   // ← PERBAIKAN UTAMA
                    ])->toArray(),
                    'episodes'    => $film->episodes->map(fn($e) => [
                        'id' => $e->id,
                        'number' => $e->number,
                        'title' => $e->title,
                        'duration' => $e->duration,
                        'thumbnail' => $e->thumbnail,
                        'platforms' => $e->platforms->toArray(),
                    ])->toArray(),
                ];
            })
            ->all();

        return Inertia::render('Admin/FilmManagement', ['films' => $films]);
    }

    public function create()
    {
        return Inertia::render('Admin/FilmManagement', ['films' => [], 'mode' => 'create']);
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

        // === CASTS (sudah aman) ===
        if ($request->has('casts')) {
            foreach ($request->casts as $castData) {
                $cast = [
                    'name' => $castData['name'] ?? null,
                    'role' => $castData['role'] ?? null,
                ];

                // Upload image cast jika ada file
                if (isset($castData['image']) && $castData['image'] instanceof \Illuminate\Http\UploadedFile) {
                    $cast['image'] = $castData['image']->store('casts/images', 'public');
                }

                $film->castMembers()->create($cast);
            }
        }

        // === EPISODES (PERBAIKAN UTAMA) ===
        if ($request->filled('episodes')) {
            $episodesData = $request->episodes;

            // Handle kalau data berupa string JSON atau array
            if (is_string($episodesData)) {
                $episodesData = json_decode($episodesData, true);
            }

            if (is_array($episodesData)) {
                foreach ($episodesData as $ep) {
                    $episode = $film->episodes()->create($ep);

                    // Platforms
                    if (isset($ep['platforms']) && is_array($ep['platforms'])) {
                        foreach ($ep['platforms'] as $platform) {
                            $episode->platforms()->create($platform);
                        }
                    }
                }
            }
        }

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil ditambahkan!');
    }

    public function edit(Film $film)
    {
        $film->load(['castMembers', 'episodes.platforms']);

        // Transform jadi plain array (sama persis seperti di index())
        $filmData = [
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
                'id'    => $c->id,
                'name'  => $c->name,
                'role'  => $c->role,
                'image' => $c->image ? Storage::url($c->image) : null,   // ← PERBAIKAN UTAMA
            ])->toArray(),
            'episodes'    => $film->episodes->map(fn($e) => [
                'id'        => $e->id,
                'number'    => $e->number,
                'title'     => $e->title,
                'duration'  => $e->duration,
                'thumbnail' => $e->thumbnail,
                'platforms' => $e->platforms->toArray(),
            ])->toArray(),
        ];

        return Inertia::render('Admin/FilmManagement', [
            'film'  => $filmData,   // ← sekarang sudah plain array
            'mode'  => 'edit',
            'films' => [],
        ]);
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'genres'      => 'nullable|string',
            'rating'      => 'nullable|numeric|min:0|max:10',
            'year'        => 'nullable|integer',
            'poster'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'banner'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_featured' => 'boolean',
        ]);

        // Update data teks biasa dulu (kecuali file)
        $film->update(
            collect($validated)
                ->except(['poster', 'banner'])
                ->toArray()
        );

        // === HANDLE POSTER (INI YANG RUSAK SEBELUMNYA) ===
        if ($request->hasFile('poster')) {
            // Hapus poster lama supaya tidak menumpuk di storage
            if ($film->poster && Storage::disk('public')->exists($film->poster)) {
                Storage::disk('public')->delete($film->poster);
            }
            $film->poster = $request->file('poster')->store('films/posters', 'public');
        }

        // === HANDLE BANNER (kalau kamu pakai) ===
        if ($request->hasFile('banner')) {
            if ($film->banner && Storage::disk('public')->exists($film->banner)) {
                Storage::disk('public')->delete($film->banner);
            }
            $film->banner = $request->file('banner')->store('films/banners', 'public');
        }
        // === UPDATE CASTS (replace all) ===
        $film->castMembers()->delete();
        if ($request->filled('casts')) {
            $castsData = is_string($request->casts)
                ? json_decode($request->casts, true)
                : $request->casts;

            foreach ($castsData as $cast) {
                if (!empty($cast['name'])) {
                    $film->castMembers()->create($cast);
                }
            }
        }

        // === UPDATE EPISODES (replace all) ===
        $film->episodes()->delete();
        if ($request->filled('episodes')) {
            $episodesData = is_string($request->episodes)
                ? json_decode($request->episodes, true)
                : $request->episodes;

            foreach ($episodesData as $ep) {
                $episode = $film->episodes()->create([
                    'number'   => $ep['number'] ?? null,
                    'title'    => $ep['title'] ?? null,
                    'duration' => $ep['duration'] ?? null,
                ]);

                if (isset($ep['platforms']) && is_array($ep['platforms'])) {
                    foreach ($ep['platforms'] as $platform) {
                        $episode->platforms()->create($platform);
                    }
                }
            }
        }

        $film->save();
        $film->castMembers()->delete();
        if ($request->has('casts')) {
            foreach ($request->casts as $castData) {
                $cast = [
                    'name' => $castData['name'] ?? null,
                    'role' => $castData['role'] ?? null,
                ];

                if (isset($castData['image']) && $castData['image'] instanceof \Illuminate\Http\UploadedFile) {
                    $cast['image'] = $castData['image']->store('casts/images', 'public');
                }

                $film->castMembers()->create($cast);
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
