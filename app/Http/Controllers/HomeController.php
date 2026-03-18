<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Film;
use App\Models\CarouselSlide;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $slides = CarouselSlide::select('id', 'title', 'subtitle', 'image', 'link', 'theme')->get();
        $categories = Category::select('id', 'name', 'slug', 'image', 'icon')
            ->with('products:id,category_id')
            ->limit(6)
            ->get();
        $featuredProducts = Product::select('id', 'name', 'slug', 'price', 'original_price', 'badge', 'stock')
            ->with('images:id,product_id,image_path')
            ->where('badge', 'featured')
            ->limit(8)
            ->get();
        $featuredFilms = Film::select('id', 'title', 'is_featured')
            ->where('is_featured', true)
            ->limit(6)
            ->get();
        $testimonials = Testimonial::select('id', 'name', 'image', 'comment', 'rating')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();
        $teamMembers = TeamMember::select('id', 'name', 'role', 'image', 'order_priority')
            ->orderBy('order_priority', 'asc')
            ->get();

        return inertia('Home', [
            'slides' => $slides,
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'featuredFilms' => $featuredFilms,
            'testimonials' => $testimonials,
            'teamMembers' => $teamMembers,
        ]);
    }

    public function about()
    {
        $teamMembers = TeamMember::orderBy('order_priority', 'asc')->get();

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
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // TODO: Send email notification
        // Mail::send('emails.contact', $validated, function($mail) use ($validated) {
        //     $mail->to(config('mail.from.address'))
        //         ->subject('New Contact Form: ' . $validated['subject']);
        // });

        return redirect()->back()->with('success', 'Pesan anda telah dikirim.');
    }
}
