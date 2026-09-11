import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, Share2, RefreshCw } from 'lucide-react';

interface ResultsProps {
  data: AnalysisResult;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
  const [selectedGap, setSelectedGap] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-6 pb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2">Palm Leaf Gap Analysis Complete</h2>
        <p className="text-tropical-300 text-lg">"The scientific community may recover from this."</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="TOTAL GAPS DETECTED" value={data.totalGaps.toString()} />
        <StatCard title="AVERAGE GAP" value={`${data.averageGap.toFixed(2)} mm`} />
        <StatCard title="LARGEST GAP" value={`${data.largestGap.toFixed(2)} mm`} />
        <StatCard title="SMALLEST GAP" value={`${data.smallestGap.toFixed(2)} mm`} />
        <StatCard title="MEDIAN GAP" value={`${data.medianGap.toFixed(2)} mm`} />
        <StatCard title="GAP CONSISTENCY" value={`${data.gapConsistency.toFixed(1)}%`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-xl font-bold mb-4 text-tropical-200">Annotated Image</h3>
          <div className="rounded-xl overflow-hidden bg-black/30 border border-tropical-700/50">
            <img src={data.annotatedImageUrl} alt="Annotated Leaf" className="w-full h-auto object-contain max-h-[600px]" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-6 bg-gradient-to-br from-tropical-900 to-tropical-950 border-tropical-500/30">
            <h3 className="text-xl font-bold mb-6 text-tropical-100 flex items-center justify-between">
              USELESSNESS SCORE
              <span className="text-3xl text-tropical-400">{data.uselessnessScore.toFixed(2)}%</span>
            </h3>
            <p className="text-sm text-tropical-300/80 mb-6 italic">"Congratulations. Humanity did not need this."</p>
            
            <div className="space-y-3 pt-4 border-t border-tropical-800/50">
              <div className="flex justify-between text-sm">
                <span className="text-tropical-200">Scientific Necessity</span>
                <span className="font-mono text-tropical-400">{data.scientificNecessity.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-tropical-200">Gap Dominance</span>
                <span className="font-mono text-tropical-400">{(data.largestGap / data.averageGap).toFixed(2)}x</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4 text-tropical-200">Gap Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.gaps.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#047857" vertical={false} />
                  <XAxis dataKey="id" stroke="#6ee7b7" fontSize={12} />
                  <YAxis stroke="#6ee7b7" fontSize={12} unit="mm" />
                  <Tooltip 
                    cursor={{fill: '#064e3b'}}
                    contentStyle={{ backgroundColor: '#022c22', borderColor: '#047857' }}
                    itemStyle={{ color: '#34d399' }}
                  />
                  <Bar dataKey="millimeterWidth" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-tropical-400 mt-2">Approximate measured gap width (mm)</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 mb-10">
        <h3 className="text-2xl font-bold mb-4 text-tropical-100">Scientific Conclusion</h3>
        <p className="text-lg text-tropical-200 leading-relaxed font-serif italic border-l-4 border-tropical-500 pl-6 py-2">
          {data.conclusion}
        </p>
      </div>

      <div className="glass-panel overflow-hidden mb-10">
        <div className="p-6 border-b border-tropical-700 bg-tropical-800/50">
          <h3 className="text-xl font-bold">Gap Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-tropical-900/50 text-tropical-300 text-sm">
                <th className="p-4 border-b border-tropical-800">Rank</th>
                <th className="p-4 border-b border-tropical-800">Gap ID</th>
                <th className="p-4 border-b border-tropical-800">Approx. Width</th>
                <th className="p-4 border-b border-tropical-800">Classification</th>
                <th className="p-4 border-b border-tropical-800">Personality</th>
              </tr>
            </thead>
            <tbody>
              {data.gaps.map((gap, idx) => (
                <tr 
                  key={gap.id} 
                  className={`hover:bg-tropical-800/40 transition-colors cursor-pointer ${selectedGap === gap.id ? 'bg-tropical-800' : ''}`}
                  onClick={() => setSelectedGap(gap.id)}
                >
                  <td className="p-4 border-b border-tropical-800/30">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </td>
                  <td className="p-4 border-b border-tropical-800/30 font-mono text-tropical-200">{gap.id}</td>
                  <td className="p-4 border-b border-tropical-800/30 font-semibold text-tropical-400">{gap.millimeterWidth.toFixed(2)} mm</td>
                  <td className="p-4 border-b border-tropical-800/30 text-tropical-100">
                    <span className="bg-tropical-700 px-2 py-1 rounded text-xs">{gap.classification}</span>
                  </td>
                  <td className="p-4 border-b border-tropical-800/30 text-tropical-300 italic text-sm">{gap.personality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button className="px-6 py-3 bg-tropical-700 hover:bg-tropical-600 rounded-xl font-semibold flex items-center gap-2 transition-colors">
          <Download className="w-5 h-5" /> Download Report
        </button>
        <button className="px-6 py-3 bg-tropical-700 hover:bg-tropical-600 rounded-xl font-semibold flex items-center gap-2 transition-colors">
          <Share2 className="w-5 h-5" /> Share Result
        </button>
        <button 
          onClick={onReset}
          className="px-6 py-3 border border-tropical-600 hover:bg-tropical-800 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-5 h-5" /> Analyze Another
        </button>
      </div>

    </div>
  );
};

const StatCard = ({ title, value }: { title: string, value: string }) => (
  <div className="glass-panel p-6 text-center border-t-2 border-t-tropical-500">
    <h4 className="text-tropical-300/80 text-sm font-bold tracking-wider mb-2">{title}</h4>
    <div className="text-3xl font-extrabold text-tropical-100">{value}</div>
  </div>
);

export default Results;
