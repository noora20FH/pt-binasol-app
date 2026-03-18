# ⚙️ Environment Configuration Guide

Panduan lengkap untuk mengkonfigurasi environment PT Bina Auto Solusi.

---

## 📋 Essential Environment Variables

Copy `.env.example` ke `.env` dan sesuaikan dengan konfigurasi Anda:

```bash
cp .env.example .env
php artisan key: generate
```

### Application Settings

```env
APP_NAME="PT Bina Auto Solusi"
APP_ENV=local                          # local, staging, production
APP_KEY=                               # Generate dengan php artisan key:generate
APP_DEBUG=true                         # false di production
APP_URL=http://localhost:8000
APP_PORT=8000

# Timezone
APP_TIMEZONE=Asia/Jakarta

# Locale
APP_LOCALE=id
```

### Database Configuration

```env
DB_CONNECTION=mysql                    # mysql, pgsql, sqlite, sqlsrv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pt_binasol
DB_USERNAME=root
DB_PASSWORD=your_password

# Connection pooling (optional)
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Cache Settings

```env
CACHE_DRIVER=redis                     # redis, memcached, file, database
CACHE_PREFIX=pt_binasol_cache:
CACHE_TTL=3600

# Redis Configuration (if using Redis)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DATABASE=1
```

### Session Configuration

```env
SESSION_DRIVER=cookie                  # cookie, database, cookie, array
SESSION_LIFETIME=120                   # minutes
SESSON_DOMAIN=localhost
SESSION_SAME_SITE=lax
```

### Queue Configuration

```env
QUEUE_CONNECTION=sync                  # sync, database, redis, sqs
QUEUE_FAILED_TABLE=failed_jobs
```

### Mail Configuration

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io            # atau SMTP server lain
MAIL_PORT=465
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@binaauto.com"
MAIL_FROM_NAME="PT Bina Auto Solusi"
```

### AWS & File Storage

```env
FILESYSTEM_DISK=public                 # public, s3, local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket
AWS_USE_PATH_STYLE_ENDPOINTS=false
```

### Third-Party Services

```env
# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_MERCHANT_ID=your_merchant_id
MIDTRANS_ENV=sandbox              # sandbox atau production

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key
```

### SEO & Domain Settings

```env
WEBSITE_URL=https://your-domain.com
WEBSITE_TITLE="PT Bina Auto Solusi"
WEBSITE_DESCRIPTION="Penyedia solusi terbaik untuk sektor konstruksi dan ritel"

# OG Image
OG_IMAGE=https://your-domain.com/og-image.jpg
```

---

## 🔐 Security Settings

### Important for Production

```env
APP_DEBUG=false                        # NEVER set to true in production
APP_ENV=production

# Force HTTPS
SESSION_SECURE_COOKIES=true
SESSION_HTTP_ONLY=true

# CORS Settings
CORS_ALLOWED_ORIGINS="https://your-domain.com"
```

### API Keys Management

**Best Practices:**
1. Gunakan `.env` untuk production keys
2. Jangan push `.env` ke repository
3. Gunakan `.env.example` sebagai template
4. Rotate keys secara berkala
5. Gunakan different keys untuk staging/production

---

## 📦 Installation Environment Setup

### Step 1: Local Development

```bash
# Set environment
APP_ENV=local
APP_DEBUG=true

# Database local
DB_CONNECTION=mysql
DB_DATABASE=pt_binasol_local
DB_USERNAME=root
DB_PASSWORD=

# Cache
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

### Step 2: Staging/Testing

```bash
APP_ENV=staging
APP_DEBUG=true

DB_CONNECTION=mysql
DB_DATABASE=pt_binasol_staging
DB_USERNAME=staging_user
DB_PASSWORD=secure_password

# Use Redis for better performance
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Step 3: Production

```bash
APP_ENV=production
APP_DEBUG=false

# Secure database settings
DB_CONNECTION=mysql
DB_HOST=db.production.server
DB_USERNAME=prod_user
DB_PASSWORD=very_secure_password

# Production services
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
MAIL_MAILER=smtp
```

---

## 🚀 Deployment Environment Variables

### Using Environment Variables on Server

```bash
# SSH ke server
ssh user@your-server.com

# Set environment variables
export APP_ENV=production
export APP_DEBUG=false
export DB_PASSWORD=your_secure_password

# Or use .env file
cat > /var/www/pt-binasol-app/.env << EOF
APP_NAME="PT Bina Auto Solusi"
APP_ENV=production
APP_KEY=base64:...
...
EOF
```

### Using Docker (Optional)

```dockerfile
# .dockerignore
node_modules
storage/
.env

# Dockerfile
FROM php:8.3-fpm

# Set environment
ENV APP_ENV=production
ENV APP_DEBUG=false

# Copy .env
COPY .env /app/.env
```

---

## ✅ Configuration Checklist

### Pre-Launch Checklist

- [ ] `.env` configured correctly
- [ ] `APP_KEY` generated (`php artisan key:generate`)
- [ ] Database migrations run (`php artisan migrate`)
- [ ] Storage symlink created (`php artisan storage:link`)
- [ ] Permissions set correctly (`chmod -R 775 storage/ bootstrap/cache/`)
- [ ] Cache cleared (`php artisan cache:clear`)
- [ ] Config cached (`php artisan config:cache`)
- [ ] Routes cached (`php artisan route:cache`)
- [ ] Views cached (`php artisan view:cache`)
- [ ] SSL certificate installed
- [ ] Backups configured

### Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] `SESSION_SECURE_COOKIES=true`
- [ ] `SESSION_HTTP_ONLY=true`
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] CSRF protection enabled
- [ ] Headers security configured
- [ ] API authentication secured

---

## 🔄 Common Environment Configurations

### Development Setup

```env
APP_ENV=local
APP_DEBUG=true
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
MAIL_MAILER=log
```

### Local Testing

```env
APP_ENV=testing
APP_DEBUG=true
DB_DATABASE=pt_binasol_testing
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
```

### CI/CD Pipeline

```env
APP_ENV=testing
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=ci_database
```

---

## 📱 Environment-Specific URLs

### Development
- App: `http://localhost:8000`
- Vite: `http://localhost:5173`
- Database: `localhost:3306`

### Staging
- App: `https://staging.your-domain.com`
- API: `https://api-staging.your-domain.com`
- Database: `staging-db.internal`

### Production
- App: `https://your-domain.com`
- API: `https://api.your-domain.com`
- Database: `prod-db.internal`

---

## 🆘 Troubleshooting

### "No application encryption key has been specified"
```bash
php artisan key:generate
```

### Database connection error
- Check `.env` database credentials
- Verify database is running
- Check firewall rules
- Verify user permissions

### Permission denied errors
```bash
sudo chown -R www-data:www-data /var/www/pt-binasol-app
sudo chmod -R 775 storage/ bootstrap/cache/
```

### Cache/Config issues
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

---

## 📚 Reference Links

- [Laravel Configuration](https://laravel.com/docs/configuration)
- [Environment Security](https://laravel.com/docs/configuration#environment-variable-types)
- [Deployment Guide](https://laravel.com/docs/deployment)

---

**Last Updated**: March 2024
