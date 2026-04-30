<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Film;
use App\Models\CarouselSlide;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {
        $slides = CarouselSlide::select('id', 'title', 'subtitle', 'image', 'link', 'theme')->get();

        // Kategori + transform image & icon
        $categories = Category::select('id', 'name', 'slug', 'image', 'icon', 'is_logo')
            ->with('products:id,category_id')
            ->limit(6)
            ->get()
            ->map(function ($category) {
                $category->image = $category->image
                    ? Storage::url(ltrim($category->image, '/'))
                    : null;
                $category->icon = $category->icon
                    ? Storage::url(ltrim($category->icon, '/'))
                    : null;
                return $category;
            });

        // Featured Products + transform images
        $featuredProducts = Product::select('id', 'name', 'slug', 'price', 'original_price', 'badge', 'stock')
            ->with('images:id,product_id,image_path')
            ->where('badge', 'featured')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                $product->images = $product->images->map(function ($image) {
                    $image->image_path = $image->image_path
                        ? Storage::url(ltrim($image->image_path, '/'))
                        : null;
                    return $image;
                });
                return $product;
            });

        // Featured Films + transform poster & banner
        $featuredFilms = Film::select('id', 'title', 'poster', 'banner', 'rating', 'year', 'genres', 'is_featured')
            ->where('is_featured', true)
            ->limit(6)
            ->get()
            ->map(function ($film) {
                $film->poster = $film->poster
                    ? Storage::url(ltrim($film->poster, '/'))
                    : null;
                $film->banner = $film->banner
                    ? Storage::url(ltrim($film->banner, '/'))
                    : null;
                return $film;
            });

        // Testimonials + transform image
        $testimonials = Testimonial::select('id', 'name', 'image', 'comment', 'rating')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($testimonial) {
                $testimonial->image = $testimonial->image
                    ? Storage::url(ltrim($testimonial->image, '/'))
                    : null;
                return $testimonial;
            });

        // Team Members + transform image
        $teamMembers = TeamMember::select('id', 'name', 'role', 'image', 'order_priority')
            ->orderBy('order_priority', 'asc')
            ->get()
            ->map(function ($member) {
                $member->image = $member->image
                    ? Storage::url(ltrim($member->image, '/'))
                    : null;
                return $member;
            });

        return inertia('Home', [
            'slides'           => $slides,
            'categories'       => $categories,
            'featuredProducts' => $featuredProducts,
            'featuredFilms'    => $featuredFilms,
            'testimonials'     => $testimonials,
            'teamMembers'      => $teamMembers,
        ]);
    }

    // about() dan contact() tetap sama
    public function about()
    {
        $teamMembers = TeamMember::orderBy('order_priority', 'asc')
            ->get()
            ->map(function ($member) {
                $member->image = $member->image
                    ? Storage::url(ltrim($member->image, '/'))
                    : null;
                return $member;
            });

        return inertia('About', [
            'teamMembers' => $teamMembers,
        ]);
    }

    public function contact()
    {
        return inertia('Contact');
    }

    public function sendContact(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        return redirect()->back()->with('success', 'Pesan anda telah dikirim.');
    }
}
