<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Seeding Orders & Order Items...');

        // Ambil data existing (User & Product)
        $users = User::all();
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->warn('⚠️ Tidak ada data Product. Jalankan ProductSeeder terlebih dahulu atau buat data product dulu.');
            return;
        }

        $statuses = ['pending', 'settlement', 'expire', 'cancel'];
        $paymentTypes = ['credit_card', 'bank_transfer', 'e_wallet', 'qris', null];

        // Data customer realistis (Surabaya & Jawa Timur)
        $customers = [
            [
                'name'    => 'Ahmad Santoso',
                'email'   => 'ahmad.santoso@gmail.com',
                'address' => 'Jl. Raya Darmo No. 123, Surabaya, Jawa Timur 60241',
            ],
            [
                'name'    => 'Siti Nurhaliza',
                'email'   => 'siti.nurhaliza@yahoo.co.id',
                'address' => 'Perumahan CitraLand, Blok C7 No. 45, Surabaya',
            ],
            [
                'name'    => 'Budi Wijaya',
                'email'   => 'budi.wijaya@outlook.com',
                'address' => 'Jl. Ngagel Jaya Selatan No. 78, Surabaya',
            ],
            [
                'name'    => 'Dewi Sartika',
                'email'   => 'dewi.sartika@gmail.com',
                'address' => 'Jl. Wonokromo No. 56, Surabaya',
            ],
        ];

        $totalOrders = 25; // Bisa diubah sesuai kebutuhan

        for ($i = 1; $i <= $totalOrders; $i++) {
            $customer = $customers[array_rand($customers)];
            $status = $statuses[array_rand($statuses)];
            $paymentType = $paymentTypes[array_rand($paymentTypes)];

            // Pilih user secara random atau null (guest checkout)
            $user = $users->isNotEmpty() && rand(0, 1) ? $users->random() : null;

            $order = Order::create([
                'order_number'     => 'ORD-' . date('Ymd') . '-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'user_id'          => $user?->id,
                'total_amount'     => 0,                    // akan di-update setelah item dibuat
                'payment_status'   => $status,
                'payment_type'     => $paymentType,
                'snap_token'       => in_array($status, ['settlement']) ? 'snap-' . Str::random(32) : null,
                'customer_name'    => $customer['name'],
                'customer_email'   => $customer['email'],
                'customer_address' => $customer['address'],
            ]);

            // Buat 2–6 item per order
            $totalAmount = 0;
            $itemCount = rand(2, 6);

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $quantity = rand(1, 4);
                $price = $product->price ?? rand(75000, 1250000); // fallback jika model Product belum punya kolom price

                $subtotal = $quantity * $price;

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'quantity'   => $quantity,
                    'price'      => $price,
                ]);

                $totalAmount += $subtotal;
            }

            // Update total amount order
            $order->update(['total_amount' => $totalAmount]);
        }

        $this->command->info("✅ Berhasil membuat {$totalOrders} orders dengan total " . OrderItem::count() . " order items!");
    }
}
