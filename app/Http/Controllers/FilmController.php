<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;

class FilmController extends Controller
{
    public function index()
    {
        $films = Film::select('id', 'title', 'poster', 'banner', 'year', 'rating', 'is_featured')
            ->paginate(12);

        return inertia('Films/Index', [
            'films' => $films,
        ]);
    }

    public function show(Film $film)
    {
        $film->load(['casts', 'episodes.platforms']);

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
