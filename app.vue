<script setup lang="ts">
// import '@unocss/reset/tailwind.css';

const appConfig = useAppConfig();

useHead({
  title: '新时代龙猫'
})
</script>
<script lang="ts">
window.global = window;
</script>
<template>
  <VApp>
    <VAppBar color="primary">
      <VAppBarTitle class="text-center">打破龙猫垄断！</VAppBarTitle>
      <template #append>
        <VAppBarNavIcon
          v-ripple icon="i-mdi-github" href="https://github.com/BeiyanYunyi/totoro-paradise"
          rel="noreferrer noopener" target="_blank"
        />
      </template>
    </VAppBar>
    <VMain>
      <div class="p-4">
        <NuxtPage />
        <p class="mt-4 text-xs">
          Powered by totoro-paradise v{{ appConfig.version }}
        </p>
      </div>
    </VMain>
  </VApp>
</template>
