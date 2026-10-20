import type GetSunRunPaperResponse from '~~/src/types/responseTypes/GetSunRunPaperResponse';
import type { Session } from '~/types/session';

const demoSession: Session = {
  stuNumber: '202310418',
  stuName: '林小满',
  schoolId: '3201',
  schoolName: '南京航空航天大学',
  campusId: '32010001',
  campusName: '将军路校区',
  collegeName: '自动化学院',
  naturalName: '2023 级',
  phoneNumber: '13800000000',
  sex: '女',
  token: 'demo-token',
  code: 'demo-code',
};

const demoPaper = {
  status: '1',
  message: null,
  code: '0',
  token: null,
  total: 0,
  mileage: '2.00',
  minTime: '20',
  maxTime: '24',
  minSpeed: '1.5',
  maxSpeed: '4',
  startTime: '06:00',
  endTime: '22:30',
  startDate: '2026-09-01',
  endDate: '2027-01-15',
  ifHasRun: '0',
  fitDegree: '1',
  offsetRange: '100',
  faceFlag: '0',
  minWalkTotal: '0',
  maxWalkTotal: '0',
  runPointList: [
    {
      taskId: 'task-dong',
      pointId: 'route-a',
      pointName: '东操场 · 环线',
      longitude: '118.7969',
      latitude: '32.0412',
      pointList: [
        { longitude: '118.7951', latitude: '32.0403' },
        { longitude: '118.7984', latitude: '32.0408' },
        { longitude: '118.7981', latitude: '32.0422' },
        { longitude: '118.7954', latitude: '32.0416' },
        { longitude: '118.7951', latitude: '32.0403' },
      ],
    },
    {
      taskId: 'task-west',
      pointId: 'route-b',
      pointName: '西区 · 林荫道',
      longitude: '118.7924',
      latitude: '32.0431',
      pointList: [
        { longitude: '118.7902', latitude: '32.0425' },
        { longitude: '118.7938', latitude: '32.0426' },
        { longitude: '118.7941', latitude: '32.0444' },
        { longitude: '118.7905', latitude: '32.0441' },
        { longitude: '118.7902', latitude: '32.0425' },
      ],
    },
    {
      taskId: 'task-south',
      pointId: 'route-c',
      pointName: '南区 · 教学楼外圈',
      longitude: '118.8012',
      latitude: '32.0378',
      pointList: [
        { longitude: '118.7991', latitude: '32.0369' },
        { longitude: '118.8031', latitude: '32.0371' },
        { longitude: '118.8028', latitude: '32.0391' },
        { longitude: '118.7994', latitude: '32.0388' },
        { longitude: '118.7991', latitude: '32.0369' },
      ],
    },
  ],
} as GetSunRunPaperResponse;

export function seedDevFixture(kind: string) {
  const store = useSessionStore();
  store.session = demoSession;
  store.paper = demoPaper;
  return kind;
}
