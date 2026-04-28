import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ShoppingCart, Share2, Heart, Star, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

// ── Lightbox ──────────────────────────────────────────────────────────────────
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
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }, [prev, next, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={onClose}>
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 z-10 transition" onClick={onClose}>
                <X className="w-6 h-6" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
                {current + 1} / {images.length}
            </div>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 z-10 transition"
                onClick={(e) => { e.stopPropagation(); prev(); }}>
                <ChevronLeft className="w-6 h-6" />
            </button>
            <img
                src={encodeURI(images[current].image_path)}
                alt={`Gambar ${current + 1}`}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 z-10 transition"
                onClick={(e) => { e.stopPropagation(); next(); }}>
                <ChevronRight className="w-6 h-6" />
            </button>
            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
                {images.map((img, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                        className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition ${current === i ? 'border-white' : 'border-white/30'}`}>
                        <img src={encodeURI(img.image_path)} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Image Carousel with swipe + lightbox ──────────────────────────────────────
function ImageCarousel({ images, productName }) {
    const [current, setCurrent] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const dragStart = useRef(null);

    const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

    const onMouseDown = (e) => { dragStart.current = e.clientX; };
    const onMouseUp = (e) => {
        if (dragStart.current === null) return;
        const diff = dragStart.current - e.clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        dragStart.current = null;
    };
    const onTouchStart = (e) => { dragStart.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (dragStart.current === null) return;
        const diff = dragStart.current - e.changedTouches[0].clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        dragStart.current = null;
    };

    if (!images || images.length === 0) return <div className="h-96 bg-gray-200 rounded-xl" />;

    return (
        <>
            <div className="flex flex-col gap-3">
                {/* Main image */}
                <div
                    className="relative rounded-xl overflow-hidden bg-gray-100 h-96 cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <img
                        src={encodeURI(images[current].image_path)}
                        alt={`${productName} ${current + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Zoom button */}
                    <button
                        className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => setLightboxOpen(true)}
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Dot indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, i) => (
                                <span key={i} className={`block rounded-full transition-all ${current === i ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
                            ))}
                        </div>
                    )}

                    {/* Arrow buttons */}
                    {images.length > 1 && (
                        <>
                            <button onMouseDown={(e) => e.stopPropagation()} onClick={prev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition">
                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                            </button>
                            <button onMouseDown={(e) => e.stopPropagation()} onClick={next}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition">
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setCurrent(i)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${current === i ? 'border-primary-500' : 'border-secondary-300 hover:border-primary-300'}`}>
                                <img src={encodeURI(img.image_path)} alt={`thumb ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }} />
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductShow({ product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const response = await fetch(route('cart.add'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ product_id: product.id, quantity }),
            });
            const data = await response.json();
            if (data.success) { alert('Produk berhasil ditambahkan ke keranjang!'); setQuantity(1); }
        } catch {
            alert('Gagal menambahkan produk ke keranjang');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout title={product.name} description={product.description}>
            {/* Breadcrumb */}
            <div className="bg-secondary-50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                        <Link href="/" className="hover:text-primary-600">Beranda</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary-600">Produk</Link>
                        <span>/</span>
                        <span className="text-secondary-900 font-semibold">{product.name}</span>
                    </div>
                </div>
            </div>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* ── Left: Carousel ── */}
                        <ImageCarousel images={product.images || []} productName={product.name} />

                        {/* ── Right: Details ── */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">{product.name}</h1>

                            <div className="flex items-center space-x-3 mb-6">
                                <div className="flex text-primary-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <span className="text-secondary-600">({product.testimonials?.length || 0} ulasan)</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6 p-4 bg-primary-50 rounded-lg flex items-center gap-4 flex-wrap">
                                <span className="text-3xl md:text-4xl font-bold text-primary-600">
                                    Rp {new Intl.NumberFormat('id-ID').format(Math.round(product.price))}
                                </span>
                                {product.original_price && (
                                    <div className="flex flex-col">
                                        <span className="text-secondary-400 line-through text-lg">
                                            Rp {new Intl.NumberFormat('id-ID').format(Math.round(product.original_price))}
                                        </span>
                                        {discount > 0 && (
                                            <span className="text-primary-600 font-semibold text-sm">Hemat {discount}%</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Deskripsi</h3>
                                <p className="text-secondary-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Specifications */}
                            {product.specifications?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Spesifikasi</h3>
                                    <div className="space-y-2">
                                        {product.specifications.map((spec, i) => (
                                            <div key={i} className="flex justify-between py-2 border-b border-secondary-200">
                                                <span className="text-secondary-600">{spec.property}:</span>
                                                <span className="font-semibold text-secondary-900">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stock */}
                            <div className="mb-6 p-3 bg-secondary-100 rounded-lg">
                                <span className="font-semibold text-secondary-900">Stok Tersedia: </span>
                                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
                                </span>
                            </div>

                            {/* Add to Cart */}
                            {product.stock > 0 && (
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center border border-secondary-300 rounded-lg">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={loading}
                                            className="px-4 py-2 hover:bg-secondary-100 transition disabled:opacity-50">−</button>
                                        <input type="number" value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            disabled={loading}
                                            className="w-16 text-center border-l border-r border-secondary-300 py-2 focus:outline-none disabled:opacity-50" />
                                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={loading}
                                            className="px-4 py-2 hover:bg-secondary-100 transition disabled:opacity-50">+</button>
                                    </div>
                                    <button onClick={handleAddToCart} disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-bold text-base transition">
                                        <ShoppingCart className="w-5 h-5" />
                                        {loading ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                                    </button>
                                </div>
                            )}

                            {/* Share / Favorite */}
                            <div className="flex items-center space-x-4 pt-4 border-t border-secondary-200">
                                <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition">
                                    <Share2 className="w-5 h-5" /><span>Bagikan</span>
                                </button>
                                <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition">
                                    <Heart className="w-5 h-5" /><span>Favorit</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts?.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-3xl font-bold text-secondary-900 mb-8">Produk Terkait</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <Link key={p.id} href={`/products/${p.slug}`} className="group">
                                        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
                                            <div className="relative overflow-hidden h-48 bg-gray-200">
                                                {p.images?.[0]?.image_path && (
                                                    <img src={encodeURI(p.images[0].image_path)} alt={p.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">{p.name}</h3>
                                                <span className="text-primary-600 font-bold">
                                                    Rp {new Intl.NumberFormat('id-ID').format(Math.round(p.price))}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
