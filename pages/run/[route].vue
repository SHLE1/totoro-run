<script setup lang="ts">
import { useNow } from '@vueuse/core';
import { onMounted, onUnmounted } from 'vue';
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';
import generateRunReq from '~~/src/controllers/generateSunRunExercisesReq';
import generateRoute from '~~/src/utils/generateRoute';

const now = useNow({ interval: 1000 });
const startTime = ref(new Date());
const endTime = ref(new Date());
const timePassed = computed(() => Number(now.value) - Number(startTime.value));
const needTime = ref(0);
const running = ref(false);
const sunRunPaper = useSunRunPaper();
const { params } = useRoute();
const session = useSession();
const { route } = params as { route: string };
const runned = computed(() => !running.value && !!needTime.value);
const target = computed(() => sunRunPaper.value.runPointList.find((r) => r.pointId === route)!);
const handleRun = async () => {
  const { req, endTime: targetTime } = await generateRunReq({
    distance: sunRunPaper.value.mileage,
    routeId: target.value.pointId,
    taskId: target.value.taskId,
    token: session.value.token,
    schoolId: session.value.schoolId,
    stuNumber: session.value.stuNumber,
    phoneNumber: session.value.phoneNumber,
    minTime: sunRunPaper.value.minTime,
    maxTime: sunRunPaper.value.maxTime,
  });
  startTime.value = now.value;
  needTime.value = Number(targetTime) - Number(now.value);
  endTime.value = targetTime;
  running.value = true;

  await TotoroApiWrapper.getRunBegin({
    campusId: session.value.campusId,
    schoolId: session.value.schoolId,
    stuNumber: session.value.stuNumber,
    token: session.value.token,
  });
  setTimeout(async () => {
    const res = await TotoroApiWrapper.sunRunExercises(req);
    const runRoute = generateRoute(sunRunPaper.value.mileage, target.value);
    await TotoroApiWrapper.sunRunExercisesDetail({
      pointList: runRoute.mockRoute,
      scantronId: res.scantronId,
      breq: {
        campusId: session.value.campusId,
        schoolId: session.value.schoolId,
        stuNumber: session.value.stuNumber,
        token: session.value.token,
      },
    });

    running.value = false;
  }, needTime.value);
};
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (running.value && !runned.value) {
    e.preventDefault();
    e.returnValue = '跑步还未完成，确定要离开吗？';
  }
}
</script>
<template>
  <p class="text-body-1">已选择路径 {{ target.pointName }}</p>
  <p class="text-body-1 mt-2">请再次确认是否开跑</p>
  <p class="text-body-1 mt-2 warning-text">跑步过程中请保持页面前台打开！不要退出！不要断网！</p>
  <div class="button-container">
    <VBtn v-if="!runned && !running" class="button d-flex align-center" color="primary my-4" append-icon="i-mdi-run"
      @click="handleRun">
      确认开跑
    </VBtn>
  </div>
  <template v-if="running">
    <div class="d-flex justify-space-between mt-4">
      <span>{{ timePassed }}/{{ needTime }}</span>
      <span>{{ Math.ceil((timePassed / needTime) * 100) }}%</span>
    </div>
    <VProgressLinear v-if="timePassed && needTime" color="primary" :model-value="(timePassed / needTime) * 100"
      class="mt-2" />
  </template>
  <p v-if="runned" class="mt-4">
    <b>跑步完成，去 App 里看记录吧</b>
  </p>
  <p class="mt-4">
    AI聊天，GPT4，就在 <a href="https://chat.aigoo.xyz" target="_blank">FFchat</a>
  </p>
  <p class="mt-4">验明校友身份即可免费使用</p>
  <p class="mt-4">
    如果你觉得此项目对你有所帮助，就分享给你的朋友吧
  </p>
</template>

<style scoped>
.text-body-1,
.mt-4,
.d-flex,
.button {
  text-align: center;
}

.button {
  width: 100px;
}

.button-container {
  display: flex;
  justify-content: center;
}

.warning-text {
  font-size: 30px;
  color: red;
  font-weight: bold;
}
</style>