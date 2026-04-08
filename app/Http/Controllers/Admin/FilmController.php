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
                    'casts'       => $film->castMembers->map(fn($c) => [
                        'id' => $c->id, 'name' => $c->name, 'role' => $c->role, 'image' => $c->image
                    ])->toArray(),
                    'episodes'    => $film->episodes->map(fn($e) => [
                        'id' => $e->id, 'number' => $e->number, 'title' => $e->title,
                        'duration' => $e->duration, 'thumbnail' => $e->thumbnail,
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
    if ($request->filled('casts') && is_array($request->casts)) {
        foreach ($request->casts as $cast) {
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

        return Inertia::render('Admin/FilmManagement', [
            'film'  => $film,
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

        $film->update($validated);

        if ($request->hasFile('poster')) {
            $film->poster = $request->file('poster')->store('films/posters', 'public');
        }
        if ($request->hasFile('banner')) {
            $film->banner = $request->file('banner')->store('films/banners', 'public');
        }
        $film->save();

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
