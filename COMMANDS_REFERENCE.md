# Quick Commands Reference

## 🚀 Get Started Immediately

### Step 1: Setup (One-time)
```bash
cp .env.example .env
php artisan key:generate
composer install
npm install
```

### Step 2: Create Database
```bash
# Using command line
mysql -u root -p
CREATE DATABASE binasol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# OR using any MySQL GUI tool:
# Create database: binasol
# Charset: utf8mb4
# Collation: utf8mb4_unicode_ci
```

### Step 3: Configure .env
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=binasol
DB_USERNAME=root
DB_PASSWORD=          # If you have MySQL password, add it here
```

### Step 4: Run Migrations
```bash
php artisan migrate
```

### Step 5: Start Development

**Terminal 1:**
```bash
php artisan serve
```
→ Opens at http://127.0.0.1:8000

**Terminal 2:**
```bash
npm run dev
```
→ Vite hot reload server starts

---

## 📋 Daily Development Commands

### Clear All Caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Database Commands
```bash
php artisan migrate              # Run migrations
php artisan migrate:refresh      # Reset & run migrations
php artisan migrate:reset        # Clear all data
php artisan tinker               # PHP interactive console
```

### Create Test Data
```bash
php artisan tinker
>>> \App\Models\Product::factory(50)->create()
>>> \App\Models\Category::factory(10)->create()
>>> exit
```

### Create Admin User
```bash
php artisan tinker
>>> \App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password123'),
    'email_verified_at' => now(),
])
>>> exit
```

---

## 🔧 Frontend Commands

### Build for Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Check for Errors
```bash
npm run lint
```

---

## 📦 Dependency Management

### Install New Package
```bash
composer require package/name
npm install package-name
```

### Update All Packages
```bash
composer update
npm update
```

### Check Outdated Packages
```bash
composer outdated
npm outdated
```

---

## 🗄️ Database Management

### Backup Database
```bash
mysqldump -u root -p binasol > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
mysql -u root -p binasol < backup_file.sql
```

### Check Database Size
```bash
mysql -u root -p -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) 'Size in MB' FROM information_schema.TABLES WHERE table_schema = 'binasol';"
```

---

## 📝 Useful Laravel Commands

### Create New Model
```bash
php artisan make:model ModelName -m
```

### Create New Controller
```bash
php artisan make:controller ControllerName
```

### Create New Migration
```bash
php artisan make:migration create_table_name_table
```

### Route List
```bash
php artisan route:list
```

### Check Application Status
```bash
php artisan --version
php artisan env
pi artisan debugbar
```

---

## 🐛 Troubleshooting Commands

### Fix File Permissions (Linux/macOS)
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### Check PHP Configuration
```bash
php -v
php -m
php -i | grep mysql
```

### Check MySQL Connection
```bash
mysql -u root -p -e "SELECT VERSION();"
```

### See Application Logs
```bash
tail -f storage/logs/laravel.log
```

### Clear Old Sessions
```bash
php artisan session:table
php artisan migrate
```

---

## 🔍 Testing Commands

### Test Single Route
```bash
curl http://127.0.0.1:8000/
```

### Test Product Creation (with cURL)
```bash
curl -X POST http://127.0.0.1:8000/admin/products \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"name":"Product","price":100000}'
```

### Test Cart API
```bash
# Add to cart
curl -X POST http://127.0.0.1:8000/cart/add \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'

