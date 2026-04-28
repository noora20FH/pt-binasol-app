<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FilmSeeder extends Seeder
{
    public function run(): void
    {
        // Film 1 - Laskar Pelangi
        $film1 = DB::table('films')->insertGetId([
            'title'       => 'Laskar Pelangi',
            'description' => 'Kisah inspiratif anak-anak SD Muhammadiyah di Belitung',
            'genres'      => 'Drama, Pendidikan',
            'rating'      => 8.5,
            'year'        => 2008,
            'poster'      => 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
            'banner'      => 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
            'is_featured' => true,
            'created_at'  => '2026-01-15 00:00:00',
            'updated_at'  => '2026-01-15 00:00:00',
        ]);

        // Casts Film 1
        DB::table('casts')->insert([
            [
                'film_id'    => $film1,
                'name'       => 'Cut Mini Theo',
                'role'       => 'Bu Muslimah',
                'image'      => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'film_id'    => $film1,
                'name'       => 'Ikranagara',
                'role'       => 'Pak Harfan',
                'image'      => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Episode Film 1
        $episode1 = DB::table('episodes')->insertGetId([
            'film_id'    => $film1,
            'number'     => 1,
            'title'      => 'Full Movie',
            'duration'   => '125:00',
            'thumbnail'  => 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Platforms Episode 1
        DB::table('episode_platforms')->insert([
            [
                'episode_id'    => $episode1,
                'platform_name' => 'Netflix',
                'url'           => 'https://netflix.com/watch/laskar-pelangi',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'episode_id'    => $episode1,
                'platform_name' => 'Disney+ Hotstar',
                'url'           => 'https://hotstar.com/id/movies/laskar-pelangi',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);

        // Film 2 - Pengabdi Setan
        $film2 = DB::table('films')->insertGetId([
            'title'       => 'Pengabdi Setan',
            'description' => 'Sebuah keluarga dihadapkan pada teror misterius',
            'genres'      => 'Horror, Thriller',
            'rating'      => 7.8,
            'year'        => 2017,
            'poster'      => 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
            'banner'      => 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
            'is_featured' => false,
            'created_at'  => '2026-02-10 00:00:00',
            'updated_at'  => '2026-02-10 00:00:00',
        ]);

        // Casts Film 2
        DB::table('casts')->insert([
            [
                'film_id'    => $film2,
                'name'       => 'Tara Basro',
                'role'       => 'Rini',
                'image'      => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'film_id'    => $film2,
                'name'       => 'Bront Palarae',
                'role'       => 'Bahri',
                'image'      => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Episode Film 2
        $episode2 = DB::table('episodes')->insertGetId([
            'film_id'    => $film2,
            'number'     => 1,
            'title'      => 'Full Movie',
            'duration'   => '107:00',
            'thumbnail'  => 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Platforms Episode 2
        DB::table('episode_platforms')->insert([
            [
                'episode_id'    => $episode2,
                'platform_name' => 'Netflix',
                'url'           => 'https://netflix.com/watch/pengabdi-setan',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}
