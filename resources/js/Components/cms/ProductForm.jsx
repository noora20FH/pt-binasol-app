import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Product, Category } from '../../types/cms';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  mode: 'create' | 'edit';
  type: 'retail' | 'construction';
  onBack: () => void;
  onSave: (data: any) => void;
}

export function ProductForm({ product, categories, mode, type, onBack, onSave }: ProductFormProps) {
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

  const [specifications, setSpecifications] = useState<any[]>(
    product?.specifications || []
  );

  const [images, setImages] = useState<any[]>(
    product?.images || []
  );

  const [testimonials, setTestimonials] = useState<any[]>(
    product?.testimonials || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, specifications, images, testimonials });
  };

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value)
    });
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { property: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: string, value: any) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    setSpecifications(updated);
  };

  const addImage = () => {
    setImages([...images, { image_path: null, is_primary: images.length === 0 }]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: string, value: any) => {
    const updated = [...images];
    if (field === 'is_primary' && value) {
      // Unset other primary images
      updated.forEach((img, i) => {
        if (i !== index) img.is_primary = false;
      });
    }
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, { name: '', rating: 5, comment: '', image: null }]);
  };

  const removeTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const title = type === 'retail' ? 'Produk Retail' : 'Produk Konstruksi';

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? `Tambah ${title} Baru` : `Edit ${title}`}
          </h2>
          <p className="text-gray-600">
            {mode === 'create' ? 'Masukkan informasi produk' : 'Perbarui informasi produk'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Pilih kategori produk</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent bg-gray-50"
                required
                maxLength={255}
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Dibuat otomatis dari nama produk (harus unik)</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                placeholder="Deskripsi lengkap produk..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Format: DECIMAL(10,2)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Asli (Rp)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Opsional, untuk menampilkan diskon</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Best Seller, New, Promo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal 100 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Default: 0</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Spesifikasi</h3>
            <button
              type="button"
              onClick={addSpecification}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Spesifikasi
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={spec.property}
                  onChange={(e) => updateSpecification(index, 'property', e.target.value)}
                  placeholder={type === 'construction' ? 'Material, Grade, dll *' : 'Ukuran, Bahan, dll *'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                  required
                  maxLength={255}
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  placeholder="Nilai *"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                  required
                  maxLength={255}
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {specifications.length === 0 && (
              <p className="text-center text-gray-500 py-4">Belum ada spesifikasi.</p>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gambar Produk</h3>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Gambar
            </button>
          </div>

          <div className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateImage(index, 'image_path', e.target.files?.[0] || null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                />
                <label className="flex items-center gap-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={img.is_primary}
                    onChange={(e) => updateImage(index, 'is_primary', e.target.checked)}
                    className="w-4 h-4 text-[#D98344] border-gray-300 rounded focus:ring-[#D98344]"
                  />
                  <span className="text-sm text-gray-700">Gambar Utama</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <p className="text-center text-gray-500 py-4">Belum ada gambar.</p>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Testimoni Pelanggan</h3>
            <button
              type="button"
              onClick={addTestimonial}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Testimoni
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama *
                    </label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating || 5}
                      onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
                    <textarea
                      value={testimonial.comment}
                      onChange={(e) => updateTestimonial(index, 'comment', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end gap-2 md:col-span-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateTestimonial(index, 'image', e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <p className="text-center text-gray-500 py-4">Belum ada testimoni.</p>
            )}
          </div>
        </div>

        {/* Actions */}
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
            {mode === 'create' ? 'Simpan Produk' : 'Update Produk'}
          </button>
        </div>
      </form>
    </div>
  );
}
