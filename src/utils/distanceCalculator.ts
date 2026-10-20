const distanceBetweenPoints = (
  pointA: [number, number],
  pointB: [number, number]
) => {
  const d1 = 0.0174532925194329;
  let [d2, d3] = pointA;
  let [d4, d5] = pointB;
  d2 *= d1;
  d3 *= d1;
  d4 *= d1;
  d5 *= d1;
  const d6 = Math.sin(d2);
  const d7 = Math.sin(d3);
  const d8 = Math.cos(d2);
  const d9 = Math.cos(d3);
  const d10 = Math.sin(d4);
  const d11 = Math.sin(d5);
  const d12 = Math.cos(d4);
  const d13 = Math.cos(d5);
  const s11 = d9 * d8;
  const s12 = d9 * d6;
  const s13 = d7;
  const s21 = d13 * d12;
  const s22 = d13 * d10;
  const s23 = d11;
  const d14 = Math.sqrt(
     
    (s11 - s21) * (s11 - s21) +
      (s12 - s22) * (s12 - s22) +
      (s13 - s23) * (s13 - s23)
  );
  return Math.asin(d14 / 2.0) * 1.2740015798544e7;
};

const distanceOfLine = (line: [number, number][]) => {
  let distance = 0;
  for (let i = 0; i < line.length - 1; i += 1) {
    const pointA = line[i]!;
    const pointB = line[i + 1]!;
    distance += distanceBetweenPoints(pointA, pointB);
  }
  return distance;
};

export default distanceOfLine;
