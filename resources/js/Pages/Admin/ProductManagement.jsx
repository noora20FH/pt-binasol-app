import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/cms/DataTable';
import { ArrowLeft, Save, Plus, Trash2, X } from 'lucide-react';

// ─── Form Component ───────────────────────────────────────────────────────────
function ProductForm({ product, categories, mode, type, onBack }) {
    const [specifications, setSpecifications] = useState(
        product?.specifications || []
    );
    const [existingImages, setExistingImages] = useState(
        product?.images || []
    );
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        category_id:    product?.category_id || '',
        name:           product?.name || '',
        description:    product?.description || '',
        price:          product?.price || '',
        original_price: product?.original_price || '',
        badge:          product?.badge || '',
        stock:          product?.stock ?? 0,
        images:         [],
        specifications: product?.specifications || [],
    });

    const generateSlug = (name) =>
        name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    const handleNameChange = (value) => setData('name', value);

    const addSpec = () => {
        const updated = [...specifications, { property: '', value: '' }];
        setSpecifications(updated);
        setData('specifications', updated);
    };
    const removeSpec = (i) => {
        const updated = specifications.filter((_, idx) => idx !== i);
        setSpecifications(updated);
        setData('specifications', updated);
    };
    const updateSpec = (i, field, value) => {
        const updated = [...specifications];
        updated[i] = { ...updated[i], [field]: value };
        setSpecifications(updated);
        setData('specifications', updated);
    };

    const handleImageFiles = (files) => {
        const fileArr = Array.from(files);
        setData('images', fileArr);
        const previews = fileArr.map((f) => URL.createObjectURL(f));
        setNewImagePreviews(previews);
    };

    const deleteExistingImage = (imageId) => {
        if (!confirm('Hapus gambar ini?')) return;
        router.delete(route('admin.product-images.destroy', imageId), {
            preserveScroll: true,
            onSuccess: () => setExistingImages((prev) => prev.filter((img) => img.id !== imageId)),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('category_id', data.category_id);
        fd.append('name', data.name);
        fd.append('description', data.description || '');
        fd.append('price', data.price);
        fd.append('original_price', data.original_price || '');
        fd.append('badge', data.badge || '');
        fd.append('stock', data.stock);
        fd.append('specifications', JSON.stringify(specifications));
        data.images.forEach((file) => fd.append('images[]', file));

        if (mode === 'edit' && product?.id) {
            fd.append('_method', 'PUT');
            router.post(route('admin.products.update', product.id), fd, {
                forceFormData: true,
                onSuccess: onBack,
            });
        } else {
            router.post(route('admin.products.store'), fd, {
                forceFormData: true,
                onSuccess: onBack,
            });
        }
    };

    const title = type === 'retail' ? 'Produk Retail' : 'Produk Konstruksi';

    return (
        <div className="max-w-5xl">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {mode === 'create' ? `Tambah ${title}` : `Edit ${title}`}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                                required
                            >
                                <option value="">Pilih kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Harga Jual (Rp) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                                required
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Harga Asli (Rp)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.original_price}
                                onChange={(e) => setData('original_price', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                            <input
                                type="text"
                                value={data.badge}
                                onChange={(e) => setData('badge', e.target.value)}
                                placeholder="Best Seller, New, dll"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                                required
                            />
                            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Gambar Produk</h3>

                    {/* Existing images */}
                    {existingImages.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                            <div className="flex flex-wrap gap-3">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative">
                                        <img
                                            src={img.image_path}
                                            alt="Product"
                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                        />
                                        {img.is_primary && (
                                            <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">Utama</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingImage(img.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {existingImages.length > 0 ? 'Tambah Gambar Baru' : 'Upload Gambar'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageFiles(e.target.files)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Bisa pilih beberapa gambar sekaligus. Gambar pertama akan jadi gambar utama.</p>
                    </div>

                    {newImagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                            {newImagePreviews.map((src, i) => (
                                <img key={i} src={src} alt={`Preview ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border-2 border-[#FF751F]" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Spesifikasi</h3>
                        <button
                            type="button"
                            onClick={addSpec}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#FF751F] text-white rounded-lg hover:bg-[#E66A1B]"
                        >
                            <Plus className="w-4 h-4" /> Tambah
                        </button>
                    </div>
                    <div className="space-y-3">
                        {specifications.map((spec, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={spec.property}
                                    onChange={(e) => updateSpec(i, 'property', e.target.value)}
                                    placeholder="Nama spesifikasi"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    value={spec.value}
                                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                                    placeholder="Nilai"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <button type="button" onClick={() => removeSpec(i)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {specifications.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">Belum ada spesifikasi. Klik "Tambah" untuk menambahkan.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-6 py-2 bg-[#FF751F] text-white rounded-lg hover:bg-[#E66A1B] disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Menyimpan...' : mode === 'create' ? 'Simpan Produk' : 'Update Produk'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductManagement({ products = [], categories = [], type = 'retail' }) {
    const [view, setView] = useState('list');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleCreate = () => { setSelectedProduct(null); setView('create'); };
    const handleEdit = (product) => { setSelectedProduct(product); setView('edit'); };
    const handleDelete = (product) => {
        if (!confirm(`Hapus produk "${product.name}"?`)) return;
        router.delete(route('admin.products.destroy', product.id), { preserveScroll: true });
    };
    const handleBack = () => { setView('list'); setSelectedProduct(null); };

    const title = type === 'retail' ? 'Produk Retail' : 'Produk Konstruksi';
    const activeTab = type === 'retail' ? 'retail' : 'konstruksi';

    if (view === 'create' || view === 'edit') {
        return (
            <AdminLayout title={`${view === 'create' ? 'Tambah' : 'Edit'} ${title}`} activeTab={activeTab}>
                <ProductForm
                    product={selectedProduct}
                    categories={categories}
                    mode={view}
                    type={type}
                    onBack={handleBack}
                />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Manajemen ${title}`} activeTab={activeTab}>
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen {title}</h2>
                    <p className="text-gray-600">Kelola data produk, spesifikasi, dan gambar</p>
                </div>

                <DataTable
                    data={products}
                    columns={[
                        { key: 'id', label: 'ID', render: (v) => <span className="font-medium">#{v}</span> },
                        {
                            key: 'images',
                            label: 'Gambar',
                            render: (v) => {
                                const primary = v?.find((img) => img.is_primary) || v?.[0];
                                return primary?.image_path ? (
                                    <img src={primary.image_path} alt="Product" className="w-16 h-16 object-cover rounded-lg" />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                );
                            },
                        },
                        { key: 'category_name', label: 'Kategori' },
                        { key: 'name', label: 'Nama Produk', render: (v) => <span className="font-medium">{v}</span> },
                        {
                            key: 'price',
                            label: 'Harga',
                            render: (v) => <span className="font-medium text-green-600">Rp {Number(v).toLocaleString('id-ID')}</span>,
                        },
                        {
                            key: 'stock',
                            label: 'Stok',
                            render: (v) => (
                                <span className={v > 10 ? 'text-green-600 font-medium' : v > 0 ? 'text-yellow-600 font-medium' : 'text-red-600 font-medium'}>
                                    {v}
                                </span>
                            ),
                        },
                        { key: 'badge', label: 'Badge', render: (v) => v ? <StatusBadge status={v} type="info" /> : '-' },
                        {
                            key: 'created_at',
                            label: 'Dibuat',
                            render: (v) => <span className="text-xs text-gray-500">{new Date(v).toLocaleDateString('id-ID')}</span>,
                        },
                    ]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    createLabel={`Tambah ${title}`}
                    searchPlaceholder="Cari produk..."
                    emptyMessage={`Belum ada ${title.toLowerCase()}.`}
                />
            </div>
        </AdminLayout>
    );
}
