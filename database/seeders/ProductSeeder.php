<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Make sure categories exist first
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Please run CategorySeeder first.');
            return;
        }

        $products = [
            [
                'category_id' => $categories->firstWhere('slug', 'material-konstruksi')?->id ?? 1,
                'name' => 'Semen Portland Type I 50kg',
                'slug' => 'semen-portland-type-i-50kg',
                'description' => 'Semen berkualitas tinggi untuk konstruksi umum',
                'price' => 75000,
                'original_price' => 85000,
                'badge' => 'featured',
                'stock' => 100,
                'image' => '/images/products/semen.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'material-konstruksi')?->id ?? 1,
                'name' => 'Bata Ringan AAC 10cm',
                'slug' => 'bata-ringan-aac-10cm',
                'description' => 'Bata ringan berkualitas dengan ukuran 10cm',
                'price' => 850000,
                'original_price' => 950000,
                'badge' => 'featured',
                'stock' => 50,
                'image' => '/images/products/bata-ringan.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'cat-pelapis')?->id ?? 3,
                'name' => 'Cat Tembok Interior 5L',
                'slug' => 'cat-tembok-interior-5l',
                'description' => 'Cat tembok interior berkualitas premium',
                'price' => 245000,
                'original_price' => null,
                'badge' => 'new',
                'stock' => 30,
                'image' => '/images/products/cat-interior.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'sanitasi')?->id ?? 4,
                'name' => 'Toilet Duduk Premium',
                'slug' => 'toilet-duduk-premium',
                'description' => 'Toilet duduk dengan desain modern',
                'price' => 1850000,
                'original_price' => 2100000,
                'badge' => 'featured',
                'stock' => 15,
                'image' => '/images/products/toilet.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'elektrikal')?->id ?? 5,
                'name' => 'Kabel NYM 3x2.5mm 50m',
                'slug' => 'kabel-nym-3x2-5mm-50m',
                'description' => 'Kabel listrik berkualitas standar SNI',
                'price' => 325000,
                'original_price' => null,
                'badge' => null,
                'stock' => 40,
                'image' => '/images/products/kabel.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'peralatan-bangunan')?->id ?? 2,
                'name' => 'Mesin Bor Listrik 13mm',
                'slug' => 'mesin-bor-listrik-13mm',
                'description' => 'Mesin bor powerful untuk berbagai keperluan',
                'price' => 550000,
                'original_price' => 650000,
                'badge' => 'sale',
                'stock' => 20,
                'image' => '/images/products/mesin-bor.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'furniture')?->id ?? 6,
                'name' => 'Lemari Arsip 2 Pintu',
                'slug' => 'lemari-arsip-2-pintu',
                'description' => 'Lemari arsip kokoh dengan 2 pintu',
                'price' => 1200000,
                'original_price' => null,
                'badge' => 'new',
                'stock' => 10,
                'image' => '/images/products/lemari.jpg',
            ],
            [
                'category_id' => $categories->firstWhere('slug', 'material-konstruksi')?->id ?? 1,
                'name' => 'Besi Beton 12mm',
                'slug' => 'besi-beton-12mm',
                'description' => 'Besi beton berkualitas tinggi',
                'price' => 95000,
                'original_price' => 110000,
                'badge' => 'featured',
                'stock' => 200,
                'image' => '/images/products/besi-beton.jpg',
            ],
        ];

        foreach ($products as $productData) {
            $imagePath = $productData['image'] ?? null;
            unset($productData['image']);
            
            $product = Product::create($productData);
            
            // Create product image
            if ($imagePath) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'is_primary' => true,
                ]);
            }
        }

        $this->command->info('Products seeded successfully!');
    }
}
