import React, { useState } from 'react';
import { 
  Gavel, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Scale, 
  Flame, 
  HelpCircle,
  Clock,
  UserCheck,
  Send,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DecisionAction } from '../../types';

export const DecisionView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    recordDecision,
    setActiveView 
  } = useApp();

  const [selectedAction, setSelectedAction] = useState<DecisionAction>('REQUIRES_VERIFICATION');
  const [remarks, setRemarks] = useState(
    'Discrepancy identified in claimed turnover (₹12 Cr vs ₹8.7 Cr MCA Form AOC-4), expired PESO safety certificate (expired 05-Aug-2026 vs 10-Aug-2026 cutoff), and OEM authorization token verification pending. Seeking formal GeM clarification and referring to Petroleum Technical Committee.'
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [decisionSuccessMessage, setDecisionSuccessMessage] = useState<string | null>(null);

  // Exact 4 Officer Actions from Prompt Section 25
  const officerActions: { id: DecisionAction; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'CLEARED',
      label: 'Qualify Bidder',
      icon: CheckCircle2,
      color: 'border-emerald-500 text-emerald-800 bg-emerald-50/40',
      desc: 'Bidder meets all mandatory petroleum procurement eligibility criteria and technical requirements.'
    },
    {
      id: 'REJECT',
      label: 'Disqualify Bidder',
      icon: AlertTriangle,
      color: 'border-red-500 text-red-800 bg-red-50/40',
      desc: 'Bidder fails mandatory statutory criteria or temporal validity conditions (Clause 4.2 / 8.1).'
    },
    {
      id: 'REQUIRES_VERIFICATION',
      label: 'Seek Clarification',
      icon: HelpCircle,
      color: 'border-blue-500 text-blue-800 bg-blue-50/40',
      desc: 'Issue formal GeM Clause 14(c) clarification notice for UDIN turnover reconciliation and ISO/PESO renewal.'
    },
    {
      id: 'FLAGGED_FOR_INVESTIGATION',
      label: 'Refer to Committee',
      icon: Users,
      color: 'border-amber-500 text-amber-800 bg-amber-50/40',
      desc: 'Forward dossier and multi-source evidence packet to MoPNG Technical & Financial Adjudication Committee.'
    }
  ];

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Officer justification remarks are mandatory.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    recordDecision(selectedAction, remarks);
    setShowConfirmModal(false);
    setDecisionSuccessMessage('Decision recorded by Procurement Officer PO-1042.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 25: Procurement Officer Decision) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Adjudication & Governance • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Procurement Officer Final Decision</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Formal qualification determination recorded under Officer ID <strong>PO-1042</strong>.
          </p>
        </div>

        <button
          onClick={() => setActiveView('evidence-explorer')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Evidence Explorer</span>
        </button>
      </div>

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Tender ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Evaluated Bidder</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Authorized Officer</span>
          <span className="font-mono font-bold text-slate-800 mt-0.5 block">PO-1042 (MoPNG)</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">AI Advisory Recommendation</span>
          <span className="font-bold text-amber-800 mt-0.5 block">MANUAL INVESTIGATION</span>
        </div>
      </div>

      {/* ── Success Banner if recorded ── */}
      {decisionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm">{decisionSuccessMessage}</p>
              <p className="text-[11px] font-normal text-emerald-800 mt-0.5 font-mono">
                Event SHA-256 Hash recorded in Immutable Audit Ledger.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('audit-trail')}
            className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs transition cursor-pointer"
          >
            View in Audit Trail →
          </button>
        </div>
      )}

      {/* ── AI Recommendation Card (Section 25) ── */}
      <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-xl flex items-start justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
            !
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                AI DECISION-SUPPORT RECOMMENDATION:
              </span>
              <span className="bg-amber-800 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded font-mono">
                MANUAL INVESTIGATION
              </span>
            </div>
            <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
              Material evidence variances detected in 3 mandatory areas: (1) Turnover inflation deficit (-₹3.3 Cr against ₹10 Cr cutoff), (2) PESO Safety Certificate expired 5 days prior to bid submission cutoff, and (3) Oil & Gas relevant experience discrepancy (3.8 yrs vs 7 yrs declared).
            </p>
          </div>
        </div>
      </div>

      {/* ── Officer Adjudication Form (Section 25) ── */}
      <form onSubmit={handleOpenReview} className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#0F2942]">Select Officer Qualification Determination</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The Procurement Officer holds complete statutory authority to accept, modify, or override the AI advisory indicator.
          </p>
        </div>

        {/* 4 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {officerActions.map((act) => {
            const isSelected = selectedAction === act.id;
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => setSelectedAction(act.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition select-none space-y-1.5 ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-900" />
                    <span className="font-bold text-sm text-[#0F2942]">{act.label}</span>
                  </div>
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => setSelectedAction(act.id)}
                    className="w-4 h-4 text-blue-700 focus:ring-blue-700"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Mandatory Remarks */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            Procurement Officer Remarks & Justification <span className="text-red-600">* (Mandatory for Audit Trail)</span>
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            required
            className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-700 focus:outline-none bg-slate-50 focus:bg-white transition"
            placeholder="Enter reason for selected determination..."
          />
        </div>

        {/* Governance Disclaimer */}
        <div className="p-3 bg-slate-50 border-l-4 border-blue-900 rounded-r-lg text-xs text-slate-700 flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-900 flex-shrink-0" />
          <span>
            e-BID PRAMAAN is an AI decision-support system, NOT an automatic bidder rejection system. The authorized Procurement Officer always makes the final qualification decision.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveView('evidence-explorer')}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
          >
            Back to Evidence
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
          >
            <span>Review & Record Officer Decision</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* ── Confirmation Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-5 text-slate-900 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-base border-b border-slate-100 pb-3">
              <Gavel className="w-5 h-5 text-blue-700" />
              <span>Confirm Officer Adjudication Decision</span>
            </div>

            <p className="text-slate-600">
              Please confirm recording this determination into the immutable tamper-evident audit ledger.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Adjudicating Officer:</span>
                <span className="font-bold text-[#0F2942] font-mono">PO-1042 (Senior Procurement Officer)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tender & Bidder:</span>
                <span className="font-bold text-[#0F2942]">{selectedTender.gemBidNo} • {selectedBidder.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Officer Determination:</span>
                <span className="font-bold text-amber-800 uppercase font-mono">{selectedAction.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Basis / Findings Evaluated:</span>
                <span className="font-bold text-red-700">3 Priority Discrepancies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compiled Rule Versions Applied:</span>
                <span className="font-mono text-blue-900 font-bold">PET-FIN-001 (v1.3), PET-CERT-003 (v1.3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clarification History:</span>
                <span className="font-mono text-slate-700">1 GeM Notice (CLAR-2026-001)</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-slate-500 block">Officer Evaluation Remarks:</span>
                <p className="text-slate-700 italic mt-0.5">"{remarks}"</p>
              </div>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between font-mono">
                <span>Digital Signature Hash:</span>
                <span>sha256:4a8c91d2...</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm & Sign Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
