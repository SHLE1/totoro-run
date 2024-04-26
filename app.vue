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
    <VAppBar color="secondary" dark dense elevated>
      <VAppBarTitle class="text-center white--text display-1">龙猫！启动！</VAppBarTitle>
    </VAppBar>
    <VMain>
      <div class="p-8">
        <NuxtPage />
        <p class="mt-4 text-sm grey--text">
          Powered by Hypered1
        </p>
      </div>
    </VMain>
  </VApp>
</template>

<style scoped>
.VAppBar {
  height: 80px;
}

.VAppBarTitle {
  font-size: 24px;
}

.VMain {
  margin: 20px;
}

p {
  color: #888;
  font-size: 14px;
}
</style>