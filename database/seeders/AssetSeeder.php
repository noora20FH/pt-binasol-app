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
        // Create Films
        $films = [
            [
                'title' => 'Anak Kolong',
                'genres' => 'Drama Remaja Romantis',
                'rating' => 7.5,
                'year' => 2024,
                'poster' => '/Asset/FILM/ANAK KOLONG.jpg',
                'banner' => '/Asset/FILM/ANAK KOLONG.jpg',
                'is_featured' => true,
                'description' => 'Anak Kolong menceritakan tentang seorang pemuda bernama Arya yang menolak mengikuti harapan ayahnya yang merupakan seorang tentara. Sang ayah memiliki harapan begitu besar kepada Arya untuk melanjutkan jenjang kariernya sebagai seorang tentara. Namun Arya menolak. Arya adalah sosok anak yang dididik dengan keras dan terus dibayang-bayangi dengan sang Ayah. Hingga akhirnya ia terjerumus kedalam kehidupan jalanan dan melakukan hal-hal yang membahayakan seperti balapan di jalan bahkan bertarung di jalanan. Ia kemudian bertemu dengan seorang gadis bernama Amira, yang merupakan putri dari atasan Ayahnya. Arya pun jatuh cinta pada gadis cantik itu. Namun ia harus bersaing dengan sahabatnya sendiri, Salim yang juga menyukai Amira.',
            ],
            [
                'title' => 'Korban Jatuh Tempo',
                'genres' => 'Komedi Horor',
                'rating' => 7.8,
                'year' => 2025,
                'poster' => '/Asset/FILM/KORBAN JATUH TEMPO (PINJOL).jpg',
                'banner' => '/Asset/FILM/KORBAN JATUH TEMPO (PINJOL).jpg',
                'is_featured' => true,
                'description' => 'Film ini mengangkat kisah Sondang, pemilik sebuah rumah kost yang hidup bersama para perantau asal Medan dan Bangka. Hidup mereka awalnya berjalan seperti biasa, hingga tragedi menimpa. Musdalifah, salah satu penghuni kost, mengakhiri hidupnya karena terlilit hutang dari pinjaman online. Sejak saat itu, segalanya berubah. Kematian Musdalifah bukan cuma meninggalkan duka, tapi juga membawa kekacauan yang bikin suasana kost jadi mencekam. Korban Jatuh Tempo menyajikan cerita yang dekat dengan kenyataan banyak orang, apalagi di tengah fenomena pinjol yang makin merajalela.',
            ],
            [
                'title' => 'Karunrung',
                'genres' => 'Horor Thriller',
                'rating' => 8.0,
                'year' => 2025,
                'poster' => '/Asset/FILM/KARUNRUNG.png',
                'banner' => '/Asset/FILM/KARUNRUNG.png',
                'is_featured' => true,
                'description' => 'Di tengah hiruk-pikuk pasar tradisional Kota Makassar, sekelompok preman brutal yang dipimpin oleh Uli menebar teror dan rasa takut. Namun segalanya berubah ketika seorang pebisnis kaya bernama Hendra menawarkan pekerjaan kotor dengan imbalan besar kepada Uli dan kelompoknya. Pekerjaan yang awalnya tampak seperti urusan biasa berubah menjadi tragedi mengerikan. Sebuah pembantaian keji yang merenggut nyawa satu keluarga tak bersalah, termasuk seorang asisten rumah tangga yang bekerja di keluarga itu.',
            ],
            [
                'title' => 'Twist Stethoscope',
                'genres' => 'Drama Romantis',
                'rating' => 8.2,
                'year' => 2026,
                'poster' => '/Asset/FILM/TWIST STETHOSCOPE.png',
                'banner' => '/Asset/FILM/TWIST STETHOSCOPE.png',
                'is_featured' => true,
                'description' => 'Film Twist Stethoscope adalah film yang diangkat dari kisah nyata, novel karya by "Syahrul Sutte". Cerita ini merupakan kisah seorang mahasiswa kedokteran yang harus menghadapi keputusan darurat yang berdampak besar pada karier, masa depan, dan kehidupan pribadinya. Bukan hanya medis, tetapi juga tentang tekanan system, risiko hokum, dan konsekuensi sosial yang mengikutinya. Di tengah perjalanan karier yang penuh ujian itu, hadir pula kisah asmara yang tumbuh perlahan tenang, tulus, namun diuji oleh keadaan dan ketidakpastian masa depan.',
            ],
        ];

        foreach ($films as $film) {
            Film::firstOrCreate(['title' => $film['title']], $film);
        }

        // Create Product Categories
        $categories = [
            [
                'name' => 'Elroma™',
                'slug' => 'elroma-logo',
                'description' => 'Logo resmi dari Elroma - brand premium untuk produk kecantikan dan parfum.',
                'image' => '/Asset/Elroma Parfum/Logo Elroma',
                'type' => 'retail',
                'is_logo' => true,
            ],
            [
                'name' => 'Elforma Parfum',
                'slug' => 'elforma-parfum',
                'description' => 'Koleksi parfum premium dari Elforma dengan berbagai varian pilihan untuk kebutuhan sehari-hari dan acara spesial.',
                'image' => '/Asset/Elforma Parfum/Logo Parfum',
                'type' => 'retail',
                'is_logo' => false,
            ],
            [
                'name' => 'Juragan Medis',
                'slug' => 'juragan-medis',
                'description' => 'Produk kesehatan dan medis berkualitas tinggi untuk kebutuhan medis Anda dengan standar kesehatan internasional.',
                'image' => '/Asset/Juragan Medis/Logo Juragan Medis',
                'type' => 'retail',
                'is_logo' => false,
            ],
            [
                'name' => 'Magic Bean',
                'slug' => 'magic-bean',
                'description' => 'Produk inovatif dari Magic Bean dengan kualitas terbaik dan teknologi terdepan untuk kehidupan modern Anda.',
                'image' => '/Asset/Magic Bean/Logo',
                'type' => 'retail',
                'is_logo' => false,
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }

        // Get categories for product creation
        $elformaCategory = Category::where('slug', 'elforma-parfum')->first();
        $juraganCategory = Category::where('slug', 'juragan-medis')->first();
        $magicBeanCategory = Category::where('slug', 'magic-bean')->first();

        // Create sample products with asset images
        $this->createElformaProducts($elformaCategory);
        $this->createJuraganProducts($juraganCategory);
        $this->createMagicBeanProducts($magicBeanCategory);

        echo "✅ Asset seeding selesai!\n";
    }

    /**
     * Create Elforma Parfum products
     */
    private function createElformaProducts($category): void
    {
        $products = [
            [
                'name' => 'Elforma Parfum Premium Collection',
                'slug' => 'elforma-parfum-premium',
                'description' => 'Koleksi parfum premium dari Elforma dengan aroma yang tahan lama dan elegan untuk berbagai kesempatan.',
                'price' => 250000,
                'original_price' => 350000,
                'stock' => 50,
            ],
            [
                'name' => 'Elforma Signature Scent',
                'slug' => 'elforma-signature-scent',
                'description' => 'Aroma signature yang telah dipercaya pelanggan selama bertahun-tahun dengan formula khusus.',
                'price' => 180000,
                'original_price' => 250000,
                'stock' => 75,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::firstOrCreate(
                ['slug' => $productData['slug']],
                array_merge($productData, ['category_id' => $category->id])
            );

            // Add product images
            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/Asset/Elforma Parfum/Varian Parfum',
                ]);
            }
        }
    }

    /**
     * Create Juragan Medis products
     */
    private function createJuraganProducts($category): void
    {
        $products = [
            [
                'name' => 'Tes HIV & AIDS Profesional',
                'slug' => 'tes-hiv-aids',
                'description' => 'Layanan tes HIV dan AIDS yang profesional dengan hasil akurat dan terjaga kerahasiaannya.',
                'price' => 150000,
                'original_price' => 200000,
                'stock' => 100,
            ],
            [
                'name' => 'Tes Sifilis Lengkap',
                'slug' => 'tes-sifilis',
                'description' => 'Paket tes sifilis lengkap dengan teknologi terkini untuk diagnosis yang akurat.',
                'price' => 120000,
                'original_price' => 150000,
                'stock' => 80,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::firstOrCreate(
                ['slug' => $productData['slug']],
                array_merge($productData, ['category_id' => $category->id])
            );

            // Add product images
            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/Asset/Juragan Medis/Asset Produk',
                ]);
            }
        }
    }

    /**
     * Create Magic Bean products
     */
    private function createMagicBeanProducts($category): void
    {
        $products = [
            [
                'name' => 'Magic Bean Premium Package',
                'slug' => 'magic-bean-premium',
                'description' => 'Paket premium Magic Bean dengan berbagai pilihan dan benefit eksklusif untuk pelanggan setia.',
                'price' => 500000,
                'original_price' => 750000,
                'stock' => 30,
            ],
            [
                'name' => 'Magic Bean Standard Collection',
                'slug' => 'magic-bean-standard',
                'description' => 'Koleksi standar Magic Bean dengan harga terjangkau dan kualitas terjamin.',
                'price' => 250000,
                'original_price' => 350000,
                'stock' => 60,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::firstOrCreate(
                ['slug' => $productData['slug']],
                array_merge($productData, ['category_id' => $category->id])
            );

            // Add product images
            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/Asset/Magic Bean/Katalog',
                ]);
            }
        }
    }
}