# Get cart
curl http://127.0.0.1:8000/cart/data
```

---

## 📁 File Navigation

### Important Files
```
.env                              # Environment config
.env.example                      # Example env config
routes/web.php                    # All routes
resources/js/Pages/              # React pages
app/Http/Controllers/            # Al controllers
app/Models/                       # All models
database/migrations/              # Database definitions
tailwind.config.js                # Tailwind theme
package.json                      # NPM packages
composer.json                     # PHP packages
```

### Log Files
```
storage/logs/laravel.log          # Application log
```

### Important Directories
```
storage/                          # Logs, cache, sessions
bootstrap/cache/                  # Cache files
public/                           # Web root
resources/js/                     # React source
resources/views/                  # Blade templates
database/migrations/              # Migrations
app/Models/                       # Models
app/Http/Controllers/            # Controllers
```

---

## 🌐 Useful URLs

### Development
```
http://127.0.0.1:8000/           Homepage
http://127.0.0.1:8000/products   All products
http://127.0.0.1:8000/cart       Shopping cart
http://127.0.0.1:8000/contact    Contact form
http://127.0.0.1:8000/about      About page
http://127.0.0.1:8000/register   Create account
http://127.0.0.1:8000/login      Login
http://127.0.0.1:8000/dashboard  Admin dashboard (protected)
```

### Special Pages
```
http://127.0.0.1:8000/sitemap.xml  XML sitemap
```

---

## 🔐 Security Commands

### Generate New Key
```bash
php artisan key:generate
```

### Clear Password Cache
```bash
php artisan cache:clear
```

### Refresh CSRF Tokens
```bash
php artisan migrate:refresh --seed
```

### Optimize for Production
```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📊 Performance Commands

### Check Database Queries
```bash
php artisan tinker
>>> \Illuminate\Support\Facades\DB::listen(fn($query) => dd($query->sql))
```

### Cache Query Results
```php
// In controller
$products = cache('products', function () {
    return Product::all();
});
```

### Monitor Application
```bash
php artisan telescope
```

---

## 🚢 Deployment Commands

### Build for Production
```bash
npm run build
php artisan migrate --force
php artisan optimize
```

### Start Production Server
```bash
php artisan serve --host=0.0.0.0 --port=80
```

### Check Health
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🎯 Most Common Daily Workflows

### Start Development
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev

# Visit http://127.0.0.1:8000
```

### Add New Product via CLI
```bash
php artisan tinker
>>> \App\Models\Product::create(['name' => 'New Product', ...])
>>> exit
```

### Test a Specific Route
```bash
curl http://127.0.0.1:8000/products
```

### Reset Everything (Development Only)
```bash
php artisan migrate:refresh --seed
npm run dev
php artisan serve
```

---

## 💡 Pro Tips

### 1. Use Aliases
```bash
# In .zshrc or .bashrc
alias artisan="php artisan"
alias sail="./vendor/bin/sail"

# Then use:
artisan serve
```

### 2. Keep Terminal Clean
```bash
# Clear terminal
clear

# See last 20 log lines
tail -20 storage/logs/laravel.log
```

### 3. Fast Development
```bash
# Watch for changes and auto-reload
npm run dev    # Does this automatically with Vite
```

### 4. Database Backups
```bash
# Daily backup script
mysqldump -u root -p binasol > backups/binasol_$(date +%Y%m%d).sql
```

---

## ❌ Common Issues & Fixes

### MySQL Connection Error
```bash
# Start MySQL
sudo systemctl start mysql    # Linux
brew services start mysql     # macOS
```

### Port 8000 in Use
```bash
php artisan serve --port=8001
```

### Composer Error
```bash
composer dump-autoload
composer require vendor/package
```

### Node Modules Issue
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Permission Denied
```bash
chmod -R 777 storage bootstrap/cache
```

---

## 📚 Documentation Reference

- **INSTALLATION.md** - Full installation guide
- **DEPLOYMENT_GUIDE.md** - Production setup
- **API_DOCUMENTATION.md** - All API endpoints
- **VERIFICATION_CHECKLIST.md** - Testing checklist
- **CHANGELOG.md** - All changes documented
- **SESSION_SUMMARY.md** - What was fixed

---

## 🚀 Ready to Go!

```bash
# Quick start (90 seconds)
cp .env.example .env
php artisan key:generate
composer install && npm install
# Create database: binasol
php artisan migrate
php artisan serve
# Open new terminal
npm run dev
# Visit http://127.0.0.1:8000
```

**You're all set! 🎉**
