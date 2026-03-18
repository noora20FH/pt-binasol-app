# Panduan Lengkap Setup & Deployment PT Bina Auto Solusi

Dokumen ini memberikan instruksi lengkap untuk setup, development, testing, dan deployment aplikasi PT Bina Auto Solusi.

## Daftar Isi
1. [Pre-Requisites](#pre-requisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Development Environment](#development-environment)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)
8. [Maintenance](#maintenance)

---

## Pre-Requisites

Pastikan sistem Anda memiliki komponen berikut:

### Software Requirements
- **PHP**: 8.3 atau lebih tinggi
- **Composer**: v2.0 atau lebih tinggi
- **Node.js**: v18.x atau lebih tinggi
- **npm**: v9.x atau lebih tinggi
- **MySQL**: 8.0 atau lebih tinggi
- **Git**: v2.30 atau lebih tinggi

### Recommended Tools
- **VSCode** dengan extensions:
  - Laravel Extension Pack (reckful.laravel-extension-pack)
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - PHP IntelliSense
  - Prettier - Code formatter
  - Thunder Client atau Postman (untuk API testing)

### System Requirements
- Minimum 2GB RAM
- 500MB disk space
- Windows 10+, macOS 10.15+, atau Linux (Ubuntu 18.04+)

---

## Initial Setup

### 1. Clone atau Extract Project
```bash
# Jika dari Git
git clone <repository-url>
cd pt-binasol-app

# Atau jika sudah extract dari ZIP file
cd pt-binasol-app-master
```

### 2. Install PHP Dependencies
```bash
composer install
```

Jika terjadi error, coba:
```bash
composer install --no-interaction
composer dump-autoload
```

### 3. Install Node Dependencies
```bash
npm install
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Copy dan Configure Environment
```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Application
APP_NAME="PT Bina Auto Solusi"
APP_ENV=local
APP_KEY=base64:xxxxxxxxxxxx (sudah di-generate)
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id

# Database (MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=binasol
DB_USERNAME=root
DB_PASSWORD=
(atau sesuaikan dengan MySQL user Anda)

# Cache & Session
CACHE_DRIVER=file
SESSION_DRIVER=cookie
QUEUE_CONNECTION=sync

# Mail Configuration (optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

# Midtrans Configuration (optional)
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_ENV=sandbox

# Google Analytics (optional)
GOOGLE_ANALYTICS_ID=

# Website Configuration
WEBSITE_DOMAIN=http://localhost:8000
WEBSITE_URL=http://localhost:8000
```

---

## Database Setup

### 1. Create MySQL Database

**Using MySQL Command Line:**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE binasol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Or using MySQL Workbench:**
1. Buka MySQL Workbench
2. Connect ke server MySQL Anda
3. Klik kanan pada "Databases" → "Create New Database"
4. Name: `binasol`
5. Charset: `utf8mb4`
6. Collation: `utf8mb4_unicode_ci`
7. Click "Apply"

### 2. Run Migrations

```bash
php artisan migrate
```

Expected output:
```
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (45.47ms)
Migrating: 2014_10_12_100000_create_password_resets_table
Migrated:  2014_10_12_100000_create_password_resets_table (32.15ms)
...
Migrating: 2026_03_17_000013_create_testimonials_table
Migrated:  2026_03_17_000013_create_testimonials_table (48.33ms)
```

### 3. (Optional) Seed Database

Jika ada seeder:
```bash
php artisan db:seed
```

### Verify Database

```bash
php artisan tinker
>>> \App\Models\User::count()
=> 0
>>> \App\Models\Product::count()
=> 0
```

---

## Development Environment

### 1. Start Development Server

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

Server akan berjalan di `http://127.0.0.1:8000`

**Terminal 2 - Vite Development Server:**
```bash
npm run dev
```

Vite akan berjalan di `http://127.0.0.1:5173`

Browser akan automatically open dengan HMR (Hot Module Replacement).

### 2. Verify Installation

1. Buka `http://127.0.0.1:8000` di browser
2. Anda seharusnya melihat homepage dengan:
   - Navigation bar dengan orange theme
   - Carousel slides
   - Kategori produk
   - Produk featured
   - Film featured

### 3. Create Test User

```bash
php artisan tinker
>>> \App\Models\User::create([
...   'name' => 'Admin',
...   'email' => 'admin@example.com',
...   'password' => bcrypt('password'),
... ])
```

Atau gunakan register page: `http://127.0.0.1:8000/register`

### 4. Optional: Create Sample Data

```bash
# Create 10 categories
php artisan tinker
>>> \App\Models\Category::factory(10)->create()
>>> \App\Models\Product::factory(50)->create()
>>> exit
```

---

## Testing

### 1. Run PHP Unit Tests
```bash
php artisan test
```

### 2. Test API Endpoints

**Using Thunder Client / Postman:**

#### Test Cart API
```
POST /cart/add
Content-Type: application/json
X-CSRF-Token: (get from page)

{
  "product_id": 1,
  "quantity": 2
}
```

Expected Response:
```json
{
  "success": true,
  "message": "Produk berhasil ditambahkan ke keranjang",
  "cart": {
    "1": 2
  }
}
```

#### Test Contact Form
```
POST /contact
Content-Type: application/x-www-form-urlencoded
X-CSRF-Token: (get from page)

name=John+Doe&email=john@example.com&phone=081234567890&subject=Inquiry&message=Halo
```

Expected Response: Redirect to previous page with success message

### 3. Test Frontend Features

**Homepage:**
- [ ] Navigation menu works
- [ ] Carousel slides navigate
- [ ] Add to cart buttons work
- [ ] Footer displays correctly

**Products:**
- [ ] Product list loads
- [ ] Product detail page shows images
- [ ] Add to cart increases quantity
- [ ] Price calculations correct

**Contact:**
- [ ] Form validates inputs
- [ ] Success message appears
- [ ] Form resets after submission

---

## Troubleshooting

### Issue: "SQLSTATE[HY000] [2002] No such file or directory"

**Solution:** MySQL server tidak running
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql@8.0

# Linux
sudo systemctl start mysql
```

### Issue: "Class not found" laravel errors

**Solution:** 
```bash
composer dump-autoload
php artisan cache:clear
```

### Issue: Vite not compiling assets

**Solution:**
```bash
npm run dev
# Or restart both servers
```

### Issue: Port 8000 already in use

**Solution:**
```bash
php artisan serve --port=8001
```

### Issue: Permission denied on storage folder

**Solution:** (Linux/macOS)
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### Issue: CSRF token mismatch

**Solution:** Clear session:
```bash
php artisan session:clear
```

---

## Production Deployment

### 1. Environment Setup

Update `.env` untuk production:

```env
APP_ENV=production
APP_DEBUG=false

# Strong database password
DB_PASSWORD=StrongPassword123!

# Use Redis atau file cache
CACHE_DRIVER=file

# Use database sessions untuk persistence
SESSION_DRIVER=file

# Email configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 2. Build Assets for Production

```bash
npm run build
```

Ini akan generate:
- `public/build/manifest.json`
- Optimized CSS file
- Optimized JavaScript file

### 3. Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 4. Database Migrations

```bash
php artisan migrate --force
```

### 5. Web Server Configuration

#### Apache (.htaccess already configured)
Pastikan `mod_rewrite` enabled:
```bash
a2enmod rewrite
systemctl restart apache2
```

#### Nginx
```nginx
server {
    listen 80;
    server_name binasol.com;
    root /var/www/pt-binasol/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### 6. SSL Certificate

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d binasol.com
```

### 7. Persistent Storage

Untuk production, gunakan proper storage:
```bash
# Create symbolic link untuk public storage
php artisan storage:link
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs: `storage/logs/laravel.log`
- Check database backups

**Weekly:**
- Check disk space
- Review security logs

**Monthly:**
- Update dependencies: `composer update`
- Update Node packages: `npm update`
- Backup database

### Useful Commands

```bash
# View logs
tail -f storage/logs/laravel.log

# Clear cache
php artisan cache:clear
php artisan config:clear

# Reset application
php artisan migrate:refresh --seed

# Database backup
mysqldump -u root -p binasol > backup_$(date +%Y%m%d_%H%M%S).sql

# Monitor performance
php artisan tinker
>>> \Illuminate\Support\Facades\DB::listen(fn($query) => dd($query))
```

---

## Security Checklist

- [ ] APP_DEBUG set to false
- [ ] APP_KEY generated
- [ ] CSRF protection enabled
- [ ] Environment variables secure
- [ ] Database credentials strong
- [ ] SSL certificate installed
- [ ] Regular backups configured
- [ ] Log files monitored
- [ ] SQL injection prevention (using ORM)
- [ ] XSS protection enabled

---

## Performance Optimization

### Caching
```bash
php artisan config:cache
php artisan route:cache
```

### Database Indexing
Sudah configured di migrations dengan proper foreign keys.

### Static Asset Versioning
Vite automatically handles with:
```blade
@vite('resources/js/app.jsx')
```

### Database Query Optimization
```php
// Use eager loading
Product::with('images', 'specifications')->get()

// Use select specific columns
Product::select('id', 'name', 'price')->get()
```

---

## Backup & Recovery

### Create Backup
```bash
# Database backup
mysqldump -u root -p binasol > backup_file.sql

# Full application backup (excluding node_modules)
tar --exclude='node_modules' --exclude='.git' -czf backup.tar.gz .
```

### Restore Backup
```bash
# Database restore
mysql -u root -p binasol < backup_file.sql

# Application restore
tar -xzf backup.tar.gz
composer install --optimize-autoloader
npm install
php artisan migrate
```

---

## Support & Resources

- **Laravel Docs**: https://laravel.com/docs/12.x
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Inertia.js**: https://inertiajs.com
- **Lucide Icons**: https://lucide.dev

---

**Contact PT Bina Auto Solusi untuk support lebih lanjut.**

Last Updated: 2024
