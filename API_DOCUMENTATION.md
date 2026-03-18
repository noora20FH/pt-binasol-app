# API Documentation - PT Bina Auto Solusi

Complete API reference for the PT Bina Auto Solusi application.

## Base URL

```
Development: http://127.0.0.1:8000
Production:  https://binasol.com (example)
```

## Authentication

The application uses **session-based authentication** with Laravel Breeze.

### Login
```
POST /login
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=password
```

Response: Session cookie + redirect to dashboard

### Logout
```
POST /logout
```

---

## Public Endpoints

All requests return HTML responses (Inertia.js pages).

### 1. Homepage

```
GET /
Response: Renders Home.jsx with:
- Carousel slides
- Featured categories
- Featured products
- Featured films
- Testimonials
- Team members
```

**Response Data:**
```php
[
    'slides' => Collection,        // CarouselSlides
    'categories' => Collection,    // Top 6 categories with products
    'featuredProducts' => Collection, // Products with badge='featured'
    'featuredFilms' => Collection,    // Films with is_featured=true
    'testimonials' => Collection,     // Latest 6 testimonials
    'teamMembers' => Collection,      // Team members by order
]
```

### 2. Products

#### List All Products
```
GET /products
Response: Renders Products/Index.jsx with:
- Product grid
- Category filter
- Search functionality
- Sorting options
- Pagination
```

**Query Parameters:**
```
?category=1                    # Filter by category
?search=shirt                  # Search products
?sort=newest|price_asc|price_desc
?page=1
```

**Response Data:**
```php
[
    'products' => Paginated collection,
    'categories' => All categories,
]
```

#### Get Product Details
```
GET /products/{slug}
Response: Renders Products/Show.jsx with:
- Full product details
- Image gallery
- Specifications
- Related products
- Reviews/testimonials
```

**Response Data:**
```php
[
    'product' => Product model with relations,
    'relatedProducts' => Similar products,
]
```

#### Search Products
```
GET /products/search?q=keyword
Response: JSON array of matching products
```

### 3. Categories

#### List Categories
```
GET /categories
Response: Renders Categories/Index.jsx with:
- Category cards
- Product counts
```

**Response Data:**
```php
[
    'categories' => All categories,
]
```

#### Get Category Details
```
GET /categories/{slug}
Response: Renders Categories/Show.jsx with:
- Category information
- Products in category
- Filtering options
```

**Response Data:**
```php
[
    'category' => Category model,
    'products' => Paginated products,
]
```

### 4. Films

#### List Films
```
GET /films
Response: Renders Films/Index.jsx with:
- Film grid
- Posters and ratings
- Quick view buttons
```

**Response Data:**
```php
[
    'films' => Paginated films,
]
```

#### Get Film Details
```
GET /films/{id}
Response: Renders Films/Show.jsx with:
- Film information
- Poster and rating
- Cast members
- Episodes with platforms
```

**Response Data:**
```php
[
    'film' => Film model with casts and episodes,
]
```

### 5. About

```
GET /about
Response: Renders About.jsx with:
- Company description
- Team members
```

**Response Data:**
```php
[
    'teamMembers' => All team members,
]
```

### 6. Contact

#### View Contact Form
```
GET /contact
Response: Renders Contact.jsx
```

#### Submit Contact Form
```
POST /contact
Content-Type: application/json
X-CSRF-Token: {token}

{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "subject": "Product Inquiry",
    "message": "I would like to know more about product X"
}
```

**Response:** Redirect with success/error message

**Validation Rules:**
```php
[
    'name' => 'required|string|max:255',
    'email' => 'required|email',
    'phone' => 'nullable|string|max:20',
    'subject' => 'required|string|max:255',
    'message' => 'required|string',
]
```

### 7. Sitemap

```
GET /sitemap.xml
Response: XML sitemap for SEO

<urlset>
    <url>
        <loc>http://binasol.com/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ...
</urlset>
```

---

## Shopping Cart API (JSON)

Cart operations use JSON API instead of Inertia.

### Get Cart
```
GET /cart/data
Response:
{
    "items": [
        {
            "id": 1,
            "name": "Product Name",
            "price": 150000,
            "quantity": 2,
            "image": "/storage/images/product.jpg",
            "total": 300000
        }
    ],
    "total": 300000,
    "count": 1
}
```

### View Cart Page
```
GET /cart
Response: Renders Cart/Index.jsx with cart contents
```

### Add to Cart
```
POST /cart/add
Content-Type: application/json
X-CSRF-Token: {token}

{
    "product_id": 1,
    "quantity": 2
}
```

