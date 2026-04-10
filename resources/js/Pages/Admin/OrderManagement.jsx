import AdminLayout from "@/Layouts/AdminLayout";
import { DataTable, StatusBadge } from "@/Components/cms/DataTable";
import { Package, DollarSign, Calendar, X, CreditCard } from "lucide-react";
import { useState } from "react";

// Mock data BARU dari Figma (TIDAK DIUBAH sama sekali)
const mockOrders = [
    {
        id: 1,
        order_number: "ORD-2026-001",
        user_id: null,
        total_amount: 15500000,
        payment_status: "settlement",
        payment_type: "bank_transfer",
        snap_token: "snap_token_abc123",
        customer_name: "PT Maju Jaya",
        customer_email: "maju@example.com",
        customer_address: "Jl. Sudirman No. 123, Jakarta",
        deleted_at: null,
        created_at: "2026-03-10T10:30:00Z",
        updated_at: "2026-03-10T10:30:00Z",
        items: [
            { id: 1, order_id: 1, product_id: 2, quantity: 200, price: 65000 },
            { id: 2, order_id: 1, product_id: 1, quantity: 10, price: 250000 },
        ],
    },
    {
        id: 2,
        order_number: "ORD-2026-002",
        user_id: null,
        total_amount: 8750000,
        payment_status: "pending",
        payment_type: "credit_card",
        snap_token: "snap_token_def456",
        customer_name: "CV Sejahtera",
        customer_email: "sejahtera@example.com",
        customer_address: "Jl. Thamrin No. 45, Jakarta",
        deleted_at: null,
        created_at: "2026-03-11T14:20:00Z",
        updated_at: "2026-03-11T14:20:00Z",
        items: [
            { id: 3, order_id: 2, product_id: 1, quantity: 35, price: 250000 },
        ],
    },
    {
        id: 3,
        order_number: "ORD-2026-003",
        user_id: null,
        total_amount: 12300000,
        payment_status: "settlement",
        payment_type: "gopay",
        snap_token: "snap_token_ghi789",
        customer_name: "UD Berkah",
        customer_email: "berkah@example.com",
        customer_address: "Jl. Gatot Subroto No. 78, Jakarta",
        deleted_at: null,
        created_at: "2026-03-12T09:15:00Z",
        updated_at: "2026-03-12T09:15:00Z",
        items: [
            { id: 4, order_id: 3, product_id: 2, quantity: 150, price: 65000 },
            { id: 5, order_id: 3, product_id: 1, quantity: 5, price: 250000 },
        ],
    },
];

