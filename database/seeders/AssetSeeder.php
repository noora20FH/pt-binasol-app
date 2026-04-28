<?php



namespace Database\Seeders;



use App\Models\Film;

use App\Models\Category;

use App\Models\Product;

use App\Models\ProductImage;

use Illuminate\Database\Seeder;

use Illuminate\Support\Str;



class AssetSeeder extends Seeder

{

    /**

     * Run the database seeds.

     */

    public function run(): void

    {
        \App\Models\CarouselSlide::firstOrCreate(
            ['title' => 'Solusi Terbaik Untuk Bisnis Anda'],
            [
                'subtitle' => 'Penyedia layanan konstruksi dan ritel terpercaya',
                'image' => '/FILM/TWIST STETHOSCOPE.png', // Mengambil asset yang sudah ada sebagai contoh
                'link' => '/products',
                'theme' => 'dark'
            ]
        );
        // Dummy Team Member
        \App\Models\TeamMember::firstOrCreate(
            ['name' => 'Admin Bina'],
            [
                'role' => 'Founder & CEO',
                'image' => '/Magic Bean/Logo/1.png',
                'order_priority' => 1
            ]
        );

        // Dummy Testimonial
        \App\Models\Testimonial::firstOrCreate(
            ['name' => 'Pelanggan Setia'],
            [
                'comment' => 'Produk dari Elforma Parfum sangat wangi dan tahan lama!',
                'rating' => 5,
                'image' => null
            ]
        );
        // Create Films (Disesuaikan dengan ekstensi tepat di folder /FILM)

        $films = [

            [

                'title' => 'Anak Kolong',

                'genres' => 'Drama Remaja Romantis',

                'rating' => 7.5,

                'year' => 2024,

                'poster' => '/FILM/ANAK KOLONG.jpg',

                'banner' => '/FILM/ANAK KOLONG.jpg',

                'is_featured' => true,

                'description' => 'Anak Kolong menceritakan tentang seorang pemuda bernama Arya yang menolak mengikuti harapan ayahnya yang merupakan seorang tentara...',

            ],

            [

                'title' => 'Korban Jatuh Tempo',

                'genres' => 'Komedi Horor',

                'rating' => 7.8,

                'year' => 2025,

                'poster' => '/FILM/KORBAN JATUH TEMPO (PINJOL).jpg',

                'banner' => '/FILM/KORBAN JATUH TEMPO (PINJOL).jpg',

                'is_featured' => true,

                'description' => 'Film ini mengangkat kisah Sondang, pemilik sebuah rumah kost yang hidup bersama para perantau asal Medan dan Bangka...',

            ],

            [

                'title' => 'Karunrung',

                'genres' => 'Horor Thriller',

                'rating' => 8.0,

                'year' => 2025,

                'poster' => '/FILM/KARUNRUNG.png',

                'banner' => '/FILM/KARUNRUNG.png',

                'is_featured' => true,

                'description' => 'Di tengah hiruk-pikuk pasar tradisional Kota Makassar, sekelompok preman brutal...',

            ],

            [

                'title' => 'Twist Stethoscope',

                'genres' => 'Drama Romantis',

                'rating' => 8.2,

                'year' => 2026,

                'poster' => '/FILM/TWIST STETHOSCOPE.png',

                'banner' => '/FILM/TWIST STETHOSCOPE.png',

                'is_featured' => true,

                'description' => 'Film Twist Stethoscope adalah film yang diangkat dari kisah nyata, novel karya by "Syahrul Sutte"...',

            ],

        ];



        foreach ($films as $film) {

            Film::firstOrCreate(['title' => $film['title']], $film);
        }



        // Create Product Categories (Menambahkan ekstensi file dan sub-folder yang tepat)

        $categories = [

            [

                'name' => 'Elroma™',

                'slug' => 'elroma-logo',

                'description' => 'Logo resmi dari Elroma - brand premium untuk produk kecantikan dan parfum.',

                'image' => '/Elforma Parfum/Logo Parfum/Salinan IMG-20260303-WA0013.jpg',

                'type' => 'retail',

                'is_logo' => true,

            ],

            [

                'name' => 'Elforma Parfum',

                'slug' => 'elforma-parfum',

                'description' => 'Koleksi parfum premium dari Elforma dengan berbagai varian pilihan.',

                'image' => '/Elforma Parfum/Logo Parfum/Salinan IMG-20260303-WA0010.jpg',

                'type' => 'retail',

                'is_logo' => false,

            ],

            [

                'name' => 'Juragan Medis',

                'slug' => 'juragan-medis',

                'description' => 'Produk kesehatan dan medis berkualitas tinggi untuk kebutuhan medis Anda.',

                'image' => '/Juragan Medis/Logo Juragan Medis/Logo Juragan Medis.png',

                'type' => 'retail',

                'is_logo' => false,

            ],

            [

                'name' => 'Magic Bean',

                'slug' => 'magic-bean',

                'description' => 'Produk inovatif dari Magic Bean dengan kualitas terbaik.',

                'image' => '/Magic Bean/Logo/1.png',

                'type' => 'retail',

                'is_logo' => false,

            ],

        ];



        foreach ($categories as $category) {

            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }



        $elformaCategory = Category::where('slug', 'elforma-parfum')->first();

        $juraganCategory = Category::where('slug', 'juragan-medis')->first();

        $magicBeanCategory = Category::where('slug', 'magic-bean')->first();



        $this->createElformaProducts($elformaCategory);

        $this->createJuraganProducts($juraganCategory);

        $this->createMagicBeanProducts($magicBeanCategory);



        echo "✅ Asset seeding selesai!\n";
    }



