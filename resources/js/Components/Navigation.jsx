import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Menu, X, LogOut, ShoppingCart, Package } from "lucide-react";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { url, auth } = usePage().props;

    const navLinks = [
        { label: "Beranda", href: "/" },
        { label: "Kategori", href: "/categories" },
        { label: "Produk", href: "/products" },
        { label: "Film", href: "/films" },
        { label: "Sewa Ruangan", href: "/sewa-ruangan" },
        { label: "Tentang Kami", href: "/about" },
        { label: "Kontak", href: "/contact" },
    ];

    // Ambil inisial untuk avatar
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    // Handler Logout (menggunakan Inertia router - cara resmi)
    const handleLogout = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        setIsOpen(false);
        router.post(route("logout"));
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-[#f97316]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 h-16">
                        <img
                            src="/logo.png"
                            alt="PT Bina Auto Solusi"
                            className="h-14 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition ${
                                    url === link.href
                                        ? "text-[#ea580c] font-semibold border-b-2 border-[#f97316]"
                                        : "text-[#44403c] hover:text-[#ea580c]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Section - Desktop with Cart, Orders & User Dropdown */}
                    <div className="hidden md:flex items-center gap-x-4">
                        {auth.user ? (
                            <>
                                {/* Cart & Order History - hanya untuk Customer */}
                                {auth.user.role === "customer" && (
                                    <>
                                        <Link
                                            href={route("cart.view")}
                                            className="p-2 text-secondary-700 hover:text-primary-600 transition relative"
                                            title="Keranjang"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </Link>

                                        <Link
                                            href={route("orders.index")}
                                            className="p-2 text-secondary-700 hover:text-primary-600 transition relative"
                                            title="Riwayat Pesanan"
                                        >
                                            <Package className="w-5 h-5" />
                                        </Link>
                                    </>
                                )}

                                {/* User Avatar + Dropdown */}
                                <div className="relative">
                                    {/* Trigger Dropdown */}
                                    <button
                                        onClick={() =>
                                            setDropdownOpen(!dropdownOpen)
                                        }
                                        className="flex items-center gap-3 px-4 py-2 transition hover:bg-[#fff7ed] rounded-2xl focus:outline-none"
                                    >
                                        {/* Avatar dengan inisial */}
                                        <div className="w-9 h-9 bg-[#ea580c] text-white rounded-2xl flex items-center justify-center font-semibold text-lg shadow-sm">
                                            {getInitial(auth.user.name)}
                                        </div>

                                        {/* Nama + Email */}
                                        <div className="flex flex-col text-left">
                                            <span className="text-[#44403c] font-medium">
                                                {auth.user.name}
                                            </span>
                                            <span className="text-xs text-[#78716b]">
                                                {auth.user.email}
                                            </span>
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-5 py-3 text-[#44403c] hover:bg-[#fff7ed] transition"
                                                onClick={() =>
                                                    setDropdownOpen(false)
                                                }
                                            >
                                                <span className="text-lg">
                                                    👤
                                                </span>
                                                <span className="font-medium">
                                                    Profil
                                                </span>
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition font-medium border-t border-gray-100"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route("cart.view")}
                                    className="p-2 text-secondary-700 hover:text-primary-600 transition relative"
                                    title="Keranjang"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-[#44403c] hover:text-[#ea580c] transition font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-6 py-2 bg-[#ea580c] text-white rounded-2xl hover:bg-[#c2410c] transition font-medium shadow-sm ml-4"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-[#44403c]"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2 rounded transition ${
                                    url === link.href
                                        ? "bg-[#fff7ed] text-[#ea580c] font-semibold"
                                        : "text-[#44403c] hover:bg-[#fff7ed]"
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <hr className="my-2" />

                        {auth.user ? (
                            <>
                                {auth.user.role === "customer" && (
                                    <>
                                        <Link
                                            href={route("cart.view")}
                                            className="flex items-center gap-2 px-4 py-2 text-secondary-700 hover:bg-primary-50 rounded transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Keranjang
                                        </Link>
                                        <Link
                                            href={route("orders.index")}
                                            className="flex items-center gap-2 px-4 py-2 text-secondary-700 hover:bg-primary-50 rounded transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Package className="w-4 h-4" />
                                            Pesanan Saya
                                        </Link>
                                    </>
                                )}
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-3 bg-[#fff7ed] rounded-2xl transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-xl">👤</span>
                                    <span className="font-medium">Profil</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route("cart.view")}
                                    className="flex items-center gap-2 px-4 py-2 text-secondary-700 hover:bg-primary-50 rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Keranjang
                                </Link>
                                <Link
                                    href="/login"
                                    className="block px-4 py-2 text-[#44403c] hover:bg-[#fff7ed] rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 bg-[#ea580c] text-white rounded-2xl hover:bg-[#c2410c] transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
