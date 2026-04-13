import React from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useForm, router } from "@inertiajs/react";

export default function FilmForm({ film = null, mode = "create" }) {
    const isEdit = mode === "edit";

    const { data, setData, post, put, processing, errors } = useForm({
        title: film?.title || "",
        description: film?.description || "",
        genres: film?.genres || "",
        rating: film?.rating || "",
        year: film?.year || "",
        poster: null,
        banner: null,
        is_featured: film?.is_featured || false,
        casts: film?.casts || [],
        episodes: film?.episodes || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", data.title || "");
        formData.append("description", data.description || "");
        formData.append("genres", data.genres || "");
        formData.append("rating", data.rating || "");
        formData.append("year", data.year || "");
        formData.append("is_featured", data.is_featured ? "1" : "0");

        if (data.poster) formData.append("poster", data.poster);
        if (data.banner) formData.append("banner", data.banner);

        data.casts.forEach((cast, index) => {
            formData.append(`casts[${index}][name]`, cast.name || "");
            formData.append(`casts[${index}][role]`, cast.role || "");

            // Kirim file image jika ada
            if (cast.image instanceof File) {
                formData.append(`casts[${index}][image]`, cast.image);
            }
        });
        formData.append("episodes", JSON.stringify(data.episodes));

        if (isEdit) {
            // ← PERBAIKAN KRUSIAL
            formData.append("_method", "PUT");
            router.post(route("admin.films.update", film.id), formData, {
                onSuccess: () => router.get(route("admin.films.index")),
            });
        } else {
            post(route("admin.films.store"), formData, {
                onSuccess: () => router.get(route("admin.films.index")),
            });
        }
    };
    // Cast Handlers (tidak diubah)
    const addCast = () =>
        setData("casts", [...data.casts, { name: "", role: "", image: null }]);
    const removeCast = (index) =>
        setData(
            "casts",
            data.casts.filter((_, i) => i !== index),
        );
    const updateCast = (index, field, value) => {
        const updated = [...data.casts];
        updated[index] = { ...updated[index], [field]: value };
        setData("casts", updated);
    };

    // Episode Handlers (sudah ada duration)
    const addEpisode = () => {
        setData("episodes", [
            ...data.episodes,
            {
                number: data.episodes.length + 1,
                title: "",
                duration: "", // ← sudah ada
                thumbnail: null,
                platforms: [],
            },
        ]);
    };
    const removeEpisode = (index) =>
        setData(
            "episodes",
            data.episodes.filter((_, i) => i !== index),
        );
    const updateEpisode = (index, field, value) => {
        const updated = [...data.episodes];
        updated[index] = { ...updated[index], [field]: value };
        setData("episodes", updated);
    };

    // Platform Handlers (tidak diubah)
    const addPlatform = (episodeIndex) => {
        const updated = [...data.episodes];
        if (!updated[episodeIndex].platforms)
            updated[episodeIndex].platforms = [];
        updated[episodeIndex].platforms.push({ platform_name: "", url: "" });
        setData("episodes", updated);
    };
    const removePlatform = (episodeIndex, platformIndex) => {
        const updated = [...data.episodes];
        updated[episodeIndex].platforms = updated[
            episodeIndex
        ].platforms.filter((_, i) => i !== platformIndex);
        setData("episodes", updated);
    };
    const updatePlatform = (episodeIndex, platformIndex, field, value) => {
        const updated = [...data.episodes];
        updated[episodeIndex].platforms[platformIndex] = {
            ...updated[episodeIndex].platforms[platformIndex],
            [field]: value,
        };
        setData("episodes", updated);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header tetap sama */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => router.get(route("admin.films.index"))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit Film" : "Tambah Film Baru"}
                    </h2>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-8"
            >
                {/* ==================== INFORMASI DASAR ==================== */}
                                
                <div className="bg-white rounded-2xl shadow-sm p-6">
                                        
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                Informasi Dasar
                                            
                    </h3>
                                        
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                
                        <div className="md:col-span-2">
                                                        
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Judul Film *
                                                            
                            </label>
                                                        
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                            />
                                                        
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                                                        
                                    {errors.title}
                                                                    
                                </p>
                            )}
                                                    
                        </div>
                                                
                        <div className="md:col-span-2">
                                                        
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Deskripsi
                                                            
                            </label>
                                                        
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                            />
                                                    
                        </div>
                                                
                        <div>
                                                        
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Genre
                                                            
                            </label>
                                                        
                            <input
                                type="text"
                                value={data.genres}
                                onChange={(e) =>
                                    setData("genres", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
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
                                value={data.rating}
                                onChange={(e) =>
                                    setData("rating", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                            />
                                                    
                        </div>
                                                
                        <div>
                                                        
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Tahun Rilis
                                                            
                            </label>
                                                        
                            <input
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData("year", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                            />
                                                    
                        </div>
                                                
                        <div className="flex items-center gap-3">
                                                        
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) =>
                                    setData("is_featured", e.target.checked)
                                }
                                className="w-5 h-5 text-[#FF751F]"
                            />
                                                        
                            <span className="text-sm font-medium text-gray-700">
                                                                Tandai sebagai
                                Film Unggulan                             
                            </span>
                                                    
                        </div>
                                                
                        <div>
                                                        
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Poster Film
                                                            
                            </label>
                                                        
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData("poster", e.target.files[0])
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                            />
                                                        
                            {film?.poster && (
                                <img
                                    src={film.poster}
                                    alt="Poster"
                                    className="mt-3 w-24 h-32 object-cover rounded-xl"
                                />
                            )}
                                                    
                        </div>
                                                
                        <div>
                                                        
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Banner Film
                                                            
                            </label>
                                                        
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData("banner", e.target.files[0])
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                            />
                                                        
                            {film?.banner && (
                                <img
                                    src={film.banner}
                                    alt="Banner"
                                    className="mt-3 w-full h-24 object-cover rounded-xl"
                                />
                            )}
                                                    
                        </div>
                                            
                    </div>
                                    
                </div>
                                
                {/* ==================== CAST MEMBERS ==================== */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Pemain (Cast)
                        </h3>
                        <button
                            type="button"
                            onClick={addCast}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF751F] text-white rounded-xl text-sm hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4" /> Tambah Cast
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.casts.map((cast, index) => (
                            <div
                                key={index}
                                className="p-5 border border-gray-200 rounded-xl"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Nama Pemain */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Pemain *
                                        </label>
                                        <input
                                            type="text"
                                            value={cast.name || ""}
                                            onChange={(e) =>
                                                updateCast(
                                                    index,
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                            required
                                        />
                                    </div>

                                    {/* Peran */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Peran
                                        </label>
                                        <input
                                            type="text"
                                            value={cast.role || ""}
                                            onChange={(e) =>
                                                updateCast(
                                                    index,
                                                    "role",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        />
                                    </div>

                                    {/* Foto Cast + Preview */}
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto Cast
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    updateCast(
                                                        index,
                                                        "image",
                                                        e.target.files[0],
                                                    )
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                            />

                                            {/* PREVIEW GAMBAR LAMA / BARU */}
                                            {cast.image && (
                                                <div className="mt-3">
                                                    <img
                                                        src={
                                                            typeof cast.image ===
                                                            "string"
                                                                ? cast.image
                                                                : URL.createObjectURL(
                                                                      cast.image,
                                                                  )
                                                        }
                                                        alt="Preview Cast"
                                                        className="w-20 h-20 object-cover rounded-xl shadow-sm border"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Tombol Hapus Cast */}
                                        <button
                                            type="button"
                                            onClick={() => removeCast(index)}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl self-end"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.casts.length === 0 && (
                            <p className="text-center text-gray-500 py-8">
                                Belum ada cast. Klik "Tambah Cast".
                            </p>
                        )}
                    </div>
                </div>
                {/* ==================== EPISODES (DITAMBAHKAN FIELD DURATION) ==================== */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Episode
                        </h3>
                        <button
                            type="button"
                            onClick={addEpisode}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF751F] text-white rounded-xl text-sm hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4" /> Tambah Episode
                        </button>
                    </div>

                    <div className="space-y-6">
                        {data.episodes.map((episode, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-2xl p-5"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">
                                        Episode {episode.number}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => removeEpisode(index)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Nomor Episode */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Episode
                                        </label>
                                        <input
                                            type="number"
                                            value={episode.number}
                                            onChange={(e) =>
                                                updateEpisode(
                                                    index,
                                                    "number",
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        />
                                    </div>

                                    {/* Duration (FIELD BARU) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={episode.duration || ""}
                                            onChange={(e) =>
                                                updateEpisode(
                                                    index,
                                                    "duration",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="125:00"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        />
                                    </div>

                                    {/* Judul Episode */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Judul Episode
                                        </label>
                                        <input
                                            type="text"
                                            value={episode.title}
                                            onChange={(e) =>
                                                updateEpisode(
                                                    index,
                                                    "title",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                </div>
                                {/* Platforms */}
                                                                                                
                                                                
                                <div className="mt-6">
                                                                                                            
                                                                        
                                    <div className="flex justify-between mb-3">
                                                                                                                        
                                                                                
                                        <label className="text-sm font-medium text-gray-700">
                                                                                        Platform
                                            Streaming
                                                                                    
                                        </label>
                                                                                                                        
                                                                                
                                        <button
                                            type="button"
                                            onClick={() => addPlatform(index)}
                                            className="text-[#FF751F] text-sm font-medium"
                                        >
                                                                                                                                    +
                                                                                        Tambah
                                            Platform
                                                                                                                                
                                                                                    
                                        </button>
                                                                                                                    
                                                                            
                                    </div>
                                                                                                            
                                                                        
                                    {episode.platforms?.map(
                                        (platform, pIndex) => (
                                            <div
                                                key={pIndex}
                                                className="flex gap-3 mb-3"
                                            >
                                                                                                                                            
                                                                                                
                                                <input
                                                    type="text"
                                                    placeholder="Nama Platform"
                                                    value={
                                                        platform.platform_name
                                                    }
                                                    onChange={(e) =>
                                                        updatePlatform(
                                                            index,
                                                            pIndex,
                                                            "platform_name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                                                />
                                                                                                                                            
                                                                                                
                                                <input
                                                    type="url"
                                                    placeholder="URL"
                                                    value={platform.url}
                                                    onChange={(e) =>
                                                        updatePlatform(
                                                            index,
                                                            pIndex,
                                                            "url",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                                                />
                                                                                                                                            
                                                                                                
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePlatform(
                                                            index,
                                                            pIndex,
                                                        )
                                                    }
                                                    className="px-4 text-red-500 hover:bg-red-50 rounded-xl"
                                                >
                                                                                                                                                        
                                                                                                        
                                                    <Trash2 className="w-5 h-5" />
                                                                                                                                                    
                                                                                                    
                                                </button>
                                                                                                                                        
                                                                                            
                                            </div>
                                        ),
                                    )}
                                                                                                        
                                                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Action Buttons tetap sama */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.get(route("admin.films.index"))}
                        className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-8 py-3 bg-[#FF751F] text-white rounded-2xl hover:bg-orange-600 font-medium disabled:opacity-70"
                    >
                        <Save className="w-5 h-5" />
                        {isEdit ? "Update Film" : "Simpan Film"}
                    </button>
                </div>
            </form>
        </div>
    );
}
