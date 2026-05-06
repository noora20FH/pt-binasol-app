import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle,
    Truck,
    Calendar,
    FileText,
} from "lucide-react";

export default function OrderDetail({ order }) {
    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                label: "Menunggu Pembayaran",
                color: "bg-yellow-100 text-yellow-700 border-yellow-300",
            },
            settlement: {
                label: "Pembayaran Berhasil",
                color: "bg-green-100 text-green-700 border-green-300",
            },
            expire: {
                label: "Pembayaran Kadaluarsa",
                color: "bg-gray-100 text-gray-700 border-gray-300",
            },
            cancel: {
                label: "Pesanan Dibatalkan",
                color: "bg-red-100 text-red-700 border-red-300",
            },
        };
        return statusMap[status] || statusMap.pending;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const statusInfo = getStatusInfo(order.payment_status);

    const orderTimeline = [
        { label: "Pesanan Dibuat", date: order.created_at, completed: true },
        {
            label: "Menunggu Pembayaran",
            date: order.created_at,
            completed: order.payment_status !== "pending",
        },
        {
            label: "Pembayaran Diterima",
            date:
                order.payment_status === "settlement" ? order.created_at : null,
            completed: order.payment_status === "settlement",
        },
        { label: "Pesanan Diproses", date: null, completed: false },
        { label: "Pesanan Dikirim", date: null, completed: false },
        { label: "Pesanan Selesai", date: null, completed: false },
    ];

    const handlePayNow = (order) => {
        if (!order.snap_token) {
            alert("Snap token belum tersedia. Silakan hubungi admin.");
            return;
        }
        // Midtrans Snap.js akan di-load di layout atau di sini
        window.snap.pay(order.snap_token, {
            onSuccess: function (result) {
                console.log("success", result);
                router.get(route("orders.show", order.id)); // refresh halaman
            },
            onPending: function (result) {
                console.log("pending", result);
                router.get(route("orders.show", order.id));
            },
            onError: function (result) {
                console.log("error", result);
            },
        });
    };

    return (
        <PublicLayout
            title={`Detail Pesanan ${order.order_number}`}
            description="Lihat detail pesanan Anda"
        >
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.get(route("orders.index"))}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Riwayat Pesanan
                    </button>
                    {/* Pesan khusus jika transaksi expired */}
                    {order.payment_status === "expire" && (
                        <div className="max-w-md mx-auto bg-red-50 rounded-lg border border-red-200 p-6 mb-6 text-center shadow-sm">
                            <div className="text-red-600 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline-block w-12 h-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01M12 5.5a7 7 0 110 14 7 7 0 010-14z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-red-700 mb-2">
                                Your transaction has expired
                            </h2>
                            <p className="text-red-600 mb-6">
                                We didn't receive the payment on time. Please
                                place your order again.
                            </p>
                            <button
                                onClick={() =>
                                    router.get(route("products.index"))
                                }
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
                            >
                                Return to merchant’s page
                            </button>
                        </div>
                    )}


                    {order.payment_status !== "expire" && (
                        <>
                            {/* Header */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                            Detail Pesanan
                                        </h1>
                                        <p className="text-gray-600">
                                            No. Pesanan:{" "}
                                            <span className="font-semibold text-gray-900">
                                                {order.order_number}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div
                                        className={`px-4 py-2 rounded-xl border-2 font-semibold ${statusInfo.color}`}
                                    >
                                        {statusInfo.label}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            {order.payment_status !== "cancel" && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                                        Status Pesanan
                                    </h2>
                                    <div className="relative">
                                        {orderTimeline.map((step, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4 pb-8 last:pb-0"
                                            >
                                                <div className="relative flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            step.completed
                                                                ? "bg-primary-500"
                                                                : "bg-gray-200"
                                                        }`}
                                                    >
                                                        {step.completed ? (
                                                            <CheckCircle className="w-6 h-6 text-white" />
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    {index <
                                                        orderTimeline.length -
                                                            1 && (
                                                        <div
                                                            className={`w-0.5 h-full absolute top-10 ${
                                                                step.completed
                                                                    ? "bg-primary-500"
                                                                    : "bg-gray-200"
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <p
                                                        className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}
                                                    >
                                                        {step.label}
                                                    </p>
                                                    {step.date && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(
                                                                step.date,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                },
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Informasi Pembeli */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <Package className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Informasi Pembeli
                                        </h2>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500">
                                                Nama
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {order.customer_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                Email
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {order.customer_email}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                Telepon
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {order.customer_phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Alamat Pengiriman */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Alamat Pengiriman
                                        </h2>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        {order.customer_address}
                                    </p>
                                </div>
                            </div>

                            {/* Detail Produk */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Produk yang Dipesan
                                </h2>
                                <div className="space-y-4">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                        >
                                            {item.product?.images?.[0] && (
                                                <img
                                                    src={
                                                        item.product.images[0]
                                                            .image_url
                                                    }
                                                    alt={item.product.name}
                                                    className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {item.product?.name ||
                                                        "Produk"}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.quantity} x{" "}
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">
                                                    {formatPrice(
                                                        item.quantity *
                                                            item.price,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ringkasan Pembayaran */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Ringkasan Pembayaran
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">
                                            {formatPrice(order.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ongkos Kirim</span>
                                        <span className="font-semibold">
                                            {order.shipping === 0
                                                ? "GRATIS"
                                                : formatPrice(order.shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>PPN (11%)</span>
                                        <span className="font-semibold">
                                            {formatPrice(order.tax)}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">
                                                Total Pembayaran
                                            </span>
                                            <span className="text-2xl font-bold text-primary-600">
                                                {formatPrice(
                                                    order.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CreditCard className="w-4 h-4" />
                                            <span>
                                                Metode Pembayaran:{" "}
                                                <span className="font-semibold capitalize">
                                                    {order.payment_type?.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {order.payment_status === "pending" && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-sm text-yellow-800 mb-3">
                                            <strong>Menunggu Pembayaran</strong>
                                            <br />
                                            Silakan selesaikan pembayaran Anda
                                            sebelum batas waktu berakhir.
                                        </p>
                                        <button
                                            onClick={() => handlePayNow(order)}
                                            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/40 text-lg"
                                        >
                                            Bayar Sekarang
                                        </button>
                                    </div>
                                )}

                                {order.payment_status === "settlement" && (
                                    <div className="mt-6 flex gap-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-all">
                                            <FileText className="w-4 h-4" />
                                            Download Invoice
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    route("products.index"),
                                                )
                                            }
                                            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all"
                                        >
                                            Belanja Lagi
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
