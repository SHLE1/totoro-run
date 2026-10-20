<script setup lang="ts">
type QrState = 'loading' | 'ready' | 'error' | 'expired';

const props = withDefaults(
  defineProps<{
    state?: QrState;
    imageUrl?: string;
    message?: string;
    polling?: boolean;
    busy?: boolean;
  }>(),
  {
    state: 'loading',
    imageUrl: '',
    message: '',
    polling: false,
    busy: false,
  },
);

const emit = defineEmits<{ refresh: [] }>();

const statusText = computed(() => {
  if (props.busy) {
    return '登录中';
  }
  if (props.state === 'error') {
    return '获取失败';
  }
  if (props.state === 'expired') {
    return '二维码过期';
  }
  if (props.state === 'ready') {
    return props.polling ? '等待扫码' : '待刷新';
  }
  return '生成中';
});
</script>

<template>
  <section class="qr-panel panel" aria-labelledby="qr-title">
    <header class="panel-head">
      <h2 id="qr-title" class="panel-title">
        扫码登录
      </h2>
      <span class="qr-state" :class="`qr-state--${state}`">
        <span class="qr-dot" aria-hidden="true" />
        {{ statusText }}
      </span>
    </header>

    <div class="qr-body">
      <button
        type="button"
        class="qr-stage"
        :class="{ 'qr-stage--busy': busy }"
        :aria-label="state === 'ready' ? '刷新二维码' : '重新获取二维码'"
        :aria-busy="state === 'loading' || busy || undefined"
        @click="emit('refresh')"
      >
        <span class="corner corner--tl" aria-hidden="true" />
        <span class="corner corner--tr" aria-hidden="true" />
        <span class="corner corner--bl" aria-hidden="true" />
        <span class="corner corner--br" aria-hidden="true" />

        <div v-if="state === 'loading'" class="qr-fallback" role="status">
          <span class="qr-loader" aria-hidden="true" />
          <span>正在生成二维码</span>
        </div>

        <div v-else-if="state === 'error' || state === 'expired'" class="qr-fallback qr-fallback--alert" role="alert">
          <span class="qr-alert-mark mono" aria-hidden="true">!</span>
          <span>{{ message || '二维码不可用，请重试' }}</span>
        </div>

        <template v-else>
          <img
            v-if="imageUrl"
            class="qr-image"
            :src="imageUrl"
            referrerpolicy="no-referrer"
            alt="微信扫码登录二维码"
          >
          <span class="qr-hover-hint">点击刷新</span>
          <span v-if="polling" class="scan-line" aria-hidden="true" />
        </template>
      </button>

      <p class="qr-help">
        <strong>微信</strong>扫码登录
      </p>

      <div class="qr-meta">
        <span class="mono">{{ polling ? '自动检测已开启' : '自动检测未开启' }}</span>
        <span class="mono">有效期 2 分钟</span>
      </div>

      <AppButton
        variant="primary"
        size="lg"
        block
        :loading="busy"
        :disabled="state === 'loading'"
        @click="emit('refresh')"
      >
        {{ state === 'ready' && polling ? '刷新二维码' : '获取二维码' }}
      </AppButton>
    </div>
  </section>
</template>

<style scoped>
.qr-panel {
  overflow: hidden;
}

.qr-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 0.75rem;
  white-space: nowrap;
}

.qr-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--muted);
}

.qr-state--ready .qr-dot {
  background: var(--ok);
  box-shadow: 0 0 0 4px var(--ok-wash);
}

.qr-state--expired .qr-dot,
.qr-state--error .qr-dot {
  background: var(--bad);
  box-shadow: 0 0 0 4px var(--bad-wash);
}

.qr-state--loading .qr-dot {
  background: var(--blue);
  animation: pulse 1.4s ease-in-out infinite;
}

.qr-body {
  display: grid;
  gap: 14px;
  padding: 22px;
}

.qr-stage {
  position: relative;
  display: grid;
  width: min(100%, 300px);
  aspect-ratio: 1;
  margin-inline: auto;
  place-items: center;
  padding: 14px;
  overflow: hidden;
  border: 0;
  background: var(--surface-2);
  cursor: pointer;
}

.qr-image {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  object-fit: contain;
  background: #fff;
}

.corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 3px solid var(--blue);
  pointer-events: none;
}

.corner--tl {
  top: 4px;
  left: 4px;
  border-right: 0;
  border-bottom: 0;
}

.corner--tr {
  top: 4px;
  right: 4px;
  border-left: 0;
  border-bottom: 0;
}

.corner--bl {
  bottom: 4px;
  left: 4px;
  border-top: 0;
  border-right: 0;
}

.corner--br {
  right: 4px;
  bottom: 4px;
  border-top: 0;
  border-left: 0;
}

.qr-hover-hint {
  position: absolute;
  inset: auto 0 0;
  padding: 8px;
  background: rgb(12 26 36 / 78%);
  color: #fff;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 150ms ease;
}

.qr-stage:hover .qr-hover-hint,
.qr-stage:focus-visible .qr-hover-hint {
  opacity: 1;
}

.scan-line {
  position: absolute;
  top: 14%;
  left: 8%;
  width: 84%;
  height: 2px;
  background: var(--blue);
  box-shadow: 0 0 10px var(--blue);
  animation: scan 2.4s ease-in-out infinite;
}

.qr-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.82rem;
  text-align: center;
}

.qr-fallback--alert {
  color: var(--bad);
}

.qr-loader {
  width: 26px;
  height: 26px;
  border: 3px solid var(--line);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: btn-spin 0.9s linear infinite;
}

.qr-alert-mark {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1.5px solid currentcolor;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 700;
}

.qr-help {
  color: var(--ink-2);
  font-size: 0.85rem;
  text-align: center;
}

.qr-help strong {
  color: var(--ok);
}

.qr-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
  font-size: 0.75rem;
}

@keyframes scan {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  50% {
    transform: translateY(230px);
    opacity: 0.9;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .qr-body {
    padding: 16px;
  }

  .qr-stage {
    width: min(100%, 250px);
  }
}
</style>
