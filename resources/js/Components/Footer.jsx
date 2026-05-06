import React from "react";
import { Link } from "@inertiajs/react";
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#111827] text-white mt-20">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-[#f97316]">
                            PT Bina Auto Solusi
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Penyedia solusi terbaik untuk sektor konstruksi dan
                            ritel dengan komitmen kualitas dan inovasi.
                        </p>
                        <div className="flex space-x-5">
                            {[
                                { Icon: Facebook },
                                { Icon: Instagram },
                                { Icon: Twitter },
                                { Icon: Linkedin },
                            ].map(({ Icon }, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="text-gray-400 hover:text-[#f97316] transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">
                            Menu
                        </h4>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    Kategori
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/films"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    Film
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sewa-ruangan"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    Sewa Ruangan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    Tentang Kami
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">
                            Hubungi Kami
                        </h4>
                        <ul className="space-y-4 text-gray-400">
                            {/* WhatsApp */}
                            <li className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-[#f97316] mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://wa.me/628139854308"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#f97316] transition-colors"
                                >
                                    +62 813 9854 308
                                </a>
                            </li>

                            {/* Email */}
                            <li className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-[#f97316] mt-0.5 flex-shrink-0" />
                                <div>
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=info@binaauto.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#f97316] transition-colors block"
                                    >
                                        info@binaauto.com
                                    </a>
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=support@binaauto.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#f97316] transition-colors"
                                    >
                                        support@binaauto.com
                                    </a>
                                </div>
                            </li>

                            {/* Alamat */}
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-[#f97316] mt-0.5 flex-shrink-0" />
                                <span>
                                    Jl. Raya Narogong Km. 12 17151
                                    <br />
                                    Kota Bekasi, Jawa Barat
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">
                            Newsletter
                        </h4>
                        <p className="text-gray-400 mb-4 text-sm">
                            Daftarkan email Anda untuk mendapatkan update
                            terbaru.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email Anda"
                                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition-all active:scale-95"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} PT Bina Auto Solusi.
                        Semua hak dilindungi.
                    </p>
                    <div className="flex flex-wrap gap-x-6">
                        <a
                            href="#"
                            className="hover:text-[#f97316] transition-colors"
                        >
                            Kebijakan Privasi
                        </a>
                        <a
                            href="#"
                            className="hover:text-[#f97316] transition-colors"
                        >
                            Syarat Layanan
                        </a>
                        <a
                            href="#"
                            className="hover:text-[#f97316] transition-colors"
                        >
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
