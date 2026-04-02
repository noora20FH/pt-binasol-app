import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { DataTable } from './DataTable';
import { TeamMember } from '../../types/cms';

// Mock data
const mockTeamMembers: TeamMember[] = [
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

interface TeamFormProps {
  member?: TeamMember;
  onBack: () => void;
  onSave: (data: any) => void;
}

function TeamForm({ member, onBack, onSave }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    image: null as File | null,
    order_priority: member?.order_priority || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {member ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
          </h2>
          <p className="text-gray-600">
            {member ? 'Perbarui informasi anggota tim' : 'Masukkan informasi anggota tim'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Profil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
              {member?.image && (
                <img src={member.image} alt={member.name} className="mt-3 w-24 h-24 rounded-full object-cover" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan Tampilan *
              </label>
              <input
                type="number"
                value={formData.order_priority}
                onChange={(e) => setFormData({ ...formData, order_priority: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Semakin kecil angka, semakin awal ditampilkan</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
          >
            <Save className="w-4 h-4" />
            {member ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function TeamManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>();
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);

  const handleCreate = () => {
    setSelectedMember(undefined);
    setView('create');
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setView('edit');
  };

  const handleDelete = (member: TeamMember) => {
    setMembers(members.filter(m => m.id !== member.id));
    console.log('Delete team member:', member.id);
  };

  const handleBack = () => {
    setView('list');
    setSelectedMember(undefined);
  };

  const handleSave = (data: any) => {
    console.log('Save team member:', data);
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <TeamForm
        member={selectedMember}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  return (
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
            render: (value) => <span className="font-medium">#{value}</span>
          },
          {
            key: 'image',
            label: 'Foto',
            render: (value) =>
              value ? (
                <img src={value} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              ),
          },
          {
            key: 'name',
            label: 'Nama',
            render: (value) => <span className="font-medium">{value}</span>,
          },
          {
            key: 'role',
            label: 'Jabatan',
          },
          {
            key: 'order_priority',
            label: 'Urutan',
            render: (value) => <span className="text-gray-600">{value}</span>,
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
  );
}
