import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import CategoryForm from "@/Pages/Admin/CategoryForm";
import { DataTable } from "@/Components/cms/DataTable";
import { router } from "@inertiajs/react";
import { X, Image as ImageIcon, Tag } from "lucide-react";

export default function CategoryManagement({ categories: initialCategories }) {
    const [view, setView] = useState("list");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState(initialCategories);

    const handleCreate = () => {
        setSelectedCategory(null);
        setView("create");
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setView("edit");
    };

    const handleDelete = (category) => {
        if (confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) {
            router.delete(route("admin.categories.destroy", category.id), {
                onSuccess: () => {
                    setCategories((prev) => prev.filter((c) => c.id !== category.id));
                },
            });
        }
    };

    const handleBack = () => {
        setView("list");
        setSelectedCategory(null);
    };

    const categoriesWithNo = categories.map((cat, index) => ({
        ...cat,
        display_no: index + 1,
    }));

    if (view === "create" || view === "edit") {
        return (
            <AdminLayout title={view === "create" ? "Tambah Kategori" : "Edit Kategori"} activeTab="kategori">
                <CategoryForm category={selectedCategory} mode={view} />
            </AdminLayout>
        );
    }

    const columns = [
        { key: "display_no", label: "No" },
        {
            key: "image",
            label: "GAMBAR",
            render: (value) => value ? (
                <img src={value} alt="" className="w-12 h-12 object-cover rounded-xl" />
            ) : <span className="text-gray-400">—</span>,
        },
        { key: "name", label: "NAMA KATEGORI" },
        { key: "slug", label: "SLUG" },
        {
            key: "type",
            label: "TIPE",
            render: (value) => (
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${value === 'retail' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {value === 'retail' ? 'Retail' : 'Konstruksi'}
                </span>
            ),
        },
        {
            key: "is_logo",
            label: "LOGO",
            render: (value) => value ? (
                <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Ya</span>
            ) : (
                <span className="inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Tidak</span>
            ),
        },
        { key: "products_count", label: "PRODUK" },
        {
            key: "created_at",
            label: "DIBUAT",
            render: (value) => new Date(value).toLocaleDateString('id-ID'),
        },
    ];

    return (
        <AdminLayout title="Manajemen Kategori" activeTab="kategori">
            <div className="max-w-screen-2xl mx-auto">
                <DataTable
                    data={categoriesWithNo}
                    columns={columns}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    createLabel="Tambah Kategori"
                    searchPlaceholder="Cari kategori..."
                    emptyMessage="Tidak ada kategori"
                />
            </div>
        </AdminLayout>
    );
}
