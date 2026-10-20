<script setup lang="ts">
import { useNow } from '@vueuse/core';
import generateRunReq from '~~/src/controllers/generateSunRunExercisesReq';
import generateRoute from '~~/src/utils/generateRoute';
import TotoroApiWrapper from '~~/src/wrappers/TotoroApiWrapper';

definePageMeta({ name: 'run-session' });

useHead({ title: '本次跑步 · 龙猫校园' });

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const paper = computed(() => sessionStore.paper);

if (!sessionStore.isLoggedIn) {
  await navigateTo('/');
}

if (!paper.value && sessionStore.isLoggedIn) {
  const basic = sessionStore.basicRequest;
  if (basic) {
    try {
      sessionStore.paper = await TotoroApiWrapper.getSunRunPaper(basic);
    } catch (error) {
      console.error('恢复跑步配置失败:', error);
    }
  }
}

const routeId = computed(() => String(route.params.route ?? ''));
const target = computed(
  () => paper.value?.runPointList.find((item) => item.pointId === routeId.value) ?? null,
);

if (!target.value) {
  await navigateTo('/scanned');
}

const now = useNow({ interval: 1000 });
const startedAt = ref(0);
const totalMs = ref(0);
const running = ref(false);
const done = ref(false);
const errorMessage = ref('');

let submitTimer: ReturnType<typeof setTimeout> | null = null;

const leavePrompt = ref(false);
const leaveTarget = ref<string | null>(null);

const state = computed<'ready' | 'running' | 'done' | 'error'>(() => {
  if (errorMessage.value) {
    return 'error';
  }
  if (done.value) {
    return 'done';
  }
  if (running.value) {
    return 'running';
  }
  return 'ready';
});

const elapsedMs = computed(() =>
  running.value ? Math.min(totalMs.value, Math.max(0, Number(now.value) - startedAt.value)) : 0,
);

const remainingMs = computed(() => Math.max(0, totalMs.value - elapsedMs.value));

const progress = computed(() =>
  totalMs.value > 0 ? Math.min(100, (elapsedMs.value / totalMs.value) * 100) : 0,
);

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const stateLabel = computed(() => {
  if (state.value === 'running') {
    return '进行中';
  }
  if (state.value === 'done') {
    return '已完成';
  }
  if (state.value === 'error') {
    return '提交失败';
  }
  return '待开跑';
});

function clearSubmitTimer() {
  if (submitTimer !== null) {
    clearTimeout(submitTimer);
    submitTimer = null;
  }
}

async function submitRun(req: Awaited<ReturnType<typeof generateRunReq>>['req']) {
  const basic = sessionStore.basicRequest;
  if (!basic || !paper.value || !target.value) {
    return;
  }

  try {
    const result = await TotoroApiWrapper.sunRunExercises(req);
    const runRoute = generateRoute(paper.value.mileage, target.value);
    await TotoroApiWrapper.sunRunExercisesDetail({
      pointList: runRoute.mockRoute,
      scantronId: result.scantronId,
      breq: basic,
    });
    done.value = true;
  } catch (error) {
    console.error('跑步提交失败:', error);
    errorMessage.value = (error as Error).message || '跑步提交失败，请稍后重试。';
  } finally {
    running.value = false;
    submitTimer = null;
  }
}

async function startRun() {
  if (running.value || done.value || errorMessage.value) {
    return;
  }
  if (!paper.value || !target.value) {
    return;
  }
  const basic = sessionStore.basicRequest;
  if (!basic) {
    await navigateTo('/');
    return;
  }

  try {
    const { req, endTime } = await generateRunReq({
      distance: paper.value.mileage,
      routeId: target.value.pointId,
      taskId: target.value.taskId,
      token: basic.token,
      schoolId: basic.schoolId,
      stuNumber: basic.stuNumber,
      phoneNumber: sessionStore.session?.phoneNumber ?? '',
      minTime: paper.value.minTime,
      maxTime: paper.value.maxTime,
    });

    startedAt.value = Date.now();
    totalMs.value = Math.max(0, Number(endTime) - startedAt.value);
    running.value = true;

    await TotoroApiWrapper.getRunBegin(basic);

    submitTimer = setTimeout(() => {
      void submitRun(req);
    }, totalMs.value);
  } catch (error) {
    console.error('开始跑步失败:', error);
    running.value = false;
    errorMessage.value = '开跑失败，请返回重新选择路线后再试。';
  }
}

