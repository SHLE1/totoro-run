<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';

const router = useRouter();
const { data } = await useFetch<{ uuid: string; imgUrl: string }>('/api/scanQr');
const message = ref('');
const session = useSession();

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
    <div class="scan-container">
      <p class="text-center text-body-1 scan-instruction">
        请用微信扫码，扫码后点击“下一步”按钮<br />
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
        ChatGPT，国内可用，低价直连：
      </div>
      <div class="promo-text text-center text-h6 font-weight-bold">
        注册免费体验：<a href="https://chat.aigoo.xyz" target="_blank" class="promo-link">FFchat</a>
      </div>
    </div>

    <div class="text-container mt-4">
      <div class="text-sm pre-wrap text-center">
        {{ poem[Math.floor(Math.random() * poem.length)].join('\n') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 16px;
  flex-direction: column;
  background: url('https://t.mwm.moe/ycy') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
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

.promo-container {
  border: 1px solid #ccc;
  /* 边框样式 */
  background-color: rgba(255, 255, 255, 0.7);
  /* 半透明背景 */
  padding: 10px;
  border-radius: 4px;
  max-width: 400px;
  /* 最大宽度，根据需要调整 */
  margin: 0 auto;
  margin-top: -50px;
  margin-bottom: 20px;
  transition: transform 0.3s ease-in-out;
  /* 添加过渡效果 */
}

.promo-container:hover {
  transform: scale(1.05);
  /* 鼠标悬停时放大元素 */
}

.promo-text {
  font-size: 1.25rem;
  /* 增大字体大小 */
  color: #333;
}

.promo-link {
  color: #ff0000;
  text-decoration: none;
  font-weight: bold;
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
</style>