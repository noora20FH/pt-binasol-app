// resources/js/Pages/Admin/RoomManagement.jsx
import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { DataTable, StatusBadge } from "@/Components/cms/DataTable";
import { router } from "@inertiajs/react";
import { X, Edit, Eye } from "lucide-react";

import RoomForm from "./RoomForm";   // ← akan kita buat di langkah berikutnya

export default function RoomManagement({ rooms: initialRooms = [] }) {
    const [view, setView] = useState("list");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [viewingRoom, setViewingRoom] = useState(null);
    const [rooms, setRooms] = useState(initialRooms);

    // Handle Create
    const handleCreate = () => {
        setSelectedRoom(null);
        setView("create");
    };

    // Handle Edit
    const handleEdit = (room) => {
        setSelectedRoom(room);
        setView("edit");
    };

    // Handle View Detail
    const handleView = (room) => {
        setViewingRoom(room);
        setShowDetailModal(true);
    };

    // Handle Delete (Soft Delete)
    const handleDelete = (room) => {
        if (confirm(`Yakin ingin menghapus ruangan "${room.name}"?`)) {
            router.delete(route("admin.rooms.destroy", room.id), {
                onSuccess: () => {
                    setRooms((prev) => prev.filter((r) => r.id !== room.id));
                },
            });
        }
    };

    const handleBack = () => {
        setView("list");
        setSelectedRoom(null);
    };

    // Modal Detail Ruangan
    const RoomDetailModal = () => {
        if (!viewingRoom) return null;

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
                        <h2 className="text-2xl font-semibold text-gray-900">{viewingRoom.name}</h2>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-auto flex-1 p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Foto Ruangan */}
                            <div className="lg:col-span-5">
                                {viewingRoom.image ? (
                                    <img
                                        src={viewingRoom.image}
                                        alt={viewingRoom.name}
                                        className="w-full rounded-2xl shadow-lg object-cover aspect-video"
                                    />
                                ) : (
                                    <div className="w-full aspect-video bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Informasi Utama */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex flex-wrap gap-3">
                                    {viewingRoom.type && (
                                        <span className="inline-flex px-4 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                                            {viewingRoom.type}
                                        </span>
                                    )}
                                    {viewingRoom.is_active ? (
                                        <StatusBadge status="Aktif" type="success" />
                                    ) : (
                                        <StatusBadge status="Nonaktif" type="default" />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Kapasitas</span>
                                        <p className="font-medium">{viewingRoom.capacity || "-"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Ukuran</span>
                                        <p className="font-medium">{viewingRoom.size || "-"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Satuan Harga</span>
                                        <p className="font-medium">{viewingRoom.price_unit || "-"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Urutan Tampilan</span>
                                        <p className="font-medium">{viewingRoom.order_priority}</p>
                                    </div>
                                </div>

                                {viewingRoom.description && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Deskripsi</h4>
                                        <p className="text-gray-600 leading-relaxed">{viewingRoom.description}</p>
                                    </div>
                                )}

                                {/* Fasilitas */}
                                {viewingRoom.facilities && viewingRoom.facilities.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">Fasilitas</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingRoom.facilities.map((fac, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {fac}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 border-t bg-gray-50 flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setShowDetailModal(false);
                                handleEdit(viewingRoom);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-[#E66A1B]"
                        >
                            <Edit className="w-5 h-5" />
                            Edit Ruangan
                        </button>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-2xl font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render Form Create / Edit
    if (view === "create" || view === "edit") {
        return (
            <AdminLayout
                title={view === "create" ? "Tambah Ruangan Baru" : "Edit Ruangan"}
                activeTab="sewa-ruangan"   // ← pastikan ada di menu AdminLayout
            >
                <RoomForm
                    room={selectedRoom}
                    onBack={handleBack}
                />
            </AdminLayout>
        );
    }

    // Render List + Modal
    const columns = [
        {
            key: "id",
            label: "ID",
            render: (v) => <span className="font-medium">#{v}</span>,
        },
        {
            key: "image",
            label: "FOTO",
            render: (v) =>
                v ? (
                    <img
                        src={v}
                        alt="Room"
                        className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                    />
                ) : (
                    <div className="w-20 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Image
                    </div>
                ),
        },
        {
            key: "name",
            label: "NAMA RUANGAN",
            render: (v) => <span className="font-medium">{v}</span>,
        },
        { key: "type", label: "TIPE", render: (v) => v || "-" },
        { key: "capacity", label: "KAPASITAS", render: (v) => v || "-" },
        { key: "size", label: "UKURAN", render: (v) => v || "-" },
        { key: "price_unit", label: "SATUAN HARGA", render: (v) => v || "-" },
        {
            key: "is_active",
            label: "STATUS",
            render: (v) => (
                <StatusBadge status={v ? "Aktif" : "Nonaktif"} type={v ? "success" : "default"} />
            ),
        },
        {
            key: "order_priority",
            label: "URUTAN",
            render: (v) => <span className="font-semibold">{v}</span>,
        },
    ];

    return (
        <AdminLayout
            title="Manajemen Sewa Ruangan"
            activeTab="sewa-ruangan"
        >
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Sewa Ruangan</h1>
                    <p className="text-gray-600 mt-1">Kelola data ruangan untuk disewakan</p>
                </div>

                <DataTable
                    data={rooms}
                    columns={columns}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    createLabel="Tambah Ruangan"
                    searchPlaceholder="Cari ruangan..."
                    emptyMessage="Belum ada ruangan. Tambahkan ruangan pertama Anda!"
                />
            </div>

            {/* Modal Detail */}
            {showDetailModal && <RoomDetailModal />}
        </AdminLayout>
    );
}
