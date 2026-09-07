import React, { useState } from 'react';
import { 
  TableProperties, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  ShieldCheck, 
  GitFork, 
  Scale, 
  HelpCircle,
  X,
  Flame,
  Activity,
  Layers,
  PieChart,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FindingExplanationCard } from '../shared/FindingExplanationCard';

export const BidComplianceMatrixView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    setSelectedFindingIndex,
    setActiveView 
  } = useApp();

  const [activeExplainRow, setActiveExplainRow] = useState<any | null>(null);
  const [filterResult, setFilterResult] = useState<string>('ALL');

  const complianceRows = selectedBidder.complianceMatrix;

  // Tender Evidence Coverage Calculation (Feature 1)
  const totalReqs = complianceRows.length;
  const verifiedCount = complianceRows.filter(r => r.result === 'PASS').length;
  const conflictCount = complianceRows.filter(r => r.result === 'CONFLICT').length;
  const expiredCount = complianceRows.filter(r => r.result === 'FAIL').length;
  const warningCount = complianceRows.filter(r => r.result === 'WARNING').length;
  const coveragePercent = Math.round((verifiedCount / totalReqs) * 100);

  const getResultBadge = (st: string) => {
    switch (st) {
      case 'PASS':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>VERIFIED</span>
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-300 inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>CONFLICTING</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-amber-700" />
            <span>PENDING</span>
          </span>
        );
      case 'FAIL':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-900 border border-rose-300 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-700" />
            <span>EXPIRED</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
            {st}
          </span>
        );
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-300">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">LOW</span>;
    }
  };

  const filteredRows = filterResult === 'ALL'
    ? complianceRows
    : complianceRows.filter(r => {
        if (filterResult === 'VERIFIED') return r.result === 'PASS';
        if (filterResult === 'CONFLICTING') return r.result === 'CONFLICT';
        if (filterResult === 'EXPIRED') return r.result === 'FAIL';
        if (filterResult === 'PENDING') return r.result === 'WARNING';
        return true;
      });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <Scale className="w-4 h-4 text-blue-700" />
            <span>Compliance Synthesis • Tender: {selectedTender.gemBidNo}</span>
            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
              Coverage & Reconciliation
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Tender Evidence Coverage & Compliance Matrix</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Evaluates: <em>"Do I have sufficient evidence to evaluate this bidder against mandatory tender clauses?"</em>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('truth-graph')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Truth Graph</span>
          </button>

          <button
            onClick={() => setActiveView('risk-intelligence')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Risk Intelligence →</span>
          </button>
        </div>
      </div>

      {/* ── FEATURE 1: Tender Evidence Coverage Widget ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2942]">Tender Evidence Coverage Breakdown</h2>
              <p className="text-xs text-slate-600">
                {totalReqs} Mandatory Requirements • {verifiedCount} Fully Supported • {conflictCount} Conflicting • {expiredCount} Expired • {warningCount} Pending
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Overall Coverage:</span>
            <span className="text-xl font-extrabold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              {coveragePercent}%
            </span>
          </div>
        </div>

        {/* Coverage Status Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden">
          <div style={{ width: `${(verifiedCount / totalReqs) * 100}%` }} className="bg-emerald-500" title={`Verified: ${verifiedCount}`} />
          <div style={{ width: `${(conflictCount / totalReqs) * 100}%` }} className="bg-red-500" title={`Conflicting: ${conflictCount}`} />
          <div style={{ width: `${(expiredCount / totalReqs) * 100}%` }} className="bg-rose-500" title={`Expired: ${expiredCount}`} />
          <div style={{ width: `${(warningCount / totalReqs) * 100}%` }} className="bg-amber-500" title={`Pending: ${warningCount}`} />
        </div>

        {/* Clickable Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Matrix:
          </span>

          <button
            onClick={() => setFilterResult('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filterResult === 'ALL'
                ? 'bg-[#0F2942] text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            All Requirements ({totalReqs})
          </button>

          <button
            onClick={() => setFilterResult('VERIFIED')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filterResult === 'VERIFIED'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            ✓ Fully Supported ({verifiedCount})
          </button>

          <button
            onClick={() => setFilterResult('CONFLICTING')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filterResult === 'CONFLICTING'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            ⚠ Conflicting ({conflictCount})
          </button>

          <button
            onClick={() => setFilterResult('EXPIRED')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filterResult === 'EXPIRED'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            ✕ Expired on Bid Date ({expiredCount})
          </button>

          <button
            onClick={() => setFilterResult('PENDING')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filterResult === 'PENDING'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            ⌛ Verification Pending ({warningCount})
          </button>
        </div>
      </div>

      {/* ── FEATURE 2: Explainability Drawer / Card Modal if Row Clicked ── */}
      {activeExplainRow && (
        <FindingExplanationCard
          findingTitle={activeExplainRow.requirement}
          ruleId={activeExplainRow.id === 'CM-01' ? 'PET-FIN-001' : activeExplainRow.id === 'CM-03' ? 'PET-CERT-003' : 'PET-RULE-002'}
          ruleVersion="v1.3"
          requirement={activeExplainRow.requirement}
          claim={activeExplainRow.bidderEvidence}
          evidence={activeExplainRow.bidderEvidence}
          verifiedSource={activeExplainRow.verifiedSource}
          verifiedValue={activeExplainRow.verifiedSource}
          difference={activeExplainRow.id === 'CM-01' ? '-₹3.30 Cr (-27.5% Deficit)' : activeExplainRow.id === 'CM-03' ? '-5 Calendar Days before bid cutoff' : undefined}
          whyItMatters={
            activeExplainRow.id === 'CM-01'
              ? 'Tender Clause 4.2 mandates ₹10.0 Cr average revenue under General Financial Rules (GFR). Verified statutory revenue of ₹8.70 Cr does not meet mandatory threshold.'
              : activeExplainRow.id === 'CM-03'
              ? 'Statutory Petroleum Safety Certificate (PESO / ATEX Zone-1) expired 5 days prior to the 10 August 2026 cutoff date. Expired credentials cannot be accepted.'
              : 'Parameter requires reconciliation with certified government reference repositories.'
          }
          recommendedAction={activeExplainRow.officerAction}
          confidence={activeExplainRow.confidence}
          onClose={() => setActiveExplainRow(null)}
        />
      )}

      {/* ── 8-Column Compliance Matrix Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
            <TableProperties className="w-4 h-4 text-blue-700" />
            <span>Requirements Compliance Matrix (Showing {filteredRows.length} of {totalReqs})</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click any row to inspect "Why am I seeing this?"</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Requirement</th>
                <th className="p-3.5">Mandatory</th>
                <th className="p-3.5">Bidder Evidence</th>
                <th className="p-3.5">Verified Source</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Risk</th>
                <th className="p-3.5">Officer Action</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredRows.map((row) => {
                const isConflict = row.result === 'CONFLICT' || row.result === 'FAIL';
                const isWarning = row.result === 'WARNING';

                return (
                  <tr 
                    key={row.id} 
                    onClick={() => setActiveExplainRow(row)}
                    className={`hover:bg-blue-50/50 transition cursor-pointer ${
                      isConflict ? 'bg-red-50/20' : isWarning ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Requirement */}
                    <td className="p-3.5 font-bold text-[#0F2942] max-w-[200px]">
                      {row.requirement}
                    </td>

                    {/* Mandatory */}
                    <td className="p-3.5">
                      {row.mandatory ? (
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-200">
                          YES
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-600">
                          NO
                        </span>
                      )}
                    </td>

                    {/* Bidder Evidence */}
                    <td className="p-3.5 text-slate-800 max-w-[160px]">
                      {row.bidderEvidence}
                    </td>

                    {/* Verified Source */}
                    <td className="p-3.5 text-slate-700 font-medium max-w-[180px]">
                      {row.verifiedSource}
                    </td>

                    {/* Result */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getResultBadge(row.result)}
                    </td>

                    {/* Confidence */}
                    <td className="p-3.5 font-bold text-slate-700 font-mono">
                      {row.confidence}%
                    </td>

                    {/* Risk */}
                    <td className="p-3.5 whitespace-nowrap">
                      {getRiskBadge(row.risk)}
                    </td>

                    {/* Officer Action */}
                    <td className="p-3.5 font-semibold text-blue-900 max-w-[160px]">
                      {row.officerAction}
                    </td>

                    {/* Inspect CTA */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveExplainRow(row);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#0F2942] hover:text-white text-slate-700 font-bold text-xs rounded transition border border-slate-300 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-blue-700" />
                        <span>Why?</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Primary Action Buttons ── */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setActiveView('truth-graph')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Truth Graph
        </button>

        <button
          onClick={() => setActiveView('risk-intelligence')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Risk Intelligence Radar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
