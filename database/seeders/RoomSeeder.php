<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Ruang Rapat Executive',
                'type' => 'Meeting Room',
                'capacity' => 12,
                'size' => '30m²',
                'price_unit' => 'Jam',
                'image' => '/Ruangan/Hasil Editing Dede/1920 X 1080/3.png',
                'description' => 'Ruang rapat formal dengan desain minimalis dan kedap suara, cocok untuk presentasi bisnis, brainstorming tim, atau pertemuan klien penting.',
                'facilities' => ['High Speed WiFi', 'Projector 4K', 'Whiteboard', 'Sound System', 'Free Coffee & Water', 'AC'],
                'is_active' => true,
                'order_priority' => 1,
            ],
            [
                'name' => 'Creative Coworking Space',
                'type' => 'Workspace',
                'capacity' => 25,
                'size' => '65m²',
                'price_unit' => 'Hari',
                'image' => '/Ruangan/Hasil Editing Dede/1920 X 1080/10.png',
                'description' => 'Area kerja bersama yang santai namun produktif. Dilengkapi dengan kursi ergonomis dan pencahayaan alami yang melimpah untuk kenyamanan bekerja seharian.',
                'facilities' => ['Dedicated Desk', 'Lounge Area', 'High Speed WiFi', 'Power Outlets', 'Printer Access', 'AC'],
                'is_active' => true,
                'order_priority' => 2,
            ],
            [
                'name' => 'Studio Editing',
                'type' => 'Studio',
                'capacity' => 100,
                'size' => '150m²',
                'price_unit' => 'Hari',
                'image' => '/Ruangan/Hasil Editing Dede/1920 X 1080/11.png',
                'description' => 'Ruangan luas dengan panggung dan pengaturan kursi teater. Sangat ideal untuk seminar berskala besar, workshop, atau acara peluncuran produk.',
                'facilities' => ['Stage & Podium', 'Professional Sound System', 'Wireless Mic', 'LED Screen', 'Backstage Room', 'VIP Seating Area'],
                'is_active' => true,
                'order_priority' => 3,
            ],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate(
                ['name' => $room['name']], // Unik berdasarkan nama
                $room
            );
        }

        echo "✅ RoomSeeder berhasil dijalankan!\n";
    }
}
