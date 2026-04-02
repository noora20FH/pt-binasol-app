import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';
import { Film } from '../../types/cms';

interface FilmFormProps {
  film?: Film;
  mode: 'create' | 'edit';
  onBack: () => void;
  onSave: (data: any) => void;
}

export function FilmForm({ film, mode, onBack, onSave }: FilmFormProps) {
  const [formData, setFormData] = useState({
    title: film?.title || '',
    description: film?.description || '',
    genres: film?.genres || '',
    rating: film?.rating || null,
    year: film?.year || null,
    poster: null as File | null,
    banner: null as File | null,
    is_featured: film?.is_featured || false,
    casts: film?.casts || [],
    episodes: film?.episodes || [],
  });

  const [casts, setCasts] = useState<any[]>(
    film?.casts || []
  );

  const [episodes, setEpisodes] = useState<any[]>(
    film?.episodes || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, casts, episodes });
  };

  const addCast = () => {
    setCasts([...casts, { name: '', role: '', image: null }]);
  };

  const removeCast = (index: number) => {
    setCasts(casts.filter((_, i) => i !== index));
  };

  const updateCast = (index: number, field: string, value: any) => {
    const updated = [...casts];
    updated[index] = { ...updated[index], [field]: value };
    setCasts(updated);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { number: episodes.length + 1, title: '', duration: '', thumbnail: null, platforms: [] }]);
  };

  const removeEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const updateEpisode = (index: number, field: string, value: any) => {
    const updated = [...episodes];
    updated[index] = { ...updated[index], [field]: value };
    setEpisodes(updated);
  };

  const addPlatform = (episodeIndex: number) => {
    const updated = [...episodes];
    if (!updated[episodeIndex].platforms) {
      updated[episodeIndex].platforms = [];
    }
    updated[episodeIndex].platforms.push({ platform_name: '', url: '' });
    setEpisodes(updated);
  };

  const removePlatform = (episodeIndex: number, platformIndex: number) => {
    const updated = [...episodes];
    updated[episodeIndex].platforms = updated[episodeIndex].platforms.filter((_: any, i: number) => i !== platformIndex);
    setEpisodes(updated);
  };

  const updatePlatform = (episodeIndex: number, platformIndex: number, field: string, value: any) => {
    const updated = [...episodes];
    updated[episodeIndex].platforms[platformIndex] = {
      ...updated[episodeIndex].platforms[platformIndex],
      [field]: value
    };
    setEpisodes(updated);
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? 'Tambah Film Baru' : 'Edit Film'}
          </h2>
          <p className="text-gray-600">
            {mode === 'create' ? 'Masukkan informasi film' : 'Perbarui informasi film'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Film *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                required
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                placeholder="Deskripsi lengkap film..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                placeholder="Drama, Thriller, Action"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                maxLength={255}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating || ''}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun
              </label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-[#D98344] border-gray-300 rounded focus:ring-[#D98344]"
                />
                <span className="text-sm font-medium text-gray-700">Film Unggulan</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, poster: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
              {film?.poster && (
                <img src={film.poster} alt="Current poster" className="mt-2 w-24 h-32 object-cover rounded" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, banner: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
              />
              {film?.banner && (
                <img src={film.banner} alt="Current banner" className="mt-2 w-full h-20 object-cover rounded" />
              )}
            </div>
          </div>
        </div>

        {/* Cast Members */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pemain (Cast)</h3>
            <button
              type="button"
              onClick={addCast}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Cast
            </button>
          </div>

          <div className="space-y-4">
            {casts.map((cast, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama *
                    </label>
                    <input
                      type="text"
                      value={cast.name}
                      onChange={(e) => updateCast(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                    <input
                      type="text"
                      value={cast.role}
                      onChange={(e) => updateCast(index, 'role', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      maxLength={255}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateCast(index, 'image', e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCast(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {casts.length === 0 && (
              <p className="text-center text-gray-500 py-4">Belum ada cast. Klik "Tambah Cast" untuk menambahkan.</p>
            )}
          </div>
        </div>

        {/* Episodes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Episode</h3>
            <button
              type="button"
              onClick={addEpisode}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Episode
            </button>
          </div>

          <div className="space-y-4">
            {episodes.map((episode, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">Episode {episode.number}</h4>
                  <button
                    type="button"
                    onClick={() => removeEpisode(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Episode *
                    </label>
                    <input
                      type="number"
                      value={episode.number}
                      onChange={(e) => updateEpisode(index, 'number', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Episode *
                    </label>
                    <input
                      type="text"
                      value={episode.title}
                      onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durasi</label>
                    <input
                      type="text"
                      value={episode.duration}
                      onChange={(e) => updateEpisode(index, 'duration', e.target.value)}
                      placeholder="45:30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateEpisode(index, 'thumbnail', e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent"
                  />
                </div>

                {/* Platforms */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Platform Streaming</label>
                    <button
                      type="button"
                      onClick={() => addPlatform(index)}
                      className="text-sm text-[#D98344] hover:text-[#BF6D34] font-medium"
                    >
                      + Tambah Platform
                    </button>
                  </div>
                  {episode.platforms?.map((platform: any, pIndex: number) => (
                    <div key={pIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={platform.platform_name}
                        onChange={(e) => updatePlatform(index, pIndex, 'platform_name', e.target.value)}
                        placeholder="Netflix, YouTube, dll *"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent text-sm"
                        required
                        maxLength={100}
                      />
                      <input
                        type="url"
                        value={platform.url}
                        onChange={(e) => updatePlatform(index, pIndex, 'url', e.target.value)}
                        placeholder="https://... *"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D98344] focus:border-transparent text-sm"
                        required
                        maxLength={255}
                      />
                      <button
                        type="button"
                        onClick={() => removePlatform(index, pIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {episodes.length === 0 && (
              <p className="text-center text-gray-500 py-4">Belum ada episode. Klik "Tambah Episode" untuk menambahkan.</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#D98344] text-white rounded-lg hover:bg-[#BF6D34] transition-colors"
          >
            <Save className="w-4 h-4" />
            {mode === 'create' ? 'Simpan Film' : 'Update Film'}
          </button>
        </div>
      </form>
    </div>
  );
}
