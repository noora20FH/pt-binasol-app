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
use App\Http\Controllers\AdminController;          // ← already added, good
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
    Route::resource('admin/films', \App\Http\Controllers\Admin\AdminFilmController::class)
        ->names('admin.films');

    // === Retail & Construction Products (FULL CRUD) ===
    Route::prefix('admin')->name('admin.')->group(function () {
        // Index Pages
        Route::get('/retail-products', [\App\Http\Controllers\Admin\ProductController::class, 'indexRetail'])
             ->name('retail-products');

        Route::get('/construction-products', [\App\Http\Controllers\Admin\ProductController::class, 'indexConstruction'])
             ->name('construction-products');

        // CRUD Products
        Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'store'])
             ->name('products.store');

        Route::put('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'update'])
             ->name('products.update');

        Route::delete('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy'])
             ->name('products.destroy');
    });

    // === Lainnya ===
    Route::get('/admin/orders', function () {
        return Inertia::render('Admin/OrderManagement');
    })->name('admin.orders');

    Route::get('/admin/team-members', function () {
        return Inertia::render('Admin/TeamManagement');
    })->name('admin.team-members');

    Route::get('/admin/carousel-slides', function () {
        return Inertia::render('Admin/CarouselManagement');
    })->name('admin.carousel-slides');
});

require __DIR__ . '/auth.php';
