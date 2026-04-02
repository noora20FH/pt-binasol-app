import React, { useState } from 'react';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { DataTable, StatusBadge } from './DataTable';
import { CarouselSlide } from '@/types/cms';

// Mock data
const mockSlides: CarouselSlide[] = [
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

interface CarouselFormProps {
  slide?: CarouselSlide;
  onBack: () => void;
  onSave: (data: any) => void;
}

function CarouselForm({ slide, onBack, onSave }: CarouselFormProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image: null as File | null,
    link: slide?.link || '',
    theme: slide?.theme || 'light',
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
            {slide ? 'Edit Slide Carousel' : 'Tambah Slide Carousel Baru'}
          </h2>
          <p className="text-gray-600">
            {slide ? 'Perbarui informasi slide' : 'Masukkan informasi slide'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required={!slide}
              />
              {slide?.image && (
                <img src={slide.image} alt="Current slide" className="mt-3 w-full h-48 object-cover rounded-lg" />
              )}
              <p className="text-xs text-gray-500 mt-1">Rekomendasi ukuran: 1920x600px</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link (URL)
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/about, /products, https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema Teks
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="light"
                    checked={formData.theme === 'light'}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as 'light' | 'dark' })}
                    className="w-4 h-4 text-[#D98344] border-gray-300 focus:ring-[#D98344]"
                  />
                  <span className="text-sm">Light (Teks Gelap)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="dark"
                    checked={formData.theme === 'dark'}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as 'light' | 'dark' })}
                    className="w-4 h-4 text-[#D98344] border-gray-300 focus:ring-[#D98344]"
                  />
                  <span className="text-sm">Dark (Teks Terang)</span>
                </label>
              </div>
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
            {slide ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CarouselManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedSlide, setSelectedSlide] = useState<CarouselSlide | undefined>();
  const [slides, setSlides] = useState<CarouselSlide[]>(mockSlides);

  const handleCreate = () => {
    setSelectedSlide(undefined);
    setView('create');
  };

  const handleEdit = (slide: CarouselSlide) => {
    setSelectedSlide(slide);
    setView('edit');
  };

  const handleDelete = (slide: CarouselSlide) => {
    setSlides(slides.filter(s => s.id !== slide.id));
    console.log('Delete carousel slide:', slide.id);
  };

  const handleBack = () => {
    setView('list');
    setSelectedSlide(undefined);
  };

  const handleSave = (data: any) => {
    console.log('Save carousel slide:', data);
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <CarouselForm
        slide={selectedSlide}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Carousel</h2>
        <p className="text-gray-600">Kelola slide carousel di halaman utama</p>
      </div>

      <DataTable
        data={slides}
        columns={[
          {
            key: 'id',
            label: 'ID',
            render: (value) => <span className="font-medium">#{value}</span>
          },
          {
            key: 'image',
            label: 'Preview',
            render: (value) =>
              value ? (
                <img src={value} alt="Slide" className="w-32 h-16 object-cover rounded" />
              ) : (
                <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              ),
          },
          {
            key: 'title',
            label: 'Judul',
            render: (value) => <span className="font-medium">{value || '-'}</span>,
          },
          {
            key: 'subtitle',
            label: 'Subtitle',
            render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>,
          },
          {
            key: 'link',
            label: 'Link',
            render: (value) => (
              <span className="text-sm text-blue-600">{value || '-'}</span>
            ),
          },
          {
            key: 'theme',
            label: 'Tema',
            render: (value) => (
              value === 'dark' ? (
                <StatusBadge status="Dark" type="default" />
              ) : (
                <StatusBadge status="Light" type="info" />
              )
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
    </div>
  );
}
