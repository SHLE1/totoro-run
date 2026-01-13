<script setup lang="ts">
import { useNow } from '@vueuse/core';
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';
import generateRunReq from '~~/src/controllers/generateSunRunExercisesReq';
import generateRoute from '~~/src/utils/generateRoute';

const now = useNow({ interval: 1000 });
const startTime = ref(new Date());
const endTime = ref(new Date());
const timePassed = computed(() => Number(now.value) - Number(startTime.value));
const needTime = ref(0);
const running = ref(false);
const sunRunPaper = useSunRunPaper();
const { params } = useRoute();
const session = useSession();
const { route } = params as { route: string };
const runned = computed(() => !running.value && !!needTime.value);
const target = computed(() => sunRunPaper.value.runPointList.find((r) => r.pointId === route)!);

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
  endTime.value = targetTime;
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
    <!-- 步骤指示器 -->
    <nav class="step-indicator" aria-label="进度步骤">
      <div class="step completed">
        <span class="step-num" aria-hidden="true">&#10003;</span>
        <span class="step-text">扫码</span>
      </div>
      <div class="step-line active" aria-hidden="true"></div>
      <div class="step completed">
        <span class="step-num" aria-hidden="true">&#10003;</span>
        <span class="step-text">确认</span>
      </div>
      <div class="step-line" :class="{ active: runned }" aria-hidden="true"></div>
      <div class="step" :class="{ active: running, completed: runned }" :aria-current="running || runned ? 'step' : undefined">
        <span class="step-num" aria-hidden="true">{{ runned ? '&#10003;' : '3' }}</span>
        <span class="step-text">完成</span>
      </div>
    </nav>

    <!-- 路线信息卡片 -->
    <section class="route-info-card" aria-labelledby="route-info-title">
      <div class="card-header">
        <span class="header-icon" aria-hidden="true">&#128205;</span>
        <h2 id="route-info-title" class="header-title">已选择路线</h2>
      </div>
      <div class="route-name">{{ target.pointName }}</div>
    </section>

    <!-- 跑步状态卡片 -->
    <section class="run-card" aria-live="polite">
      <!-- 未开始状态 -->
      <template v-if="!runned && !running">
        <div class="card-header">
          <span class="header-icon" aria-hidden="true">&#9888;</span>
          <h2 class="header-title">开跑前请确认</h2>
        </div>
        <div class="warning-box" role="alert">
          <p class="warning-text">跑步过程中请保持页面前台打开</p>
          <p class="warning-subtext">不要退出 &bull; 不要断网 &bull; 不要切换应用</p>
        </div>
        <VBtn
          color="cta"
          size="large"
          class="start-run-btn"
          prepend-icon="i-mdi-run"
          @click="handleRun"
        >
          确认开跑
        </VBtn>
      </template>

      <!-- 跑步中状态 -->
      <template v-if="running">
        <div class="card-header">
          <span class="header-icon running-icon" aria-hidden="true">&#127939;</span>
          <h2 class="header-title">跑步进行中...</h2>
        </div>
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
              :model-value="(timePassed / needTime) * 100"
              height="12"
              rounded
              :aria-label="`跑步进度 ${Math.ceil((timePassed / needTime) * 100)}%`"
            />
            <span class="progress-percent" aria-hidden="true">{{ Math.ceil((timePassed / needTime) * 100) }}%</span>
          </div>
          <p class="running-hint">请勿关闭此页面，跑步完成后会自动提示</p>
        </div>
      </template>

      <!-- 完成状态 -->
      <template v-if="runned">
        <div class="card-header success">
          <span class="header-icon" aria-hidden="true">&#127881;</span>
          <h2 class="header-title">跑步完成</h2>
        </div>
        <div class="success-section" role="status">
          <div class="success-icon" aria-hidden="true">&#10004;</div>
          <p class="success-text">恭喜！本次跑步已完成</p>
          <p class="success-hint">请前往 App 查看跑步记录</p>
        </div>
        <NuxtLink to="/" class="back-link">
          <VBtn variant="tonal" color="primary" class="back-btn">
            返回首页
          </VBtn>
        </NuxtLink>
      </template>
    </section>
  </div>
</template>

<style scoped>
.page-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  gap: 8px;
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
  background: #e2e8f0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease-out;
}

.step.active .step-num {
  background: #3b82f6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.step.completed .step-num {
  background: #22c55e;
  color: #fff;
}

.step-text {
  font-size: 0.75rem;
  color: #94a3b8;
}

.step.active .step-text {
  color: #3b82f6;
  font-weight: 600;
}

.step.completed .step-text {
  color: #22c55e;
  font-weight: 600;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e2e8f0;
  margin-bottom: 18px;
}

.step-line.active {
  background: #22c55e;
}

/* 卡片通用样式 */
.route-info-card,
.run-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header.success {
  border-bottom-color: #dcfce7;
}

.header-icon {
  font-size: 1.25rem;
}

.running-icon {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .running-icon {
    animation: none;
  }
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* 路线信息 */
.route-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #3b82f6;
  text-align: center;
  padding: 12px;
  background: #eff6ff;
  border-radius: 10px;
}

/* 警告框 */
.warning-box {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.warning-text {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 4px;
}

.warning-subtext {
  font-size: 0.85rem;
  color: #a16207;
}

.start-run-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
}

/* 进度区域 */
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
  color: #94a3b8;
}

.time-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
}

.time-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
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
  color: #3b82f6;
}

.running-hint {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* 完成状态 */
.success-section {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #dcfce7;
  color: #22c55e;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.success-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.success-hint {
  font-size: 0.9rem;
  color: #64748b;
}

.back-link {
  display: block;
  margin-top: 16px;
}

.back-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  text-transform: none;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 480px) {
  .time-value {
    font-size: 1.5rem;
  }
}
</style>

<!-- 深色模式样式（非 scoped） -->
<style>
.v-theme--dark .step-num {
  background: #334155;
  color: #64748b;
}

.v-theme--dark .step.active .step-num {
  background: #60a5fa;
  color: #0f172a;
}

.v-theme--dark .step.completed .step-num {
  background: #4ade80;
  color: #0f172a;
}

.v-theme--dark .step.active .step-text {
  color: #60a5fa;
}

.v-theme--dark .step.completed .step-text {
  color: #4ade80;
}

.v-theme--dark .step-line {
  background: #334155;
}

.v-theme--dark .step-line.active {
  background: #4ade80;
}

.v-theme--dark .route-info-card,
.v-theme--dark .run-card {
  background: #1e293b;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .card-header {
  border-bottom-color: #334155;
}

.v-theme--dark .card-header.success {
  border-bottom-color: #166534;
}

.v-theme--dark .header-title {
  color: #f1f5f9;
}

.v-theme--dark .route-name {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.15);
}

.v-theme--dark .warning-box {
  background: rgba(252, 211, 77, 0.15);
  border-color: #a16207;
}

.v-theme--dark .warning-text {
  color: #fde047;
}

.v-theme--dark .warning-subtext {
  color: #fcd34d;
}

.v-theme--dark .time-value {
  color: #f1f5f9;
}

.v-theme--dark .time-divider {
  background: #334155;
}

.v-theme--dark .progress-percent {
  color: #60a5fa;
}

.v-theme--dark .success-icon {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.v-theme--dark .success-text {
  color: #f1f5f9;
}

.v-theme--dark .success-hint {
  color: #94a3b8;
}
</style>