import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function FilmForm({ film, mode, onBack, onSave }) {
  const [formData, setFormData] = useState({
    title: film?.title || '',
    description: film?.description || '',
    genres: film?.genres || '',
    rating: film?.rating || '',
    year: film?.year || '',
    poster: null,
    banner: null,
    is_featured: film?.is_featured || false,
  });

  const [casts, setCasts] = useState(film?.casts || []);
  const [episodes, setEpisodes] = useState(film?.episodes || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, casts, episodes });
  };

  // Cast Handlers
  const addCast = () => {
    setCasts([...casts, { name: '', role: '', image: null }]);
  };

  const removeCast = (index) => {
    setCasts(casts.filter((_, i) => i !== index));
  };

  const updateCast = (index, field, value) => {
    const updated = [...casts];
    updated[index] = { ...updated[index], [field]: value };
    setCasts(updated);
  };

  // Episode Handlers
  const addEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        number: episodes.length + 1,
        title: '',
        duration: '',
        thumbnail: null,
        platforms: [],
      },
    ]);
  };

  const removeEpisode = (index) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const updateEpisode = (index, field, value) => {
    const updated = [...episodes];
    updated[index] = { ...updated[index], [field]: value };
    setEpisodes(updated);
  };

  // Platform Handlers
  const addPlatform = (episodeIndex) => {
    const updated = [...episodes];
    if (!updated[episodeIndex].platforms) updated[episodeIndex].platforms = [];
    updated[episodeIndex].platforms.push({ platform_name: '', url: '' });
    setEpisodes(updated);
  };

  const removePlatform = (episodeIndex, platformIndex) => {
    const updated = [...episodes];
    updated[episodeIndex].platforms = updated[episodeIndex].platforms.filter(
      (_, i) => i !== platformIndex
    );
    setEpisodes(updated);
  };

  const updatePlatform = (episodeIndex, platformIndex, field, value) => {
    const updated = [...episodes];
    updated[episodeIndex].platforms[platformIndex] = {
      ...updated[episodeIndex].platforms[platformIndex],
      [field]: value,
    };
    setEpisodes(updated);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Tambah Film Baru' : 'Edit Film'}
          </h2>
          <p className="text-gray-600">
            {mode === 'create'
              ? 'Masukkan informasi film lengkap'
              : 'Perbarui informasi film'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informasi Dasar */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Film *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                placeholder="Drama, Thriller, Action"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Rilis</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-[#FF751F]"
              />
              <span className="text-sm font-medium text-gray-700">Tandai sebagai Film Unggulan</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poster Film</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, poster: e.target.files?.[0] || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
              />
              {film?.poster && (
                <img src={film.poster} alt="Poster Saat Ini" className="mt-3 w-24 h-32 object-cover rounded-xl" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Film</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, banner: e.target.files?.[0] || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
              />
              {film?.banner && (
                <img src={film.banner} alt="Banner Saat Ini" className="mt-3 w-full h-24 object-cover rounded-xl" />
              )}
            </div>
          </div>
        </div>

        {/* Cast Members */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pemain (Cast)</h3>
            <button
              type="button"
              onClick={addCast}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF751F] text-white rounded-xl text-sm hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
              Tambah Cast
            </button>
          </div>

          <div className="space-y-4">
            {casts.map((cast, index) => (
              <div key={index} className="p-5 border border-gray-200 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pemain *</label>
                    <input
                      type="text"
                      value={cast.name}
                      onChange={(e) => updateCast(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                    <input
                      type="text"
                      value={cast.role}
                      onChange={(e) => updateCast(index, 'role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateCast(index, 'image', e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCast(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {casts.length === 0 && (
              <p className="text-center text-gray-500 py-8">Belum ada data cast. Klik "Tambah Cast".</p>
            )}
          </div>
        </div>

        {/* Episodes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Episode</h3>
            <button
              type="button"
              onClick={addEpisode}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF751F] text-white rounded-xl text-sm hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
              Tambah Episode
            </button>
          </div>

          <div className="space-y-6">
            {episodes.map((episode, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Episode {episode.number}</h4>
                  <button
                    type="button"
                    onClick={() => removeEpisode(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Episode</label>
                    <input
                      type="number"
                      value={episode.number}
                      onChange={(e) => updateEpisode(index, 'number', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Episode</label>
                    <input
                      type="text"
                      value={episode.title}
                      onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                    />
                  </div>
                </div>

                {/* Platforms */}
                <div className="mt-6">
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Platform Streaming</label>
                    <button
                      type="button"
                      onClick={() => addPlatform(index)}
                      className="text-[#FF751F] text-sm font-medium"
                    >
                      + Tambah Platform
                    </button>
                  </div>
                  {episode.platforms?.map((platform, pIndex) => (
                    <div key={pIndex} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Nama Platform"
                        value={platform.platform_name}
                        onChange={(e) => updatePlatform(index, pIndex, 'platform_name', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={platform.url}
                        onChange={(e) => updatePlatform(index, pIndex, 'url', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removePlatform(index, pIndex)}
                        className="px-4 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-orange-600 font-medium"
          >
            <Save className="w-5 h-5" />
            {mode === 'create' ? 'Simpan Film' : 'Update Film'}
          </button>
        </div>
      </form>
    </div>
  );
}
