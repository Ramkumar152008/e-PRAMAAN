import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  FileSearch2, 
  Gavel,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskLevel, DecisionAction } from '../../types';

function formatOfficerDecision(action: DecisionAction | undefined): string {
  if (!action || action === 'PENDING') return 'Pending Officer Decision';
  switch (action) {
    case 'APPROVE':
    case 'CLEARED':
      return 'Cleared for Further Evaluation';
    case 'REJECT':
      return 'Rejected';
    case 'REQUEST_CLARIFICATION':
    case 'REQUIRES_VERIFICATION':
      return 'Requires Verification';
    case 'MANUAL_INVESTIGATION':
    case 'FLAGGED_FOR_INVESTIGATION':
      return 'Flagged for Investigation';
    default:
      return 'Pending Officer Decision';
  }
}

function decisionStateBadgeStyle(action: DecisionAction | undefined): string {
  if (!action || action === 'PENDING') return 'bg-slate-100 text-slate-700 border-slate-300';
  switch (action) {
    case 'APPROVE':
    case 'CLEARED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'REJECT':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'REQUEST_CLARIFICATION':
    case 'REQUIRES_VERIFICATION':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'MANUAL_INVESTIGATION':
    case 'FLAGGED_FOR_INVESTIGATION':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
}

function riskBadgeStyle(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW':
      return 'text-emerald-800 bg-emerald-100 border-emerald-300';
    case 'MEDIUM':
      return 'text-amber-800 bg-amber-100 border-amber-300';
    case 'HIGH':
      return 'text-red-800 bg-red-100 border-red-300';
    case 'CRITICAL':
      return 'text-rose-900 bg-rose-200 border-rose-400';
  }
}

export const DecisionSummaryCard: React.FC = () => {
  const { selectedBidder, setActiveView } = useApp();
  const { riskProfile, findings, temporalCompliance, crossVerifications, investigationPriorities, officerDecision } = selectedBidder;

  const keyFindings = findings.length;
  const evidenceConflicts = crossVerifications.filter(v => v.status === 'CONFLICT' || v.status === 'FAIL').length;
  const validityIssues = temporalCompliance.filter(t => t.status === 'EXPIRED_BEFORE_BID').length;
  const openInvestigations = investigationPriorities.filter(i => i.status === 'OPEN').length;

  return (
    <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden text-xs">
      
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-gem-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gem-blue" />
          <div>
            <h3 className="font-bold text-sm text-gem-navy">Decision Support Summary</h3>
            <p className="text-slate-500 text-[11px]">
              Bidder: <strong className="text-gem-navy">{selectedBidder.name}</strong> ({selectedBidder.id})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-semibold">Overall Risk:</span>
          <span className={`px-2.5 py-0.5 rounded font-bold text-xs border ${riskBadgeStyle(riskProfile.overallRisk)}`}>
            {riskProfile.overallRisk}
          </span>
        </div>
      </div>

      {/* 4 Quantitative Indicators */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-gem-border">
        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-500">Key Findings</p>
          <p className="text-xl font-extrabold text-gem-navy">{keyFindings}</p>
        </div>
        <div className="p-3 bg-red-50 rounded border border-red-200 text-center space-y-0.5">
          <p className="text-[11px] font-semibold text-red-800">Evidence Conflicts</p>
          <p className="text-xl font-extrabold text-red-700">{evidenceConflicts}</p>
        </div>
        <div className="p-3 bg-amber-50 rounded border border-amber-200 text-center space-y-0.5">
          <p className="text-[11px] font-semibold text-amber-800">Validity Issues</p>
          <p className="text-xl font-extrabold text-amber-700">{validityIssues}</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded border border-indigo-200 text-center space-y-0.5">
          <p className="text-[11px] font-semibold text-indigo-800">Open Investigations</p>
          <p className="text-xl font-extrabold text-indigo-700">{openInvestigations}</p>
        </div>
      </div>

      {/* AI Recommendation & Officer Decision */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gem-border bg-slate-50/50">
        
        {/* Left: AI Recommendation */}
        <div className="p-3 bg-white rounded border border-gem-border space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            AI Recommendation
          </span>
          <p className="font-bold text-sm text-gem-navy font-mono">
            Manual Investigation Recommended
          </p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Advisory recommendation based on verified registry discrepancies.
          </p>
        </div>

        {/* Right: Officer Decision */}
        <div className="p-3 bg-white rounded border border-gem-border space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Officer Decision
            </span>
            <div className="mt-1">
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold border ${decisionStateBadgeStyle(officerDecision?.action)}`}>
                {formatOfficerDecision(officerDecision?.action)}
              </span>
            </div>
          </div>
          <div className="pt-1">
            <button
              onClick={() => setActiveView('decision-review')}
              className="inline-flex items-center gap-1 text-gem-blue hover:text-gem-blueHover font-bold text-xs"
            >
              <span>{officerDecision ? 'Review or Amend Decision' : 'Record Officer Decision'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-slate-50 text-[11px] text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gem-blue flex-shrink-0" />
        <span>
          AI provides decision support. Final procurement decision remains with the authorized officer.
        </span>
      </div>

    </div>
  );
};
