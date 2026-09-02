import React from 'react';
import { Clock, Zap, TrendingDown } from 'lucide-react';

export const TimeSavedMetricCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden text-xs">
      
      {/* Header */}
      <div className="p-4 border-b border-gem-border bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gem-blue" />
          <h3 className="font-bold text-sm text-gem-navy">Process Efficiency</h3>
        </div>
      </div>

      {/* 3 Metric Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gem-border">
        
        {/* Metric 1 */}
        <div className="p-4 text-center space-y-1 bg-white">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            Manual Verification
          </p>
          <p className="text-2xl font-extrabold text-slate-800">45–60</p>
          <p className="text-xs text-slate-600 font-medium">min / bid</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 text-center space-y-1 bg-slate-50/60">
          <p className="text-[11px] text-gem-blue font-bold uppercase tracking-wider">
            AI-Assisted Verification
          </p>
          <p className="text-2xl font-extrabold text-gem-navy">~6.4</p>
          <p className="text-xs text-slate-600 font-medium">min / bid</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 text-center space-y-1 bg-white">
          <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
            Potential Time Reduction
          </p>
          <p className="text-2xl font-extrabold text-emerald-700">~85–90%</p>
          <p className="text-xs text-emerald-800 font-medium">Efficiency Gain</p>
        </div>

      </div>

      {/* Methodology Note */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-gem-border text-[11px] text-slate-500 text-center">
        Indicative estimate based on the configured verification workflow. Actual processing time may vary.
      </div>

    </div>
  );
};
