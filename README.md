# 🏢 PT Bina Auto Solusi Website

Platform e-commerce dan entertainment terpadu yang dibangun dengan **Laravel 12** dan **React.js**. Website ini menyediakan solusi lengkap untuk sektor konstruksi, retail, dan hiburan dengan fokus pada performa, SEO, dan responsivitas.

---

## 🎯 Fitur Utama

- **Catalog Produk**: Manajemen kategori dan produk dengan gambar multiple, spesifikasi detail
- **Film & Entertainment**: Pengelolaan film, episode, dan cast
- **Sistem Pembayaran**: Integrasi Midtrans untuk pembayaran online
- **Order Management**: Sistem order dengan status tracking
- **Team & Testimonial**: Manajemen tim dan testimoni pelanggan
- **SEO Optimized**: Sitemap dinamis, meta tags, Open Graph, Schema.org
- **Responsive Design**: Fully responsive untuk desktop, tablet, mobile
- **Admin Dashboard**: Interface lengkap untuk mengelola semua konten

---

## 🚀 Tech Stack

| Komponen | Teknologi | Keterangan |
| --- | --- | --- |
| **Backend** | [Laravel 12](https://laravel.com) | Framework PHP terbaru dengan fitur keamanan dan performa tercanggih |
| **Frontend** | [React.js](https://reactjs.org) | Library UI untuk antarmuka yang dinamis |
| **Bridge** | [Inertia.js](https://inertiajs.com) | Menghubungkan Laravel & React tanpa REST API |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Framework CSS responsive dengan tema orange-white |
| **Icons** | [Lucide React](https://lucide.dev) | Icon library modern |
| **Database** | MySQL/PostgreSQL | Relational database |
| **PHP** | 8.3+ | Versi PHP stabil |
| **Node.js** | 18+ | Runtime untuk Vite & asset compilation |

---

## 📊 Database Schemabash
laravel new pt-binasol-app --breeze --stack=react

```

### 2. Integrasi Server-side Inertia

Pastikan adapter server-side terpasang untuk mengelola pengiriman data dari Laravel ke komponen React:

```bash
composer require inertiajs/inertia-laravel

```

---

## 💡 Mengapa Laravel 12 Optimal untuk Perusahaan (±50 Karyawan)?

Mengelola infrastruktur IT untuk perusahaan menengah dengan sekitar **50 karyawan** memerlukan keseimbangan antara biaya operasional dan keandalan sistem. Berikut adalah alasan mengapa Laravel 12 adalah pilihan yang tepat:

### 1. Keamanan Data Perusahaan

Dengan 50 karyawan, risiko kebocoran data internal menjadi perhatian utama. Laravel 12 menyediakan perlindungan bawaan terhadap:

* **SQL Injection:** Melalui Eloquent ORM.
* **Cross-Site Request Forgery (CSRF):** Melalui Middleware otomatis.
* **Mass Assignment:** Melalui kebijakan `fillable/guarded` pada model.

### 2. Skalabilitas Internal (Resource Efficiency)

Untuk perusahaan ukuran ini, aplikasi biasanya mencakup sistem HR, manajemen cuti, atau CRM internal.

* **Laravel 12** dirancang untuk performa tinggi dengan manajemen memori yang jauh lebih efisien, memastikan sistem tetap ringan meski menangani traffic internal perusahaan yang padat.
* Implementasi **PHP 8.3.9** menjamin stabilitas sistem yang luar biasa dengan dukungan fitur modern (seperti Readonly Classes dan Typed Constants) yang mempercepat eksekusi kode secara signifikan tanpa mengorbankan keamanan.

### 3. Kemudahan Pemeliharaan (Maintenance)

Dengan tim IT yang mungkin tidak terlalu besar, standarisasi kode sangat penting.

* **Eloquent & Blade/Inertia:** Mengikuti pola *Model-View-Controller* (MVC) yang standar, sehingga jika ada pergantian developer atau penambahan anggota tim baru, proses *onboarding* akan jauh lebih cepat karena dokumentasi Laravel yang sangat lengkap.

### 4. Ekosistem Siap Pakai

Laravel 12 mendukung integrasi cepat untuk kebutuhan kantor seperti:

* **Notifications:** Mengirim slip gaji atau pengumuman via Email/Slack.
* **Excel Integration:** Mengimpor atau mengekspor data karyawan secara massal dengan Laravel Excel.
* **Task Scheduling:** Otomatisasi laporan bulanan setiap tanggal tertentu.

---

## 🛠️ Panduan Instalasi & Setup

### Prasyarat

- PHP 8.3+
- Node.js 18+
- MySQL/PostgreSQL
- Composer
- Git

### Langkah Instalasi

#### 1. Clone Repository dan Setup Environment

```bash
# Clone project
git clone <repository-url> pt-binasol-app
cd pt-binasol-app

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Install dependencies
composer install
npm install
```

#### 2. Konfigurasi Database

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pt_binasol
DB_USERNAME=root
DB_PASSWORD=
```

#### 3. Jalankan Migrations

```bash
php artisan migrate
```

Migrations akan membuat semua table sesuai dengan database schema yang telah kami siapkan.

#### 4. Build Assets & Start Server

**Terminal 1 - Laravel Development Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Development Server:**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:8000`

---

## 📁 Struktur Project

```
pt-binasol-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # All business logic controllers
│   │   ├── Middleware/           # Custom middleware
│   │   └── Requests/             # Form requests for validation
│   └── Models/                   # Eloquent models
├── database/
│   ├── migrations/               # Database migrations
│   ├── factories/                # Model factories for testing
│   └── seeders/                  # Database seeders
├── resources/
│   ├── css/                      # Tailwind CSS files
│   ├── js/
│   │   ├── Pages/                # React page components
│   │   ├── Components/           # Reusable React components
│   │   ├── Layouts/              # Layout components
│   │   └── Utils/                # Utility functions (SEO, helpers)
│   └── views/                    # Blade template
├── routes/
│   ├── web.php                   # Web routes
│   └── auth.php                  # Authentication routes
├── public/
│   └── sitemap.xml              # Dynamic sitemap for SEO
└── vite.config.js               # Vite configuration
```

---

## 📊 Database Schema

### Sektor Katalog
- **categories**: Kategori produk (construction/retail)
- **products**: Data produk dengan harga
- **product_specifications**: Spesifikasi detail produk
- **product_images**: Gambar produk dengan penanda primary

### Sektor Film & Entertainment
- **films**: Data film dengan metadata
- **casts**: Aktor dalam film
- **episodes**: Episode film
- **episode_platforms**: Platform streaming

### Sektor Pembayaran
- **orders**: Order dari pelanggan
- **order_items**: Item dalam order

### Konten Web
- **team_members**: Anggota tim dengan prioritas
- **carousel_slides**: Slide carousel di homepage
- **testimonials**: Testimoni pelanggan

---

## 🎨 Tema & Styling

Website menggunakan **Tailwind CSS** dengan palet warna orange dan putih:

- **Primary Color (Orange)**: `#f97316`
- **Secondary Color (Putih/Abu-abu)**: Grayscale
- **Responsive Design**: Mobile-first approach

Konfigurasi tema tersedia di `tailwind.config.js`

---

## 🔍 SEO Features

### Implementasi SEO

1. **Dynamic Sitemap**: `/sitemap.xml` - Auto-generated dari database
2. **Meta Tags**: Semua halaman memiliki meta description, OG tags
3. **Schema.org**: JSON-LD structured data untuk Organization
4. **Robots.txt**: Configured di `/public/robots.txt`

### SEO Utilities

File `resources/js/Utils/Seo.jsx` menyediakan:
- `useSeo()`: Hook untuk manage SEO meta tags
- `SeoHead`: Component untuk set head tags

---

## 📱 Responsive Design

Website fully responsive untuk:
- **Desktop**: 1024px dan keatas
- **Tablet**: 768px - 1023px
- **Mobile**: Kurang dari 768px

Menggunakan Tailwind responsive utilities: `sm:`, `md:`, `lg:`

---

## 🔐 Authentication & Authorization

Website dilengkapi dengan sistem autentikasi lengkap dari **Laravel Breeze**:

- User registration
- Login/Logout
- Email verification
- Password reset
- Profile management

Routes authenticated ada di middleware `auth` group.

---

## 🎯 Fitur Admin

Routes dengan prefix `/admin/` tersedia untuk manage:
- Produk & Kategori
- Film & Episode
- Order & Pembayaran
- Tim & Testimonial
- Carousel Slide

---

## 🚀 Production Deployment

### Persiapan

```bash
# Optimize for production
php artisan optimize:all

# Build assets
npm run build

# Set environment ke production
APP_ENV=production
APP_DEBUG=false
```

### Upload ke Server

1. Push ke repository
2. SSH ke server production
3. Pull latest code
4. Run migrations: `php artisan migrate --force`
5. Install composer: `composer install --no-dev`
6. Build assets: `npm run build`

---

## 📝 API Endpoints

### Public Endpoints
- `GET /` - Homepage
- `GET /categories` - List categories
- `GET /categories/{slug}` - Category detail
- `GET /products` - List products
- `GET /products/{slug}` - Product detail
- `GET /films` - List films
- `GET /films/{id}` - Film detail
- `GET /about` - About page
- `GET /contact` - Contact page
- `POST /contact` - Send contact message
- `GET /sitemap.xml` - SEO Sitemap

### Admin Endpoints (Authenticated)
- `POST /admin/products` - Create product
- `PATCH /admin/products/{id}` - Update product
- `DELETE /admin/products/{id}` - Delete product
- ...dan endpoints lainnya

---

## 🛠️ Development Commands

```bash
# Generate model with migration
php artisan make:model ModelName -m

# Generate controller
php artisan make:controller ControllerName

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh database
php artisan migrate:fresh

# Seed database
php artisan db:seed

# Tinker (interactive console)
php artisan tinker

# Build assets
npm run build

# Run development server
npm run dev
```

---

## 🐛 Troubleshooting

### Port 8000 sudah digunakan
```bash
php artisan serve --port=8001
```

### Permission denied pada storage/
```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

### Node.js modules error
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support & Contact

Untuk masalah teknis atau pertanyaan:
- Email: info@binaauto.com
- Phone: +62 123 456 7890

---

## 📄 License

Project ini dilindungi dan proprietary untuk PT Bina Auto Solusi.


Silakan buat *Pull Request* atau hubungi departemen IT perusahaan untuk saran fitur baru.

