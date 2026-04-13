<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function indexRetail()
    {
        return $this->indexByType('retail');
    }

    public function indexConstruction()
    {
        return $this->indexByType('construction');
    }

    private function indexByType(string $type)
    {
        $categories = Category::where('type', $type)
            ->select('id', 'name', 'slug', 'description', 'image', 'icon', 'type', 'is_logo')
            ->get();

        $products = Product::with(['images', 'specifications'])
            ->whereHas('category', fn($q) => $q->where('type', $type))
            ->select('id', 'category_id', 'name', 'slug', 'description', 'price', 'original_price', 'badge', 'stock', 'created_at', 'updated_at')
            ->get();

        return Inertia::render('Admin/ProductManagement', [
            'type'       => $type,
            'categories' => $categories,
            'products'   => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:products,slug',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge'          => 'nullable|string|max:255',
            'stock'          => 'required|integer|min:0',
            'specifications' => 'nullable|array',
            'images'         => 'nullable|array',
            'testimonials'   => 'nullable|array',
        ]);

        $product = Product::create($validated);

        // Specifications
        if (!empty($validated['specifications'])) {
            foreach ($validated['specifications'] as $spec) {
                if (!empty($spec['property']) && !empty($spec['value'])) {
                    ProductSpecification::create([
                        'product_id' => $product->id,
                        'property'   => $spec['property'],
                        'value'      => $spec['value'],
                    ]);
                }
            }
        }

        // Images
        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $img) {
                if (!empty($img['image_path'])) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $img['image_path'],
                        'is_primary' => $img['is_primary'] ?? false,
                    ]);
                }
            }
        }

        // Testimonials (opsional, bisa di-expand nanti)
        if (!empty($validated['testimonials'])) {
            foreach ($validated['testimonials'] as $testi) {
                if (!empty($testi['name']) && !empty($testi['comment'])) {
                    $product->testimonials()->create($testi);
                }
            }
        }

        return redirect()->route("admin.{$request->type}-products")
            ->with('success', 'Produk berhasil ditambahkan');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id'    => 'required|exists:categories,id',
            'name'           => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:products,slug,' . $product->id,
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge'          => 'nullable|string|max:255',
            'stock'          => 'required|integer|min:0',
            'specifications' => 'nullable|array',
            'images'         => 'nullable|array',
            'testimonials'   => 'nullable|array',
        ]);

        $product->update($validated);

        // Sync Specifications
        $product->specifications()->delete();
        if (!empty($validated['specifications'])) {
            foreach ($validated['specifications'] as $spec) {
                if (!empty($spec['property']) && !empty($spec['value'])) {
                    $product->specifications()->create($spec);
                }
            }
        }

        // Sync Images
        $product->images()->delete();
        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $img) {
                if (!empty($img['image_path'])) {
                    $product->images()->create([
                        'image_path' => $img['image_path'],
                        'is_primary' => $img['is_primary'] ?? false,
                    ]);
                }
            }
        }

        // Testimonials (update semua)
        $product->testimonials()->delete();
        if (!empty($validated['testimonials'])) {
            foreach ($validated['testimonials'] as $testi) {
                if (!empty($testi['name']) && !empty($testi['comment'])) {
                    $product->testimonials()->create($testi);
                }
            }
        }

        return redirect()->route("admin.{$request->type}-products")
            ->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Produk berhasil dihapus');
    }
}
