import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { PrimaryButton } from '@/Components/Button';

export default function CategoriesIndex({ categories }) {
    return (
        <PublicLayout
            title="Kategori"
            description="Jelajahi berbagai kategori produk dari PT Bina Auto Solusi"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Kategori Produk</h1>
                    <p className="text-lg">
                        Temukan produk sesuai kebutuhan Anda
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {categories && categories.data && categories.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.data.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="group"
                                    >
                                        <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition h-64">
                                            {category.image && (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                    loading="lazy"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                                {category.icon && (
                                                    <div className="text-6xl mb-3">
                                                        {category.icon}
                                                    </div>
                                                )}
                                                <h3 className="text-2xl font-bold text-center group-hover:text-primary-300 transition">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm mt-3">
                                                    {category.products?.length || 0} Produk
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-secondary-600 text-xl mb-6">Belum ada kategori yang tersedia</p>
                            <PrimaryButton href="/">
                                Kembali ke Beranda
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
