import { useState } from 'react';
import { Plus, Trash2, Upload, X, Save, ArrowLeft } from 'lucide-react';
import { useForm, Link } from '../../hooks/useInertiaForm.tsx';
import { ConstructionCategory } from '../../types/inertia';

interface ConstructionProductImage {
  id?: number;
  product_id?: number;
  image: File | string | null;
  sort_order: number;
  _destroy?: boolean;
}

interface ConstructionProductFormData {
  category_id: number | string;
  name: string;
  specifications: string;
  price: number | string;
  image: File | string | null;
  stock: number | string;
  construction_product_images: ConstructionProductImage[];
}

interface ConstructionProductFormProps {
  product?: any;
  categories: ConstructionCategory[];
  mode: 'create' | 'edit';
}

export function ConstructionProductForm({ product, categories, mode }: ConstructionProductFormProps) {
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    typeof product?.image === 'string' ? product.image : null
  );

  const form = useForm<ConstructionProductFormData>({
    category_id: product?.category_id || '',
    name: product?.name || '',
    specifications: product?.specifications || '',
    price: product?.price || '',
    image: null,
    stock: product?.stock || '',
    construction_product_images: product?.images || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    form.transform((data) => {
      const formData = new FormData();

      // Basic fields
      formData.append('category_id', String(data.category_id));
      formData.append('name', data.name);
      formData.append('specifications', data.specifications);
      formData.append('price', String(data.price));
      formData.append('stock', String(data.stock));

      // Main image
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      // Product images (gallery)
      data.construction_product_images.forEach((img, index) => {
        if (img.id) {
          formData.append(`construction_product_images[${index}][id]`, String(img.id));
        }
        formData.append(`construction_product_images[${index}][sort_order]`, String(img.sort_order));

        if (img.image instanceof File) {
          formData.append(`construction_product_images[${index}][image]`, img.image);
        } else if (typeof img.image === 'string') {
          formData.append(`construction_product_images[${index}][image]`, img.image);
        }

        if (img._destroy) {
          formData.append(`construction_product_images[${index}][_destroy]`, '1');
        }
      });

      return formData;
    });

    const url = mode === 'create'
      ? '/admin/construction-products'
      : `/admin/construction-products/${product?.id}`;

    form.post(url, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        alert(`Product ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      },
    });
  };

  const handleMainImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setData('image', file);
    } else {
      setMainImagePreview(null);
      form.setData('image', null);
    }
  };

  // Image gallery management
  const addProductImage = () => {
    form.setData('construction_product_images', [
      ...form.data.construction_product_images,
      { image: null, sort_order: form.data.construction_product_images.length },
    ]);
  };

  const removeProductImage = (index: number) => {
    const updated = [...form.data.construction_product_images];
    if (updated[index].id) {
      updated[index]._destroy = true;
    } else {
      updated.splice(index, 1);
    }
    form.setData('construction_product_images', updated);
  };

  const updateProductImage = (index: number, file: File | null) => {
    const updated = [...form.data.construction_product_images];
    updated[index].image = file;
    form.setData('construction_product_images', updated);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/construction-products" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Construction Product' : 'Edit Construction Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={form.data.category_id}
                onChange={(e) => form.setData('category_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {form.errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{form.errors.category_id}</p>
              )}
            </div>

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                placeholder="e.g., Shear Connector Type A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {form.errors.name && (
                <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
              )}
            </div>

            {/* Specifications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              <textarea
                value={form.data.specifications}
                onChange={(e) => form.setData('specifications', e.target.value)}
                rows={4}
                placeholder="e.g., 19-22mm, ASTM A108, ISO certified"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.specifications && (
                <p className="mt-1 text-sm text-red-600">{form.errors.specifications}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (IDR)
              </label>
              <input
                type="number"
                min="0"
                value={form.data.price}
                onChange={(e) => form.setData('price', e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.price && (
                <p className="mt-1 text-sm text-red-600">{form.errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={form.data.stock}
                onChange={(e) => form.setData('stock', e.target.value)}
                placeholder="200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {form.errors.stock && (
                <p className="mt-1 text-sm text-red-600">{form.errors.stock}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Product Image</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {mainImagePreview ? (
              <div className="relative">
                <img
                  src={mainImagePreview}
                  alt="Product preview"
                  className="w-full max-w-md mx-auto h-64 object-cover rounded"
                />
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
                <span className="text-sm text-gray-600 mb-1">Click to upload main product image</span>
                <span className="text-xs text-gray-500">PNG, JPG up to 2MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMainImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {form.errors.image && (
            <p className="mt-2 text-sm text-red-600">{form.errors.image}</p>
          )}
        </div>

        {/* Product Gallery */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Images (Gallery)</h3>
            <button
              type="button"
              onClick={addProductImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Image
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {form.data.construction_product_images.map((img, index) => {
              if (img._destroy) return null;

              return (
                <div key={index} className="relative border border-gray-300 rounded-lg p-3">
                  <button
                    type="button"
                    onClick={() => removeProductImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">Image #{index + 1}</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateProductImage(index, e.target.files?.[0] || null)}
                      className="w-full text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {form.data.construction_product_images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No additional images yet. Click "Add Image" to start.
            </div>
          )}
          {form.errors.construction_product_images && (
            <p className="mt-2 text-sm text-red-600">{form.errors.construction_product_images}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/construction-products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={form.processing}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {form.processing
              ? 'Saving...'
              : mode === 'create'
                ? 'Create Product'
                : 'Update Product'
            }
          </button>
        </div>
      </form>
    </div>
  );
}
