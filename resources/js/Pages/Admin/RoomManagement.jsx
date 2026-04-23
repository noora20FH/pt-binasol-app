import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/cms/DataTable';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

// ─── Form ─────────────────────────────────────────────────────────────────────
function RoomForm({ room, onBack }) {
    const [name, setName] = useState(room?.name || '');
    const [type, setType] = useState(room?.type || '');
    const [capacity, setCapacity] = useState(room?.capacity || '');
    const [size, setSize] = useState(room?.size || '');
    const [description, setDescription] = useState(room?.description || '');
    const [priceUnit, setPriceUnit] = useState(room?.price_unit || '');
    const [isActive, setIsActive] = useState(room?.is_active ?? true);
    const [orderPriority, setOrderPriority] = useState(room?.order_priority ?? 0);
    const [facilities, setFacilities] = useState(room?.facilities || []);
    const [newFacility, setNewFacility] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(room?.image || null);
    const [processing, setProcessing] = useState(false);

    const addFacility = () => {
        if (newFacility.trim()) {
            setFacilities([...facilities, newFacility.trim()]);
            setNewFacility('');
        }
    };
    const removeFacility = (i) => setFacilities(facilities.filter((_, idx) => idx !== i));

    const handleImageChange = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        fd.append('name', name);
        fd.append('type', type);
        fd.append('capacity', capacity);
        fd.append('size', size);
        fd.append('description', description);
        fd.append('price_unit', priceUnit);
        fd.append('is_active', isActive ? '1' : '0');
        fd.append('order_priority', orderPriority);
        fd.append('facilities', JSON.stringify(facilities));
        if (imageFile) fd.append('image', imageFile);

        const url = room?.id
            ? route('admin.rooms.update', room.id)
            : route('admin.rooms.store');

        router.post(url, fd, {
            forceFormData: true,
            onSuccess: onBack,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {room ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Informasi Dasar</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Ruangan *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Ruangan</label>
                            <input
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                placeholder="Meeting Room, Boardroom, dll"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
                            <input
                                type="text"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                placeholder="8-12 Orang"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ukuran</label>
                            <input
                                type="text"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                placeholder="45 m²"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Satuan Harga</label>
                            <input
                                type="text"
                                value={priceUnit}
                                onChange={(e) => setPriceUnit(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                placeholder="per jam, per hari"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                placeholder="Deskripsi ruangan..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampilan</label>
                            <input
                                type="number"
                                value={orderPriority}
                                onChange={(e) => setOrderPriority(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-5 h-5 text-[#FF751F] rounded"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Tampilkan di website
                            </label>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Foto Ruangan</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0])}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-4 w-full h-56 object-cover rounded-xl" />
                    )}
                    <p className="text-xs text-gray-500 mt-2">Rekomendasi: 800×600px, maks 4MB</p>
                </div>

                {/* Facilities */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Fasilitas</h3>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newFacility}
                            onChange={(e) => setNewFacility(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                            placeholder="Tambah fasilitas (tekan Enter)"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                        />
                        <button
                            type="button"
                            onClick={addFacility}
                            className="flex items-center gap-2 px-4 py-3 bg-[#FF751F] text-white rounded-xl hover:bg-[#E66A1B]"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {facilities.map((fac, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-sm">
                                <span>{fac}</span>
                                <button type="button" onClick={() => removeFacility(i)} className="text-amber-600 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        {facilities.length === 0 && (
                            <p className="text-sm text-gray-500">Belum ada fasilitas. Tambahkan di atas.</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button type="button" onClick={onBack} className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50">
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-8 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-[#E66A1B] disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Menyimpan...' : room ? 'Update Ruangan' : 'Simpan Ruangan'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RoomManagement({ rooms = [] }) {
    const [view, setView] = useState('list');
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleCreate = () => { setSelectedRoom(null); setView('create'); };
    const handleEdit = (room) => { setSelectedRoom(room); setView('edit'); };
    const handleDelete = (room) => {
        if (!confirm(`Hapus ruangan "${room.name}"?`)) return;
        router.delete(route('admin.rooms.destroy', room.id), { preserveScroll: true });
    };
    const handleBack = () => { setView('list'); setSelectedRoom(null); };

    if (view === 'create' || view === 'edit') {
        return (
            <AdminLayout title={view === 'create' ? 'Tambah Ruangan' : 'Edit Ruangan'} activeTab="sewa-ruangan">
                <RoomForm room={selectedRoom} onBack={handleBack} />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Manajemen Sewa Ruangan" activeTab="sewa-ruangan">
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Sewa Ruangan</h2>
                    <p className="text-gray-600">Kelola data ruangan yang tersedia untuk disewa</p>
                </div>

                <DataTable
                    data={rooms}
                    columns={[
                        { key: 'id', label: 'ID', render: (v) => <span className="font-medium">#{v}</span> },
                        {
                            key: 'image',
                            label: 'Foto',
                            render: (v) => v ? (
                                <img src={v} alt="Room" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
                            ) : (
                                <div className="w-20 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>
                            ),
                        },
                        { key: 'name', label: 'Nama Ruangan', render: (v) => <span className="font-medium">{v}</span> },
                        { key: 'type', label: 'Tipe', render: (v) => v || '-' },
                        { key: 'capacity', label: 'Kapasitas', render: (v) => v || '-' },
                        { key: 'size', label: 'Ukuran', render: (v) => v || '-' },
                        { key: 'price_unit', label: 'Satuan Harga', render: (v) => v || '-' },
                        {
                            key: 'is_active',
                            label: 'Status',
                            render: (v) => <StatusBadge status={v ? 'Aktif' : 'Nonaktif'} type={v ? 'success' : 'default'} />,
                        },
                        { key: 'order_priority', label: 'Urutan', render: (v) => <span className="font-semibold">{v}</span> },
                    ]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    createLabel="Tambah Ruangan"
                    searchPlaceholder="Cari ruangan..."
                    emptyMessage="Belum ada ruangan. Tambahkan ruangan pertama Anda!"
                />
            </div>
        </AdminLayout>
    );
}
