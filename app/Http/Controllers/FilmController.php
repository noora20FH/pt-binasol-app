<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;

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
        $film->load(['castMembers', 'episodes.platforms']);

        $featuredFilms = Film::where('is_featured', true)
            ->where('id', '!=', $film->id)
            ->limit(4)
            ->get();

        return inertia('Films/Show', [
            'film' => $film,
            'featuredFilms' => $featuredFilms,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:10',
            'year' => 'nullable|integer',
            'poster' => 'nullable|string',
            'banner' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        Film::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:10',
            'year' => 'nullable|integer',
            'poster' => 'nullable|string',
            'banner' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        $film->update($validated);

        return redirect()->back();
    }

    public function destroy(Film $film)
    {
        $film->delete();

        return redirect()->back();
    }
}
