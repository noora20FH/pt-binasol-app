# 🏢 Corporate Website Project (v2.0)

Dokumentasi resmi untuk platform web perusahaan yang dibangun di atas **Laravel 12**. Project ini dirancang untuk skalabilitas, keamanan tingkat tinggi, dan kemudahan pemeliharaan jangka panjang.

---

## 🚀 Tech Stack

Project ini menggunakan kombinasi teknologi modern yang memastikan performa frontend yang reaktif namun tetap memiliki backend yang kokoh.

| Komponen | Teknologi | Keterangan |
| --- | --- | --- |
|**Environment**|	[PHP 8.3.9] |	Versi PHP stabil yang mendukung fitur readonly properties dan types yang lebih ketat.
| **Backend** | [Laravel 12](https://laravel.com) | Framework PHP terbaru dengan fitur keamanan dan performa tercanggih. |
| **Frontend** | [React.js](https://reactjs.org) | Library UI untuk antarmuka yang dinamis. |
| **Bridge** | [Inertia.js](https://inertiajs.com) | Menghubungkan Laravel & React tanpa kerumitan REST API tradisional. |
| **Starter Kit** | [Laravel Breeze](https://laravel.com/docs/starter-kits) | Sistem autentikasi siap pakai (Login, Register, Profile). |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Framework CSS untuk desain yang konsisten dan responsif. |

---

## 🛠️ Panduan Instalasi

Untuk menyiapkan lingkungan pengembangan, jalankan dua perintah utama berikut:

### 1. Scaffold Proyek Baru

Membuat proyek dengan Laravel 12 dan mengintegrasikan Laravel Breeze dengan stack React secara otomatis:

```bash
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

## 🏃 Cara Menjalankan Project

1. **Konfigurasi Environment:** Sesuaikan `.env` (Database, Mail, App URL).
2. **Migrasi Database:** `php artisan migrate`.
3. **Jalankan Server:**
* Terminal 1: `php artisan serve`
* Terminal 2: `npm run dev`



---

## 📝 Kontribusi

Silakan buat *Pull Request* atau hubungi departemen IT perusahaan untuk saran fitur baru.

