<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'quiet' | 'danger';
    size?: 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    type?: 'button' | 'submit';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
    type: 'button',
  },
);

const classes = computed(() => [
  `btn--${props.variant}`,
  `btn--${props.size}`,
  { 'btn--block': props.block, 'btn--loading': props.loading },
]);
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 22px;
  border: 1.5px solid transparent;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    transform 120ms ease;
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.btn--lg {
  min-height: 54px;
  padding-inline: 28px;
  font-size: 1.05rem;
}

.btn--block {
  width: 100%;
}

.btn--primary {
  background: var(--blue-strong);
  color: var(--on-blue);
  border-color: var(--blue-strong);
  box-shadow: var(--shadow);
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(0.92);
}

.btn--ghost {
  background: transparent;
  border-color: var(--line-strong);
  color: var(--ink);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--surface-2);
}

.btn--quiet {
  background: var(--surface-2);
  border-color: var(--line);
  color: var(--ink);
}

.btn--quiet:hover:not(:disabled) {
  border-color: var(--line-strong);
}

.btn--danger {
  background: var(--bad);
  color: #fff;
  border-color: var(--bad);
}

.btn-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
