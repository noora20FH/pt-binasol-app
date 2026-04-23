<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CarouselSlideController extends Controller
{
    public function index()
    {
        $slides = CarouselSlide::orderBy('created_at', 'desc')
            ->get()
            ->map(fn($s) => [
                'id'       => $s->id,
                'title'    => $s->title,
                'subtitle' => $s->subtitle,
                'image'    => $s->image ? Storage::url($s->image) : null,
                'link'     => $s->link,
                'theme'    => $s->theme,
                'created_at' => $s->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/CarouselManagement', ['slides' => $slides]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image'    => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
            'link'     => 'nullable|string|max:255',
            'theme'    => 'required|in:light,dark',
        ]);

        $data = [
            'title'    => $request->title,
            'subtitle' => $request->subtitle,
            'link'     => $request->link,
            'theme'    => $request->theme,
            'image'    => $request->file('image')->store('carousel', 'public'),
        ];

        CarouselSlide::create($data);

        return redirect()->back()->with('success', 'Slide berhasil ditambahkan!');
    }

    public function update(Request $request, CarouselSlide $carouselSlide)
    {
        $request->validate([
            'title'    => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'link'     => 'nullable|string|max:255',
            'theme'    => 'required|in:light,dark',
        ]);

        $data = [
            'title'    => $request->title,
            'subtitle' => $request->subtitle,
            'link'     => $request->link,
            'theme'    => $request->theme,
        ];

        if ($request->hasFile('image')) {
            if ($carouselSlide->image) {
                Storage::disk('public')->delete($carouselSlide->image);
            }
            $data['image'] = $request->file('image')->store('carousel', 'public');
        }

        $carouselSlide->update($data);

        return redirect()->back()->with('success', 'Slide berhasil diperbarui!');
    }

    public function destroy(CarouselSlide $carouselSlide)
    {
        if ($carouselSlide->image) {
            Storage::disk('public')->delete($carouselSlide->image);
        }
        $carouselSlide->delete();

        return redirect()->back()->with('success', 'Slide berhasil dihapus!');
    }
}
