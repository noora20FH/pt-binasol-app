import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable } from '@/Components/cms/DataTable';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

// Mock data (TIDAK DIUBAH)
const mockTeamMembers = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    order_priority: 1,
    deleted_at: null,
  },
  {
    id: 2,
    name: 'Siti Aminah',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    order_priority: 2,
    deleted_at: null,
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    order_priority: 3,
    deleted_at: null,
  },
];

export default function TeamManagement() {
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState(mockTeamMembers);

  const handleCreate = () => {
    setSelectedMember(null);
    setView('create');
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setView('edit');
  };

  const handleDelete = (member) => {
    if (confirm(`🗑 Hapus ${member.name} dari tim?`)) {
      setMembers(members.filter(m => m.id !== member.id));
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedMember(null);
  };

  const handleSave = (data) => {
    console.log('✅ Simpan anggota tim:', data);
    alert(data.id ? 'Anggota tim berhasil diupdate!' : 'Anggota tim baru berhasil ditambahkan!');
    setView('list');
  };

  // FORM VIEW (Create / Edit) — tetap sama seperti sebelumnya
  if (view === 'create' || view === 'edit') {
    return (
      <AdminLayout title="Manajemen Tim" activeTab="team">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedMember ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
              </h2>
              <p className="text-gray-600">
                {selectedMember ? 'Perbarui informasi anggota tim' : 'Masukkan informasi anggota tim'}
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                id: selectedMember?.id,
                name: e.target.name.value,
                role: e.target.role.value,
                order_priority: parseInt(e.target.order_priority.value),
              };
              handleSave(formData);
            }}
            className="bg-white rounded-2xl shadow p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
              <input
                name="name"
                defaultValue={selectedMember?.name || ''}
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan *</label>
              <input
                name="role"
                defaultValue={selectedMember?.role || ''}
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
              {selectedMember?.image && (
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="mt-4 w-24 h-24 rounded-2xl object-cover border border-gray-200"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urutan Tampilan *</label>
              <input
                name="order_priority"
                defaultValue={selectedMember?.order_priority || 1}
                type="number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Semakin kecil angka, semakin atas di website</p>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-[#E66A1B] transition-colors"
              >
                <Save className="w-5 h-5" />
                {selectedMember ? 'Update Anggota' : 'Simpan Anggota'}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    );
  }

  // LIST VIEW — SESUAI PERSIS DENGAN POLA KODINGAN PRODUCT MANAGEMENT
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
            {
              key: 'id',
              label: 'ID',
              render: (value) => <span className="font-medium">#{value}</span>,
            },
            {
              key: 'image',
              label: 'FOTO',
              render: (value) =>
                value ? (
                  <img
                    src={value}
                    alt="Foto"
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400">
                    No Foto
                  </div>
                ),
            },
            {
              key: 'name',
              label: 'NAMA',
              render: (value) => <span className="font-medium">{value}</span>,
            },
            {
              key: 'role',
              label: 'JABATAN',
            },
            {
              key: 'order_priority',
              label: 'URUTAN',
              render: (value) => <span className="font-semibold text-gray-700">{value}</span>,
            },
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
