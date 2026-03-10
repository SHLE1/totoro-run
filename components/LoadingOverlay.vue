<script setup lang="ts">
withDefaults(defineProps<{ active: boolean }>(), { active: false });
</script>

<template>
  <div
    v-if="active"
    class="loading-overlay"
    role="status"
    aria-live="polite"
  >
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
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-card {
  position: relative;
  z-index: 1;
  background: var(--ui-surface);
  color: var(--ui-text);
  border-radius: var(--ui-radius-lg);
  border: 1px solid var(--ui-border);
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
  .loading-card {
    padding: 14px 20px;
  }
}
</style>
