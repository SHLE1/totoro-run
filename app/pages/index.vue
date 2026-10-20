<script setup lang="ts">
import type { ScanTicket } from '~/types/session';
import TotoroApiWrapper from '~~/src/wrappers/TotoroApiWrapper';
import { scanStatusSchema, scanTicketSchema } from '~/utils/schemas';

definePageMeta({ name: 'home' });

useHead({ title: '扫码开跑 · 龙猫校园' });

const router = useRouter();
const sessionStore = useSessionStore();

const ticket = ref<ScanTicket | null>(null);
const pending = ref(true);
const busy = ref(false);
const errorMessage = ref('');
const polling = ref(false);

const POLL_INTERVAL = 1500;
const POLL_TIMEOUT = 2 * 60 * 1000;

let pollTimer: ReturnType<typeof setTimeout> | null = null;
let pollStartedAt = 0;
let pollUuid: string | null = null;

const qrState = computed(() => {
  if (pending.value) {
    return 'loading' as const;
  }
  if (errorMessage.value) {
    return 'error' as const;
  }
  if (ticket.value) {
    return 'ready' as const;
  }
  return 'error' as const;
});

function stopPolling() {
  polling.value = false;
  pollUuid = null;
  if (pollTimer !== null) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
}

async function completeLogin(code: string) {
  if (busy.value) {
    return;
  }
  stopPolling();
  busy.value = true;
  errorMessage.value = '';

  try {
    void TotoroApiWrapper.getAppAd(code).catch((error) => {
      console.warn('广告接口失败，忽略:', error);
    });
    const loginResult = await TotoroApiWrapper.getLesseeServer(code);
    if (!loginResult.token) {
      errorMessage.value = loginResult.message || '登录失败，请重新扫码。';
      return;
    }
    const personalInfo = await TotoroApiWrapper.login({ token: loginResult.token });
    if (!personalInfo.token && !personalInfo.stuNumber) {
      errorMessage.value = personalInfo.message || '登录信息获取失败，请重新扫码。';
      return;
    }
    sessionStore.setLogin(personalInfo, loginResult.token, code);
    await router.push('/scanned');
  } catch (error) {
    console.error('登录失败:', error);
    errorMessage.value = '登录请求失败，请检查网络后重试。';
  } finally {
    busy.value = false;
  }
}

async function pollScan(uuid: string) {
  if (!polling.value || pollUuid !== uuid || ticket.value?.uuid !== uuid) {
    return;
  }
  if (Date.now() - pollStartedAt >= POLL_TIMEOUT) {
    stopPolling();
    errorMessage.value = '二维码可能已过期，请点击刷新。';
    return;
  }

  try {
    const result = scanStatusSchema.parse(
      await $fetch(`/api/scanQr/${uuid}`),
    );
    if (result.code) {
      await completeLogin(result.code);
      return;
    }
  } catch (error) {
    console.error('自动检测扫码状态失败:', error);
  }

  pollTimer = setTimeout(() => {
    void pollScan(uuid);
  }, POLL_INTERVAL);
}

function startPolling(uuid: string) {
  stopPolling();
  polling.value = true;
  pollUuid = uuid;
  pollStartedAt = Date.now();
  void pollScan(uuid);
}

async function refreshTicket() {
  stopPolling();
  pending.value = true;
  errorMessage.value = '';
  ticket.value = null;

  try {
    const result = scanTicketSchema.parse(await $fetch('/api/scanQr'));
    ticket.value = result as ScanTicket;
    startPolling(result.uuid);
  } catch (error) {
    console.error('获取二维码失败:', error);
    errorMessage.value = '二维码获取失败，请稍后重试。';
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  void refreshTicket();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<template>
  <div class="page">
    <div class="shell home">
      <StepRail :active="1" />

      <div class="home-grid">
        <section class="pitch" aria-labelledby="home-title">
          <h1 id="home-title" class="pitch-title">
            <span class="pitch-line">扫码，</span>
            <span class="pitch-line pitch-accent">开跑。</span>
          </h1>
          <p class="pitch-lede">
            微信扫码，选路线，开跑。
          </p>

          <div class="notice">
            <span class="notice-flag mono">注意</span>
            <p>开跑后请保持页面在前台。</p>
          </div>

          <NuxtLink v-if="sessionStore.isLoggedIn" to="/scanned" class="resume-link">
            继续上次的路线 →
          </NuxtLink>
        </section>

        <aside class="scan-column">
          <QrConsole
            :state="qrState"
            :image-url="ticket?.imgUrl"
            :message="errorMessage"
            :polling="polling"
            :busy="busy"
            @refresh="refreshTicket"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: grid;
  gap: 22px;
}

.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.8fr);
  gap: 28px;
  align-items: start;
}

.pitch {
  display: grid;
  gap: 20px;
  padding-top: 0;
}

.pitch-title {
  font-size: clamp(2.8rem, 6.4vw, 5.2rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.94;
}

.pitch-line {
  display: inline;
}

.pitch-accent {
  color: var(--blue-strong);
}

@media (min-width: 901px) {
  .pitch-line {
    display: block;
  }
}

.pitch-lede {
  max-width: 30em;
  color: var(--ink-2);
  font-size: 1.02rem;
  line-height: 1.75;
}

.notice {
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

.notice-flag {
  align-self: flex-start;
  padding: 2px 6px;
  background: var(--track);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.resume-link {
  width: fit-content;
  color: var(--blue-strong);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.scan-column {
  display: grid;
  gap: 14px;
  position: sticky;
  top: calc(var(--head-height) + 18px);
}

@media (max-width: 900px) {
  .home {
    gap: 16px;
  }

  .home-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .pitch {
    order: 1;
    gap: 10px;
    padding-top: 0;
  }

  .scan-column {
    order: 2;
    position: static;
  }

  .pitch-title {
    font-size: clamp(2.3rem, 9vw, 3rem);
  }

  .pitch-lede {
    font-size: 0.9rem;
    line-height: 1.6;
  }
}
</style>
