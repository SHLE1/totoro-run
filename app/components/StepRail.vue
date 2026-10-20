<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    active?: number;
    completed?: number[];
  }>(),
  {
    active: 0,
    completed: () => [],
  },
);

const steps = [
  { index: 1, label: '扫码' },
  { index: 2, label: '确认' },
  { index: 3, label: '开跑' },
];
</script>

<template>
  <nav class="step-rail" aria-label="流程进度">
    <div
      v-for="step in steps"
      :key="step.index"
      class="step"
      :class="{
        'step--active': props.active === step.index && !props.completed.includes(step.index),
        'step--done': props.completed.includes(step.index),
      }"
      :aria-current="props.active === step.index ? 'step' : undefined"
    >
      <span class="step-number mono" aria-hidden="true">
        {{ props.completed.includes(step.index) ? '✓' : String(step.index).padStart(2, '0') }}
      </span>
      <span class="step-copy">{{ step.label }}</span>
    </div>
  </nav>
</template>

<style scoped>
.step-rail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.step {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-right: 1.5px solid var(--line);
}

.step:last-child {
  border-right: 0;
}

.step--active {
  background: var(--blue-wash);
}

.step--active::after {
  position: absolute;
  inset: auto 0 0;
  height: 4px;
  background: var(--blue);
  content: '';
}

.step--done .step-number {
  color: var(--ok);
}

.step-number {
  color: var(--muted);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1;
}

.step--active .step-number {
  color: var(--blue-strong);
}

.step-copy {
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .step {
    gap: 8px;
    padding: 10px 12px;
  }

  .step-number {
    font-size: 1.05rem;
  }
}
</style>
