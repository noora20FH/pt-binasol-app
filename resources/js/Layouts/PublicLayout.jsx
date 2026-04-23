import React from 'react';
import Navigation from '@/Components/Navigation';
import Footer from '@/Components/Footer';
import { Head } from '@inertiajs/react';

export default function PublicLayout({ children, title, description, meta }) {
    return (
        <>
            <Head>
                <title>{title ? `${title} - PT Bina Auto Solusi` : 'PT Bina Auto Solusi'}</title>
                {description && <meta name="description" content={description} />}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="f97316#" />
                {meta && Object.keys(meta).map((key) => (
                    <meta key={key} name={key} content={meta[key]} />
                ))}
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navigation />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}
