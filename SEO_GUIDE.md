# 🔍 SEO Configuration Guide - PT Bina Auto Solusi

Panduan lengkap untuk mengoptimalkan SEO website PT Bina Auto Solusi.

---

## 🎯 SEO Features yang Sudah Diimplementasikan

### 1. **Dynamic Sitemap**
- **Link**: `/sitemap.xml`
- **Otomatis Generated**: Dari database (categories, products, films)
- **Update**: Real-time saat data berubah
- **Priority**: Berbeda untuk setiap tipe konten

**File**: `app/Http/Controllers/SitemapController.php`

### 2. **Meta Tags & Open Graph**
Setiap halaman memiliki:
- `<title>` - Page title dengan branding
- `<meta name="description">` - Meta description
- `<meta property="og:*">` - Open Graph tags untuk social media
- `<meta name="twitter:*">` - Twitter Card tags
- `<link rel="canonical">` - Canonical URLs

**File**: `resources/js/Utils/Seo.jsx`

### 3. **Schema.org Markup**
JSON-LD structured data untuk:
- Organization information
- Product schema
- Contact points

### 4. **Robots.txt**
- **Location**: `/public/robots.txt`
- **Disallow**: `/admin`, `/api`, `/dashboard`
- **Sitemap**: Reference ke `/sitemap.xml`

---

## 🛠️ Setup SEO

### Step 1: Update Meta Information

Edit `resources/js/Layouts/PublicLayout.jsx`:

```javascript
const siteName = 'PT Bina Auto Solusi';
const defaultImage = 'https://your-domain.com/og-image.jpg';
const domain = 'https://your-domain.com';
```

### Step 2: Google Search Console

1. Buka [Google Search Console](https://search.google.com/search-console)
2. Add property dengan domain Anda
3. Upload sitemap ke `/sitemap.xml`
4. Verify ownership

### Step 3: Google Analytics

1. Setup Google Analytics 4
2. Add tracking code ke `.env`:
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```
3. Tambahkan ke `resources/js/app.jsx`:
```javascript
// Google Analytics
import { useEffect } from 'react';
useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', process.env.REACT_APP_GA_ID);
}, []);
```

### Step 4: Meta Tags Setup per Page

Gunakan `SeoHead` component:

```javascript
import SeoHead from '@/Utils/Seo';

export default function ProductShow({ product }) {
    return (
        <SeoHead
            title={product.name}
            description={product.description}
            canonical={`/products/${product.slug}`}
            ogImage={product.images?.[0]?.image_path}
            ogType="product"
        >
            {/* Page content */}
        </SeoHead>
    );
}
```

---

## 📊 SEO Best Practices

### 1. **URL Structure**
✅ Gunakan slug yang deskriptif:
- `/products/nama-produk-deskriptif`
- `/categories/konstruksi`
- `/films/judul-film-lengkap`

❌ Hindari:
- `/product?id=123`
- `/index.php?page=product`

### 2. **Page Titles**
✅ Format: `[Page Name] - PT Bina Auto Solusi`
- Max 60 karakter
- Include keyword utama
- Unique untuk setiap halaman

Contoh:
- `Kategori Produk Konstruksi - PT Bina Auto Solusi`
- `Pompa Air 2000W - PT Bina Auto Solusi`

### 3. **Meta Descriptions**
✅ Deskripsi yang menarik dan informatif
- 150-160 karakter
- Include keyword
- Call-to-action

Contoh:
```
Jelajahi koleksi produk konstruksi berkualitas dari PT Bina Auto Solusi. 
Berbagai pilihan pompa, kabel, dan tools terlengkap dengan harga terbaik.
```

### 4. **Heading Structure**
✅ Gunakan H1, H2, H3 secara hierarki:
```
<h1>Nama Produk</h1>        {/* Satu per halaman */}
<h2>Deskripsi</h2>
<h2>Spesifikasi</h2>
  <h3>Tipe Spesifikasi</h3>
