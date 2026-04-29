<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::select('id', 'name', 'slug', 'description', 'image', 'icon', 'type', 'is_logo', 'created_at')
            ->withCount('products')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($category) {
                return [
                    'id'          => $category->id,
                    'name'        => $category->name,
                    'slug'        => $category->slug,
                    'description' => $category->description,
                    'image'       => $category->image ? Storage::url(ltrim($category->image, '/')) : null,
                    'icon'        => $category->icon ? Storage::url(ltrim($category->icon, '/')) : null,
                    'type'        => $category->type,
                    'is_logo'     => (bool) $category->is_logo,
                    'products_count' => $category->products_count,
                    'created_at'  => $category->created_at,
                ];
            });

        return inertia('Admin/CategoryManagement', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|unique:categories|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'icon'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'type'        => 'required|in:construction,retail',
            'is_logo'     => 'boolean',
        ]);

        $category = Category::create([
            'name'        => $validated['name'],
            'slug'        => $validated['slug'],
            'description' => $validated['description'],
            'type'        => $validated['type'],
            'is_logo'     => $validated['is_logo'] ?? false,
        ]);

        if ($request->hasFile('image')) {
            $category->image = $request->file('image')->store('categories/images', 'public');
        }
        if ($request->hasFile('icon')) {
            $category->icon = $request->file('icon')->store('categories/icons', 'public');
        }
        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil ditambahkan!');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|unique:categories,slug,' . $category->id . '|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'icon'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'type'        => 'required|in:construction,retail',
            'is_logo'     => 'boolean',
        ]);

        $category->update([
            'name'        => $validated['name'],
            'slug'        => $validated['slug'],
            'description' => $validated['description'],
            'type'        => $validated['type'],
            'is_logo'     => $validated['is_logo'] ?? false,
        ]);

        if ($request->hasFile('image')) {
            if ($category->image) Storage::disk('public')->delete($category->image);
            $category->image = $request->file('image')->store('categories/images', 'public');
        }

        if ($request->hasFile('icon')) {
            if ($category->icon) Storage::disk('public')->delete($category->icon);
            $category->icon = $request->file('icon')->store('categories/icons', 'public');
        }

        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(Category $category)
    {
        if ($category->image) Storage::disk('public')->delete($category->image);
        if ($category->icon) Storage::disk('public')->delete($category->icon);

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil dihapus!');
    }
}
