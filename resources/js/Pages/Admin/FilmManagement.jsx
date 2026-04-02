import React, { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import FilmForm from "@/Components/admin/FilmForm";

// Mock data — EXACTLY sama seperti yang kamu berikan (nama variabel tidak boleh berubah)
const mockFilms = [
    {
        id: 1,
        title: "Laskar Pelangi",
        description: "Kisah inspiratif anak-anak SD Muhammadiyah di Belitung",
        genres: "Drama, Pendidikan",
        rating: 8.5,
        year: 2008,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
        banner: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
        is_featured: true,
        deleted_at: null,
        created_at: "2026-01-15T00:00:00Z",
        updated_at: "2026-01-15T00:00:00Z",
        casts: [
            {
                id: 1,
                film_id: 1,
                name: "Cut Mini Theo",
                role: "Bu Muslimah",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
                deleted_at: null,
            },
            {
                id: 2,
                film_id: 1,
                name: "Ikranagara",
                role: "Pak Harfan",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                deleted_at: null,
            },
        ],
        episodes: [
            {
                id: 1,
                film_id: 1,
                number: 1,
                title: "Full Movie",
                duration: "125:00",
                thumbnail:
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
                deleted_at: null,
                platforms: [
                    {
                        id: 1,
                        episode_id: 1,
                        platform_name: "Netflix",
                        url: "https://netflix.com/watch/laskar-pelangi",
                    },
                    {
                        id: 2,
                        episode_id: 1,
                        platform_name: "Disney+ Hotstar",
                        url: "https://hotstar.com/id/movies/laskar-pelangi",
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Pengabdi Setan",
        description: "Sebuah keluarga dihadapkan pada teror misterius",
        genres: "Horror, Thriller",
        rating: 7.8,
        year: 2017,
        poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400",
        banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
        is_featured: false,
        deleted_at: null,
        created_at: "2026-02-10T00:00:00Z",
        updated_at: "2026-02-10T00:00:00Z",
        casts: [
            {
                id: 3,
                film_id: 2,
                name: "Tara Basro",
                role: "Rini",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
                deleted_at: null,
            },
            {
                id: 4,
                film_id: 2,
                name: "Bront Palarae",
                role: "Bahri",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                deleted_at: null,
            },
        ],
        episodes: [
            {
                id: 2,
                film_id: 2,
                number: 1,
                title: "Full Movie",
                duration: "107:00",
                thumbnail:
                    "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400",
                deleted_at: null,
                platforms: [
                    {
                        id: 3,
                        episode_id: 2,
                        platform_name: "Netflix",
                        url: "https://netflix.com/watch/pengabdi-setan",
                    },
                ],
            },
        ],
    },
];

export default function FilmManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [films, setFilms] = useState(mockFilms);

    const filteredFilms = films.filter((film) =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

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

    // Handle Delete
    const handleDelete = (film) => {
        if (confirm(`Yakin ingin menghapus film "${film.title}"?`)) {
            setFilms(films.filter((f) => f.id !== film.id));
            alert("Film berhasil dihapus!");
        }
    };

    // Handle Back to List
    const handleBack = () => {
        setView("list");
        setSelectedFilm(null);
    };

    // Handle Save (Create / Edit)
    const handleSave = (data) => {
        console.log("Film disimpan:", data);
        alert(
            mode === "create"
                ? "Film berhasil ditambahkan!"
                : "Film berhasil diupdate!",
        );
        handleBack();
    };

    // Jika sedang create atau edit → tampilkan FilmForm
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

    // Tampilan List (Tabel)
    return (
        <AdminLayout title="Manajemen Film" activeTab="perfilman">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manajemen Film
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola data film, cast, dan episode
                        </p>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-[#FF751F] hover:bg-[#e66a1c] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Film
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari film..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF751F] text-gray-700 placeholder-gray-400"
                    />
                </div>

                {/* Table dengan semua kolom yang diminta */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1400px]">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        ID
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        POSTER
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        JUDUL
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        DESKRIPSI
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        GENRE
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        RATING
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        TAHUN
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        UNGGULAN
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        DIBUAT
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        DIPERBARUI
                                    </th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-500">
                                        AKSI
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredFilms.map((film) => (
                                    <tr
                                        key={film.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-5 font-medium text-gray-900">
                                            #{film.id}
                                        </td>
                                        <td className="px-6 py-5">
                                            <img
                                                src={film.poster}
                                                alt={film.title}
                                                className="w-12 h-16 object-cover rounded-xl shadow-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-5 font-semibold text-gray-900">
                                            {film.title}
                                        </td>
                                        <td className="px-6 py-5 text-gray-600 text-sm max-w-xs truncate">
                                            {film.description}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                                {film.genres}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-medium">
                                            ⭐ {film.rating}
                                        </td>
                                        <td className="px-6 py-5">
                                            {film.year}
                                        </td>
                                        <td className="px-6 py-5">
                                            {film.is_featured ? (
                                                <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                                    Ya
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                                    Tidak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-xs text-gray-500">
                                            {new Date(
                                                film.created_at,
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-5 text-xs text-gray-500">
                                            {new Date(
                                                film.updated_at,
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(film)
                                                    }
                                                    className="flex items-center gap-1 text-[#FF751F] hover:text-orange-600"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(film)
                                                    }
                                                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredFilms.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada film yang ditemukan
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
