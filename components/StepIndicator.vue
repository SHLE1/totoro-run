<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    activeStep?: number;
    completedSteps?: number[];
    labels?: string[];
  }>(),
  {
    activeStep: 0,
    completedSteps: () => [],
    labels: () => ['扫码', '确认', '完成'],
  }
);

const steps = computed(() =>
  props.labels.map((label, index) => ({
    label,
    index: index + 1,
  }))
);

const isCompleted = (step: number) => props.completedSteps.includes(step);
const isActive = (step: number) =>
  props.activeStep > 0 && step === props.activeStep && !isCompleted(step);
const isLineActive = (step: number) => isCompleted(step);
</script>

<template>
  <nav class="step-indicator" aria-label="进度步骤">
    <template v-for="step in steps" :key="step.index">
      <div
        class="step"
        :class="{ active: isActive(step.index), completed: isCompleted(step.index) }"
        :aria-current="isActive(step.index) ? 'step' : undefined"
      >
        <span class="step-num" aria-hidden="true">
          <span
            v-if="isCompleted(step.index)"
            class="mdi mdi-check"
            aria-hidden="true"
          ></span>
          <span v-else>{{ step.index }}</span>
        </span>
        <span class="step-text">{{ step.label }}</span>
      </div>
      <div
        v-if="step.index < steps.length"
        class="step-line"
        :class="{ active: isLineActive(step.index) }"
        aria-hidden="true"
      ></div>
    </template>
  </nav>
</template>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--ui-surface-strong);
  color: var(--ui-text-muted);
  border: 1px solid var(--ui-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease-out;
}

.step.active .step-num {
  background: rgb(var(--ui-primary));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.step.completed .step-num {
  background: rgb(var(--ui-success));
  color: #fff;
  border-color: transparent;
}

.step-text {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

.step.active .step-text {
  color: rgb(var(--ui-primary));
  font-weight: 600;
}

.step.completed .step-text {
  color: rgb(var(--ui-success));
  font-weight: 600;
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--ui-border);
  margin-bottom: 18px;
}

.step-line.active {
  background: rgb(var(--ui-success));
}

@media (max-width: 480px) {
  .step-indicator {
    gap: 6px;
  }

  .step-line {
    width: 28px;
  }
}
</style>
