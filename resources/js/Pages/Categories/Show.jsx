import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { PrimaryButton } from '@/Components/Button';

export default function CategoryShow({ category, products = { data: [] } }) {
    const categoryProducts = category?.products || [];
    const hasProducts = categoryProducts && categoryProducts.length > 0;
    return (
        <PublicLayout
            title={category.name}
            description={category.description}
        >
            {/* Breadcrumb */}
            <div className="bg-secondary-50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                        <Link href="/" className="hover:text-primary-600">Beranda</Link>
                        <span>/</span>
                        <Link href="/categories" className="hover:text-primary-600">Kategori</Link>
                        <span>/</span>
                        <span className="text-secondary-900 font-semibold">{category.name}</span>
                    </div>
                </div>
            </div>

            {/* Category Header */}
            <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {category.image && (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-48 object-cover rounded-lg"
                                loading="lazy"
                            />
                        )}
                        <div className={category.image ? 'md:col-span-2' : 'md:col-span-3'}>
                            <h1 className="text-4xl font-bold mb-4">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="text-lg leading-relaxed">
                                    {category.description}
                                </p>
                            )}
                            <div className="mt-6 inline-block px-4 py-2 bg-white/20 rounded-full text-sm">
                                {categoryProducts?.length || 0} Produk
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter & Sort Bar */}
            <section className="py-6 bg-secondary-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <span className="text-secondary-600">
                                Menampilkan <span className="font-semibold">{categoryProducts?.length || 0}</span> produk
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option>Urutkan: Terbaru</option>
                                <option>Harga Terendah</option>
                                <option>Harga Tertinggi</option>
                                <option>Rating Tertinggi</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 bg-white min-h-96">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasProducts ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {categoryProducts.map((product) => (
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
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-secondary-600 text-lg">
                                Tidak ada produk dalam kategori ini
                            </p>
                            <PrimaryButton href="/categories">
                                Kembali ke Kategori
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
