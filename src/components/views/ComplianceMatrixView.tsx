import React, { useState } from 'react';
import { 
  TableProperties, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Search, 
  Filter, 
  ShieldAlert, 
  FileCheck2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationStatus, RiskLevel } from '../../types';
import { EvidenceDetailModal } from '../modals/EvidenceDetailModal';

export const ComplianceMatrixView: React.FC = () => {
  const { selectedBidder, setActiveView } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'MANDATORY_ONLY' | 'FAILURES_ONLY'>('ALL');
  const [search, setSearch] = useState('');

  const rows = selectedBidder.complianceMatrix.filter(row => {
    if (filterType === 'MANDATORY_ONLY' && !row.mandatory) return false;
    if (filterType === 'FAILURES_ONLY' && row.result === 'PASS') return false;
    if (search && !row.requirement.toLowerCase().includes(search.toLowerCase()) && !row.bidderEvidence.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getResultBadge = (res: VerificationStatus) => {
    switch (res) {
      case 'PASS':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PASS</span>;
      case 'FAIL':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 font-bold text-[11px]"><XCircle className="w-3.5 h-3.5 text-red-600" /> FAIL</span>;
      case 'CONFLICT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> CONFLICT</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold text-[11px]"><AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /> WARNING</span>;
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'LOW':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LOW</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">MEDIUM</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">HIGH</span>;
      case 'CRITICAL':
        return <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">CRITICAL</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Comprehensive Compliance Matrix</h1>
          <p className="text-xs text-gem-textMuted mt-0.5">
            Cross-Document Clause Reconciler for <strong className="text-gem-navy">{selectedBidder.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setActiveView('risk-intelligence')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition self-start sm:self-auto"
        >
          <span>View Risk Radar Fingerprint</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Compliance Matrix Table Container */}
      <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gem-border bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-gem-navy">View:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  filterType === 'ALL' ? 'bg-gem-navy text-white font-bold' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                All Requirements ({selectedBidder.complianceMatrix.length})
              </button>
              <button
                onClick={() => setFilterType('MANDATORY_ONLY')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  filterType === 'MANDATORY_ONLY' ? 'bg-gem-navy text-white font-bold' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Mandatory Only
              </button>
              <button
                onClick={() => setFilterType('FAILURES_ONLY')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  filterType === 'FAILURES_ONLY' ? 'bg-red-700 text-white font-bold' : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                }`}
              >
                Conflicts & Fails Only
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search matrix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gem-blue"
            />
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gem-textSubtle font-semibold border-b border-gem-border">
                <th className="p-3">Requirement & Clause</th>
                <th className="p-3">Mandatory</th>
                <th className="p-3">Bidder Submitted Evidence</th>
                <th className="p-3">Verified External Source</th>
                <th className="p-3">Result</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Risk</th>
                <th className="p-3 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gem-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-gem-navy max-w-[220px]">
                    {row.requirement}
                  </td>
                  <td className="p-3">
                    {row.mandatory ? (
                      <span className="bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        YES
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                        NO
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-800 max-w-[200px] truncate" title={row.bidderEvidence}>
                    {row.bidderEvidence}
                  </td>
                  <td className="p-3 font-medium text-gem-blue max-w-[200px] truncate" title={row.verifiedSource}>
                    {row.verifiedSource}
                  </td>
                  <td className="p-3">{getResultBadge(row.result)}</td>
                  <td className="p-3 font-bold text-gem-navy">{row.confidence}%</td>
                  <td className="p-3">{getRiskBadge(row.risk)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveView('evidence-explorer')}
                      className="px-2.5 py-1 bg-gem-navy hover:bg-gem-navyLight text-white rounded font-medium text-[11px] transition"
                    >
                      Explain XAI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
