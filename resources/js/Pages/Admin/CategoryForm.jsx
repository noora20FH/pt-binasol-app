import React, { useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useForm, router } from "@inertiajs/react";

export default function CategoryForm({
    category = null,
    mode = "create",
}) {
    const isEdit = mode === "edit";

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        image: null,
        icon: null,
        type: "retail",
        is_logo: 0,
    });

    // Sync data saat Edit
    useEffect(() => {
        if (category) {
            setData({
                name: category.name || "",
                slug: category.slug || "",
                description: category.description || "",
                image: null,
                icon: null,
                type: category.type || "retail",
                is_logo: category.is_logo || 0,
            });
        }
    }, [category]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description || "");
        formData.append("type", data.type);
        formData.append("is_logo", data.is_logo ? "1" : "0");

        if (data.image) formData.append("image", data.image);
        if (data.icon) formData.append("icon", data.icon);

        if (isEdit) {
            formData.append("_method", "PUT");
            router.post(route("admin.categories.update", category.id), formData, {
                forceFormData: true,
                onSuccess: () => router.get(route("admin.categories.index")),
            });
        } else {
            router.post(route("admin.categories.store"), formData, {
                forceFormData: true,
                onSuccess: () => router.get(route("admin.categories.index")),
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => router.get(route("admin.categories.index"))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Kategori</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                            <input
                                type="text"
                                value={data.slug}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kategori</label>
                            <select
                                value={data.type}
                                onChange={(e) => setData("type", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                            >
                                <option value="retail">Retail</option>
                                <option value="construction">Konstruksi</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={!!data.is_logo}
                                onChange={(e) => setData("is_logo", e.target.checked ? 1 : 0)}
                                className="w-5 h-5 text-[#D98344]"
                            />
                            <label className="text-sm font-medium text-gray-700">Logo Resmi (is_logo)</label>
                        </div>
                    </div>
                </div>

                {/* Gambar & Icon */}
                <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kategori</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData("image", e.target.files[0])}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        {category?.image && (
                            <img src={category.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-xl" />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData("icon", e.target.files[0])}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        {category?.icon && (
                            <img src={category.icon} alt="Icon Preview" className="mt-3 w-16 h-16 object-cover rounded-xl" />
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.get(route("admin.categories.index"))}
                        className="px-6 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-8 py-3 bg-[#D98344] text-white rounded-2xl hover:bg-[#C36F3A]"
                    >
                        <Save className="w-5 h-5" />
                        {isEdit ? "Update Kategori" : "Simpan Kategori"}
                    </button>
                </div>
            </form>
        </div>
    );
}
