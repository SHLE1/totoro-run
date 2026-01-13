<script setup lang="ts">
import TotoroApiWrapper from '~/src/wrappers/TotoroApiWrapper';

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
</script>
<template>
  <div class="page-wrapper">
    <StepIndicator :active-step="2" :completed-steps="[1]" />

    <div class="page-stack">
      <UiCard title="个人信息确认" icon="mdi mdi-account">
        <dl class="info-grid">
          <div class="info-item">
            <dt class="info-label">学校</dt>
            <dd class="info-value">{{ session.campusName }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-label">学院</dt>
            <dd class="info-value">{{ session.collegeName }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-label">学号</dt>
            <dd class="info-value">{{ session.stuNumber }}</dd>
          </div>
          <div class="info-item">
            <dt class="info-label">姓名</dt>
            <dd class="info-value">{{ session.stuName }}</dd>
          </div>
        </dl>
      </UiCard>

      <template v-if="data">
        <UiCard title="选择跑步路线" icon="mdi mdi-map-marker">
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
            aria-label="选择跑步路线"
          />

          <div class="btn-group">
            <VBtn
              variant="tonal"
              color="primary"
              prepend-icon="i-mdi-shuffle-variant"
              class="ui-btn ui-btn--sm random-btn"
              @click="selectValue = data!.runPointList[Math.floor(Math.random() * data!.runPointList.length)].pointId"
            >
              随机选择
            </VBtn>
            <NuxtLink v-if="selectValue" :to="`/run/${encodeURIComponent(selectValue)}`" class="start-link">
              <VBtn color="cta" append-icon="i-mdi-run" class="ui-btn start-btn">
                开始跑步
              </VBtn>
            </NuxtLink>
            <VBtn v-else color="cta" append-icon="i-mdi-run" class="ui-btn start-btn" disabled aria-disabled="true">
              开始跑步
            </VBtn>
          </div>
        </UiCard>

        <UiCard title="路线预览" icon="mdi mdi-map-outline">
          <p class="map-hint">地图中的路线仅为展示效果，不等于最终路线</p>
          <div class="map-container" role="img" aria-label="跑步路线地图预览">
            <div v-if="!selectValue" class="map-empty">
              <span class="mdi mdi-map-search map-empty-icon" aria-hidden="true"></span>
              <span>请选择路线以预览地图</span>
            </div>
            <ClientOnly v-else>
              <TMap :target="selectValue" @update:target="handleUpdate" />
            </ClientOnly>
          </div>
        </UiCard>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 0;
  padding: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: var(--ui-surface-muted);
  border-radius: var(--ui-radius-sm);
  border: 1px solid var(--ui-border);
}

.info-label {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
  font-weight: 400;
}

.info-value {
  font-size: 0.95rem;
  color: var(--ui-text);
  font-weight: 600;
  margin: 0;
}

.route-select {
  margin-bottom: 16px;
}

:deep(.route-select .v-field) {
  border-radius: var(--ui-radius-md);
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.random-btn {
  flex: 1;
  min-width: 120px;
}

.start-link {
  flex: 1;
  min-width: 120px;
}

.start-btn {
  width: 100%;
}

.map-hint {
  font-size: 0.8rem;
  color: var(--ui-text-muted);
  margin-bottom: 12px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: var(--ui-radius-md);
  overflow: hidden;
  background: var(--ui-surface-muted);
  border: 1px solid var(--ui-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-container :deep(#mapContainer) {
  width: 100% !important;
  height: 100% !important;
}

.map-empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  color: var(--ui-text-muted);
  font-size: 0.85rem;
}

.map-empty-icon {
  font-size: 1.6rem;
  color: rgb(var(--ui-primary));
}

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
