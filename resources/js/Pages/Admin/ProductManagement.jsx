import React, { useState, useMemo } from "react";

import AdminLayout from "@/Layouts/AdminLayout";

import { DataTable, StatusBadge } from "@/Components/cms/DataTable";

import { ProductForm } from "@/Components/cms/ProductForm";

import { router } from "@inertiajs/react";

import { X, Edit, Eye } from "lucide-react";

export default function ProductManagement({
    type = "retail",
    categories = [],
    products = [],
}) {
    const [view, setView] = useState("list");
    const [selectedProduct, setSelectedProduct] = useState(undefined);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [viewingProduct, setViewingProduct] = useState(null);

    const title = type === "retail" ? "Produk Retail" : "Produk Konstruksi";

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [products]);

    const productsWithNo = sortedProducts.map((product, index) => ({
        ...product,
        display_no: index + 1,
    }));

    const handleSave = (productData) => {
        const formData = new FormData();

        formData.append("category_id", productData.category_id);
        formData.append("name", productData.name);
        formData.append("slug", productData.slug);
        formData.append("description", productData.description || "");
        formData.append("price", productData.price);
        formData.append("original_price", productData.original_price || "");
        formData.append("badge", productData.badge || "");
        formData.append("stock", productData.stock);
        formData.append("type", type);

        if (productData.specifications?.length) {
            formData.append("specifications", JSON.stringify(productData.specifications));
        }

        if (productData.images?.length) {
            productData.images.forEach((img, index) => {
                if (img.file instanceof File) {
                    formData.append(`images[${index}][file]`, img.file);
                    formData.append(`images[${index}][is_primary]`, img.is_primary ? "1" : "0");
                } else if (img.id) {
                    // Untuk gambar existing saat edit (agar tidak hilang)
                    formData.append(`images[${index}][id]`, img.id);
                    formData.append(`images[${index}][is_primary]`, img.is_primary ? "1" : "0");
                }
            });
        }

        const options = {
            forceFormData: true,
            onSuccess: () => setView("list"),
            onError: (errors) => console.error("Validation errors:", errors),
        };

        if (view === "create") {
            router.post(route("admin.products.store"), formData, options);
        } else if (view === "edit" && selectedProduct) {
            router.put(route("admin.products.update", selectedProduct.id), formData, options);
        }
    };

    const handleCreate = () => {
        setSelectedProduct(undefined);
        setView("create");
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setView("edit");
    };

    const handleView = (product) => {
        setViewingProduct(product);
        setShowDetailModal(true);
    };

    const handleDelete = (product) => {
        if (confirm(`Yakin hapus produk "${product.name}"?`)) {
            router.delete(route("admin.products.destroy", product.id));
        }
    };

    const handleBack = () => {
        setView("list");
        setSelectedProduct(undefined);
    };

    // ==================== MODAL DETAIL PRODUK ====================
    const ProductDetailModal = () => {
        if (!viewingProduct) return null;

        const primaryImage = viewingProduct.images?.find((img) => img.is_primary) || viewingProduct.images?.[0];

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
                <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Eye className="w-6 h-6 text-[#D98344]" />
                            <h2 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h2>
                        </div>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Gambar Section */}
                            <div className="lg:col-span-5">
                                {/* Gambar Utama */}
                                {primaryImage && (
                                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 mb-6">
                                        <img
                                            src={primaryImage.image_path}
                                            alt={viewingProduct.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Gallery Gambar */}
                                {viewingProduct.images && viewingProduct.images.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-3">Semua Gambar</p>
                                        <div className="grid grid-cols-4 gap-3">
                                            {viewingProduct.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                                        img.is_primary
                                                            ? "border-[#D98344] shadow-md"
                                                            : "border-transparent hover:border-gray-300"
                                                    }`}
                                                >
                                                    <img
                                                        src={img.image_path}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Informasi Detail */}
                            <div className="lg:col-span-7 space-y-8">
                                {/* Basic Info */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        {viewingProduct.badge && (
                                            <span className="px-4 py-1 bg-[#D98344] text-white text-sm font-medium rounded-full">
                                                {viewingProduct.badge}
                                            </span>
                                        )}
                                        <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                                            Stok: {viewingProduct.stock}
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-4">
                                        <p className="text-4xl font-bold text-[#D98344]">
                                            Rp {parseInt(viewingProduct.price).toLocaleString("id-ID")}
                                        </p>
                                        {viewingProduct.original_price && (
                                            <p className="text-xl text-gray-400 line-through">
                                                Rp {parseInt(viewingProduct.original_price).toLocaleString("id-ID")}
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Kategori:{" "}
                                        {categories.find((c) => c.id === viewingProduct.category_id)?.name || "-"}
                                    </p>
                                </div>

                                {/* Deskripsi */}
                                {viewingProduct.description && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Deskripsi</h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {viewingProduct.description}
                                        </p>
                                    </div>
                                )}

                                {/* Spesifikasi */}
                                {viewingProduct.specifications && viewingProduct.specifications.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">Spesifikasi</h4>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                            {viewingProduct.specifications.map((spec, idx) => (
                                                <div key={idx} className="flex justify-between border-b pb-2">
                                                    <span className="font-medium text-gray-600">{spec.property}</span>
                                                    <span className="text-gray-900">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t bg-gray-50 flex items-center justify-between">
                        <button
                            onClick={() => {
                                setShowDetailModal(false);
                                handleEdit(viewingProduct);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-[#D98344] hover:bg-[#C36F3A] text-white rounded-2xl transition-colors"
                        >
                            <Edit className="w-5 h-5" />
                            Edit Produk
                        </button>

                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="px-8 py-3 text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render Form (Create/Edit)
    if (view === "create" || view === "edit") {
        return (
            <AdminLayout
                title={view === "create" ? `Tambah ${title} Baru` : `Edit ${title}`}
                activeTab={type === "retail" ? "retail" : "konstruksi"}
            >
                <ProductForm
                    product={selectedProduct}
                    categories={categories}
                    mode={view}
                    type={type}
                    onBack={handleBack}
                    onSave={handleSave}
                />
            </AdminLayout>
        );
    }

    // Render List + Modal
    const columns = [
        {
            key: "display_no",
            label: "ID",
            render: (value) => <span className="font-medium">#{value}</span>
        },
        {
            key: 'images',
            label: 'GAMBAR',
            render: (value) =>
                value && value.length > 0 ? (
                    <img
                        src={value.find((img) => img.is_primary)?.image_path || value[0].image_path}
                        alt="Product"
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                ),
        },
        {
            key: 'category_id',
            label: 'KATEGORI',
            render: (value) => {
                const category = categories.find((c) => c.id === value);
                return <span className="text-sm">{category?.name || '-'}</span>;
            },
        },
        { key: 'name', label: 'NAMA PRODUK', render: (value) => <span className="font-medium">{value}</span> },
        {
            key: 'price',
            label: 'HARGA',
            render: (value) => (
                <span className="font-medium text-green-600">Rp {value?.toLocaleString('id-ID')}</span>
            ),
        },
        {
            key: 'stock',
            label: 'STOK',
            render: (value) => (
                <span className={value > 10 ? 'text-green-600 font-medium' : value > 0 ? 'text-amber-500 font-medium' : 'text-red-600 font-medium'}>
                    {value}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'DIBUAT',
            render: (value) => (
                <span className="text-xs text-gray-500">
                    {new Date(value).toLocaleDateString('id-ID')}
                </span>
            ),
        },
    ];

    return (
        <AdminLayout
            title={`Manajemen ${title}`}
            activeTab={type === "retail" ? "retail" : "konstruksi"}
        >
            <div className="max-w-screen-2xl mx-auto">
                {/* Header tetap sama */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen {title}</h1>
                    <p className="text-gray-600 mt-1">Kelola data produk, spesifikasi, dan gambar</p>
                </div>

                <DataTable
                    data={productsWithNo}
                    columns={columns}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    createLabel={`Tambah ${title}`}
                    searchPlaceholder="Cari produk..."
                    emptyMessage={`Belum ada ${title.toLowerCase()}. Tambahkan produk pertama Anda!`}
                />
            </div>

            {/* Modal Detail */}
            {showDetailModal && <ProductDetailModal />}
        </AdminLayout>
    );
}
