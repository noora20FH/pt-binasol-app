<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function indexRetail()
    {
        $products = Product::with(['category', 'images', 'specifications'])
            ->whereHas('category', fn($q) => $q->where('type', 'retail'))
            ->latest()
            ->get();

        $categories = Category::where('type', 'retail')->get();

        return inertia('Admin/ProductManagement', [
            'products' => $products,
            'categories' => $categories,
            'type' => 'retail'
        ]);
    }

    public function indexConstruction()
    {
        $products = Product::with(['category', 'images', 'specifications'])
            ->whereHas('category', fn($q) => $q->where('type', 'construction'))
            ->latest()
            ->get();

        $categories = Category::where('type', 'construction')->get();

        return inertia('Admin/ProductManagement', [
            'products' => $products,
            'categories' => $categories,
            'type' => 'construction'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'badge' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'specifications' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*.file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $product = Product::create($validated);

        $this->processSpecifications($product, $request);
        $this->processImages($product, $request);

        return redirect()->route("admin.{$request->input('type')}-products")
            ->with('success', 'Produk berhasil ditambahkan!');
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
            'badge' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'specifications' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*.file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'images.*.id' => 'nullable|exists:product_images,id',
        ]);

        $product->update($validated);

        // Replace specifications
        $product->specifications()->delete();
        $this->processSpecifications($product, $request);

        $this->processImages($product, $request, true);

        return redirect()->route("admin.{$request->input('type')}-products")
            ->with('success', 'Produk berhasil diupdate!');
    }

    public function destroy(Product $product)
    {
        // Hapus file fisik
        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus!');
    }

    private function processSpecifications(Product $product, Request $request)
    {
        if ($request->filled('specifications')) {
            $specs = json_decode($request->specifications, true) ?? [];
            foreach ($specs as $spec) {
                if (!empty($spec['property']) && !empty($spec['value'])) {
                    $product->specifications()->create([
                        'property' => $spec['property'],
                        'value' => $spec['value'],
                    ]);
                }
            }
        }
    }

    private function processImages(Product $product, Request $request, bool $isUpdate = false)
    {
        $imagesInput = $request->input('images', []);

        // Hapus gambar yang di-remove di frontend (hanya saat edit)
        if ($isUpdate) {
            $keptIds = collect($imagesInput)->pluck('id')->filter()->values()->toArray();
            $product->images()
                ->whereNotIn('id', $keptIds)
                ->get()
                ->each(function ($img) {
                    if (Storage::disk('public')->exists($img->image_path)) {
                        Storage::disk('public')->delete($img->image_path);
                    }
                    $img->delete();
                });
        }

        foreach ($imagesInput as $index => $imgData) {
            $isPrimary = filter_var($imgData['is_primary'] ?? false, FILTER_VALIDATE_BOOLEAN);

            // New image upload
            if ($request->hasFile("images.{$index}.file")) {
                $file = $request->file("images.{$index}.file");
                $path = $file->store('products/images', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $isPrimary,
                ]);
            }
            // Existing image (update is_primary)
            elseif ($isUpdate && isset($imgData['id'])) {
                ProductImage::where('id', $imgData['id'])
                    ->where('product_id', $product->id)
                    ->update(['is_primary' => $isPrimary]);
            }
        }
    }
}
