<script setup lang="ts">
import decryptRequestContent from '~/src/utils/decryptRequestContent';
import encryptRequestContent from '~/src/utils/encryptRequestContent';
import { onMounted } from 'vue';

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

onMounted(() => {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-KEFCFSXRWJ';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-KEFCFSXRWJ');
  `;
  document.head.appendChild(script2);
});
</script>
<template>
  <VTextarea v-model="encoded" variant="outlined" />
  <div class="pre-wrap">
    {{ JSON.stringify(decoded, null, 2) }}
    {{ encrypted }}
  </div>
</template>