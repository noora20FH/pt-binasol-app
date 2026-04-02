import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X, Save, ArrowLeft } from 'lucide-react';
import { useForm, Link } from '../../hooks/useInertiaForm.tsx';
import {
  MovieFormData,
  Movie,
  MovieGenre,
  MovieCategory,
  MovieCastMember,
  MovieEpisode,
} from '../../types/inertia';

interface MovieFormProps {
  movie?: Movie;
  genres: MovieGenre[];
  categories: MovieCategory[];
  mode: 'create' | 'edit';
}

export function MovieForm({ movie, genres, categories, mode }: MovieFormProps) {
  const [posterPreview, setPosterPreview] = useState<string | null>(
    typeof movie?.poster === 'string' ? movie.poster : null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    typeof movie?.banner === 'string' ? movie.banner : null
  );

  // Initialize form data matching exact database schema (snake_case)
  const form = useForm<MovieFormData>({
    title: movie?.title || '',
    description: movie?.description || '',
    rating: movie?.rating || '',
    year: movie?.year || '',
    poster: null,
    banner: null,
    trailer_url: movie?.trailer_url || '',
    featured: movie?.featured || false,
    genre_ids: movie?.genres?.map((g) => g.id) || [],
    category_ids: movie?.categories?.map((c) => c.id) || [],
    movie_cast: movie?.cast || [
      { name: '', role: '', image: null, sort_order: 0 },
    ],
    movie_episodes: movie?.episodes || [
      { number: 1, title: '', duration: '', thumbnail: null, video_url: '', sort_order: 0 },
    ],
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Transform the data for multipart/form-data submission
    form.transform((data) => {
      const formData = new FormData();

      // Add basic fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('rating', String(data.rating));
      formData.append('year', String(data.year));
      formData.append('trailer_url', data.trailer_url);
      formData.append('featured', data.featured ? '1' : '0');

      // Add file uploads
      if (data.poster instanceof File) {
        formData.append('poster', data.poster);
      }
      if (data.banner instanceof File) {
        formData.append('banner', data.banner);
      }

      // Add genre_ids as array
      data.genre_ids.forEach((id, index) => {
        formData.append(`genre_ids[${index}]`, String(id));
      });

      // Add category_ids as array
      data.category_ids.forEach((id, index) => {
        formData.append(`category_ids[${index}]`, String(id));
      });

      // Add movie_cast as nested array with proper indexing
      data.movie_cast.forEach((cast, index) => {
        if (cast.id) {
          formData.append(`movie_cast[${index}][id]`, String(cast.id));
        }
        formData.append(`movie_cast[${index}][name]`, cast.name);
        formData.append(`movie_cast[${index}][role]`, cast.role);
        formData.append(`movie_cast[${index}][sort_order]`, String(cast.sort_order));

        if (cast.image instanceof File) {
          formData.append(`movie_cast[${index}][image]`, cast.image);
        } else if (typeof cast.image === 'string') {
          formData.append(`movie_cast[${index}][image]`, cast.image);
        }

        if (cast._destroy) {
          formData.append(`movie_cast[${index}][_destroy]`, '1');
        }
      });

      // Add movie_episodes as nested array with proper indexing
      data.movie_episodes.forEach((episode, index) => {
        if (episode.id) {
          formData.append(`movie_episodes[${index}][id]`, String(episode.id));
        }
        formData.append(`movie_episodes[${index}][number]`, String(episode.number));
        formData.append(`movie_episodes[${index}][title]`, episode.title);
        formData.append(`movie_episodes[${index}][duration]`, episode.duration);
        formData.append(`movie_episodes[${index}][video_url]`, episode.video_url);
        formData.append(`movie_episodes[${index}][sort_order]`, String(episode.sort_order));

        if (episode.thumbnail instanceof File) {
          formData.append(`movie_episodes[${index}][thumbnail]`, episode.thumbnail);
        } else if (typeof episode.thumbnail === 'string') {
          formData.append(`movie_episodes[${index}][thumbnail]`, episode.thumbnail);
        }

        if (episode._destroy) {
          formData.append(`movie_episodes[${index}][_destroy]`, '1');
        }
      });

      return formData;
    });

    if (mode === 'create') {
      form.post('/admin/movies', {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          alert('Movie created successfully!');
        },
        onError: (errors) => {
          console.error('Validation errors:', errors);
        },
      });
    } else {
      // Laravel needs _method spoofing for PUT with FormData
      form.post(`/admin/movies/${movie?.id}`, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          alert('Movie updated successfully!');
        },
        onError: (errors) => {
          console.error('Validation errors:', errors);
        },
      });
    }
  };

  // Handle file preview
  const handleFileChange = (
    file: File | null,
    field: 'poster' | 'banner',
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setData(field, file);
    } else {
      setPreview(null);
      form.setData(field, null);
    }
  };

  // Cast management functions
  const addCastMember = () => {
    form.setData('movie_cast', [
      ...form.data.movie_cast,
      {
        name: '',
        role: '',
        image: null,
        sort_order: form.data.movie_cast.length,
      },
    ]);
  };

  const removeCastMember = (index: number) => {
    const updatedCast = [...form.data.movie_cast];
    if (updatedCast[index].id) {
      // Mark for deletion if it exists in database
      updatedCast[index]._destroy = true;
    } else {
      // Remove completely if not saved yet
      updatedCast.splice(index, 1);
    }
    form.setData('movie_cast', updatedCast);
  };

  const updateCastMember = (index: number, field: keyof MovieCastMember, value: any) => {
    const updatedCast = [...form.data.movie_cast];
    updatedCast[index] = { ...updatedCast[index], [field]: value };
    form.setData('movie_cast', updatedCast);
  };

  // Episode management functions
  const addEpisode = () => {
    form.setData('movie_episodes', [
      ...form.data.movie_episodes,
      {
        number: form.data.movie_episodes.length + 1,
        title: '',
        duration: '',
        thumbnail: null,
        video_url: '',
        sort_order: form.data.movie_episodes.length,
      },
    ]);
  };

  const removeEpisode = (index: number) => {
    const updatedEpisodes = [...form.data.movie_episodes];
    if (updatedEpisodes[index].id) {
      // Mark for deletion if it exists in database
      updatedEpisodes[index]._destroy = true;
    } else {
      // Remove completely if not saved yet
      updatedEpisodes.splice(index, 1);
    }
    form.setData('movie_episodes', updatedEpisodes);
  };

  const updateEpisode = (index: number, field: keyof MovieEpisode, value: any) => {
    const updatedEpisodes = [...form.data.movie_episodes];
    updatedEpisodes[index] = { ...updatedEpisodes[index], [field]: value };
    form.setData('movie_episodes', updatedEpisodes);
  };

  // Toggle genre/category selection
  const toggleGenre = (genreId: number) => {
    const newGenreIds = form.data.genre_ids.includes(genreId)
      ? form.data.genre_ids.filter((id) => id !== genreId)
      : [...form.data.genre_ids, genreId];
    form.setData('genre_ids', newGenreIds);
  };

  const toggleCategory = (categoryId: number) => {
    const newCategoryIds = form.data.category_ids.includes(categoryId)
      ? form.data.category_ids.filter((id) => id !== categoryId)
      : [...form.data.category_ids, categoryId];
    form.setData('category_ids', newCategoryIds);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/movies"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Movie' : 'Edit Movie'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {form.errors.title && (
                <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.data.description}
                onChange={(e) => form.setData('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.description && (
                <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.data.rating}
                onChange={(e) => form.setData('rating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.rating && (
                <p className="mt-1 text-sm text-red-600">{form.errors.rating}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                min="1900"
                max="2100"
                value={form.data.year}
                onChange={(e) => form.setData('year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.year && (
                <p className="mt-1 text-sm text-red-600">{form.errors.year}</p>
              )}
            </div>

            {/* Trailer URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trailer URL
              </label>
              <input
                type="url"
                value={form.data.trailer_url}
                onChange={(e) => form.setData('trailer_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.trailer_url && (
                <p className="mt-1 text-sm text-red-600">{form.errors.trailer_url}</p>
              )}
            </div>

            {/* Featured */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.data.featured}
                  onChange={(e) => form.setData('featured', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Movie</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poster */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {posterPreview ? (
                  <div className="relative">
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="w-full h-64 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, 'poster', setPosterPreview)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload poster</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] || null, 'poster', setPosterPreview)
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {form.errors.poster && (
                <p className="mt-1 text-sm text-red-600">{form.errors.poster}</p>
              )}
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {bannerPreview ? (
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-64 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileChange(null, 'banner', setBannerPreview)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] || null, 'banner', setBannerPreview)
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {form.errors.banner && (
                <p className="mt-1 text-sm text-red-600">{form.errors.banner}</p>
              )}
            </div>
          </div>
        </div>

        {/* Genres (Many-to-Many) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Genres</h3>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <label
                key={genre.id}
                className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  form.data.genre_ids.includes(genre.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.data.genre_ids.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                  className="sr-only"
                />
                <span>{genre.name}</span>
              </label>
            ))}
          </div>
          {form.errors.genre_ids && (
            <p className="mt-2 text-sm text-red-600">{form.errors.genre_ids}</p>
          )}
        </div>

        {/* Categories (Many-to-Many) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.data.category_ids.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{category.title}</div>
                  {category.description && (
                    <div className="text-sm text-gray-500">{category.description}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
          {form.errors.category_ids && (
            <p className="mt-2 text-sm text-red-600">{form.errors.category_ids}</p>
          )}
        </div>

        {/* Cast Members (Nested Has-Many) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cast Members</h3>
            <button
              type="button"
              onClick={addCastMember}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Cast Member
            </button>
          </div>
          <div className="space-y-4">
            {form.data.movie_cast.map((cast, index) => {
              if (cast._destroy) return null;

              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Cast Member #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeCastMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={cast.name}
                        onChange={(e) => updateCastMember(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <input
                        type="text"
                        value={cast.role}
                        onChange={(e) => updateCastMember(index, 'role', e.target.value)}
                        placeholder="e.g., Lead Actor, Director"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateCastMember(index, 'image', e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {form.errors.movie_cast && (
            <p className="mt-2 text-sm text-red-600">{form.errors.movie_cast}</p>
          )}
        </div>

        {/* Episodes (Nested Has-Many) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Episodes</h3>
            <button
              type="button"
              onClick={addEpisode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Episode
            </button>
          </div>
          <div className="space-y-4">
            {form.data.movie_episodes.map((episode, index) => {
              if (episode._destroy) return null;

              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Episode #{episode.number}</h4>
                    <button
                      type="button"
                      onClick={() => removeEpisode(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Episode Number *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={episode.number}
                        onChange={(e) => updateEpisode(index, 'number', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={episode.duration}
                        onChange={(e) => updateEpisode(index, 'duration', e.target.value)}
                        placeholder="45:32"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={episode.title}
                        onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={episode.video_url}
                        onChange={(e) => updateEpisode(index, 'video_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateEpisode(index, 'thumbnail', e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {form.errors.movie_episodes && (
            <p className="mt-2 text-sm text-red-600">{form.errors.movie_episodes}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/movies"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={form.processing}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {form.processing ? 'Saving...' : mode === 'create' ? 'Create Movie' : 'Update Movie'}
          </button>
        </div>
      </form>
    </div>
  );
}