export default function OrderManagement() {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleDeleteOrder = (order) => {
        if (confirm(`🗑 Hapus order ${order.order_number}?`)) {
            alert(`Order ${order.order_number} telah dihapus (mock)`);
        }
    };

    // Helper untuk status pembayaran
    const getPaymentStatus = (status) => {
        if (status === "settlement") return { label: "Lunas", type: "success" };
        if (status === "pending") return { label: "Pending", type: "warning" };
        return { label: status, type: "default" };
    };

    const getPaymentTypeLabel = (type) => {
        const map = {
            bank_transfer: "Bank Transfer",
            credit_card: "Credit Card",
            gopay: "Gopay",
        };
        return map[type] || type;
    };

    const getPaymentStatusBadge = (status) => {
        const { label, type } = getPaymentStatus(status);
        return <StatusBadge status={label} type={type} />;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    };

    // Hitung statistik
    const totalOrders = mockOrders.length;
    const lunasCount = mockOrders.filter(
        (o) => o.payment_status === "settlement",
    ).length;
    const pendingCount = mockOrders.filter(
        (o) => o.payment_status === "pending",
    ).length;
    const totalRevenue = mockOrders.reduce(
        (sum, order) => sum + order.total_amount,
        0,
    );

    return (
        <AdminLayout title="Manajemen Pesanan" activeTab="orders">
            <p className="text-gray-600 mt-1 mb-6">
                Kelola dan monitor pesanan dari pelanggan
            </p>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Pesanan
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {totalOrders}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-2xl">
                            <Package className="w-7 h-7 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Lunas
                            </p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">
                                {lunasCount}
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-2xl">
                            <DollarSign className="w-7 h-7 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Pending
                            </p>
                            <p className="text-2xl font-bold text-yellow-600 mt-2">
                                {pendingCount}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-2xl">
                            <Calendar className="w-7 h-7 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Nilai
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(totalRevenue)}
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-2xl">
                            <DollarSign className="w-7 h-7 text-emerald-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                data={mockOrders}
                columns={[
                    {
                        key: "order_number",
                        label: "NO. ORDER",
                        render: (value) => (
                            <span className="font-mono font-semibold text-blue-600">
                                {value}
                            </span>
                        ),
                    },
                    {
                        key: "customer_name",
                        label: "CUSTOMER",
                        render: (value) => (
                            <span className="font-medium">{value}</span>
                        ),
                    },
                    {
                        key: "customer_email",
                        label: "EMAIL",
                        render: (value) => (
                            <span className="text-gray-500">{value}</span>
                        ),
                    },
                    {
                        key: "total_amount",
                        label: "TOTAL",
                        render: (value) => (
                            <span className="font-semibold text-emerald-600">
                                {formatCurrency(value)}
                            </span>
                        ),
                    },
                    {
                        key: "payment_status",
                        label: "STATUS PEMBAYARAN",
                        render: (value) => {
                            const { label, type } = getPaymentStatus(value);
                            return <StatusBadge status={label} type={type} />;
                        },
                    },
                    {
                        key: "payment_type",
                        label: "METODE",
                        render: (value) => getPaymentTypeLabel(value),
                    },
                    {
                        key: "created_at",
                        label: "TANGGAL",
                        render: (value) => (
                            <span className="text-sm">{formatDate(value)}</span>
                        ),
                    },
                ]}
                onView={handleViewOrder}
                onDelete={handleDeleteOrder}
                searchPlaceholder="Cari pesanan..."
                emptyMessage="Tidak ada pesanan ditemukan."
            />

            {/* ==================== ORDER DETAIL MODAL ==================== */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header Modal */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Detail Pesanan
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Order Info */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4">
                                    Informasi Pesanan
                                </h4>
                                <div className="grid grid-cols-2 gap-y-6 text-sm">
                                    <div>
                                        <p className="text-gray-500">
                                            Nomor Order
                                        </p>
                                        <p className="font-medium mt-1">
                                            {selectedOrder.order_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Tanggal</p>
                                        <p className="font-medium mt-1">
                                            {new Date(
                                                selectedOrder.created_at,
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">
                                            Status Pembayaran
                                        </p>
                                        <div className="mt-1">
                                            {getPaymentStatusBadge(
                                                selectedOrder.payment_status,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">
                                            Metode Pembayaran
                                        </p>
                                        <p className="font-medium capitalize mt-1">
                                            {selectedOrder.payment_type?.replace(
                                                "_",
                                                " ",
                                            ) || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4">
                                    Informasi Customer
                                </h4>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Nama</p>
                                        <p className="font-medium mt-1">
                                            {selectedOrder.customer_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium mt-1">
                                            {selectedOrder.customer_email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Alamat</p>
                                        <p className="font-medium mt-1">
                                            {selectedOrder.customer_address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Midtrans Info */}
                            {selectedOrder.snap_token && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-[#FF751F]" />
                                        Midtrans Payment
                                    </h4>
                                    <div className="p-5 bg-gray-50 rounded-2xl">
                                        <p className="text-sm text-gray-500 mb-2">
                                            Snap Token
                                        </p>
                                        <p className="font-mono text-sm font-medium break-all text-gray-700">
                                            {selectedOrder.snap_token}
                                        </p>
                                        <button className="mt-5 w-full py-3 bg-[#FF751F] hover:bg-[#E66A1B] text-white font-medium rounded-2xl transition-colors">
                                            Lihat di Midtrans Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-gray-800">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-3xl font-bold text-emerald-600">
                                        {formatCurrency(
                                            selectedOrder.total_amount,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
