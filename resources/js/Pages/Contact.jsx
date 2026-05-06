import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
    return (
        <PublicLayout
            title="Kontak"
            description="Hubungi PT Bina Auto Solusi untuk pertanyaan atau informasi lebih lanjut"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Hubungi Kami
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                        Kami siap membantu Anda. Silakan hubungi kami melalui
                        kontak di bawah ini.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Telepon & WhatsApp */}
                        <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-7 h-7 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
                                        Telepon / WhatsApp
                                    </h3>
                                    <a
                                        href="https://wa.me/628139854308"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl font-medium text-green-600 hover:text-green-700 transition block"
                                    >
                                        +62 813 9854 308
                                    </a>
                                    <p className="text-secondary-500 mt-1 text-sm">
                                        Klik untuk chat WhatsApp
                                    </p>
                                    <p className="text-secondary-600 text-sm mt-4">
                                        Senin - Jumat: 09:00 - 17:00
                                        <br />
                                        Sabtu: 09:00 - 13:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        {/* Email Card */}
                        <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
                                        Email
                                    </h3>
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=info@binaauto.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl text-secondary-700 hover:text-primary-600 transition block mb-2"
                                    >
                                        info@binaauto.com
                                    </a>
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=support@binaauto.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl text-secondary-700 hover:text-primary-600 transition block"
                                    >
                                        support@binaauto.com
                                    </a>
                                    <p className="text-sm text-secondary-500 mt-3">
                                        Klik untuk buka Gmail langsung
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition md:col-span-2 lg:col-span-1">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-7 h-7 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
                                        Alamat
                                    </h3>
                                    <p className="text-secondary-600 leading-relaxed text-lg">
                                        Jl. Raya Narogong Km. 12, Bantargebang,
                                        <br />
                                        Bekasi, Jawa Barat 17151
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Jam Operasional */}
                        <div className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition md:col-span-2 lg:col-span-1">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-7 h-7 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
                                        Jam Operasional
                                    </h3>
                                    <div className="space-y-2 text-secondary-600">
                                        <p>
                                            <span className="font-medium">
                                                Senin - Jumat:
                                            </span>{" "}
                                            09:00 - 17:00
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Sabtu:
                                            </span>{" "}
                                            09:00 - 13:00
                                        </p>
                                        <p className="text-red-600">
                                            Minggu: Tutup
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Maps */}
            <section className="h-[500px] bg-secondary-100">
                <iframe
                    title="Lokasi PT Bina Auto Solusi"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.47!2d106.9835633!3d-6.31220075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5f5f5f5f5f5%3A0x0!2sJalan%20Raya%20Narogong%2C%20Bantargebang%2C%20Bekasi!5e0!3m2!1sid!2sid!4v1746000000000"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>
        </PublicLayout>
    );
}
