<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHead } from '@vueuse/head';
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';

const router = useRouter();
const { data } = await useFetch<{ uuid: string; imgUrl: string }>('/api/scanQr');
const message = ref('');
const session = useSession();
const showDialog = ref(true);
const loading = ref(false); // 添加加载状态

useHead({
  script: [
    {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=G-KEFCFSXRWJ',
    },
    {
      type: 'text/javascript',
      innerHTML: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KEFCFSXRWJ');
            `,
    },
  ],
});

const closeDialog = () => {
  showDialog.value = false;
};

onMounted(async () => {
  // 加载其他脚本
  const yinghuaScript = document.createElement('script');
  yinghuaScript.src = 'https://cdn.jsdelivr.net/gh/mocchen/cssmeihua/js/yinghua.js';
  document.body.appendChild(yinghuaScript);

  const aixinScript = document.createElement('script');
  aixinScript.src = 'https://cdn.jsdelivr.net/gh/mocchen/cssmeihua/js/aixin.js';
  document.body.appendChild(aixinScript);

  const yanhuabowenScript = document.createElement('script');
  yanhuabowenScript.src = 'https://cdn.jsdelivr.net/gh/mocchen/cssmeihua/js/yanhuabowen.js';
  document.body.appendChild(yanhuabowenScript);

  const xiaoxingxingScript = document.createElement('script');
  xiaoxingxingScript.src = 'https://cdn.jsdelivr.net/gh/mocchen/cssmeihua/js/xiaoxingxing.js';
  document.body.appendChild(xiaoxingxingScript);
});

const handleScanned = async () => {
  loading.value = true; // 开始加载
  try {
    const scanRes = await $fetch(`/api/scanQr/${data!.value!.uuid}`);
    const code = (scanRes as { code: string; message: null } | { code: null; message: string })
      .code as string;
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
  } finally {
    loading.value = false; // 结束加载
  }
};
</script>

<template>
  <v-container fluid class="page-container">
    <v-dialog v-model="showDialog" persistent max-width="560" :scrim="true">
      <v-card class="dialog-card">
        <v-card-item class="dialog-content">
          <v-card-title class="dialog-title">
            温馨提示
          </v-card-title>
          <v-card-text class="dialog-text">
            <p class="primary-text">免费服务，能用就行，不能用多试试，能用就多推广一下</p>
            <p class="subtitle-text text-center">如果运行失败，可能是：</p>
            <ul class="reason-list">
              <li>为了防止滥用，我们限制并发<br>
                所以如果有人在和你同时使用，可能只有一个会成功</li>
              <li>你运气很好，刚好遇到我们的维护时间</li>
            </ul>
          </v-card-text>
        </v-card-item>
        <v-card-actions class="dialog-actions">
          <v-btn color="primary" block @click="closeDialog" class="confirm-button">
            <v-icon start icon="mdi-check-circle" class="mr-2"></v-icon>
            我已阅读并知晓上述内容
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <div class="scan-container">
          <p class="text-center text-body-1 scan-instruction">
            请使用微信扫码，扫码后点击“下一步”按钮
          </p>
          <VCard class="qr-code-card">
            <img v-if="!message" :src="data!.imgUrl" class="w-100" referrerpolicy="no-referrer" />
            <div v-else class="h-100 w-100 flex items-center justify-center">
              {{ message }}
            </div>
          </VCard>
          <div class="mt-4 flex justify-center">
            <VBtn x-large color="primary" append-icon="i-mdi-arrow-right" :loading="loading" @click="handleScanned">
              下一步
            </VBtn>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <div class="promo-container mt-8">
          <div class="promo-text text-center text-h6 font-weight-bold">
            如果此项目对你有所帮助<br>
            ChatGPT，国内可用，低价直连
          </div>
          <div class="promo-text text-center text-h6 font-weight-bold">
            点击免费体验：<a href="https://chat.aigoo.xyz" target="_blank" class="promo-link">FFchat</a>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <div class="promo-container mt-8">
          <div class="promo-text text-center text-h6 font-weight-bold">
            本项目完全开源<br>
            衍生自<a href="https://github.com/BeiyanYunyi/totoro-paradise" target="_blank">GitHub</a><br>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 鼠标特效 - 小星星拖尾 -->
    <span class="js-cursor-container"></span>
  </v-container>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 16px;
  background: url('https://t.alcy.cc/ycy') no-repeat center center fixed;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.scan-container {
  text-align: center;
  margin-top: 20px;
  margin-bottom: -10px;
}

.qr-code-card {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  25% {
    background-position: 100% 0%;
  }

  50% {
    background-position: 50% 100%;
  }

  75% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 50%;
  }
}

.promo-container {
  border: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
  margin-top: -50px;
  margin-bottom: 20px;
  transition: transform 1s ease-in-out;
  background: radial-gradient(circle, #a8d8ea, #aa96da, #a1e3d8, #fcbad3, #ffffd2);
  background-size: 400% 400%;
  animation: gradient 15s linear infinite;
}

.promo-container:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.promo-text {
  font-size: 1.25rem;
  color: #333;
}

.promo-link {
  color: #013569;
  text-decoration: none;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px;
  border-radius: 15px;
}

.scan-instruction {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  color: #333;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
  margin-top: 20px;
  margin-bottom: 20px;
}

.scan-instruction:hover {
  transform: scale(1.05);
}

.text-button {
  font-size: 1.1rem !important;
  font-weight: bold !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  transition: transform 0.2s ease;
}

.text-button:hover {
  transform: scale(1.05);
}

:deep(.v-dialog) {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px !important;
}

:deep(.dialog-card) {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

:deep(.dialog-content) {
  padding: 32px 40px 24px !important;
}

:deep(.dialog-title) {
  font-size: 2rem !important;
  font-weight: 600 !important;
  color: #333;
  text-align: center;
  margin-bottom: 24px !important;
  line-height: 1.4;
}

:deep(.dialog-text) {
  font-size: 1.1rem !important;
  line-height: 1.8;
  color: #555;
}

.primary-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1976d2;
  text-align: center;
  margin-bottom: 32px;
}

.subtitle-text {
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

:deep(.reason-list) {
  list-style: none;
  padding-left: 0;
  margin: 16px 0;
}

:deep(.reason-list li) {
  position: relative;
  padding-left: 24px;
  margin-bottom: 16px;
  line-height: 1.6;
}

:deep(.reason-list li::before) {
  content: '•';
  position: absolute;
  left: 8px;
  color: #1976d2;
  font-size: 1.2em;
}

:deep(.dialog-actions) {
  padding: 0 40px 32px !important;
}

.confirm-button {
  height: 48px !important;
  font-size: 1.1rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  text-transform: none !important;
  border-radius: 8px !important;
  transition: transform 0.2s ease;
}

.confirm-button:hover {
  transform: translateY(-2px);
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

:deep(.dialog-card) {
  background: linear-gradient(45deg,
      rgba(255, 255, 255, 0.95),
      rgba(240, 247, 255, 0.95)) !important;
  background-size: 200% 200% !important;
  animation: gradientBG 15s ease infinite;
}
</style>
