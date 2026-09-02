import React, { useState } from 'react';
import { 
  SearchCode, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle,
  Flame,
  GitBranch,
  ShieldCheck,
  Building2,
  Scale,
  Sparkles,
  FileText,
  Lock,
  Check,
  Edit3,
  Flag,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { XAIFinding } from '../../types';

export const EvidenceExplorerView: React.FC = () => {
  const { selectedTender, selectedBidder, setActiveView } = useApp();
  const findings = selectedBidder.findings;
  const [selectedFinding, setSelectedFinding] = useState<XAIFinding>(findings[0] || null);

  // Human-in-the-loop confirmation states
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [correctedValue, setCorrectedValue] = useState('');

  const handleConfirmValue = () => {
    setIsConfirmed(true);
    setIsFlagged(false);
    alert(`Officer PO-1042 confirmed extracted value: "${selectedFinding?.claim}"`);
  };

  const handleFlagForReview = () => {
    setIsFlagged(true);
    setIsConfirmed(false);
    alert(`Finding "${selectedFinding?.rule}" flagged for manual specialist committee review.`);
  };

  const handleSaveCorrection = () => {
    if (!correctedValue.trim()) return;
    setIsEditing(false);
    setIsConfirmed(true);
    alert(`Extracted value corrected by Officer to: "${correctedValue}"`);
  };

  // 9-Step Deductive XAI Steps
  const deductiveSteps = [
    { step: 1, label: 'Tender Requirement', value: selectedFinding?.requirement, icon: Scale, type: 'REQUIREMENT' },
    { step: 2, label: 'Machine Rule', value: selectedFinding?.rule, icon: GitBranch, type: 'RULE' },
    { step: 3, label: 'Bidder Submitted Claim', value: selectedFinding?.claim, icon: FileText, type: 'CLAIM' },
    { step: 4, label: 'Submitted Document', value: selectedFinding?.submittedDocument, icon: FileText, type: 'DOCUMENT' },
    { step: 5, label: 'Verification Registry Source', value: selectedFinding?.verificationSource || selectedFinding?.verifiedSource, icon: Building2, type: 'SOURCE' },
    { step: 6, label: 'Direct Comparison & Variance', value: selectedFinding?.comparison, icon: SearchCode, type: 'COMPARISON' },
    { step: 7, label: 'Deductive Finding', value: selectedFinding?.finding, icon: AlertTriangle, type: 'FINDING' },
    { step: 8, label: 'Why It Matters (Legal/OISD Impact)', value: selectedFinding?.whyItMatters, icon: ShieldCheck, type: 'IMPACT' },
    { step: 9, label: 'Recommended Officer Action', value: selectedFinding?.recommendedAction, icon: Sparkles, type: 'ACTION' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <SearchCode className="w-4 h-4 text-blue-700" />
            <span>SIH26100 • Explainable AI & Provenance Layer</span>
            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
              Evidence Chain of Custody
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Evidence Explorer & Deductive Reasoning Chain</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Transparent 9-step evidence chain connecting tender clauses, primary documents, registry cross-checks, and human adjudication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('investigation-priority')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Investigation Queue</span>
          </button>

          <button
            onClick={() => setActiveView('clarification-center')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Clarification Centre →</span>
          </button>
        </div>
      </div>

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Tender ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Investigated Bidder</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block truncate">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Adjudicated Chains</span>
          <span className="font-bold text-red-700 mt-0.5 block">{findings.length} Discrepancy Chains</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">AI Reasoning Engine</span>
          <span className="font-bold text-emerald-700 mt-0.5 block">100% Deterministic Evidence</span>
        </div>
      </div>

      {/* ── Main Layout: Finding Selector & 9-Step Chain ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Findings Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#0F2942] uppercase tracking-wider">
              Available Evidence Chains ({findings.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Select to Trace</span>
          </div>
          
          <div className="space-y-2">
            {findings.map((f) => {
              const isSelected = selectedFinding?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFinding(f);
                    setIsConfirmed(false);
                    setIsFlagged(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected 
                      ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-600/40 shadow-sm' 
                      : 'bg-white border-slate-200 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[#0F2942]">
                    <span className="truncate">{f.rule}</span>
                    <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                      {f.risk} RISK
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                    {f.finding}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Evidence: <strong>91% Conf</strong></span>
                    <span className="text-blue-700 font-bold">Trace Chain →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Separation of Confidence Metrics Box (Section 8) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Multi-Tier Confidence Breakdown</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">1. AI OCR Extraction Confidence:</span>
                <span className="font-mono font-bold text-blue-900">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">2. Registry Source Match Confidence:</span>
                <span className="font-mono font-bold text-emerald-700">98%</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-900">3. Overall Evidence Certainty:</span>
                <span className="font-mono font-extrabold text-indigo-900">91%</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              AI extraction confidence (94%) denotes OCR accuracy, while Registry match (98%) denotes official record consistency.
            </p>
          </div>
        </div>

        {/* Right 8 Cols: 9-Step Deductive Chain & Human Confirmation */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Header of Active Chain */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Deductive Reasoning Trace # {selectedFinding?.id}
                </span>
                <h2 className="text-base font-bold text-[#0F2942]">
                  {selectedFinding?.rule}
                </h2>
              </div>

              {/* Human Confirmation Status Pill */}
              <div className="flex items-center gap-1.5">
                {isConfirmed && (
                  <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>OFFICER CONFIRMED</span>
                  </span>
                )}
                {isFlagged && (
                  <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-amber-600" />
                    <span>FLAGGED FOR COMMITTEE</span>
                  </span>
                )}
              </div>
            </div>

            {/* Visual 9-Step Vertical Trace Chain */}
            <div className="space-y-3 relative pl-4 border-l-2 border-blue-200">
              {deductiveSteps.map((s) => {
                const Icon = s.icon;
                const isFinal = s.step === 9;
                const isConflict = s.step === 7 || s.step === 6;

                return (
                  <div key={s.step} className="relative group">
                    {/* Circle Step Number Indicator on the line */}
                    <div className={`absolute -left-[25px] top-1 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isFinal ? 'bg-emerald-700 text-white' : isConflict ? 'bg-red-600 text-white' : 'bg-[#0F2942] text-white'
                    }`}>
                      {s.step}
                    </div>

                    <div className={`p-3 rounded-lg border text-xs space-y-1 transition ${
                      isConflict ? 'bg-red-50/40 border-red-200' : isFinal ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-[#0F2942]">
                        <Icon className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                        <span>Step {s.step}: {s.label}</span>
                      </div>
                      <p className="text-slate-800 font-medium pl-5 leading-relaxed">
                        {s.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Human-in-the-Loop Controls (Section 9) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Human-in-the-Loop Officer Field Verification</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Officer ID: PO-1042</span>
              </div>

              {isEditing ? (
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
                  <label className="font-bold text-slate-800 text-[11px] block">
                    Correct Extracted Value:
                  </label>
                  <input
                    type="text"
                    value={correctedValue}
                    onChange={(e) => setCorrectedValue(e.target.value)}
                    placeholder="Enter manual corrected value..."
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white text-slate-900"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-white border border-slate-300 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCorrection}
                      className="px-3 py-1 bg-[#0F2942] text-white rounded text-xs font-bold"
                    >
                      Save Correction
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => alert(`Inspecting source document: ${selectedFinding?.submittedDocument}`)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    <span>View Evidence Snippet</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCorrectedValue(selectedFinding?.claim || '');
                        setIsEditing(true);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Correct Value</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFlagForReview}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5 text-amber-700" />
                      <span>Flag for Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmValue}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Extracted Value</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ── Bottom Navigation ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('investigation-priority')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Investigation Queue
        </button>

        <button
          onClick={() => setActiveView('clarification-center')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Clarification Centre</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
