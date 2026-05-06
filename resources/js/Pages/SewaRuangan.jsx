import React, { useState, useEffect, useRef } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Check,
    Users,
    Wifi,
    Coffee,
    AirVent,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel({ rooms }) {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const slides =
        rooms.length > 0
            ? rooms
            : [
                  {
                      id: 0,
                      name: "Ruang Meeting Executive",
                      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
                      description:
                          "Solusi sempurna untuk rapat bisnis Anda dengan fasilitas premium",
                  },
              ];

    const startTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((c) => (c + 1) % slides.length);
        }, 4000);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, [slides.length]);

    const goTo = (idx) => {
        setCurrent(idx);
        startTimer();
    };
    const prev = () => goTo((current - 1 + slides.length) % slides.length);
    const next = () => goTo((current + 1) % slides.length);

    const slide = slides[current];

    return (
        <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 transition-opacity duration-700">
                {slide.image ? (
                    <img
                        src={slide.image}
                        alt={slide.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
                )}

                {/* Overlay yang sudah dipudarkan */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />
            </div>

            {/* Content */}

            {/* Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition z-10"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition z-10"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`rounded-full transition-all ${i === current ? "w-6 h-2.5 bg-amber-400" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({ room }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-slate-200 flex flex-col">
            {/* Image */}
            <div className="relative h-56 sm:h-64 overflow-hidden group">
                {room.image && !imgError ? (
                    <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                        <span className="text-slate-500 text-sm">
                            Tidak ada gambar
                        </span>
                    </div>
                )}
                {room.type && (
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1.5 rounded-lg font-semibold shadow-lg text-xs sm:text-sm">
                        {room.type}
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                        {room.name}
                    </h3>
                    <div className="flex items-center gap-4 text-white/90 text-xs sm:text-sm">
                        {room.capacity && (
                            <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                <span>{room.capacity}</span>
                            </div>
                        )}
                        {room.size && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{room.size}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6 flex flex-col flex-1">
                {room.description && (
                    <p className="text-slate-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                        {room.description}
                    </p>
                )}

                {/* Facilities */}
                {room.facilities && room.facilities.length > 0 && (
                    <div className="mb-5">
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Check className="w-4 h-4 text-amber-600" />
                            Fasilitas Lengkap
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {room.facilities.map((facility, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-600"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
                                    <span>{facility}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA - WhatsApp */}
                <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    {room.price_unit && (
                        <span className="text-xs text-slate-500 italic">
                            {room.price_unit}
                        </span>
                    )}

                    <a
                        href={`https://wa.me/6289651969329?text=Halo%20PT%20Bina%20Auto%20Solusi,%20saya%20tertarik%20untuk%20menyewa%20ruangan%20*${encodeURIComponent(room.name)}*. Mohon%20informasi%20lebih%20lanjut%20dan%20ketersediaannya.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-semibold rounded-lg shadow-md transition text-sm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 2C6.48 2 2 6.59 2 12.253c0 2.8 1.15 5.35 3.02 7.2L3 22l2.72-1.01c1.72.95 3.68 1.5 5.75 1.5 5.52 0 10-4.59 10-10.247S17.52 2 12 2zm0 18.25c-1.85 0-3.65-.52-5.2-1.5l-.37-.22-3.85 1.43 1.45-3.8-.24-.37C2.8 14.3 2 13.2 2 12.253 2 7.7 6.48 3.25 12 3.25s10 4.45 10 9.003c0 4.55-4.48 9-10 9z" />
                        </svg>
                        Pesan Sekarang
                    </a>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SewaRuangan({ rooms = [] }) {
    const features = [
        {
            icon: Wifi,
            title: "WiFi Super Cepat",
            desc: "Koneksi internet fiber optic hingga 100 Mbps untuk mendukung aktivitas Anda",
        },
        {
            icon: AirVent,
            title: "AC Premium",
            desc: "Sistem pendingin udara terbaik untuk kenyamanan maksimal sepanjang hari",
        },
        {
            icon: Coffee,
            title: "Coffee & Snack",
            desc: "Tersedia coffee break dan area pantry untuk kenyamanan meeting Anda",
        },
        {
            icon: Clock,
            title: "Fleksibel 24/7",
            desc: "Booking kapan saja dengan sistem pemesanan yang mudah dan cepat",
        },
    ];

    return (
        <PublicLayout
            title="Sewa Ruangan"
            description="Sewa ruangan meeting, conference, dan event space premium di PT Bina Auto Solusi"
        >
            {/* Hero Carousel */}
            <HeroCarousel rooms={rooms} />

            {/* Stats */}
            <section className="bg-white py-8 sm:py-12 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                        {[
                            {
                                value:
                                    rooms.length > 0
                                        ? `${rooms.length}+`
                                        : "6+",
                                label: "Jenis Ruangan",
                            },
                            { value: "150+", label: "Kapasitas Maksimal" },
                            { value: "24/7", label: "Layanan Tersedia" },
                            { value: "500+", label: "Klien Puas" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-600 text-xs sm:text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rooms Grid */}
            <section id="ruangan" className="py-12 sm:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                            Pilihan Ruangan Kami
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                            Berbagai pilihan ruangan dengan fasilitas premium
                            untuk memenuhi kebutuhan acara dan rapat Anda
                        </p>
                    </div>

                    {rooms.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                            {rooms.map((room) => (
                                <RoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-500 text-lg mb-4">
                                Belum ada ruangan yang tersedia saat ini.
                            </p>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
                            >
                                Hubungi Kami untuk Informasi
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="bg-slate-50 py-12 sm:py-16 lg:py-20 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                            Mengapa Memilih Kami?
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                            Keunggulan dan kemudahan yang Anda dapatkan saat
                            menyewa ruangan bersama kami
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {features.map((feat, i) => {
                            const Icon = feat.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200"
                                >
                                    <div className="bg-amber-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">
                                        {feat.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600">
                                        {feat.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* CTA - WhatsApp */}
            <section className="bg-gradient-to-r from-amber-600 to-orange-700 py-12 sm:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                        Siap Untuk Memesan Ruangan?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Hubungi kami sekarang untuk mendapatkan penawaran
                        terbaik dan konsultasi gratis
                    </p>

                    <a
                        href="https://wa.me/6289651969329?text=Halo%20PT%20Bina%20Auto%20Solusi,%20saya%20ingin%20mendapatkan%20informasi%20dan%20penawaran%20sewa%20ruangan.%20Terima%20kasih."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-amber-700 hover:bg-slate-50 font-semibold rounded-xl shadow-xl transition-all text-sm sm:text-base gap-3 group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 2C6.48 2 2 6.59 2 12.253c0 2.8 1.15 5.35 3.02 7.2L3 22l2.72-1.01c1.72.95 3.68 1.5 5.75 1.5 5.52 0 10-4.59 10-10.247S17.52 2 12 2zm0 18.25c-1.85 0-3.65-.52-5.2-1.5l-.37-.22-3.85 1.43 1.45-3.8-.24-.37C2.8 14.3 2 13.2 2 12.253 2 7.7 6.48 3.25 12 3.25s10 4.45 10 9.003c0 4.55-4.48 9-10 9z" />
                        </svg>
                        <span>Hubungi via WhatsApp</span>
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
