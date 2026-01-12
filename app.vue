<script setup lang="ts">
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
  ],
});
</script>
<script lang="ts">
window.global = window;
</script>


<template>
  <VApp>
    <VAppBar class="custom-app-bar" elevation="0" :height="56">
      <VAppBarTitle class="app-title">
        <span>让每个人都能感受到科技的乐趣</span>
      </VAppBarTitle>
      <VSpacer></VSpacer>
      <div class="header-links">
        <a href="https://github.com/SHLE1/totoro-run" target="_blank" class="header-link">
          <span class="mdi mdi-github"></span> GitHub
        </a>
        <span class="link-divider">|</span>
        <a href="https://nuaaguide.online/" target="_blank" class="header-link">
          <span class="mdi mdi-school"></span> 校友项目
        </a>
      </div>
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
  background: #ffffff !important;
  border-bottom: 2px solid #3b82f6;
}

.app-title {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.app-title .v-toolbar-title__placeholder) {
  color: #1e3a5f !important;
}

.header-links {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 16px;
}

.header-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.header-link:hover {
  color: #3b82f6;
}

.link-divider {
  color: #cbd5e1;
}
</style>

<style>
/* 全局字体平滑设置，统一 Chrome 和 Safari 的渲染效果 */
*, *::before, *::after {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>