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
    <VAppBar color="primary" dense>
      <VAppBarTitle class="text-center white--text headline">致力于不浪费大学生宝贵的自由</VAppBarTitle>
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
* {
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

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