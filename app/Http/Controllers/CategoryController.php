<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::select('id', 'name', 'slug', 'image', 'icon', 'type', 'is_logo')
            ->with('products:id,category_id')
            ->paginate(12);

        // 🔥 Transform image & icon ke full Storage URL
        $categories->getCollection()->transform(function ($category) {
            $category->image = $category->image
                ? Storage::url(ltrim($category->image, '/'))
                : null;

            $category->icon = $category->icon
                ? Storage::url(ltrim($category->icon, '/'))
                : null;

            return $category;
        });

        return inertia('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category)
    {
        $category->load([
            'products.images',
            'products.specifications',
            'products.testimonials'
        ]);

        // 🔥 Transform category image & icon
        $category->image = $category->image
            ? Storage::url(ltrim($category->image, '/'))
            : null;

        $category->icon = $category->icon
            ? Storage::url(ltrim($category->icon, '/'))
            : null;

        // 🔥 Transform SEMUA gambar produk (image_path)
        $category->products->each(function ($product) {
            if ($product->relationLoaded('images') && $product->images->isNotEmpty()) {
                $product->images->transform(function ($image) {
                    if ($image && $image->image_path) {
                        $image->image_path = Storage::url(ltrim($image->image_path, '/'));
                    }
                    return $image;
                });
            }
        });

        return inertia('Categories/Show', [
            'category' => $category,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'icon' => 'nullable|string',
            'type' => 'required|in:construction,retail',
        ]);

        Category::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,' . $category->id . '|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'icon' => 'nullable|string',
            'type' => 'required|in:construction,retail',
        ]);

        $category->update($validated);

        return redirect()->back();
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->back();
    }
}
