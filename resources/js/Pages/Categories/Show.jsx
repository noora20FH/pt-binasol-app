import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { PrimaryButton } from '@/Components/Button';
import { ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight, CheckCircle, X, ZoomIn } from 'lucide-react';

// Lightbox Modal
function Lightbox({ images, startIndex, onClose }) {
    const [current, setCurrent] = useState(startIndex);

    const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
    const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') prev();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [prev, next, onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            {/* Close */}
            <button
                className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition z-10"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
                {current + 1} / {images.length}
            </div>

            {/* Prev */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition z-10"
                onClick={(e) => { e.stopPropagation(); prev(); }}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
                src={encodeURI(images[current].image_path)}
                alt={`Gambar ${current + 1}`}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition z-10"
                onClick={(e) => { e.stopPropagation(); next(); }}
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                        className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition ${
                            current === i ? 'border-white' : 'border-white/30'
                        }`}
                    >
                        <img src={encodeURI(img.image_path)} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}

// Carousel Image Viewer with swipe + lightbox
function ProductImageCarousel({ images, productName }) {
    const [current, setCurrent] = useState(0);
    const [imgError, setImgError] = useState({});
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const dragStart = useRef(null);
    const trackRef = useRef(null);

    const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

    // Mouse drag
    const onMouseDown = (e) => { dragStart.current = e.clientX; };
    const onMouseUp = (e) => {
        if (dragStart.current === null) return;
        const diff = dragStart.current - e.clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        dragStart.current = null;
    };

    // Touch swipe
    const onTouchStart = (e) => { dragStart.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (dragStart.current === null) return;
        const diff = dragStart.current - e.changedTouches[0].clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        dragStart.current = null;
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {/* Main Image — draggable + clickable */}
                <div
                    ref={trackRef}
                    className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {images[current] && !imgError[current] ? (
                        <img
                            src={encodeURI(images[current].image_path)}
                            alt={`${productName} ${current + 1}`}
                            className="w-full h-full object-cover pointer-events-none"
                            onError={() => setImgError((e) => ({ ...e, [current]: true }))}
                            draggable={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                    )}

                    {/* Zoom / open lightbox button */}
                    <button
                        className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition"
                        onClick={() => setLightboxOpen(true)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Dot indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`block rounded-full transition-all ${
                                        current === i ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    {images.length > 1 && (
                        <>
                            <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={prev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={next}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails — scrollable */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                                    current === i ? 'border-purple-500' : 'border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                {!imgError[i] ? (
                                    <img
                                        src={encodeURI(img.image_path)}
                                        alt={`thumb ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError((e) => ({ ...e, [i]: true }))}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <Lightbox images={images} startIndex={current} onClose={() => setLightboxOpen(false)} />
            )}
        </>
    );
}

// Product Detail Card (layout seperti di gambar)
function ProductDetailCard({ product }) {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const res = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ product_id: product.id, quantity: qty }),
            });
            const data = await res.json();
            if (data.success) alert('Produk berhasil ditambahkan ke keranjang!');
        } catch {
            alert('Gagal menambahkan ke keranjang');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Image Carousel */}
                <div className="p-4 md:p-6 bg-gray-50">
                    <ProductImageCarousel images={product.images || []} productName={product.name} />
                </div>

                {/* Right: Product Info */}
                <div className="p-5 md:p-7 flex flex-col gap-4">
                    {/* Badge */}
                    {product.badge && (
                        <span className="self-start px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            {product.badge}
                        </span>
                    )}

                    {/* Name */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {product.name}
                    </h2>

                    {/* Stars */}
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">
                            ({product.testimonials?.length || 0} ulasan)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-2xl font-bold text-purple-600">
                            Rp {new Intl.NumberFormat('id-ID').format(Math.round(product.price))}
                        </span>
                        {product.original_price && (
                            <>
                                <span className="text-gray-400 line-through text-base">
                                    Rp {new Intl.NumberFormat('id-ID').format(Math.round(product.original_price))}
                                </span>
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        Hemat {discount}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    <p className="text-xs text-gray-500">Gratis ongkir untuk pembelian di atas Rp 100.000</p>

                    {/* Description */}
                    {product.description && (
                        <div className="bg-purple-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
                            {product.description}
                        </div>
                    )}

                    {/* Specifications */}
                    {product.specifications?.length > 0 && (
                        <div>
                            <p className="font-semibold text-gray-800 mb-2 text-sm">Isi Paket:</p>
                            <ul className="space-y-1">
                                {product.specifications.map((spec, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                                        {spec.property}: {spec.value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Add to Cart */}
                    {product.stock > 0 ? (
                        <div className="flex items-center gap-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full font-bold text-white text-sm transition"
                                style={{ background: loading ? '#a855f780' : 'linear-gradient(135deg, #a855f7, #ec4899)' }}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {loading ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                            </button>
                            <button className="p-3 rounded-full border border-gray-200 hover:border-pink-400 hover:text-pink-500 transition">
                                <Heart className="w-4 h-4" />
                            </button>
                            <button className="p-3 rounded-full border border-gray-200 hover:border-purple-400 hover:text-purple-500 transition">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="py-3 text-center text-red-500 font-semibold text-sm bg-red-50 rounded-lg">
                            Stok Habis
                        </div>
                    )}

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-1 pt-2 border-t border-gray-100">
                        {['Garansi Uang Kembali 100%', 'Pengiriman Cepat & Gratis', 'Produk Berkualitas', 'Pembayaran Aman & Terpercaya'].map((t) => (
                            <div key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function CategoryShow({ category }) {
    const categoryProducts = category?.products || [];
    const hasProducts = categoryProducts.length > 0;

    return (
        <PublicLayout title={category.name} description={category.description}>
            {/* Breadcrumb */}
            <div className="bg-secondary-50 py-3 md:py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 text-xs md:text-sm text-secondary-600">
                        <Link href="/" className="hover:text-primary-600">Beranda</Link>
                        <span>/</span>
                        <Link href="/categories" className="hover:text-primary-600">Kategori</Link>
                        <span>/</span>
                        <span className="text-secondary-900 font-semibold truncate">{category.name}</span>
                    </div>
                </div>
            </div>

            {/* Category Header */}
            <section className="py-8 md:py-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
                        {category.image && (
                            <div className="h-40 md:h-48 rounded-xl overflow-hidden bg-white/20">
                                <img
                                    src={encodeURI(category.image)}
                                    alt={category.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                        <div className={category.image ? 'md:col-span-2' : 'md:col-span-3'}>
                            <h1 className="text-2xl md:text-4xl font-bold mb-3">{category.name}</h1>
                            {category.description && (
                                <p className="text-sm md:text-lg leading-relaxed mb-4 text-white/90">
                                    {category.description}
                                </p>
                            )}
                            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm">
                                {categoryProducts.length} Produk
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-10 md:py-16 bg-gray-50 min-h-96">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasProducts ? (
                        <>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                                Produk {category.name}
                            </h2>
                            <div className="flex flex-col gap-6">
                                {categoryProducts.map((product) => (
                                    <ProductDetailCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-secondary-600 text-base md:text-lg mb-4">
                                Tidak ada produk dalam kategori ini
                            </p>
                            <PrimaryButton href="/categories">Kembali ke Kategori</PrimaryButton>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
