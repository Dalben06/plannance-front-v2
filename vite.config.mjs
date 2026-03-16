import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/test-setup.ts'],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@tests': fileURLToPath(new URL('./tests', import.meta.url))
            }
        },
        env: {
            VITE_API_BASE_URL: 'http://localhost:3000'
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            thresholds: {
                branches: 90,
                functions: 90,
                lines: 90,
                statements: 90
            }
        }
    }
});
