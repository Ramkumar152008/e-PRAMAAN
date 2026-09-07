import React from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Scale, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EvidenceReviewView: React.FC = () => {
  const { 
    selectedDepartment,
    selectedTender, 
    selectedBidder, 
    selectedFindingIndex, 
    setActiveView 
  } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 15) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Side-by-Side Evidence Review</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Direct comparison of bidder-submitted documents against official reference records.
          </p>
        </div>

        <button
          onClick={() => setActiveView('finding-details')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Finding</span>
        </button>
      </div>

      {/* ── Persistent Context Bar (Section 3) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Department</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedDepartment}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Tender</span>
          <span className="font-mono font-bold text-gem-navy mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bidder</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bid ID</span>
          <span className="font-mono font-bold text-gem-blue mt-0.5 block">{selectedBidder.id}</span>
        </div>
      </div>

      {/* ── 2-Column Side-by-Side Evidence Comparison (Section 15) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Source 1: Bidder Declaration */}
        <div className="bg-white rounded-xl border border-blue-200 shadow-gov p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <span className="text-[11px] font-bold text-gem-navy uppercase tracking-wider">Source 1: Bidder Submission</span>
            <span className="px-2 py-0.5 bg-blue-50 text-gem-navy font-bold text-[10px] rounded border border-blue-200">
              Submitted Document
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Document Title</span>
              <span className="font-bold text-slate-900">CA_Certified_Turnover_Statement_FY23-26.pdf</span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Claimed Parameter</span>
              <span className="font-bold text-gem-navy text-sm">Average Annual Turnover: ₹12.0 Crore</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-400 block">Extraction Date</span>
                <span className="font-semibold text-slate-700">09-Aug-2026</span>
              </div>
              <div>
                <span className="text-slate-400 block">Document Checksum</span>
                <span className="font-mono text-slate-600 truncate block">sha256:e3b0...855</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 font-mono">
              "We hereby certify that M/s ABC Industries Pvt Ltd had average annual turnover of ₹12.00 Cr for FY 2023-26..."
            </div>
          </div>
        </div>

        {/* Source 2: Reference Evidence Record */}
        <div className="bg-white rounded-xl border border-amber-200 shadow-gov p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Source 2: Reference Record</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 font-bold text-[10px] rounded border border-amber-200">
              Configured Reference Data
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Reference Source</span>
              <span className="font-bold text-slate-900">Reference Record: MCA21 AOC-4 Financial Filing</span>
            </div>

            <div>
              <span className="text-slate-500 block font-medium">Recorded Parameter</span>
              <span className="font-bold text-amber-800 text-sm">Audited Revenue: ₹8.7 Crore</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-400 block">Filing Timestamp</span>
                <span className="font-semibold text-slate-700">30-Oct-2025</span>
              </div>
              <div>
                <span className="text-slate-400 block">SRN Reference</span>
                <span className="font-mono text-slate-600 truncate block">SRN-AOC4-2025-99214</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 font-mono">
              "Total Revenue from Operations (Line 19 Form AOC-4): ₹8,70,00,000 against CIN U72900KA2018PTC112345..."
            </div>
          </div>
        </div>

      </div>

      {/* ── Summary Analysis Table (Section 15) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-5 space-y-3">
        <h3 className="text-sm font-bold text-gem-navy">Cross-Document Evidence Summary</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-2.5">Field</th>
                <th className="p-2.5">Submitted Value</th>
                <th className="p-2.5">Reference Value</th>
                <th className="p-2.5">Variance / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2.5 font-semibold text-slate-700">Average Turnover</td>
                <td className="p-2.5 text-gem-navy font-bold">₹12.0 Crore</td>
                <td className="p-2.5 text-amber-800 font-bold">₹8.7 Crore</td>
                <td className="p-2.5">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded text-[11px]">
                    -₹3.3 Cr (-27.5% Deficit)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-700">GST Registration</td>
                <td className="p-2.5 font-mono">29ABCDE1234F1Z5</td>
                <td className="p-2.5 font-mono">29ABCDE1234F1Z5</td>
                <td className="p-2.5">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                    Exact Match
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Navigation Buttons (Section 15) ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('finding-details')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition"
        >
          Back to Finding Details
        </button>

        <button
          onClick={() => setActiveView('investigation')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Continue to Investigation & Clarification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
