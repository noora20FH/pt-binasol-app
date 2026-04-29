<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images'])
            ->select('id', 'category_id', 'name', 'slug', 'price', 'original_price', 'badge', 'stock')
            ->paginate(12);
        $products->getCollection()->transform(function ($product) {
            if ($product->relationLoaded('images') && $product->images->isNotEmpty()) {
                $product->images->transform(function ($image) {
                    if ($image && $image->image_path) {
                        $image->image_path = Storage::url(ltrim($image->image_path, '/'));
                    }
                    return $image;
                });
            }
            return $product;
        });

        return inertia('Products/Index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'specifications', 'images', 'testimonials']);

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('images')
            ->limit(4)
            ->get();
        $relatedProducts->each(function ($p) {
            if ($p->relationLoaded('images') && $p->images->isNotEmpty()) {
                $p->images->transform(function ($image) {
                    if ($image && $image->image_path) {
                        $image->image_path = Storage::url(ltrim($image->image_path, '/'));
                    }
                    return $image;
                });
            }
        });
        return inertia('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        Product::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $product->id . '|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return redirect()->back();
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->back();
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $category = $request->get('category');

        $products = Product::with(['category', 'images'])
            ->when($query, function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->when($category, function ($q) use ($category) {
                $q->where('category_id', $category);
            })
            ->paginate(12);
        $products->getCollection()->transform(function ($product) {
            if ($product->relationLoaded('images') && $product->images->isNotEmpty()) {
                $product->images->transform(function ($image) {
                    if ($image && $image->image_path) {
                        $image->image_path = Storage::url(ltrim($image->image_path, '/'));
                    }
                    return $image;
                });
            }
            return $product;
        });
        return inertia('Products/Search', [
            'products' => $products,
            'query' => $query,
            'category' => $category,
        ]);
    }
}
