import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-secondary-900 text-white mt-20">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary-400">PT Bina Auto Solusi</h3>
                        <p className="text-secondary-300 mb-4">
                            Penyedia solusi terbaik untuk sektor konstruksi dan ritel dengan komitmen kualitas dan inovasi.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-secondary-300 hover:text-primary-400 transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-secondary-300 hover:text-primary-400 transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-secondary-300 hover:text-primary-400 transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-secondary-300 hover:text-primary-400 transition">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-primary-400">Menu</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-secondary-300 hover:text-primary-400 transition">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-secondary-300 hover:text-primary-400 transition">
                                    Kategori
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-secondary-300 hover:text-primary-400 transition">
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/films" className="text-secondary-300 hover:text-primary-400 transition">
                                    Film
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-secondary-300 hover:text-primary-400 transition">
                                    Tentang Kami
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-primary-400">Hubungi Kami</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2">
                                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <span className="text-secondary-300">Jl. Industri No. 123, Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="w-5 h-5 text-primary-400" />
                                <a href="tel:+621234567890" className="text-secondary-300 hover:text-primary-400 transition">
                                    +62 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-primary-400" />
                                <a href="mailto:info@binaauto.com" className="text-secondary-300 hover:text-primary-400 transition">
                                    info@binaauto.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-primary-400">Newsletter</h4>
                        <p className="text-secondary-300 mb-3 text-sm">
                            Daftarkan email Anda untuk mendapatkan update terbaru.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Email Anda"
                                className="px-4 py-2 rounded bg-secondary-800 text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition font-medium"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-secondary-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-secondary-400 text-sm">
                        &copy; 2024 PT Bina Auto Solusi. Semua hak dilindungi.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                        <a href="#" className="text-secondary-400 hover:text-primary-400 transition">
                            Kebijakan Privasi
                        </a>
                        <a href="#" className="text-secondary-400 hover:text-primary-400 transition">
                            Syarat Layanan
                        </a>
                        <a href="#" className="text-secondary-400 hover:text-primary-400 transition">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
