import { useState } from 'react';
import { Plus, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { useForm, Link } from '@/hooks/useInertiaForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { RetailCategory } from '@/types/inertia';

interface RetailProductImage {
  id?: number;
  product_id?: number;
  image: File | string | null;
  sort_order: number;
  _destroy?: boolean;
}

interface RetailTestimonial {
  id?: number;
  product_id?: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  image: File | string | null;
  sort_order: number;
  _destroy?: boolean;
}

interface RetailProductFormData {
  category_id: number | string;
  name: string;
  description: string;
  price: number | string;
  originalPrice: number | string;
  image: File | string | null;
  badge: string;
  stock: number | string;
  retail_product_images: RetailProductImage[];
  retail_testimonials: RetailTestimonial[];
}

// Mock categories
const mockCategories: RetailCategory[] = [
  { id: 1, name: 'Fragrance', icon: '🌸', description: 'Luxury fragrances and essential oils' },
  { id: 2, name: 'Alat Medis', icon: '🏥', description: 'Medical equipment and supplies' },
  { id: 3, name: 'Alat Kebugaran', icon: '💪', description: 'Fitness equipment and accessories' },
  { id: 4, name: 'Consumer Goods', icon: '🛍️', description: 'Everyday consumer products' },
];

export function RetailProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<RetailProductFormData>({
    category_id: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: null,
    badge: '',
    stock: '',
    retail_product_images: [],
    retail_testimonials: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    form.transform((data) => {
      const formData = new FormData();

      // Basic fields
      formData.append('category_id', String(data.category_id));
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', String(data.price));
      formData.append('originalPrice', String(data.originalPrice));
      formData.append('badge', data.badge);
      formData.append('stock', String(data.stock));

      // Main image
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      // Product images (gallery)
      data.retail_product_images.forEach((img, index) => {
        if (img.id) {
          formData.append(`retail_product_images[${index}][id]`, String(img.id));
        }
        formData.append(`retail_product_images[${index}][sort_order]`, String(img.sort_order));

        if (img.image instanceof File) {
          formData.append(`retail_product_images[${index}][image]`, img.image);
        } else if (typeof img.image === 'string') {
          formData.append(`retail_product_images[${index}][image]`, img.image);
        }

        if (img._destroy) {
          formData.append(`retail_product_images[${index}][_destroy]`, '1');
        }
      });

      // Testimonials
      data.retail_testimonials.forEach((testimonial, index) => {
        if (testimonial.id) {
          formData.append(`retail_testimonials[${index}][id]`, String(testimonial.id));
        }
        formData.append(`retail_testimonials[${index}][name]`, testimonial.name);
        formData.append(`retail_testimonials[${index}][rating]`, String(testimonial.rating));
        formData.append(`retail_testimonials[${index}][comment]`, testimonial.comment);
        formData.append(`retail_testimonials[${index}][date]`, testimonial.date);
        formData.append(`retail_testimonials[${index}][sort_order]`, String(testimonial.sort_order));

        if (testimonial.image instanceof File) {
          formData.append(`retail_testimonials[${index}][image]`, testimonial.image);
        } else if (typeof testimonial.image === 'string') {
          formData.append(`retail_testimonials[${index}][image]`, testimonial.image);
        }

        if (testimonial._destroy) {
          formData.append(`retail_testimonials[${index}][_destroy]`, '1');
        }
      });

      return formData;
    });

    form.post('/admin/retail-products', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        alert('Product created successfully!');
      },
    });
  };

  // Image gallery management
  const addProductImage = () => {
    form.setData('retail_product_images', [
      ...form.data.retail_product_images,
      { image: null, sort_order: form.data.retail_product_images.length },
    ]);
  };

  const removeProductImage = (index: number) => {
    const updated = [...form.data.retail_product_images];
    if (updated[index].id) {
      updated[index]._destroy = true;
    } else {
      updated.splice(index, 1);
    }
    form.setData('retail_product_images', updated);
  };

  const updateProductImage = (index: number, file: File | null) => {
    const updated = [...form.data.retail_product_images];
    updated[index].image = file;
    form.setData('retail_product_images', updated);
  };

  // Testimonial management
  const addTestimonial = () => {
    form.setData('retail_testimonials', [
      ...form.data.retail_testimonials,
      {
        name: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
        sort_order: form.data.retail_testimonials.length,
      },
    ]);
  };

  const removeTestimonial = (index: number) => {
    const updated = [...form.data.retail_testimonials];
    if (updated[index].id) {
      updated[index]._destroy = true;
    } else {
      updated.splice(index, 1);
    }
    form.setData('retail_testimonials', updated);
  };

  const updateTestimonial = (index: number, field: keyof RetailTestimonial, value: any) => {
    const updated = [...form.data.retail_testimonials];
    updated[index] = { ...updated[index], [field]: value };
    form.setData('retail_testimonials', updated);
  };

  return (
    <AdminLayout title="Create Retail Product">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/retail-products" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Create New Retail Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {mockCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={form.data.description}
                  onChange={(e) => form.setData('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (IDR) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.data.price}
                  onChange={(e) => form.setData('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.data.originalPrice}
                  onChange={(e) => form.setData('originalPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={form.data.stock}
                  onChange={(e) => form.setData('stock', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge (e.g., -25%, NEW)
                </label>
                <input
                  type="text"
                  value={form.data.badge}
                  onChange={(e) => form.setData('badge', e.target.value)}
                  placeholder="-25%"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Images Gallery */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Gallery</h3>
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
              {form.data.retail_product_images.map((img, index) => {
                if (img._destroy) return null;

                return (
                  <div key={index} className="relative border border-gray-300 rounded-lg p-2">
                    <button
                      type="button"
                      onClick={() => removeProductImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateProductImage(index, e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Testimonials</h3>
              <button
                type="button"
                onClick={addTestimonial}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Testimonial
              </button>
            </div>
            <div className="space-y-4">
              {form.data.retail_testimonials.map((testimonial, index) => {
                if (testimonial._destroy) return null;

                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Testimonial #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating (1-5) *
                        </label>
                        <select
                          value={testimonial.rating}
                          onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {'⭐'.repeat(r)} ({r})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comment *
                        </label>
                        <textarea
                          value={testimonial.comment}
                          onChange={(e) => updateTestimonial(index, 'comment', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={testimonial.date}
                          onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/retail-products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={form.processing}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {form.processing ? 'Saving...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
