<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 🔥 DISABLE FOREIGN KEY CHECKS sementara (untuk MySQL/MariaDB)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate semua tabel terkait (urutan child → parent)
        ProductImage::truncate();
        ProductSpecification::truncate();
        Product::truncate();
        Category::truncate();

        // === CATEGORIES ===
        $categories = [
            [
                'name'        => 'Pakaian Pria',
                'slug'        => 'pakaian-pria',
                'description' => 'Koleksi pakaian pria berkualitas premium',
                'image'       => null,
                'icon'        => null,
                'type'        => 'retail',
                'is_logo'     => false,
            ],
            [
                'name'        => 'Elektronik',
                'slug'        => 'elektronik',
                'description' => 'Produk elektronik terbaru',
                'image'       => null,
                'icon'        => null,
                'type'        => 'retail',
                'is_logo'     => false,
            ],
            [
                'name'        => 'Semen',
                'slug'        => 'semen',
                'description' => 'Material semen untuk konstruksi',
                'image'       => null,
                'icon'        => null,
                'type'        => 'construction',
                'is_logo'     => false,
            ],
            [
                'name'        => 'Besi Beton',
                'slug'        => 'besi-beton',
                'description' => 'Besi untuk konstruksi bangunan',
                'image'       => null,
                'icon'        => null,
                'type'        => 'construction',
                'is_logo'     => false,
            ],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // === PRODUCTS + RELATIONS ===
        $products = [
            // Retail
            [
                'category_id'    => 1,
                'name'           => 'Kemeja Batik Premium',
                'slug'           => 'kemeja-batik-premium',
                'description'    => 'Kemeja batik berkualitas tinggi dengan motif tradisional',
                'price'          => 250000,
                'original_price' => 350000,
                'badge'          => 'Best Seller',
                'stock'          => 45,
                'images' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1764560348129-61acc431162d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRpayUyMHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NzQ5NDc0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080', 'is_primary' => true],
                ],
                'specifications' => [
                    ['property' => 'Ukuran', 'value' => 'M, L, XL'],
                    ['property' => 'Bahan',  'value' => 'Katun Premium'],
                ],
            ],
            // Construction
            [
                'category_id'    => 3,
                'name'           => 'Semen Portland 50kg',
                'slug'           => 'semen-portland-50kg',
                'description'    => 'Semen berkualitas tinggi untuk konstruksi',
                'price'          => 65000,
                'original_price' => null,
                'badge'          => null,
                'stock'          => 1000,
                'images' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1762380368593-a0d4c49af47f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzc0OTQ3NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'is_primary' => true],
                ],
                'specifications' => [
                    ['property' => 'Material', 'value' => 'Portland Composite Cement'],
                    ['property' => 'Grade',    'value' => 'Type I'],
                    ['property' => 'Berat',    'value' => '50 kg'],
                ],
            ],
        ];

        foreach ($products as $data) {
            $product = Product::create([
                'category_id'    => $data['category_id'],
                'name'           => $data['name'],
                'slug'           => $data['slug'],
                'description'    => $data['description'],
                'price'          => $data['price'],
                'original_price' => $data['original_price'],
                'badge'          => $data['badge'],
                'stock'          => $data['stock'],
            ]);

            foreach ($data['images'] as $img) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $img['image_path'],
                    'is_primary' => $img['is_primary'],
                ]);
            }

            foreach ($data['specifications'] as $spec) {
                ProductSpecification::create([
                    'product_id' => $product->id,
                    'property'   => $spec['property'],
                    'value'      => $spec['value'],
                ]);
            }
        }

        // 🔥 ENABLE FOREIGN KEY CHECKS kembali
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('✅ ProductSeeder selesai. Data Retail & Konstruksi sudah masuk ke database.');
    }
}
