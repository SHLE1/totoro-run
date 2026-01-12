<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';
import { onMounted } from 'vue';

const sunrunPaper = useSunRunPaper();
const session = useSession();
const selectValue = ref('');
const data = await TotoroApiWrapper.getSunRunPaper({
  token: session.value.token,
  campusId: session.value.campusId,
  schoolId: session.value.schoolId,
  stuNumber: session.value.stuNumber,
});
watchEffect(() => {
  if (data) {
    sunrunPaper.value = data;
  }
});

const handleUpdate = (target: string) => {
  selectValue.value = target;
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


</script>
<template>
  <div class="page-wrapper">
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div class="step completed">
        <span class="step-num">&#10003;</span>
        <span class="step-text">扫码</span>
      </div>
      <div class="step-line active"></div>
      <div class="step active">
        <span class="step-num">2</span>
        <span class="step-text">确认</span>
      </div>
      <div class="step-line"></div>
      <div class="step">
        <span class="step-num">3</span>
        <span class="step-text">完成</span>
      </div>
    </div>

    <!-- 个人信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <span class="header-icon">&#128100;</span>
        <span class="header-title">个人信息确认</span>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">学校</span>
          <span class="info-value">{{ session.campusName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">学院</span>
          <span class="info-value">{{ session.collegeName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">学号</span>
          <span class="info-value">{{ session.stuNumber }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">姓名</span>
          <span class="info-value">{{ session.stuName }}</span>
        </div>
      </div>
    </div>

    <!-- 路线选择卡片 -->
    <template v-if="data">
      <div class="route-card">
        <div class="card-header">
          <span class="header-icon">&#128205;</span>
          <span class="header-title">选择跑步路线</span>
        </div>

        <VSelect
          v-model="selectValue"
          :items="data.runPointList"
          item-title="pointName"
          item-value="pointId"
          variant="outlined"
          label="请选择路线"
          class="route-select"
          density="comfortable"
          hide-details
        />

        <div class="btn-group">
          <VBtn
            variant="tonal"
            color="primary"
            prepend-icon="i-mdi-shuffle-variant"
            class="random-btn"
            @click="selectValue = data!.runPointList[Math.floor(Math.random() * data!.runPointList.length)].pointId"
          >
            随机选择
          </VBtn>
          <NuxtLink v-if="selectValue" :to="`/run/${encodeURIComponent(selectValue)}`" class="start-link">
            <VBtn color="primary" append-icon="i-mdi-run" class="start-btn">
              开始跑步
            </VBtn>
          </NuxtLink>
          <VBtn v-else color="primary" append-icon="i-mdi-run" class="start-btn" disabled>
            开始跑步
          </VBtn>
        </div>
      </div>

      <!-- 地图预览卡片 -->
      <div class="map-card">
        <div class="card-header">
          <span class="header-icon">&#128506;</span>
          <span class="header-title">路线预览</span>
        </div>
        <p class="map-hint">地图中的路线仅为展示效果，不等于最终路线</p>
        <div class="map-container">
          <ClientOnly>
            <AMap :target="selectValue" @update:target="handleUpdate" />
          </ClientOnly>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
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

.step.completed .step-num {
  background: #22c55e;
  color: #fff;
}

.step-text {
  font-size: 0.75rem;
  color: #94a3b8;
}

.step.active .step-text {
  color: #3b82f6;
  font-weight: 500;
}

.step.completed .step-text {
  color: #22c55e;
  font-weight: 500;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e2e8f0;
  margin-bottom: 18px;
}

.step-line.active {
  background: #22c55e;
}

/* 卡片通用样式 */
.info-card,
.route-card,
.map-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.header-icon {
  font-size: 1.25rem;
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

/* 个人信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.info-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
}

/* 路线选择 */
.route-select {
  margin-bottom: 16px;
}

:deep(.route-select .v-field) {
  border-radius: 12px;
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.random-btn {
  flex: 1;
  min-width: 120px;
  height: 44px;
  border-radius: 22px;
  text-transform: none;
  font-weight: 500;
}

.start-link {
  flex: 1;
  min-width: 120px;
}

.start-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  text-transform: none;
  font-weight: 500;
}

/* 地图 */
.map-hint {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 12px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;
}

.map-container :deep(#mapContainer) {
  width: 100% !important;
  height: 100% !important;
}

/* 响应式 */
@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .btn-group {
    flex-direction: column;
  }

  .random-btn,
  .start-link {
    min-width: 100%;
  }
}
</style>
