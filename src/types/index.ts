export interface GapMeasurement {
  id: string;
  pixelWidth: number;
  millimeterWidth: number;
  confidence: number;
  centerX: number;
  centerY: number;
  endpoints: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  personality: string;
  classification: string;
}

export interface AnalysisResult {
  totalGaps: number;
  averageGap: number;
  smallestGap: number;
  largestGap: number;
  medianGap: number;
  gapConsistency: number;
  gaps: GapMeasurement[];
  uselessnessScore: number;
  scientificNecessity: number;
  conclusion: string;
  annotatedImageUrl: string;
}