**Response:**
```json
{
    "success": true,
    "message": "Produk berhasil ditambahkan ke keranjang",
    "cart": {
        "1": 2
    }
}
```

**Validation:**
```php
[
    'product_id' => 'required|exists:products,id',
    'quantity' => 'required|integer|min:1',
]
```

### Remove from Cart
```
POST /cart/remove
Content-Type: application/json
X-CSRF-Token: {token}

{
    "product_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": "Produk dihapus dari keranjang",
    "cart": {}
}
```

### Update Cart Quantity
```
POST /cart/update
Content-Type: application/json
X-CSRF-Token: {token}

{
    "product_id": 1,
    "quantity": 5
}
```

**Response:**
```json
{
    "success": true,
    "message": "Keranjang diperbarui",
    "cart": {
        "1": 5
    }
}
```

### Clear Cart
```
POST /cart/clear
X-CSRF-Token: {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Keranjang dikosongkan"
}
```

---

## Admin Endpoints (Protected)

All admin endpoints require authentication. Status codes:
- `200` - Success
- `201` - Created
- `422` - Validation error
- `404` - Not found
- `401` - Unauthorized

### Products

#### Create Product
```
POST /admin/products
Content-Type: application/json
X-CSRF-Token: {token}
Authorization: User must be authenticated

{
    "name": "Product Name",
    "slug": "product-name",
    "category_id": 1,
    "price": 150000,
    "original_price": 200000,
    "description": "Product description",
    "stock": 100,
    "badge": "featured",
    "weight": "1kg",
    "dimensions": "10x10x10cm"
}
```

**Response:** 201 Created + Product data

#### Update Product
```
PATCH /admin/products/{id}
Content-Type: application/json
X-CSRF-Token: {token}

{
    "name": "Updated Name",
    "price": 175000,
    ...
}
```

**Response:** 200 OK + Updated product

#### Delete Product
```
DELETE /admin/products/{id}
X-CSRF-Token: {token}
```

**Response:** 200 OK + Success message

### Categories

#### Create Category
```
POST /admin/categories
Content-Type: application/json
X-CSRF-Token: {token}

{
    "name": "Category Name",
    "slug": "category-name",
    "description": "Category description",
    "image_url": "/storage/categories/image.jpg"
}
```

#### Update Category
```
PATCH /admin/categories/{id}
Content-Type: application/json
X-CSRF-Token: {token}

{
    "name": "Updated Name",
    ...
}
```

#### Delete Category
```
DELETE /admin/categories/{id}
X-CSRF-Token: {token}
```

### Films

#### Create Film
```
POST /admin/films
Content-Type: application/json
X-CSRF-Token: {token}

{
    "title": "Film Title",
    "slug": "film-title",
    "description": "Film description",
    "rating": 8.5,
    "year": 2024,
    "genres": ["Action", "Adventure"],
    "poster_url": "/storage/films/poster.jpg",
    "is_featured": true
}
```

#### Update Film
```
PATCH /admin/films/{id}
Content-Type: application/json
X-CSRF-Token: {token}
```

#### Delete Film
```
DELETE /admin/films/{id}
X-CSRF-Token: {token}
```

### Orders

#### List Orders
```
GET /admin/orders
Response: Renders Orders index with:
- All orders
- Status filtering
- Pagination
```

#### Get Order Details
```
GET /admin/orders/{id}
Response: Order details with:
- Items
- Customer info
- Payment status
- Optional items
```

#### Create Order
```
POST /admin/orders
Content-Type: application/json
X-CSRF-Token: {token}

{
    "user_id": 1,
    "status": "pending",
    "total_price": 300000,
    "items": [
        {
            "product_id": 1,
            "quantity": 2,
            "price": 150000
        }
    ]
}
```

#### Update Order Status
```
PATCH /admin/orders/{id}
Content-Type: application/json
X-CSRF-Token: {token}

{
    "status": "completed",
    "midtrans_transaction_id": "12345"
}
```

**Allowed Statuses:**
- `pending` - Waiting for payment
- `completed` - Payment received
- `cancelled` - Order cancelled

#### Delete Order
```
DELETE /admin/orders/{id}
X-CSRF-Token: {token}
```

### Team Members

#### List Team Members
```
GET /admin/team-members
Response: Team members list with pagination
```

