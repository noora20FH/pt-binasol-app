# INSTALLATION & QUICK START

## 🚀 Quick Setup (5 Minutes)

Follow these steps to get the PT Bina Auto Solusi application running locally.

### Step 1: Prerequisites Check

Verify you have installed:
```bash
php -v          # Should be 8.3 or higher
composer -V     # Should be v2.0 or higher
node -v         # Should be v18.x or higher
npm -v          # Should be v9.x or higher
mysql --version # Should be 8.0 or higher
```

### Step 2: Project Setup

```bash
# Navigate to project folder
cd pt-binasol-app-master

# 1. Copy environment file
cp .env.example .env

# 2. Generate application key
php artisan key:generate

# 3. Install PHP dependencies
composer install

# 4. Install Node.js dependencies
npm install
```

### Step 3: Database Configuration

**Create MySQL Database:**
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE binasol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Update .env Database Settings:**

Edit `.env` file and update:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=binasol
DB_USERNAME=root
DB_PASSWORD=          # Enter your MySQL password if you have one
```

### Step 4: Run Migrations

```bash
php artisan migrate
```

You should see output like:
```
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (45ms)
...
Migrating: 2026_03_17_000013_create_testimonials_table
Migrated:  2026_03_17_000013_create_testimonials_table (48ms)
```

### Step 5: Run Development Servers

**Terminal 1 - Start Laravel Server:**
```bash
php artisan serve
```

You'll see: `Application running on [http://127.0.0.1:8000]`

**Terminal 2 - Start Vite Dev Server:**
```bash
npm run dev
```

### Step 6: Open in Browser

Navigate to: **http://127.0.0.1:8000**

You should see the homepage with:
- Orange and white theme
- Navigation bar
- Carousel slides
- Featured products and films
- Contact section

---

## 📋 Important Features Now Available

✅ **Complete Product Catalog**
- Products with images and specifications
- Add to cart functionality
- Product filtering by category

✅ **Shopping Cart**
- Session-based cart system
- Add/remove products
- Update quantities
- View cart page at `/cart`

✅ **Films & Entertainment**
- Film catalog with ratings
- Cast information
- Episode details with platforms

✅ **Contact Form**
- Working contact form with validation
- Form submission notification
- Success/error messages

✅ **Admin Dashboard**
- Manage products, categories, films
- Team members management
- Carousel slides management
- Testimonials moderation

✅ **SEO Optimized**
- Dynamic sitemap at `/sitemap.xml`
- Meta tags and Open Graph support
- Robots.txt configured

---

## 🔑 API Endpoints

### Public Endpoints
```
GET  /                          # Homepage
GET  /products                  # All products
GET  /products/{slug}           # Product details
GET  /categories                # Categories
GET  /categories/{slug}         # Category products
GET  /films                     # Films
GET  /films/{id}                # Film details
GET  /about                     # About page
GET  /contact                   # Contact form
POST /contact                   # Submit contact
GET  /cart                      # View cart
GET  /sitemap.xml               # Sitemap for SEO
```

### Cart API (JSON)
```
GET  /cart/data                 # Get cart items
POST /cart/add                  # Add product to cart
POST /cart/remove               # Remove from cart
POST /cart/update               # Update quantity
POST /cart/clear                # Empty cart
```

### Admin Routes (Protected)
```
POST   /admin/products
PATCH  /admin/products/{id}
DELETE /admin/products/{id}

POST   /admin/categories
PATCH  /admin/categories/{id}
DELETE /admin/categories/{id}

POST   /admin/films
PATCH  /admin/films/{id}
DELETE /admin/films/{id}

POST   /admin/orders
GET    /admin/orders/{id}
PATCH  /admin/orders/{id}
DELETE /admin/orders/{id}

POST   /admin/team-members
PATCH  /admin/team-members/{id}
DELETE /admin/team-members/{id}

POST   /admin/carousel-slides
PATCH  /admin/carousel-slides/{id}
DELETE /admin/carousel-slides/{id}

POST   /admin/testimonials
PATCH  /admin/testimonials/{id}
DELETE /admin/testimonials/{id}
```

---

## 👤 Create Admin User (Optional)

```bash
php artisan tinker
```

Then run:
```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password123'),
    'email_verified_at' => now(),
]);
exit;
```

Or go to: http://127.0.0.1:8000/register

---

## 📁 Project Structure

```
pt-binasol-app-master/
├── app/
│   ├── Http/Controllers/         # All controllers (9)
│   ├── Models/                   # Eloquent models (13)
│   └── Providers/
├── database/
│   ├── migrations/               # Database tables (13)
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── Pages/                # React pages
│   │   ├── Layouts/              # Layout components
│   │   ├── Components/           # Reusable components
│   │   └── Utils/                # Utilities & helpers
│   ├── css/
│   └── views/
├── routes/
│   ├── web.php                   # Web routes (60+)
│   └── auth.php                  # Auth routes
├── config/                       # Laravel config
├── storage/                      # Logs, cache, sessions
├── public/                       # Web root
├── CHANGELOG.md                  # All changes documented
├── DEPLOYMENT_GUIDE.md           # Production deployment
└── .env.example                  # Environment template
```

---

## 🔧 Useful Commands

```bash
# Clear application caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Reset database
php artisan migrate:refresh

# View application logs
tail -f storage/logs/laravel.log

# Access Tinker console
php artisan tinker

# Production build
npm run build
php artisan optimize
```

---

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Start MySQL
mysql.server start          # macOS
sudo systemctl start mysql  # Linux
net start MySQL80           # Windows
```

### Port 8000 Already In Use
```bash
php artisan serve --port=8001
```

### Composer Issues
```bash
composer dump-autoload
composer install --no-interaction
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation Files

- **README.md** - Project overview
- **QUICKSTART.md** - Quick start guide
- **FEATURES.md** - Feature checklist
- **SEO_GUIDE.md** - SEO setup
- **ENVIRONMENT_SETUP.md** - Configuration
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **CHANGELOG.md** - All changes (complete)
- **INSTALLATION.md** - This file

---

## ✨ Features Highlights

### 🛍️ E-Commerce Ready
- Product catalog with 13 categories
- Shopping cart with session storage
- Price tracking and inventory management
- Product images and specifications

### 🎬 Entertainment Section
- Film catalog with ratings
- Cast management
- Episode information
- Streaming platform integration

### 📱 Responsive Design
- Mobile-first approach
- Works on all screen sizes (mobile, tablet, desktop)
- Touch-friendly interfaces
- Fast loading times

### 🔐 Security
- CSRF protection on all forms
- SQL injection prevention via ORM
- XSS protection
- Input validation
- Session management

### 🎨 Modern UI/UX
- Orange (#f97316) and white color scheme
- Smooth animations and transitions
- Intuitive navigation
- Accessibility ready

### ⚡ Performance
- Lightweight design
- Optimized images
- Efficient database queries
- Vite for fast builds

### 📈 SEO Optimized
- Dynamic XML sitemap
- Meta tags and Open Graph
- Twitter Card support
- Schema.org structured data
- robots.txt configured

---

## 🎯 Next Steps

1. ✅ Complete setup (this guide)
2. ✅ Add sample products using admin
3. ✅ Test shopping cart functionality
4. ✅ Configure email notifications
5. ✅ Setup Midtrans payment integration
6. ✅ Deploy to production

---

## 📞 Support

For issues or questions:
1. Check DEPLOYMENT_GUIDE.md troubleshooting section
2. Review application logs: `storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Review error messages carefully

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Products display correctly
- [ ] Categories filter works
- [ ] Add to cart works
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Database has 13 tables
- [ ] No errors in terminal
- [ ] CSS styling applied

---

**Status: ✅ Ready for Development & Production**

All 13 database tables created ✓
All 13 models configured ✓
All 9 controllers implemented ✓
All React pages built ✓
Shopping cart functional ✓
Contact form working ✓
SEO optimized ✓
100% MySQL compatible ✓

**Start developing now! 🚀**