function retry() {
  errorMessage.value = '';
  done.value = false;
  running.value = false;
  startedAt.value = 0;
  totalMs.value = 0;
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (running.value) {
    event.preventDefault();
    event.returnValue = '跑步还未完成，确定要离开吗？';
  }
}

onBeforeRouteLeave((to) => {
  if (!running.value) {
    return true;
  }
  leaveTarget.value = to.fullPath;
  leavePrompt.value = true;
  return false;
});

function stayOnPage() {
  leavePrompt.value = false;
  leaveTarget.value = null;
}

function leavePage() {
  const target = leaveTarget.value;
  leavePrompt.value = false;
  leaveTarget.value = null;
  running.value = false;
  clearSubmitTimer();
  if (target) {
    void router.push(target);
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);

  if (import.meta.dev) {
    const demo = String(route.query.demo ?? '');
    if (demo === 'running') {
      totalMs.value = 22 * 60 * 1000;
      startedAt.value = Date.now() - 7 * 60 * 1000;
      running.value = true;
    }
    if (demo === 'done') {
      totalMs.value = 22 * 60 * 1000;
      done.value = true;
    }
    if (demo === 'error') {
      errorMessage.value = '跑步提交失败，请返回重新选择路线后再试。';
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  clearSubmitTimer();
});

const trackStyle = computed(() => ({ '--progress': `${progress.value}%` }));
</script>

<template>
  <div class="page">
    <div class="shell run">
      <StepRail :active="3" :completed="[1, 2]" />

      <div v-if="paper && target" class="run-grid">
        <section class="panel console" aria-labelledby="console-title">
          <header class="panel-head console-head">
            <h1 id="console-title" class="console-title">
              {{ target.pointName }}
            </h1>
            <span class="run-state" :class="`run-state--${state}`">
              <span class="run-state-dot" aria-hidden="true" />
              {{ stateLabel }}
            </span>
          </header>

          <Transition name="swap" mode="out-in">
            <div v-if="state === 'ready'" key="ready" class="console-body">
              <div class="target-facts">
                <div class="target-main">
                  <span class="target-label">目标里程</span>
                  <strong class="target-value mono">{{ paper.mileage }}<small>km</small></strong>
                </div>
                <dl class="target-list">
                  <div>
                    <dt>用时范围</dt><dd class="mono">
                      {{ paper.minTime }}–{{ paper.maxTime }} 分钟
                    </dd>
                  </div>
                  <div>
                    <dt>速度范围</dt><dd class="mono">
                      {{ paper.minSpeed }}–{{ paper.maxSpeed }}
                    </dd>
                  </div>
                  <div>
                    <dt>有效期至</dt><dd class="mono">
                      {{ paper.endDate }}
                    </dd>
                  </div>
                </dl>
              </div>

              <div class="warning">
                <span class="warning-flag mono">重要</span>
                <p>开跑后请不要离开此页面。</p>
              </div>

              <AppButton variant="primary" size="lg" block @click="startRun">
                确认开跑
              </AppButton>
            </div>

            <div v-else-if="state === 'running'" key="running" class="console-body running">
              <p class="running-label">
                剩余时间
              </p>
              <div class="timer mono" aria-live="polite">
                {{ formatDuration(remainingMs) }}
              </div>
              <div class="timer-meta">
                <span>已用时 <b class="mono">{{ formatDuration(elapsedMs) }}</b></span>
                <span>总时长 <b class="mono">{{ formatDuration(totalMs) }}</b></span>
                <span>进度 <b class="mono">{{ Math.ceil(progress) }}%</b></span>
              </div>

              <div class="lane" :style="trackStyle" role="progressbar" :aria-valuenow="Math.ceil(progress)" aria-valuemin="0" aria-valuemax="100">
                <span class="lane-line lane-line--top" aria-hidden="true" />
                <span class="lane-line lane-line--bottom" aria-hidden="true" />
                <span class="lane-runner" aria-hidden="true" />
              </div>

              <div class="running-notice">
                <span class="running-pulse" aria-hidden="true" />
                <p>请勿关闭页面。</p>
              </div>
            </div>

            <div v-else-if="state === 'done'" key="done" class="console-body result result--done">
              <span class="result-mark mono" aria-hidden="true">✓</span>
              <h2 class="result-title">
                本次跑步已完成
              </h2>
              <p class="result-copy">
                成绩已回传，可在阳光体育 App 查看。
              </p>
              <dl class="result-facts">
                <div><dt>路线</dt><dd>{{ target.pointName }}</dd></div>
                <div>
                  <dt>里程</dt><dd class="mono">
                    {{ paper.mileage }} km
                  </dd>
                </div>
                <div>
                  <dt>用时</dt><dd class="mono">
                    {{ formatDuration(totalMs) }}
                  </dd>
                </div>
              </dl>
              <div class="result-actions">
                <AppButton variant="primary" @click="router.push('/')">
                  返回首页
                </AppButton>
                <AppButton variant="ghost" @click="router.push('/scanned')">
                  再跑一次
                </AppButton>
              </div>
            </div>

            <div v-else key="error" class="console-body result result--error">
              <span class="result-mark mono" aria-hidden="true">!</span>
              <h2 class="result-title">
                提交没有完成
              </h2>
              <p class="result-copy">
                {{ errorMessage }}
              </p>
              <div class="result-actions">
                <AppButton variant="ghost" @click="retry">
                  重试
                </AppButton>
                <AppButton variant="ghost" @click="router.push('/scanned')">
                  返回选路线
                </AppButton>
              </div>
            </div>
          </Transition>
        </section>

        <aside class="run-side">
          <section class="panel map-panel" aria-labelledby="run-map-title">
            <header class="panel-head">
              <h2 id="run-map-title" class="panel-title">
                路线轨迹
              </h2>
            </header>
            <div class="map-wrap">
              <RouteMap :target="routeId" />
            </div>
          </section>

          <section class="panel side-facts" aria-label="任务参数">
            <div class="side-fact">
              <span>目标</span>
              <strong class="mono">{{ paper.mileage }} km</strong>
            </div>
            <div class="side-fact">
              <span>用时</span>
              <strong class="mono">{{ paper.minTime }}–{{ paper.maxTime }} 分</strong>
            </div>
            <div class="side-fact">
              <span>状态</span>
              <strong>{{ stateLabel }}</strong>
            </div>
          </section>

          <p class="side-note">
            关闭页面会中断本次记录。
          </p>
        </aside>
      </div>

      <div v-else class="panel missing" role="alert">
        <p>没有找到这条路线，可能已被移除。</p>
        <AppButton variant="ghost" @click="router.push('/scanned')">
          返回路线列表
        </AppButton>
      </div>
    </div>

    <div v-if="leavePrompt" class="leave-backdrop" role="dialog" aria-modal="true" aria-labelledby="leave-title">
      <div class="leave-card panel">
        <h2 id="leave-title" class="leave-title">
          跑步还未完成
        </h2>
        <p class="leave-copy">
          离开会中断本次记录。
        </p>
        <div class="leave-actions">
          <AppButton variant="ghost" @click="stayOnPage">
            继续等待
          </AppButton>
          <AppButton variant="danger" @click="leavePage">
            离开页面
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.run {
  display: grid;
  gap: 22px;
}

.run-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 22px;
  align-items: start;
}

