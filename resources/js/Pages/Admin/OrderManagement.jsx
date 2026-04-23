import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/cms/DataTable';
import { Package, DollarSign, Calendar, X, CreditCard } from 'lucide-react';

export default function OrderManagement({ orders = [], stats = {} }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewOrder = (order) => setSelectedOrder(order);
    const handleDeleteOrder = (order) => {
        if (!confirm(`Hapus order ${order.order_number}?`)) return;
        router.delete(route('admin.orders.destroy', order.id), { preserveScroll: true });
    };

    const getPaymentStatus = (status) => {
        if (status === 'settlement') return { label: 'Lunas', type: 'success' };
        if (status === 'pending') return { label: 'Pending', type: 'warning' };
        if (status === 'cancel') return { label: 'Dibatalkan', type: 'danger' };
        return { label: status, type: 'default' };
    };

    const getPaymentTypeLabel = (type) => {
        const map = { bank_transfer: 'Bank Transfer', credit_card: 'Credit Card', gopay: 'Gopay', qris: 'QRIS' };
        return map[type] || type || '-';
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' });

    const totalOrders = stats.total ?? orders.length;
    const lunasCount  = stats.lunas ?? orders.filter((o) => o.payment_status === 'settlement').length;
    const pendingCount = stats.pending ?? orders.filter((o) => o.payment_status === 'pending').length;
    const totalRevenue = stats.revenue ?? orders.filter((o) => o.payment_status === 'settlement').reduce((s, o) => s + Number(o.total_amount), 0);

    return (
        <AdminLayout title="Manajemen Pesanan" activeTab="orders">
            <p className="text-gray-600 mt-1 mb-6">Kelola dan monitor pesanan dari pelanggan</p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Pesanan', value: totalOrders, icon: Package, color: 'bg-blue-100', iconColor: 'text-blue-600' },
                    { label: 'Lunas', value: lunasCount, icon: DollarSign, color: 'bg-emerald-100', iconColor: 'text-emerald-600', valueColor: 'text-emerald-600' },
                    { label: 'Pending', value: pendingCount, icon: Calendar, color: 'bg-yellow-100', iconColor: 'text-yellow-600', valueColor: 'text-yellow-600' },
                    { label: 'Total Nilai', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white rounded-2xl shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className={`text-2xl font-bold mt-2 ${stat.valueColor || 'text-gray-900'}`}>{stat.value}</p>
                                </div>
                                <div className={`p-3 ${stat.color} rounded-2xl`}>
                                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <DataTable
                data={orders}
                columns={[
                    {
                        key: 'order_number',
                        label: 'No. Order',
                        render: (v) => <span className="font-mono font-semibold text-blue-600">{v}</span>,
                    },
                    { key: 'customer_name', label: 'Customer', render: (v) => <span className="font-medium">{v}</span> },
                    { key: 'customer_email', label: 'Email', render: (v) => <span className="text-gray-500">{v}</span> },
                    {
                        key: 'total_amount',
                        label: 'Total',
                        render: (v) => <span className="font-semibold text-emerald-600">{formatCurrency(v)}</span>,
                    },
                    {
                        key: 'payment_status',
                        label: 'Status',
                        render: (v) => {
                            const { label, type } = getPaymentStatus(v);
                            return <StatusBadge status={label} type={type} />;
                        },
                    },
                    { key: 'payment_type', label: 'Metode', render: (v) => getPaymentTypeLabel(v) },
                    { key: 'created_at', label: 'Tanggal', render: (v) => <span className="text-sm">{formatDate(v)}</span> },
                ]}
                onView={handleViewOrder}
                onDelete={handleDeleteOrder}
                searchPlaceholder="Cari pesanan..."
                emptyMessage="Tidak ada pesanan ditemukan."
            />

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                            <h3 className="text-2xl font-bold text-gray-800">Detail Pesanan</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-gray-100 rounded-xl">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4">Informasi Pesanan</h4>
                                <div className="grid grid-cols-2 gap-y-6 text-sm">
                                    <div><p className="text-gray-500">Nomor Order</p><p className="font-medium mt-1">{selectedOrder.order_number}</p></div>
                                    <div><p className="text-gray-500">Tanggal</p><p className="font-medium mt-1">{new Date(selectedOrder.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                                    <div>
                                        <p className="text-gray-500">Status Pembayaran</p>
                                        <div className="mt-1">
                                            {(() => { const { label, type } = getPaymentStatus(selectedOrder.payment_status); return <StatusBadge status={label} type={type} />; })()}
                                        </div>
                                    </div>
                                    <div><p className="text-gray-500">Metode Pembayaran</p><p className="font-medium capitalize mt-1">{getPaymentTypeLabel(selectedOrder.payment_type)}</p></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4">Informasi Customer</h4>
                                <div className="space-y-4 text-sm">
                                    <div><p className="text-gray-500">Nama</p><p className="font-medium mt-1">{selectedOrder.customer_name}</p></div>
                                    <div><p className="text-gray-500">Email</p><p className="font-medium mt-1">{selectedOrder.customer_email}</p></div>
                                    <div><p className="text-gray-500">Alamat</p><p className="font-medium mt-1">{selectedOrder.customer_address}</p></div>
                                </div>
                            </div>

                            {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-4">Item Pesanan</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm">
                                                <span className="font-medium">{item.product_name || `Produk #${item.product_id}`}</span>
                                                <span className="text-gray-500">x{item.quantity}</span>
                                                <span className="font-semibold text-emerald-600">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedOrder.snap_token && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-[#FF751F]" /> Midtrans Payment
                                    </h4>
                                    <div className="p-5 bg-gray-50 rounded-2xl">
                                        <p className="text-sm text-gray-500 mb-2">Snap Token</p>
                                        <p className="font-mono text-sm font-medium break-all text-gray-700">{selectedOrder.snap_token}</p>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-gray-800">Total Pembayaran</span>
                                    <span className="text-3xl font-bold text-emerald-600">{formatCurrency(selectedOrder.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
