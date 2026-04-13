import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/cms/DataTable';
import { ProductForm } from '@/Components/cms/ProductForm';
import { router } from '@inertiajs/react';   // ← TAMBAHKAN INI

export default function ProductManagement({
    type = 'retail',
    categories = [],
    products = []
}) {
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(undefined);

  // Tidak perlu mock lagi, pakai data dari Laravel
  const filteredCategories = categories;
  const filteredProducts = products;

  const handleCreate = () => {
    setSelectedProduct(undefined);
    setView('create');
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  const handleDelete = (product) => {
    if (confirm(`Yakin hapus produk "${product.name}"?`)) {
      router.delete(route('admin.products.destroy', product.id));
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedProduct(undefined);
  };

  const handleSave = (productData) => {
    if (view === 'create') {
      router.post(route('admin.products.store'), { ...productData, type });
    } else if (view === 'edit' && selectedProduct) {
      router.put(route('admin.products.update', selectedProduct.id), { ...productData, type });
    }
    setView('list');
  };

  const title = type === 'retail' ? 'Produk Retail' : 'Produk Konstruksi';

  // Wrap dengan AdminLayout agar sidebar, header, dan active tab berfungsi
  const pageContent = (
    <div>
      {view === 'create' || view === 'edit' ? (
        <ProductForm
          product={selectedProduct}
          categories={categories}
          mode={view}
          type={type}
          onBack={handleBack}
          onSave={handleSave}
        />
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen {title}</h2>
            <p className="text-gray-600">Kelola data produk, spesifikasi, gambar, dan testimoni</p>
          </div>

          <DataTable
            data={products}
            columns={[
              { key: 'id', label: 'ID', render: (value) => <span className="font-medium">#{value}</span> },
              {
                key: 'images',
                label: 'Gambar',
                render: (value) =>
                  value && value.length > 0 ? (
                    <img
                      src={value.find((img) => img.is_primary)?.image_path}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  ),
              },
              {
                key: 'category_id',
                label: 'Kategori',
                render: (value) => {
                  const category = categories.find((c) => c.id === value);
                  return <span className="text-sm">{category?.name || '-'}</span>;
                },
              },
              { key: 'name', label: 'Nama Produk', render: (value) => <span className="font-medium">{value}</span> },
              { key: 'slug', label: 'Slug', render: (value) => <span className="text-xs text-gray-500 font-mono">{value}</span> },
              {
                key: 'description',
                label: 'Deskripsi',
                render: (value) => (
                  <span className="text-sm text-gray-600 max-w-xs truncate block">{value || '-'}</span>
                ),
              },
              {
                key: 'price',
                label: 'Harga',
                render: (value) => (
                  <span className="font-medium text-green-600">Rp {value?.toLocaleString('id-ID')}</span>
                ),
              },
              {
                key: 'original_price',
                label: 'Harga Asli',
                render: (value) =>
                  value ? (
                    <span className="text-gray-500 line-through text-sm">Rp {value.toLocaleString('id-ID')}</span>
                  ) : (
                    '-'
                  ),
              },
              {
                key: 'badge',
                label: 'Badge',
                render: (value) => (value ? <StatusBadge status={value} type="info" /> : '-'),
              },
              {
                key: 'stock',
                label: 'Stok',
                render: (value) => (
                  <span
                    className={
                      value > 10
                        ? 'text-green-600 font-medium'
                        : value > 0
                        ? 'text-yellow-600 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {value}
                  </span>
                ),
              },
              {
                key: 'created_at',
                label: 'Dibuat',
                render: (value) => (
                  <span className="text-xs text-gray-500">
                    {new Date(value).toLocaleDateString('id-ID')}
                  </span>
                ),
              },
              {
                key: 'updated_at',
                label: 'Diperbarui',
                render: (value) => (
                  <span className="text-xs text-gray-500">
                    {new Date(value).toLocaleDateString('id-ID')}
                  </span>
                ),
              },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            createLabel={`Tambah ${title}`}
            searchPlaceholder="Cari produk..."
            emptyMessage={`Belum ada ${title.toLowerCase()}. Tambahkan produk pertama Anda!`}
          />
        </>
      )}
    </div>
  );

  return (
    <AdminLayout
      title={`Manajemen ${title}`}
      activeTab={type === 'retail' ? 'retail' : 'konstruksi'}
    >
      {pageContent}
    </AdminLayout>
  );
}
