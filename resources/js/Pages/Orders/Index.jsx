import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import { Package, Clock, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';

export default function OrderHistory({ orders }) {
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
            settlement: { label: 'Berhasil', color: 'bg-green-100 text-green-700', icon: CheckCircle },
            expire: { label: 'Kadaluarsa', color: 'bg-gray-100 text-gray-700', icon: XCircle },
            cancel: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: XCircle },
        };
        return statusMap[status] || statusMap.pending;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(order => order.payment_status === statusFilter);

    return (
        <PublicLayout title="Riwayat Pesanan" description="Kelola dan lacak pesanan Anda">
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.get(route('home'))}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali
                    </button>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Riwayat Pesanan</h1>
                            <p className="text-gray-600 mt-1">Kelola dan lacak pesanan Anda</p>
                        </div>
                        <Package className="w-12 h-12 text-primary-500" />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                        {[
                            { key: 'all', label: 'Semua', count: orders.length },
                            { key: 'pending', label: 'Pending', count: orders.filter(o => o.payment_status === 'pending').length },
                            { key: 'settlement', label: 'Selesai', count: orders.filter(o => o.payment_status === 'settlement').length },
                            { key: 'cancel', label: 'Dibatalkan', count: orders.filter(o => o.payment_status === 'cancel').length },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setStatusFilter(filter.key)}
                                className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                                    statusFilter === filter.key
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {filter.label}
                                {filter.count > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        statusFilter === filter.key
                                            ? 'bg-white/20'
                                            : 'bg-gray-100'
                                    }`}>
                                        {filter.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length > 0 ? (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => {
                                const statusInfo = getStatusInfo(order.payment_status);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        {/* Header */}
                                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-gray-900">
                                                            {order.order_number}
                                                        </h3>
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                                                    <p className="text-2xl font-bold text-primary-600">
                                                        {formatPrice(order.total_amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="p-6">
                                            <div className="space-y-3 mb-4">
                                                {order.items?.slice(0, 2).map((item) => (
                                                    <div key={item.id} className="flex gap-4">
                                                        {item.product?.images?.[0] && (
                                                            <img
                                                                src={item.product.images[0].image_url}
                                                                alt={item.product.name}
                                                                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 line-clamp-1">
                                                                {item.product?.name || 'Produk'}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                {item.quantity} x {formatPrice(item.price)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                {formatPrice(item.quantity * item.price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <p className="text-sm text-gray-500 italic">
                                                        +{order.items.length - 2} produk lainnya
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => router.get(route('orders.show', order.id))}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary-500 text-primary-600 hover:bg-primary-50 rounded-xl font-semibold transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Lihat Detail
                                                </button>
                                                {order.payment_status === 'pending' && (
                                                    <button
                                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all"
                                                    >
                                                        Bayar Sekarang
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
                            <p className="text-gray-500 mb-6">
                                {statusFilter === 'all'
                                    ? 'Anda belum memiliki riwayat pesanan'
                                    : `Tidak ada pesanan dengan status ${statusFilter}`}
                            </p>
                            <button
                                onClick={() => router.get(route('products.index'))}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all"
                            >
                                Mulai Belanja
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
