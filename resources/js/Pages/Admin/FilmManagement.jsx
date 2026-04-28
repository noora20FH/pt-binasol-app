import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import FilmForm from "@/Pages/Admin/FilmForm";
import { DataTable } from '@/Components/cms/DataTable';
import { router } from '@inertiajs/react';
import { X, Calendar, Star, Play, ExternalLink } from 'lucide-react';

export default function FilmManagement({ films: initialFilms }) {
    const [view, setView] = useState("list");
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [films, setFilms] = useState(initialFilms);

    // State untuk modal detail
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [viewingFilm, setViewingFilm] = useState(null);

    // Handle Create
    const handleCreate = () => {
        setSelectedFilm(null);
        setView("create");
    };

    // Handle Edit
    const handleEdit = (film) => {
        setSelectedFilm(film);
        setView("edit");
    };

    // Handle View Detail (Icon Mata)
    const handleView = (film) => {
        setViewingFilm(film);
        setShowDetailModal(true);
    };

    // Handle Delete (Soft Delete)
    const handleDelete = (film) => {
        if (confirm(`Yakin ingin menghapus film "${film.title}"? (Data akan masuk sampah)`)) {
            router.delete(route('admin.films.destroy', film.id), {
                onSuccess: () => {
                    setFilms(prev => prev.filter(f => f.id !== film.id));
                }
            });
        }
    };

    const handleBack = () => {
        setView("list");
        setSelectedFilm(null);
    };

    const handleSave = (data) => {
        console.log("Film disimpan:", data);
        alert("Film berhasil disimpan!");
        handleBack();
    };

    const filmsWithNo = films.map((film, index) => ({
        ...film,
        display_no: index + 1,
    }));

    // Modal Detail Film
    const FilmDetailModal = () => {
        if (!viewingFilm) return null;

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
                    {/* Header Modal */}
                    <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-semibold text-gray-900">{viewingFilm.title}</h2>
                        </div>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-auto flex-1 p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Poster */}
                            <div className="lg:col-span-4">
                                {viewingFilm.poster && (
                                    <img
                                        src={viewingFilm.poster}
                                        alt={viewingFilm.title}
                                        className="w-full rounded-2xl shadow-lg object-cover aspect-[2/3]"
                                    />
                                )}
                                {viewingFilm.banner && (
                                    <img
                                        src={viewingFilm.banner}
                                        alt="Banner"
                                        className="mt-4 w-full rounded-2xl shadow-md h-32 object-cover"
                                    />
                                )}
                            </div>

                            {/* Info Utama */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="flex gap-3">
                                    {viewingFilm.genres && (
                                        <span className="inline-flex px-4 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                                            {viewingFilm.genres}
                                        </span>
                                    )}
                                    {viewingFilm.is_featured && (
                                        <span className="inline-flex px-4 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                            Unggulan
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {viewingFilm.year}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-500" />
                                        {viewingFilm.rating}
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed text-[15.5px]">
                                    {viewingFilm.description || 'Tidak ada deskripsi.'}
                                </p>

                                {/* Casts */}
                                {viewingFilm.casts && viewingFilm.casts.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <span className="text-[#FF751F]">🎭</span> Cast & Pemeran
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {viewingFilm.casts.map((cast, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    {cast.image ? (
                                                        <img src={cast.image} alt={cast.name} className="w-12 h-12 rounded-2xl object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-xl">👤</div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm">{cast.name}</p>
                                                        <p className="text-xs text-gray-500">{cast.role || '-'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Episodes */}
                                {viewingFilm.episodes && viewingFilm.episodes.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <Play className="w-5 h-5 text-purple-500" /> Episode
                                        </h3>
                                        <div className="space-y-2">
                                            {viewingFilm.episodes.map((episode, i) => (
                                                <div key={i} className="flex justify-between items-center bg-gray-50 px-5 py-3 rounded-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-mono text-sm font-medium text-gray-500">E{episode.number}</span>
                                                        <div>
                                                            <p className="font-medium">{episode.title}</p>
                                                        </div>
                                                    </div>
                                                    {episode.duration && <span className="text-sm text-gray-500">{episode.duration}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Platforms */}
                                {viewingFilm.platforms && viewingFilm.platforms.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-4">Tersedia di Platform</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {viewingFilm.platforms.map((platform, i) => (
                                                <a
                                                    key={i}
                                                    href={platform.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:border-[#FF751F] rounded-2xl transition-colors"
                                                >
                                                    <span className="font-medium">{platform.platform_name}</span>
                                                    {platform.url && <ExternalLink className="w-4 h-4" />}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 border-t flex justify-end bg-gray-50">
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-2xl font-medium transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (view === "create" || view === "edit") {
        return (
            <AdminLayout
                title={view === "create" ? "Tambah Film Baru" : "Edit Film"}
                activeTab="perfilman"
            >
                <FilmForm
                    film={selectedFilm}
                    mode={view}
                    onBack={handleBack}
                    onSave={handleSave}
                />
            </AdminLayout>
        );
    }

    const columns = [
        {
            key: "display_no",
            label: "ID",
            render: (value) => `#${value}`
        },
        {
            key: "poster",
            label: "POSTER",
            render: (value) => (
                <img
                    src={value}
                    alt="poster"
                    className="w-12 h-16 object-cover rounded-xl shadow-sm"
                />
            ),
        },
        { key: "title", label: "JUDUL" },
        {
            key: "description",
            label: "DESKRIPSI",
            render: (value) => (
                <div className="max-w-xs truncate text-sm text-gray-600">{value}</div>
            ),
        },
        {
            key: "genres",
            label: "GENRE",
            render: (value) => (
                <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {value}
                </span>
            ),
        },
        {
            key: "rating",
            label: "RATING",
            render: (value) => <span className="font-medium">⭐ {value}</span>,
        },
        { key: "year", label: "TAHUN" },
        {
            key: "is_featured",
            label: "UNGGULAN",
            render: (value) =>
                value ? (
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Ya</span>
                ) : (
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Tidak</span>
                ),
        },
        {
            key: "created_at",
            label: "DIBUAT",
            render: (value) => new Date(value).toLocaleDateString("id-ID"),
        },
    ];

    return (
        <AdminLayout title="Manajemen Film" activeTab="perfilman">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Film</h1>
                        <p className="text-gray-600 mt-1">Kelola data film, cast, dan episode</p>
                    </div>
                </div>

                <DataTable
                    data={filmsWithNo}
                    columns={columns}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}           
                    createLabel="Tambah Film"
                    searchPlaceholder="Cari film..."
                    emptyMessage="Tidak ada film yang ditemukan"
                />
            </div>

            {/* Modal Detail */}
            {showDetailModal && <FilmDetailModal />}
        </AdminLayout>
    );
}
