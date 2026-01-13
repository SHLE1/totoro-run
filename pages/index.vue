<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';

const router = useRouter();
const { data, pending, error, refresh } = await useFetch<{ uuid: string; imgUrl: string }>('/api/scanQr');
const message = ref('');
const session = useSession();
const showDialog = ref(true);
const scanLoading = ref(false);

const mouseX = ref(0);
const mouseY = ref(0);

const qrErrorMessage = computed(() => message.value || (error.value ? '二维码获取失败，请稍后重试。' : ''));
const hasQrError = computed(() => !!qrErrorMessage.value);
const hasQrImage = computed(() => !!data.value?.imgUrl);
const canScan = computed(
  () => hasQrImage.value && !pending.value && !scanLoading.value && !hasQrError.value
);

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

const closeDialog = () => {
  showDialog.value = false;
};

const handleRefresh = async () => {
  message.value = '';
  await refresh();
};

const handleQrClick = () => {
  if (pending.value || scanLoading.value) {
    return;
  }
  handleRefresh();
};

const handleScanned = async () => {
  if (scanLoading.value) {
    return;
  }
  const uuid = data.value?.uuid;
  if (!uuid) {
    message.value = '二维码未就绪，请刷新后重试。';
    return;
  }

  scanLoading.value = true;
  message.value = '';

  try {
    const scanRes = await $fetch(`/api/scanQr/${uuid}`);
    const { code, message: scanMessage } = scanRes as { code: string | null; message: string | null };
    if (!code) {
      message.value = scanMessage || '扫码失败，请重试。';
      return;
    }

    const loginResult = (
      await Promise.all([TotoroApiWrapper.getLesseeServer(code), TotoroApiWrapper.getAppAd(code)])
    )[0];
    if (!loginResult.token) {
      message.value = loginResult.message as string;
      return;
    }

    const personalInfo = await TotoroApiWrapper.login({ token: loginResult.token });
    session.value = { ...personalInfo, token: loginResult.token, code, data: null };
    const breq = {
      token: loginResult.token,
      campusId: personalInfo.campusId,
      schoolId: personalInfo.schoolId,
      stuNumber: personalInfo.stuNumber,
    };
    await TotoroApiWrapper.getAppFrontPage(breq);
    await TotoroApiWrapper.getAppSlogan(breq);
    await TotoroApiWrapper.updateAppVersion(breq);
    await TotoroApiWrapper.getAppNotice(breq);
    router.push('/scanned');
  } catch (e) {
    console.error(e);
    message.value = '龙猫服务器错误';
  } finally {
    scanLoading.value = false;
  }
};
</script>

<template>
  <div class="page-container flex justify-start" @mousemove="handleMouseMove">
    <div
      class="cursor-glow"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
      aria-hidden="true"
    ></div>

    <v-dialog
      v-model="showDialog"
      persistent
      max-width="420"
      :scrim="true"
      aria-labelledby="welcome-dialog-title"
      aria-describedby="welcome-dialog-desc"
    >
      <v-card class="dialog-card" role="alertdialog">
        <v-card-title id="welcome-dialog-title" class="dialog-title">
          <span class="mdi mdi-hand-wave dialog-icon" aria-hidden="true"></span> 欢迎使用
        </v-card-title>
        <v-card-text id="welcome-dialog-desc" class="dialog-text">
          <p>这是一个<strong>完全免费</strong>的公益项目。</p>
          <p class="mt-2 text-hint">如遇失败请稍后重试，可能是服务器繁忙或正在维护。</p>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn color="primary" block variant="flat" class="ui-btn" @click="closeDialog">
            开始使用
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <main class="main-content">
      <header class="hero-section">
        <h1 class="hero-title">龙猫校园助手</h1>
        <p class="hero-subtitle">简单三步，轻松完成校园跑</p>
      </header>

      <StepIndicator :active-step="1" />

      <UiCard class="scan-section">
        <VCard
          class="qr-code-card"
          elevation="0"
          role="button"
          tabindex="0"
          :class="{ 'qr-disabled': pending }"
          :aria-disabled="pending"
          :aria-label="pending ? '二维码生成中' : '点击刷新二维码'"
          @click="handleQrClick"
          @keydown.enter.prevent="handleQrClick"
          @keydown.space.prevent="handleQrClick"
        >
          <div class="qr-refresh-hint" aria-hidden="true">点击刷新二维码</div>
          <button
            class="refresh-icon-btn"
            type="button"
            :disabled="pending"
            aria-label="刷新二维码"
            @click="handleRefresh"
          >
            <span class="mdi mdi-refresh" aria-hidden="true"></span>
          </button>
          <div v-if="pending" class="qr-placeholder" aria-busy="true">
            <VProgressCircular indeterminate size="36" color="primary" />
            <span class="qr-status">二维码生成中...</span>
          </div>
          <div v-else-if="hasQrError" class="qr-message" role="alert" aria-live="polite">
            {{ qrErrorMessage }}
          </div>
          <img
            v-else
            :src="data?.imgUrl"
            class="qr-image"
            referrerpolicy="no-referrer"
            alt="微信扫码登录二维码"
          />
        </VCard>

        <p class="scan-hint">请使用<strong>微信</strong>扫描上方二维码</p>

        <div class="scan-actions">
          <VBtn
            color="cta"
            class="ui-btn next-btn"
            append-icon="i-mdi-arrow-right"
            :loading="scanLoading"
            :disabled="!canScan"
            @click="handleScanned"
          >
            <strong>扫码完成，下一步</strong>
          </VBtn>
        </div>
      </UiCard>

      <footer class="footer-section">
        <div class="footer-badge">
          <span class="mdi mdi-lightning-bolt badge-icon" aria-hidden="true"></span>
          <span>完全免费 &bull; 开源项目</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px 16px 40px;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    var(--ui-surface-muted) 0%,
    var(--ui-surface-strong) 50%,
    var(--ui-surface-muted) 100%
  );
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.cursor-glow {
  position: fixed;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(var(--ui-primary), 0.18) 0%,
    rgba(var(--ui-primary), 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: left 0.1s ease-out, top 0.1s ease-out;
}

.main-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 8px;
  padding-top: 16px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--ui-text);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--ui-text-muted);
  font-weight: 400;
}

