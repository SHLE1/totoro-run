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
            primary: '#2e9ff0',
            secondary: '#8ed2fa',
            cta: '#2e9ff0',
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
            primary: '#6bbef6',
            secondary: '#bee7fd',
            cta: '#6bbef6',
            success: '#4ade80',
            warning: '#fde047',
            error: '#f87171',
            background: '#0f172a',
            surface: '#1e293b',
            'on-primary': '#ffffff',
            'on-cta': '#ffffff',
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
