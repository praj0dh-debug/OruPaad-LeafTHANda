import React from 'react';
import { ArrowRight, Microscope } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-6 text-center">
      <div className="inline-block px-4 py-1.5 rounded-full bg-tropical-800 text-tropical-300 text-sm font-semibold mb-8 border border-tropical-600">
        TinkerHub Make-a-thon • Useless Project
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-tropical-100 to-tropical-500 text-transparent bg-clip-text">
        Advanced Computational Inter-Leaflet Gap Quantification System
      </h1>
      
      <p className="text-xl md:text-2xl text-tropical-200 mb-12 font-light max-w-2xl mx-auto">
        "Measuring the space between things that absolutely did not need to be measured."
      </p>
      
      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-tropical-500 text-tropical-950 font-bold text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Microscope className="w-6 h-6" />
          Analyze a Palm Leaf
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-tropical-400 to-tropical-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      <div className="mt-24 grid md:grid-cols-3 gap-6 text-left">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-tropical-300 mb-2">1. Upload Image</h3>
          <p className="text-tropical-200/80 text-sm">Upload a photo containing a palm leaf and a ₹1 coin for scale calibration.</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-tropical-300 mb-2">2. Computer Vision</h3>
          <p className="text-tropical-200/80 text-sm">Our completely necessary algorithms locate the empty space between leaflets.</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-tropical-300 mb-2">3. Useless Results</h3>
          <p className="text-tropical-200/80 text-sm">Receive a highly detailed statistical breakdown of botanical nothingness.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
