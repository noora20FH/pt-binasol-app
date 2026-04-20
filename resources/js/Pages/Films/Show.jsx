import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Star, Calendar, Play } from 'lucide-react';

export default function FilmShow({ film, featuredFilms }) {
    return (
        <PublicLayout
            title={film.title}
            description={film.description?.substring(0, 160)}
        >
            {/* Hero Section - Banner */}
            <section className="relative h-64 sm:h-96 md:h-[500px] lg:h-screen">
                {film.banner && (
                    <div className="absolute inset-0">
                        <img
                            src={film.banner}
                            alt={film.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%23333" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EBanner%3C/text%3E%3C/svg%3E';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </div>
                )}

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 sm:pb-8 md:pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-end">
                            {/* Poster */}
                            <div className="hidden md:block">
                                {film.poster && (
                                    <img
                                        src={film.poster}
                                        alt={film.title}
                                        className="w-full rounded-lg shadow-2xl"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23e0e0e0" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div className="md:col-span-3 text-white">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                                    {film.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 md:mb-4 text-sm md:text-base">
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                                        <span className="ml-2 font-bold">
                                            {film.rating}/10
                                        </span>
                                    </div>
                                    {film.year && (
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="ml-2">
                                                {film.year}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {film.genres && (
                                    <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
                                        {film.genres.split(',').slice(0, 3).map((genre, i) => (
                                            <span key={i} className="px-2 md:px-3 py-1 bg-primary-500/30 rounded">
                                                {genre.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-bold text-sm sm:text-base transition-colors">
                                    <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                                    <span>Tonton</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-8 sm:py-12 md:py-16 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Description */}
                            <div className="mb-8 md:mb-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
                                    Sinopsis
                                </h2>
                                <p className="text-secondary-600 leading-relaxed text-sm sm:text-base md:text-lg whitespace-pre-wrap">
                                    {film.description}
                                </p>
                            </div>

                            {/* Cast */}
                            {film.castMembers && film.castMembers.length > 0 && (
                                <div className="mb-8 md:mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4 md:mb-6">
                                        Pemain
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                                        {film.castMembers.slice(0, 6).map((cast) => (
                                            <div key={cast.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                                {cast.image && (
                                                    <div className="h-32 sm:h-40 md:h-48 bg-secondary-100">
                                                        <img
                                                            src={cast.image}
                                                            alt={cast.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="240"%3E%3Crect fill="%23e0e0e0" width="200" height="240"/%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-3 md:p-4">
                                                    <h4 className="font-semibold text-secondary-900 text-sm md:text-base line-clamp-2">
                                                        {cast.name}
                                                    </h4>
                                                    {cast.role && (
                                                        <p className="text-primary-600 text-xs md:text-sm mt-1">
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
                            {film.episodes && film.episodes.length > 0 && (
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4 md:mb-6">
                                        Episode
                                    </h2>
                                    <div className="space-y-4">
                                        {film.episodes.map((episode) => (
                                            <div key={episode.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                                <h4 className="font-semibold text-secondary-900 text-sm md:text-base">
                                                    Episode {episode.number}: {episode.title}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-2 mt-2 text-secondary-600 text-xs md:text-sm">
                                                    {episode.duration && (
                                                        <span>{episode.duration}</span>
                                                    )}
                                                    {episode.platforms && episode.platforms.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {episode.platforms.map((platform) => (
                                                                <a
                                                                    key={platform.id}
                                                                    href={platform.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-2 md:px-3 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold hover:bg-primary-200 transition"
                                                                >
                                                                    {platform.platform_name}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside>
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md sticky top-4 md:top-20">
                                <h3 className="text-lg md:text-xl font-bold text-secondary-900 mb-4">
                                    Informasi Film
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-secondary-600 text-xs md:text-sm block">
                                            Rating
                                        </span>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 md:w-5 md:h-5 ${
                                                        i < Math.floor(film.rating / 2)
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-secondary-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-lg md:text-xl font-semibold mt-1">
                                            {film.rating}/10
                                        </p>
                                    </div>

                                    <hr />

                                    {film.year && (
                                        <div>
                                            <span className="text-secondary-600 text-xs md:text-sm block mb-2">
                                                Tahun Rilis
                                            </span>
                                            <span className="text-base md:text-lg font-semibold">
                                                {film.year}
                                            </span>
                                        </div>
                                    )}

                                    {film.genres && (
                                        <>
                                            <hr />
                                            <div>
                                                <span className="text-secondary-600 text-xs md:text-sm block mb-2">
                                                    Genre
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {film.genres.split(',').map((genre, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 md:px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs md:text-sm font-semibold"
                                                        >
                                                            {genre.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button className="w-full mt-6 md:mt-8 px-4 py-2 md:py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold text-sm md:text-base transition-colors flex items-center justify-center gap-2">
                                    <Play className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                                    <span>Tonton</span>
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Featured Films */}
            {featuredFilms && featuredFilms.length > 0 && (
                <section className="py-8 sm:py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-6 md:mb-8">
                            Film Unggulan Lainnya
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                            {featuredFilms.map((relatedFilm) => (
                                <Link
                                    key={relatedFilm.id}
                                    href={`/films/${relatedFilm.id}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                                        {relatedFilm.poster && (
                                            <div className="relative overflow-hidden bg-secondary-100 aspect-[3/4]">
                                                <img
                                                    src={relatedFilm.poster}
                                                    alt={relatedFilm.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23e0e0e0" width="200" height="300"/%3E%3C/svg%3E';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="p-3 md:p-4 flex-1">
                                            <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition line-clamp-2 mb-2 text-sm md:text-base">
                                                {relatedFilm.title}
                                            </h3>
                                            <div className="flex items-center text-primary-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="ml-1 text-xs md:text-sm font-semibold">
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
