<script setup lang="ts">
const props = defineProps<{
  points: { longitude: string; latitude: string }[];
}>();

const WIDTH = 320;
const HEIGHT = 240;
const PAD = 28;

const sketch = computed(() => {
  const points = props.points
    .map((point) => [Number(point.longitude), Number(point.latitude)] as const)
    .filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat));
  if (points.length < 2) {
    return null;
  }

  const xs = points.map(([lng]) => lng);
  const ys = points.map(([, lat]) => lat);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 0.0001;
  const spanY = maxY - minY || 0.0001;
  const scale = Math.min((WIDTH - PAD * 2) / spanX, (HEIGHT - PAD * 2) / spanY);
  const offsetX = (WIDTH - spanX * scale) / 2;
  const offsetY = (HEIGHT - spanY * scale) / 2;
  const project = ([lng, lat]: readonly [number, number]): [number, number] => [
    offsetX + (lng - minX) * scale,
    HEIGHT - (offsetY + (lat - minY) * scale),
  ];
  const projected = points.map(project);
  const path = projected
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  const start = projected[0]!;
  const end = projected[projected.length - 1]!;
  const closed = Math.hypot(start[0] - end[0], start[1] - end[1]) < 8;

  return { path, start, end, closed };
});
</script>

<template>
  <div class="sketch" role="img" aria-label="路线几何示意">
    <svg class="sketch-svg" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" aria-hidden="true">
      <g class="sketch-grid">
        <line v-for="x in 7" :key="`v${x}`" :x1="x * 40" y1="0" :x2="x * 40" :y2="HEIGHT" />
        <line v-for="y in 5" :key="`h${y}`" x1="0" :y1="y * 40" :x2="WIDTH" :y2="y * 40" />
      </g>
      <template v-if="sketch">
        <path class="sketch-path" :d="sketch.path" />
        <circle class="sketch-start" :cx="sketch.start[0]" :cy="sketch.start[1]" r="6" />
        <template v-if="sketch.closed">
          <text class="sketch-label" :x="sketch.start[0] + 10" :y="sketch.start[1] - 10">起 / 终</text>
        </template>
        <template v-else>
          <circle class="sketch-end" :cx="sketch.end[0]" :cy="sketch.end[1]" r="6" />
          <text class="sketch-label" :x="sketch.start[0] + 10" :y="sketch.start[1] - 10">起</text>
          <text class="sketch-label" :x="sketch.end[0] + 10" :y="sketch.end[1] + 18">终</text>
        </template>
      </template>
    </svg>
    <span class="sketch-tag mono">路线示意</span>
  </div>
</template>

<style scoped>
.sketch {
  position: relative;
  display: grid;
  min-height: 300px;
  place-items: center;
  background: var(--surface-2);
}

.sketch-svg {
  width: 100%;
  height: 100%;
  max-height: 360px;
}

.sketch-grid line {
  stroke: var(--line);
  stroke-width: 1;
  opacity: 0.55;
}

.sketch-path {
  fill: none;
  stroke: var(--blue);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sketch-start {
  fill: var(--surface);
  stroke: var(--ok);
  stroke-width: 3;
}

.sketch-end {
  fill: var(--blue);
  stroke: var(--surface);
  stroke-width: 2;
}

.sketch-label {
  fill: var(--ink);
  stroke: var(--surface);
  stroke-width: 3px;
  paint-order: stroke;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
}

.sketch-tag {
  position: absolute;
  right: 10px;
  bottom: 8px;
  color: var(--muted);
  font-size: 0.62rem;
}
</style>
