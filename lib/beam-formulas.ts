export function unitStep(x: number, a: number): number {
  return x >= a ? 1 : 0;
}

export function calculateDeflection(x: number, w0: number, EI: number): number {
  const term1 =
    ((3 * w0) / (2 * EI)) *
    (Math.pow(x, 5) / 120 -
      (Math.pow(Math.max(0, x - 2), 5) / 120) * unitStep(x, 2) -
      (Math.pow(Math.max(0, x - 8), 5) / 120) * unitStep(x, 8));

  const term2 =
    (w0 / EI) * ((87 / 5) * Math.pow(x, 2) - (129 / 50) * Math.pow(x, 3));

  return term1 + term2;
}

export function calculateLoad(x: number, w0: number): number {
  if (x < 2) {
    return (3 / 2) * x * w0;
  } else if (x >= 2 && x < 8) {
    return 3 * w0;
  } else if (x >= 8 && x <= 10) {
    return (3 / 2) * (10 - x) * w0;
  }
  return 0;
}

export function generateBeamData(w0: number, EI: number, numPoints = 100) {
  const data = [];
  const beamLength = 10;

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * beamLength;
    const load = calculateLoad(x, w0);
    const deflection = calculateDeflection(x, w0, EI);

    data.push({
      x,
      load,
      deflection,
    });
  }

  return data;
}

export function findMaxDeflection(
  w0: number,
  EI: number
): { maxDeflection: number; position: number } {
  const data = generateBeamData(w0, EI, 200);
  let maxDeflection = 0;
  let position = 0;

  data.forEach((point) => {
    if (Math.abs(point.deflection) > Math.abs(maxDeflection)) {
      maxDeflection = point.deflection;
      position = point.x;
    }
  });

  return { maxDeflection, position };
}
