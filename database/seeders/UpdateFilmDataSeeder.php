<?php

namespace Database\Seeders;

use App\Models\Film;
use Illuminate\Database\Seeder;

class UpdateFilmDataSeeder extends Seeder
{
    /**
     * Run the database seeds - Update film data dengan genres dan description
     */
    public function run(): void
    {
        // Update films dengan data lengkap
        $films = [
            'ANAK KOLONG' => [
                'genres' => 'Drama, Remaja, Romantis',
                'description' => 'Anak Kolong menceritakan tentang seorang pemuda bernama Arya yang menolak mengikuti harapan ayahnya yang merupakan seorang tentara. Sang ayah memiliki harapan begitu besar kepada Arya untuk melanjutkan jenjang kariernya sebagai seorang tentara. Namun Arya menolak. Arya adalah sosok anak yang dididik dengan keras dan terus dibayang-bayangi dengan sang Ayah. Hingga akhirnya ia terjerumus kedalam kehidupan jalanan dan melakukan hal-hal yang membahayakan seperti balapan di jalan bahkan bertarung di jalanan. Ia kemudian bertemu dengan seorang gadis bernama Amira, yang merupakan putri dari atasan Ayahnya. Arya pun jatuh cinta pada gadis cantik itu. Namun ia harus bersaing dengan sahabatnya sendiri, Salim yang juga menyukai Amira.',
                'year' => 2024,
                'rating' => 7.5,
            ],
            'KORBAN JATUH TEMPO (PINJOL)' => [
                'genres' => 'Komedi, Horor',
                'description' => 'Film ini mengangkat kisah Sondang, pemilik sebuah rumah kost yang hidup bersama para perantau asal Medan dan Bangka. Hidup mereka awalnya berjalan seperti biasa, hingga tragedi menimpa. Musdalifah, salah satu penghuni kost, mengakhiri hidupnya karena terlilit hutang dari pinjaman online. Sejak saat itu, segalanya berubah. Kematian Musdalifah bukan cuma meninggalkan duka, tapi juga membawa kekacauan yang bikin suasana kost jadi mencekam.',
                'year' => 2025,
                'rating' => 7.8,
            ],
            'KARUNRUNG' => [
                'genres' => 'Horor, Thriller',
                'description' => 'Di tengah hiruk-pikuk pasar tradisional Kota Makassar, sekelompok preman brutal yang dipimpin oleh Uli menebar teror dan rasa takut. Namun segalanya berubah ketika seorang pebisnis kaya bernama Hendra menawarkan pekerjaan kotor dengan imbalan besar kepada Uli dan kelompoknya. Pekerjaan yang awalnya tampak seperti urusan biasa berubah menjadi tragedi mengerikan.',
                'year' => 2025,
                'rating' => 8.0,
            ],
            'TWIST STETHOSCOPE' => [
                'genres' => 'Drama, Romantis',
                'description' => 'Film Twist Stethoscope adalah film yang diangkat dari kisah nyata, novel karya by "Syahrul Sutte". Cerita ini merupakan kisah seorang mahasiswa kedokteran yang harus menghadapi keputusan darurat yang berdampak besar pada karier, masa depan, dan kehidupan pribadinya. Bukan hanya medis, tetapi juga tentang tekanan system, risiko hokum, dan konsekuensi sosial yang mengikutinya.',
                'year' => 2026,
                'rating' => 8.2,
            ],
        ];

        // Update films yang ada
        foreach ($films as $title => $data) {
            Film::where('title', $title)
                ->where('genres', '!=', $data['genres']) // Only update if different
                ->update($data);

            echo "✓ Updated: $title\n";
        }

        // Update series
        $seriesData = [
            'Adinda' => ['genres' => 'Series, Drama', 'description' => 'Series drama yang menceritakan kisah perjalanan hidup Adinda.', 'year' => 2024, 'rating' => 7.0],
            'Cinta Suci Romeo' => ['genres' => 'Series, Romantis', 'description' => 'Series romantis yang penuh dengan cinta dan pengorbanan.', 'year' => 2024, 'rating' => 7.0],
            'Dangerous Dragon' => ['genres' => 'Series, Action', 'description' => 'Series action yang penuh dengan pertarungan dan petualangan.', 'year' => 2024, 'rating' => 7.0],
            'Elegi Cinta Tiara' => ['genres' => 'Series, Drama', 'description' => 'Series drama yang menceritakan kisah cinta Tiara yang penuh lika-liku.', 'year' => 2024, 'rating' => 7.0],
            'I_m a Danger' => ['genres' => 'Series, Thriller', 'description' => 'Series thriller yang menegangkan dengan plot twist yang mengejutkan.', 'year' => 2024, 'rating' => 7.0],
            'Karateka Kok Beby Sister' => ['genres' => 'Series, Comedy', 'description' => 'Series komedi yang menghibur tentang bela diri.', 'year' => 2024, 'rating' => 7.0],
            'One More Chance' => ['genres' => 'Series, Romantis', 'description' => 'Series romantis tentang kesempatan kedua untuk cinta.', 'year' => 2024, 'rating' => 7.0],
            'Sasaeng' => ['genres' => 'Series, Drama', 'description' => 'Series drama yang menceritakan kisah obsesi dan obsidan penggemar.', 'year' => 2024, 'rating' => 7.0],
            'Skuter Asik' => ['genres' => 'Series, Comedy', 'description' => 'Series komedi yang menghibur tentang kehidupan sehari-hari.', 'year' => 2024, 'rating' => 7.0],
        ];

        foreach ($seriesData as $title => $data) {
            Film::where('title', $title)
                ->where('genres', '!=', $data['genres'])
                ->update($data);

            echo "✓ Updated: $title\n";
        }

        echo "\n✅ Film data update selesai!\n";
    }
}
