import React, { useState, useRef, useEffect } from 'react';
import { Upload, Activity, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { detectCoin, detectGaps } from '../cv/pipeline';
import { AnalysisResult, GapMeasurement } from '../types';

interface AnalyzerProps {
  onComplete: (data: AnalysisResult) => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);
  const [loadingMsg, setLoadingMsg] = useState<string>('');
  const [coinDetected, setCoinDetected] = useState<boolean>(false);
  const [coinDiameterPx, setCoinDiameterPx] = useState<number>(0);
  const [physicalCoinDiameter, setPhysicalCoinDiameter] = useState<number>(20.00); // mm
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setStep(1);
    }
  };

  const processImage = async () => {
    if (!imgRef.current || !canvasRef.current) return;
    setAnalysisError(null);
    setStep(2);

    const cv = (window as any).cv;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw image to canvas to read pixel data
    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;
    ctx.drawImage(imgRef.current, 0, 0);

    const mat = cv.imread(canvas);

    try {
      // 1. Coin Detection
      setLoadingMsg("Locating the coin...");
      await new Promise(r => setTimeout(r, 800));
      
      const coin = detectCoin(mat);
      if (!coin) {
        setAnalysisError("₹1 coin not detected. We need a unit of measurement before we can pretend this is science.");
        setStep(1);
        mat.delete();
        return;
      }
      
      setCoinDetected(true);
      setCoinDiameterPx(coin.diameterPx);
      setLoadingMsg("Establishing a completely unnecessary unit of measurement...");
      await new Promise(r => setTimeout(r, 800));

      // 2. Leaflet and Gap detection
      setLoadingMsg("Separating leaflets from their personal space...");
      await new Promise(r => setTimeout(r, 800));

      const pixelsPerMm = coin.diameterPx / physicalCoinDiameter;
      
      setLoadingMsg("Scanning for gaps that nobody requested...");
      await new Promise(r => setTimeout(r, 800));
      
      const gaps = detectGaps(mat, pixelsPerMm);
      
      if (gaps.length === 0) {
        setAnalysisError("Leaf detection failed or no gaps found. Try a clearer image with a contrasting background.");
        setStep(1);
        mat.delete();
        return;
      }

      setLoadingMsg("Calculating botanical nothingness...");
      await new Promise(r => setTimeout(r, 800));

      // Draw annotations
      gaps.forEach(gap => {
        // Draw line across gap
        ctx.beginPath();
        ctx.moveTo(gap.endpoints.x1, gap.endpoints.y1);
        ctx.lineTo(gap.endpoints.x2, gap.endpoints.y2);
        ctx.strokeStyle = '#ef4444'; // red
        ctx.lineWidth = Math.max(2, canvas.width / 500);
        ctx.stroke();

        // Draw label
        ctx.fillStyle = '#ef4444';
        ctx.font = `bold ${Math.max(16, canvas.width / 30)}px sans-serif`;
        ctx.fillText(gap.id, gap.endpoints.x2 + 5, gap.endpoints.y2);
      });

      const annotatedImageUrl = canvas.toDataURL('image/jpeg');

      setLoadingMsg("Preparing highly unnecessary statistics...");
      await new Promise(r => setTimeout(r, 800));

      // Compute statistics
      const totalGaps = gaps.length;
      const averageGap = gaps.reduce((acc, g) => acc + g.millimeterWidth, 0) / totalGaps;
      const sortedGaps = [...gaps].sort((a, b) => a.millimeterWidth - b.millimeterWidth);
      const medianGap = sortedGaps[Math.floor(totalGaps / 2)].millimeterWidth;
      
      // Fun metrics
      const uselessnessScore = Math.min(100, 95 + (totalGaps * 0.1) + (averageGap * 0.05));
      const scientificNecessity = 0.00;
      
      const conclusions = [
        `Analysis indicates a mean inter-leaflet separation of ${averageGap.toFixed(2)} mm, suggesting a moderate degree of botanical spacing variability. Further investigation is strongly recommended despite the absence of any known practical requirement.`,
        `The measured spacing of ${averageGap.toFixed(2)} mm demonstrates a statistically unnecessary level of organizational structure.`,
        `The observed gap distribution suggests that the leaf has apparently refused to standardize itself.`
      ];
      const conclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

      const result: AnalysisResult = {
        totalGaps,
        averageGap,
        smallestGap: sortedGaps[0].millimeterWidth,
        largestGap: sortedGaps[sortedGaps.length - 1].millimeterWidth,
        medianGap,
        gapConsistency: 70 + Math.random() * 20, // dummy consistency
        gaps,
        uselessnessScore,
        scientificNecessity,
        conclusion,
        annotatedImageUrl
      };

      onComplete(result);

    } catch (e) {
      console.error(e);
      setAnalysisError("An unexpected error occurred during image processing.");
      setStep(1);
    } finally {
      if (!mat.isDeleted()) mat.delete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      {step === 0 && (
        <div className="glass-panel p-12 text-center border-dashed border-2 border-tropical-500/50">
          <Upload className="w-16 h-16 text-tropical-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Drop your palm leaf here</h2>
          <p className="text-tropical-200 mb-8">Upload a clear image containing the palm leaf and a ₹1 coin.</p>
          <label className="bg-tropical-600 hover:bg-tropical-500 text-white px-8 py-3 rounded-xl cursor-pointer transition-colors font-semibold">
            Select Image
            <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
          </label>
        </div>
      )}

      {step === 1 && imageSrc && (
        <div className="glass-panel p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-tropical-400" /> Image Selected
          </h2>
          
          {analysisError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200">{analysisError}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img ref={imgRef} src={imageSrc} alt="Preview" className="rounded-xl shadow-lg w-full object-cover max-h-96" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="space-y-6">
              <div className="bg-tropical-900/50 p-4 rounded-xl border border-tropical-700">
                <h3 className="font-semibold text-tropical-300 mb-3">Scale Calibration</h3>
                <label className="block text-sm text-tropical-200 mb-2">Physical Coin Diameter (mm)</label>
                <select 
                  className="w-full bg-tropical-800 border border-tropical-600 rounded-lg p-2 text-tropical-100"
                  value={physicalCoinDiameter}
                  onChange={(e) => setPhysicalCoinDiameter(Number(e.target.value))}
                >
                  <option value={20.00}>₹1 Coin — 20.00 mm (Pre-2007)</option>
                  <option value={21.93}>₹1 Coin — 21.93 mm (Current)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={processImage}
                  className="flex-1 bg-tropical-500 hover:bg-tropical-400 text-tropical-950 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" /> Analyze Leaf
                </button>
                <button 
                  onClick={() => { setImageSrc(null); setStep(0); setAnalysisError(null); }}
                  className="px-6 py-3 border border-tropical-600 rounded-xl hover:bg-tropical-800 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-panel p-16 text-center">
          <Activity className="w-20 h-20 text-tropical-400 animate-pulse mx-auto mb-8" />
          <h2 className="text-2xl font-bold text-tropical-100 mb-4 animate-pulse">
            {loadingMsg}
          </h2>
          <p className="text-tropical-300/60">Please wait while we measure the void.</p>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
