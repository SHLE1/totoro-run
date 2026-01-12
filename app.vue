<script setup lang="ts">
import { onMounted } from 'vue';

const appConfig = useAppConfig();

useHead({
  title: '龙猫!启动!',
  link: [
    {
      rel: 'icon',
      href: '/机器猫-16x16.ico',
      sizes: '16x16',
      type: 'image/x-icon',
    },
    {
      rel: 'icon',
      href: '/机器猫-32x32.ico',
      sizes: '32x32',
      type: 'image/x-icon',
    },
    {
      rel: 'icon',
      href: '/机器猫-64x64.ico',
      sizes: '64x64',
      type: 'image/x-icon',
    },
    // 你可以添加更多的图标链接
  ],
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
<script lang="ts">
window.global = window;
</script>


<template>
  <VApp>
    <VAppBar class="custom-app-bar" elevation="0" :height="64">
      <VAppBarTitle class="app-title">
        <span style="color: #1e3a5f !important;">让每个人都能感受到科技的乐趣</span>
      </VAppBarTitle>
      <VSpacer></VSpacer>
      <VBtn href="https://github.com/SHLE1/totoro-run" target="_blank" class="chat-btn" color="transparent">
        <VAvatar size="32" class="mr-2 rounded-lg">
          <VImg
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            alt="Github" class="rounded-lg" />
        </VAvatar>
        <span class="chat-text">Github</span>
      </VBtn>
    </VAppBar>
    <VMain>
      <div class="p-4">
        <NuxtPage />
        <p class="mt-4 text-xs">
          Powered by Hypered1
        </p>
      </div>
    </VMain>
  </VApp>
</template>

<style scoped>
.custom-app-bar {
  background: #3b82f6;
}

.app-title {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  margin-left: 16px;
}

:deep(.app-title .v-toolbar-title__placeholder) {
  color: #fff !important;
}

.chat-btn {
  margin-right: 16px;
  border-radius: 8px;
  padding: 6px 12px;
}

.chat-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-text {
  color: white;
  font-weight: 500;
  margin-left: 4px;
}

.rounded-lg {
  border-radius: 8px !important;
}
</style>