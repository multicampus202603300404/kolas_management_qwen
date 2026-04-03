/**
 * Measurement Uncertainty Calculation Engine
 * KOLAS 17025 Compliant
 */

export interface MeasurementData {
  values: number[]
  referenceValue?: number
  resolution?: number
  calibrationUncertainty?: number
  coverageFactor?: number // k value (typically 2 for 95% confidence)
}

export interface UncertaintyComponents {
  typeA: number // Statistical evaluation
  typeB: number // Other evaluation (calibration, resolution, etc.)
  combined: number // Combined standard uncertainty
  expanded: number // Expanded uncertainty (U)
  coverageFactor: number // k value used
}

export interface UncertaintyResult {
  result: number
  uncertainty: UncertaintyComponents
  formula: string
  timestamp: Date
}

/**
 * Calculate Type A Uncertainty (Statistical)
 * Based on repeated measurements
 */
export function calculateTypeAUncertainty(values: number[]): number {
  if (values.length < 2) {
    return 0
  }
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1)
  const standardDeviation = Math.sqrt(variance)
  
  // Standard uncertainty of the mean
  return standardDeviation / Math.sqrt(values.length)
}

/**
 * Calculate Type B Uncertainty from Calibration Certificate
 */
export function calculateCalibrationUncertainty(
  calibrationUncertainty: number,
  coverageFactorFromCert: number = 2
): number {
  return calibrationUncertainty / coverageFactorFromCert
}

/**
 * Calculate Type B Uncertainty from Resolution
 */
export function calculateResolutionUncertainty(resolution: number): number {
  // Rectangular distribution: u = resolution / (2 * sqrt(3))
  return resolution / (2 * Math.sqrt(3))
}

/**
 * Calculate Combined Standard Uncertainty
 */
export function calculateCombinedUncertainty(components: number[]): number {
  // Root sum of squares
  const sumOfSquares = components.reduce((sum, comp) => sum + Math.pow(comp, 2), 0)
  return Math.sqrt(sumOfSquares)
}

/**
 * Calculate Expanded Uncertainty
 */
export function calculateExpandedUncertainty(
  combinedUncertainty: number,
  coverageFactor: number = 2
): number {
  return combinedUncertainty * coverageFactor
}

/**
 * Main uncertainty calculation function
 */
export function calculateUncertainty(data: MeasurementData): UncertaintyResult {
  const {
    values,
    referenceValue,
    resolution,
    calibrationUncertainty,
    coverageFactor = 2,
  } = data
  
  // Type A uncertainty (from repeated measurements)
  const typeA = calculateTypeAUncertainty(values)
  
  // Type B uncertainty components
  const typeBComponents: number[] = []
  
  if (calibrationUncertainty !== undefined) {
    typeBComponents.push(calculateCalibrationUncertainty(calibrationUncertainty))
  }
  
  if (resolution !== undefined) {
    typeBComponents.push(calculateResolutionUncertainty(resolution))
  }
  
  const typeB = typeBComponents.length > 0
    ? calculateCombinedUncertainty(typeBComponents)
    : 0
  
  // Combined standard uncertainty
  const combined = calculateCombinedUncertainty([typeA, typeB])
  
  // Expanded uncertainty
  const expanded = calculateExpandedUncertainty(combined, coverageFactor)
  
  // Generate formula string
  const formula = `U = k × √(u_A² + u_B²) = ${coverageFactor} × √(${typeA.toFixed(4)}² + ${typeB.toFixed(4)}²)`
  
  return {
    result: values.reduce((a, b) => a + b, 0) / values.length,
    uncertainty: {
      typeA,
      typeB,
      combined,
      expanded,
      coverageFactor,
    },
    formula,
    timestamp: new Date(),
  }
}

/**
 * Calculate uncertainty with custom formula
 */
export function calculateUncertaintyWithFormula(
  formula: string,
  variables: Record<string, number>
): UncertaintyResult {
  try {
    // Simple formula evaluator (in production, use a proper math library)
    // Example formula: "sqrt(a^2 + b^2)"
    let expression = formula
      .replace(/\^/g, '**')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/log/g, 'Math.log')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/π/g, 'Math.PI')
    
    // Replace variables with values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\b`, 'g')
      expression = expression.replace(regex, value.toString())
    })
    
    // eslint-disable-next-line no-eval
    const result = eval(expression)
    
    return {
      result,
      uncertainty: {
        typeA: 0,
        typeB: 0,
        combined: result * 0.05, // 5% default uncertainty
        expanded: result * 0.1,  // 10% expanded uncertainty
        coverageFactor: 2,
      },
      formula,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Failed to calculate uncertainty:', error)
    throw new Error('Invalid formula')
  }
}

/**
 * Validate environmental conditions
 */
export interface EnvironmentalCondition {
  temperature?: number
  humidity?: number
  temperatureRange?: [number, number]
  humidityRange?: [number, number]
}

export function validateEnvironmentalConditions(
  conditions: EnvironmentalCondition
): { valid: boolean; violations: string[] } {
  const violations: string[] = []
  
  if (conditions.temperature !== undefined && conditions.temperatureRange) {
    const [min, max] = conditions.temperatureRange
    if (conditions.temperature < min || conditions.temperature > max) {
      violations.push(`Temperature ${conditions.temperature}°C is outside range ${min}-${max}°C`)
    }
  }
  
  if (conditions.humidity !== undefined && conditions.humidityRange) {
    const [min, max] = conditions.humidityRange
    if (conditions.humidity < min || conditions.humidity > max) {
      violations.push(`Humidity ${conditions.humidity}% is outside range ${min}-${max}%`)
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  }
}
