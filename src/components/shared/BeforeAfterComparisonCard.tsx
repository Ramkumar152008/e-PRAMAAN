import React from 'react';
import { X as XIcon, Check, ArrowRight } from 'lucide-react';

interface ProcessRow {
  traditional: string;
  bidshield: string;
}

const COMPARISON_ROWS: ProcessRow[] = [
  {
    traditional: 'Manual document checking',
    bidshield: 'AI-assisted document analysis'
  },
  {
    traditional: 'Separate verification',
    bidshield: 'Unified evidence verification'
  },
  {
    traditional: 'Manual cross-document comparison',
    bidshield: 'Cross-document comparison'
  },
  {
    traditional: 'Manual issue identification',
    bidshield: 'Prioritized investigation'
  }
];

export const BeforeAfterComparisonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden text-xs">
      
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gem-border bg-slate-50">
        <h3 className="font-bold text-sm text-gem-navy">Verification Process Improvement</h3>
        <p className="text-slate-500 text-[11px] mt-0.5">
          Streamlining procurement evaluation into a structured, evidence-backed workflow
        </p>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-2 divide-x divide-gem-border border-b border-gem-border">
        <div className="px-4 py-2.5 bg-slate-50/80">
          <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">
            Traditional Process
          </span>
        </div>
        <div className="px-4 py-2.5 bg-blue-50/50">
          <span className="font-bold text-gem-navy text-xs uppercase tracking-wider">
            e-BID PRAMAAN
          </span>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="divide-y divide-gem-border">
        {COMPARISON_ROWS.map((row, idx) => (
          <div key={idx} className="grid grid-cols-2 divide-x divide-gem-border">
            <div className="px-4 py-3 flex items-start gap-2 bg-white">
              <XIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700 leading-snug">{row.traditional}</span>
            </div>
            <div className="px-4 py-3 flex items-start gap-2 bg-blue-50/20">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-gem-navy font-semibold leading-snug">{row.bidshield}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Insight */}
      <div className="px-5 py-3 bg-slate-50 border-t border-gem-border flex items-center gap-2 text-gem-navy text-[11px]">
        <ArrowRight className="w-3.5 h-3.5 text-gem-blue flex-shrink-0" />
        <span>
          Enables procurement officers to identify compliance issues rapidly while retaining full decision authority.
        </span>
      </div>

    </div>
  );
};
