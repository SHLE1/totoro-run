<script setup lang="ts">
const props = defineProps<{ target: string }>();
const sessionStore = useSessionStore();

const selectedRoute = computed(
  () => sessionStore.paper?.runPointList.find((route) => route.pointId === props.target) ?? null,
);
</script>

<template>
  <div class="route-map">
    <RouteSketch :points="selectedRoute?.pointList ?? []" />
  </div>
</template>

<style scoped>
.route-map {
  position: relative;
  min-height: 340px;
  overflow: hidden;
  background: var(--surface-2);
}
</style>
