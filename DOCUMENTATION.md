# PT Bina Auto Solusi — Dokumentasi Lengkap

> Satu file dokumentasi untuk seluruh proyek. Mencakup struktur, fungsi, instalasi, API, CMS, dan panduan deployment.

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Folder](#3-struktur-folder)
4. [Database Schema](#4-database-schema)
5. [Instalasi & Setup](#5-instalasi--setup)
6. [Menjalankan Aplikasi](#6-menjalankan-aplikasi)
7. [Halaman Publik](#7-halaman-publik)
8. [CMS Admin](#8-cms-admin)
9. [API & Routes](#9-api--routes)
10. [Manajemen Aset & Gambar](#10-manajemen-aset--gambar)
11. [Fitur Lengkap](#11-fitur-lengkap)
12. [Perintah Berguna](#12-perintah-berguna)
13. [Deployment Produksi](#13-deployment-produksi)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Gambaran Umum

**PT Bina Auto Solusi** adalah platform web multi-lini bisnis yang mencakup:

| Lini Bisnis | Deskripsi |
|---|---|
| **Katalog Produk** | Produk retail & konstruksi dengan gambar, spesifikasi, harga |
| **Film & Entertainment** | Katalog film dan series dengan cast, episode, platform streaming |
| **Sewa Ruangan** | Halaman sewa ruangan meeting, conference, event space |
| **E-Commerce** | Keranjang belanja, order, integrasi Midtrans |
| **CMS Admin** | Dashboard kelola semua konten tanpa coding |

---

## 2. Tech Stack

| Komponen | Teknologi | Versi |
|---|---|---|
| Backend | Laravel | 12 |
| Frontend | React | 18.2 |
| Bridge | Inertia.js | 2.0 |
| Styling | Tailwind CSS | 3.2 |
| Icons | Lucide React | 0.263 |
| Database | MySQL | 8.0+ |
| Build Tool | Vite | 7.0 |
| PHP | PHP | 8.3+ |
| Node.js | Node.js | 18+ |

---

## 3. Struktur Folder

```
pt-binasol-app/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/                    ← Controller CMS (auth required)
│   │   │   │   ├── FilmController.php    ← CRUD film + upload poster/banner
│   │   │   │   ├── ProductController.php ← CRUD produk + upload gambar
│   │   │   │   ├── TeamMemberController.php ← CRUD tim + upload foto
│   │   │   │   ├── CarouselSlideController.php ← CRUD carousel + upload gambar
│   │   │   │   ├── OrderController.php   ← Lihat & hapus order
│   │   │   │   └── RoomController.php    ← CRUD ruangan + upload gambar
│   │   │   ├── AdminController.php       ← Dashboard admin
│   │   │   ├── HomeController.php        ← Halaman publik (home, about, contact)
│   │   │   ├── CategoryController.php    ← Kategori produk publik
│   │   │   ├── ProductController.php     ← Produk publik
│   │   │   ├── FilmController.php        ← Film publik
│   │   │   ├── RoomController.php        ← Sewa ruangan publik
│   │   │   ├── CartController.php        ← Keranjang belanja (session)
│   │   │   ├── OrderController.php       ← Order publik
│   │   │   ├── SitemapController.php     ← Sitemap XML untuk SEO
│   │   │   └── ...
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php ← Share auth & ziggy ke React
│   │   │   └── RedirectAdminToCms.php    ← Redirect admin ke /admin/dashboard
│   │   └── Requests/
│   │       └── Auth/LoginRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Category.php                  ← Kategori produk (retail/construction)
│   │   ├── Product.php                   ← Produk dengan relasi images, specs
│   │   ├── ProductImage.php              ← Gambar produk (multiple, is_primary)
│   │   ├── ProductSpecification.php      ← Spesifikasi produk
│   │   ├── Film.php                      ← Film/series
│   │   ├── Cast.php                      ← Pemain film
│   │   ├── Episode.php                   ← Episode series
│   │   ├── EpisodePlatform.php           ← Platform streaming per episode
│   │   ├── Order.php                     ← Order pelanggan
│   │   ├── OrderItem.php                 ← Item dalam order
│   │   ├── TeamMember.php                ← Anggota tim
│   │   ├── CarouselSlide.php             ← Slide carousel homepage
│   │   ├── Testimonial.php               ← Testimoni pelanggan
│   │   └── Room.php                      ← Ruangan sewa
│   └── Providers/
│       └── AppServiceProvider.php
│
├── database/
│   ├── migrations/                       ← 20 file migration
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── FilmSeeder.php
│   │   ├── MagicBeanProductSeeder.php
│   │   ├── AddCategoryImagesSeeder.php
│   │   ├── CreateFeaturedFilmsSeeder.php
│   │   └── UpdateFilmDataSeeder.php
│   └── factories/
│       └── UserFactory.php
│
├── resources/
│   ├── css/
│   │   ├── app.css                       ← Entry CSS + Tailwind
│   │   └── explicit.css                  ← Override styling khusus
│   ├── js/
│   │   ├── app.jsx                       ← Entry point React + Inertia
│   │   ├── ssr.jsx                       ← Entry point SSR
│   │   ├── bootstrap.js                  ← Axios setup
│   │   ├── Layouts/
│   │   │   ├── AdminLayout.jsx           ← Layout CMS admin (sidebar + header)
│   │   │   ├── PublicLayout.jsx          ← Layout publik (nav + footer)
│   │   │   ├── AuthenticatedLayout.jsx   ← Layout user login
│   │   │   └── GuestLayout.jsx           ← Layout tamu (login/register)
│   │   ├── Components/
│   │   │   ├── Navigation.jsx            ← Navbar publik (sticky, mobile-friendly)
│   │   │   ├── Footer.jsx                ← Footer publik
│   │   │   ├── Button.jsx                ← Komponen tombol
│   │   │   ├── admin/
│   │   │   │   ├── FilmForm.jsx          ← Form tambah/edit film (Inertia useForm)
│   │   │   │   ├── DataTable.jsx         ← Tabel admin versi lama
│   │   │   │   └── ConstructionProductForm.jsx ← Form produk konstruksi
│   │   │   └── cms/
│   │   │       └── DataTable.jsx         ← Tabel CMS dengan search & pagination
│   │   ├── Pages/
│   │   │   ├── Home.jsx                  ← Beranda (carousel, produk, film)
│   │   │   ├── About.jsx                 ← Tentang kami + tim
│   │   │   ├── Contact.jsx               ← Kontak + form
│   │   │   ├── Dashboard.jsx             ← Dashboard user biasa
│   │   │   ├── SewaRuangan.jsx           ← Halaman sewa ruangan publik
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.jsx         ← Dashboard CMS admin
│   │   │   │   ├── FilmManagement.jsx    ← Kelola film
│   │   │   │   ├── ProductManagement.jsx ← Kelola produk retail/konstruksi
│   │   │   │   ├── OrderManagement.jsx   ← Kelola order
│   │   │   │   ├── TeamManagement.jsx    ← Kelola tim
│   │   │   │   ├── CarouselManagement.jsx ← Kelola carousel
│   │   │   │   └── RoomManagement.jsx    ← Kelola ruangan sewa
│   │   │   ├── Auth/                     ← Login, Register, Reset Password
│   │   │   ├── Cart/Index.jsx            ← Halaman keranjang
│   │   │   ├── Categories/
│   │   │   │   ├── Index.jsx             ← Daftar kategori
│   │   │   │   └── Show.jsx              ← Detail kategori + produk
│   │   │   ├── Films/
│   │   │   │   ├── Index.jsx             ← Daftar film & series (tab)
│   │   │   │   └── Show.jsx              ← Detail film + cast + episode
│   │   │   ├── Products/
│   │   │   │   ├── Index.jsx             ← Daftar produk + search
│   │   │   │   └── Show.jsx              ← Detail produk + gambar + spesifikasi
│   │   │   └── Profile/                  ← Edit profil user
│   │   └── Utils/
│   │       ├── Helpers.js                ← Fungsi utilitas (format, validasi, dll)
│   │       └── Seo.jsx                   ← Komponen SEO (meta, OG, schema.org)
│   └── views/
│       └── app.blade.php                 ← Template Blade utama
│
├── routes/
│   ├── web.php                           ← Semua route web
│   └── auth.php                          ← Route autentikasi
│
├── public/
│   ├── logo.png                          ← Logo PT Binasol
│   ├── Logo PT Binasol.png               ← Logo alternatif
│   ├── favicon.ico
│   ├── robots.txt
│   ├── storage -> storage/app/public     ← Symlink untuk akses gambar
│   └── build/                            ← Asset hasil build Vite
│
├── storage/
│   └── app/public/
│       ├── films/posters/                ← Poster & banner film
│       ├── products/                     ← Gambar produk
│       │   ├── magic-bean/
│       │   ├── elforma-parfum/
│       │   └── juragan-medis/
│       ├── team/                         ← Foto anggota tim
│       ├── carousel/                     ← Gambar carousel
│       └── rooms/                        ← Foto ruangan
│
├── .env                                  ← Konfigurasi environment
├── .env.example                          ← Template environment
├── composer.json                         ← Dependensi PHP
├── package.json                          ← Dependensi Node.js
├── tailwind.config.js                    ← Konfigurasi Tailwind
├── vite.config.js                        ← Konfigurasi Vite
├── DOCUMENTATION.md                      ← File ini
└── README.md                             ← Ringkasan proyek
```

---

## 4. Database Schema

### Tabel & Fungsinya

| Tabel | Fungsi | Relasi |
|---|---|---|
| `users` | Akun pengguna & admin | - |
| `categories` | Kategori produk (retail/construction) | hasMany products |
| `products` | Produk dengan harga & stok | belongsTo category, hasMany images/specs |
| `product_images` | Gambar produk (multiple, ada primary) | belongsTo product |
| `product_specifications` | Spesifikasi detail produk | belongsTo product |
| `films` | Film & series dengan metadata | hasMany casts, episodes |
| `casts` | Pemain film | belongsTo film |
| `episodes` | Episode series | belongsTo film, hasMany platforms |
| `episode_platforms` | Link streaming per episode | belongsTo episode |
| `orders` | Order pelanggan + Midtrans token | hasMany items |
| `order_items` | Item dalam order (snapshot harga) | belongsTo order, product |
| `team_members` | Anggota tim perusahaan | - |
| `carousel_slides` | Slide carousel homepage | - |
| `testimonials` | Testimoni pelanggan | belongsTo product (opsional) |
| `rooms` | Ruangan yang bisa disewa | - |

### Kolom Penting

**products**
```
id, category_id, name, slug, description, price, original_price,
badge, stock, softDeletes, timestamps
```

**films**
```
id, title, description, genres, rating, year,
poster (path), banner (path), is_featured, softDeletes, timestamps
```

**rooms**
```
id, name, type, capacity, size, description,
image (path), price_unit, facilities (JSON), is_active,
order_priority, softDeletes, timestamps
```

**carousel_slides**
```
id, title, subtitle, image (path), link, theme (light/dark),
softDeletes, timestamps
```

---

## 5. Instalasi & Setup

### Prasyarat
- PHP 8.3+
- Composer 2+
- Node.js 18+
- MySQL 8.0+

### Langkah Instalasi

```bash
# 1. Clone & masuk folder
git clone <repo-url> pt-binasol-app
cd pt-binasol-app

# 2. Install dependensi
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate
```

### Konfigurasi `.env`

```env
APP_NAME="PT Bina Auto Solusi"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=binasol
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
```

### Setup Database

```bash
# Buat database MySQL
mysql -u root -p -e "CREATE DATABASE binasol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Jalankan semua migration
php artisan migrate

# (Opsional) Isi data awal
php artisan db:seed --class=FilmSeeder
php artisan db:seed --class=MagicBeanProductSeeder
```

### Storage Link (wajib untuk gambar)

```bash
php artisan storage:link
```

Perintah ini membuat symlink `public/storage` → `storage/app/public` sehingga gambar yang diupload bisa diakses dari browser.

---

## 6. Menjalankan Aplikasi

```bash
# Terminal 1 — Laravel server
php artisan serve

# Terminal 2 — Vite dev server (hot reload)
npm run dev
```

Buka browser: **http://127.0.0.1:8000**

### Build untuk Produksi

```bash
npm run build
php artisan optimize
```

---

## 7. Halaman Publik

| URL | Halaman | Controller | Fungsi |
|---|---|---|---|
| `/` | Beranda | `HomeController@index` | Carousel, produk unggulan, film, testimoni |
| `/categories` | Kategori | `CategoryController@index` | Grid semua kategori |
| `/categories/{slug}` | Detail Kategori | `CategoryController@show` | Produk dalam kategori |
| `/products` | Produk | `ProductController@index` | Grid produk + search |
| `/products/{slug}` | Detail Produk | `ProductController@show` | Gambar, spesifikasi, add to cart |
| `/films` | Film & Series | `FilmController@index` | Tab semua/film/series |
| `/films/{id}` | Detail Film | `FilmController@show` | Sinopsis, cast, episode, platform |
| `/sewa-ruangan` | Sewa Ruangan | `RoomController@index` | Carousel ruangan, grid, fasilitas |
| `/about` | Tentang Kami | `HomeController@about` | Profil perusahaan, tim |
| `/contact` | Kontak | `HomeController@contact` | Form kontak |
| `/cart` | Keranjang | `CartController@viewCart` | Isi keranjang belanja |
| `/sitemap.xml` | Sitemap | `SitemapController@index` | SEO sitemap otomatis |

---

## 8. CMS Admin

Semua halaman admin memerlukan login. Admin diarahkan otomatis ke `/admin/dashboard` saat login.

### Cara Buat Akun Admin

```bash
php artisan tinker
>>> App\Models\User::create([
...   'name' => 'Admin',
...   'email' => 'admin@binasol.com',
...   'password' => bcrypt('password123'),
...   'role' => 'admin',
...   'email_verified_at' => now(),
... ]);
```

### Halaman CMS

| URL | Halaman | Fungsi |
|---|---|---|
| `/admin/dashboard` | Dashboard | Statistik & ringkasan |
| `/admin/films` | Manajemen Film | CRUD film, cast, episode, platform streaming |
| `/admin/retail-products` | Produk Retail | CRUD produk retail + gambar + spesifikasi |
| `/admin/construction-products` | Produk Konstruksi | CRUD produk konstruksi + gambar |
| `/admin/orders` | Pesanan | Lihat semua order, detail, hapus |
| `/admin/team-members` | Tim | CRUD anggota tim + foto |
| `/admin/carousel-slides` | Carousel | CRUD slide homepage + gambar |
| `/admin/rooms` | Sewa Ruangan | CRUD ruangan + foto + fasilitas |

### Cara Upload Gambar di CMS

1. Buka halaman CMS yang sesuai (Film, Produk, Tim, dll)
2. Klik **Tambah** atau **Edit**
3. Pilih file gambar dari komputer (JPG/PNG/WebP, maks 2-4MB)
4. Klik **Simpan**

Gambar otomatis disimpan ke `storage/app/public/{folder}/` dan bisa diakses via URL `/storage/{folder}/namafile.jpg`.

---

## 9. API & Routes

### Route Publik

```
GET  /                          → Beranda
GET  /categories                → Daftar kategori
GET  /categories/{slug}         → Detail kategori
GET  /products                  → Daftar produk
GET  /products/{slug}           → Detail produk
GET  /films                     → Daftar film & series
GET  /films/{id}                → Detail film
GET  /sewa-ruangan              → Halaman sewa ruangan
GET  /about                     → Tentang kami
GET  /contact                   → Halaman kontak
POST /contact                   → Kirim pesan kontak
GET  /sitemap.xml               → Sitemap SEO
```

### Route Keranjang (JSON API)

```
GET  /cart                      → Halaman keranjang
GET  /cart/data                 → Data keranjang (JSON)
POST /cart/add                  → Tambah produk ke keranjang
POST /cart/remove               → Hapus produk dari keranjang
POST /cart/update               → Update jumlah produk
POST /cart/clear                → Kosongkan keranjang
```

**Contoh request tambah ke keranjang:**
```javascript
fetch('/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
  },
  body: JSON.stringify({ product_id: 1, quantity: 2 }),
});
```

### Route Admin (Perlu Login)

```
GET    /admin/dashboard
GET    /admin/films
POST   /admin/films
PUT    /admin/films/{id}
DELETE /admin/films/{id}

GET    /admin/retail-products
GET    /admin/construction-products
POST   /admin/products
PUT    /admin/products/{id}
DELETE /admin/products/{id}
DELETE /admin/product-images/{id}

GET    /admin/orders
DELETE /admin/orders/{id}

GET    /admin/team-members
POST   /admin/team-members
POST   /admin/team-members/{id}    ← POST dengan _method spoofing
DELETE /admin/team-members/{id}

GET    /admin/carousel-slides
POST   /admin/carousel-slides
POST   /admin/carousel-slides/{id}
DELETE /admin/carousel-slides/{id}

GET    /admin/rooms
POST   /admin/rooms
POST   /admin/rooms/{id}
DELETE /admin/rooms/{id}
```

---

## 10. Manajemen Aset & Gambar

### Struktur Penyimpanan

```
storage/app/public/
├── films/
│   └── posters/          ← Poster & banner film (upload via CMS)
├── products/
│   ├── magic-bean/       ← Gambar produk Magic Bean
│   ├── elforma-parfum/   ← Gambar produk Elforma Parfum
│   └── juragan-medis/    ← Gambar produk Juragan Medis
├── team/                 ← Foto anggota tim
├── carousel/             ← Gambar slide carousel
└── rooms/                ← Foto ruangan sewa
```

### Cara Akses Gambar

Gambar yang disimpan di `storage/app/public/` diakses via:
```
http://domain.com/storage/films/posters/namafile.jpg
```

Di PHP (controller):
```php
Storage::url($film->poster)
// Menghasilkan: /storage/films/posters/namafile.jpg
```

Di React (frontend):
```jsx
<img src={film.poster} alt={film.title} />
// film.poster sudah berisi URL lengkap dari controller
```

### Jika Gambar Tidak Muncul

```bash
# Pastikan symlink sudah dibuat
php artisan storage:link

# Cek apakah symlink ada
ls -la public/storage
```

---

## 11. Fitur Lengkap

### Frontend Publik
- ✅ Beranda dengan carousel otomatis, produk unggulan, film, testimoni
- ✅ Katalog produk dengan search dan pagination
- ✅ Detail produk: galeri gambar (swipe, lightbox, zoom), spesifikasi, add to cart
- ✅ Katalog film & series dengan tab filter
- ✅ Detail film: sinopsis, cast, episode, link streaming
- ✅ Halaman sewa ruangan dengan carousel hero dan grid ruangan
- ✅ Keranjang belanja berbasis session
- ✅ Form kontak dengan validasi
- ✅ Sitemap XML otomatis untuk SEO
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Lazy loading gambar

### CMS Admin
- ✅ Dashboard dengan statistik
- ✅ CRUD Film + upload poster/banner + cast + episode + platform streaming
- ✅ CRUD Produk Retail + upload multiple gambar + spesifikasi
- ✅ CRUD Produk Konstruksi + upload gambar
- ✅ CRUD Ruangan Sewa + upload foto + manajemen fasilitas
- ✅ CRUD Anggota Tim + upload foto
- ✅ CRUD Carousel Slide + upload gambar
- ✅ Lihat & hapus Order
- ✅ Sidebar navigasi dengan active state
- ✅ Search & pagination di semua tabel

### Keamanan
- ✅ CSRF protection di semua form
- ✅ SQL injection prevention via Eloquent ORM
- ✅ Autentikasi via Laravel Breeze
- ✅ Middleware redirect admin ke CMS
- ✅ Soft deletes untuk semua konten
- ✅ Mass assignment protection

### SEO
- ✅ Meta title & description per halaman
- ✅ Open Graph tags
- ✅ Schema.org JSON-LD
- ✅ Sitemap XML dinamis
- ✅ robots.txt
- ✅ URL slug yang bersih

---

## 12. Perintah Berguna

```bash
# Clear semua cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Lihat semua route
php artisan route:list

# Lihat route admin saja
php artisan route:list --path=admin

# Reset database (hati-hati: hapus semua data)
php artisan migrate:fresh

# Jalankan seeder tertentu
php artisan db:seed --class=FilmSeeder
php artisan db:seed --class=MagicBeanProductSeeder

# Buat storage symlink
php artisan storage:link

# Tinker (console interaktif)
php artisan tinker

# Build frontend
npm run build

# Cek syntax PHP
php -l app/Http/Controllers/Admin/FilmController.php
```

---

## 13. Deployment Produksi

```bash
# 1. Set environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com

# 2. Install dependensi tanpa dev
composer install --no-dev --optimize-autoloader

# 3. Build frontend
npm run build

# 4. Jalankan migration
php artisan migrate --force

# 5. Buat storage link
php artisan storage:link

# 6. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Konfigurasi Nginx

```nginx
server {
    listen 80;
    server_name domain-anda.com;
    root /var/www/pt-binasol/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    }
}
```

### Permission Storage

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 14. Troubleshooting

| Masalah | Solusi |
|---|---|
| Gambar tidak muncul | Jalankan `php artisan storage:link` |
| Port 8000 sudah dipakai | `php artisan serve --port=8001` |
| Error koneksi MySQL | Pastikan MySQL berjalan, cek `.env` |
| Node modules error | `rm -rf node_modules && npm install` |
| Composer error | `composer dump-autoload` |
| CSRF token mismatch | `php artisan cache:clear` |
| Permission denied storage | `chmod -R 755 storage bootstrap/cache` |
| Build error Vite | Cek console, pastikan tidak ada TypeScript syntax di file `.jsx` |

### Cek Log Error

```bash
# Laravel log
tail -f storage/logs/laravel.log

# Atau lihat 50 baris terakhir
Get-Content storage/logs/laravel.log -Tail 50  # Windows
tail -50 storage/logs/laravel.log              # Linux/Mac
```

