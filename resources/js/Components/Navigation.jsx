import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, User } from "lucide-react";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
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

                    {/* Auth Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-[#44403c] hover:text-[#ea580c] transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-2 px-4 py-2 transition ${
                                        url === "/profile"
                                            ? "text-[#ea580c] font-semibold border-b-2 border-[#f97316]"
                                            : "text-[#44403c] hover:text-[#ea580c]"
                                    }`}
                                >
                                    <User className="w-5 h-5" />
                                    Profil
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Login */}
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-[#44403c] hover:text-[#ea580c] transition font-medium"
                                >
                                    Login
                                </Link>
                                {/* Daftar - WARNA LANGSUNG */}
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-6 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition font-medium shadow-sm"
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
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                                <Link
                                    href="/dashboard"
                                    className="block px-4 py-2 text-[#44403c] hover:bg-[#fff7ed] rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                                        url === "/profile"
                                            ? "bg-[#fff7ed] text-[#ea580c] font-semibold"
                                            : "text-[#44403c] hover:bg-[#fff7ed]"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="w-5 h-5" />
                                    Profil
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block px-4 py-2 text-[#44403c] hover:bg-[#fff7ed] rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition font-medium"
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
