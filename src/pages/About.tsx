import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-16 px-6 pb-20">
      <h2 className="text-3xl font-bold mb-8 text-tropical-300">What is OruPaad-LeafTHANda?</h2>
      
      <div className="glass-panel p-8 space-y-6 text-tropical-100 leading-relaxed">
        <p>
          A deliberately useless computer-vision experiment that investigates the gaps between palm-leaf strips. 
          Built for the TinkerHub Make-a-thon.
        </p>
        
        <h3 className="text-xl font-semibold text-tropical-400 mt-8 mb-4">The Pipeline</h3>
        <ul className="space-y-3 font-mono text-sm">
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Image Upload</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Coin Detection (₹1)</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Scale Calibration</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Leaflet Detection</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Gap Detection</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Measurement</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Analysis</li>
          <li className="flex items-center gap-3"><span className="text-tropical-500">→</span> Useless Scientific Conclusion</li>
        </ul>

        <h3 className="text-xl font-semibold text-tropical-400 mt-8 mb-2">Why?</h3>
        <p className="text-xl italic text-tropical-200">"Because we could."</p>
      </div>
    </div>
  );
};

export default About;