.run-side {
  display: grid;
  gap: 14px;
  position: sticky;
  top: calc(var(--head-height) + 18px);
}

.console {
  overflow: hidden;
}

.console-head {
  align-items: flex-start;
  padding: 18px 22px;
}

.console-title {
  font-size: 1.5rem;
  font-weight: 800;
}

.run-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.75rem;
  white-space: nowrap;
}

.run-state-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentcolor;
}

.run-state--running {
  border-color: var(--blue);
  color: var(--blue-strong);
  background: var(--blue-wash);
}

.run-state--done {
  border-color: var(--ok);
  color: var(--ok);
  background: var(--ok-wash);
}

.run-state--error {
  border-color: var(--bad);
  color: var(--bad);
  background: var(--bad-wash);
}

.console-body {
  display: grid;
  gap: 18px;
  padding: 24px 22px 26px;
}

.target-facts {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1.5px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}

.target-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.target-label {
  color: var(--muted);
  font-size: 0.75rem;
}

.target-value {
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 700;
  line-height: 1;
}

.target-value small {
  margin-left: 4px;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 500;
}

.target-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.target-list dt {
  color: var(--muted);
  font-size: 0.75rem;
}

.target-list dd {
  margin: 2px 0 0;
  font-size: 0.78rem;
  font-weight: 600;
}

