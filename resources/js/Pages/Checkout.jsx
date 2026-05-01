import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Home, CheckCircle } from 'lucide-react';

export default function Checkout({ cartItems, subtotal, shipping, tax, total, customer }) {
    const [formData, setFormData] = useState({
        customer_name: customer?.name || '',
        customer_email: customer?.email || '',
        customer_phone: '',
        customer_address: '',
        city: '',
        postal_code: '',
        payment_method: 'bank_transfer',
        notes: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Nama lengkap wajib diisi';
        }
        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
            newErrors.customer_email = 'Format email tidak valid';
        }
        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Nomor telepon wajib diisi';
        }
        if (!formData.customer_address.trim()) {
            newErrors.customer_address = 'Alamat lengkap wajib diisi';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'Kota wajib diisi';
        }
        if (!formData.postal_code.trim()) {
            newErrors.postal_code = 'Kode pos wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(route('checkout.process'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setOrderSuccess(true);
                setOrderData(data.order);
            } else {
                setErrors({ general: data.message || 'Terjadi kesalahan saat membuat pesanan' });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Order Success State
    if (orderSuccess && orderData) {
        return (
            <PublicLayout title="Pesanan Berhasil" description="Pesanan Anda berhasil dibuat">
                <div className="bg-gray-50 min-h-screen py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Pesanan Berhasil Dibuat!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Terima kasih telah berbelanja. Pesanan Anda sedang diproses.
                            </p>

                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div>
                                        <p className="text-sm text-gray-500">Nomor Pesanan</p>
                                        <p className="font-semibold text-gray-900">{orderData.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Pembayaran</p>
                                        <p className="font-semibold text-primary-600">{formatPrice(orderData.total_amount)}</p>
                                    </div>
                                </div>
                            </div>

                            {orderData.payment_status === 'pending' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                                    <p className="text-yellow-800 text-sm">
                                        <strong>Menunggu Pembayaran</strong><br />
                                        Silakan selesaikan pembayaran Anda sebelum batas waktu berakhir.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => router.get(route('orders.show', orderData.id))}
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all"
                                >
                                    Lihat Detail Pesanan
                                </button>
                                <button
                                    onClick={() => router.get(route('home'))}
                                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all"
                                >
                                    Kembali ke Beranda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    // Empty Cart State
    if (cartItems.length === 0) {
        return (
            <PublicLayout title="Checkout" description="Selesaikan pembelian Anda">
                <div className="bg-gray-50 min-h-screen py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <p className="text-xl text-gray-600 mb-6">Keranjang belanja Anda kosong</p>
                        <button
                            onClick={() => router.get(route('products.index'))}
                            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all"
                        >
                            Mulai Belanja
                        </button>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout title="Checkout" description="Selesaikan pembelian Anda">
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.get(route('cart.view'))}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Keranjang
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <p className="text-red-600">{errors.general}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Informasi Pembeli */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Informasi Pembeli</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                    errors.customer_name ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                                placeholder="Masukkan nama lengkap"
                                            />
                                            {errors.customer_name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="customer_email"
                                                    value={formData.customer_email}
                                                    onChange={handleChange}
                                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                        errors.customer_email ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                            {errors.customer_email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nomor Telepon <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="customer_phone"
                                                    value={formData.customer_phone}
                                                    onChange={handleChange}
                                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                        errors.customer_phone ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                    placeholder="08xxxxxxxxxx"
                                                />
                                            </div>
                                            {errors.customer_phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Alamat Pengiriman */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Alamat Lengkap <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="customer_address"
                                                value={formData.customer_address}
                                                onChange={handleChange}
                                                rows={3}
                                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                    errors.customer_address ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                                placeholder="Jalan, No. Rumah, RT/RW"
                                            />
                                            {errors.customer_address && (
                                                <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Kota <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                            errors.city ? 'border-red-500' : 'border-gray-200'
                                                        }`}
                                                        placeholder="Nama kota"
                                                    />
                                                </div>
                                                {errors.city && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Kode Pos <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postal_code"
                                                    value={formData.postal_code}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                        errors.postal_code ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                    placeholder="12345"
                                                />
                                                {errors.postal_code && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metode Pembayaran */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { value: 'bank_transfer', label: 'Transfer Bank', desc: 'BCA, Mandiri, BNI, BRI' },
                                            { value: 'e_wallet', label: 'E-Wallet', desc: 'GoPay, OVO, Dana, LinkAja' },
                                            { value: 'cod', label: 'COD (Cash on Delivery)', desc: 'Bayar saat barang tiba' },
                                        ].map((method) => (
                                            <label
                                                key={method.value}
                                                className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    formData.payment_method === method.value
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method.value}
                                                    checked={formData.payment_method === method.value}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 text-primary-600"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{method.label}</p>
                                                    <p className="text-sm text-gray-500">{method.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Catatan (Opsional)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Catatan untuk penjual..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>

                                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <img
                                                    src={item.image || '/placeholder-product.jpg'}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} x {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 space-y-3">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Ongkos Kirim</span>
                                            <span className="font-semibold">
                                                {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>PPN (11%)</span>
                                            <span className="font-semibold">{formatPrice(tax)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-900">Total</span>
                                                <span className="text-2xl font-bold text-primary-600">
                                                    {formatPrice(total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-500/30"
                                    >
                                        {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                                    </button>

                                    <p className="text-xs text-gray-500 mt-4 text-center">
                                        Dengan melanjutkan, Anda menyetujui syarat & ketentuan yang berlaku
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