#### Create Team Member
```
POST /admin/team-members
Content-Type: application/json
X-CSRF-Token: {token}

{
    "name": "Member Name",
    "position": "Position Title",
    "image_url": "/storage/team/member.jpg",
    "order_priority": 1,
    "email": "member@example.com",
    "phone": "081234567890"
}
```

#### Update Team Member
```
PATCH /admin/team-members/{id}
Content-Type: application/json
X-CSRF-Token: {token}
```

#### Delete Team Member
```
DELETE /admin/team-members/{id}
X-CSRF-Token: {token}
```

### Carousel Slides

#### List Carousel Slides
```
GET /admin/carousel-slides
Response: Carousel slides list
```

#### Create Slide
```
POST /admin/carousel-slides
Content-Type: application/json
X-CSRF-Token: {token}

{
    "title": "Slide Title",
    "description": "Slide description",
    "image_url": "/storage/carousel/image.jpg",
    "theme": "light",          # or "dark"
    "link_url": "/products",
    "display_order": 1
}
```

#### Update Slide
```
PATCH /admin/carousel-slides/{id}
Content-Type: application/json
X-CSRF-Token: {token}
```

#### Delete Slide
```
DELETE /admin/carousel-slides/{id}
X-CSRF-Token: {token}
```

### Testimonials

#### List Testimonials
```
GET /admin/testimonials
Response: Testimonials list with moderation status
```

#### Create Testimonial
```
POST /admin/testimonials
Content-Type: application/json
X-CSRF-Token: {token}

{
    "product_id": 1,
    "customer_name": "Customer Name",
    "rating": 5,
    "comment": "Great product!",
    "is_approved": false
}
```

**Rating Scale:** 1-5 stars

#### Update Testimonial
```
PATCH /admin/testimonials/{id}
Content-Type: application/json
X-CSRF-Token: {token}

{
    "is_approved": true
}
```

#### Delete Testimonial
```
DELETE /admin/testimonials/{id}
X-CSRF-Token: {token}
```

---

## Error Responses

### Validation Error (422)
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

### Not Found (404)
```json
{
    "message": "Not found."
}
```

### Unauthorized (401)
```json
{
    "message": "Unauthenticated."
}
```

### Server Error (500)
```json
{
    "message": "Server error"
}
```

---

## Rate Limiting

No explicit rate limiting configured. For production, consider adding:

```php
// In routes/web.php
Route::middleware('throttle:60,1')->group(function () {
    // routes
});
```

---

## CORS

CORS is not enabled. For API-only use cases, configure in `config/cors.php`.

---

## Pagination

List endpoints support pagination:

```
GET /products?page=1&per_page=15
Response includes:
{
    "data": [...],
    "links": {
        "first": "...",
        "last": "...",
        "prev": "...",
        "next": "..."
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "path": "/products",
        "per_page": 15,
        "to": 15,
        "total": 75
    }
}
```

---

## Filtering & Searching

### Product Filter
```
GET /products?category=2&sort=price_asc
```

### Search
```
GET /products/search?q=shirt&category=1
```

---

## Required Headers

```
X-Requested-With: XMLHttpRequest
X-CSRF-Token: (from meta tag or cookie)
Content-Type: application/json
```

---

## CSRF Token

Get CSRF token from:
1. Meta tag: `<meta name="csrf-token" content="...">`
2. Cookie: `XSRF-TOKEN`

Include in every POST/PATCH/DELETE request as `X-CSRF-Token` header.

---

## Session Management

Session cookie is automatically managed by Laravel. For JavaScript:

```javascript
// Get CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

// Fetch API request
fetch('/cart/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({
        product_id: 1,
        quantity: 2,
    }),
    credentials: 'include',  // Important for cookies
});
```

---

## Testing Endpoints

### Using cURL
```bash
# Get product
curl http://127.0.0.1:8000/products/product-slug

# Add to cart
curl -X POST http://127.0.0.1:8000/cart/add \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -d '{"product_id": 1, "quantity": 2}'
```

### Using Postman
1. Import endpoints from this documentation
2. Add CSRF token to Pre-request Script
3. Set Body to JSON format
4. Include X-CSRF-Token in Headers

---

## Webhooks

Currently not implemented. Future consideration for:
- Order status changes
- Payment confirmations
- Product updates

---

## Version History

- **v1.0.0** (2024-03-17)
  - Initial release
  - 13 tables, 13 models
  - 9 controllers
  - Complete shopping cart
  - Contact form
  - Admin dashboard

---

**Last Updated:** 2024-03

For questions, refer to DEPLOYMENT_GUIDE.md or INSTALLATION.md
