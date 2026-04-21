import React, { useEffect, useRef } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useForm, router } from "@inertiajs/react";

export default function ProductForm({
    product = null,
    categories = [],
    mode = "create",
    type,
    onBack, // ← ditambahkan agar tombol Batal di bawah bisa dipakai
}) {
    const isEdit = mode === "edit";

    const { data, setData, post, processing, errors } = useForm({
        category_id: "",
        name: "",
        slug: "",
        description: "",
        price: "",
        original_price: "",
        badge: "",
        stock: 0,
        specifications: [],
        images: [],
        testimonials: [],
    });

    const fileInputRef = useRef(null);

    // Sync data saat Edit (sama seperti FilmForm)
    useEffect(() => {
        if (product) {
            setData({
                category_id: product.category_id || "",
                name: product.name || "",
                slug: product.slug || "",
                description: product.description || "",
                price: product.price || "",
                original_price: product.original_price || "",
                badge: product.badge || "",
                stock: product.stock || 0,
                specifications: product.specifications || [],
                images: product.images || [],
                testimonials: product.testimonials || [],
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("category_id", data.category_id);
        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description || "");
        formData.append("price", data.price);
        formData.append("original_price", data.original_price || "");
        formData.append("badge", data.badge || "");
        formData.append("stock", data.stock);
        formData.append("type", type);

        // Specifications
        if (data.specifications.length) {
            formData.append(
                "specifications",
                JSON.stringify(data.specifications),
            );
        }

        // Images (multiple + is_primary)
        data.images.forEach((img, index) => {
            if (img.file instanceof File) {
                formData.append(`images[${index}][file]`, img.file);
                formData.append(
                    `images[${index}][is_primary]`,
                    img.is_primary ? "1" : "0",
                );
            } else if (img.id) {
                // Existing image saat edit
                formData.append(`images[${index}][id]`, img.id);
                formData.append(
                    `images[${index}][is_primary]`,
                    img.is_primary ? "1" : "0",
                );
            }
        });

        if (isEdit) {
            formData.append("_method", "PUT");

            router.post(route("admin.products.update", product.id), formData, {
                forceFormData: true, // ← PENTING untuk multiple files
                onSuccess: () => router.get(route(`admin.${type}-products`)),
                onError: (errors) => console.error(errors),
            });
        } else {
            router.post(route("admin.products.store"), formData, {
                forceFormData: true,
                onSuccess: () => router.get(route(`admin.${type}-products`)),
                onError: (errors) => console.error(errors),
            });
        }
    };

    // ==================== HANDLERS ====================
    const generateSlug = (name) =>
        name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();

    const handleNameChange = (value) => {
        setData("name", value);
        setData("slug", generateSlug(value));
    };

    const addSpecification = () =>
        setData("specifications", [
            ...data.specifications,
            { property: "", value: "" },
        ]);

    const removeSpecification = (index) => {
        const updated = data.specifications.filter((_, i) => i !== index);
        setData("specifications", updated);
    };

    const updateSpecification = (index, field, value) => {
        const updated = [...data.specifications];
        updated[index][field] = value;
        setData("specifications", updated);
    };

    // Images handlers
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newImages = selectedFiles.map((file, idx) => ({
            file,
            preview: URL.createObjectURL(file),
            is_primary: data.images.length === 0 && idx === 0,
        }));
        setData("images", [...data.images, ...newImages]);
        e.target.value = "";
    };

    const removeImage = (index) => {
        const img = data.images[index];
        if (img.preview) URL.revokeObjectURL(img.preview);
        setData(
            "images",
            data.images.filter((_, i) => i !== index),
        );
    };

    const updateImage = (index, field, value) => {
        const updated = [...data.images];
        updated[index] = { ...updated[index], [field]: value };

        if (field === "is_primary" && value) {
            updated.forEach((img, i) => {
                if (i !== index) img.is_primary = false;
            });
        }
        setData("images", updated);
    };

    const title = type === "retail" ? "Produk Retail" : "Produk Konstruksi";

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => router.get(route(`admin.${type}-products`))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEdit ? `Edit ${title}` : `Tambah ${title} Baru`}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Informasi Dasar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori *
                            </label>
                            <select
                                value={data.category_id || ""}
                                onChange={(e) =>
                                    setData(
                                        "category_id",
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : null,
                                    )
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                                required
                            >
                                <option value="">Pilih kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Produk *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    handleNameChange(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                value={data.slug}
                                onChange={(e) =>
                                    setData("slug", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] bg-gray-50"
                                required
                                readOnly
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Harga Jual (Rp) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) =>
                                    setData("price", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Harga Asli (Rp)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.original_price}
                                onChange={(e) =>
                                    setData("original_price", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Badge
                            </label>
                            <input
                                type="text"
                                value={data.badge}
                                onChange={(e) =>
                                    setData("badge", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stok *
                            </label>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={(e) =>
                                    setData(
                                        "stock",
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Spesifikasi
                        </h3>
                        <button
                            type="button"
                            onClick={addSpecification}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg"
                        >
                            <Plus className="w-4 h-4" /> Tambah
                        </button>
                    </div>
                    <div className="space-y-3">
                        {(data.specifications || []).map((spec, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={spec.property}
                                    onChange={(e) =>
                                        updateSpecification(
                                            index,
                                            "property",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Property"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    value={spec.value}
                                    onChange={(e) =>
                                        updateSpecification(
                                            index,
                                            "value",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Value"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpecification(index)}
                                    className="p-2 text-red-600"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gambar Produk */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Gambar Produk
                        </h3>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#C36F3A]"
                        >
                            <Plus className="w-4 h-4" /> Tambah Gambar
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="space-y-4">
                        {(data.images || []).map((img, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#D98344]/30 transition-colors"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                    {img.preview ? (
                                        <img
                                            src={img.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : img.image_path ? (
                                        <img
                                            src={img.image_path ? `/storage/${img.image_path}` : '/placeholder.jpg'}
                                            alt="Existing"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="text-sm font-medium text-gray-700">
                                        {img.file
                                            ? img.file.name
                                            : "Gambar Existing"}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={!!img.is_primary}
                                            onChange={(e) =>
                                                updateImage(
                                                    index,
                                                    "is_primary",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 text-[#D98344] border-gray-300 rounded focus:ring-[#D98344]"
                                        />
                                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                                            Jadikan Gambar Utama
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        {data.images.length === 0 && (
                            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-xl">
                                Belum ada gambar. Klik tombol Tambah Gambar di
                                atas.
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={
                            onBack ||
                            (() => router.get(route(`admin.${type}-products`)))
                        }
                        className="px-6 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-8 py-3 bg-[#D98344] text-white rounded-2xl hover:bg-[#C36F3A] disabled:opacity-70"
                    >
                        <Save className="w-5 h-5" />
                        {isEdit ? "Update Produk" : "Simpan Produk"}
                    </button>
                </div>
            </form>
        </div>
    );
}
