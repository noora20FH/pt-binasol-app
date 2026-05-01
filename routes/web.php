<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\CarouselSlideController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AdminController;          // ← already added, good
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes (guests & customers)
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/', [HomeController::class, 'index'])
    ->middleware('redirect.admin.cms')           // ← middleware moved here
    ->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact', [HomeController::class, 'sendContact'])->name('contact.send');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// Products
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');

// Films
Route::get('/films', [FilmController::class, 'index'])->name('films.index');
Route::get('/films/{film}', [FilmController::class, 'show'])->name('films.show');

// Shopping Cart - Customer only
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/cart', [CartController::class, 'viewCart'])->name('cart.view');
    Route::get('/cart/data', [CartController::class, 'getCart'])->name('cart.get');
    Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::post('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
    Route::post('/cart/update', [CartController::class, 'updateCart'])->name('cart.update');
    Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');

    // Customer Orders
    Route::get('/orders', [OrderController::class, 'userOrders'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'userShow'])->name('orders.show');
});

// Dashboard & authenticated routes
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'redirect.admin.cms'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /* ======================== ADMIN SECTION ======================== */

    // Admin Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
        ->name('admin.dashboard');

    // === Perfilman (Film Management) ===
    Route::get('/admin/films', function () {
        return Inertia::render('Admin/FilmManagement');
    })->name('admin.films');

    // Retail & Construction Products (halaman yang sedang kamu kerjakan)
    Route::get('/admin/retail-products', function () {
        return Inertia::render('Admin/ProductManagement', ['type' => 'retail']);
    })->name('admin.retail-products');

    Route::get('/admin/construction-products', function () {
        return Inertia::render('Admin/ProductManagement', ['type' => 'construction']);
    })->name('admin.construction-products');

    Route::get('/admin/construction-products', function () {
        return Inertia::render('Admin/ProductManagement', ['type' => 'construction']);
    })->name('admin.construction-products');
    Route::get('/admin/orders', function () {
        return Inertia::render('Admin/OrderManagement');
    })->name('admin.orders');
    Route::get('/admin/team-members', function () {
        return Inertia::render('Admin/TeamManagement');
    })->name('admin.team-members');
    Route::get('/admin/carousel-slides', function () {
        return Inertia::render('Admin/CarouselManagement');
    })->name('admin.carousel-slides');


    // // Film CRUD
    // Route::post('/admin/films', [FilmController::class, 'store'])->name('films.store');
    // Route::patch('/admin/films/{film}', [FilmController::class, 'update'])->name('films.update');
    // Route::delete('/admin/films/{film}', [FilmController::class, 'destroy'])->name('films.destroy');

    // // Admin Routes - Categories
    // Route::post('/admin/categories', [CategoryController::class, 'store'])->name('categories.store');
    // Route::patch('/admin/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    // Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // // Admin Routes - Products
    // Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');
    // Route::patch('/admin/products/{product}', [ProductController::class, 'update'])->name('products.update');
    // Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // // Admin Routes - Orders

    // Route::patch('/admin/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    // Route::delete('/admin/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
    // Route::post('/admin/orders', [OrderController::class, 'store'])->name('orders.store');

    // // Admin Routes - Team Members

    // Route::post('/admin/team-members', [TeamMemberController::class, 'store'])->name('team-members.store');
    // Route::patch('/admin/team-members/{teamMember}', [TeamMemberController::class, 'update'])->name('team-members.update');
    // Route::delete('/admin/team-members/{teamMember}', [TeamMemberController::class, 'destroy'])->name('team-members.destroy');

    // // Admin Routes - Carousel Slides
    // Route::get('/admin/carousel-slides', [CarouselSlideController::class, 'index'])->name('carousel-slides.index');
    // Route::post('/admin/carousel-slides', [CarouselSlideController::class, 'store'])->name('carousel-slides.store');
    // Route::patch('/admin/carousel-slides/{carouselSlide}', [CarouselSlideController::class, 'update'])->name('carousel-slides.update');
    // Route::delete('/admin/carousel-slides/{carouselSlide}', [CarouselSlideController::class, 'destroy'])->name('carousel-slides.destroy');

    // // Admin Routes - Testimonials
    // Route::get('/admin/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
    // Route::post('/admin/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');
    // Route::patch('/admin/testimonials/{testimonial}', [TestimonialController::class, 'update'])->name('testimonials.update');
    // Route::delete('/admin/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');
});

require __DIR__ . '/auth.php';
