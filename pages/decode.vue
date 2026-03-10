<script setup lang="ts">
import decryptRequestContent from '~/src/utils/decryptRequestContent';
import encryptRequestContent from '~/src/utils/encryptRequestContent';

useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-KEFCFSXRWJ',
      async: true,
    },
    {
      innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KEFCFSXRWJ');`,
    },
  ],
});

const encoded = ref('');
const decoded = computed(() => {
  try {
    return decryptRequestContent(encoded.value);
  } catch (e) {
    console.error(e);
    return 'Failed';
  }
});
const encrypted = computed(() => {
  try {
    return encryptRequestContent(decoded.value === 'Failed' ? {} : decoded.value);
  } catch (e) {
    console.error(e);
    return 'Failed';
  }
});
</script>
<template>
  <div class="page-wrapper">
    <UiCard title="请求解码" icon="mdi mdi-code-json">
      <VTextarea v-model="encoded" variant="outlined" auto-grow rows="6" aria-label="输入加密请求内容" />
      <div class="result-block">
        <pre class="pre-wrap">{{ JSON.stringify(decoded, null, 2) }}</pre>
        <div class="encoded-again">{{ encrypted }}</div>
      </div>
    </UiCard>
  </div>
</template>

<style scoped>
.page-wrapper {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

.result-block {
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--ui-radius-md);
  background: var(--ui-surface-muted);
  border: 1px solid var(--ui-border);
  color: var(--ui-text);
  font-size: 0.85rem;
  display: grid;
  gap: 12px;
}

.encoded-again {
  color: var(--ui-text-muted);
  word-break: break-word;
}
</style>
