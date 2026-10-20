<script setup lang="ts">
import TotoroApiWrapper from '~~/src/wrappers/TotoroApiWrapper';

definePageMeta({ name: 'confirm-route' });

useHead({ title: '确认路线 · 龙猫校园' });

const router = useRouter();
const sessionStore = useSessionStore();
const paper = computed(() => sessionStore.paper);
const selected = ref<string | null>(null);
const loading = ref(!sessionStore.paper);
const loadError = ref('');

if (!sessionStore.isLoggedIn) {
  await navigateTo('/');
}

async function loadPaper() {
  const basic = sessionStore.basicRequest;
  if (!basic) {
    await navigateTo('/');
    return;
  }
  loading.value = true;
  loadError.value = '';
  try {
    const result = await TotoroApiWrapper.getSunRunPaper(basic);
    sessionStore.paper = result;
    selected.value ??= result.runPointList[0]?.pointId ?? null;
  } catch (error) {
    console.error('获取跑步配置失败:', error);
    loadError.value = '跑步配置获取失败，请检查网络后重试。';
  } finally {
    loading.value = false;
  }
}

if (!paper.value && sessionStore.isLoggedIn) {
  await loadPaper();
} else {
  selected.value = paper.value?.runPointList[0]?.pointId ?? null;
}

const selectedRoute = computed(
  () => paper.value?.runPointList.find((route) => route.pointId === selected.value) ?? null,
);

function pickRandomRoute() {
  const list = paper.value?.runPointList ?? [];
  if (list.length === 0) {
    return;
  }
  selected.value = list[Math.floor(Math.random() * list.length)]!.pointId;
}

const canStart = computed(() => Boolean(selected.value) && !loading.value && !loadError.value);

function startRun() {
  if (!selected.value) {
    return;
  }
  void router.push(`/run/${encodeURIComponent(selected.value)}`);
}
</script>

<template>
  <div class="page">
    <div class="shell confirm">
      <StepRail :active="2" :completed="[1]" />

      <div v-if="loading" class="state-panel panel" role="status">
        <span class="state-mark mono" aria-hidden="true">…</span>
        <p>正在读取本学期的跑步任务</p>
      </div>

      <div v-else-if="loadError" class="state-panel panel state-panel--alert" role="alert">
        <span class="state-mark mono" aria-hidden="true">!</span>
        <p>{{ loadError }}</p>
        <div class="state-actions">
          <AppButton variant="ghost" @click="loadPaper">
            重试
          </AppButton>
          <AppButton variant="quiet" @click="router.push('/')">
            返回首页
          </AppButton>
        </div>
      </div>

      <div v-else-if="paper" class="confirm-grid">
        <div class="confirm-main">
          <section class="panel profile" aria-labelledby="profile-title">
            <header class="panel-head">
              <h2 id="profile-title" class="panel-title">
                登录信息
              </h2>
              <span class="profile-state">
                <span class="profile-dot" aria-hidden="true" />
                已验证
              </span>
            </header>
            <dl class="profile-grid">
              <div>
                <dt>姓名</dt>
                <dd>{{ sessionStore.session?.stuName || '—' }}</dd>
              </div>
              <div>
                <dt>学号</dt>
                <dd class="mono">
                  {{ sessionStore.session?.stuNumber || '—' }}
                </dd>
              </div>
              <div>
                <dt>学校</dt>
                <dd>{{ sessionStore.session?.schoolName || sessionStore.session?.campusName || '—' }}</dd>
              </div>
              <div>
                <dt>学院</dt>
                <dd>{{ sessionStore.session?.collegeName || '—' }}</dd>
              </div>
            </dl>
          </section>

          <section class="panel routes" aria-labelledby="routes-title">
            <header class="panel-head">
              <h2 id="routes-title" class="panel-title">
                选择路线
              </h2>
              <button type="button" class="random-link" @click="pickRandomRoute">
                随机挑一条
              </button>
            </header>

            <div v-if="paper.runPointList.length" class="route-list" role="radiogroup" aria-labelledby="routes-title">
              <label
                v-for="(route, index) in paper.runPointList"
                :key="route.pointId"
                class="route-item"
                :class="{ 'route-item--active': selected === route.pointId }"
              >
                <input
                  v-model="selected"
                  class="route-input"
                  type="radio"
                  name="run-route"
                  :value="route.pointId"
                >
                <span class="route-index mono" aria-hidden="true">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="route-copy">
                  <strong>{{ route.pointName }}</strong>
                  <small>{{ route.pointList.length }} 个途经点</small>
                </span>
                <span class="route-check" aria-hidden="true">
                  {{ selected === route.pointId ? '✓' : '' }}
                </span>
              </label>
            </div>

            <p v-else class="route-empty">
              当前学期没有可用路线，请稍后再试。
            </p>

            <div class="route-meta">
              <span class="mono">目标 {{ paper.mileage }} km</span>
              <span class="mono">用时 {{ paper.minTime }}–{{ paper.maxTime }} 分钟</span>
              <span class="mono">有效期至 {{ paper.endDate }}</span>
            </div>
          </section>
        </div>

        <aside class="confirm-side">
          <section class="panel map-panel" aria-labelledby="map-title">
            <header class="panel-head">
              <h2 id="map-title" class="panel-title">
                路线预览
              </h2>
            </header>
            <div class="map-wrap">
              <ClientOnly>
                <RouteMap v-if="selected" :target="selected" />
                <div v-else class="map-placeholder">
                  选择一条路线后显示地图
                </div>
              </ClientOnly>
            </div>
          </section>

          <section class="panel summary" aria-labelledby="summary-title">
            <header class="panel-head">
              <h2 id="summary-title" class="panel-title">
                本次任务
              </h2>
              <span class="summary-state mono">{{ selectedRoute ? '就绪' : '待选择' }}</span>
            </header>
            <div class="summary-body">
              <p class="summary-route">
                {{ selectedRoute?.pointName || '还没有选择路线' }}
              </p>
              <dl class="summary-facts">
                <div>
                  <dt>里程</dt><dd class="mono">
                    {{ paper.mileage }} km
                  </dd>
                </div>
                <div>
                  <dt>用时</dt><dd class="mono">
                    {{ paper.minTime }}–{{ paper.maxTime }} 分
                  </dd>
                </div>
                <div>
                  <dt>速度</dt><dd class="mono">
                    {{ paper.minSpeed }}–{{ paper.maxSpeed }}
                  </dd>
                </div>
              </dl>
              <AppButton variant="primary" size="lg" block :disabled="!canStart" @click="startRun">
                确认开跑
              </AppButton>
              <p class="summary-hint">
                开跑后请保持页面在前台。
              </p>
            </div>
          </section>
        </aside>
      </div>

      <div v-if="paper && !loading && !loadError" class="mobile-bar">
        <div class="mobile-bar-copy">
          <span class="mobile-bar-label">已选路线</span>
          <strong>{{ selectedRoute?.pointName || '待选择' }}</strong>
          <span class="mobile-bar-meta mono">{{ paper.mileage }} km · {{ paper.minTime }}–{{ paper.maxTime }} 分</span>
        </div>
        <AppButton variant="primary" :disabled="!canStart" @click="startRun">
          开跑
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm {
  display: grid;
  gap: 22px;
}

