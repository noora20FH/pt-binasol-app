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
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RoomController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes (guests & customers)
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/', [HomeController::class, 'index'])
    ->middleware('redirect.admin.cms')
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

// Sewa Ruangan
Route::get('/sewa-ruangan', [RoomController::class, 'index'])->name('rooms.index');

// Shopping Cart
Route::get('/cart', [CartController::class, 'viewCart'])->name('cart.view');
Route::get('/cart/data', [CartController::class, 'getCart'])->name('cart.get');
Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
Route::post('/cart/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
Route::post('/cart/update', [CartController::class, 'updateCart'])->name('cart.update');
Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

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
    Route::resource('admin/films', \App\Http\Controllers\Admin\FilmController::class)
        ->names('admin.films');

    // === Products (Retail & Construction) ===
    Route::get('/admin/retail-products', [\App\Http\Controllers\Admin\ProductController::class, 'index'])
        ->defaults('type', 'retail')
        ->name('admin.retail-products');
    Route::get('/admin/construction-products', [\App\Http\Controllers\Admin\ProductController::class, 'index'])
        ->defaults('type', 'construction')
        ->name('admin.construction-products');
    Route::post('/admin/products', [\App\Http\Controllers\Admin\ProductController::class, 'store'])
        ->name('admin.products.store');
    Route::put('/admin/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'update'])
        ->name('admin.products.update');
    Route::delete('/admin/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy'])
        ->name('admin.products.destroy');
    Route::delete('/admin/product-images/{image}', [\App\Http\Controllers\Admin\ProductController::class, 'destroyImage'])
        ->name('admin.product-images.destroy');

    // === Orders ===
    Route::get('/admin/orders', [\App\Http\Controllers\Admin\OrderController::class, 'index'])
        ->name('admin.orders');
    Route::delete('/admin/orders/{order}', [\App\Http\Controllers\Admin\OrderController::class, 'destroy'])
        ->name('admin.orders.destroy');

    // === Team Members ===
    Route::get('/admin/team-members', [\App\Http\Controllers\Admin\TeamMemberController::class, 'index'])
        ->name('admin.team-members');
    Route::post('/admin/team-members', [\App\Http\Controllers\Admin\TeamMemberController::class, 'store'])
        ->name('admin.team-members.store');
    Route::post('/admin/team-members/{teamMember}', [\App\Http\Controllers\Admin\TeamMemberController::class, 'update'])
        ->name('admin.team-members.update');
    Route::delete('/admin/team-members/{teamMember}', [\App\Http\Controllers\Admin\TeamMemberController::class, 'destroy'])
        ->name('admin.team-members.destroy');

    // === Carousel Slides ===
    Route::get('/admin/carousel-slides', [\App\Http\Controllers\Admin\CarouselSlideController::class, 'index'])
        ->name('admin.carousel-slides');
    Route::post('/admin/carousel-slides', [\App\Http\Controllers\Admin\CarouselSlideController::class, 'store'])
        ->name('admin.carousel-slides.store');
    Route::post('/admin/carousel-slides/{carouselSlide}', [\App\Http\Controllers\Admin\CarouselSlideController::class, 'update'])
        ->name('admin.carousel-slides.update');
    Route::delete('/admin/carousel-slides/{carouselSlide}', [\App\Http\Controllers\Admin\CarouselSlideController::class, 'destroy'])
        ->name('admin.carousel-slides.destroy');

    // === Sewa Ruangan (Room Management) ===
    Route::get('/admin/rooms', [\App\Http\Controllers\Admin\RoomController::class, 'index'])
        ->name('admin.rooms');
    Route::post('/admin/rooms', [\App\Http\Controllers\Admin\RoomController::class, 'store'])
        ->name('admin.rooms.store');
    Route::post('/admin/rooms/{room}', [\App\Http\Controllers\Admin\RoomController::class, 'update'])
        ->name('admin.rooms.update');
    Route::delete('/admin/rooms/{room}', [\App\Http\Controllers\Admin\RoomController::class, 'destroy'])
        ->name('admin.rooms.destroy');
});

require __DIR__ . '/auth.php';
