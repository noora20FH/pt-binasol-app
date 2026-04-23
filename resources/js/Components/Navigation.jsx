import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const { url, auth } = usePage().props;

    const navLinks = [
        { label: 'Beranda', href: '/' },
        { label: 'Kategori', href: '/categories' },
        { label: 'Produk', href: '/products' },
        { label: 'Film', href: '/films' },
        { label: 'Sewa Ruangan', href: '/sewa-ruangan' },
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Kontak', href: '/contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-primary-500">
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
                                        ? 'text-primary-600 font-semibold border-b-2 border-primary-500'
                                        : 'text-secondary-700 hover:text-primary-600'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-secondary-700 hover:text-primary-600 transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className="px-4 py-2 text-secondary-700 hover:text-primary-600 transition"
                                >
                                    Profil
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-secondary-700 hover:text-primary-600 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-secondary-900"
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
                                        ? 'bg-primary-50 text-primary-600 font-semibold'
                                        : 'text-secondary-700 hover:bg-primary-50'
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
                                    className="block px-4 py-2 text-secondary-700 hover:bg-primary-50 rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-secondary-700 hover:bg-primary-50 rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profil
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block px-4 py-2 text-secondary-700 hover:bg-primary-50 rounded transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
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
