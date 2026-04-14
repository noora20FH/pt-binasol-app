import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
// 1. Ganti import dari vendor ke file yang baru kamu generate
import { route } from 'ziggy-js';
import { Ziggy } from './ziggy.js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup: ({ App, props }) => {
            // 2. Gunakan objek Ziggy yang diimport dari ./ziggy.js
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    ...Ziggy, // Tambahkan ini sebagai fallback
                    location: new URL(page.props.ziggy.location),
                });

            return <App {...props} />;
        },
    }),
);
