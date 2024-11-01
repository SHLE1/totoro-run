// plugins/vercel-analytics.client.ts
import { inject } from '@vercel/analytics';

export default defineNuxtPlugin(() => {
    inject();
});