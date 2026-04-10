import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import FilmForm from "@/Components/admin/FilmForm";
import { DataTable } from '@/Components/cms/DataTable';

export default function FilmManagement({ films: initialFilms }) {   // ← Terima props dari Laravel
    const [view, setView] = useState("list");
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [films, setFilms] = useState(initialFilms);   // ← Pakai data dari database

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

    // Handle Delete (sementara client-side, nanti bisa diubah ke Inertia delete)
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

    // Kolom tabel (tetap sama seperti sebelumnya)
    const columns = [
        { key: "id", label: "ID", render: (value) => `#${value}` },
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
        {
            key: "updated_at",
            label: "DIPERBARUI",
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
