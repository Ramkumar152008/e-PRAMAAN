import React from 'react';
import { 
  FileCode2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  Flame,
  Binary
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ComplianceRulesView: React.FC = () => {
  const { 
    selectedTender, 
    bidders,
    setActiveView 
  } = useApp();

  const rules = selectedTender.rules;
  const matchingBidsCount = bidders.filter(b => b.tenderId === selectedTender.id).length || 3;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 12: Tender-to-Rule Compiler) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Tender-to-Rule Compiler • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Structured Compliance Rules Register</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Deterministic, machine-verifiable rule definitions compiled from natural-language tender clauses.
          </p>
        </div>

        <button
          onClick={() => setActiveView('tender-requirement-analysis')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Analysis</span>
        </button>
      </div>

      {/* ── Context Box ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Department</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block">{selectedTender.department}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Tender ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Compiled Rules</span>
          <span className="font-bold text-blue-700 mt-0.5 block">{rules.length} Machine Criteria</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Execution Mode</span>
          <span className="font-bold text-emerald-700 mt-0.5 block">Automated Multi-Source</span>
        </div>
      </div>

      {/* ── Structured Rules Table (Section 12 Example) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
            <Binary className="w-4 h-4 text-blue-700" />
            <span>Machine-Verifiable Rule Register (Compiled from Tender Clauses)</span>
          </div>
          <span className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
            100% Deterministic Logic
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Requirement ID</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Metric & Description</th>
                <th className="p-3.5">Threshold Value</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Period / Horizon</th>
                <th className="p-3.5">Mandatory</th>
                <th className="p-3.5">Source Clause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/30 transition">
                  <td className="p-3.5 font-mono font-bold text-blue-900">
                    <span className="block">{r.id}</span>
                    <span className="text-[10px] font-normal text-slate-500 font-mono">v1.3 (01-Apr-2026)</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {r.category}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <span className="font-bold text-[#0F2942] block">{r.metric}</span>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{r.description}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">
                    {r.minimumValue} {r.unit || ''}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-700 text-[11px]">
                    {r.operator}
                  </td>
                  <td className="p-3.5 text-slate-600 text-[11px]">
                    {r.period || 'On Bid Date'}
                  </td>
                  <td className="p-3.5">
                    {r.mandatory ? (
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-200">
                        YES
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-600">
                        OPTIONAL
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-blue-800 text-[11px]">
                    {r.referenceClause}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Primary Action Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('tender-requirement-analysis')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          Back to AI Clause Analysis
        </button>

        <button
          onClick={() => setActiveView('bids-received')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Select Bidder & Ingest Documents ({matchingBidsCount})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
