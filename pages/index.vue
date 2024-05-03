@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

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
  <div class="p-4 flex flex-col items-center justify-center bg-center bg-no-repeat bg-cover"
    style="background-image: url('https://t.mwm.moe/ysz')">
    <div class="text-center mt-5 mb-[-10px]">
      <p
        class="text-center text-lg font-bold p-2.5 bg-white bg-opacity-70 rounded text-gray-800 mt-5 mb-5 transform hover:scale-105 transition-transform duration-300">
        请用微信扫码，扫码后点击“下一步”按钮<br />
        你也可以使用：run1.aapl.top<br />
      </p>
      <div class="w-50 h-50 mx-auto">
        <img v-if="!message" :src="data!.imgUrl" class="w-full" referrerpolicy="no-referrer" />
        <div v-else class="h-full w-full flex items-center justify-center">
          {{ message }}
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <button
          class="px-8 py-3 bg-blue-500 text-white rounded-lg text-xl font-bold flex items-center justify-center transform hover:scale-105 transition-transform duration-300"
          @click="handleScanned">
          下一步
          <i class="mdi mdi-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <div
      class="border border-gray-300 bg-white bg-opacity-70 p-2.5 rounded max-w-md mx-auto mt-[-50px] mb-5 transform hover:scale-105 transition-transform duration-300">
      <div class="text-center text-lg font-bold text-gray-800">
        ChatGPT，国内可用，低价直连：
      </div>
      <div class="text-center text-lg font-bold text-gray-800">
        注册免费体验：<a href="https://chat.aigoo.xyz" target="_blank" class="text-red-500 font-bold no-underline">FFchat</a>
      </div>
    </div>

    <div
      class="border border-gray-300 p-3.75 bg-white bg-opacity-70 text-gray-800 text-lg font-bold rounded text-center mt-5 mb-5 transform hover:scale-105 transition-transform duration-300">
      {{ poem[Math.floor(Math.random() * poem.length)].join('\n') }}
    </div>
  </div>
</template>