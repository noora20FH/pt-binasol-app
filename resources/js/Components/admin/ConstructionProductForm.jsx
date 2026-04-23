import { useState } from 'react';
import { Plus, Trash2, Upload, X, Save, ArrowLeft } from 'lucide-react';
import { useForm, Link } from '@inertiajs/react';

export function ConstructionProductForm({ product, categories, mode }) {
  const [mainImagePreview, setMainImagePreview] = useState(
    typeof product?.image === 'string' ? product.image : null
  );

  const { data, setData, post, put, processing, errors } = useForm({
    category_id: product?.category_id || '',
    name: product?.name || '',
    specifications: product?.specifications || '',
    price: product?.price || '',
    image: null,
    stock: product?.stock || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('category_id', String(data.category_id));
    formData.append('name', data.name);
    formData.append('specifications', data.specifications);
    formData.append('price', String(data.price));
    formData.append('stock', String(data.stock));
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    if (mode === 'edit' && product?.id) {
      formData.append('_method', 'PUT');
      post(route('admin.construction-products.update', product.id), { data: formData, forceFormData: true });
    } else {
      post(route('admin.construction-products.store'), { data: formData, forceFormData: true });
    }
  };

  const handleMainImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
      setData('image', file);
    } else {
      setMainImagePreview(null);
      setData('image', null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/construction-products" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Tambah Produk Konstruksi' : 'Edit Produk Konstruksi'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Spesifikasi</label>
              <textarea
                value={data.specifications}
                onChange={(e) => setData('specifications', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
              <input
                type="number"
                min="0"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
              <input
                type="number"
                min="0"
                value={data.stock}
                onChange={(e) => setData('stock', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF751F]"
                required
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Produk</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {mainImagePreview ? (
              <div className="relative">
                <img src={mainImagePreview} alt="Preview" className="w-full max-w-md mx-auto h-64 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleMainImageChange(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-sm text-gray-600 mb-1">Klik untuk upload gambar</span>
                <span className="text-xs text-gray-500">PNG, JPG maks 2MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMainImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/construction-products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="flex items-center gap-2 px-6 py-2 bg-[#FF751F] text-white rounded-lg hover:bg-[#E66A1B] disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {processing ? 'Menyimpan...' : mode === 'create' ? 'Simpan Produk' : 'Update Produk'}
          </button>
        </div>
      </form>
    </div>
  );
}
