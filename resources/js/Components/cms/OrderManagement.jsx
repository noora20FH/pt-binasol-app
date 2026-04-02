import React, { useState } from 'react';
import { DataTable, StatusBadge } from './DataTable';
import { Order } from '../../types/cms';
import { CreditCard, Eye, X } from 'lucide-react';

// Mock data
const mockOrders: Order[] = [
  {
    id: 1,
    order_number: 'ORD-2026-001',
    user_id: null,
    total_amount: 15500000,
    payment_status: 'settlement',
    payment_type: 'bank_transfer',
    snap_token: 'snap_token_abc123',
    customer_name: 'PT Maju Jaya',
    customer_email: 'maju@example.com',
    customer_address: 'Jl. Sudirman No. 123, Jakarta',
    deleted_at: null,
    created_at: '2026-03-10T10:30:00Z',
    updated_at: '2026-03-10T10:30:00Z',
    items: [
      {
        id: 1,
        order_id: 1,
        product_id: 2,
        quantity: 200,
        price: 65000,
      },
      {
        id: 2,
        order_id: 1,
        product_id: 1,
        quantity: 10,
        price: 250000,
      },
    ],
  },
  {
    id: 2,
    order_number: 'ORD-2026-002',
    user_id: null,
    total_amount: 8750000,
    payment_status: 'pending',
    payment_type: 'credit_card',
    snap_token: 'snap_token_def456',
    customer_name: 'CV Sejahtera',
    customer_email: 'sejahtera@example.com',
    customer_address: 'Jl. Thamrin No. 45, Jakarta',
    deleted_at: null,
    created_at: '2026-03-11T14:20:00Z',
    updated_at: '2026-03-11T14:20:00Z',
    items: [
      {
        id: 3,
        order_id: 2,
        product_id: 1,
        quantity: 35,
        price: 250000,
      },
    ],
  },
  {
    id: 3,
    order_number: 'ORD-2026-003',
    user_id: null,
    total_amount: 12300000,
    payment_status: 'settlement',
    payment_type: 'gopay',
    snap_token: 'snap_token_ghi789',
    customer_name: 'UD Berkah',
    customer_email: 'berkah@example.com',
    customer_address: 'Jl. Gatot Subroto No. 78, Jakarta',
    deleted_at: null,
    created_at: '2026-03-12T09:15:00Z',
    updated_at: '2026-03-12T09:15:00Z',
    items: [
      {
        id: 4,
        order_id: 3,
        product_id: 2,
        quantity: 150,
        price: 65000,
      },
      {
        id: 5,
        order_id: 3,
        product_id: 1,
        quantity: 5,
        price: 250000,
      },
    ],
  },
];

export function OrderManagement() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleDelete = (order: Order) => {
    console.log('Delete order:', order.id);
  };

  const getPaymentStatusBadge = (status: string) => {
    const map: Record<string, { type: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
      settlement: { type: 'success', label: 'Lunas' },
      pending: { type: 'warning', label: 'Pending' },
      expire: { type: 'default', label: 'Kedaluwarsa' },
      cancel: { type: 'danger', label: 'Dibatalkan' },
    };
    const info = map[status] || { type: 'default', label: status };
    return <StatusBadge status={info.label} type={info.type} />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Pesanan</h2>
        <p className="text-gray-600">Kelola dan monitor pesanan dari pelanggan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Lunas</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.payment_status === 'settlement').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.payment_status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Nilai</p>
          <p className="text-xl font-bold text-gray-800">
            Rp {orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <DataTable
        data={orders}
        columns={[
          {
            key: 'order_number',
            label: 'No. Order',
            render: (value) => <span className="font-medium text-blue-600">{value}</span>,
          },
          {
            key: 'customer_name',
            label: 'Customer',
            render: (value) => <span className="font-medium">{value}</span>,
          },
          {
            key: 'customer_email',
            label: 'Email',
          },
          {
            key: 'total_amount',
            label: 'Total',
            render: (value) => (
              <span className="font-medium text-green-600">
                Rp {value.toLocaleString('id-ID')}
              </span>
            ),
          },
          {
            key: 'payment_status',
            label: 'Status Pembayaran',
            render: (value) => getPaymentStatusBadge(value),
          },
          {
            key: 'payment_type',
            label: 'Metode',
            render: (value) => (
              <span className="text-sm text-gray-600 capitalize">
                {value?.replace('_', ' ') || '-'}
              </span>
            ),
          },
          {
            key: 'created_at',
            label: 'Tanggal',
            render: (value) => new Date(value).toLocaleDateString('id-ID'),
          },
        ]}
        onView={handleView}
        onDelete={handleDelete}
        searchPlaceholder="Cari pesanan..."
        emptyMessage="Belum ada pesanan."
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Detail Pesanan</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Pesanan</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nomor Order</p>
                    <p className="font-medium">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status Pembayaran</p>
                    <div className="mt-1">{getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                  </div>
                  <div>
                    <p className="text-gray-600">Metode Pembayaran</p>
                    <p className="font-medium capitalize">
                      {selectedOrder.payment_type?.replace('_', ' ') || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Informasi Customer</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Nama</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Alamat</p>
                    <p className="font-medium">{selectedOrder.customer_address}</p>
                  </div>
                </div>
              </div>

              {/* Midtrans Info */}
              {selectedOrder.snap_token && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#FF751F]" />
                    Midtrans Payment
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Snap Token</p>
                    <p className="font-mono text-sm font-medium break-all">{selectedOrder.snap_token}</p>
                    <button className="mt-3 px-4 py-2 bg-[#FF751F] text-white text-sm rounded-lg hover:bg-[#E66A1B] transition-colors">
                      Lihat di Midtrans Dashboard
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-green-600">
                    Rp {selectedOrder.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