.confirm-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
  gap: 22px;
  align-items: start;
}

.confirm-main,
.confirm-side {
  display: grid;
  gap: 18px;
}

.confirm-side {
  position: sticky;
  top: calc(var(--head-height) + 18px);
}

.profile-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ok);
  font-size: 0.75rem;
}

.profile-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 0 4px var(--ok-wash);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  background: var(--line);
}

.profile-grid > div {
  padding: 14px 18px;
  background: var(--surface);
}

.profile-grid dt {
  color: var(--muted);
  font-size: 0.75rem;
}

.profile-grid dd {
  margin: 2px 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.random-link {
  border: 0;
  background: none;
  color: var(--blue-strong);
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.route-list {
  display: grid;
}

.route-item {
  position: relative;
  display: grid;
  grid-template-columns: 40px 1fr 24px;
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: background-color 140ms ease;
}

.route-item:last-child {
  border-bottom: 0;
}

.route-item:hover {
  background: var(--surface-2);
}

.route-item--active {
  background: var(--blue-wash);
}

.route-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.route-input:focus-visible + .route-index {
  outline: 2px solid var(--blue);
  outline-offset: 3px;
}

.route-index {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.route-item--active .route-index {
  color: var(--blue-strong);
}

.route-copy strong,
.route-copy small {
  display: block;
}

.route-copy strong {
  font-size: 0.95rem;
}

.route-copy small {
  color: var(--muted);
  font-size: 0.75rem;
}

.route-check {
  color: var(--blue-strong);
  font-weight: 700;
  text-align: right;
}

.route-empty {
  padding: 24px 18px;
  color: var(--muted);
  font-size: 0.85rem;
}

.route-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: 12px 18px;
  border-top: 1.5px solid var(--line);
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.75rem;
}

.map-wrap {
  position: relative;
  overflow: hidden;
}

.map-placeholder {
  display: grid;
  min-height: 340px;
  place-items: center;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 0.85rem;
}

.summary-state {
  color: var(--blue-strong);
  font-size: 0.75rem;
}

.summary-body {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.summary-route {
  font-size: 1.15rem;
  font-weight: 700;
}

.summary-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin: 0;
  background: var(--line);
}

.summary-facts > div {
  padding: 10px 12px;
  background: var(--surface);
}

.summary-facts dt {
  color: var(--muted);
  font-size: 0.75rem;
}

.summary-facts dd {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
}

.summary-hint {
  color: var(--muted);
  font-size: 0.75rem;
  text-align: center;
}

.state-panel {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 48px 24px;
  color: var(--ink-2);
  text-align: center;
}

.state-panel--alert {
  border-color: var(--bad);
  background: var(--bad-wash);
}

.state-mark {
  font-size: 1.8rem;
  color: var(--blue);
}

.state-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.mobile-bar {
  display: none;
}

@media (max-width: 900px) {
  .confirm-grid {
    grid-template-columns: 1fr;
  }

  .confirm-side {
    position: static;
  }

  .summary {
    display: none;
  }

  .profile-grid > div {
    padding: 10px 12px;
  }

  .map-placeholder,
  .map-wrap :deep(.route-map) {
    min-height: 280px;
  }

  .mobile-bar {
    position: sticky;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 -12px;
    padding: 12px calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom))
      calc(12px + env(safe-area-inset-left));
    border-top: 1.5px solid var(--line-strong);
    background: var(--surface);
  }

  .mobile-bar-copy {
    display: grid;
    gap: 1px;
    min-width: 0;
  }

  .mobile-bar-label {
    color: var(--muted);
    font-size: 0.75rem;
  }

  .mobile-bar-meta {
    color: var(--muted);
    font-size: 0.72rem;
  }

  .mobile-bar-copy strong {
    overflow: hidden;
    font-size: 0.88rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
