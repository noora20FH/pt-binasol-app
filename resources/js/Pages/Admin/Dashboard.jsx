import React from "react";
import {
    Film,
    ShoppingBag,
    HardHat,
    ShoppingCart,
    TrendingUp,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Dashboard({
    totalFilms,
    totalRetail,
    totalConstruction,
    totalOrders,
    recentOrders = [],
}) {
    const stats = [
        {
            label: "Total Film",
            value: totalFilms.toString(),
            icon: Film,
            color: "bg-blue-500",
            change: "+12%",
        },
        {
            label: "Produk Retail",
            value: totalRetail.toString(),
            icon: ShoppingBag,
            color: "bg-green-500",
            change: "+8%",
        },
        {
            label: "Produk Konstruksi",
            value: totalConstruction.toString(),
            icon: HardHat,
            color: "bg-orange-500",
            change: "+15%",
        },
        {
            label: "Total Order",
            value: totalOrders.toString(),
            icon: ShoppingCart,
            color: "bg-purple-500",
            change: "+23%",
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            settlement: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            expire: "bg-gray-100 text-gray-800",
            cancel: "bg-red-100 text-red-800",
        };

        const labels = {
            settlement: "Lunas",
            pending: "Pending",
            expire: "Kedaluwarsa",
            cancel: "Dibatalkan",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
            >
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AdminLayout title="Dashboard" activeTab="dashboard">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-[#FF751F] to-[#FF751F] rounded-lg p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        Selamat Datang di CMS PT Binasol
                    </h1>
                    <p className="text-white/90">
                        Kelola konten untuk Perfilman, Retail, dan Konstruksi
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Pesanan Terbaru
                        </h3>

                        {/* Tombol Lihat Selengkapnya */}
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-[#FF751F] hover:text-orange-600 transition-colors"
                        >
                            Lihat selengkapnya
                            <span className="text-lg leading-none">→</span>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nomor Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.customer}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Belum ada pesanan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
