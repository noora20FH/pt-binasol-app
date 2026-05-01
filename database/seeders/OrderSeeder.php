<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        
        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please seed products first.');
            return;
        }

        // Create a sample customer
        $customer = User::factory()->create([
            'name' => 'Demo Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password123'),
            'role' => 'customer',
        ]);

        // Create sample orders with different statuses
        $orders = [
            [
                'order_number' => 'ORD-2026-001',
                'user_id' => $customer->id,
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'customer_address' => 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
                'total_amount' => 15500000,
                'payment_status' => 'settlement',
                'payment_type' => 'bank_transfer',
                'snap_token' => 'snap_token_' . Str::random(10),
                'created_at' => '2026-03-10 10:30:00',
            ],
            [
                'order_number' => 'ORD-2026-002',
                'user_id' => $customer->id,
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'customer_address' => 'Jl. Thamrin No. 45, Jakarta Pusat, DKI Jakarta 10350',
                'total_amount' => 8750000,
                'payment_status' => 'pending',
                'payment_type' => 'credit_card',
                'snap_token' => 'snap_token_' . Str::random(10),
                'created_at' => '2026-03-11 14:20:00',
            ],
            [
                'order_number' => 'ORD-2026-003',
                'user_id' => $customer->id,
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'customer_address' => 'Jl. Gatot Subroto No. 78, Jakarta Selatan, DKI Jakarta 12930',
                'total_amount' => 12300000,
                'payment_status' => 'settlement',
                'payment_type' => 'gopay',
                'snap_token' => 'snap_token_' . Str::random(10),
                'created_at' => '2026-03-12 09:15:00',
            ],
            [
                'order_number' => 'ORD-2026-004',
                'user_id' => null,
                'customer_name' => 'PT Maju Jaya',
                'customer_email' => 'maju@example.com',
                'customer_address' => 'Jl. M.H. Thamrin Kav. 10, Jakarta Pusat',
                'total_amount' => 5200000,
                'payment_status' => 'cancel',
                'payment_type' => 'bank_transfer',
                'snap_token' => null,
                'created_at' => '2026-03-13 16:45:00',
            ],
            [
                'order_number' => 'ORD-2026-005',
                'user_id' => null,
                'customer_name' => 'CV Sejahtera',
                'customer_email' => 'sejahtera@example.com',
                'customer_address' => 'Jl. Sudirman Kav. 25, Jakarta Selatan',
                'total_amount' => 8900000,
                'payment_status' => 'expire',
                'payment_type' => 'e_wallet',
                'snap_token' => null,
                'created_at' => '2026-03-14 11:00:00',
            ],
        ];

        foreach ($orders as $orderData) {
            $items = $orderData['items'] ?? [];
            unset($orderData['items']);
            
            $order = Order::create($orderData);

            // Create order items
            if (empty($items)) {
                // Create random items
                $numItems = rand(1, 3);
                $selectedProducts = $products->random(min($numItems, $products->count()));
                
                foreach ($selectedProducts as $product) {
                    $quantity = rand(1, 5);
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $product->price,
                    ]);
                }
            }
        }

        // Create a few more guest orders
        for ($i = 6; $i <= 8; $i++) {
            $order = Order::create([
                'order_number' => 'ORD-2026-00' . $i,
                'user_id' => null,
                'customer_name' => 'Guest Customer ' . $i,
                'customer_email' => 'guest' . $i . '@example.com',
                'customer_address' => 'Jl. Example No. ' . $i . ', Jakarta',
                'total_amount' => rand(1000000, 15000000),
                'payment_status' => ['pending', 'settlement', 'expire'][rand(0, 2)],
                'payment_type' => ['bank_transfer', 'credit_card', 'gopay', 'e_wallet'][rand(0, 3)],
                'snap_token' => rand(0, 1) ? 'snap_token_' . Str::random(10) : null,
                'created_at' => now()->subDays(rand(1, 30)),
            ]);

            // Add items to order
            $numItems = rand(1, 3);
            $selectedProducts = $products->random(min($numItems, $products->count()));
            
            foreach ($selectedProducts as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 5),
                    'price' => $product->price,
                ]);
            }
        }

        $this->command->info('Orders seeded successfully!');
        $this->command->info('Demo customer: customer@example.com / password123');
    }
}
