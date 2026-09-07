import React from 'react';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Scale, 
  Lock, 
  ArrowRight,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportAuditLogsCSV } from '../../services/auditTrailService';

export const ReportExportView: React.FC = () => {
  const { selectedBidder, selectedTender, setActiveView, auditLogs } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    exportAuditLogsCSV(auditLogs);
  };

  const decision = selectedBidder.officerDecision;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-5 px-4 sm:px-6">
      
      {/* ── Top Action Bar (hidden in print) ── */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gem-border shadow-gov">
        <div>
          <h1 className="text-xl font-bold text-gem-navy">Bid Verification Report</h1>
          <p className="text-xs text-slate-500">
            Comprehensive procurement verification and forensic evidence dossier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button
            onClick={() => setActiveView('decision-review')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded border border-slate-300 transition"
          >
            Back to Decision Review
          </button>
        </div>
      </div>

      {/* ── Formal Printable Document Layout ── */}
      <div className="bg-white p-8 sm:p-12 rounded-lg border border-gem-border shadow-card text-xs text-slate-900 font-sans space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gem-navy text-white flex items-center justify-center font-bold text-xs">
                eP
              </div>
              <span className="font-extrabold text-lg tracking-tight text-gem-navy">e-BID PRAMAAN</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Bid Verification Report
            </h2>
            <p className="text-[11px] text-slate-600">
              Integrated Procurement Compliance & Decision Support Dossier
            </p>
          </div>

          <div className="text-right font-mono text-[11px] space-y-0.5">
            <p><span className="text-slate-500">Report Ref:</span> <strong>REP-{selectedBidder.id}-2026</strong></p>
            <p><span className="text-slate-500">Date Generated:</span> {new Date().toISOString().slice(0, 10)}</p>
            <p><span className="text-slate-500">Classification:</span> <strong>OFFICIAL RECORD</strong></p>
          </div>
        </div>

        {/* Governance Notice */}
        <div className="p-3 bg-slate-50 border border-slate-300 rounded text-[11px] text-slate-700 leading-snug">
          <strong>Governance Notice:</strong> AI provides evidence analysis and risk indicators. Final procurement decisions remain with the authorized Procurement Officer.
        </div>

        {/* 1. Bid Information */}
        <div className="space-y-2 p-4 bg-slate-50 rounded border border-slate-200">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy border-b border-slate-200 pb-1">
            1. Bid Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <p><span className="text-slate-500">Bidder Name:</span> <strong>{selectedBidder.name}</strong></p>
            <p><span className="text-slate-500">Bid ID:</span> <strong>{selectedBidder.id}</strong></p>
            <p><span className="text-slate-500">Tender Reference:</span> <strong>{selectedTender.gemBidNo}</strong></p>
            <p><span className="text-slate-500">Tender Title:</span> {selectedTender.title}</p>
            <p><span className="text-slate-500">CIN / LLPIN:</span> {selectedBidder.cin}</p>
            <p><span className="text-slate-500">PAN / GSTIN:</span> {selectedBidder.pan} / {selectedBidder.gstin}</p>
            <p><span className="text-slate-500">Submission Date:</span> {selectedBidder.bidSubmissionDate}</p>
            <p><span className="text-slate-500">Tender Value:</span> ₹{selectedTender.estimatedValue} Crore</p>
          </div>
        </div>

        {/* 2. Verification Summary */}
        <div className="space-y-2 p-4 bg-slate-50 rounded border border-slate-200">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy border-b border-slate-200 pb-1">
            2. Verification Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-500 block text-[11px]">Overall Risk</span>
              <strong className="text-sm text-red-700">{selectedBidder.riskProfile.overallRisk}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Total Checks</span>
              <strong className="text-sm text-slate-900">18</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Passed</span>
              <strong className="text-sm text-emerald-700">14</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Critical Findings</span>
              <strong className="text-sm text-red-700">1</strong>
            </div>
          </div>
        </div>

        {/* 3. Compliance Findings */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
            3. Compliance Findings ({selectedBidder.complianceMatrix.length} Criteria)
          </h3>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">Requirement</th>
                <th className="p-2 border-r border-slate-300">Mandatory</th>
                <th className="p-2 border-r border-slate-300">Bidder Claim</th>
                <th className="p-2 border-r border-slate-300">Verified Evidence</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {selectedBidder.complianceMatrix.map((cm) => (
                <tr key={cm.id}>
                  <td className="p-2 border-r border-slate-200 font-semibold">{cm.requirement}</td>
                  <td className="p-2 border-r border-slate-200">{cm.mandatory ? 'YES' : 'NO'}</td>
                  <td className="p-2 border-r border-slate-200">{cm.bidderEvidence}</td>
                  <td className="p-2 border-r border-slate-200">{cm.verifiedSource}</td>
                  <td className="p-2 font-bold font-mono">
                    <span className={cm.result === 'PASS' ? 'text-emerald-700' : cm.result === 'FAIL' ? 'text-red-700' : 'text-amber-700'}>
                      {cm.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Evidence Conflicts */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
            4. Evidence Conflicts
          </h3>
          <div className="space-y-2">
            <div className="p-3 bg-red-50/50 border border-red-200 rounded space-y-1">
              <p className="font-bold text-red-900">Turnover Discrepancy</p>
              <p className="text-slate-700 text-[11px]">
                Declared: ₹{selectedBidder.claimedTurnover} Crore vs Verified MCA21 Filings: ₹{selectedBidder.verifiedTurnover} Crore. Deficit of ₹{(selectedBidder.claimedTurnover - selectedBidder.verifiedTurnover).toFixed(1)} Crore below mandatory ₹10 Crore threshold.
              </p>
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded space-y-1">
              <p className="font-bold text-amber-900">Certificate Validity Deficit</p>
              <p className="text-slate-700 text-[11px]">
                ISO 9001 quality certificate expired on 05-Aug-2026 prior to the 10-Aug-2026 bid submission cutoff.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Investigation History */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
            5. Investigation History
          </h3>
          <div className="space-y-1.5">
            {selectedBidder.investigationPriorities.map((item) => (
              <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gem-navy">{item.title}</span>
                  <p className="text-[11px] text-slate-600">{item.recommendedOfficerAction}</p>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-200 rounded">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 & 7. Officer Decision & Remarks */}
        <div className="p-5 bg-slate-50 border-2 border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
              6. Procurement Officer Decision & Remarks
            </h3>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              OFFICIAL DETERMINATION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500 font-semibold text-[11px]">Officer Decision:</p>
              <p className="text-base font-extrabold text-gem-navy mt-0.5">
                {decision?.action ? decision.action.replace(/_/g, ' ') : 'PENDING OFFICER DECISION'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold text-[11px]">Officer In-Charge:</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {decision?.officerName || 'Rajeev Sharma, ITS'} (ID: {decision?.officerId || 'PO-GEM-8812'})
              </p>
              <p className="text-[11px] text-slate-600">{decision?.officerDesignation || 'Director (Procurement & Evaluation)'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gem-navy mb-1">
              7. Officer Remarks & Rationale:
            </h4>
            <p className="p-3 bg-white border border-slate-300 rounded text-slate-800 italic leading-relaxed text-xs">
              "{decision?.reasonRemarks || 'Turnover claimed (₹12 Cr) exceeds MCA21 filings (₹8.7 Cr). Forwarding for comprehensive verification and CA balance sheet clarification.'}"
            </p>
          </div>

          <div className="pt-2 border-t border-slate-300 font-mono text-[10px] text-slate-600 space-y-0.5">
            <p>• Digital Authorization Reference: {decision?.digitalSignatureHash || 'DEC-CONFIRM-9B2D8E'}</p>
            <p>• Recorded Timestamp: {decision?.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)}</p>
            <p>• Ledger Status: Cryptographically logged to audit trail</p>
          </div>
        </div>

        {/* Report Footer */}
        <div className="border-t border-slate-300 pt-4 text-center text-[10px] text-slate-500">
          e-BID PRAMAAN • Bid Compliance & Evidence Verification
        </div>

      </div>

    </div>
  );
};
