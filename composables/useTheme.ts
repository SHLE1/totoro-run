import { useTheme as useVuetifyTheme } from 'vuetify';

export function useAppTheme() {
  const vuetifyTheme = useVuetifyTheme();
  const isDark = computed(() => vuetifyTheme.global.current.value.dark);

  const toggleTheme = () => {
    vuetifyTheme.global.name.value = isDark.value ? 'light' : 'dark';
    if (import.meta.client) {
      localStorage.setItem('theme', vuetifyTheme.global.name.value);
    }
  };

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        vuetifyTheme.global.name.value = savedTheme;
      }
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        vuetifyTheme.global.name.value = 'dark';
      }
    }
  };

  return {
    isDark,
    toggleTheme,
    initTheme,
    themeName: computed(() => vuetifyTheme.global.name.value),
  };
}
