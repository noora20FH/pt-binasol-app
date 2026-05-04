<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CartService
{
    /**
     * Ambil atau buat keranjang untuk user/guest saat ini
     */
    public function getOrCreateCart(Request $request): Cart
    {
        $user = Auth::user();
        $sessionId = $request->session()->getId();

        if ($user) {
            // User login → pakai cart berdasarkan user_id
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['session_id' => null]
            );
        } else {
            // Guest → pakai session_id
            $cart = Cart::firstOrCreate(
                ['session_id' => $sessionId],
                ['user_id' => null]
            );
        }

        return $cart;
    }

    /**
     * Tambah produk ke keranjang
     */
    public function addToCart(Request $request, int $productId, int $quantity = 1): array
    {
        $cart = $this->getOrCreateCart($request);
        $product = Product::findOrFail($productId);

        $item = CartItem::updateOrCreate(
            [
                'cart_id'    => $cart->id,
                'product_id' => $product->id,
            ],
            [
                'quantity'   => DB::raw("quantity + {$quantity}"),
                'unit_price' => $product->price,
            ]
        );

        return [
            'success' => true,
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'cart_count' => $cart->items()->sum('quantity'),
        ];
    }

    /**
     * Hapus item dari keranjang
     */
    public function removeFromCart(Request $request, int $productId): array
    {
        $cart = $this->getOrCreateCart($request);
        CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->delete();

        return [
            'success' => true,
            'message' => 'Produk dihapus dari keranjang',
        ];
    }

    /**
     * Update quantity item
     */
    public function updateQuantity(Request $request, int $productId, int $quantity): array
    {
        $cart = $this->getOrCreateCart($request);

        CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->update(['quantity' => $quantity]);

        return [
            'success' => true,
            'message' => 'Keranjang diperbarui',
        ];
    }

    /**
     * Kosongkan keranjang
     */
    public function clearCart(Request $request): array
    {
        $cart = $this->getOrCreateCart($request);
        $cart->items()->delete();

        return [
            'success' => true,
            'message' => 'Keranjang dikosongkan',
        ];
    }

    /**
     * Ambil data keranjang lengkap (untuk getCart / AJAX)
     */
    public function getCartData(Request $request): array
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load(['items.product.images']);

        $items = $cart->items->map(function ($item) {
            $image = $item->product->images->first();
            $imagePath = $image && $image->image_path
                ? Storage::url(ltrim($image->image_path, '/'))
                : null;

            return [
                'id'       => $item->product->id,
                'name'     => $item->product->name,
                'price'    => $item->unit_price ?? $item->product->price,
                'quantity' => $item->quantity,
               'image' => $item->product->images->first()?->image_path
    ? Storage::url(ltrim($item->product->images->first()->image_path, '/'))
    : null,
                'total'    => ($item->unit_price ?? $item->product->price) * $item->quantity,
            ];
        });

        $total = $items->sum('total');

        return [
            'items'  => $items,
            'total'  => $total,
            'count'  => $cart->items->sum('quantity'),
        ];
    }
}
