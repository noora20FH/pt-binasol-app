import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function About({ teamMembers }) {
    return (
        <PublicLayout
            title="Tentang Kami"
            description="Pelajari lebih lanjut tentang PT Bina Auto Solusi dan visi kami"
        >
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Tentang PT Bina Auto Solusi</h1>
                    <p className="text-xl">
                        Membangun Masa Depan Melalui Inovasi dan Kualitas
                    </p>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-secondary-900 mb-6">
                                Kisah Kami
                            </h2>
                            <p className="text-secondary-600 mb-4 leading-relaxed">
                                PT Bina Auto Solusi didirikan dengan visi untuk menjadi penyedia solusi terbaik
                                di sektor konstruksi dan ritel. Dengan pengalaman lebih dari satu dekade, kami
                                telah melayani ribuan klien yang puas di seluruh Indonesia.
                            </p>
                            <p className="text-secondary-600 mb-4 leading-relaxed">
                                Komitmen kami terhadap kualitas, inovasi, dan kepuasan pelanggan adalah nilai
                                inti yang mendorong setiap keputusan bisnis kami. Kami percaya bahwa kesuksesan
                                klien adalah kesuksesan kami juga.
                            </p>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                                alt="Tim PT Bina Auto Solusi"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-16 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-secondary-900 mb-12">
                        Misi, Visi & Nilai
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-primary-600 mb-4">Misi</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Menyediakan produk dan layanan berkualitas tinggi yang inovatif dan terjangkau
                                untuk memenuhi kebutuhan pasar konstruksi dan ritel di Indonesia.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-primary-600 mb-4">Visi</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Menjadi pemimpin industri yang dipercaya dan dikenal di seluruh Indonesia
                                sebagai penyedia solusi terpadu untuk sektor konstruksi dan ritel.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-primary-600 mb-4">Nilai</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Integritas, Inovasi, Kualitas, dan Kepuasan Pelanggan adalah nilai inti yang
                                memandu semua aspek bisnis kami.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            {teamMembers.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-secondary-900 mb-12">
                            Tim Kami
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                    {member.image && (
                                        <div className="h-48 bg-secondary-100">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 text-center">
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-primary-600 font-medium mb-3">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact CTA */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Hubungi Kami
                    </h2>
                    <p className="text-lg mb-8">
                        Kami siap membantu Anda dengan setiap pertanyaan atau kebutuhan bisnis
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                            <Phone className="w-8 h-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">Telepon</h4>
                            <a href="tel:+621234567890" className="hover:underline">
                                +62 123 456 7890
                            </a>
                        </div>
                        <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                            <Mail className="w-8 h-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">Email</h4>
                            <a href="mailto:info@binaauto.com" className="hover:underline">
                                info@binaauto.com
                            </a>
                        </div>
                        <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
                            <MapPin className="w-8 h-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">Alamat</h4>
                            <p>Jl. Industri No. 123, Jakarta</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
