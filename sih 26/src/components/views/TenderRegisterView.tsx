import React, { useState } from 'react';
import { 
  Binary, 
  FileCode2, 
  ArrowRight, 
  CheckCircle2, 
  SlidersHorizontal, 
  HelpCircle, 
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TenderRule } from '../../types';

export const TenderRegisterView: React.FC = () => {
  const { selectedTender, setActiveView } = useApp();
  const [selectedRule, setSelectedRule] = useState<TenderRule>(selectedTender.rules[0]);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'FINANCIAL':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">FINANCIAL</span>;
      case 'TEMPORAL':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">TEMPORAL VALIDITY</span>;
      case 'OEM':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">OEM AUTHORIZATION</span>;
      case 'DEBARMENT':
        return <span className="bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold">NON-DEBARMENT</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">STATUTORY / REGISTRATION</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Tender-to-Rule Compiler & Requirement Register</h1>
          <p className="text-xs text-gem-textMuted mt-0.5">
            Tender: <strong className="text-gem-navy">{selectedTender.gemBidNo}</strong> • Deterministic Machine Evaluation Rules
          </p>
        </div>

        <button
          onClick={() => setActiveView('bidders')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition self-start sm:self-auto"
        >
          <span>Proceed to Bidder Ingestion</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Clause to Rule Translation Showcase */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-elevated space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-gem-accent" />
            <span className="font-bold text-sm text-sky-200">Natural-Language Clause → Structured Rule Compiler</span>
          </div>
          <span className="text-[10px] font-mono bg-gem-blue px-2 py-0.5 rounded text-white font-bold">
            Rule Active: {selectedRule?.id || 'RULE-01'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {/* Step 1: Raw RFP Clause */}
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              1. Unstructured RFP Legal Clause
            </p>
            <p className="text-slate-200 italic leading-relaxed">
              "{selectedRule?.description}"
            </p>
            <p className="text-[10px] text-sky-300 font-mono">Reference: {selectedRule?.referenceClause}</p>
          </div>

          {/* Step 2: Extracted Semantic Fields */}
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              2. AI Semantic Classification
            </p>
            <div className="space-y-1 font-mono text-[11px]">
              <p><span className="text-slate-400">Metric:</span> <span className="text-emerald-300 font-bold">{selectedRule?.metric}</span></p>
              <p><span className="text-slate-400">Threshold:</span> <span className="text-white font-bold">{selectedRule?.minimumValue} {selectedRule?.unit || ''}</span></p>
              <p><span className="text-slate-400">Period:</span> <span className="text-slate-300">{selectedRule?.period || 'N/A'}</span></p>
              <p><span className="text-slate-400">Mandatory:</span> <span className={selectedRule?.mandatory ? 'text-amber-300 font-bold' : 'text-slate-300'}>{selectedRule?.mandatory ? 'TRUE (Disqualifying)' : 'FALSE'}</span></p>
            </div>
          </div>

          {/* Step 3: Executable Machine Rule */}
          <div className="p-4 bg-slate-950 rounded-lg border border-gem-accent/40 space-y-2">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>3. Machine Logic (JSON-LD)</span>
              <FileCode2 className="w-3.5 h-3.5" />
            </p>
            <pre className="font-mono text-[10px] text-emerald-300 bg-black/40 p-2 rounded overflow-x-auto">
{JSON.stringify({
  ruleId: selectedRule?.id,
  operator: selectedRule?.operator,
  threshold: selectedRule?.minimumValue,
  mandatory: selectedRule?.mandatory,
  sourceClause: selectedRule?.referenceClause
}, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Complete Rule Register Table */}
      <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden">
        <div className="p-4 border-b border-gem-border bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gem-navy">Structured Rule Register ({selectedTender.rules.length} Rules)</h3>
            <p className="text-xs text-gem-textMuted">Click a row to inspect its compilation trace and verification bindings</p>
          </div>
          <span className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded text-slate-700 font-medium">
            Tender Cutoff Bid Date: <strong>10 August 2026</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gem-textSubtle font-semibold border-b border-gem-border">
                <th className="p-3">Rule ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Evaluation Metric</th>
                <th className="p-3">Condition / Operator</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Mandatory</th>
                <th className="p-3">Source Clause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gem-border">
              {selectedTender.rules.map((rule) => {
                const isSelected = selectedRule?.id === rule.id;
                return (
                  <tr
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className={`hover:bg-slate-50 cursor-pointer transition ${
                      isSelected ? 'bg-blue-50/80 font-medium' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-gem-blue">{rule.id}</td>
                    <td className="p-3">{getCategoryBadge(rule.category)}</td>
                    <td className="p-3 font-bold text-gem-navy">{rule.metric}</td>
                    <td className="p-3 font-mono text-slate-700 font-semibold">{rule.operator}</td>
                    <td className="p-3 font-bold text-slate-900">{rule.minimumValue} {rule.unit || ''}</td>
                    <td className="p-3">
                      {rule.mandatory ? (
                        <span className="bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          MANDATORY
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                          OPTIONAL
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">{rule.referenceClause}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
