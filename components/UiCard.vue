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
  background: var(--ui-surface);
  border-radius: var(--ui-radius-lg);
  border: 1px solid var(--ui-border);
  box-shadow: var(--ui-shadow-soft);
  padding: 20px;
}

.ui-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ui-divider);
}

.ui-card__icon {
  font-size: 1.1rem;
  color: rgb(var(--ui-primary));
}

.ui-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ui-text);
  margin: 0;
}

.tone-success .ui-card__header {
  border-bottom-color: rgba(var(--ui-success), 0.25);
}

.tone-success .ui-card__icon {
  color: rgb(var(--ui-success));
}

.tone-warning .ui-card__header {
  border-bottom-color: rgba(var(--ui-warning), 0.35);
}

.tone-warning .ui-card__icon {
  color: rgb(var(--ui-warning));
}

.tone-info .ui-card__icon {
  color: rgb(var(--ui-primary));
}
</style>
