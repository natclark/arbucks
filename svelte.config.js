`use strict`;
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));

export default {
    extensions: [`.svelte`, ...mdsvexConfig.extensions],
    kit: {
        adapter: adapter({
            assets: `src/build`,
            fallback: null,
            pages: `src/build`,
        }),
        files: {
            assets: `static`,
            hooks: `src/hooks`,
            lib: `src/lib`,
            routes: `src/routes`,
            serviceWorker: `static/service-worker`,
            template: `src/app.html`,
        },
        floc: false,
        target: `body`,
        trailingSlash: `always`,
        vite: () => ({
            ssr: {
                noExternal: Object.keys(pkg.dependencies || {}).filter((pkgName) => pkgName.startsWith(`@smui`)),
            },
        }),
    },
    preprocess: [
        mdsvex(mdsvexConfig),
        preprocess({
            defaults: { style: `scss`, },
            postcss: { plugins: [autoprefixer()], },
            scss: { prependData: `@charset 'UTF-8';`, },
            sourceMap: false,
        }),
    ],
};
