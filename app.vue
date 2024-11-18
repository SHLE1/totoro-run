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
    <!-- 添加 absolute 和 floating 属性 -->
    <VAppBar class="gradient" elevation="3" absolute floating>
      <VAppBarTitle class="text-center text-white">让每个人都能感受到科技的乐趣</VAppBarTitle>
    </VAppBar>
    <!-- 为了防止内容被导航栏遮挡，给 VMain 添加上边距 -->
    <VMain style="padding-top: 64px;">
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
::v-deep .gradient {
  background: linear-gradient(45deg, #1a95ed, #24c2de, #31d475);
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
  /* 可以添加一些阴影效果增强悬浮感 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
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
</style>