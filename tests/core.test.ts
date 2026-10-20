import type RunPoint from '../src/types/RunPoint';
import { describe, expect, it } from 'vitest';
import distanceOfLine from '../src/utils/distanceCalculator';
import generateRoute from '../src/utils/generateRoute';

describe('distanceCalculator', () => {
  it('measures one thousandth of a degree at the equator', () => {
    const distance = distanceOfLine([
      [0, 0],
      [0.001, 0],
    ]);
    expect(distance).toBeGreaterThan(110);
    expect(distance).toBeLessThan(113);
  });
});

describe('generateRoute', () => {
  it('produces a route that reaches the requested distance', () => {
    const task: RunPoint = {
      taskId: 'task',
      pointId: 'route',
      pointName: '测试路线',
      longitude: '118.7969',
      latitude: '32.0412',
      pointList: [
        { longitude: '118.7951', latitude: '32.0403' },
        { longitude: '118.7984', latitude: '32.0408' },
        { longitude: '118.7981', latitude: '32.0422' },
        { longitude: '118.7954', latitude: '32.0416' },
        { longitude: '118.7951', latitude: '32.0403' },
      ],
    };

    const result = generateRoute('0.1', task);
    expect(result.mockRoute.length).toBeGreaterThan(10);
    expect(Number(result.distance)).toBeGreaterThanOrEqual(0.1);
    for (const point of result.mockRoute) {
      expect(Number.isFinite(Number(point.longitude))).toBe(true);
      expect(Number.isFinite(Number(point.latitude))).toBe(true);
    }
  });
});
