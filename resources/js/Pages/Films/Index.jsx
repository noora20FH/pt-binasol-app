import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Star, Users } from 'lucide-react';

export default function FilmsIndex({ films }) {
    return (
        <PublicLayout
            title="Film & Entertainment"
            description="Jelajahi koleksi film dan entertainment dari PT Bina Auto Solusi"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Film & Entertainment</h1>
                    <p className="text-lg">
                        Nikmati koleksi film dan hiburan terbaik
                    </p>
                </div>
            </section>

            {/* Films Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {films.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {films.map((film) => (
                                    <Link
                                        key={film.id}
                                        href={`/films/${film.id}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
                                            {/* Poster */}
                                            <div className="relative overflow-hidden h-72 bg-secondary-100">
                                                {film.poster && (
                                                    <img
                                                        src={film.poster}
                                                        alt={film.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                    />
                                                )}
                                                {film.is_featured && (
                                                    <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                        Featured
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">
                                                    {film.title}
                                                </h3>

                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center text-primary-500">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span className="ml-1 text-sm font-semibold">
                                                            {film.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-secondary-500 text-sm">
                                                        {film.year}
                                                    </span>
                                                </div>

                                                {film.genres && (
                                                    <p className="text-secondary-500 text-sm mb-3">
                                                        {film.genres.split(',').slice(0, 2).join(', ')}
                                                    </p>
                                                )}

                                                <p className="text-secondary-600 text-sm line-clamp-2">
                                                    {film.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-secondary-600 text-lg">Tidak ada film yang tersedia</p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
