<script setup lang="ts">
import generateRoute from '~/src/utils/generateRoute';
import getCenter from '~/src/utils/getCenter';

const props = defineProps<{ target: string }>();
const emit = defineEmits<{ (e: 'update:target', target: string): void }>();
const containerRef = ref<HTMLDivElement | null>(null);
const sunrunPaper = useSunRunPaper();
const map = shallowRef<any>();
const T = shallowRef<any>();
const routes = computed(() => sunrunPaper.value.runPointList);

// GCJ02 转 WGS84 坐标转换
const PI = Math.PI;
const a = 6378245.0;
const ee = 0.00669342162296594323;

const outOfChina = (lng: number, lat: number): boolean => {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
};

const transformLat = (lng: number, lat: number): number => {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret;
};

const transformLng = (lng: number, lat: number): number => {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
};

const gcj02ToWgs84 = (lng: number, lat: number): [number, number] => {
  if (outOfChina(lng, lat)) return [lng, lat];
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
  return [lng - dLng, lat - dLat];
};

const toLngLat = (longitude: number | string, latitude: number | string) => {
  const [lng, lat] = gcj02ToWgs84(Number(longitude), Number(latitude));
  return new T.value.LngLat(lng, lat);
};

const loadTianDiTu = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).T) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://api.tianditu.gov.cn/api?v=4.0&tk=f3fc2b83fdef052b1e0b750f80d1d889';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('天地图加载失败'));
    document.head.appendChild(script);
  });
};

const genPolylineAry = () => {
  const target = routes.value.find((route) => route.pointId === props.target);
  if (!target || !T.value) return [];

  const mockRoutePoints = generateRoute(sunrunPaper.value.mileage, target).mockRoute.map(
    ({ longitude, latitude }) => toLngLat(longitude, latitude)
  );

  const realRoutePoints = target.pointList.map(
    ({ longitude, latitude }) => toLngLat(longitude, latitude)
  );

  return [
    new T.value.Polyline(mockRoutePoints, {
      color: 'red',
      weight: 2,
      opacity: 0.5,
    }),
    new T.value.Polyline(realRoutePoints, {
      color: 'green',
      weight: 4,
      opacity: 0.5,
    }),
  ];
};

const updateLine = () => {
  if (!map.value || !routes.value || !T.value) return;
  map.value.clearOverLays();

  genPolylineAry().forEach((line) => {
    map.value.addOverLay(line);
  });

  routes.value.forEach((route) => {
    const { pointName, pointId, longitude, latitude } = route;
    const label = new T.value.Label({
      text: pointName,
      position: toLngLat(longitude, latitude),
      offset: new T.value.Point(-30, -10),
    });
    label.setFontSize(12);
    label.setBorderColor('#3b82f6');
    label.setBackgroundColor('#fff');
    label.addEventListener('click', () => {
      emit('update:target', pointId);
    });
    map.value.addOverLay(label);
  });
};

watch(
  () => props.target,
  () => {
    if (!sunrunPaper.value || !map.value || !T.value) return;
    updateLine();
    // 自适应显示选中路线的范围
    const target = routes.value.find((route) => route.pointId === props.target);
    if (target && target.pointList.length > 0) {
      const points = target.pointList.map(
        ({ longitude, latitude }) => toLngLat(longitude, latitude)
      );
      map.value.setViewport(points);
    }
  },
);

watch([sunrunPaper, map], () => {
  if (!sunrunPaper.value || !map.value || !T.value) return;
  const lonlat = getCenter(sunrunPaper.value.runPointList);
  const [lng, lat] = gcj02ToWgs84(lonlat.lon, lonlat.lat);
  map.value.centerAndZoom(new T.value.LngLat(lng, lat), 15);
  updateLine();
});

watch(
  () => containerRef.value,
  async () => {
    if (!containerRef.value) return;
    try {
      await loadTianDiTu();
      T.value = (window as any).T;
      map.value = new T.value.Map(containerRef.value);
      map.value.enableScrollWheelZoom();
    } catch (e) {
      console.error('天地图初始化失败:', e);
    }
  },
);
</script>
<template><div id="mapContainer" ref="containerRef" class="h-full w-full" /></template>
