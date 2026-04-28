import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ChevronLeft, ChevronRight, Film, Tv } from 'lucide-react';

function Pagination({ data, pageKey }) {
    if (!data || data.last_page <= 1) return null;
    const goTo = (page) => {
        router.get(route('films.index'), { [pageKey]: page }, { preserveState: true, preserveScroll: true });
    };
    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <button onClick={() => goTo(data.current_page - 1)} disabled={data.current_page === 1}
                className="p-2 rounded-lg border border-secondary-200 disabled:opacity-40 hover:bg-secondary-100 transition">
                <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => goTo(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${p === data.current_page ? 'bg-primary-500 text-white' : 'border border-secondary-200 hover:bg-secondary-100 text-secondary-700'}`}>
                    {p}
                </button>
            ))}
            <button onClick={() => goTo(data.current_page + 1)} disabled={data.current_page === data.last_page}
                className="p-2 rounded-lg border border-secondary-200 disabled:opacity-40 hover:bg-secondary-100 transition">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function PosterGrid({ posters, emptyLabel }) {
    if (!posters || !posters.data || posters.data.length === 0) {
        return <div className="text-center py-12"><p className="text-secondary-500">{emptyLabel}</p></div>;
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {posters.data.map((item) => (
                <Link key={item.filename} href={item.film_id ? `/films/${item.film_id}` : '#'}
                    className="group text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl">
                    <div className="bg-secondary-100 rounded-xl overflow-hidden aspect-[3/4] shadow-md group-hover:shadow-xl transition-all">
                        <img src={item.url} alt={item.title} loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23e0e0e0" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="12" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'; }} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-secondary-800 text-center line-clamp-2 px-1">{item.title}</p>
                </Link>
            ))}
        </div>
    );
}

const TABS = [
    { key: 'all', label: 'Semua', Icon: null },
    { key: 'film', label: 'Film', Icon: Film },
    { key: 'series', label: 'Series', Icon: Tv },
];

export default function FilmsIndex({ filmPosters, seriesPosters }) {
    const [activeTab, setActiveTab] = useState('all');
    const totalAll = (filmPosters ? filmPosters.total : 0) + (seriesPosters ? seriesPosters.total : 0);
    const allPosters = {
        data: [...(filmPosters && filmPosters.data ? filmPosters.data : []), ...(seriesPosters && seriesPosters.data ? seriesPosters.data : [])],
        total: totalAll, current_page: 1, last_page: 1, per_page: totalAll,
    };
    return (
        <PublicLayout title="Film & Entertainment" description="Jelajahi koleksi film dan entertainment dari PT Bina Auto Solusi">
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Film & Entertainment</h1>
                    <p className="text-base md:text-lg">Nikmati koleksi film dan hiburan terbaik</p>
                </div>
            </section>
            <section className="py-6 bg-secondary-50 border-b border-secondary-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {TABS.map(({ key, label, Icon }) => {
                            const count = key === 'all' ? totalAll : key === 'film' ? (filmPosters ? filmPosters.total : 0) : (seriesPosters ? seriesPosters.total : 0);
                            return (
                                <button key={key} onClick={() => setActiveTab(key)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all ${activeTab === key ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-secondary-700 border border-secondary-300 hover:border-primary-400 hover:text-primary-600'}`}>
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {label}
                                    <span className={`text-xs font-normal ${activeTab === key ? 'opacity-80' : 'text-secondary-400'}`}>({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {activeTab === 'all' && <PosterGrid posters={allPosters} emptyLabel="Tidak ada konten tersedia" />}
                    {activeTab === 'film' && (<><PosterGrid posters={filmPosters} emptyLabel="Tidak ada film tersedia" /><Pagination data={filmPosters} pageKey="film_page" /></>)}
                    {activeTab === 'series' && (<><PosterGrid posters={seriesPosters} emptyLabel="Tidak ada series tersedia" /><Pagination data={seriesPosters} pageKey="series_page" /></>)}
                </div>
            </section>
        </PublicLayout>
    );
}
