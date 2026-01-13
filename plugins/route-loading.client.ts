export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = useState('route-loading', () => true);
  const minDurationMs = 450;
  let startAt = Date.now();
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const showLoading = () => {
    startAt = Date.now();
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    isLoading.value = true;
  };

  const hideLoading = () => {
    const elapsed = Date.now() - startAt;
    const remaining = Math.max(minDurationMs - elapsed, 0);
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    hideTimer = setTimeout(() => {
      isLoading.value = false;
      hideTimer = null;
    }, remaining);
  };

  nuxtApp.hook('page:start', () => {
    showLoading();
  });

  nuxtApp.hook('page:finish', () => {
    hideLoading();
  });

  nuxtApp.hook('app:mounted', () => {
    hideLoading();
  });
});
