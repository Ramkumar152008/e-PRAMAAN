import React, { useState } from 'react';
import { 
  ListOrdered, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvestigationPriorityItem, XAIFinding } from '../../types';
import { FindingExplanationCard } from '../shared/FindingExplanationCard';

export const InvestigationQueueView: React.FC = () => {
  const { selectedBidder, selectedTender, setActiveView } = useApp();
  const [priorities, setPriorities] = useState<InvestigationPriorityItem[]>(selectedBidder.investigationPriorities);
  const [selectedFindingModal, setSelectedFindingModal] = useState<XAIFinding | null>(null);

  const getPriorityBadge = (priority: number, severity: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (severity === 'HIGH') {
      return (
        <span className="px-2.5 py-1 rounded font-bold text-xs bg-red-100 text-red-800 border border-red-300">
          HIGH (P{priority})
        </span>
      );
    }
    if (severity === 'MEDIUM') {
      return (
        <span className="px-2.5 py-1 rounded font-bold text-xs bg-amber-100 text-amber-800 border border-amber-300">
          MEDIUM (P{priority})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded font-bold text-xs bg-slate-100 text-slate-700 border border-slate-300">
        LOW (P{priority})
      </span>
    );
  };

  const getStatusBadge = (status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => {
    switch (status) {
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Verified / Resolved</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">Requires Clarification</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">Pending Review</span>;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleReviewFinding = (item: InvestigationPriorityItem) => {
    const findingMatch: XAIFinding = selectedBidder.findings.find(f => f.rule.includes(item.affectedRule) || f.finding.includes(item.title)) || {
      id: item.id,
      requirement: item.title,
      rule: item.affectedRule,
      claim: item.description,
      submittedDocument: item.evidenceRef,
      verificationSource: 'Reference Data: Registry Records',
      verifiedSource: 'Reference Data: Registry Records',
      comparison: item.description,
      finding: item.description,
      whyItMatters: `This issue impacts the mandatory ${item.affectedRule} condition and requires officer review before qualification.`,
      evidence: item.evidenceRef,
      confidence: 94,
      risk: item.severity,
      recommendedAction: item.recommendedOfficerAction
    };
    setSelectedFindingModal(findingMatch);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gem-navy">Investigation Priority Queue</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Prioritized compliance and document verification findings requiring officer attention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('decision-review')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition"
          >
            <span>Proceed to Decision Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Context Card ── */}
      <div className="p-4 bg-white rounded-lg border border-gem-border shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Scope & Context</span>
          <p className="font-bold text-sm text-gem-navy">{selectedTender.title} ({selectedTender.gemBidNo})</p>
          <p className="text-slate-600">Selected Bidder: <strong>{selectedBidder.name}</strong> ({selectedBidder.id})</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-600">Open Items: <strong>{priorities.filter(p => p.status === 'OPEN').length}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">Overall Risk: <strong className="text-red-700">{selectedBidder.riskProfile.overallRisk}</strong></span>
        </div>
      </div>

      {/* ── Section 26 & 27: Prioritized Findings List ── */}
      <div className="space-y-4">
        {priorities.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gem-border text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800">No findings requiring investigation in the queue.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">All submitted documents and criteria passed verification.</p>
          </div>
        ) : (
          priorities.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg border border-gem-border shadow-gov p-5 space-y-3 hover:border-slate-400 transition"
            >
              {/* Header: Priority, Finding, Bidder, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gem-border pb-3">
                <div className="flex items-start sm:items-center gap-3">
                  {getPriorityBadge(item.priority, item.severity)}
                  <div>
                    <h3 className="font-bold text-sm text-gem-navy">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.affectedRule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Body: Tender, Bidder, Evidence Reference */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-500 text-[11px] block">Tender</span>
                  <p className="font-bold text-gem-navy truncate">{selectedTender.title}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedTender.gemBidNo}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-500 text-[11px] block">Bidder</span>
                  <p className="font-bold text-gem-navy">{selectedBidder.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">PAN: {selectedBidder.pan} • ID: {selectedBidder.id}</p>
                </div>

                <div className="p-3 bg-blue-50/40 rounded border border-blue-200 space-y-1">
                  <span className="font-semibold text-blue-900 text-[11px] block">Evidence Reference</span>
                  <p className="font-medium text-slate-800">{item.evidenceRef}</p>
                </div>
              </div>

              {/* Finding Description & Recommended Action */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                <p className="text-slate-800 font-medium leading-relaxed">{item.description}</p>
                <div className="pt-1 flex items-start gap-1.5 text-[11px] text-slate-600">
                  <span className="font-bold text-gem-navy">Recommended Action:</span>
                  <span>{item.recommendedOfficerAction}</span>
                </div>
              </div>

              {/* Action Buttons: Status Classification & Review Finding */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px] font-semibold">Officer Classification:</span>
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'RESOLVED')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition ${
                      item.status === 'RESOLVED' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'INVESTIGATING')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition ${
                      item.status === 'INVESTIGATING' 
                        ? 'bg-blue-100 text-blue-800 border-blue-300' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Requires Clarification
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'OPEN')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition ${
                      item.status === 'OPEN' 
                        ? 'bg-red-100 text-red-800 border-red-300' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Unresolved
                  </button>
                </div>

                <button
                  onClick={() => handleReviewFinding(item)}
                  className="px-4 py-1.5 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5 ml-auto"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-300" />
                  <span>Review Finding (4-Part Evidence)</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Finding Details Modal */}
      {selectedFindingModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <FindingExplanationCard
              findingTitle={selectedFindingModal.rule}
              what={selectedFindingModal.finding}
              evidence={selectedFindingModal.evidence}
              whyItMatters={selectedFindingModal.whyItMatters}
              recommendedAction={selectedFindingModal.recommendedAction}
              confidence={selectedFindingModal.confidence}
              onClose={() => setSelectedFindingModal(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
