<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 12;
        $filmPage = max(1, (int) $request->get('film_page', 1));
        $seriesPage = max(1, (int) $request->get('series_page', 1));

        // Scan FILM folder
        $filmDir = public_path('Asset/FILM');
        $filmPosters = $this->scanPosters($filmDir, '/Asset/FILM/');

        // Scan SERIES folder
        $seriesDir = public_path('Asset/SERIES');
        $seriesPosters = $this->scanPosters($seriesDir, '/Asset/SERIES/');

        // Paginate film posters
        $filmTotal = count($filmPosters);
        $filmSlice = array_slice($filmPosters, ($filmPage - 1) * $perPage, $perPage);

        // Paginate series posters
        $seriesTotal = count($seriesPosters);
        $seriesSlice = array_slice($seriesPosters, ($seriesPage - 1) * $perPage, $perPage);

        return inertia('Films/Index', [
            'filmPosters' => [
                'data' => $filmSlice,
                'current_page' => $filmPage,
                'last_page' => max(1, (int) ceil($filmTotal / $perPage)),
                'total' => $filmTotal,
                'per_page' => $perPage,
            ],
            'seriesPosters' => [
                'data' => $seriesSlice,
                'current_page' => $seriesPage,
                'last_page' => max(1, (int) ceil($seriesTotal / $perPage)),
                'total' => $seriesTotal,
                'per_page' => $perPage,
            ],
        ]);
    }

    private function scanPosters(string $dir, string $urlPrefix): array
    {
        if (!is_dir($dir)) return [];

        // Index films by poster path for quick lookup
        $filmsByPoster = Film::select('id', 'title', 'description', 'genres', 'year', 'rating', 'poster', 'banner')
            ->get()
            ->keyBy(fn($f) => ltrim($f->poster, '/'));

        $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $files = [];

        foreach (scandir($dir) as $file) {
            if ($file === '.' || $file === '..') continue;
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!in_array($ext, $extensions)) continue;

            $name = pathinfo($file, PATHINFO_FILENAME);
            $posterKey = ltrim($urlPrefix, '/') . $file;
            $film = $filmsByPoster->get($posterKey);

            $files[] = [
                'filename'    => $file,
                'title'       => $film ? $film->title : ucwords(str_replace(['-', '_'], ' ', $name)),
                'url'         => $urlPrefix . rawurlencode($file),
                'description' => $film?->description,
                'genres'      => $film?->genres,
                'year'        => $film?->year,
                'rating'      => $film?->rating,
                'banner'      => $film?->banner,
                'film_id'     => $film?->id,
            ];
        }

        return $files;
    }

    public function show(Film $film)
    {
        $film->load(['filmCasts', 'episodes.platforms']);

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
