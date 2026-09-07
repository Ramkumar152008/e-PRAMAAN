import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  ExternalLink, 
  ArrowRight, 
  Database, 
  Building2,
  Lock,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationField, VerificationStatus } from '../../types';
import { EvidenceDetailModal } from '../modals/EvidenceDetailModal';

export const CrossVerificationView: React.FC = () => {
  const { selectedBidder, setActiveView } = useApp();
  const [selectedFieldForModal, setSelectedFieldForModal] = useState<VerificationField | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredFields = selectedBidder.crossVerifications.filter(f => {
    if (statusFilter === 'ALL') return true;
    return f.status === statusFilter;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 font-bold text-[11px]">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> FAIL
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> CONFLICT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /> WARNING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Cross-Source Registry Verification Centre</h1>
          <p className="text-xs text-gem-textMuted mt-0.5">
            Cross-Checking Bidder Claims Against Simulated Government Registries (GSTN, MCA21, Udyam, OEM Gateway, CPPP)
          </p>
        </div>

        <button
          onClick={() => setActiveView('truth-graph')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition self-start sm:self-auto"
        >
          <span>View Interactive Truth Graph</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Simulated Integration Notice */}
      <div className="p-3 bg-amber-500/10 border border-amber-300/80 rounded-lg flex items-center justify-between text-xs text-amber-900 font-medium">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Simulated Government Connectors:</strong> Real-time automated cross-verification active for GSTN, MCA21, Ministry of MSME Udyam, Income Tax PAN, and Central Debarment Portal.
          </span>
        </div>
        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
          DEMO SIMULATION
        </span>
      </div>

      {/* Summary Score Bar */}
      <div className="bg-white p-4 rounded-lg border border-gem-border shadow-gov flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Evaluated Entity</p>
          <p className="text-sm font-bold text-gem-navy">{selectedBidder.name} ({selectedBidder.pan})</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-500 block">Total Checks</span>
            <span className="font-bold text-sm text-slate-800">{selectedBidder.crossVerifications.length} Fields</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-700 block">Passed</span>
            <span className="font-bold text-sm text-emerald-700">
              {selectedBidder.crossVerifications.filter(c => c.status === 'PASS').length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-amber-700 block">Conflicts</span>
            <span className="font-bold text-sm text-amber-700">
              {selectedBidder.crossVerifications.filter(c => c.status === 'CONFLICT').length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-red-700 block">Failures</span>
            <span className="font-bold text-sm text-red-700">
              {selectedBidder.crossVerifications.filter(c => c.status === 'FAIL').length}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-gem-border bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-gem-navy">Filter by Verification Result:</span>
            <div className="flex items-center gap-1">
              {['ALL', 'PASS', 'CONFLICT', 'FAIL', 'WARNING'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    statusFilter === status
                      ? 'bg-gem-navy text-white font-bold'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-gem-textMuted">
            Click any row or badge to open <strong>Forensic Evidence Inspector</strong>
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-gem-textSubtle font-semibold border-b border-gem-border">
                <th className="p-3">Evaluated Field</th>
                <th className="p-3">Bidder Claimed Value</th>
                <th className="p-3">Verified Registry Source</th>
                <th className="p-3">Source Registry</th>
                <th className="p-3">Result</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 text-right">Evidence Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gem-border">
              {filteredFields.map((field) => (
                <tr
                  key={field.id}
                  onClick={() => setSelectedFieldForModal(field)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-bold text-gem-navy">{field.field}</td>
                  <td className="p-3 text-slate-800 max-w-[200px] truncate" title={field.bidderClaim}>
                    {field.bidderClaim}
                  </td>
                  <td className="p-3 font-semibold text-gem-blue max-w-[220px] truncate" title={field.verifiedSource}>
                    {field.verifiedSource}
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono text-[10px] text-slate-700">
                      {field.sourceRegistry}
                    </span>
                  </td>
                  <td className="p-3">{getStatusBadge(field.status)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-bold text-gem-navy">
                      <span>{field.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFieldForModal(field);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-[11px] border border-slate-300 transition"
                    >
                      Inspect Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Inspector */}
      {selectedFieldForModal && (
        <EvidenceDetailModal
          field={selectedFieldForModal}
          onClose={() => setSelectedFieldForModal(null)}
        />
      )}

    </div>
  );
};
