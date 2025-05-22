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
      <!-- 左侧添加 VSpacer 实现标题居中 -->
      <VSpacer></VSpacer>
      <VAppBarTitle class="app-title">
        让每个人都能感受到科技的乐趣
      </VAppBarTitle>
      <VSpacer></VSpacer>
    </VAppBar>
    <VMain>
      <div class="p-4">
        <NuxtPage />
        <p class="mt-4 text-xs">
          Powered by Hypered1
        </p>
        <div class="github-link mt-2">
          <a href="https://github.com/SHLE1/totoro-run" target="_blank">
            <svg role="img" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <title>GitHub</title>
              <path d="M12,0.5A12,12,0,0,0,8.21,23.4c0.6,0.11,0.82-0.26,0.82-0.58,0-0.29-0.01-1.12-0.02-2.2-3.34,0.73-4.04-1.61-4.04-1.61-0.55-1.4-1.35-1.77-1.35-1.77-1.1-0.75,0.09-0.74,0.09-0.74,1.22,0.09,1.86,1.25,1.86,1.25,1.08,1.85,2.83,1.32,3.52,1.01,0.11-0.79,0.42-1.32,0.76-1.62-2.67-0.3-5.47-1.33-5.47-5.93,0-1.31,0.47-2.38,1.25-3.22-0.13-0.3-0.54-1.52,0.12-3.17,0-0.01,1.01-0.32,3.3,1.23a11.5,11.5,0,0,1,6,0c2.28-1.55,3.29-1.23,3.29-1.23,0.66,1.65,0.25,2.87,0.12,3.17,0.78,0.84,1.25,1.91,1.25,3.22,0,4.61-2.8,5.62-5.48,5.92,0.43,0.37,0.81,1.1,0.81,2.22,0,1.61-0.01,2.91-0.01,3.31,0,0.32,0.22,0.69,0.83,0.57A12,12,0,0,0,12,0.5Z" />
            </svg>
            totoro-run
          </a>
        </div>
      </div>
    </VMain>
  </VApp>
</template>

<style scoped>
.custom-app-bar {
  background: linear-gradient(135deg, #59bbe9 0%, #2e4455 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.app-title {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.app-title:hover {
  transform: scale(1.02);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

::v-deep .gradient {
  background: linear-gradient(45deg, #1a95ed, #24c2de, #31d475);
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.chat-btn {
  margin-right: 16px;
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 6px 12px;
}

.chat-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.1);
}

.chat-text {
  color: white;
  font-weight: 500;
  margin-left: 4px;
}

/* 添加圆角矩形样式 */
.rounded-lg {
  border-radius: 12px !important;
}

.github-link {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: white;
}

.github-link a {
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
}

.github-link svg {
  margin-right: 4px;
}
</style>