<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Episode;
use App\Models\FilmPlatform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FilmController extends Controller
{
public function index()
{
    $films = Film::with(['castMembers', 'episodes', 'platforms'])   // ← diperbaiki
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

                // Episodes (clean, tanpa platforms)
                'episodes' => $film->episodes->map(fn($ep) => [
                    'id'       => $ep->id,
                    'number'   => $ep->number,
                    'title'    => $ep->title,
                    'duration' => $ep->duration,
                ]),

                // Platforms (baru - per Film)
                'platforms' => $film->platforms->map(fn($p) => [
                    'platform_name' => $p->platform_name,
                    'url'           => $p->url,
                ]),
            ];
        });

    return inertia('Admin/FilmManagement', [
        'films' => $films,
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
        // Updated load relations sesuai database baru
        $film->load(['castMembers', 'episodes', 'platforms']);

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
            'is_featured' => 'boolean',
            'poster' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'banner' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8192',
            'episodes' => 'nullable|json',
            'platforms' => 'nullable|array',
            'platforms.*.platform_name' => 'required|string|max:255',
            'platforms.*.url' => 'required|url|max:500',
        ]);

        // Handle file upload poster & banner
        if ($request->hasFile('poster')) {
            $validated['poster'] = $request->file('poster')->store('posters', 'public');
        }
        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $film = Film::create($validated);

        // === EPISODES ===
        if ($request->filled('episodes')) {
            $episodes = json_decode($request->episodes, true) ?? [];
            foreach ($episodes as $ep) {
                if (!empty($ep['title'])) {
                    $film->episodes()->create([
                        'number'   => $ep['number'] ?? 1,
                        'title'    => $ep['title'],
                        'duration' => $ep['duration'] ?? null,
                        'thumbnail' => $ep['thumbnail'] ?? null,
                    ]);
                }
            }
        }

        // === PLATFORMS (BARU - per Film) ===
        if ($request->has('platforms')) {
            foreach ($request->input('platforms') as $platform) {
                $film->platforms()->create([
                    'platform_name' => $platform['platform_name'],
                    'url'           => $platform['url'],
                ]);
            }
        }

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil ditambahkan');
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:10',
            'year' => 'nullable|integer',
            'is_featured' => 'boolean',
            'poster' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'banner' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:8192',
            'episodes' => 'nullable|json',
            'platforms' => 'nullable|array',
            'platforms.*.platform_name' => 'required|string|max:255',
            'platforms.*.url' => 'required|url|max:500',
        ]);

        // Handle file upload poster & banner (replace old file)
        if ($request->hasFile('poster')) {
            if ($film->poster) Storage::disk('public')->delete($film->poster);
            $validated['poster'] = $request->file('poster')->store('posters', 'public');
        }
        if ($request->hasFile('banner')) {
            if ($film->banner) Storage::disk('public')->delete($film->banner);
            $validated['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $film->update($validated);

        // === EPISODES (hapus lama, buat baru) ===
        $film->episodes()->delete();
        if ($request->filled('episodes')) {
            $episodes = json_decode($request->episodes, true) ?? [];
            foreach ($episodes as $ep) {
                if (!empty($ep['title'])) {
                    $film->episodes()->create([
                        'number'   => $ep['number'] ?? 1,
                        'title'    => $ep['title'],
                        'duration' => $ep['duration'] ?? null,
                    ]);
                }
            }
        }

        // === PLATFORMS (hapus lama, buat baru) ===
        $film->platforms()->delete();
        if ($request->has('platforms')) {
            foreach ($request->input('platforms') as $platform) {
                $film->platforms()->create([
                    'platform_name' => $platform['platform_name'],
                    'url'           => $platform['url'],
                ]);
            }
        }

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil diupdate');
    }

    public function destroy(Film $film)
    {
        // Optional: hapus file poster & banner
        if ($film->poster) Storage::disk('public')->delete($film->poster);
        if ($film->banner) Storage::disk('public')->delete($film->banner);

        $film->delete();

        return redirect()->route('admin.films.index')
            ->with('success', 'Film berhasil dihapus');
    }
}
