<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    icon?: string;
    tone?: 'default' | 'success' | 'warning' | 'info';
  }>(),
  {
    tone: 'default',
  }
);

const toneClass = computed(() => `tone-${props.tone}`);
</script>

<template>
  <section class="ui-card" :class="toneClass">
    <header v-if="title || icon || $slots.header" class="ui-card__header" :class="toneClass">
      <slot name="header">
        <span v-if="icon" class="ui-card__icon" :class="icon" aria-hidden="true"></span>
        <h2 v-if="title" class="ui-card__title">{{ title }}</h2>
      </slot>
    </header>
    <div class="ui-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.ui-card {
  background: var(--ui-surface-glass);
  backdrop-filter: var(--ui-blur-glass);
  -webkit-backdrop-filter: var(--ui-blur-glass);
  border-radius: var(--ui-radius-lg);
  border: 1px solid var(--ui-border-glass);
  padding: 24px;
  box-shadow: var(--ui-shadow-glass);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
              box-shadow 0.3s ease, 
              border-color 0.3s ease;
}

.ui-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -4px rgba(0, 0, 0, 0.12);
  border-color: rgb(var(--ui-primary) / 0.5);
}

.ui-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ui-border-glass);
}

.ui-card__icon {
  font-size: 1.25rem;
  color: rgb(var(--ui-primary));
  flex-shrink: 0;
}

.ui-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  font-family: var(--ui-font-heading);
  color: var(--ui-text);
  margin: 0;
  line-height: 1.4;
}

.ui-card__body {
  font-family: var(--ui-font-body);
  line-height: 1.6;
}

/* Tone variations */
.tone-success .ui-card__header {
  border-bottom-color: rgb(var(--ui-success) / 0.3);
}

.tone-success .ui-card__icon {
  color: rgb(var(--ui-success));
}

.tone-success:hover {
  border-color: rgb(var(--ui-success) / 0.5);
}

.tone-warning .ui-card__header {
  border-bottom-color: rgb(var(--ui-warning) / 0.3);
}

.tone-warning .ui-card__icon {
  color: rgb(var(--ui-warning));
}

.tone-warning:hover {
  border-color: rgb(var(--ui-warning) / 0.5);
}

.tone-info .ui-card__icon {
  color: rgb(var(--ui-secondary));
}

.tone-info:hover {
  border-color: rgb(var(--ui-secondary) / 0.5);
}

/* 深色模式优化 */
.v-theme--dark .ui-card {
  background: var(--ui-surface-glass);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
</style>
