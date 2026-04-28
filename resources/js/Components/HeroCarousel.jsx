// resources/js/Components/HeroCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PrimaryButton } from '@/Components/Button';

export default function HeroCarousel({
    slides = [],
    height = "h-96 md:h-screen",
    autoPlay = true,
    interval = 5000,
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = useRef(null);

    const startTimer = () => {
        if (!autoPlay || slides.length <= 1) return;
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, interval);
    };

    const stopTimer = () => clearInterval(timerRef.current);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [slides.length, autoPlay]);

    const goTo = (index) => {
        setCurrentSlide(index);
        startTimer();
    };

    const prev = () => goTo((currentSlide - 1 + slides.length) % slides.length);
    const next = () => goTo((currentSlide + 1) % slides.length);

    // Fallback jika tidak ada slides
    if (!slides || slides.length === 0) {
        return (
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                        Selamat Datang di PT Bina Auto Solusi
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white font-semibold">
                        Temukan solusi terbaik untuk kebutuhan Anda
                    </p>
                    <PrimaryButton href="/products">
                        Mulai Belanja Sekarang
                    </PrimaryButton>
                </div>
            </section>
        );
    }

    const slide = slides[currentSlide];

    return (
        <section className={`relative ${height} overflow-hidden`}>
            {/* Background Images (semua slide tetap transition) */}
            {slides.map((s, index) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div
                        className={`absolute inset-0 ${
                            s.theme === 'dark' ? 'bg-black/40' : 'bg-white/20'
                        }`}
                    />
                </div>
            ))}

            {/* Content - HANYA SATU kali render (ini yang memperbaiki bug tombol) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="text-center text-white max-w-3xl px-4 pointer-events-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md">
                        {slide.title}
                    </h1>
                    {slide.subtitle && (
                        <p className="text-xl md:text-2xl mb-8 text-white font-semibold drop-shadow-md">
                            {slide.subtitle}
                        </p>
                    )}
                    {slide.link && (
                        <PrimaryButton href={slide.link}>
                            Lihat Selengkapnya
                        </PrimaryButton>
                    )}
                </div>
            </div>

            {/* Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        onMouseEnter={stopTimer}
                        onMouseLeave={startTimer}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        onMouseEnter={stopTimer}
                        onMouseLeave={startTimer}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                className={`w-3 h-3 rounded-full transition ${
                                    index === currentSlide
                                        ? 'bg-primary-500 scale-110'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
