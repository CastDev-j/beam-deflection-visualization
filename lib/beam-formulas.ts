/**
 * Beam Deflection Formulas
 * Based on the TecNM Celaya structural analysis project
 */

/**
 * Unit step function u(x-a)
 * Returns 1 if x >= a, otherwise 0
 */
export function unitStep(x: number, a: number): number {
  return x >= a ? 1 : 0
}

/**
 * Calculate the deflection y(x) for a beam
 * Using the analytical solution from Laplace transform method
 *
 * @param x Position along the beam (0 to 10 meters)
 * @param w0 Load intensity (kN/m)
 * @param EI Flexural rigidity (kN·m²)
 * @returns Deflection in meters
 */
export function calculateDeflection(x: number, w0: number, EI: number): number {
  // First term: (3*w0)/(2*EI) * [x^5/120 - (x-2)^5/120*u(x-2) - (x-8)^5/120*u(x-8)]
  const term1 =
    ((3 * w0) / (2 * EI)) *
    (Math.pow(x, 5) / 120 -
      (Math.pow(Math.max(0, x - 2), 5) / 120) * unitStep(x, 2) -
      (Math.pow(Math.max(0, x - 8), 5) / 120) * unitStep(x, 8))

  // Second term: (w0/EI) * [(87/5)*x^2 - (129/50)*x^3]
  const term2 = (w0 / EI) * ((87 / 5) * Math.pow(x, 2) - (129 / 50) * Math.pow(x, 3))

  return term1 + term2
}

/**
 * Calculate the distributed load w(x)
 * Piecewise function:
 * - 0 ≤ x < 2: w(x) = (3/2)*x*w0 (triangular increasing)
 * - 2 ≤ x < 8: w(x) = 3*w0 (constant)
 * - 8 ≤ x ≤ 10: w(x) = (3/2)*(10-x)*w0 (triangular decreasing)
 *
 * @param x Position along the beam (0 to 10 meters)
 * @param w0 Base load intensity (kN/m)
 * @returns Load at position x (kN/m)
 */
export function calculateLoad(x: number, w0: number): number {
  if (x < 2) {
    return (3 / 2) * x * w0
  } else if (x >= 2 && x < 8) {
    return 3 * w0
  } else if (x >= 8 && x <= 10) {
    return (3 / 2) * (10 - x) * w0
  }
  return 0
}

/**
 * Generate data points for plotting
 */
export function generateBeamData(w0: number, EI: number, numPoints = 100) {
  const data = []
  const beamLength = 10

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * beamLength
    const load = calculateLoad(x, w0)
    const deflection = calculateDeflection(x, w0, EI)

    data.push({
      x,
      load,
      deflection,
    })
  }

  return data
}

/**
 * Find maximum deflection and its position
 */
export function findMaxDeflection(w0: number, EI: number): { maxDeflection: number; position: number } {
  const data = generateBeamData(w0, EI, 200)
  let maxDeflection = 0
  let position = 0

  data.forEach((point) => {
    if (Math.abs(point.deflection) > Math.abs(maxDeflection)) {
      maxDeflection = point.deflection
      position = point.x
    }
  })

  return { maxDeflection, position }
}
