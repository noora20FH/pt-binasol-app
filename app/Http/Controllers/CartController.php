<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Tampilkan halaman Keranjang
     */
    public function viewCart()
    {
        return Inertia::render('Cart/Index');
    }

    /**
     * Ambil data keranjang (JSON - dipakai oleh frontend via AJAX)
     */
    public function getCart(Request $request)
    {
        $data = $this->cartService->getCartData($request);

        return response()->json($data);
    }

    /**
     * Tambah produk ke keranjang
     */
    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $result = $this->cartService->addToCart(
            $request,
            $validated['product_id'],
            $validated['quantity']
        );

        return redirect()->back()
            ->with('success', $result['message']);
    }

    /**
     * Hapus produk dari keranjang
     */
    public function removeFromCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $result = $this->cartService->removeFromCart($request, $validated['product_id']);

        return redirect()->back()
            ->with('success', $result['message']);
    }

    /**
     * Update quantity
     */
    public function updateCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $result = $this->cartService->updateQuantity(
            $request,
            $validated['product_id'],
            $validated['quantity']
        );

        return redirect()->back()
            ->with('success', $result['message']);
    }

    /**
     * Kosongkan keranjang
     */
    public function clearCart(Request $request)
    {
        $result = $this->cartService->clearCart($request);

        return redirect()->back()
            ->with('success', $result['message']);
    }
}
