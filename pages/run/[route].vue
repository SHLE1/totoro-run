<script setup lang="ts">
import { useNow } from '@vueuse/core';
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';
import generateRunReq from '~~/src/controllers/generateSunRunExercisesReq';
import generateRoute from '~~/src/utils/generateRoute';

const now = useNow({ interval: 1000 });
const startTime = ref(new Date());
const timePassed = computed(() => Number(now.value) - Number(startTime.value));
const needTime = ref(0);
const running = ref(false);
const sunRunPaper = useSunRunPaper();
const { params } = useRoute();
const session = useSession();
const { route } = params as { route: string };
const runned = computed(() => !running.value && !!needTime.value);
const target = computed(() => sunRunPaper.value.runPointList.find((r) => r.pointId === route)!);

const runState = computed(() => {
  if (running.value) {
    return 'running';
  }
  if (runned.value) {
    return 'done';
  }
  return 'ready';
});

const activeStep = computed(() => (running.value ? 3 : 0));
const completedSteps = computed(() => {
  const steps = [1, 2];
  if (runned.value) {
    steps.push(3);
  }
  return steps;
});

const runCardTone = computed(() => {
  if (runned.value) {
    return 'success';
  }
  if (running.value) {
    return 'info';
  }
  return 'warning';
});

const runHeaderTitle = computed(() => {
  if (runState.value === 'running') {
    return '跑步进行中...';
  }
  if (runState.value === 'done') {
    return '跑步完成';
  }
  return '开跑前请确认';
});

const runHeaderIcon = computed(() => {
  if (runState.value === 'running') {
    return 'mdi mdi-run';
  }
  if (runState.value === 'done') {
    return 'mdi mdi-check-circle';
  }
  return 'mdi mdi-alert-circle';
});

const progressPercent = computed(() => {
  if (!needTime.value) {
    return 0;
  }
  return Math.min(100, Math.max(0, (timePassed.value / needTime.value) * 100));
});

