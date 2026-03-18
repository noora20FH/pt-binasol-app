# 🚀 Quick Start Guide - PT Bina Auto Solusi

Panduan cepat untuk memulai development PT Bina Auto Solusi.

---

## ⚡ 5-Minute Quick Start

### 1. Clone & Setup (2 minutes)

```bash
# Clone repository
git clone <repository-url> pt-binasol-app
cd pt-binasol-app

# Setup dependencies
composer install
npm install

# Generate keys
cp .env.example .env
php artisan key:generate
```

### 2. Database Setup (2 minutes)

```bash
# Configure .env
# Update: DB_DATABASE=pt_binasol
#         DB_USERNAME=root
#         DB_PASSWORD=

# Run migrations
php artisan migrate

# (Optional) Seed database with demo data
php artisan db:seed
```

### 3. Start Development Servers (1 minute)

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
npm run dev
```

✅ Website is now running at `http://localhost:8000`

---

## 📁 Project Structure Quick Reference

```
pt-binasol-app/
├── app/Models/                    # Database models
├── app/Http/Controllers/          # Request handlers
├── database/migrations/           # Schema definitions
├── resources/js/Pages/            # React page components
├── resources/js/Components/       # Reusable React components
├── routes/web.php                 # Route definitions
├── tailwind.config.js            # Theme configuration
└── .env                          # Configuration file
```

---

## 🎯 Common Development Tasks

### Adding a New Product

1. **Create in Admin Panel** (when built)
2. **Or use Tinker**:
```bash
php artisan tinker

> Category::first()->products()->create([
>   'name' => 'Produk Baru',
>   'slug' => 'produk-baru',
>   'price' => 50000,
> ])
```

### Creating a New Page

1. **Create React component** in `resources/js/Pages/YourPage.jsx`
2. **Create Laravel method** in appropriate controller
3. **Add route** in `routes/web.php`
4. **Return inertia** from controller

Example:
```php
// Controller
public function yourPage() {
    return inertia('YourPage', [
        'data' => $data,
    ]);
}

// Route
Route::get('/your-page', [YourController::class, 'yourPage']);
```

### Styling with Tailwind

```jsx
<div className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition">
    Button
</div>
```

Colors available:
- Primary: `primary-50` → `primary-900` (orange)
- Secondary: `secondary-50` → `secondary-900` (grayscale)

### Using Database Queries

```php
// Get all products with images
$products = Product::with('images')->paginate(12);

// Find by slug
$product = Product::where('slug', $slug)->firstOrFail();

// Filter
$products = Product::where('category_id', $id)
    ->where('stock', '>', 0)
    ->paginate();
```

---

## 🔧 Useful Commands

### Artisan Commands

```bash
# Create new model with migration
php artisan make:model ModelName -m

# Create new controller
php artisan make:controller ControllerName

# Create new migration
php artisan make:migration create_table_name_table

# Run all migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh database
php artisan migrate:fresh

# Database seeding
php artisan db:seed

# Interactive Tinker
php artisan tinker

# Clear cache
php artisan cache:clear

# Clear all caches
php artisan optimize:clear
```

### NPM Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Production preview
npm run preview
```

---

## 🐛 Troubleshooting Quick Tips

### "Port 8000 is already in use"
```bash
php artisan serve --port=8001
```

### "Command not found: php"
Add PHP to your PATH or use full path: `/usr/bin/php`

### "npm not installed"
Download from nodejs.org and install

### Database connection error
1. Check `.env` has correct credentials
2. Make sure MySQL is running
3. Verify database exists: `mysql -u root -e "CREATE DATABASE pt_binasol;"`

### Vite HMR issues
Edit `.env`:
```env
VITE_ASSET_URL=http://localhost:5173
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `.env` | Configuration (DB, app settings) |
| `routes/web.php` | All public routes |
| `tailwind.config.js` | Theme colors & styling |
| `resources/js/app.jsx` | React entry point |
| `app/Models/*.php` | Database models |
| `app/Http/Controllers/*.php` | Business logic |

---

## 🎓 Learning Path

1. **Understand Laravel Basics** (5 min)
   - Routes → Controllers → Views
   - Models → Migrations → Database

2. **Understand React Basics** (5 min)
   - Components → Props → State
   - Hooks (useState, useEffect)

3. **Inertia Bridge** (5 min)
   - How Laravel & React communicate
   - Passing data to React components

4. **Start Small** - Pick a simple feature:
   - Add new field to existing model
   - Create new page
   - Add UI component

---

## 🔐 Important Notes

⚠️ **Development Only** - These shouldn't be committed:
- `.env` file (use `.env.example`)
- `node_modules/` directory
- `vendor/` directory (install with composer)

✅ **Production Checklist**:
- Set `APP_DEBUG=false`
- Set `APP_ENV=production`
- Run `php artisan optimize:all`
- Run `npm run build`
- Update app URL in `.env`

---

## 📖 Documentation Links

- [README.md](README.md) - Full documentation
- [FEATURES.md](FEATURES.md) - All implemented features
- [SEO_GUIDE.md](SEO_GUIDE.md) - SEO configuration
- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) - Detailed env setup

---

## 💬 Need Help?

### Common Issues Solutions

**Q: How do I add a new page?**
A: Create `.jsx` file in `resources/js/Pages/`, add route, add controller method

**Q: How do I add styling?**
A: Use Tailwind classes. Edit `tailwind.config.js` for custom colors

**Q: How do I connect database?**
A: Migrations auto-create tables. Use models for queries

**Q: How do I deploy?**
A: See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) Production section

**Q: Where are the API endpoints?**
A: Routes defined in `routes/web.php`. Return `inertia()` from controllers

---

## 🎉 You're All Set!

Start building PT Bina Auto Solusi! 🚀

For detailed guidance, refer to:
- Laravel: https://laravel.com/docs
- React: https://reactjs.org
- Tailwind: https://tailwindcss.com
- Inertia: https://inertiajs.com

---

**Happy Coding!** 💻

---

*Last Updated: March 2024*