<h2>Produk Terkait</h2>
```

### 5. **Images**
✅ Optimasi gambar:
- Gunakan `alt` text yang deskriptif
- Compress ukuran file
- Gunakan WebP format

```jsx
<img 
    src="img.jpg" 
    alt="Pompa air 2000W warna merah dengan garansi 2 tahun"
/>
```

### 6. **Internal Linking**
✅ Link ke halaman terkait:
- Produk ke kategori
- Artikel ke produk relevan
- Homepage ke kategori featured

### 7. **Mobile Optimization**
✅ Website responsive (sudah implemented)
- Test di Google Mobile Friendly
- Page speed optimization

---

## 🚀 SEO Optimization Checklist

### On-Page SEO
- [ ] Page title unik dan deskriptif
- [ ] Meta description (150-160 char)
- [ ] H1 tag tunggal per halaman
- [ ] Alt text untuk semua gambar
- [ ] Internal links ke halaman relevan
- [ ] URL struktur clean & readable

### Technical SEO
- [ ] Sitemap.xml created & submitted
- [ ] Robots.txt configured
- [ ] Mobile responsive
- [ ] Page speed < 3 detik
- [ ] HTTPS enabled
- [ ] Structured data (Schema.org)

### Content SEO
- [ ] Unique content (tidak duplicate)
- [ ] Keyword research done
- [ ] Natural keyword placement
- [ ] Readability tinggi
- [ ] Call-to-action jelas

### Off-Page SEO
- [ ] Google Business Profile updated
- [ ] Social media linked
- [ ] External backlinks
- [ ] Social sharing buttons

---

## 📈 SEO Monitoring

### Tools untuk Monitoring

1. **Google Search Console**
   - Monitor search performance
   - Check indexing status
   - Fix crawl errors

2. **Google Analytics**
   - Track traffic sources
   - User behavior
   - Conversion tracking

3. **Ubersuggest / SEMrush**
   - Keyword ranking
   - Competitor analysis
   - Backlink analysis

### Weekly/Monthly Tasks

**Weekly:**
- Check Google Search Console for errors
- Review top performing keywords

**Monthly:**
- Analyze traffic trends
- Check backlink profile
- Update meta descriptions jika perlu

---

## 🔗 SEO URLs & Links Format

### Recommended URLs

```
Homepage:
https://your-domain.com/

Category:
https://your-domain.com/categories/konstruksi
https://your-domain.com/categories/ritel

Product:
https://your-domain.com/products/pompa-air-2000w
https://your-domain.com/products/kabel-listrik-4mm

Film:
https://your-domain.com/films/1
https://your-domain.com/films/judul-film

Static:
https://your-domain.com/about
https://your-domain.com/contact

Sitemap:
https://your-domain.com/sitemap.xml
```

---

## 💡 SEO Tips untuk Content Creation

### Product Descriptions
✅ Minimum 100 kata
✅ Include keyword alami
✅ Highlight unique features
✅ Include specifications
✅ Add call-to-action

### Category Descriptions
✅ Explain kategori
✅ List popular items
✅ Include benefits
✅ Link to featured products

### Blog/Article Content
✅ Minimum 1000 kata
✅ Comprehensive coverage
✅ Use headers structure
✅ Include images
✅ Internal links

---

## 🎓 Useful SEO Resources

1. [Google Search Central](https://developers.google.com/search)
2. [SEO Starter Guide](https://developers.google.com/search/docs/beginner)
3. [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)
4. [Yoast SEO](https://yoast.com/)

---

## ⚠️ Common SEO Mistakes to Avoid

❌ Duplicate content
❌ Keyword stuffing
❌ Poor mobile experience
❌ Slow page speed
❌ Broken links
❌ Poor image optimization
❌ No meta descriptions
❌ Unnatural linking
❌ Too many pop-ups
❌ Outdated content

---

## 📞 Support

Untuk pertanyaan SEO:
- Email: seo@binaauto.com
- Docs: [SEO Documentation]
- Support: +62 123 456 7890

---

**Last Updated**: March 2024
**Version**: 1.0
