<?php
// Simple test file to check films data
// Access: http://localhost:8000/test-films.php

try {
    // Load Laravel
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    
    // Get the database
    $app->make('Illuminate\Contracts\Http\Kernel')->handle(
        $request = \Illuminate\Http\Request::capture()
    );
    
    // Query films
    $featuredFilms = \App\Models\Film::select('id', 'title', 'poster', 'rating', 'year', 'is_featured')
        ->where('is_featured', true)
        ->limit(10)
        ->get();
    
    $allFilms = \App\Models\Film::select('id', 'title', 'is_featured')->get();
    
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Films Data Check</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
            .success { background: #d4edda; color: #155724; }
            .warning { background: #fff3cd; color: #856404; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
            .poster-thumb { max-width: 50px; }
        </style>
    </head>
    <body>
        <h1>🎬 Films Database Check</h1>
        
        <div class="status success">
            <strong>✅ Database Connected!</strong>
        </div>
        
        <h2>Featured Films (is_featured = true)</h2>
        <div class="status <?php echo count($featuredFilms) > 0 ? 'success' : 'warning'; ?>">
            Found: <strong><?php echo count($featuredFilms); ?></strong> featured films
        </div>
        
        <?php if (count($featuredFilms) > 0): ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Poster</th>
                <th>Rating</th>
                <th>Year</th>
            </tr>
            <?php foreach($featuredFilms as $film): ?>
            <tr>
                <td><?php echo $film->id; ?></td>
                <td><?php echo htmlspecialchars($film->title); ?></td>
                <td>
                    <?php if($film->poster): ?>
                        <img src="<?php echo htmlspecialchars($film->poster); ?>" class="poster-thumb" alt="poster">
                    <?php else: ?>
                        <em>No image</em>
                    <?php endif; ?>
                </td>
                <td><?php echo $film->rating; ?></td>
                <td><?php echo $film->year; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
        <?php else: ?>
        <p style="color: red;"><strong>⚠️ WARNING: No featured films found!</strong></p>
        <?php endif; ?>
        
        <h2>All Films Summary</h2>
        <p>Total: <strong><?php echo count($allFilms); ?></strong> films</p>
        <p>Featured: <strong><?php echo $allFilms->where('is_featured', true)->count(); ?></strong></p>
        <p>Non-featured: <strong><?php echo $allFilms->where('is_featured', false)->count(); ?></strong></p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
            If featured films are empty, run: <code>php artisan db:seed --class=UpdateFilmDataSeeder</code>
        </p>
    </body>
    </html>
    <?php
    
} catch (\Exception $e) {
    die("<h1>❌ Error</h1><pre>" . htmlspecialchars($e->getMessage()) . "\n" . htmlspecialchars($e->getTraceAsString()) . "</pre>");
}
