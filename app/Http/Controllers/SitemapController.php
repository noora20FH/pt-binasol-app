<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Film;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = $this->generateSitemap();
        return response($sitemap, 200)->header('Content-Type', 'application/xml; charset=utf-8');
    }

    private function generateSitemap()
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Static pages
        $staticPages = [
            ['url' => '/', 'priority' => '1.0'],
            ['url' => '/categories', 'priority' => '0.9'],
            ['url' => '/products', 'priority' => '0.9'],
            ['url' => '/films', 'priority' => '0.8'],
            ['url' => '/about', 'priority' => '0.7'],
            ['url' => '/contact', 'priority' => '0.7'],
        ];

        foreach ($staticPages as $page) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars(config('app.url') . $page['url']) . "</loc>\n";
            $xml .= "    <lastmod>" . now()->toAtomString() . "</lastmod>\n";
            $xml .= "    <priority>" . $page['priority'] . "</priority>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "  </url>\n";
        }

        // Dynamic pages - Categories
        $categories = Category::select('slug', 'updated_at')->get();
        foreach ($categories as $category) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars(config('app.url') . "/categories/{$category->slug}") . "</loc>\n";
            $xml .= "    <lastmod>" . $category->updated_at->toAtomString() . "</lastmod>\n";
            $xml .= "    <priority>0.8</priority>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "  </url>\n";
        }

        // Dynamic pages - Products
        $products = Product::select('slug', 'updated_at')->get();
        foreach ($products as $product) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars(config('app.url') . "/products/{$product->slug}") . "</loc>\n";
            $xml .= "    <lastmod>" . $product->updated_at->toAtomString() . "</lastmod>\n";
            $xml .= "    <priority>0.7</priority>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "  </url>\n";
        }

        // Dynamic pages - Films
        $films = Film::select('id', 'updated_at')->get();
        foreach ($films as $film) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars(config('app.url') . "/films/{$film->id}") . "</loc>\n";
            $xml .= "    <lastmod>" . $film->updated_at->toAtomString() . "</lastmod>\n";
            $xml .= "    <priority>0.6</priority>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "  </url>\n";
        }

        $xml .= "</urlset>";

        return $xml;
    }
}
