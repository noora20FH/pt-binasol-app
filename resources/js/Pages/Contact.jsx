import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { PrimaryButton } from '@/Components/Button';

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.send'), {
            onSuccess: () => {
                reset();
                alert('Pesan anda telah dikirim. Terima kasih telah menghubungi kami!');
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
            },
        });
    };

    return (
        <PublicLayout
            title="Kontak"
            description="Hubungi PT Bina Auto Solusi untuk pertanyaan atau informasi lebih lanjut"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
                    <p className="text-lg">
                        Kami ingin mendengar dari Anda
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-primary-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                            Telepon
                                        </h3>
                                        <a
                                            href="tel:+621234567890"
                                            className="text-secondary-600 hover:text-primary-600 transition"
                                        >
                                            +62 123 456 7890
                                        </a>
                                        <p className="text-secondary-500 text-sm mt-1">
                                            Senin - Jumat: 09:00 - 17:00
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-primary-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                            Email
                                        </h3>
                                        <a
                                            href="mailto:info@binaauto.com"
                                            className="text-secondary-600 hover:text-primary-600 transition block"
                                        >
                                            info@binaauto.com
                                        </a>
                                        <a
                                            href="mailto:support@binaauto.com"
                                            className="text-secondary-600 hover:text-primary-600 transition"
                                        >
                                            support@binaauto.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-primary-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                            Alamat
                                        </h3>
                                        <p className="text-secondary-600">
                                            Jl. Industri No. 123<br />
                                            Jakarta 12345<br />
                                            Indonesia
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-primary-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                            Jam Operasional
                                        </h3>
                                        <p className="text-secondary-600 text-sm">
                                            Senin - Jumat: 09:00 - 17:00<br />
                                            Sabtu: 09:00 - 13:00<br />
                                            Minggu: Tutup
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                                    Kirim Pesan
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Nama Anda
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            required
                                            disabled={processing}
                                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                                            placeholder="Masukkan nama Anda"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                            required
                                            disabled={processing}
                                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                                            placeholder="Masukkan email Anda"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        disabled={processing}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                                        placeholder="Masukkan nomor telepon Anda"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Subjek
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={data.subject}
                                        onChange={handleChange}
                                        required
                                        disabled={processing}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                                        placeholder="Masukkan subjek pesan"
                                    />
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Pesan
                                    </label>
                                    <textarea
                                        name="message"
                                        value={data.message}
                                        onChange={handleChange}
                                        required
                                        disabled={processing}
                                        rows="5"
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none disabled:bg-secondary-100"
                                        placeholder="Tuliskan pesan Anda di sini"
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%',
                                        padding: '14px 24px',
                                        backgroundColor: processing ? '#ea580c80' : '#ea580c',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseEnter={(e) => !processing && (e.target.style.backgroundColor = '#c2410c')}
                                    onMouseLeave={(e) => !processing && (e.target.style.backgroundColor = '#ea580c')}
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-96 bg-secondary-100">
                <iframe
                    title="Lokasi PT Bina Auto Solusi"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3287024681783!2d106.81666722346895!3d-6.175391360679395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sJl.%20Industri%20No.%20123!2sJakarta%2C%20Indonesia!5e0!3m2!1sid!2sid!4v1234567890"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>
        </PublicLayout>
    );
}
