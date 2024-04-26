<script setup lang="ts">
// import '@unocss/reset/tailwind.css';

const appConfig = useAppConfig();

useHead({
  title: '龙猫森林奇遇记',
  link: [
    {
      rel: 'icon',
      href: '/机器猫.ico',
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
    <VAppBar color="primary">
      <VAppBarTitle class="text-center">龙猫！启动！</VAppBarTitle>
      <!-- 
      <template #append>
        <VAppBarNavIcon
          v-ripple icon="i-mdi-github" href="https://github.com/BeiyanYunyi/totoro-paradise"
          rel="noreferrer noopener" target="_blank"
        />
      </template>
-->
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
