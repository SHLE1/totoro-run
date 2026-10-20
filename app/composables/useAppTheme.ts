const THEME_KEY = 'theme';

type ThemeName = 'light' | 'dark';

export function useAppTheme() {
  const theme = useState<ThemeName>('app-theme', () => 'light');

  const applyTheme = (value: ThemeName) => {
    theme.value = value;
    if (import.meta.client) {
      document.documentElement.dataset.theme = value;
      localStorage.setItem(THEME_KEY, value);
    }
  };

  const initTheme = () => {
    if (!import.meta.client) {
      return;
    }
    const saved = localStorage.getItem(THEME_KEY) as ThemeName | null;
    const preferred: ThemeName = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    applyTheme(saved === 'dark' || saved === 'light' ? saved : preferred);
  };

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  return {
    theme: readonly(theme),
    isDark: computed(() => theme.value === 'dark'),
    initTheme,
    toggleTheme,
  };
}
