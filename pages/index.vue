<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';
import { onMounted, ref } from 'vue';

const router = useRouter();
const { data } = await useFetch<{ uuid: string; imgUrl: string }>('/api/scanQr');
const message = ref('');
const session = useSession();

// 弹窗控制变量
const showDialog = ref(true);

const closeDialog = () => {
  showDialog.value = false;
};

onMounted(() => {
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-KEFCFSXRWJ';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-KEFCFSXRWJ');
  `;
  document.head.appendChild(script2);
});

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
  <div class="page-container flex justify-center items-center">
    <v-dialog v-model="showDialog" persistent max-width="560" :scrim="true">
      <v-card class="dialog-card">
        <v-card-item class="dialog-content">
          <v-card-title class="dialog-title">
            温馨提示
          </v-card-title>
          <v-card-text class="dialog-text">
            <p class="primary-text">免费服务，失败请重试，能用就多推广一下</p>
            <p class="subtitle-text text-center">如果运行失败，可能是：</p>
            <ul class="reason-list">
              <li>为了防止滥用，可能限制并发<br>
                所以如果有人在和你同时使用，可能只有一个会成功</li>
              <li>你运气很好，刚好遇到维护时间</li>
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

    <div class="scan-container">
      <p class="text-center text-body-1 scan-instruction">
        请用微信扫码，扫码后点击“下一步”按钮<br />
        积极传播，杜绝无良商家！
      </p>
      <VCard class="qr-code-card">
        <img v-if="!message" :src="data!.imgUrl" class="w-100" referrerpolicy="no-referrer" />
        <div v-else class="h-100 w-100 flex items-center justify-center">
          {{ message }}
        </div>
      </VCard>
      <div class="mt-4 flex justify-center">
        <VBtn x-large color="primary" append-icon="i-mdi-arrow-right" @click="handleScanned"> 下一步 </VBtn>
      </div>
    </div>


<div class="promo-container mt-8">
      <div class="promo-text text-center text-h6 font-weight-bold">
        本项目完全公益，没有任何收费<br>
        没有任何广告，因为插不了<br>
        作者已经毕业，欢迎fork接手
      </div>
    </div>



    <div class="promo-container mt-8">
      <div class="promo-text text-center text-h6 font-weight-bold">
        本项目完全开源<br>
        衍生自<a href="https://github.com/BeiyanYunyi/totoro-paradise" target="_blank">GitHub</a><br>
      </div>
    </div>


    <!-- 鼠标特效 - 小星星拖尾 -->
    <span class="js-cursor-container"></span>
  </div>
</template>

<script lang="ts">
export default {
  mounted() {
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
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 16px;
  flex-direction: column;
  background: url('https://t.alcy.cc/ycy') no-repeat center center fixed;
  background-size: cover;
  position: fixed;
  /* 添加固定定位 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  /* 添加滚动条 */
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
  /* 鼠标悬停时放大元素 */
  transform: scale(1.05);
  /* 添加阴影效果 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.promo-text {
  font-size: 1.25rem;
  /* 增大字体大小 */
  color: #333;
}

.promo-link {
  color: #013569;
  text-decoration: none;
  font-weight: 900;
  /* 添加文字阴影 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  /* 调整背景色的透明度 */
  background-color: rgba(255, 255, 255, 0.2);
  /* 添加一些内边距 */
  padding: 5px;
  /* 设置边框半径 */
  border-radius: 15px;
}

.text-container {
  border: 1px solid #ccc;
  /* 边框样式 */
  padding: 15px;
  /* 内部填充 */
  background-color: rgba(255, 255, 255, 0.7);
  /* 半透明背景 */
  color: #333;
  /* 字体颜色 */
  font-size: 16px;
  /* 字体大小 */
  font-weight: bold;
  /* 字体粗细 */
  border-radius: 5px;
  /* 边框圆角 */
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
  /* 字体 */
  margin-top: 20px;
  margin-bottom: 20px;
}

.text-container:hover {
  transform: scale(1.05);
  /* 鼠标悬停时放大元素 */
}

.scan-instruction {
  border: 1px solid #ccc;
  /* 边框样式 */
  padding: 10px;
  /* 内部填充 */
  background-color: rgba(255, 255, 255, 0.7);
  /* 半透明背景 */
  color: #333;
  /* 字体颜色 */
  font-size: 16px;
  /* 字体大小 */
  font-weight: bold;
  /* 字体粗细 */
  border-radius: 5px;
  /* 边框圆角 */
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
  /* 字体 */
  margin-top: 20px;
  margin-bottom: 20px;
}

.scan-instruction:hover {
  transform: scale(1.05);
  /* 鼠标悬停时放大元素 */
}

/* 添加按钮样式 */
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

/* 其他样式保持不变 */

/* 添加弹窗相关样式 */
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
  content: "•";
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

/* 以下是渐变动画效果 */
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

/* 其他样式保持不变 */
</style>