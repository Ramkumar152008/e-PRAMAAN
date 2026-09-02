import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  FileText, 
  Scale, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  Eye,
  GitBranch,
  Send,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FindingExplanationProps {
  findingTitle: string;
  ruleId?: string;
  ruleVersion?: string;
  requirement?: string;
  claim?: string;
  what?: string;              // What was found?
  evidence: string;          // Supporting Evidence
  verifiedSource?: string;
  verifiedValue?: string;
  difference?: string;
  whyItMatters: string;      // Why does it matter?
  recommendedAction: string; // Recommended Action
  confidence?: number;
  onClose?: () => void;
  defaultExpanded?: boolean;
}

export const FindingExplanationCard: React.FC<FindingExplanationProps> = ({
  findingTitle,
  ruleId = 'PET-FIN-001',
  ruleVersion = 'v1.3',
  requirement,
  claim,
  what,
  evidence,
  verifiedSource,
  verifiedValue,
  difference,
  whyItMatters,
  recommendedAction,
  confidence = 94,
  onClose,
  defaultExpanded = true
}) => {
  const { setActiveView } = useApp();
  const [showDeeperEvidence, setShowDeeperEvidence] = useState(false);

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 shadow-xl overflow-hidden text-xs font-sans animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Why Am I Seeing This? (Explainability Inspector)
            </span>
            <h3 className="font-bold text-[#0F2942] text-sm">{findingTitle}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded font-bold">
            Rule: {ruleId} ({ruleVersion})
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Structured 5-Part Information Cards */}
      <div className="p-5 space-y-3.5">
        
        {/* 1. Tender Rule & Requirement */}
        {requirement && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-blue-700" />
              <span>1. Tender Rule & Requirement</span>
            </div>
            <p className="text-slate-900 font-bold">{requirement}</p>
            <p className="font-mono text-[10px] text-blue-900 pt-0.5">Threshold: Mandated Mandatory Eligibility Requirement</p>
          </div>
        )}

        {/* 2. Bidder Claim vs Submitted Evidence vs Verified Record */}
        <div className="p-3.5 bg-red-50/40 rounded-lg border border-red-200 space-y-2">
          <div className="flex items-center gap-1.5 text-red-900 font-bold text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>2. Claim vs Verified Source Comparison</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Bidder Submitted Claim:</span>
              <p className="font-bold text-slate-900">{claim || what || findingTitle}</p>
              <span className="text-[10px] text-slate-500 font-mono block truncate">Doc: {evidence}</span>
            </div>

            <div className="sm:border-l sm:border-red-200 sm:pl-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Verified Reference Record:</span>
              <p className="font-bold text-red-700">{verifiedValue || verifiedSource || 'Discrepancy observed against official registry'}</p>
              {difference && (
                <span className="text-[10px] text-red-800 font-bold font-mono block">Variance: {difference}</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Why It Matters (Procurement & Legal Impact) */}
        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-700" />
            <span>3. Why Does It Matter? (Statutory & Evaluation Impact)</span>
          </div>
          <p className="text-slate-800 font-medium leading-relaxed">{whyItMatters}</p>
        </div>

        {/* 4. Recommended Action */}
        <div className="p-3 bg-slate-900 text-white rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-sky-300 font-bold text-[11px] uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span>4. Recommended Officer Action</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium">{recommendedAction}</p>
        </div>

        {/* 5. Direct Action Buttons (Feature 2) */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('evidence-explorer')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-700" />
              <span>View Evidence</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('compliance-rules')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-700" />
              <span>View Rule ({ruleId})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('clarification-center')}
            className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request Clarification</span>
          </button>
        </div>

      </div>

    </div>
  );
};
