<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Film;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FilmController extends Controller
{
    public function index()
    {
        $films = Film::with(['castMembers', 'episodes.platforms'])  // ← pakai castMembers
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
                    'poster'      => $film->poster,
                    'banner'      => $film->banner,
                    'is_featured' => $film->is_featured,
                    'created_at'  => $film->created_at?->toIso8601String(),
                    'updated_at'  => $film->updated_at?->toIso8601String(),

                    // Relation diubah jadi array murni
                    'casts' => $film->castMembers->map(fn($cast) => [  // ← tetap kirim sebagai 'casts' ke React
                        'id'    => $cast->id,
                        'name'  => $cast->name,
                        'role'  => $cast->role,
                        'image' => $cast->image,
                    ])->toArray(),

                    'episodes' => $film->episodes->map(fn($episode) => [
                        'id'        => $episode->id,
                        'number'    => $episode->number,
                        'title'     => $episode->title,
                        'duration'  => $episode->duration,
                        'thumbnail' => $episode->thumbnail,
                        'platforms' => $episode->platforms->toArray(),
                    ])->toArray(),
                ];
            })
            ->all();

        return Inertia::render('Admin/FilmManagement', [
            'films' => $films,
        ]);
    }

    // Method lain (bisa dikembangkan nanti)
    public function create()   { return Inertia::render('Admin/FilmManagement', ['films' => [], 'mode' => 'create']); }
    public function store(Request $request)   { /* nanti */ }
    public function edit(Film $film)         { /* nanti */ }
    public function update(Request $request, Film $film) { /* nanti */ }
    public function destroy(Film $film)      { /* nanti */ }
}
