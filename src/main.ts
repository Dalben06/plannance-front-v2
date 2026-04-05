import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { updatePreset, updateSurfacePalette } from '@primeuix/themes';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { findSurface, getPrimaryPresetExtension, resolveThemePreset } from '@/layout/utils/theme';
import { createPinia } from 'pinia';

const selectedPreset = resolveThemePreset(import.meta.env.VITE_THEME_PRESET);
const selectedSurface = findSurface(import.meta.env.VITE_THEME_SURFACE);

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: selectedPreset,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
updatePreset(getPrimaryPresetExtension(import.meta.env.VITE_THEME_PRIMARY));

if (selectedSurface) {
    updateSurfacePalette(selectedSurface.palette);
}

app.use(createPinia());
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
