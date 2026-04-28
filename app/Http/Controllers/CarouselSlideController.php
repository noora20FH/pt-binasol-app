<?php

namespace App\Http\Controllers;

use App\Models\CarouselSlide;
use Illuminate\Http\Request;

class CarouselSlideController extends Controller
{
    public function index()
    {
        $slides = CarouselSlide::all();

        return inertia('CarouselSlides/Index', [
            'slides' => $slides,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string|url',
            'theme' => 'required|in:light,dark',
        ]);

        CarouselSlide::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, CarouselSlide $carouselSlide)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string|url',
            'theme' => 'required|in:light,dark',
        ]);

        $carouselSlide->update($validated);

        return redirect()->back();
    }

    public function destroy(CarouselSlide $carouselSlide)
    {
        $carouselSlide->delete();

        return redirect()->back();
    }
}
