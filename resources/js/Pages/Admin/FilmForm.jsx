import React, { useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from "lucide-react";
import { useForm, router } from "@inertiajs/react";

export default function FilmForm({ film = null, mode = "create" }) {
    const isEdit = mode === "edit";

    const { data, setData, processing, errors, reset } = useForm({
        title: "",
        description: "",
        genres: "",
        rating: "",
        year: "",
        poster: null,
        banner: null,
        is_featured: false,
        casts: [],
        episodes: [],
        platforms: [],
    });

    // Sync data saat Edit
    useEffect(() => {
        if (film) {
            setData({
                title: film.title || "",
                description: film.description || "",
                genres: film.genres || "",
                rating: film.rating || "",
                year: film.year || "",
                poster: null,
                banner: null,
                is_featured: !!film.is_featured,
                casts: film.casts || [],
                episodes: film.episodes || [],
                platforms: film.platforms || [],
            });
        }
    }, [film]);

    // ==================== CLIENT-SIDE FILE SIZE VALIDATION ====================
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
    const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60 MB (siap untuk future video)

    const validateFileSize = (file, type = "image") => {
        if (!file) return true;
        const maxSize = type === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
        if (file.size > maxSize) {
            alert(
                `Ukuran file terlalu besar!\n\nMaksimal ${type === "image" ? "10 MB" : "60 MB"} untuk ${type}.`,
            );
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side check dulu (untuk UX lebih cepat)
        if (data.poster && !validateFileSize(data.poster, "image")) return;
        if (data.banner && !validateFileSize(data.banner, "image")) return;

        // Cek semua cast image
        for (let i = 0; i < data.casts.length; i++) {
            if (
                data.casts[i].image instanceof File &&
                !validateFileSize(data.casts[i].image, "image")
            ) {
                return;
            }
        }

        const formData = new FormData();

        formData.append("title", data.title || "");
        formData.append("description", data.description || "");
        formData.append("genres", data.genres || "");
        formData.append("rating", data.rating || "");
        formData.append("year", data.year || "");
        formData.append("is_featured", data.is_featured ? "1" : "0");

        if (data.poster) formData.append("poster", data.poster);
        if (data.banner) formData.append("banner", data.banner);

        // Casts
        data.casts.forEach((cast, index) => {
            formData.append(`casts[${index}][name]`, cast.name || "");
            formData.append(`casts[${index}][role]`, cast.role || "");

            if (cast.image instanceof File) {
                formData.append(`casts[${index}][image]`, cast.image);
            } else if (cast.image_path) {
                // ← PERBAIKAN: kirim path gambar lama agar tidak terhapus
                formData.append(`casts[${index}][image_path]`, cast.image_path);
            }
        });

        // Episodes & Platforms
        formData.append("episodes", JSON.stringify(data.episodes || []));

        data.platforms.forEach((platform, index) => {
            formData.append(
                `platforms[${index}][platform_name]`,
                platform.platform_name || "",
            );
            formData.append(`platforms[${index}][url]`, platform.url || "");
        });

        const options = {
            // 🔥 REDIRECT OTOMATIS KE HALAMAN LIST PERFILMAN setelah berhasil
            onSuccess: () => {
                reset(); // bersihkan form
                router.get(route("admin.films.index"));
            },
            onError: (err) => {
                console.error("Submit error:", err);
            },
        };

        if (isEdit) {
            formData.append("_method", "PUT");
            router.post(
                route("admin.films.update", film.id),
                formData,
                options,
            );
        } else {
            router.post(route("admin.films.store"), formData, options);
        }
    };

    // ==================== CAST HANDLERS (tetap sama) ====================
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

    // ==================== EPISODE & PLATFORM HANDLERS (tetap sama) ====================
    const addEpisode = () => {
        setData("episodes", [
            ...data.episodes,
            { number: data.episodes.length + 1, title: "", duration: "" },
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

    const addPlatform = () =>
        setData("platforms", [
            ...data.platforms,
            { platform_name: "", url: "" },
        ]);
    const removePlatform = (index) =>
        setData(
            "platforms",
            data.platforms.filter((_, i) => i !== index),
        );
    const updatePlatform = (index, field, value) => {
        const updated = [...data.platforms];
        updated[index] = { ...updated[index], [field]: value };
        setData("platforms", updated);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => router.get(route("admin.films.index"))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEdit ? "Edit Film" : "Tambah Film Baru"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ==================== GLOBAL ERROR MESSAGE ==================== */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-red-800">
                                Ada kesalahan dalam pengisian data:
                            </p>
                            <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                                {Object.entries(errors).map(([key, msg]) => (
                                    <li key={key}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
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
                                Tandai sebagai Film Unggulan
                            </span>
                        </div>

                        {/* Poster */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Poster Film{" "}
                                <span className="text-xs text-gray-500">
                                    (max 10 MB)
                                </span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData("poster", e.target.files[0])
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                            />
                            {errors.poster && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.poster}
                                </p>
                            )}
                            {film?.poster && (
                                <img
                                    src={film.poster}
                                    alt="Poster"
                                    className="mt-3 w-24 h-32 object-cover rounded-xl"
                                />
                            )}
                        </div>

                        {/* Banner */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Film{" "}
                                <span className="text-xs text-gray-500">
                                    (max 10 MB)
                                </span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData("banner", e.target.files[0])
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                            />
                            {errors.banner && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.banner}
                                </p>
                            )}
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
                {/* CAST MEMBERS */}
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
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Episode
                        </h3>
                        <button
                            type="button"
                            onClick={addEpisode}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF751F] text-white rounded-xl text-sm hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4" /> Tambah Episode
                        </button>
                    </div>

                    <div className="space-y-8">
                        {data.episodes.map((episode, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-5">
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        Episode {episode.number}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => removeEpisode(index)}
                                        className="text-red-500 hover:text-red-600 p-2 rounded-xl hover:bg-red-50"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-2">
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
                                                    parseInt(e.target.value) ||
                                                        1,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
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
                                            placeholder="70:00"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                        />
                                    </div>
                                    <div className="md:col-span-7">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Judul Episode
                                        </label>
                                        <input
                                            type="text"
                                            value={episode.title || ""}
                                            onChange={(e) =>
                                                updateEpisode(
                                                    index,
                                                    "title",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* ==================== PLATFORM STREAMING (BARU - PER FILM) ==================== */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Platform Streaming
                        </h3>
                        <button
                            type="button"
                            onClick={addPlatform}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF751F] text-white rounded-xl text-sm hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4" /> Tambah Platform
                        </button>
                    </div>

                    <div className="space-y-3">
                        {data.platforms.length > 0 ? (
                            data.platforms.map((platform, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 items-center"
                                >
                                    <input
                                        type="text"
                                        placeholder="Nama Platform"
                                        value={platform.platform_name || ""}
                                        onChange={(e) =>
                                            updatePlatform(
                                                index,
                                                "platform_name",
                                                e.target.value,
                                            )
                                        }
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    />
                                    <input
                                        type="url"
                                        placeholder="https://www.netflix.com/..."
                                        value={platform.url || ""}
                                        onChange={(e) =>
                                            updatePlatform(
                                                index,
                                                "url",
                                                e.target.value,
                                            )
                                        }
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF751F]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePlatform(index)}
                                        className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="border border-dashed border-gray-300 rounded-xl py-8 text-center text-gray-400">
                                Belum ada platform streaming. Klik “Tambah
                                Platform”.
                            </div>
                        )}
                    </div>
                </div>
                {/* Action Buttons */}
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