.scan-section {
  border-radius: var(--ui-radius-xl);
  text-align: center;
  box-shadow: var(--ui-shadow-card);
  padding: 24px;
}

.qr-code-card {
  width: 220px;
  height: 220px;
  margin: 0 auto 12px;
  border-radius: var(--ui-radius-lg) !important;
  overflow: hidden;
  background: var(--ui-surface-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  padding: 0;
}

.qr-code-card.qr-disabled {
  cursor: not-allowed;
}

.qr-refresh-hint {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.qr-code-card:hover .qr-refresh-hint,
.qr-code-card:focus-visible .qr-refresh-hint {
  opacity: 1;
}

.qr-code-card:focus-visible {
  outline: none;
  box-shadow: var(--ui-ring);
}

.qr-code-card.qr-disabled .qr-refresh-hint {
  opacity: 0;
}

.refresh-icon-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: rgb(var(--ui-primary));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.refresh-icon-btn:hover:not(:disabled) {
  background: rgb(var(--ui-primary));
  color: white;
  transform: rotate(90deg);
}

.refresh-icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon-btn .mdi {
  font-size: 18px;
}

@media (hover: hover) {
  .qr-refresh-hint {
    opacity: 0;
  }
}

@media (hover: none) {
  .qr-refresh-hint {
    display: none;
  }
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  color: var(--ui-text-muted);
  font-size: 0.85rem;
}

.qr-status {
  font-size: 0.85rem;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-message {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--ui-danger));
  font-weight: 600;
  padding: 16px;
  text-align: center;
}

.scan-hint {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--ui-text-muted);
}

.scan-hint strong {
  color: rgb(var(--ui-success));
}

.scan-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.next-btn {
  min-width: 200px;
}

.footer-section {
  text-align: center;
}

.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(var(--ui-primary), 0.1);
  color: rgb(var(--ui-primary));
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-icon {
  font-size: 1rem;
}

:deep(.dialog-card) {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-title {
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  padding: 20px 20px 8px !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-icon {
  font-size: 1.4rem;
  color: rgb(var(--ui-primary));
}

:deep(.dialog-text) {
  font-size: 0.95rem !important;
  color: var(--ui-text-subtle);
  padding: 8px 20px 16px !important;
  line-height: 1.6;
}

.text-hint {
  font-size: 0.85rem !important;
  color: var(--ui-text-muted);
}

:deep(.dialog-actions) {
  padding: 8px 20px 20px !important;
}

@media (max-width: 480px) {
  .hero-section {
    padding-top: 8px;
  }

  .page-container {
    padding-bottom: 32px;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .qr-code-card {
    width: 190px;
    height: 190px;
  }

  .cursor-glow {
    display: none;
  }
}
</style>
