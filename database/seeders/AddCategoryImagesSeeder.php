<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class AddCategoryImagesSeeder extends Seeder
{
    /**
     * Tambah images ke kategori dari product images
     */
    public function run(): void
    {
        // Ambil first product image dari setiap kategori
        $categories = Category::all();

        foreach ($categories as $category) {
            // Get first product image dari kategori ini
            $productImage = ProductImage::whereHas('product', function ($q) use ($category) {
                $q->where('category_id', $category->id);
            })->first();

            if ($productImage && $productImage->image_path) {
                // Update category dengan product image
                $category->update([
                    'image' => $productImage->image_path
                ]);
                echo "✓ Updated: {$category->name} with product image\n";
            } else {
                // Fallback: buat placeholder image path atau warna
                echo "⚠ No product image for: {$category->name} - using fallback\n";
            }
        }

        echo "\n✅ Category images updated from products!\n";
    }
}
