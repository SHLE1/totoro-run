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
</style>