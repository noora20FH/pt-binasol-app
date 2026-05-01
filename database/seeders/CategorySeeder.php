<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Material Konstruksi',
                'slug' => 'material-konstruksi',
                'description' => 'Semua kebutuhan material konstruksi bangunan',
                'image' => '/images/categories/construction.jpg',
                'icon' => 'Building2',
                'type' => 'construction',
            ],
            [
                'name' => 'Peralatan Bangunan',
                'slug' => 'peralatan-bangunan',
                'description' => 'Alat dan peralatan untuk konstruksi',
                'image' => '/images/categories/tools.jpg',
                'icon' => 'Wrench',
                'type' => 'construction',
            ],
            [
                'name' => 'Cat & Pelapis',
                'slug' => 'cat-pelapis',
                'description' => 'Berbagai jenis cat dan pelapis berkualitas',
                'image' => '/images/categories/paint.jpg',
                'icon' => 'PaintBucket',
                'type' => 'retail',
            ],
            [
                'name' => 'Sanitasi',
                'slug' => 'sanitasi',
                'description' => 'Produk sanitasi dan plumbing',
                'image' => '/images/categories/sanitary.jpg',
                'icon' => 'Droplets',
                'type' => 'retail',
            ],
            [
                'name' => 'Elektrikal',
                'slug' => 'elektrikal',
                'description' => 'Kebutuhan kelistrikan dan instalasi',
                'image' => '/images/categories/electrical.jpg',
                'icon' => 'Zap',
                'type' => 'retail',
            ],
            [
                'name' => 'Furniture',
                'slug' => 'furniture',
                'description' => 'Furniture dan interior bangunan',
                'image' => '/images/categories/furniture.jpg',
                'icon' => 'Sofa',
                'type' => 'retail',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Categories seeded successfully!');
    }
}
