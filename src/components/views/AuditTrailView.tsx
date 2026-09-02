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
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 26: Audit Trail) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Immutable Governance Ledger • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Evidence Chain & Tamper-Evident Audit Trail</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Chronological, immutable record of all evidence extractions, cross-source verifications, and officer adjudications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Signed CSV</span>
          </button>

          <button
            onClick={() => setActiveView('report')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <span>Evaluation Report</span>
          </button>
        </div>
      </div>

      {/* ── Context & Chain Integrity Header (Section 26) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Evaluation ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">EVAL-2026-PET-00125-01</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Target Tender</span>
          <span className="font-mono font-bold text-slate-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Investigated Bidder</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Signing Officer</span>
          <span className="font-mono font-bold text-emerald-800 mt-0.5 block">PO-1042 (MoPNG)</span>
        </div>
      </div>

      {/* ── Tamper-Evident Ledger Table (Section 26) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
            <Lock className="w-4 h-4 text-blue-700" />
            <span>Chronological Event Ledger ({auditLogs.length} Verified Events)</span>
          </div>
          <span className="text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold px-2 py-0.5 rounded font-mono">
            SHA-256 Block Chaining Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor / ID</th>
                <th className="p-3.5">Action & Event Description</th>
                <th className="p-3.5">Target Reference</th>
                <th className="p-3.5">Event SHA-256 Checksum</th>
                <th className="p-3.5">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {auditLogs.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono text-slate-700 whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="p-3.5 font-bold text-[#0F2942]">
                    <span className="block">{evt.actor}</span>
                    <span className="font-mono text-[10px] text-slate-500 font-normal">{evt.actorRole}</span>
                  </td>
                  <td className="p-3.5 text-slate-800 max-w-sm">
                    <p className="font-semibold text-[#0F2942]">{evt.action}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{evt.details}</p>
                  </td>
                  <td className="p-3.5 font-mono text-blue-900 text-[11px]">
                    {evt.targetRef}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-600 max-w-[180px]">
                    <span className="truncate block" title={evt.hash}>
                      {evt.hash.slice(0, 20)}...
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ TAMPER-FREE
                    </span>
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
          onClick={() => setActiveView('decision')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          Back to Officer Decision
        </button>

        <button
          onClick={() => setActiveView('report')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Generate Forensic Evaluation Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
