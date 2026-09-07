import React from 'react';
import { 
  CheckCircle2, 
  FileText, 
  History, 
  LayoutDashboard, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompletedView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const decisionAction = selectedBidder.officerDecision?.action || 'REQUIRES_VERIFICATION';

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Success Header (Section 22) ── */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gem-navy">Verification Completed</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Compliance verification and officer decision have been successfully finalized and committed to the audit ledger.
        </p>
      </div>

      {/* ── Completed Verification State Card (Section 22) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-6 sm:p-8 space-y-6 text-xs">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-bold text-gem-blue uppercase tracking-wider block">Completed Scope</span>
          <h2 className="text-lg font-bold text-gem-navy mt-1">{selectedTender.title}</h2>
          <p className="font-mono text-xs text-slate-600 mt-0.5">Tender ID: <strong>{selectedTender.gemBidNo}</strong></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block font-medium">Evaluated Bidder</span>
            <span className="font-bold text-gem-navy text-sm block mt-0.5">{selectedBidder.name}</span>
            <span className="text-[11px] font-mono text-slate-500">{selectedBidder.id}</span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200">
            <span className="text-emerald-800 block font-medium">Verification Status</span>
            <span className="font-bold text-emerald-800 text-sm block mt-0.5">Completed & Verified</span>
            <span className="text-[11px] text-emerald-700">18 Compliance Checks Run</span>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-200">
            <span className="text-gem-navy block font-medium">Officer Decision</span>
            <span className="font-bold text-gem-navy text-sm block mt-0.5 uppercase">
              {decisionAction.replace(/_/g, ' ')}
            </span>
            <span className="text-[11px] text-slate-600">Adjudicated by Rajeev Sharma, ITS</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block font-medium">Verification Dossier</span>
            <span className="font-bold text-slate-800 text-sm block mt-0.5">Available for Download</span>
            <span className="text-[11px] text-slate-500">Includes Cryptographic SHA-256 Stamp</span>
          </div>
        </div>
      </div>

      {/* ── 3 Primary Action Buttons (Section 22) ── */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={() => setActiveView('report')}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-2"
        >
          <FileText className="w-4 h-4 text-gem-blue" />
          <span>View Report</span>
        </button>

        <button
          onClick={() => setActiveView('audit-trail')}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-2"
        >
          <History className="w-4 h-4 text-gem-blue" />
          <span>View Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveView('dashboard')}
          className="px-6 py-2.5 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-xs rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>

    </div>
  );
};
