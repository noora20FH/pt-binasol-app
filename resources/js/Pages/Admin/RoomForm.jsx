// resources/js/Pages/Admin/RoomForm.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function RoomForm({ room = null }) {
    const isEdit = !!room;

    const [name, setName] = useState(room?.name || "");
    const [type, setType] = useState(room?.type || "");
    const [capacity, setCapacity] = useState(room?.capacity || "");
    const [size, setSize] = useState(room?.size || "");
    const [description, setDescription] = useState(room?.description || "");
    const [priceUnit, setPriceUnit] = useState(room?.price_unit || "");
    const [isActive, setIsActive] = useState(room?.is_active ?? true);
    const [orderPriority, setOrderPriority] = useState(room?.order_priority ?? 0);
    const [facilities, setFacilities] = useState(room?.facilities || []);
    const [newFacility, setNewFacility] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(room?.image || null);
    const [processing, setProcessing] = useState(false);

    // Sync data ketika prop room berubah (mirip FilmForm)
    useEffect(() => {
        if (room) {
            setName(room.name || "");
            setType(room.type || "");
            setCapacity(room.capacity || "");
            setSize(room.size || "");
            setDescription(room.description || "");
            setPriceUnit(room.price_unit || "");
            setIsActive(room.is_active ?? true);
            setOrderPriority(room.order_priority ?? 0);
            setFacilities(room.facilities || []);
            setImagePreview(room.image || null);
            setImageFile(null);
        }
    }, [room]);

    const addFacility = () => {
        if (newFacility.trim()) {
            setFacilities([...facilities, newFacility.trim()]);
            setNewFacility("");
        }
    };

    const removeFacility = (index) => {
        setFacilities(facilities.filter((_, i) => i !== index));
    };

    const handleImageChange = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("capacity", capacity);
        formData.append("size", size);
        formData.append("description", description);
        formData.append("price_unit", priceUnit);
        formData.append("is_active", isActive ? "1" : "0");
        formData.append("order_priority", orderPriority);
        formData.append("facilities", JSON.stringify(facilities));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        const url = isEdit
            ? route("admin.rooms.update", room.id)
            : route("admin.rooms.store");

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => router.get(route("admin.rooms.index")),
            onFinish: () => setProcessing(false),
            onError: () => setProcessing(false),
        });
    };

    return (

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => router.get(route("admin.rooms.index"))}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEdit ? "Edit Ruangan" : "Tambah Ruangan Baru"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Informasi Dasar</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Ruangan *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    placeholder="Ruang Meeting Executive"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipe Ruangan
                                </label>
                                <input
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    placeholder="Meeting Room, Boardroom, dll"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapasitas
                                </label>
                                <input
                                    type="text"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    placeholder="8-12 Orang"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ukuran
                                </label>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    placeholder="45 m²"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Satuan Harga
                                </label>
                                <input
                                    type="text"
                                    value={priceUnit}
                                    onChange={(e) => setPriceUnit(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    placeholder="per jam, per hari, dll"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    placeholder="Deskripsi lengkap ruangan..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Urutan Tampilan
                                </label>
                                <input
                                    type="number"
                                    value={orderPriority}
                                    onChange={(e) => setOrderPriority(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-5 h-5 text-[#FF751F] rounded focus:ring-[#FF751F]"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    Tampilkan di website publik
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Foto Ruangan */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto Ruangan</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-h-64 object-cover rounded-xl border border-gray-200"
                                />
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                            Rekomendasi: 800×600 px atau lebih besar, maksimal 4MB
                        </p>
                    </div>

                    {/* Fasilitas */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fasilitas</h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newFacility}
                                onChange={(e) => setNewFacility(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                                placeholder="Tambah fasilitas (tekan Enter)"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                            />
                            <button
                                type="button"
                                onClick={addFacility}
                                className="flex items-center gap-2 px-5 py-3 bg-[#FF751F] text-white rounded-xl hover:bg-[#E66A1B]"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {facilities.map((fac, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm"
                                >
                                    <span>{fac}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFacility(i)}
                                        className="text-amber-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {facilities.length === 0 && (
                                <p className="text-sm text-gray-500 py-4">
                                    Belum ada fasilitas ditambahkan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.get(route("admin.rooms.index"))}
                            className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-[#E66A1B] disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-5 h-5" />
                            {processing
                                ? "Menyimpan..."
                                : isEdit
                                ? "Update Ruangan"
                                : "Simpan Ruangan"}
                        </button>
                    </div>
                </form>
            </div>
        
    );
}
