<?php

namespace Database\Seeders;

use App\Models\Film;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FixAllFilmPathsSeeder extends Seeder
{
    /**
     * Fix ALL film paths - semua dengan lowercase slug format
     */
    public function run(): void
    {
        echo "Scanning FILM folder...\n";
        $filmDir = public_path('Asset/FILM');
        $this->processFolder($filmDir, '/Asset/FILM/');
        
        echo "\nScanning SERIES folder...\n";
        $seriesDir = public_path('Asset/SERIES');
        $this->processFolder($seriesDir, '/Asset/SERIES/');
        
        echo "\n✅ All film/series thumbnail paths fixed!\n";
    }

    private function processFolder($dirPath, $urlPrefix)
    {
        if (!is_dir($dirPath)) {
            echo "Directory not found: $dirPath\n";
            return;
        }

        $files = glob($dirPath . '/*.*');
        
        foreach ($files as $file) {
            if (!is_file($file)) continue;
            
            $filename = pathinfo($file, PATHINFO_FILENAME);
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            
            // Skip jika sudah lowercase slug format
            $slugName = Str::slug($filename, '-');
            if ($filename === $slugName) {
                echo "✓ Already fixed: $filename.$extension\n";
                continue;
            }
            
            // Rename to slug format
            $newFilename = $slugName . '.' . $extension;
            $newFile = dirname($file) . '/' . $newFilename;
            
            // Rename fisik file
            if (file_exists($file) && !file_exists($newFile)) {
                rename($file, $newFile);
                echo "✓ Renamed: $filename.$extension -> $newFilename\n";
                
                // Update database
                Film::where('poster', $urlPrefix . $filename . '.' . $extension)
                    ->update([
                        'poster' => $urlPrefix . $newFilename,
                        'banner' => $urlPrefix . $newFilename
                    ]);
                    
                echo "  Updated in database\n";
            }
        }
    }
}
