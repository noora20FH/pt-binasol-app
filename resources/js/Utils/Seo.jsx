import React from 'react';
import { Head } from '@inertiajs/react';

export const useSeo = ({ title, description, canonical, ogImage, ogType = 'website', twitter }) => {
    const siteName = 'PT Bina Auto Solusi';
    const fullTitle = title ? `${title} - ${siteName}` : siteName;
    const defaultDescription = 'PT Bina Auto Solusi - Penyedia solusi terbaik untuk sektor konstruksi dan ritel dengan inovasi dan kualitas.';
    const finalDescription = description || defaultDescription;
    const defaultImage = 'https://your-domain.com/og-image.jpg';
    const finalImage = ogImage || defaultImage;
    const domain = 'https://your-domain.com';
    const finalCanonical = canonical ? `${domain}${canonical}` : undefined;

    return {
        title: fullTitle,
        description: finalDescription,
        image: finalImage,
        canonical: finalCanonical,
        twitter: twitter || {
            card: 'summary_large_image',
            site: '@binaauto',
            creator: '@binaauto',
        },
        og: {
            type: ogType,
            title: fullTitle,
            description: finalDescription,
            image: finalImage,
            url: finalCanonical,
            siteName,
        },
    };
};

export const SeoHead = ({ title, description, canonical, ogImage, ogType, twitter, children }) => {
    const seo = useSeo({ title, description, canonical, ogImage, ogType, twitter });

    return (
        <Head>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#f97316" />
            <meta name="language" content="Indonesian" />

            {/* Open Graph */}
            <meta property="og:type" content={seo.og.type} />
            <meta property="og:title" content={seo.og.title} />
            <meta property="og:description" content={seo.og.description} />
            <meta property="og:image" content={seo.og.image} />
            {seo.og.url && <meta property="og:url" content={seo.og.url} />}
            <meta property="og:site_name" content={seo.og.siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content={seo.twitter.card} />
            <meta name="twitter:site" content={seo.twitter.site} />
            <meta name="twitter:creator" content={seo.twitter.creator} />
            <meta name="twitter:title" content={seo.og.title} />
            <meta name="twitter:description" content={seo.og.description} />
            <meta name="twitter:image" content={seo.og.image} />

            {/* Canonical */}
            {seo.canonical && <link rel="canonical" href={seo.canonical} />}

            {/* Additional SEO Meta Tags */}
            <meta name="keywords" content="konstruksi, ritel, solusi, produk berkualitas, film, entertainment" />
            <meta name="author" content="PT Bina Auto Solusi" />
            <meta name="robots" content="index, follow" />
            <meta name="revisit-after" content="7 days" />

            {/* Schema.org Markup */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'PT Bina Auto Solusi',
                    url: 'https://your-domain.com',
                    logo: 'https://your-domain.com/logo.png',
                    description: 'PT Bina Auto Solusi - Penyedia solusi terbaik untuk sektor konstruksi dan ritel',
                    contactPoint: {
                        '@type': 'ContactPoint',
                        contactType: 'Customer Service',
                        telephone: '+62-123-456-7890',
                        email: 'info@binaauto.com',
                    },
                    sameAs: [
                        'https://www.facebook.com/binaauto',
                        'https://www.instagram.com/binaauto',
                        'https://www.twitter.com/binaauto',
                        'https://www.linkedin.com/company/bina-auto-solusi',
                    ],
                })}
            </script>

            {children}
        </Head>
    );
};

export default SeoHead;
