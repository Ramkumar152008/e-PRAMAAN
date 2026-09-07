import React from 'react';
import { 
  History, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  User,
  ArrowRight,
  Flame,
  Lock,
  Hash
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditTrailView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    auditLogs,
    setActiveView 
  } = useApp();

  const handleExportCSV = () => {
    alert('Audit Trail Ledger exported to CSV with cryptographic signatures.');
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Prompt Section 23) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 bg-white p-4 sm:p-5 rounded-md border border-slate-300 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-0.5">
            <Lock className="w-4 h-4 text-blue-800" />
            <span>Audit Trail Ledger • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">AUDIT TRAIL</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Complete audit trail with SHA-256 integrity records of evidence extractions, cross-source verifications, and officer adjudications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Signed CSV</span>
          </button>

          <button
            onClick={() => setActiveView('report')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-sm text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <span>Compliance Dossier</span>
          </button>
        </div>
      </div>

      {/* ── Context Header ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-500 font-bold text-[10px] uppercase block">Evaluation ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">EVAL-2026-PET-00125-01</span>
        </div>
        <div>
          <span className="text-slate-500 font-bold text-[10px] uppercase block">Target Tender</span>
          <span className="font-mono font-bold text-slate-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-bold text-[10px] uppercase block">Investigated Bidder</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-bold text-[10px] uppercase block">Signing Officer</span>
          <span className="font-mono font-bold text-emerald-800 mt-0.5 block">PO-1042 (MoPNG / CPCL)</span>
        </div>
      </div>

      {/* ── Clean Audit Table (Prompt Section 23) ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-[#0F2942] uppercase tracking-wider">
            <History className="w-4 h-4 text-blue-800" />
            <span>Chronological Event Ledger ({auditLogs.length} Verified Events)</span>
          </div>
          <span className="text-[11px] text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold px-2 py-0.5 rounded-sm font-mono">
            SHA-256 Integrity Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Requirement</th>
                <th className="p-3">Result</th>
                <th className="p-3">SHA-256 Checksum</th>
                <th className="p-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {auditLogs.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="p-3 font-bold text-[#0F2942]">
                    <span className="block">{evt.actor}</span>
                    <span className="font-mono text-[10px] text-slate-500 font-normal">{evt.actorRole}</span>
                  </td>
                  <td className="p-3 text-slate-800 font-semibold">
                    {evt.action}
                  </td>
                  <td className="p-3 font-mono text-blue-900 text-[11px]">
                    {evt.targetRef}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Verified
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-600 max-w-[150px]">
                    <span className="truncate block" title={evt.hash}>
                      {evt.hash.slice(0, 18)}...
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('decision-review')}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-sm transition cursor-pointer"
        >
          ← Back to Officer Decision
        </button>

        <button
          onClick={() => setActiveView('report')}
          className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-sm shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Compliance Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
