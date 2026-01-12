import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

export default defineNuxtPlugin(() => {
  inject();
  injectSpeedInsights();
});
