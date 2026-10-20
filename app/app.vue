<script setup lang="ts">
const appConfig = useAppConfig();
const { isDark, initTheme, toggleTheme } = useAppTheme();
const route = useRoute();
const sessionStore = useSessionStore();

initTheme();

if (import.meta.dev && typeof route.query.fixture === 'string') {
  const { seedDevFixture } = await import('~/utils/fixtures');
  seedDevFixture(route.query.fixture);
}

useHead({
  title: '龙猫校园 · 阳光体育跑步助手',
  htmlAttrs: { lang: 'zh-CN' },
  link: [
    { rel: 'icon', href: '/机器猫-16x16.ico', sizes: '16x16', type: 'image/x-icon' },
    { rel: 'icon', href: '/机器猫-32x32.ico', sizes: '32x32', type: 'image/x-icon' },
  ],
});

const year = new Date().getFullYear();
</script>

<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link">跳到主要内容</a>

    <header class="site-head" role="banner">
      <div class="head-inner shell">
        <NuxtLink to="/" class="brand" aria-label="龙猫校园首页">
          <span class="brand-mark mono" aria-hidden="true">龙</span>
          <span class="brand-text">
            <strong>龙猫校园</strong>
          </span>
        </NuxtLink>

        <nav class="head-nav" aria-label="站点导航">
          <span class="free-flag">完全免费</span>
          <a
            class="nav-link"
            href="https://github.com/SHLE1/totoro-run"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="在 GitHub 上查看源代码"
          >
            <span class="i-mdi-github" aria-hidden="true" />
            <span class="nav-text">GitHub</span>
          </a>
          <a
            class="nav-link"
            href="https://nuaaguide.online/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问校友项目网站"
          >
            <span class="i-mdi-school" aria-hidden="true" />
            <span class="nav-text">校友项目</span>
          </a>
          <button
            class="theme-switch"
            type="button"
            :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
          >
            <span :class="isDark ? 'i-mdi-weather-sunny' : 'i-mdi-weather-night'" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>

    <main id="main-content" class="site-main">
      <NuxtPage />
    </main>

    <footer class="site-foot">
      <div class="foot-inner shell">
        <div class="foot-brand">
          <span class="mono">TOTORO</span>
          <span>v{{ appConfig.version }}</span>
        </div>
        <p class="foot-note">
          完全免费 · 开源项目
        </p>
        <div class="foot-links">
          <NuxtLink v-if="sessionStore.isLoggedIn" to="/scanned">
            继续上次的路线
          </NuxtLink>
          <span>© {{ year }} SHLE1</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
}

.site-head {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  border-bottom: 1.5px solid var(--line-strong);
  backdrop-filter: blur(8px);
}

.head-inner {
  display: flex;
  min-height: var(--head-height);
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  background: var(--ink);
  color: var(--paper);
  border-radius: var(--radius-sm);
  font-size: 1.1rem;
  font-weight: 700;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-text strong {
  font-size: 1rem;
  letter-spacing: 0.02em;
}

.brand-text small {
  color: var(--muted);
  font-size: 0.75rem;
}

.head-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.free-flag {
  padding: 4px 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--blue-strong);
  font-size: 0.75rem;
  font-weight: 600;
}

.nav-link,
.theme-switch {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink-2);
  font-size: 0.82rem;
  cursor: pointer;
}

.nav-link:hover,
.theme-switch:hover {
  background: var(--surface-2);
  color: var(--ink);
}

.nav-text {
  white-space: nowrap;
}

.site-main {
  flex: 1;
}

.site-foot {
  border-top: 1.5px solid var(--line);
  background: var(--surface);
}

.foot-inner {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--muted);
  font-size: 0.78rem;
}

.foot-brand,
.foot-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.foot-brand .mono {
  color: var(--ink);
  font-weight: 700;
  letter-spacing: 0.12em;
}

.foot-links a {
  color: var(--blue-strong);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 720px) {
  :root {
    --head-height: 60px;
  }

  .free-flag,
  .nav-text {
    display: none;
  }

  .head-inner {
    gap: 10px;
  }

  .brand-mark {
    width: 34px;
    height: 34px;
  }

  .nav-link,
  .theme-switch {
    width: 38px;
    justify-content: center;
    padding: 0;
  }

  .foot-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px 0;
    gap: 8px;
  }

  .foot-note {
    order: 3;
  }
}
</style>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
}
</style>
