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
  background: rgba(46, 159, 240, 0.12);
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap');

:root {
  /* 主色调 - 哆啦A梦蓝（轻盈清爽） */
  --ui-primary: 46 159 240;
  --ui-primary-light: 107 190 246;
  --ui-primary-strong: 30 131 214;

  /* 辅助色 - 浅蓝（层级区分） */
  --ui-secondary: 142 210 250;
  --ui-secondary-light: 190 231 253;

  /* 功能色 */
  --ui-success: 22 163 74;
  --ui-warning: 245 158 11;
  --ui-danger: 239 68 68;

  /* 背景色 */
  --ui-surface: #ffffff;
  --ui-surface-muted: #f8fafc;
  --ui-surface-strong: #f1f5f9;

  /* 文字色 */
  --ui-text: #1e293b;
  --ui-text-muted: #64748b;
  --ui-text-subtle: #475569;

  /* 边框和分割线 */
  --ui-border: #e2e8f0;
  --ui-divider: #e2e8f0;

  /* 阴影（扁平化设计，减少使用） */
  --ui-shadow-card: 0 1px 3px rgba(15, 23, 42, 0.08);
  --ui-shadow-soft: 0 1px 2px rgba(15, 23, 42, 0.05);

  /* 圆角 */
  --ui-radius-xl: 16px;
  --ui-radius-lg: 12px;
  --ui-radius-md: 8px;
  --ui-radius-sm: 6px;
  --ui-radius-pill: 999px;

  /* 按钮尺寸（移动端友好） */
  --ui-btn-height: 48px;
  --ui-btn-height-sm: 44px;

  /* 焦点环 */
  --ui-ring: 0 0 0 2px rgba(46, 159, 240, 0.35);

  /* 字体系统 */
  --ui-font-heading: 'Outfit', 'Noto Sans SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  --ui-font-body: 'Work Sans', 'Noto Sans SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  --ui-font-sans: 'Work Sans', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Source Han Sans SC',
    'Noto Sans CJK SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* 过渡时长（扁平化设计） */
  --ui-transition-fast: 150ms;
  --ui-transition-normal: 200ms;
  --ui-transition-slow: 300ms;
}

.v-theme--dark {
  /* 深色模式背景 */
  --ui-surface: #0f172a;
  --ui-surface-muted: #111827;
  --ui-surface-strong: #1e293b;

  /* 深色模式文字 */
  --ui-text: #f1f5f9;
  --ui-text-muted: #94a3b8;
  --ui-text-subtle: #cbd5e1;

  /* 深色模式边框 */
  --ui-border: #334155;
  --ui-divider: #334155;

  /* 深色模式阴影（扁平化设计，减少使用） */
  --ui-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3);
  --ui-shadow-soft: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.ui-btn {
  height: var(--ui-btn-height);
  border-radius: var(--ui-radius-lg);
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.2px;
  font-family: var(--ui-font-body);
  transition: all var(--ui-transition-fast) ease-out;
  cursor: pointer;
  border: none;
  padding: 0 24px;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 44px;
  touch-action: manipulation;
}

.ui-btn--sm {
  height: var(--ui-btn-height-sm);
  border-radius: var(--ui-radius-md);
  padding: 0 20px;
  font-size: 0.9375rem;
}

.ui-btn:active {
  transform: scale(0.98);
}

.ui-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 主按钮 - 活力橙 */
.ui-btn--primary {
  background: rgb(var(--ui-primary));
  color: white;
}

.ui-btn--primary:hover:not(:disabled) {
  background: rgb(var(--ui-primary-strong));
}

/* 次要按钮 - 信任蓝 */
.ui-btn--secondary {
  background: rgb(var(--ui-secondary));
  color: white;
}

.ui-btn--secondary:hover:not(:disabled) {
  background: rgb(var(--ui-secondary-light));
}

/* 成功按钮 - 绿色 */
.ui-btn--success {
  background: rgb(var(--ui-success));
  color: white;
}

.ui-btn--success:hover:not(:disabled) {
  background: rgba(var(--ui-success), 0.9);
}

/* 轮廓按钮 */
.ui-btn--outline {
  background: transparent;
  border: 2px solid rgb(var(--ui-primary));
  color: rgb(var(--ui-primary));
}

.ui-btn--outline:hover:not(:disabled) {
  background: rgba(var(--ui-primary), 0.1);
}

/* 文本按钮 */
.ui-btn--text {
  background: transparent;
  color: var(--ui-text-muted);
  padding: 0 16px;
}

.ui-btn--text:hover:not(:disabled) {
  color: var(--ui-text);
  background: var(--ui-surface-muted);
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
  background: rgba(107, 190, 246, 0.15);
  color: rgb(var(--ui-primary-light));
}

.v-theme--dark .header-link {
  color: #94a3b8;
}

.v-theme--dark .link-divider {
  color: #475569;
}

/* Vuetify 下拉菜单优化 - 扁平化现代设计 */
.v-overlay__content {
  border-radius: var(--ui-radius-lg) !important;
  overflow: hidden;
}

.v-overlay__content .v-list {
  padding: 6px !important;
  background: var(--ui-surface) !important;
  border: 2px solid var(--ui-border) !important;
  border-radius: var(--ui-radius-lg) !important;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.1) !important;
}

.v-list-item {
  border-radius: var(--ui-radius-md) !important;
  margin: 2px 0 !important;
  min-height: 48px !important;
  padding: 12px 16px !important;
  font-family: var(--ui-font-body) !important;
  transition: all var(--ui-transition-fast) ease-out !important;
  cursor: pointer !important;
}

.v-list-item:hover {
  background: rgba(var(--ui-primary), 0.1) !important;
}

.v-list-item--active {
  background: rgba(var(--ui-primary), 0.15) !important;
  color: rgb(var(--ui-primary)) !important;
  font-weight: 600 !important;
}

.v-list-item__content {
  font-size: 0.9375rem !important;
  font-weight: 500 !important;
}

.v-list-item-title {
  font-family: var(--ui-font-body) !important;
  color: var(--ui-text) !important;
}

.v-list-item--active .v-list-item-title {
  color: rgb(var(--ui-primary)) !important;
}

/* 深色模式下的下拉菜单 */
.v-theme--dark .v-overlay__content .v-list {
  background: var(--ui-surface-strong) !important;
  border-color: var(--ui-border) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
}

.v-theme--dark .v-list-item-title {
  color: var(--ui-text) !important;
}

</style>
