import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/Components/Button';

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
        }).format(price);
    };

    if (loading) {
        return (
            <PublicLayout title="Keranjang Belanja" description="Lihat keranjang belanja Anda">
                <div className="py-20 text-center">
                    <p>Memuat keranjang...</p>
                </div>
            </PublicLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <PublicLayout title="Keranjang Belanja" description="Lihat keranjang belanja Anda">
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <ShoppingCart className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
                        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                            Keranjang Anda Kosong
                        </h1>
                        <p className="text-secondary-600 mb-8">
                            Belum ada produk di keranjang. Mari mulai berbelanja!
                        </p>
                        <PrimaryButton href={route('products.index')}>
                            <ArrowLeft className="w-5 h-5 inline mr-2" />
                            Lanjut Belanja
                        </PrimaryButton>
                    </div>
                </section>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout title="Keranjang Belanja" description="Lihat dan kelola keranjang belanja Anda">
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-secondary-900">
                            Keranjang Belanja
                        </h1>
                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-700 text-sm font-medium transition"
                        >
                            Kosongkan Keranjang
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white p-4 rounded-lg shadow-md flex gap-4"
                                    >
                                        <div className="w-24 h-24 bg-secondary-100 rounded-lg flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingCart className="w-8 h-8 text-secondary-300" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <Link
                                                href={route('products.show', item.id)}
                                                className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-primary-600 font-semibold mt-2">
                                                {formatPrice(item.price)}
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        className="px-2 py-1 bg-secondary-100 rounded hover:bg-secondary-200 transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-3 py-1 bg-secondary-50 rounded">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="px-2 py-1 bg-secondary-100 rounded hover:bg-secondary-200 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-700 transition"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-secondary-900">
                                                {formatPrice(item.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Summary */}
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                                <h2 className="text-xl font-bold text-secondary-900 mb-6">
                                    Ringkasan
                                </h2>

                                <div className="space-y-4 mb-6 pb-6 border-b border-secondary-200">
                                    <div className="flex justify-between text-secondary-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary-600">
                                        <span>Ongkos Kirim</span>
                                        <span>-</span>
                                    </div>
                                    <div className="flex justify-between text-secondary-600">
                                        <span>Pajak</span>
                                        <span>-</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-lg font-bold text-secondary-900 mb-6">
                                    <span>Total</span>
                                    <span className="text-primary-600">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                <button 
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        backgroundColor: '#ea580c',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        marginBottom: '12px',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c2410c'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ea580c'}
                                >
                                    Lanjut ke Checkout
                                </button>

                                <SecondaryButton href={route('products.index')}>
                                    Lanjut Belanja
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
