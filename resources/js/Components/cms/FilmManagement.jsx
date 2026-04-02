import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable, StatusBadge } from './DataTable';
import { FilmForm } from './FilmForm';
import { Film } from '../../types/cms';

// Mock data
const mockFilms: Film[] = [
  {
    id: 1,
    title: 'Laskar Pelangi',
    description: 'Kisah inspiratif anak-anak SD Muhammadiyah di Belitung',
    genres: 'Drama, Pendidikan',
    rating: 8.5,
    year: 2008,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    is_featured: true,
    deleted_at: null,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
    casts: [
      {
        id: 1,
        film_id: 1,
        name: 'Cut Mini Theo',
        role: 'Bu Muslimah',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        deleted_at: null,
      },
      {
        id: 2,
        film_id: 1,
        name: 'Ikranagara',
        role: 'Pak Harfan',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        deleted_at: null,
      },
    ],
    episodes: [
      {
        id: 1,
        film_id: 1,
        number: 1,
        title: 'Full Movie',
        duration: '125:00',
        thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        deleted_at: null,
        platforms: [
          {
            id: 1,
            episode_id: 1,
            platform_name: 'Netflix',
            url: 'https://netflix.com/watch/laskar-pelangi',
          },
          {
            id: 2,
            episode_id: 1,
            platform_name: 'Disney+ Hotstar',
            url: 'https://hotstar.com/id/movies/laskar-pelangi',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Pengabdi Setan',
    description: 'Sebuah keluarga dihadapkan pada teror misterius',
    genres: 'Horror, Thriller',
    rating: 7.8,
    year: 2017,
    poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    is_featured: false,
    deleted_at: null,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
    casts: [
      {
        id: 3,
        film_id: 2,
        name: 'Tara Basro',
        role: 'Rini',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        deleted_at: null,
      },
      {
        id: 4,
        film_id: 2,
        name: 'Bront Palarae',
        role: 'Bahri',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        deleted_at: null,
      },
    ],
    episodes: [
      {
        id: 2,
        film_id: 2,
        number: 1,
        title: 'Full Movie',
        duration: '107:00',
        thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
        deleted_at: null,
        platforms: [
          {
            id: 3,
            episode_id: 2,
            platform_name: 'Netflix',
            url: 'https://netflix.com/watch/pengabdi-setan',
          },
        ],
      },
    ],
  },
];

export function FilmManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedFilm, setSelectedFilm] = useState<Film | undefined>();
  const [films, setFilms] = useState<Film[]>(mockFilms);

  const handleCreate = () => {
    setSelectedFilm(undefined);
    setView('create');
  };

  const handleEdit = (film: Film) => {
    setSelectedFilm(film);
    setView('edit');
  };

  const handleDelete = (film: Film) => {
    setFilms(films.filter(f => f.id !== film.id));
    console.log('Delete film:', film.id);
  };

  const handleBack = () => {
    setView('list');
    setSelectedFilm(undefined);
  };

  const handleSave = (filmData: any) => {
    console.log('Save film:', filmData);
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <FilmForm
        film={selectedFilm}
        mode={view}
        onBack={handleBack}
        onSave={handleSave}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Film</h2>
        <p className="text-gray-600">Kelola data film, cast, dan episode</p>
      </div>

      <DataTable
        data={films}
        columns={[
          {
            key: 'id',
            label: 'ID',
            render: (value) => <span className="font-medium">#{value}</span>
          },
          {
            key: 'poster',
            label: 'Poster',
            render: (value) =>
              value ? (
                <img src={value} alt="Poster" className="w-12 h-16 object-cover rounded" />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              ),
          },
          {
            key: 'title',
            label: 'Judul',
            render: (value) => <span className="font-medium">{value}</span>,
          },
          {
            key: 'description',
            label: 'Deskripsi',
            render: (value) => (
              <span className="text-sm text-gray-600 max-w-xs truncate block">
                {value || '-'}
              </span>
            ),
          },
          {
            key: 'genres',
            label: 'Genre',
            render: (value) => <span className="text-sm text-gray-600">{value || '-'}</span>,
          },
          {
            key: 'rating',
            label: 'Rating',
            render: (value) => (
              <span className="inline-flex items-center gap-1">
                ⭐ {value || 'N/A'}
              </span>
            ),
          },
          {
            key: 'year',
            label: 'Tahun',
          },
          {
            key: 'is_featured',
            label: 'Unggulan',
            render: (value) =>
              value ? (
                <StatusBadge status="Ya" type="success" />
              ) : (
                <StatusBadge status="Tidak" type="default" />
              ),
          },
          {
            key: 'created_at',
            label: 'Dibuat',
            render: (value) => (
              <span className="text-xs text-gray-500">
                {new Date(value).toLocaleDateString('id-ID')}
              </span>
            ),
          },
          {
            key: 'updated_at',
            label: 'Diperbarui',
            render: (value) => (
              <span className="text-xs text-gray-500">
                {new Date(value).toLocaleDateString('id-ID')}
              </span>
            ),
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Tambah Film"
        searchPlaceholder="Cari film..."
        emptyMessage="Belum ada film. Tambahkan film pertama Anda!"
      />
    </div>
  );
}
