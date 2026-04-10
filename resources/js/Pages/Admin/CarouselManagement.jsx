import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/cms/DataTable';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

// Mock data (TIDAK DIUBAH)
const mockSlides = [
  {
    id: 1,
    title: 'Selamat Datang di PT Binasol',
    subtitle: 'Solusi Terpadu untuk Film, Retail, dan Konstruksi',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    link: '/about',
    theme: 'dark',
    deleted_at: null,
  },
  {
    id: 2,
    title: 'Produk Berkualitas',
    subtitle: 'Dapatkan produk terbaik dengan harga terjangkau',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    link: '/products',
    theme: 'light',
    deleted_at: null,
  },
];

export default function CarouselManagement() {
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [slides, setSlides] = useState(mockSlides);

  const handleCreate = () => {
    setSelectedSlide(null);
    setView('create');
  };

  const handleEdit = (slide) => {
    setSelectedSlide(slide);
    setView('edit');
  };

  const handleDelete = (slide) => {
    if (confirm(`🗑 Hapus slide "${slide.title}"?`)) {
      setSlides(slides.filter(s => s.id !== slide.id));
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedSlide(null);
  };

  const handleSave = (data) => {
    console.log('✅ Simpan slide carousel:', data);
    alert(data.id ? 'Slide berhasil diupdate!' : 'Slide baru berhasil ditambahkan!');
    setView('list');
  };

  // FORM VIEW (Create / Edit)
  if (view === 'create' || view === 'edit') {
    return (
      <AdminLayout title="Manajemen Carousel" activeTab="carousel">
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
                {selectedSlide ? 'Edit Slide Carousel' : 'Tambah Slide Carousel Baru'}
              </h2>
              <p className="text-gray-600">
                {selectedSlide ? 'Perbarui informasi slide' : 'Masukkan informasi slide'}
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                id: selectedSlide?.id,
                title: e.target.title.value,
                subtitle: e.target.subtitle.value,
                link: e.target.link.value,
                theme: e.target.theme.value,
              };
              handleSave(formData);
            }}
            className="bg-white rounded-2xl shadow p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
              <input
                name="title"
                defaultValue={selectedSlide?.title || ''}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                name="subtitle"
                defaultValue={selectedSlide?.subtitle || ''}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar *</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
              {selectedSlide?.image && (
                <img
                  src={selectedSlide.image}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-2xl"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">Rekomendasi ukuran: 1920 × 600 px</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link (URL)</label>
              <input
                name="link"
                defaultValue={selectedSlide?.link || ''}
                type="text"
                placeholder="/about, /products, https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema Teks</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    defaultChecked={selectedSlide?.theme === 'light' || !selectedSlide}
                    className="w-4 h-4 text-[#FF751F] border-gray-300 focus:ring-[#FF751F]"
                  />
                  <span className="text-sm">Light (Teks Gelap)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    defaultChecked={selectedSlide?.theme === 'dark'}
                    className="w-4 h-4 text-[#FF751F] border-gray-300 focus:ring-[#FF751F]"
                  />
                  <span className="text-sm">Dark (Teks Terang)</span>
                </label>
              </div>
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
                {selectedSlide ? 'Update Slide' : 'Simpan Slide'}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    );
  }

  // LIST VIEW — SESUAI 100% DENGAN DESAIN FIGMA
  return (
    <AdminLayout title="Manajemen Carousel" activeTab="carousel">
      <p className="text-gray-600 mt-1 mb-6">
        Kelola slide carousel di halaman utama
      </p>

      <DataTable
        data={slides}
        columns={[
          {
            key: 'id',
            label: 'ID',
            render: (value) => <span className="font-medium text-gray-500">#{value}</span>,
          },
          {
            key: 'image',
            label: 'PREVIEW',
            render: (value) =>
              value ? (
                <img
                  src={value}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded-2xl border border-gray-200"
                />
              ) : (
                <div className="w-32 h-20 bg-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              ),
          },
          {
            key: 'title',
            label: 'JUDUL',
            render: (value) => <span className="font-medium">{value || '-'}</span>,
          },
          {
            key: 'subtitle',
            label: 'SUBTITLE',
            render: (value) => <span className="text-sm text-gray-600 line-clamp-2">{value || '-'}</span>,
          },
          {
            key: 'link',
            label: 'LINK',
            render: (value) => <span className="text-sm text-blue-600 font-medium">{value || '-'}</span>,
          },
          {
            key: 'theme',
            label: 'TEMA',
            render: (value) => (
              <StatusBadge
                status={value === 'dark' ? 'Dark' : 'Light'}
                type={value === 'dark' ? 'default' : 'info'}
              />
            ),
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Tambah Slide"
        searchPlaceholder="Cari slide..."
        emptyMessage="Belum ada slide carousel."
      />
    </AdminLayout>
  );
}
