import React, { useState } from 'react';
import { Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function DataTable({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  onCreate,
  createLabel = 'Tambah Data',
  searchPlaceholder = 'Cari...',
  emptyMessage = 'Tidak ada data',
  showActions = true,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((row) => {
    const searchStr = searchQuery.toLowerCase();
    return Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(searchStr));
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getValue = (row, key) => row?.[key];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF751F] focus:border-transparent"
          />
        </div>

        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF751F] text-white rounded-lg hover:bg-[#E66A1B] transition-colors"
          >
            <Plus className="w-4 h-4" />
            {createLabel}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => {
                    const value = getValue(row, column.key);
                    return (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(value, row) : value ?? '-'}
                      </td>
                    );
                  })}
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onView && <button onClick={() => onView(row)} className="text-gray-600 hover:text-[#FF751F] p-1"><Eye className="w-4 h-4" /></button>}
                        {onEdit && <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-800 p-1"><Edit className="w-4 h-4" /></button>}
                        {onDelete && (
                          <button
                            onClick={() => { if (confirm('Yakin hapus data ini?')) onDelete(row); }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm">
          <div className="text-gray-500">
            Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2">Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status, type = 'default' }) {
  const styles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type] || styles.default}`}>{status}</span>;
}
