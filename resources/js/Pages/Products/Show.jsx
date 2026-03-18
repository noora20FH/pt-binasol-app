import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ShoppingCart, Share2, Heart, Star } from 'lucide-react';

export default function ProductShow({ product, relatedProducts }) {
    const { props } = usePage();
    const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.image_url || '');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const discount = product.original_price
        ? Math.round(
              (((product.original_price - product.price) / product.original_price) * 100)
          )
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
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Produk berhasil ditambahkan ke keranjang!');
                setQuantity(1);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Gagal menambahkan produk ke keranjang');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout
            title={product.name}
            description={product.description}
        >
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

            {/* Product Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Images */}
                        <div>
                            <div className="relative bg-secondary-100 rounded-lg overflow-hidden mb-4 h-96">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.badge && (
                                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold">
                                        {product.badge}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {product.images?.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(image.image_url)}
                                        className={`rounded-lg overflow-hidden border-2 transition ${
                                            selectedImage === image.image_url
                                                ? 'border-primary-500'
                                                : 'border-secondary-300'
                                        }`}
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={`Gambar ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="text-primary-500">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-secondary-600">
                                    ({product.testimonials?.length || 0} ulasan)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <span className="text-4xl font-bold text-primary-600">
                                        Rp{' '}
                                        {new Intl.NumberFormat('id-ID').format(
                                            Math.round(product.price)
                                        )}
                                    </span>
                                    {product.original_price && (
                                        <div>
                                            <span className="text-secondary-400 line-through text-xl">
                                                Rp{' '}
                                                {new Intl.NumberFormat('id-ID').format(
                                                    Math.round(product.original_price)
                                                )}
                                            </span>
                                            {discount > 0 && (
                                                <div className="text-primary-600 font-semibold">
                                                    Hemat {discount}%
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                                    Deskripsi
                                </h3>
                                <p className="text-secondary-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Specifications */}
                            {product.specifications?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                                        Spesifikasi
                                    </h3>
                                    <div className="space-y-2">
                                        {product.specifications.map((spec, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between py-2 border-b border-secondary-200"
                                            >
                                                <span className="text-secondary-600">
                                                    {spec.property}:
                                                </span>
                                                <span className="font-semibold text-secondary-900">
                                                    {spec.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-6 p-3 bg-secondary-100 rounded-lg">
                                <span className="font-semibold text-secondary-900">
                                    Stok Tersedia: {' '}
                                </span>
                                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
                                </span>
                            </div>

                            {/* Add to Cart */}
                            {product.stock > 0 && (
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center border border-secondary-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={loading}
                                            className="px-4 py-2 hover:bg-secondary-100 transition disabled:opacity-50"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            disabled={loading}
                                            className="w-16 text-center border-l border-r border-secondary-300 py-2 focus:outline-none disabled:opacity-50"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={loading}
                                            className="px-4 py-2 hover:bg-secondary-100 transition disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={loading}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '14px 24px',
                                            backgroundColor: loading ? '#ea580c80' : '#ea580c',
                                            color: '#ffffff',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c2410c')}
                                        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#ea580c')}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{loading ? 'Menambahkan...' : 'Tambah ke Keranjang'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Share */}
                            <div className="flex items-center space-x-4 pt-4 border-t border-secondary-200">
                                <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition">
                                    <Share2 className="w-5 h-5" />
                                    <span>Bagikan</span>
                                </button>
                                <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition">
                                    <Heart className="w-5 h-5" />
                                    <span>Favorit</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-3xl font-bold text-secondary-900 mb-8">
                                Produk Terkait
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
                                            <div className="relative overflow-hidden h-48 bg-secondary-100">
                                                {relatedProduct.images?.[0]?.image_path && (
                                                    <img
                                                        src={relatedProduct.images[0].image_path}
                                                        alt={relatedProduct.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">
                                                    {relatedProduct.name}
                                                </h3>
                                                <span className="text-primary-600 font-bold">
                                                    Rp{' '}
                                                    {new Intl.NumberFormat('id-ID').format(
                                                        Math.round(relatedProduct.price)
                                                    )}
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
