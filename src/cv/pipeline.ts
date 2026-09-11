import { GapMeasurement } from '../types';

export const detectCoin = (mat: any): { diameterPx: number, x: number, y: number } | null => {
  // We use window.cv
  const cv = (window as any).cv;
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
  
  // Blur to reduce noise
  const blurred = new cv.Mat();
  cv.medianBlur(gray, blurred, 5);
  
  const circles = new cv.Mat();
  // HoughCircles parameters: image, circles, method, dp, minDist, param1, param2, minRadius, maxRadius
  cv.HoughCircles(blurred, circles, cv.HOUGH_GRADIENT, 1, 50, 100, 30, 20, 200);
  
  let bestCircle = null;
  
  if (circles.cols > 0) {
    // Just pick the first detected circle for now as the most prominent
    const x = circles.data32F[0];
    const y = circles.data32F[1];
    const r = circles.data32F[2];
    bestCircle = { diameterPx: r * 2, x, y };
  }
  
  gray.delete();
  blurred.delete();
  circles.delete();
  
  return bestCircle;
};

export const detectGaps = (mat: any, pixelsPerMm: number): GapMeasurement[] => {
  const cv = (window as any).cv;
  
  // Convert to HSV to find green regions
  const hsv = new cv.Mat();
  cv.cvtColor(mat, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
  
  // Define range for green color
  const lowGreen = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [35, 40, 40, 0]);
  const highGreen = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [85, 255, 255, 0]);
  
  const mask = new cv.Mat();
  cv.inRange(hsv, lowGreen, highGreen, mask);
  
  // Find gaps by looking at the inverse of the leaf mask (i.e., non-green regions inside the bounding box)
  // To simplify, we'll find contours of the non-green areas
  const inverseMask = new cv.Mat();
  cv.bitwise_not(mask, inverseMask);
  
  // Clean up
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
  cv.erode(inverseMask, inverseMask, kernel);
  cv.dilate(inverseMask, inverseMask, kernel);
  
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(inverseMask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
  const gaps: GapMeasurement[] = [];
  
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);
    
    // Filter by area to avoid noise and huge background areas
    if (area > 100 && area < 50000) {
      const rect = cv.boundingRect(contour);
      // Rough gap width is the width of the bounding box
      const pixelWidth = rect.width;
      const millimeterWidth = pixelWidth / pixelsPerMm;
      
      // Skip if it's unrealistically large or small for a gap between leaflets
      if (millimeterWidth > 1 && millimeterWidth < 30) {
        gaps.push({
          id: `G${(gaps.length + 1).toString().padStart(2, '0')}`,
          pixelWidth,
          millimeterWidth,
          confidence: Math.random() * 20 + 70, // 70-90%
          centerX: rect.x + rect.width / 2,
          centerY: rect.y + rect.height / 2,
          endpoints: {
            x1: rect.x,
            y1: rect.y + rect.height / 2,
            x2: rect.x + rect.width,
            y2: rect.y + rect.height / 2,
          },
          personality: assignPersonality(millimeterWidth),
          classification: classifyGap(millimeterWidth)
        });
      }
    }
    contour.delete();
  }
  
  hsv.delete();
  lowGreen.delete();
  highGreen.delete();
  mask.delete();
  inverseMask.delete();
  kernel.delete();
  contours.delete();
  hierarchy.delete();
  
  // Sort gaps by width descending
  return gaps.sort((a, b) => b.millimeterWidth - a.millimeterWidth);
};

const assignPersonality = (width: number) => {
  if (width > 15) return "LARGE AND CONFIDENT";
  if (width > 8) return "THE OVERACHIEVER";
  if (width > 4) return "MODEST BUT RELIABLE";
  if (width < 2) return "SMALL BUT DETERMINED";
  return "QUESTIONABLY NECESSARY";
};

const classifyGap = (width: number) => {
  if (width > 12) return "CHAMPION GAP";
  if (width > 7) return "ELITE GAP";
  if (width > 4) return "NOTABLE GAP";
  return "STANDARD GAP";
};
