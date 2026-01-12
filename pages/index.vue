<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';

const router = useRouter();
const { data } = await useFetch<{ uuid: string; imgUrl: string }>('/api/scanQr');
const message = ref('');
const session = useSession();

// 弹窗控制变量
const showDialog = ref(true);

// 鼠标跟随光圈
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

const closeDialog = () => {
  showDialog.value = false;
};

const handleScanned = async () => {
  const scanRes = await $fetch(`/api/scanQr/${data!.value!.uuid}`);
  const code = (scanRes as { code: string; message: null } | { code: null; message: string })
    .code as string;
  try {
    const loginResult = (
      await Promise.all([TotoroApiWrapper.getLesseeServer(code), TotoroApiWrapper.getAppAd(code)])
    )[0];
    if (!loginResult.token) {
      message.value = loginResult.message as string;
      return;
    }
    // 获取额外信息
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
  }
};
</script>



<template>
  <div class="page-container flex justify-center items-center" @mousemove="handleMouseMove">
    <!-- 鼠标跟随光圈 -->
    <div
      class="cursor-glow"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
    ></div>

    <v-dialog v-model="showDialog" persistent max-width="420" :scrim="true">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <span class="dialog-icon">&#128075;</span> 欢迎使用
        </v-card-title>
        <v-card-text class="dialog-text">
          <p>这是一个<strong>完全免费</strong>的公益项目。</p>
          <p class="mt-2 text-hint">如遇失败请稍后重试，可能是服务器繁忙或正在维护。</p>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn color="primary" block variant="flat" @click="closeDialog">
            开始使用
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="main-content">
      <!-- 标题区域 -->
      <div class="hero-section">
        <h1 class="hero-title">龙猫校园助手</h1>
        <p class="hero-subtitle">简单三步，轻松完成校园跑</p>
      </div>

      <!-- 扫码区域 -->
      <div class="scan-section">
        <div class="step-indicator">
          <div class="step active">
            <span class="step-num">1</span>
            <span class="step-text">扫码</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">2</span>
            <span class="step-text">确认</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">3</span>
            <span class="step-text">完成</span>
          </div>
        </div>

        <VCard class="qr-code-card" elevation="4">
          <img v-if="!message" :src="data!.imgUrl" class="qr-image" referrerpolicy="no-referrer" />
          <div v-else class="qr-message">
            {{ message }}
          </div>
        </VCard>

        <p class="scan-hint">请使用<strong>微信</strong>扫描上方二维码</p>

        <VBtn
          size="large"
          color="primary"
          class="next-btn"
          append-icon="i-mdi-arrow-right"
          @click="handleScanned"
        >
          <strong>扫码完成，下一步</strong>
        </VBtn>
      </div>

      <!-- 底部信息 -->
      <div class="footer-section">
        <div class="footer-badge">
          <span class="badge-icon">&#9889;</span>
          <span>完全免费 &bull; 开源项目</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 16px;
  flex-direction: column;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #f0f4f8 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 鼠标跟随光圈 */
.cursor-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: left 0.1s ease-out, top 0.1s ease-out;
}

.main-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

/* 标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 20px;
  padding-top: 64px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 400;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
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
  transition: all 0.3s ease;
}

.step.active .step-num {
  background: #3b82f6;
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.step-text {
  font-size: 0.75rem;
  color: #94a3b8;
}

.step.active .step-text {
  color: #3b82f6;
  font-weight: 600;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e2e8f0;
  margin-bottom: 18px;
}

/* 扫码区域 */
.scan-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.qr-code-card {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 12px !important;
  overflow: hidden;
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
  color: #ef4444;
  font-weight: 600;
  padding: 16px;
}

.scan-hint {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #64748b;
}

.scan-hint strong {
  color: #22c55e;
}

.next-btn {
  margin-top: 20px;
  padding: 0 32px;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 24px;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* 底部信息 */
.footer-section {
  margin-top: 32px;
  text-align: center;
}

.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.badge-icon {
  font-size: 1rem;
}

/* 弹窗样式 */
:deep(.dialog-card) {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-title {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  padding: 20px 20px 8px !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-icon {
  font-size: 1.5rem;
}

:deep(.dialog-text) {
  font-size: 0.95rem !important;
  color: #475569;
  padding: 8px 20px 16px !important;
  line-height: 1.6;
}

.text-hint {
  font-size: 0.85rem !important;
  color: #94a3b8;
}

:deep(.dialog-actions) {
  padding: 8px 20px 20px !important;
}

/* 响应式 */
@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .scan-section {
    padding: 20px 16px;
  }

  .qr-code-card {
    width: 180px;
    height: 180px;
  }

  .cursor-glow {
    display: none;
  }
}
</style>