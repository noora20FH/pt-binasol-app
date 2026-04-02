import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, StatusBadge } from '@/Components/admin/DataTable';
import { Order } from '@/types/inertia';
import { Package, DollarSign, Calendar } from 'lucide-react';

// Mock data for demonstration
const mockOrders = [
  {
    id: 1,
    user_id: 2,
    order_number: 'ORD-20260313-001',
    total_amount: 299000,
    status: 'pending',
    payment_method: 'WA',
    payment_status: 'unpaid',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '08123456789',
    shipping_address: 'Jl. Contoh No. 123',
    shipping_city: 'Jakarta',
    shipping_postal_code: '12345',
    notes: null,
    created_at: '2026-03-13T10:30:00Z',
    updated_at: '2026-03-13T10:30:00Z',
  },
  {
    id: 2,
    user_id: 2,
    order_number: 'ORD-20260312-002',
    total_amount: 450000,
    status: 'processing',
    payment_method: 'Midtrans',
    payment_status: 'paid',
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    customer_phone: '08198765432',
    shipping_address: 'Jl. Sudirman No. 456',
    shipping_city: 'Bandung',
    shipping_postal_code: '40111',
    notes: 'Please deliver in the morning',
    created_at: '2026-03-12T14:20:00Z',
    updated_at: '2026-03-13T09:15:00Z',
  },
  {
    id: 3,
    user_id: null,
    order_number: 'ORD-20260311-003',
    total_amount: 150000,
    status: 'delivered',
    payment_method: 'WA',
    payment_status: 'paid',
    customer_name: 'Ahmad Rizki',
    customer_email: 'ahmad@example.com',
    customer_phone: '08156789012',
    shipping_address: 'Jl. Merdeka No. 789',
    shipping_city: 'Surabaya',
    shipping_postal_code: '60111',
    notes: null,
    created_at: '2026-03-11T08:45:00Z',
    updated_at: '2026-03-13T16:30:00Z',
  },
];

export function OrderManagement() {
  const handleViewOrder = (order: Order) => {
    alert(`Viewing order details for ${order.order_number}`);
  };

  const getStatusType = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'processing':
      case 'shipped':
        return 'info';
      case 'paid':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPaymentStatusType = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'failed':
      case 'refunded':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout title="Order Management">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockOrders.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(mockOrders.reduce((sum, order) => sum + order.total_amount, 0))}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockOrders.filter((o) => o.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        data={mockOrders}
        columns={[
          {
            key: 'order_number',
            label: 'Order Number',
            render: (value) => <span className="font-mono font-medium">{value}</span>,
          },
          {
            key: 'customer_name',
            label: 'Customer',
            render: (value, row) => (
              <div>
                <div className="font-medium text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{row.customer_email}</div>
              </div>
            ),
          },
          {
            key: 'total_amount',
            label: 'Total',
            render: (value) => (
              <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
            ),
          },
          {
            key: 'status',
            label: 'Order Status',
            render: (value) => (
              <StatusBadge status={value.toUpperCase()} type={getStatusType(value)} />
            ),
          },
          {
            key: 'payment_status',
            label: 'Payment',
            render: (value) => (
              <StatusBadge status={value.toUpperCase()} type={getPaymentStatusType(value)} />
            ),
          },
          {
            key: 'payment_method',
            label: 'Method',
            render: (value) => value || '-',
          },
          {
            key: 'created_at',
            label: 'Date',
            render: (value) => <span className="text-sm">{formatDate(value)}</span>,
          },
        ]}
        onView={handleViewOrder}
        viewHref={(order) => `/admin/orders/${order.id}`}
        searchPlaceholder="Search orders by number, customer name, or email..."
        emptyMessage="No orders found."
      />
    </AdminLayout>
  );
}
