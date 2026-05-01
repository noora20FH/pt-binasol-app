<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed all data in correct order
        $this->call([
            AdminSeeder::class,
            CarouselSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
        ]);

        $this->command->info('========================================');
        $this->command->info('Database seeding completed successfully!');
        $this->command->info('========================================');
        $this->command->info('');
        $this->command->info('Admin Login: admin@binasol.com / admin123');
        $this->command->info('Customer: Register new account or use existing');
        $this->command->info('');
    }
}
