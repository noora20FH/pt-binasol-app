<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin account
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@binasol.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create some employee accounts
        User::factory()->create([
            'name' => 'Karyawan Tetap',
            'email' => 'karyawan@binasol.com',
            'password' => Hash::make('password123'),
            'role' => 'karyawan_tetap',
        ]);

        User::factory()->create([
            'name' => 'Magang',
            'email' => 'magang@binasol.com',
            'password' => Hash::make('password123'),
            'role' => 'magang',
        ]);

        $this->command->info('Admin and employee accounts created successfully!');
        $this->command->info('Admin: admin@binasol.com / admin123');
        $this->command->info('Karyawan: karyawan@binasol.com / password123');
        $this->command->info('Magang: magang@binasol.com / password123');
    }
}
