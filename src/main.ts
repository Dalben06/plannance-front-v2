import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import PrimeVue from 'primevue/config';

const presets: Record<string, object> = { Aura, Lara, Nora };
const selectedPreset = presets[import.meta.env.VITE_THEME_PRESET] ?? Lara;
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { createPinia } from 'pinia';

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
app.use(createPinia());
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
