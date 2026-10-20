import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

export default defineNuxtPlugin(() => {
  if (import.meta.dev) {
    return;
  }
  inject();
  injectSpeedInsights();
});
