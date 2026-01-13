import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#3b82f6',
            secondary: '#60a5fa',
            cta: '#F97316',
            success: '#22c55e',
            warning: '#fcd34d',
            error: '#ef4444',
            background: '#F8FAFC',
            surface: '#ffffff',
            'on-primary': '#ffffff',
            'on-cta': '#ffffff',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#60a5fa',
            secondary: '#93c5fd',
            cta: '#fb923c',
            success: '#4ade80',
            warning: '#fde047',
            error: '#f87171',
            background: '#0f172a',
            surface: '#1e293b',
            'on-primary': '#0f172a',
            'on-cta': '#0f172a',
            'on-surface': '#f1f5f9',
            'on-background': '#f1f5f9',
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
