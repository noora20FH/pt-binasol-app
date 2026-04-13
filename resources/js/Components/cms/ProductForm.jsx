import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export function ProductForm({ product, categories, mode, type, onBack, onSave }) {
  const [formData, setFormData] = useState({
    category_id: product?.category_id || null,
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    badge: product?.badge || '',
    stock: product?.stock || 0,
  });

  const [specifications, setSpecifications] = useState(product?.specifications || []);
  const [images, setImages] = useState(product?.images || []);
  const [testimonials, setTestimonials] = useState(product?.testimonials || []);

  const fileInputRef = useRef(null);

  // === FILE UPLOAD HANDLER ===
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = selectedFiles.map((file, idx) => ({
      file: file,
      preview: URL.createObjectURL(file),
      is_primary: images.length === 0 && idx === 0,
    }));

    setImages([...images, ...newImages]);
    e.target.value = ''; // reset input
  };

  const removeImage = (index) => {
    const img = images[index];
    if (img.preview) URL.revokeObjectURL(img.preview);
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'is_primary' && value) {
      updated.forEach((img, i) => {
        if (i !== index) img.is_primary = false;
      });
    }
    setImages(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, specifications, images, testimonials });
  };

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleNameChange = (value) => {
    setFormData({ ...formData, name: value, slug: generateSlug(value) });
  };

  const addSpecification = () => setSpecifications([...specifications, { property: '', value: '' }]);
  const removeSpecification = (index) => setSpecifications(specifications.filter((_, i) => i !== index));
  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
  };

  const addTestimonial = () => setTestimonials([...testimonials, { name: '', rating: 5, comment: '', image: null }]);
  const removeTestimonial = (index) => setTestimonials(testimonials.filter((_, i) => i !== index));
  const updateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const title = type === 'retail' ? 'Produk Retail' : 'Produk Konstruksi';

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? `Tambah ${title} Baru` : `Edit ${title}`}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] bg-gray-50"
                required
                readOnly
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga Jual (Rp) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga Asli (Rp)</label>
              <input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344]"
                required
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Spesifikasi</h3>
            <button
              type="button"
              onClick={addSpecification}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={spec.property}
                  onChange={(e) => updateSpecification(index, 'property', e.target.value)}
                  placeholder="Property"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* === GAMBAR PRODUK (FILE UPLOAD) === */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gambar Produk</h3>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#C36F3A] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Gambar
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#D98344]/30 transition-colors"
              >
                {/* Preview */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                  {img.preview ? (
                    <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : img.image_path ? (
                    <img src={img.image_path} alt="Existing" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info & Primary */}
                <div className="flex-1 space-y-3">
                  <div className="text-sm font-medium text-gray-700">
                    {img.file ? img.file.name : 'Gambar Existing'}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!img.is_primary}
                      onChange={(e) => updateImage(index, 'is_primary', e.target.checked)}
                      className="w-4 h-4 text-[#D98344] border-gray-300 rounded focus:ring-[#D98344]"
                    />
                    <label className="text-sm font-medium text-gray-700 cursor-pointer">
                      Jadikan Gambar Utama
                    </label>
                  </div>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {images.length === 0 && (
              <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-xl">
                Belum ada gambar. Klik tombol Tambah Gambar di atas.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg">Batal</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-[#D98344] text-white rounded-lg">
            <Save className="w-4 h-4" />
            {mode === 'create' ? 'Simpan Produk' : 'Update Produk'}
          </button>
        </div>
      </form>
    </div>
  );
}
