import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import FilmForm from "@/Components/admin/FilmForm";
import { DataTable } from '@/Components/cms/DataTable';
import { router } from '@inertiajs/react';

export default function FilmManagement({ films: initialFilms }) {
    const [view, setView] = useState("list");
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [films, setFilms] = useState(initialFilms);

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

    // Handle Restore (jika sudah ditambahkan sebelumnya)
    const handleRestore = (film) => {
        if (confirm(`Yakin ingin mengembalikan film "${film.title}" dari sampah?`)) {
            router.post(route('admin.films.restore', film.id), {}, {
                onSuccess: () => {
                    setFilms(prev => prev.filter(f => f.id !== film.id));
                    alert('Film berhasil direstore!');
                }
            });
        }
    };

    // Handle Back to List
    const handleBack = () => {
        setView("list");
        setSelectedFilm(null);
    };

    // Handle Save
    const handleSave = (data) => {
        console.log("Film disimpan:", data);
        alert("Film berhasil disimpan!");
        handleBack();
    };

    // === PERUBAHAN UTAMA: Tambahkan nomor urut tampilan ===
    const filmsWithNo = films.map((film, index) => ({
        ...film,
        display_no: index + 1,   // ← 1, 2, 3, 4, 5... (data terbaru = No. 1)
    }));

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

    // Kolom tabel (ID sekarang pakai display_no)
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
                    createLabel="Tambah Film"
                    searchPlaceholder="Cari film..."
                    emptyMessage="Tidak ada film yang ditemukan"
                />
            </div>
        </AdminLayout>
    );
}
