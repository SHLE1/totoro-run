<script setup lang="ts">
const props = withDefaults(defineProps<{ active: boolean }>(), { active: false });

const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (event: MouseEvent) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (!touch) {
    return;
  }
  mouseX.value = touch.clientX;
  mouseY.value = touch.clientY;
};

onMounted(() => {
  mouseX.value = window.innerWidth / 2;
  mouseY.value = window.innerHeight / 2;
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchmove', handleTouchMove);
});
</script>

<template>
  <div
    v-if="active"
    class="loading-overlay"
    role="status"
    aria-live="polite"
    @mousemove="handleMouseMove"
  >
    <div
      class="loading-glow"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
      aria-hidden="true"
    ></div>
    <div class="loading-card">
      <span class="mdi mdi-progress-clock loading-icon" aria-hidden="true"></span>
      <div class="loading-text">正在加载...</div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loading-glow {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(var(--ui-primary), 0.25) 0%,
    rgba(var(--ui-primary), 0.12) 40%,
    transparent 70%
  );
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.08s ease-out, top 0.08s ease-out;
}

.loading-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  color: var(--ui-text);
  border-radius: var(--ui-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: var(--ui-shadow-card);
  padding: 18px 26px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.loading-icon {
  font-size: 1.2rem;
  color: rgb(var(--ui-primary));
  animation: spin 1.2s linear infinite;
}

.loading-text {
  font-size: 0.95rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-icon {
    animation: none;
  }
}

@media (max-width: 480px) {
  .loading-glow {
    width: 260px;
    height: 260px;
  }

  .loading-card {
    padding: 14px 20px;
  }
}
</style>
