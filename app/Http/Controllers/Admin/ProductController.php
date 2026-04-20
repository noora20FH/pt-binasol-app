<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type', 'retail');

        $products = Product::with(['category', 'images'])
            ->whereHas('category', fn($q) => $q->where('type', $type))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id'             => $p->id,
                'category_id'    => $p->category_id,
                'category_name'  => $p->category?->name,
                'name'           => $p->name,
                'slug'           => $p->slug,
                'description'    => $p->description,
                'price'          => $p->price,
                'original_price' => $p->original_price,
                'badge'          => $p->badge,
                'stock'          => $p->stock,
                'created_at'     => $p->created_at?->toIso8601String(),
                'updated_at'     => $p->updated_at?->toIso8601String(),
                'images'         => $p->images->map(fn($img) => [
                    'id'         => $img->id,
                    'image_path' => $img->image_path ? Storage::url($img->image_path) : null,
                    'is_primary' => $img->is_primary,
                ])->toArray(),
            ]);

        $categories = Category::where('type', $type)->get(['id', 'name']);

        $page = $type === 'retail' ? 'Admin/ProductManagement' : 'Admin/ProductManagement';

        return Inertia::render($page, [
            'products'   => $products,
            'categories' => $categories,
            'type'       => $type,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge'          => 'nullable|string|max:100',
            'stock'          => 'required|integer|min:0',
            'images.*'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);

        $product = Product::create($validated);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        // Handle specifications
        if ($request->filled('specifications')) {
            $specs = is_string($request->specifications)
                ? json_decode($request->specifications, true)
                : $request->specifications;

            if (is_array($specs)) {
                foreach ($specs as $spec) {
                    if (!empty($spec['property'])) {
                        $product->specifications()->create([
                            'property' => $spec['property'],
                            'value'    => $spec['value'] ?? '',
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan!');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge'          => 'nullable|string|max:100',
            'stock'          => 'required|integer|min:0',
            'images.*'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . $product->id;
        $product->update($validated);

        // Handle new image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $product->images()->count() === 0 && $index === 0,
                ]);
            }
        }

        // Handle specifications update
        if ($request->filled('specifications')) {
            $specs = is_string($request->specifications)
                ? json_decode($request->specifications, true)
                : $request->specifications;

            if (is_array($specs)) {
                $product->specifications()->delete();
                foreach ($specs as $spec) {
                    if (!empty($spec['property'])) {
                        $product->specifications()->create([
                            'property' => $spec['property'],
                            'value'    => $spec['value'] ?? '',
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Produk berhasil diperbarui!');
    }

    public function destroy(Product $product)
    {
        // Delete images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus!');
    }

    public function destroyImage(ProductImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return redirect()->back()->with('success', 'Gambar berhasil dihapus!');
    }
}
