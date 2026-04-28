<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Response;

class DebugController extends Controller
{
    /**
     * Check featured films data
     */
    public function checkFilms()
    {
        $featuredFilms = Film::select('id', 'title', 'poster', 'banner', 'rating', 'year', 'genres', 'is_featured')
            ->where('is_featured', true)
            ->limit(6)
            ->get();

        $allFilms = Film::select('id', 'title', 'poster', 'is_featured')
            ->get();

        return response()->json([
            'status' => 'ok',
            'featured_films_count' => $featuredFilms->count(),
            'featured_films' => $featuredFilms,
            'all_films_count' => $allFilms->count(),
            'sample_all_films' => $allFilms->take(5),
            'message' => 'Featured films = ' . $featuredFilms->count() . ' items | Total films = ' . $allFilms->count() . ' items',
        ]);
    }

    /**
     * Verify database connection
     */
    public function checkDatabase()
    {
        try {
            $film_count = Film::count();
            
            return response()->json([
                'status' => 'connected',
                'database' => config('database.connections.mysql.database'),
                'total_films' => $film_count,
                'featured_films' => Film::where('is_featured', true)->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
