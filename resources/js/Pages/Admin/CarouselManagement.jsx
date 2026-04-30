import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/cms/DataTable';
import { ArrowLeft, Save } from 'lucide-react';

function CarouselForm({ slide, onBack }) {
    const [title, setTitle] = useState(slide?.title || '');
    const [subtitle, setSubtitle] = useState(slide?.subtitle || '');
    const [link, setLink] = useState(slide?.link || '');
    const [theme, setTheme] = useState(slide?.theme || 'light');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(slide?.image || null);
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
        fd.append('title', title);
        fd.append('subtitle', subtitle);
        fd.append('link', link);
        fd.append('theme', theme);
        if (imageFile) fd.append('image', imageFile);

        // ✅ PERBAIKAN UTAMA: Gunakan _method spoofing untuk update
        const isEdit = !!slide?.id;
        const url = isEdit
            ? route('admin.carousel-slides.update', slide.id)
            : route('admin.carousel-slides.store');

        if (isEdit) {
            fd.append('_method', 'PUT');
        }

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
                    {slide ? 'Edit Slide Carousel' : 'Tambah Slide Carousel Baru'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar {!slide && '*'}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0])}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl"
                        required={!slide}
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-2xl" />
                    )}
                    <p className="text-xs text-gray-500 mt-1">Rekomendasi ukuran: 1920×600px</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link (URL)</label>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="/about, /products, https://..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema Teks</label>
                    <div className="flex gap-6">
                        {['light', 'dark'].map((t) => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={t}
                                    checked={theme === t}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-4 h-4 text-[#FF751F]"
                                />
                                <span className="text-sm">{t === 'light' ? 'Light (Teks Gelap)' : 'Dark (Teks Terang)'}</span>
                            </label>
                        ))}
                    </div>
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
                        {processing ? 'Menyimpan...' : slide ? 'Update Slide' : 'Simpan Slide'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function CarouselManagement({ slides = [] }) {
    const [view, setView] = useState('list');
    const [selectedSlide, setSelectedSlide] = useState(null);

    const handleCreate = () => { setSelectedSlide(null); setView('create'); };
    const handleEdit = (slide) => { setSelectedSlide(slide); setView('edit'); };
    const handleDelete = (slide) => {
        if (!confirm(`Hapus slide "${slide.title || 'ini'}"?`)) return;
        router.delete(route('admin.carousel-slides.destroy', slide.id), { preserveScroll: true });
    };
    const handleBack = () => { setView('list'); setSelectedSlide(null); };

    if (view === 'create' || view === 'edit') {
        return (
            <AdminLayout title="Manajemen Carousel" activeTab="carousel">
                <CarouselForm slide={selectedSlide} onBack={handleBack} />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Manajemen Carousel" activeTab="carousel">
            <p className="text-gray-600 mt-1 mb-6">Kelola slide carousel di halaman utama</p>

            <DataTable
                data={slides}
                columns={[
                    { key: 'id', label: 'ID', render: (v) => <span className="font-medium text-gray-500">#{v}</span> },
                    {
                        key: 'image',
                        label: 'Preview',
                        render: (v) => v ? (
                            <img src={v} alt="Preview" className="w-32 h-20 object-cover rounded-2xl border border-gray-200" />
                        ) : (
                            <div className="w-32 h-20 bg-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400">No Image</div>
                        ),
                    },
                    { key: 'title', label: 'Judul', render: (v) => <span className="font-medium">{v || '-'}</span> },
                    { key: 'subtitle', label: 'Subtitle', render: (v) => <span className="text-sm text-gray-600 line-clamp-2">{v || '-'}</span> },
                    { key: 'link', label: 'Link', render: (v) => <span className="text-sm text-blue-600">{v || '-'}</span> },
                    {
                        key: 'theme',
                        label: 'Tema',
                        render: (v) => <StatusBadge status={v === 'dark' ? 'Dark' : 'Light'} type={v === 'dark' ? 'default' : 'info'} />,
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
