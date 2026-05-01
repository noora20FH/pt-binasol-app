<?php

namespace Database\Seeders;

use App\Models\CarouselSlide;
use Illuminate\Database\Seeder;

class CarouselSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'title' => 'Solusi Konstruksi Terbaik',
                'subtitle' => 'Menyediakan material berkualitas untuk proyek Anda',
                'image' => '/images/slides/slide1.jpg',
                'link' => '/products',
                'theme' => 'dark',
            ],
            [
                'title' => 'Film Dokumenter',
                'subtitle' => 'Saksikan karya dokumenter terbaik kami',
                'image' => '/images/slides/slide2.jpg',
                'link' => '/films',
                'theme' => 'light',
            ],
            [
                'title' => 'Katalog Produk 2026',
                'subtitle' => 'Jelajahi produk terbaru kami',
                'image' => '/images/slides/slide3.jpg',
                'link' => '/products',
                'theme' => 'dark',
            ],
        ];

        foreach ($slides as $slide) {
            CarouselSlide::create($slide);
        }

        $this->command->info('Carousel slides seeded successfully!');
    }
}