.warning {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid var(--track);
  border-radius: var(--radius-sm);
  background: var(--track-wash);
  color: var(--ink-2);
  font-size: 0.82rem;
  line-height: 1.65;
}

.warning-flag {
  align-self: flex-start;
  padding: 2px 6px;
  background: var(--track);
  color: #fff;
  font-size: 0.64rem;
  font-weight: 700;
  white-space: nowrap;
}

.running {
  justify-items: center;
  padding-block: 30px 28px;
  background: linear-gradient(var(--blue-wash), transparent 40%), var(--surface);
}

.running-label {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.timer {
  font-size: clamp(4rem, 12vw, 7.4rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.06em;
}

.timer-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  color: var(--muted);
  font-size: 0.75rem;
}

.timer-meta b {
  color: var(--ink);
  font-weight: 600;
}

.lane {
  position: relative;
  width: 100%;
  height: 56px;
  margin-block: 4px;
  overflow: hidden;
  border-block: 1px solid var(--line);
}

.lane-line {
  position: absolute;
  inset-inline: 0;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--line-strong) 0 8px, transparent 8px 16px);
  opacity: 0.35;
}

.lane-line--top {
  top: 18px;
}

.lane-line--bottom {
  bottom: 18px;
}

.lane-runner {
  position: absolute;
  top: 50%;
  left: var(--progress, 0%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--blue);
  box-shadow: 0 0 0 5px var(--blue-wash);
  transform: translate(-50%, -50%);
  transition: left 0.9s linear;
}

.running-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-2);
  font-size: 0.78rem;
}

.running-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ok);
  animation: pulse 1.6s ease-in-out infinite;
}

.result {
  justify-items: center;
  padding-block: 44px;
  text-align: center;
}

.result-mark {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 2px solid currentcolor;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
}

.result--done .result-mark {
  color: var(--ok);
  background: var(--ok-wash);
}

.result--error .result-mark {
  color: var(--bad);
  background: var(--bad-wash);
}

.result-title {
  font-size: 1.6rem;
}

.result-copy {
  max-width: 30em;
  color: var(--ink-2);
  font-size: 0.88rem;
}

.result-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: 100%;
  margin: 6px 0 0;
  background: var(--line);
}

.result-facts > div {
  padding: 12px;
  background: var(--surface);
}

.result-facts dt {
  color: var(--muted);
  font-size: 0.75rem;
}

.result-facts dd {
  margin: 2px 0 0;
  font-size: 0.82rem;
  font-weight: 600;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.map-wrap {
  overflow: hidden;
}

.map-wrap :deep(.route-map) {
  min-height: 300px;
}

.side-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

.side-fact {
  display: grid;
  gap: 2px;
  padding: 12px 14px;
  border-right: 1px solid var(--line);
}

.side-fact:last-child {
  border-right: 0;
}

.side-fact span {
  color: var(--muted);
  font-size: 0.64rem;
}

.side-fact strong {
  font-size: 0.78rem;
}

.side-note {
  color: var(--muted);
  font-size: 0.75rem;
  line-height: 1.6;
}

.missing {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 48px 24px;
  color: var(--ink-2);
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.leave-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgb(7 15 21 / 62%);
}

.leave-card {
  width: min(360px, 100%);
  padding: 22px;
}

.leave-title {
  font-size: 1.2rem;
}

.leave-copy {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.85rem;
}

.leave-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

@media (max-width: 900px) {
  .run-grid {
    grid-template-columns: 1fr;
  }

  .run-side {
    position: static;
  }

  .target-list {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .target-list > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .target-list dd {
    margin: 0;
  }

  .console-body {
    padding: 18px 16px 22px;
  }

  .console-head {
    padding: 16px;
  }

  .timer {
    font-size: clamp(3.6rem, 18vw, 5.2rem);
  }

  .result-facts {
    grid-template-columns: 1fr;
  }

  .result-facts > div {
    display: flex;
    justify-content: space-between;
  }

  .result-facts dd {
    margin: 0;
  }
}
</style>
