import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MovieForm } from '@/Components/admin/MovieForm';
import { DataTable, StatusBadge } from '@/Components/admin/DataTable';
import { Movie, MovieGenre, MovieCategory } from '@/types/inertia';
import { router } from '@/hooks/useInertiaForm';

// Mock data for demonstration
const mockGenres =[
  { id: 1, name: 'Drama' },
  { id: 2, name: 'Thriller' },
  { id: 3, name: 'Mystery' },
  { id: 4, name: 'Action' },
  { id: 5, name: 'Romance' },
];

const mockCategories = [
  { id: 1, title: 'PT Binasol Originals', description: 'Original productions from Binasol' },
  { id: 2, title: 'Trending Now', description: 'Most popular movies today' },
  { id: 3, title: 'Action Movies', description: 'High-octane action films' },
  { id: 4, title: 'Drama Series', description: 'Emotional and gripping drama series' },
];

const mockMovies =[
  {
    id: 1,
    title: 'The Last Chronicles',
    description: 'A thrilling journey through time and mystery...',
    rating: 8.4,
    year: 2026,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    trailer_url: 'https://youtube.com/watch?v=example',
    featured: true,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    genres: [mockGenres[0], mockGenres[1], mockGenres[2]],
    categories: [mockCategories[0], mockCategories[1]],
    cast: [
      { id: 1, movie_id: 1, name: 'John Anderson', role: 'Lead Actor', image: null, sort_order: 0 },
      { id: 2, movie_id: 1, name: 'Sarah Mitchell', role: 'Lead Actress', image: null, sort_order: 1 },
    ],
    episodes: [
      { id: 1, movie_id: 1, number: 1, title: 'The Beginning', duration: '45:32', thumbnail: null, video_url: '', sort_order: 0 },
      { id: 2, movie_id: 1, number: 2, title: 'Rising Tensions', duration: '48:15', thumbnail: null, video_url: '', sort_order: 1 },
    ],
  },
  {
    id: 2,
    title: 'Midnight Sun',
    description: 'An epic tale of love and betrayal...',
    rating: 7.8,
    year: 2025,
    poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    trailer_url: 'https://youtube.com/watch?v=example2',
    featured: false,
    created_at: '2025-12-15T00:00:00Z',
    updated_at: '2025-12-15T00:00:00Z',
    genres: [mockGenres[4]],
    categories: [mockCategories[3]],
  },
];

type ViewMode = 'list' | 'create' | 'edit';

export default function MovieManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();

  const handleEdit = (movie) => { setSelectedMovie(movie); setViewMode('edit'); };
  const handleDelete = (movie) => {
    if (confirm(`Hapus "${movie.title}"?`)) {
      router.delete(`/admin/movies/${movie.id}`);
    }
  };
  const handleCreate = () => { setSelectedMovie(undefined); setViewMode('create'); };
  const handleBackToList = () => { setSelectedMovie(undefined); setViewMode('list'); };

  if (viewMode === 'create') {
    return <AdminLayout title="Create New Movie"><MovieForm genres={mockGenres} categories={mockCategories} mode="create" /></AdminLayout>;
  }

  if (viewMode === 'edit' && selectedMovie) {
    return <AdminLayout title="Edit Movie"><MovieForm movie={selectedMovie} genres={mockGenres} categories={mockCategories} mode="edit" /></AdminLayout>;
  }

  return (
    <AdminLayout title="Movie Management">
      <DataTable
        data={mockMovies}
        columns={[ /* kolom sama seperti sebelumnya */ ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        createLabel="Create New Movie"
        searchPlaceholder="Search movies..."
      />

      <div className="fixed bottom-8 right-8">
        <button onClick={handleCreate} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Movie
        </button>
      </div>
    </AdminLayout>
  );
}