const progressPercentLabel = computed(() => Math.ceil(progressPercent.value));

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const handleRun = async () => {
  const { req, endTime: targetTime } = await generateRunReq({
    distance: sunRunPaper.value.mileage,
    routeId: target.value.pointId,
    taskId: target.value.taskId,
    token: session.value.token,
    schoolId: session.value.schoolId,
    stuNumber: session.value.stuNumber,
    phoneNumber: session.value.phoneNumber,
    minTime: sunRunPaper.value.minTime,
    maxTime: sunRunPaper.value.maxTime,
  });
  startTime.value = now.value;
  needTime.value = Number(targetTime) - Number(now.value);
  running.value = true;

  await TotoroApiWrapper.getRunBegin({
    campusId: session.value.campusId,
    schoolId: session.value.schoolId,
    stuNumber: session.value.stuNumber,
    token: session.value.token,
  });
  setTimeout(async () => {
    const res = await TotoroApiWrapper.sunRunExercises(req);
    const runRoute = generateRoute(sunRunPaper.value.mileage, target.value);
    await TotoroApiWrapper.sunRunExercisesDetail({
      pointList: runRoute.mockRoute,
      scantronId: res.scantronId,
      breq: {
        campusId: session.value.campusId,
        schoolId: session.value.schoolId,
        stuNumber: session.value.stuNumber,
        token: session.value.token,
      },
    });

    running.value = false;
  }, needTime.value);
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (running.value && !runned.value) {
    e.preventDefault();
    e.returnValue = '跑步还未完成，确定要离开吗？';
  }
}
</script>
<template>
  <div class="page-wrapper">
    <StepIndicator :active-step="activeStep" :completed-steps="completedSteps" />

    <div class="page-stack">
      <UiCard title="已选择路线" icon="mdi mdi-map-marker" class="route-info-card">
        <div class="route-name">{{ target.pointName }}</div>
      </UiCard>

      <UiCard
        :title="runHeaderTitle"
        :icon="runHeaderIcon"
        :tone="runCardTone"
        class="run-card"
        :class="{ running: runState === 'running' }"
        aria-live="polite"
      >
        <template v-if="runState === 'ready'">
          <div class="warning-box" role="alert">
            <p class="warning-text">跑步过程中请保持页面前台打开</p>
            <p class="warning-subtext">不要退出 &bull; 不要断网 &bull; 不要切换应用</p>
          </div>
          <VBtn color="cta" class="ui-btn start-run-btn" prepend-icon="i-mdi-run" @click="handleRun">
            确认开跑
          </VBtn>
        </template>

        <template v-else-if="runState === 'running'">
          <div class="progress-section">
            <div class="time-display">
              <div class="time-item">
                <span class="time-label">已用时</span>
                <span class="time-value" aria-live="polite">{{ formatTime(timePassed) }}</span>
              </div>
              <div class="time-divider" aria-hidden="true"></div>
              <div class="time-item">
                <span class="time-label">总时长</span>
                <span class="time-value">{{ formatTime(needTime) }}</span>
              </div>
            </div>
            <div class="progress-bar-wrapper">
              <VProgressLinear
                color="primary"
                :model-value="progressPercent"
                height="12"
                rounded
                :aria-label="`跑步进度 ${progressPercentLabel}%`"
              />
              <span class="progress-percent" aria-hidden="true">{{ progressPercentLabel }}%</span>
            </div>
            <p class="running-hint">请勿关闭此页面，跑步完成后会自动提示</p>
          </div>
        </template>

        <template v-else>
          <div class="success-section" role="status">
            <div class="success-icon" aria-hidden="true">
              <span class="mdi mdi-check" aria-hidden="true"></span>
            </div>
            <p class="success-text">恭喜！本次跑步已完成</p>
            <p class="success-hint">请前往 App 查看跑步记录</p>
          </div>
          <NuxtLink to="/" class="back-link">
            <VBtn variant="tonal" color="primary" class="ui-btn ui-btn--sm back-btn">
              返回首页
            </VBtn>
          </NuxtLink>
        </template>
      </UiCard>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.route-name {
  font-size: 1.125rem;
  font-weight: 600;
  font-family: var(--ui-font-heading);
  color: rgb(var(--ui-primary));
  text-align: center;
  padding: 12px;
  background: rgba(var(--ui-primary), 0.1);
  border-radius: var(--ui-radius-md);
  border: 2px solid rgba(var(--ui-primary), 0.2);
}

.warning-box {
  background: rgba(var(--ui-warning), 0.1);
  border: 2px solid rgba(var(--ui-warning), 0.3);
  border-radius: var(--ui-radius-md);
  padding: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.warning-text {
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--ui-font-heading);
  color: rgb(var(--ui-warning));
  margin-bottom: 4px;
}

.warning-subtext {
  font-size: 0.85rem;
  color: var(--ui-text-subtle);
}

.start-run-btn {
  width: 100%;
}

.progress-section {
  text-align: center;
}

.time-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-label {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

.time-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--ui-font-heading);
  color: var(--ui-text);
  font-variant-numeric: tabular-nums;
}

.time-divider {
  width: 1px;
  height: 40px;
  background: var(--ui-border);
}

.progress-bar-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.progress-percent {
  position: absolute;
  right: 0;
  top: -24px;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--ui-primary));
}

.running-hint {
  font-size: 0.85rem;
  color: var(--ui-text-muted);
}

.success-section {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(var(--ui-success), 0.15);
  border: 3px solid rgba(var(--ui-success), 0.3);
  color: rgb(var(--ui-success));
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.success-text {
  font-size: 1.125rem;
  font-weight: 600;
  font-family: var(--ui-font-heading);
  color: var(--ui-text);
  margin-bottom: 4px;
}

.success-hint {
  font-size: 0.9rem;
  color: var(--ui-text-muted);
}

.back-link {
  display: block;
  margin-top: 16px;
}

.back-btn {
  width: 100%;
}

:deep(.run-card.running .ui-card__icon) {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.run-card.running .ui-card__icon) {
    animation: none;
  }
}

@media (max-width: 480px) {
  .time-value {
    font-size: 1.5rem;
  }
}
</style>