    private function createElformaProducts($category): void

    {

        $products = [

            [

                'name' => 'Elforma Parfum Premium Collection',

                'slug' => 'elforma-parfum-premium',

                'description' => 'Koleksi parfum premium dari Elforma...',

                'price' => 250000,

                'original_price' => 350000,

                'stock' => 50,

                'badge' => 'featured', // Ditambahkan agar muncul di Home.jsx featuredProducts

            ],

            [

                'name' => 'Elforma Vanilla Rose',

                'slug' => 'elforma-vanilla-rose',

                'description' => 'Aroma signature yang telah dipercaya pelanggan...',

                'price' => 180000,

                'original_price' => 250000,

                'stock' => 75,

                'badge' => 'featured',

            ],

        ];



        foreach ($products as $productData) {

            $product = Product::firstOrCreate(

                ['slug' => $productData['slug']],

                array_merge($productData, ['category_id' => $category->id])

            );



            if ($product->images()->count() === 0) {

                ProductImage::create([

                    'product_id' => $product->id,

                    'image_path' => '/Elforma Parfum/Varian Parfum/_Vanilla Rose.jpg',

                    'is_primary' => true

                ]);
            }
        }
    }



    private function createJuraganProducts($category): void

    {

        $products = [

            [

                'name' => 'Tes HIV & AIDS Profesional',

                'slug' => 'tes-hiv-aids',

                'description' => 'Layanan tes HIV dan AIDS yang profesional...',

                'price' => 150000,

                'original_price' => 200000,

                'stock' => 100,

                'badge' => 'featured',

            ],

        ];



        foreach ($products as $productData) {

            $product = Product::firstOrCreate(

                ['slug' => $productData['slug']],

                array_merge($productData, ['category_id' => $category->id])

            );



            if ($product->images()->count() === 0) {

                ProductImage::create([

                    'product_id' => $product->id,

                    'image_path' => '/Juragan Medis/Asset Produk/Salinan Tes HIV_Aids.jpg',

                    'is_primary' => true

                ]);
            }
        }
    }



    private function createMagicBeanProducts($category): void

    {

        $products = [

            [

                'name' => 'Magic Bean Premium Package',

                'slug' => 'magic-bean-premium',

                'description' => 'Paket premium Magic Bean...',

                'price' => 500000,

                'original_price' => 750000,

                'stock' => 30,

                'badge' => 'featured',

            ],

        ];



        foreach ($products as $productData) {

            $product = Product::firstOrCreate(

                ['slug' => $productData['slug']],

                array_merge($productData, ['category_id' => $category->id])

            );



            if ($product->images()->count() === 0) {

                ProductImage::create([

                    'product_id' => $product->id,

                    'image_path' => '/Magic Bean/Katalog/1.png',

                    'is_primary' => true

                ]);
            }
        }
    }
}
