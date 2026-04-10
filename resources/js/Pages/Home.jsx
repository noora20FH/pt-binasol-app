import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { PrimaryButton } from '@/Components/Button';

export default function Home({ slides, categories, featuredProducts, featuredFilms, testimonials, teamMembers }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <PublicLayout
            title="Beranda"
            description="PT Bina Auto Solusi - Penyedia solusi terbaik untuk sektor konstruksi dan ritel"
        >
            {/* Hero Carousel */}
            {slides && slides.length > 0 ? (
                <section className="relative h-96 md:h-screen overflow-hidden">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div
                                className={`absolute inset-0 ${
                                    slide.theme === 'dark' ? 'bg-black/40' : 'bg-white/20'
                                }`}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white max-w-3xl px-4">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                                        {slide.title}
                                    </h1>
                                    {slide.subtitle && (
                                        <p className="text-xl md:text-2xl mb-8 text-white font-semibold">{slide.subtitle}</p>
                                    )}
                                    {slide.link && (
                                        <PrimaryButton href={slide.link}>
                                            Lihat Selengkapnya
                                        </PrimaryButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Carousel Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition ${
                                    index === currentSlide ? 'bg-primary-500' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                            Selamat Datang di PT Bina Auto Solusi
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white font-semibold">
                            Temukan solusi terbaik untuk kebutuhan Anda bersama PT Bina Auto Solusi
                        </p>
                        <a
                            href="/products"
                            style={{
                                display: 'inline-block',
                                padding: '16px 32px',
                                backgroundColor: '#ffffff',
                                color: '#ea580c',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                textDecoration: 'none',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f4'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                        >
                            Mulai Belanja Sekarang
                        </a>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            <section className="py-16 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12 text-secondary-900">
                        Kategori Produk
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group"
                            >
                                <div className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition h-64 ${category.is_logo ? 'bg-white' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
                                    {category.image && (
                                        <img
                                            src={encodeURI(category.image)}
                                            alt={category.name}
                                            className={`w-full h-full transition duration-300 group-hover:scale-110 ${category.is_logo ? 'object-contain p-6' : 'object-cover'}`}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div className={`absolute inset-0 transition ${category.is_logo ? 'bg-black/20 group-hover:bg-black/30' : 'bg-black/30 group-hover:bg-black/50'}`} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <h3 className="text-2xl font-bold text-center">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm mt-2 text-primary-300">
                                            {category.products?.length || 0} Produk
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <PrimaryButton href="/categories">
                            Lihat Semua Kategori
                        </PrimaryButton>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12 text-secondary-900">
                        Produk Unggulan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group"
                            >
                                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
                                    <div className="relative overflow-hidden h-48 bg-secondary-100">
                                        {product.images?.[0]?.image_path && (
                                            <img
                                                src={product.images[0].image_path}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                loading="lazy"
                                            />
                                        )}
                                        {product.badge && (
                                            <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {product.badge}
                                            </div>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-bold">Habis</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div>
                                                <span className="text-primary-600 font-bold text-lg">
                                                    Rp{' '}
                                                    {new Intl.NumberFormat('id-ID').format(
                                                        Math.round(product.price)
                                                    )}
                                                </span>
                                                {product.original_price && (
                                                    <span className="text-secondary-400 line-through text-sm ml-2">
                                                        Rp{' '}
                                                        {new Intl.NumberFormat('id-ID').format(
                                                            Math.round(product.original_price)
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <PrimaryButton href="/products">
                            Lihat Semua Produk
                        </PrimaryButton>
                    </div>
                </div>
            </section>

            {/* Featured Films Section */}
            {featuredFilms && featuredFilms.length > 0 && (
                <section className="py-16 bg-secondary-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-secondary-900">
                            Film & Serial Unggulan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredFilms.map((film) => (
                                <Link
                                    key={film.id}
                                    href={`/films/${film.id}`}
                                    className="group h-full"
                                >
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                                        {/* Poster */}
                                        <div className="relative overflow-hidden bg-secondary-100 aspect-[3/4]">
                                            {film.poster ? (
                                                <img
                                                    src={film.poster}
                                                    alt={film.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23e0e0e0" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-secondary-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">
                                                {film.title}
                                            </h3>
                                            {film.rating && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-primary-500 font-semibold">⭐ {film.rating}</span>
                                                    <span className="text-secondary-500">{film.year}</span>
                                                </div>
                                            )}
                                            {film.genres && (
                                                <p className="text-secondary-500 text-xs mt-2 line-clamp-1">
                                                    {film.genres}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {testimonials.length > 0 && (
                <section className="py-16 bg-secondary-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-secondary-900">
                            Testimoni Pelanggan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-white p-6 rounded-lg shadow-md"
                                >
                                    <div className="flex items-center mb-4">
                                        {testimonial.image && (
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full object-cover mr-4"
                                                loading="lazy"
                                            />
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-secondary-900">
                                                {testimonial.name}
                                            </h4>
                                            <div className="flex text-primary-500">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-secondary-600 italic">
                                        "{testimonial.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Siap memulai?
                    </h2>
                    <p className="text-xl mb-8">
                        Temukan solusi terbaik untuk kebutuhan Anda bersama PT Bina Auto Solusi
                    </p>
                    <a
                        href="/products"
                        style={{
                            display: 'inline-block',
                            padding: '16px 32px',
                            backgroundColor: '#ffffff',
                            color: '#ea580c',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            textDecoration: 'none',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f4'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                    >
                        Jelajahi Sekarang
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
