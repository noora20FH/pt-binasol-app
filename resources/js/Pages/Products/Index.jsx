import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Search, Filter } from 'lucide-react';

// Product Card Component
function ProductCard({ product }) {
    const [imageError, setImageError] = useState(false);
    
    return (
        <Link
            href={`/products/${product.slug}`}
            className="group h-full"
        >
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 aspect-square md:aspect-[3/4]">
                    {product.images?.[0]?.image_path && !imageError && (
                        <img
                            src={encodeURI(product.images[0].image_path)}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    )}
                    {product.badge && (
                        <div className="absolute top-3 right-3 bg-primary-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold z-10">
                            {product.badge}
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold text-sm md:text-base">Habis</span>
                        </div>
                    )}
                </div>
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2 text-sm md:text-base">
                        {product.name}
                    </h3>
                    <div className="text-xs md:text-sm text-secondary-500 mb-3">
                        Stok: {product.stock}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex flex-col">
                            <span className="text-primary-600 font-bold text-sm md:text-lg leading-tight">
                                Rp{' '}
                                {new Intl.NumberFormat('id-ID').format(
                                    Math.round(product.price)
                                )}
                            </span>
                            {product.original_price && (
                                <span className="text-secondary-400 line-through text-xs md:text-sm">
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
    );
}

export default function ProductsIndex({ products: initialProducts }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { url } = usePage().props;

    const filteredProducts = initialProducts.data.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PublicLayout
            title="Produk"
            description="Jelajahi koleksi produk lengkap dari PT Bina Auto Solusi"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Produk Kami</h1>
                    <p className="text-base md:text-lg">
                        Temukan produk berkualitas tinggi dengan harga terjangkau
                    </p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="py-6 md:py-8 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div className="sm:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 md:w-5 h-4 md:h-5 text-secondary-400" />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base"
                                />
                            </div>
                        </div>
                        <button 
                            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-secondary-200 rounded-lg bg-white hover:bg-secondary-50 hover:border-primary-500 transition font-semibold text-sm"
                        >
                            <Filter className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {initialProducts.links && initialProducts.links.length > 3 && (
                                <div className="flex justify-center items-center space-x-2 mt-10">
                                    {initialProducts.links.map((link, index) => {
                                        const label = link.label
                                            .replace(/pagination\.previous/i, '« Sebelumnya')
                                            .replace(/pagination\.next/i, 'Selanjutnya »');
                                        return link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 rounded text-sm transition ${
                                                    link.active
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-white border border-secondary-300 hover:bg-secondary-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-2 py-2 text-secondary-400"
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-secondary-600 text-base md:text-lg">
                                {searchQuery ? 'Produk tidak ditemukan' : 'Tidak ada produk yang tersedia'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
