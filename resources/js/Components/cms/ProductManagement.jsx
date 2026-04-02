import React, { useState } from 'react';
import { DataTable, StatusBadge } from './DataTable';
import { ProductForm } from './ProductForm';
import { Product, Category } from '../../types/cms';

interface ProductManagementProps {
  type: 'retail' | 'construction';
}

// Mock categories
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Pakaian Pria',
    slug: 'pakaian-pria',
    description: 'Koleksi pakaian pria',
    image: null,
    icon: null,
    type: 'retail',
    deleted_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Produk elektronik',
    image: null,
    icon: null,
    type: 'retail',
    deleted_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Semen',
    slug: 'semen',
    description: 'Material semen untuk konstruksi',
    image: null,
    icon: null,
    type: 'construction',
    deleted_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Besi Beton',
    slug: 'besi-beton',
    description: 'Besi untuk konstruksi',
    image: null,
    icon: null,
    type: 'construction',
    deleted_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

// Mock products
const mockProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'Kemeja Batik Premium',
    slug: 'kemeja-batik-premium',
    description: 'Kemeja batik berkualitas tinggi',
    price: 250000,
    original_price: 350000,
    badge: 'Best Seller',
    stock: 45,
    deleted_at: null,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
    images: [
      {
        id: 1,
        product_id: 1,
        image_path: 'https://images.unsplash.com/photo-1764560348129-61acc431162d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRpayUyMHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NzQ5NDc0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        is_primary: true,
      }
    ],
    specifications: [
      {
        id: 1,
        product_id: 1,
        property: 'Ukuran',
        value: 'M, L, XL',
      },
      {
        id: 2,
        product_id: 1,
        property: 'Bahan',
        value: 'Katun Premium',
      },
    ],
    testimonials: [
      {
        id: 1,
        product_id: 1,
        name: 'Budi Santoso',
        rating: 5,
        comment: 'Kualitas batik sangat bagus, nyaman dipakai!',
        image: null,
        deleted_at: null,
        created_at: '2026-01-16T00:00:00Z',
      }
    ],
  },
  {
    id: 2,
    category_id: 3,
    name: 'Semen Portland 50kg',
    slug: 'semen-portland-50kg',
    description: 'Semen berkualitas untuk konstruksi',
    price: 65000,
    original_price: null,
    badge: null,
    stock: 1000,
    deleted_at: null,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
    images: [
      {
        id: 2,
        product_id: 2,
        image_path: 'https://images.unsplash.com/photo-1762380368593-a0d4c49af47f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzc0OTQ3NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        is_primary: true,
      }
    ],
    specifications: [
      {
        id: 3,
        product_id: 2,
        property: 'Material',
        value: 'Portland Composite Cement',
      },
      {
        id: 4,
        product_id: 2,
        property: 'Grade',
        value: 'Type I',
      },
      {
        id: 5,
        product_id: 2,
        property: 'Berat',
        value: '50 kg',
      },
    ],
  },
];

export function ProductManagement({ type }: ProductManagementProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const categories = mockCategories.filter(c => c.type === type);
  const products = mockProducts.filter(p => {
    const category = mockCategories.find(c => c.id === p.category_id);
    return category?.type === type;
  });

  const handleCreate = () => {
    setSelectedProduct(undefined);
    setView('create');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  const handleDelete = (product: Product) => {
    console.log('Delete product:', product.id);
  };

  const handleBack = () => {
    setView('list');
    setSelectedProduct(undefined);
  };

  const handleSave = (productData: any) => {
    console.log('Save product:', productData);
    setView('list');
  };

  const title = type === 'retail' ? 'Produk Retail' : 'Produk Konstruksi';

  if (view === 'create' || view === 'edit') {
    return (
      <ProductForm
        product={selectedProduct}
        categories={categories}
        mode={view}
        type={type}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen {title}</h2>
        <p className="text-gray-600">Kelola data produk, spesifikasi, gambar, dan testimoni</p>
      </div>

      <DataTable
        data={products}
        columns={[
          {
            key: 'id',
            label: 'ID',
            render: (value) => <span className="font-medium">#{value}</span>
          },
          {
            key: 'images',
            label: 'Gambar',
            render: (value) => (
              value && value.length > 0 ? (
                <img
                  src={value.find((img: any) => img.is_primary).image_path}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )
            ),
          },
          {
            key: 'category_id',
            label: 'Kategori',
            render: (value) => {
              const category = categories.find(c => c.id === value);
              return <span className="text-sm">{category?.name || '-'}</span>;
            },
          },
          {
            key: 'name',
            label: 'Nama Produk',
            render: (value) => <span className="font-medium">{value}</span>,
          },
          {
            key: 'slug',
            label: 'Slug',
            render: (value) => <span className="text-xs text-gray-500 font-mono">{value}</span>,
          },
          {
            key: 'description',
            label: 'Deskripsi',
            render: (value) => (
              <span className="text-sm text-gray-600 max-w-xs truncate block">
                {value || '-'}
              </span>
            ),
          },
          {
            key: 'price',
            label: 'Harga',
            render: (value) => (
              <span className="font-medium text-green-600">
                Rp {value.toLocaleString('id-ID')}
              </span>
            ),
          },
          {
            key: 'original_price',
            label: 'Harga Asli',
            render: (value) => value ? (
              <span className="text-gray-500 line-through text-sm">
                Rp {value.toLocaleString('id-ID')}
              </span>
            ) : '-',
          },
          {
            key: 'badge',
            label: 'Badge',
            render: (value) => value ? (
              <StatusBadge status={value} type="info" />
            ) : '-',
          },
          {
            key: 'stock',
            label: 'Stok',
            render: (value) => (
              <span className={value > 10 ? 'text-green-600 font-medium' : value > 0 ? 'text-yellow-600 font-medium' : 'text-red-600 font-medium'}>
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
    </div>
  );
}
