import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/cms/DataTable';
import { ArrowLeft, Save } from 'lucide-react';

function TeamForm({ member, onBack }) {
    const [name, setName] = useState(member?.name || '');
    const [role, setRole] = useState(member?.role || '');
    const [orderPriority, setOrderPriority] = useState(member?.order_priority ?? 1);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(member?.image || null);
    const [processing, setProcessing] = useState(false);

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
        fd.append('role', role);
        fd.append('order_priority', orderPriority);
        if (imageFile) fd.append('image', imageFile);

        const url = member?.id
            ? route('admin.team-members.update', member.id)
            : route('admin.team-members.store');

        router.post(url, fd, {
            forceFormData: true,
            onSuccess: onBack,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {member ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan *</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0])}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-4 w-24 h-24 rounded-2xl object-cover border border-gray-200" />
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampilan *</label>
                    <input
                        type="number"
                        value={orderPriority}
                        onChange={(e) => setOrderPriority(parseInt(e.target.value) || 0)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Semakin kecil angka, semakin atas di website</p>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={onBack} className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50">
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-8 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-[#E66A1B] disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Menyimpan...' : member ? 'Update Anggota' : 'Simpan Anggota'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function TeamManagement({ members = [] }) {
    const [view, setView] = useState('list');
    const [selectedMember, setSelectedMember] = useState(null);

    const handleCreate = () => { setSelectedMember(null); setView('create'); };
    const handleEdit = (member) => { setSelectedMember(member); setView('edit'); };
    const handleDelete = (member) => {
        if (!confirm(`Hapus ${member.name} dari tim?`)) return;
        router.delete(route('admin.team-members.destroy', member.id), { preserveScroll: true });
    };
    const handleBack = () => { setView('list'); setSelectedMember(null); };

    if (view === 'create' || view === 'edit') {
        return (
            <AdminLayout title="Manajemen Tim" activeTab="team">
                <TeamForm member={selectedMember} onBack={handleBack} />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Manajemen Tim" activeTab="team">
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Tim</h2>
                    <p className="text-gray-600">Kelola informasi anggota tim perusahaan</p>
                </div>

                <DataTable
                    data={members}
                    columns={[
                        { key: 'id', label: 'ID', render: (v) => <span className="font-medium">#{v}</span> },
                        {
                            key: 'image',
                            label: 'Foto',
                            render: (v) => v ? (
                                <img src={v} alt="Foto" className="w-12 h-12 rounded-2xl object-cover border border-gray-200" />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400">No Foto</div>
                            ),
                        },
                        { key: 'name', label: 'Nama', render: (v) => <span className="font-medium">{v}</span> },
                        { key: 'role', label: 'Jabatan' },
                        { key: 'order_priority', label: 'Urutan', render: (v) => <span className="font-semibold text-gray-700">{v}</span> },
                    ]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    createLabel="Tambah Anggota Tim"
                    searchPlaceholder="Cari anggota tim..."
                    emptyMessage="Belum ada anggota tim."
                />
            </div>
        </AdminLayout>
    );
}
