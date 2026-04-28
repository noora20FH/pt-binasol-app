# PT Bina Auto Solusi

Platform web multi-lini bisnis untuk **PT Bina Auto Solusi** — mencakup katalog produk, film & entertainment, sewa ruangan, dan sistem e-commerce dengan CMS admin yang lengkap.

---

## Tech Stack

**Laravel 12** · **React 18** · **Inertia.js** · **Tailwind CSS** · **MySQL** · **Vite**

---

## Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🛍️ Katalog Produk | Retail & konstruksi, multi-gambar, spesifikasi, keranjang belanja |
| 🎬 Film & Series | Poster, cast, episode, link streaming per platform |
| 🏢 Sewa Ruangan | Carousel hero, grid ruangan, fasilitas, CTA pemesanan |
| 🛒 E-Commerce | Keranjang session, order, integrasi Midtrans |
| 🖥️ CMS Admin | CRUD semua konten + upload gambar langsung dari browser |
| 📱 Responsive | Mobile-first, berjalan di semua ukuran layar |
| 🔍 SEO | Sitemap XML, meta tags, Open Graph, Schema.org |

---

## Instalasi Cepat

```bash
# Clone & setup
git clone <repo-url> && cd pt-binasol-app
composer install && npm install
cp .env.example .env && php artisan key:generate

# Database
php artisan migrate
php artisan storage:link

# Jalankan
php artisan serve    # Terminal 1
npm run dev          # Terminal 2
```

Buka **http://127.0.0.1:8000**

---

## Struktur Halaman

**Publik:** `/` · `/products` · `/categories` · `/films` · `/sewa-ruangan` · `/about` · `/contact`

**Admin (login required):** `/admin/dashboard` · `/admin/films` · `/admin/retail-products` · `/admin/construction-products` · `/admin/rooms` · `/admin/orders` · `/admin/team-members` · `/admin/carousel-slides`

---

## Buat Akun Admin

```bash
php artisan tinker
>>> App\Models\User::create(['name'=>'Admin','email'=>'admin@binasol.com','password'=>bcrypt('password123'),'role'=>'admin','email_verified_at'=>now()]);
```

---

## Dokumentasi Lengkap

Lihat **[DOCUMENTATION.md](DOCUMENTATION.md)** untuk:
- Struktur folder lengkap & fungsi setiap file
- Schema database semua tabel
- Panduan upload & manajemen gambar
- Semua API routes
- Panduan deployment produksi
- Troubleshooting

---

## Kelebihan & Capaian

- **Full-stack terintegrasi** — Laravel & React terhubung via Inertia.js tanpa REST API terpisah
- **CMS siap pakai** — Admin bisa kelola semua konten (film, produk, ruangan, carousel, tim) langsung dari browser dengan upload gambar
- **Gambar terkelola** — Semua aset disimpan di `storage/app/public/` dan diakses via symlink, tidak tercampur dengan kode
- **14 tabel database** — Schema lengkap dengan soft deletes, relasi, dan foreign key
- **Multi-lini bisnis** — Satu platform untuk produk retail, konstruksi, film, dan sewa ruangan
- **Responsive & SEO-ready** — Mobile-first design, sitemap otomatis, meta tags lengkap
- **Keamanan bawaan** — CSRF, SQL injection prevention, autentikasi, middleware role admin

---

&copy; 2026 PT Bina Auto Solusi. All rights reserved.
