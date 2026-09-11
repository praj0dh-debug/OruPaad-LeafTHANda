import { useState, useEffect } from 'react';
import { Upload, Camera, BarChart2, Info, ChevronRight, Leaf } from 'lucide-react';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Results from './pages/Results';
import About from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'analyzer' | 'results' | 'about'>('home');
  const [cvReady, setCvReady] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    // Wait for OpenCV.js to load
    const checkOpenCv = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).cv && (window as any).cv.Mat) {
        setCvReady(true);
        clearInterval(checkOpenCv);
      }
    }, 500);

    return () => clearInterval(checkOpenCv);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-tropical-900 border-b border-tropical-700 p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <Leaf className="w-8 h-8 text-tropical-400" />
            <h1 className="text-xl font-bold tracking-wider text-tropical-50">
              OruPaad-<span className="text-tropical-400">LeafTHANda</span>
            </h1>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => setCurrentPage('analyzer')}
              className={`px-4 py-2 rounded-lg transition-colors ${currentPage === 'analyzer' ? 'bg-tropical-700 text-white' : 'text-tropical-200 hover:bg-tropical-800'}`}
            >
              Analyze
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`px-4 py-2 rounded-lg transition-colors ${currentPage === 'about' ? 'bg-tropical-700 text-white' : 'text-tropical-200 hover:bg-tropical-800'}`}
            >
              About
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {!cvReady && (
          <div className="fixed inset-0 z-50 bg-tropical-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-tropical-400 mx-auto mb-4"></div>
              <p className="text-tropical-200 animate-pulse">Loading computer vision modules...</p>
            </div>
          </div>
        )}
        
        {currentPage === 'home' && <Home onStart={() => setCurrentPage('analyzer')} />}
        {currentPage === 'analyzer' && (
          <Analyzer 
            onComplete={(data) => {
              setAnalysisData(data);
              setCurrentPage('results');
            }} 
          />
        )}
        {currentPage === 'results' && (
          <Results 
            data={analysisData} 
            onReset={() => setCurrentPage('analyzer')} 
          />
        )}
        {currentPage === 'about' && <About />}
      </main>

      <footer className="bg-tropical-900 p-6 text-center text-tropical-400/60 text-sm border-t border-tropical-800">
        <p>A TinkerHub Make-a-thon Project • Measuring the unnecessary</p>
      </footer>
    </div>
  );
}

export default App;
