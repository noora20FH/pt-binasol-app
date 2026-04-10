<?php

namespace Database\Seeders;

use App\Models\Film;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FixFilmThumbnailPathSeeder extends Seeder
{
    /**
     * Fix film paths - rename files tanpa spasi
     */
    public function run(): void
    {
        // Mapping old path => new path (tanpa spasi)
        $pathMappings = [
            '/Asset/FILM/ANAK KOLONG.jpg' => '/Asset/FILM/anak-kolong.jpg',
            '/Asset/FILM/KORBAN JATUH TEMPO (PINJOL).jpg' => '/Asset/FILM/korban-jatuh-tempo-pinjol.jpg',
            '/Asset/FILM/KARUNRUNG.png' => '/Asset/FILM/karunrung.png',
            '/Asset/FILM/TWIST STETHOSCOPE.png' => '/Asset/FILM/twist-stethoscope.png',
        ];

        // Update database paths
        foreach ($pathMappings as $oldPath => $newPath) {
            Film::where('poster', $oldPath)->update(['poster' => $newPath, 'banner' => $newPath]);
        }

        // Rename actual files di public folder
        $publicPath = public_path();
        
        foreach ($pathMappings as $oldPath => $newPath) {
            $oldFile = $publicPath . $oldPath;
            $newFile = $publicPath . $newPath;
            
            if (file_exists($oldFile) && !file_exists($newFile)) {
                rename($oldFile, $newFile);
                echo "✓ Renamed: $oldPath -> $newPath\n";
            }
        }

        // Also check SERIES folder
        $seriesDir = public_path('Asset/SERIES');
        if (is_dir($seriesDir)) {
            $files = glob($seriesDir . '/*.*');
            foreach ($files as $file) {
                if (is_file($file)) {
                    $filename = pathinfo($file, PATHINFO_FILENAME);
                    $extension = pathinfo($file, PATHINFO_EXTENSION);
                    
                    // Only process if has space
                    if (strpos($filename, ' ') !== false) {
                        $newFilename = Str::slug($filename, '-') . '.' . $extension;
                        $newFile = dirname($file) . '/' . $newFilename;
                        
                        if (!file_exists($newFile)) {
                            rename($file, $newFile);
                            
                            // Update database
                            $oldPath = '/Asset/SERIES/' . $filename . '.' . $extension;
                            $newPath = '/Asset/SERIES/' . $newFilename;
                            
                            Film::where('poster', $oldPath)->update([
                                'poster' => $newPath,
                                'banner' => $newPath
                            ]);
                            
                            echo "✓ Series renamed: $filename -> $newFilename\n";
                        }
                    }
                }
            }
        }

        echo "\n✅ Film thumbnail paths fixed! All files renamed without spaces.\n";
    }
}
