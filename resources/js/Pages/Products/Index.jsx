import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Search, Filter } from 'lucide-react';

export default function ProductsIndex({ products: initialProducts }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { url } = usePage().props;

    return (
        <PublicLayout
            title="Produk"
            description="Jelajahi koleksi produk lengkap dari PT Bina Auto Solusi"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Produk Kami</h1>
                    <p className="text-lg">
                        Temukan produk berkualitas tinggi dengan harga terjangkau
                    </p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="py-8 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-400" />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <button 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                border: '2px solid #d6d3d1',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                color: '#1c1917',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f5f5f4';
                                e.target.style.borderColor = '#ea580c';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#ffffff';
                                e.target.style.borderColor = '#d6d3d1';
                            }}
                        >
                            <Filter className="w-5 h-5" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {initialProducts.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {initialProducts.data.map((product) => (
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
                                                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">
                                                    {product.name}
                                                </h3>
                                                <div className="text-sm text-secondary-500 mb-3">
                                                    Stok: {product.stock}
                                                </div>
                                                <div className="flex items-center justify-between">
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

                            {/* Pagination */}
                            {initialProducts.links && initialProducts.links.length > 0 && (
                                <div className="flex justify-center space-x-2">
                                    {initialProducts.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 rounded ${
                                                link.active
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-white border border-secondary-300 hover:bg-secondary-50'
                                            } transition`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-secondary-600 text-lg">Tidak ada produk yang tersedia</p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
