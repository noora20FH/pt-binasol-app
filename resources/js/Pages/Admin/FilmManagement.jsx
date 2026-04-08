import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import FilmForm from "@/Components/admin/FilmForm";
import { DataTable } from '@/Components/cms/DataTable';

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
    const [view, setView] = useState("list"); // 'list' | 'create' | 'edit'
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [films, setFilms] = useState(mockFilms);

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
        alert("Film berhasil disimpan!");
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

    // Kolom tabel (hanya ini yang diubah sesuai desain DataTable)
    const columns = [
        {
            key: "id",
            label: "ID",
            render: (value) => `#${value}`,
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
                <div className="max-w-xs truncate text-sm text-gray-600">
                    {value}
                </div>
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
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Ya
                    </span>
                ) : (
                    <span className="inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        Tidak
                    </span>
                ),
        },
        {
            key: "created_at",
            label: "DIBUAT",
            render: (value) => new Date(value).toLocaleDateString("id-ID"),
        },
        {
            key: "updated_at",
            label: "DIPERBARUI",
            render: (value) => new Date(value).toLocaleDateString("id-ID"),
        },
    ];

    // Tampilan List → HANYA BAGIAN TABEL YANG DIGANTI DENGAN DataTable
    return (
        <AdminLayout title="Manajemen Film" activeTab="perfilman">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header (tidak diubah) */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manajemen Film
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola data film, cast, dan episode
                        </p>
                    </div>
                </div>

                {/* DataTable (search + tombol Tambah Film + tabel sesuai desain gambar) */}
                <DataTable
                    data={films}
                    columns={columns}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    createLabel="Tambah Film"
                    searchPlaceholder="Cari film..."
                    emptyMessage="Tidak ada film yang ditemukan"
                />
            </div>
        </AdminLayout>
    );
}
