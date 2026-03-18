import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Star, Calendar, Users, Play } from 'lucide-react';

export default function FilmShow({ film, featuredFilms }) {
    return (
        <PublicLayout
            title={film.title}
            description={film.description?.substring(0, 160)}
        >
            {/* Hero Section - Banner */}
            <section className="relative h-96 md:h-screen">
                {film.banner && (
                    <div className="absolute inset-0">
                        <img
                            src={film.banner}
                            alt={film.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    </div>
                )}

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mb-8">
                            {/* Poster */}
                            <div className="hidden md:block">
                                {film.poster && (
                                    <img
                                        src={film.poster}
                                        alt={film.title}
                                        className="w-full rounded-lg shadow-2xl"
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div className="md:col-span-3 text-white">
                                <h1 className="text-5xl font-bold mb-4">
                                    {film.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                        <span className="ml-2 text-xl font-bold">
                                            {film.rating}/10
                                        </span>
                                    </div>
                                    {film.year && (
                                        <div className="flex items-center">
                                            <Calendar className="w-6 h-6" />
                                            <span className="ml-2 text-lg">
                                                {film.year}
                                            </span>
                                        </div>
                                    )}
                                    {film.genres && (
                                        <div className="text-lg">
                                            {film.genres.split(',').join(' • ')}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 32px',
                                        backgroundColor: '#ea580c',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c2410c'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ea580c'}
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Tonton Sekarang</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Description */}
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                                    Sinopsis
                                </h2>
                                <p className="text-secondary-600 leading-relaxed text-lg">
                                    {film.description}
                                </p>
                            </div>

                            {/* Cast */}
                            {film.casts?.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                                        Pemain
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {film.casts.map((cast) => (
                                            <div key={cast.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                {cast.image && (
                                                    <div className="h-48 bg-secondary-100">
                                                        <img
                                                            src={cast.image}
                                                            alt={cast.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-secondary-900">
                                                        {cast.name}
                                                    </h4>
                                                    {cast.role && (
                                                        <p className="text-primary-600 text-sm">
                                                            {cast.role}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Episodes */}
                            {film.episodes?.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                                        Episode
                                    </h2>
                                    <div className="space-y-4">
                                        {film.episodes.map((episode) => (
                                            <div key={episode.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                                <div className="flex items-start space-x-4">
                                                    {episode.thumbnail && (
                                                        <img
                                                            src={episode.thumbnail}
                                                            alt={`Episode ${episode.number}`}
                                                            className="w-32 h-20 object-cover rounded"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-secondary-900">
                                                            Episode {episode.number}: {episode.title}
                                                        </h4>
                                                        <div className="flex items-center space-x-4 mt-2 text-secondary-600">
                                                            {episode.duration && (
                                                                <span className="text-sm">
                                                                    {episode.duration}
                                                                </span>
                                                            )}
                                                            <div className="flex space-x-2">
                                                                {episode.platforms?.map((platform) => (
                                                                    <a
                                                                        key={platform.id}
                                                                        href={platform.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold hover:bg-primary-200 transition"
                                                                    >
                                                                        {platform.platform_name}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside>
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                                <h3 className="text-xl font-bold text-secondary-900 mb-4">
                                    Informasi Film
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-secondary-600 text-sm block">
                                            Rating
                                        </span>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < Math.floor(film.rating / 2)
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-secondary-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-lg font-semibold mt-1">
                                            {film.rating}/10
                                        </p>
                                    </div>

                                    <hr />

                                    {film.year && (
                                        <div>
                                            <span className="text-secondary-600 text-sm block mb-2">
                                                Tahun Rilis
                                            </span>
                                            <span className="text-lg font-semibold">
                                                {film.year}
                                            </span>
                                        </div>
                                    )}

                                    {film.genres && (
                                        <>
                                            <hr />
                                            <div>
                                                <span className="text-secondary-600 text-sm block mb-2">
                                                    Genre
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {film.genres.split(',').map((genre, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
                                                        >
                                                            {genre.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {film.casts?.length > 0 && (
                                        <>
                                            <hr />
                                            <div>
                                                <span className="text-secondary-600 text-sm block mb-2">
                                                    Aktor Utama
                                                </span>
                                                <div className="space-y-1">
                                                    {film.casts.slice(0, 3).map((cast) => (
                                                        <p key={cast.id} className="text-secondary-700">
                                                            {cast.name}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button 
                                    style={{
                                        width: '100%',
                                        marginTop: '24px',
                                        padding: '14px 16px',
                                        backgroundColor: '#ea580c',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c2410c'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ea580c'}
                                >
                                    <Play className="w-5 h-5" />
                                    <span>Tonton Sekarang</span>
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Featured Films */}
            {featuredFilms.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-8">
                            Film Unggulan Lainnya
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredFilms.map((relatedFilm) => (
                                <Link
                                    key={relatedFilm.id}
                                    href={`/films/${relatedFilm.id}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
                                        {relatedFilm.poster && (
                                            <div className="relative overflow-hidden h-72 bg-secondary-100">
                                                <img
                                                    src={relatedFilm.poster}
                                                    alt={relatedFilm.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">
                                                {relatedFilm.title}
                                            </h3>
                                            <div className="flex items-center text-primary-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="ml-1 text-sm font-semibold">
                                                    {relatedFilm.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
