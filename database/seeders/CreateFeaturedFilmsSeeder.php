<?php

namespace Database\Seeders;

use App\Models\Film;
use Illuminate\Database\Seeder;

class CreateFeaturedFilmsSeeder extends Seeder
{
    /**
     * Seed data film featured ke database
     * 
     * Cara menggunakan:
     * 1. Letakkan file gambar di folder: public/Asset/FILM/
     * 2. Jalankan: php artisan db:seed --class=CreateFeaturedFilmsSeeder
     * 3. Film akan muncul di home page dan /films page dengan thumbnail otomatis
     */
    public function run(): void
    {
        // Scan folder public/Asset/FILM untuk mendapatkan semua file image
        $filmDir = public_path('Asset/FILM');
        
        if (!is_dir($filmDir)) {
            echo "❌ Folder public/Asset/FILM tidak ditemukan!\n";
            return;
        }

        $files = glob($filmDir . '/*.*');
        $createdCount = 0;
        
        foreach ($files as $file) {
            if (is_file($file)) {
                $filename = pathinfo($file, PATHINFO_FILENAME);
                $extension = pathinfo($file, PATHINFO_EXTENSION);
                
                // Skip non-image files
                if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    continue;
                }
                
                $posterPath = '/Asset/FILM/' . basename($file);
                
                // Create or update film
                $film = Film::updateOrCreate(
                    ['title' => $filename],
                    [
                        'title' => $filename,
                        'poster' => $posterPath,
                        'banner' => $posterPath,
                        'is_featured' => true,
                        'rating' => 7.5,
                        'year' => date('Y'),
                        'genres' => 'Film, Entertainment',
                        'description' => ucfirst($filename) . ' - Film menarik dari PT Bina Auto Solusi',
                    ]
                );
                
                echo "✓ Film: {$filename}\n";
                $createdCount++;
            }
        }

        // Scan folder public/Asset/SERIES untuk mendapatkan file series
        $seriesDir = public_path('Asset/SERIES');
        
        if (is_dir($seriesDir)) {
            $seriesFiles = glob($seriesDir . '/*.*');
            
            foreach ($seriesFiles as $file) {
                if (is_file($file)) {
                    $filename = pathinfo($file, PATHINFO_FILENAME);
                    $extension = pathinfo($file, PATHINFO_EXTENSION);
                    
                    if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        continue;
                    }
                    
                    $posterPath = '/Asset/SERIES/' . basename($file);
                    
                    Film::updateOrCreate(
                        ['title' => $filename],
                        [
                            'title' => $filename,
                            'poster' => $posterPath,
                            'banner' => $posterPath,
                            'is_featured' => false,
                            'rating' => 7.0,
                            'year' => date('Y'),
                            'genres' => 'Series, Entertainment',
                            'description' => ucfirst($filename) . ' - Series menarik dari PT Bina Auto Solusi',
                        ]
                    );
                    
                    echo "✓ Series: {$filename}\n";
                    $createdCount++;
                }
            }
        }

        echo "\n✅ Selesai! {$createdCount} film/series berhasil dibuat/diupdate.\n";
        echo "📺 Buka halaman home atau /films untuk melihat film & series yang baru\n";
    }
}
