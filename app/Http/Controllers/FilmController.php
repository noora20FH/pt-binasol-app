<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Film;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $filmPage  = $request->get('film_page', 1);
        $seriesPage = $request->get('series_page', 1);

        // Film (tidak punya episodes) — pakai is_featured untuk membedakan
        // Kita bedakan: film = tidak punya episodes, series = punya episodes
        // Karena tidak ada kolom type, kita kirim semua sebagai filmPosters
        $allFilms = Film::select('id', 'title', 'poster', 'is_featured')
            ->withCount('episodes')
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'film_page', $filmPage);

        $filmPosters = [
            'data' => $allFilms->filter(fn($f) => $f->episodes_count === 0)->values()->map(fn($f) => [
                'film_id'  => $f->id,
                'title'    => $f->title,
                'url'      => $f->poster ? \Illuminate\Support\Facades\Storage::url($f->poster) : null,
                'filename' => $f->id,
            ])->values(),
            'total'        => $allFilms->filter(fn($f) => $f->episodes_count === 0)->count(),
            'current_page' => $allFilms->currentPage(),
            'last_page'    => $allFilms->lastPage(),
            'per_page'     => $allFilms->perPage(),
        ];

        $seriesPosters = [
            'data' => $allFilms->filter(fn($f) => $f->episodes_count > 0)->values()->map(fn($f) => [
                'film_id'  => $f->id,
                'title'    => $f->title,
                'url'      => $f->poster ? \Illuminate\Support\Facades\Storage::url($f->poster) : null,
                'filename' => $f->id,
            ])->values(),
            'total'        => $allFilms->filter(fn($f) => $f->episodes_count > 0)->count(),
            'current_page' => 1,
            'last_page'    => 1,
            'per_page'     => 20,
        ];

        return inertia('Films/Index', [
            'filmPosters'   => $filmPosters,
            'seriesPosters' => $seriesPosters,
        ]);
    }

    public function show(Film $film)
    {
        $film->load([
            'castMembers',
            'episodes',
            'filmPlatforms'
        ]);

        // Transform data film + assets (sama seperti AdminFilmController)
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

            // Cast Members (Show.jsx pakai film.castMembers)
            'castMembers' => $film->castMembers->map(fn($c) => [
                'id'    => $c->id,
                'name'  => $c->name,
                'role'  => $c->role,
                'image' => $c->image ? Storage::url($c->image) : null,
            ]),

            // Episodes
            'episodes' => $film->episodes->map(fn($e) => [
                'id'       => $e->id,
                'number'   => $e->number,
                'title'    => $e->title,
                'duration' => $e->duration,
            ]),

            // Platforms (Show.jsx pakai film.film_platforms)
            'film_platforms' => $film->filmPlatforms->map(fn($p) => [
                'id'            => $p->id,
                'platform_name' => $p->platform_name,
                'url'           => $p->url,
            ]),
        ];

        // Featured films juga harus pakai full URL poster
        $featuredFilms = Film::where('is_featured', true)
            ->where('id', '!=', $film->id)
            ->limit(4)
            ->get()
            ->map(fn($f) => [
                'id'     => $f->id,
                'title'  => $f->title,
                'poster' => $f->poster ? Storage::url($f->poster) : null,
                'rating' => $f->rating,
            ]);

        return inertia('Films/Show', [
            'film'          => $filmData,
            'featuredFilms' => $featuredFilms,
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

        // === CASTS (sudah aman) ===
        if ($request->filled('casts') && is_array($request->casts)) {
            foreach ($request->casts as $cast) {
                $film->casts()->create($cast);
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
        $film->load(['casts', 'episodes.platforms']);

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
