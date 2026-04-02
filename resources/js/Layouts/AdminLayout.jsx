import React, { useState } from "react";
import {
    Film,
    ShoppingBag,
    HardHat,
    ShoppingCart,
    Users,
    ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Search,
} from "lucide-react";

import { Link, usePage } from '@inertiajs/react';

// Logo
import logoImage from "/public/logo.png";

export default function AdminLayout({
    children,
    title = "Dashboard",
    activeTab = "dashboard",
    onTabChange,
}) {
    const user = usePage().props.auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: route('admin.dashboard') },
        { id: "perfilman", label: "Perfilman", icon: Film, href: "/admin/movies" },
        { id: "retail", label: "Retail", icon: ShoppingBag, href: "/admin/retail-products" },
        { id: "konstruksi", label: "Konstruksi", icon: HardHat, href: "/admin/construction-products" },
        { id: "orders", label: "Orders & Penjualan", icon: ShoppingCart, href: "/admin/orders" },
        { id: "team", label: "Tim", icon: Users, href: "/admin/team-members" },
        { id: "carousel", label: "Carousel", icon: ImageIcon, href: "/admin/carousel-slides" },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-white text-gray-800 transition-all duration-300 z-50 md:z-40 shadow-lg ${
                    sidebarOpen ? "w-[250px]" : "w-0 md:w-0"
                } overflow-hidden`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-center px-4 border-b border-gray-200">
                    <img
                        src={logoImage}
                        alt="PT Binasol"
                        className="w-full object-contain"
                    />
                </div>

                {/* Navigation — HANYA BAGIAN INI YANG DIPERBAIKI */}
                <nav className="py-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                                    isActive
                                        ? "bg-[#FF751F] text-white"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-[#FF751F]"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#FF751F] rounded transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${
                    sidebarOpen ? "md:ml-[250px]" : "md:ml-0"
                }`}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {title && (
                            <h2 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h2>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                            />
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#FF751F] rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || 'Administrator'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
