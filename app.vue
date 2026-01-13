<script setup lang="ts">
const { isDark, toggleTheme, initTheme } = useAppTheme();
const isRouteLoading = useState<boolean>('route-loading', () => true);

onMounted(() => {
  initTheme();
});

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
    <LoadingOverlay :active="isRouteLoading" />
    <VAppBar class="custom-app-bar" elevation="0" role="banner">
      <div class="app-bar-content">
        <VAppBarTitle class="app-title">
          <span>让每个人都能感受到科技的乐趣</span>
        </VAppBarTitle>
        <nav class="header-links" aria-label="外部链接">
          <button
            class="theme-toggle"
            :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
          >
            <span class="mdi" :class="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" aria-hidden="true"></span>
          </button>
          <a
            href="https://github.com/SHLE1/totoro-run"
            target="_blank"
            rel="noopener noreferrer"
            class="header-link"
            aria-label="在 GitHub 上查看源代码"
          >
            <span class="mdi mdi-github" aria-hidden="true"></span> GitHub
          </a>
          <span class="link-divider" aria-hidden="true">|</span>
          <a
            href="https://nuaaguide.online/"
            target="_blank"
            rel="noopener noreferrer"
            class="header-link"
            aria-label="访问校友项目网站"
          >
            <span class="mdi mdi-school" aria-hidden="true"></span> 校友项目
          </a>
        </nav>
      </div>
    </VAppBar>
    <VMain role="main">
      <div class="p-4">
        <NuxtPage />
        <p class="mt-4 text-xs footer-text">
          Powered by Hypered1
        </p>
      </div>
    </VMain>
  </VApp>
</template>

<style scoped>
.custom-app-bar {
  background: rgb(var(--v-theme-surface)) !important;
  border-bottom: 1px solid var(--ui-border);
  height: auto !important;
  min-height: 56px;
}

.app-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
}

.app-title {
  font-family: var(--ui-font-sans);
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.app-title .v-toolbar-title__placeholder) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.header-links {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.theme-toggle:hover {
  background: rgba(59, 130, 246, 0.12);
  color: rgb(var(--ui-primary));
}

.theme-toggle:focus-visible {
  outline: 2px solid rgb(var(--ui-primary));
  outline-offset: 2px;
}

.header-link {
  color: var(--ui-text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.header-link:hover {
  color: rgb(var(--ui-primary));
}

.header-link:focus-visible {
  outline: 2px solid rgb(var(--ui-primary));
  outline-offset: 2px;
  border-radius: 4px;
}

.link-divider {
  color: var(--ui-border);
}

.footer-text {
  color: var(--ui-text-muted);
}

@media (max-width: 480px) {
  .app-bar-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 16px 18px;
  }

  .app-title {
    font-size: 0.9rem;
  }

  :deep(.app-title .v-toolbar-title__placeholder) {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  .header-links {
    width: 100%;
    gap: 8px;
  }

  .link-divider {
    display: none;
  }
}
</style>

<style>
@import "public/fonts/noto-sans-sc/noto-sans-sc.css";

:root {
  --ui-primary: 59 130 246;
  --ui-primary-strong: 37 99 235;
  --ui-success: 34 197 94;
  --ui-warning: 245 158 11;
  --ui-danger: 239 68 68;
  --ui-surface: #ffffff;
  --ui-surface-muted: #f8fafc;
  --ui-surface-strong: #f1f5f9;
  --ui-text: #0f172a;
  --ui-text-muted: #64748b;
  --ui-text-subtle: #475569;
  --ui-border: #e2e8f0;
  --ui-divider: #e2e8f0;
  --ui-shadow-card: 0 6px 24px rgba(15, 23, 42, 0.08);
  --ui-shadow-soft: 0 2px 12px rgba(15, 23, 42, 0.06);
  --ui-radius-xl: 20px;
  --ui-radius-lg: 16px;
  --ui-radius-md: 12px;
  --ui-radius-sm: 10px;
  --ui-radius-pill: 999px;
  --ui-btn-height: 48px;
  --ui-btn-height-sm: 44px;
  --ui-ring: 0 0 0 2px rgba(59, 130, 246, 0.35);
  --ui-font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Source Han Sans SC',
    'Noto Sans CJK SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.v-theme--dark {
  --ui-surface: #0f172a;
  --ui-surface-muted: #111827;
  --ui-surface-strong: #1e293b;
  --ui-text: #f1f5f9;
  --ui-text-muted: #94a3b8;
  --ui-text-subtle: #cbd5e1;
  --ui-border: #334155;
  --ui-divider: #334155;
  --ui-shadow-card: 0 6px 24px rgba(0, 0, 0, 0.4);
  --ui-shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.ui-btn {
  height: var(--ui-btn-height);
  border-radius: calc(var(--ui-btn-height) / 2);
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.ui-btn--sm {
  height: var(--ui-btn-height-sm);
  border-radius: calc(var(--ui-btn-height-sm) / 2);
}

.ui-muted {
  color: var(--ui-text-muted);
}

body,
.v-application {
  font-family: var(--ui-font-sans);
  font-weight: 400;
}

button,
input,
textarea {
  font-family: inherit;
}

/* 全局字体平滑设置，统一 Chrome 和 Safari 的渲染效果 */
*, *::before, *::after {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 尊重用户动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 全局焦点样式 */
:focus-visible {
  outline: 2px solid rgb(var(--ui-primary));
  outline-offset: 2px;
}

/* 移动端优化 */
html, body {
  overscroll-behavior: contain;
  -webkit-tap-highlight-color: transparent;
}

/* iOS Safari 安全区域适配 */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 防止 iOS 双击缩放 */
button, a, input, select, textarea {
  touch-action: manipulation;
}

/* 深色模式下的全局调整 */
.v-theme--dark {
  --v-border-color: rgba(255, 255, 255, 0.12);
}

.v-theme--dark .theme-toggle {
  color: #94a3b8;
}

.v-theme--dark .theme-toggle:hover {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.v-theme--dark .header-link {
  color: #94a3b8;
}

.v-theme--dark .link-divider {
  color: #475569;
}
</style>
