import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import { Trash2, ShoppingCart, ArrowLeft, Minus, Plus, Package } from 'lucide-react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch(route('cart.get'));
            const data = await response.json();
            setCartItems(data.items);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            const response = await fetch(route('cart.update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: newQuantity,
                }),
            });
            
            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await fetch(route('cart.remove'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    product_id: productId,
                }),
            });
            
            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        if (!confirm('Apakah anda yakin ingin mengosongkan keranjang?')) return;
        
        try {
            const response = await fetch(route('cart.clear'), {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            
            if (response.ok) {
                setCartItems([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const freeShippingThreshold = 500000;
    const shipping = total >= freeShippingThreshold ? 0 : 25000;
    const grandTotal = total + shipping;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

    if (loading) {
        return (
            <PublicLayout title="Keranjang Belanja" description="Lihat keranjang belanja Anda">
                <div className="bg-gray-50 min-h-screen py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    // Empty State
    if (cartItems.length === 0) {
        return (
            <PublicLayout title="Keranjang Belanja" description="Lihat keranjang belanja Anda">
                <div className="bg-gray-50 min-h-screen py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => router.get(route('products.index'))}
                            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Lanjut Belanja
                        </button>

                        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h3>
                            <p className="text-gray-500 mb-8 text-center max-w-md">
                                Belum ada produk di keranjang belanja Anda. Mulai berbelanja sekarang!
                            </p>
                            <button
                                onClick={() => router.get(route('products.index'))}
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all active:scale-95"
                            >
                                Mulai Belanja
                            </button>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout title="Keranjang Belanja" description="Lihat dan kelola keranjang belanja Anda">
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.get(route('products.index'))}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Lanjut Belanja
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Free Shipping Progress */}
                            {remainingForFreeShipping > 0 && (
                                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                                    <p className="text-primary-800 font-semibold">
                                        Belanja Rp {remainingForFreeShipping.toLocaleString('id-ID')} lagi untuk mendapatkan gratis ongkir!
                                    </p>
                                    <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary-500 h-full transition-all duration-500"
                                            style={{ width: `${(total / freeShippingThreshold) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Cart Items List */}
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                                    >
                                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={route('products.show', item.id)}
                                                className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-lg font-bold text-primary-600">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <p className="text-sm font-bold text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Ringkasan Belanja</h3>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-500 hover:text-red-600 transition"
                                    >
                                        Kosongkan
                                    </button>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ongkos Kirim</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-primary-600">
                                                {formatPrice(grandTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.get(route('checkout.index'))}
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-500/30"
                                >
                                    Lanjut ke Checkout
                                </button>

                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    Gratis ongkir untuk pembelian di atas Rp 500.000
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
