import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Scale, 
  FileCheck, 
  Briefcase, 
  HelpCircle,
  Clock,
  UserCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClarificationCenterView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const [noticeDraft, setNoticeDraft] = useState(
    `Reference GeM Tender ${selectedTender.gemBidNo} (${selectedTender.title}). During technical compliance verification of your submitted bid (${selectedBidder.id}), a discrepancy of ₹3.30 Crore was observed between your submitted CA Turnover Certificate (claiming ₹12.00 Cr) and official Form AOC-4 statutory financial filings (recording ₹8.70 Cr). You are requested to furnish a UDIN-verified Chartered Accountant reconciliation certificate and audited annual accounts within 3 working days.`
  );
  const [clarificationState, setClarificationState] = useState<'DRAFT' | 'SENT' | 'RESPONSE_RECEIVED' | 'RESOLVED'>('DRAFT');
  const [showCaDossierModal, setShowCaDossierModal] = useState(false);

  const handleSendClarification = () => {
    setClarificationState('SENT');
    alert('Formal Clarification Notice issued to bidder through GeM Communication Portal.');
  };

  const handleSimulateResponse = () => {
    setClarificationState('RESPONSE_RECEIVED');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 12) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gem-navy mb-1">
            <Building2 className="w-4 h-4 text-gem-blue" />
            <span>Tender: {selectedTender.gemBidNo} • Bidder: {selectedBidder.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gem-navy">Smart Clarification Centre</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Exception-handling workflow: AI evidence re-checking, automated notice drafting, and specialist referral.
          </p>
        </div>

        <button
          onClick={() => setActiveView('investigation')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Investigation</span>
        </button>
      </div>

      {/* ── Clarification Lifecycle Stage Stepper (Section 12) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-6 space-y-5 text-xs">
        <h2 className="text-base font-bold text-gem-navy border-b border-slate-100 pb-2">
          AI Clarification Lifecycle
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-mono text-[10px] text-gem-blue font-bold block">STAGE 1</span>
            <span className="font-bold text-gem-navy text-xs mt-0.5 block">AI Issue Detection</span>
            <span className="text-[10px] text-slate-500">Turnover Mismatch (-27.5%)</span>
          </div>

          <div className={`p-3 rounded-lg border transition ${
            clarificationState !== 'DRAFT' ? 'bg-blue-50 border-blue-200 text-gem-navy' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="font-mono text-[10px] font-bold block">STAGE 2</span>
            <span className="font-bold text-xs mt-0.5 block">Notice Dispatched</span>
            <span className="text-[10px]">{clarificationState !== 'DRAFT' ? 'Issued on GeM' : 'Awaiting Approval'}</span>
          </div>

          <div className={`p-3 rounded-lg border transition ${
            clarificationState === 'RESPONSE_RECEIVED' || clarificationState === 'RESOLVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="font-mono text-[10px] font-bold block">STAGE 3</span>
            <span className="font-bold text-xs mt-0.5 block">Bidder Response</span>
            <span className="text-[10px]">{clarificationState === 'RESPONSE_RECEIVED' ? 'UDIN Cert Uploaded' : 'Pending Bidder'}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
            <span className="font-mono text-[10px] font-bold block">STAGE 4</span>
            <span className="font-bold text-xs mt-0.5 block">Officer Adjudication</span>
            <span className="text-[10px]">Final Determination</span>
          </div>
        </div>

        {/* AI Notice Drafter */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-xs">
              AI-Generated Clarification Notice (Officer Review & Edit)
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              GeM Clause 14(c) Notice
            </span>
          </div>

          <textarea
            value={noticeDraft}
            onChange={(e) => setNoticeDraft(e.target.value)}
            rows={5}
            disabled={clarificationState !== 'DRAFT'}
            className="w-full p-3.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-gem-blue focus:outline-none bg-slate-50 focus:bg-white font-mono leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {clarificationState === 'DRAFT' ? (
                <button
                  type="button"
                  onClick={handleSendClarification}
                  className="px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded-lg text-xs font-bold shadow-gov transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Approve & Issue Clarification Notice</span>
                </button>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs">
                  Notice Active • Awaiting Bidder Submission (Cutoff: 3 Days)
                </span>
              )}

              {clarificationState === 'SENT' && (
                <button
                  type="button"
                  onClick={handleSimulateResponse}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300 transition"
                >
                  Simulate Bidder Response Ingestion
                </button>
              )}
            </div>

            {/* Specialist Referral Button (Section 12) */}
            <button
              type="button"
              onClick={() => setShowCaDossierModal(true)}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-700" />
              <span>Refer to Finance / CA Committee</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── Navigation Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('investigation')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition"
        >
          Back to Investigation Queue
        </button>

        <button
          onClick={() => setActiveView('decision')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Proceed to Officer Decision</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Finance / CA Committee Review Dossier Modal (Section 12) ── */}
      {showCaDossierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 space-y-4 text-slate-900 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-gem-navy font-bold text-base">
                <Briefcase className="w-5 h-5 text-purple-700" />
                <span>Specialist Finance & CA Review Dossier Package</span>
              </div>
              <button
                onClick={() => setShowCaDossierModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600">
              Structured evaluation package compiled by e-BID PRAMAAN for formal advisory review by the designated Chartered Accountant / Finance Committee.
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">1. Target Issue:</span>
                <p className="text-slate-700 mt-0.5">Turnover reconciliation variance between claimed CA Statement and MCA21 statutory filings.</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block">2. Tender Mandate:</span>
                <p className="text-slate-700 mt-0.5">Clause 4.2: Average annual operating turnover ≥ ₹10.00 Crore across FY23-26.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-white rounded border border-blue-200">
                  <span className="font-bold text-gem-navy block text-[11px]">Bidder Declared Turnover</span>
                  <span className="text-sm font-bold text-gem-navy mt-0.5 block">₹12.00 Crore</span>
                </div>
                <div className="p-2.5 bg-white rounded border border-amber-200">
                  <span className="font-bold text-amber-900 block text-[11px]">Reference Master Turnover (AOC-4)</span>
                  <span className="text-sm font-bold text-amber-800 mt-0.5 block">₹8.70 Crore</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-purple-900 block">3. Specific Committee Referral Questions:</span>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                  <li>Verify if GST turnover reconciliation statements substantiate operating revenue of ₹12 Cr.</li>
                  <li>Confirm whether exceptional/other income was erroneously consolidated in the bidder CA certificate.</li>
                  <li>Provide formal advisory recommendation on financial eligibility satisfaction.</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded text-purple-900 text-[11px] flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span>AI assists the Finance Committee with automated evidence compilation but does NOT replace statutory CA assessment.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCaDossierModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  alert('Finance Committee Review Package exported and forwarded to Financial Advisor.');
                  setShowCaDossierModal(false);
                }}
                className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-lg shadow-gov transition"
              >
                Forward Package to Finance Member
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
