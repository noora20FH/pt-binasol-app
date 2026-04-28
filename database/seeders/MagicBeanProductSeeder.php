<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class MagicBeanProductSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::where('slug', 'magic-bean')->first();

        if (!$category) {
            $this->command->error('Kategori Magic Bean tidak ditemukan. Jalankan AssetSeeder terlebih dahulu.');
            return;
        }

        // Hapus produk Magic Bean lama
        $oldProducts = Product::where('category_id', $category->id)->get();
        foreach ($oldProducts as $p) {
            $p->images()->delete();
            $p->forceDelete();
        }

        // Satu produk dengan semua gambar katalog sebagai carousel
        $product = Product::create([
            'category_id' => $category->id,
            'name'         => 'Magic Bean',
            'slug'         => 'magic-bean',
            'description'  => 'Produk unggulan Magic Bean dengan kualitas premium dan inovasi terdepan untuk kehidupan modern Anda.',
            'price'        => 350000,
            'original_price' => 500000,
            'badge'        => 'Best Seller',
            'stock'        => 50,
        ]);

        $images = [
            '/Asset/Magic Bean/Katalog/1.png',
            '/Asset/Magic Bean/Katalog/2.png',
            '/Asset/Magic Bean/Katalog/3.png',
            '/Asset/Magic Bean/Katalog/4.png',
            '/Asset/Magic Bean/Katalog/5.png',
            '/Asset/Magic Bean/Katalog/6.png',
            '/Asset/Magic Bean/Katalog/7.png',
            '/Asset/Magic Bean/Katalog/8.png',
            '/Asset/Magic Bean/Katalog/9.png',
            '/Asset/Magic Bean/Katalog/10.png',
            '/Asset/Magic Bean/Katalog/Template CPas Motion Graphic.png',
        ];

        foreach ($images as $index => $imagePath) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imagePath,
                'is_primary' => $index === 0,
            ]);
        }

        $this->command->info('✅ Magic Bean product berhasil dibuat dengan 1 produk dan ' . count($images) . ' gambar.');
    }
}
