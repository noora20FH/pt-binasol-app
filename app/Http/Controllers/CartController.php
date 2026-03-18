<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * View cart page
     */
    public function viewCart()
    {
        return inertia('Cart/Index');
    }

    /**
     * Get current cart from session
     */
    public function getCart()
    {
        $cart = session()->get('cart', []);
        $cartItems = [];
        $total = 0;

        foreach ($cart as $productId => $quantity) {
            $product = Product::find($productId);
            if ($product) {
                $itemTotal = $product->price * $quantity;
                $cartItems[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $quantity,
                    'image' => $product->images()->first()?->image_url,
                    'total' => $itemTotal,
                ];
                $total += $itemTotal;
            }
        }

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
            'count' => count($cartItems),
        ]);
    }

    /**
     * Add product to cart
     */
    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = session()->get('cart', []);
        $productId = $validated['product_id'];
        $quantity = $validated['quantity'];

        if (isset($cart[$productId])) {
            $cart[$productId] += $quantity;
        } else {
            $cart[$productId] = $quantity;
        }

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan ke keranjang',
            'cart' => $cart,
        ]);
    }

    /**
     * Remove product from cart
     */
    public function removeFromCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $cart = session()->get('cart', []);
        unset($cart[$validated['product_id']]);
        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Produk dihapus dari keranjang',
            'cart' => $cart,
        ]);
    }

    /**
     * Update product quantity
     */
    public function updateCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = session()->get('cart', []);
        $cart[$validated['product_id']] = $validated['quantity'];
        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Keranjang diperbarui',
            'cart' => $cart,
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clearCart()
    {
        session()->put('cart', []);

        return response()->json([
            'success' => true,
            'message' => 'Keranjang dikosongkan',
        ]);
    }
}
