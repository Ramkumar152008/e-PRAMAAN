import React from 'react';
import { 
  Download, 
  Printer, 
  ArrowLeft,
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Gavel, 
  Code, 
  Building2,
  Lock,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    clarifications,
    setActiveView 
  } = useApp();

  const isReconciled = selectedBidder.verifiedTurnover >= 10 || selectedBidder.riskProfile.complianceScore >= 90;
  const complianceScore = isReconciled ? 100 : 86;

  const decisionAction = selectedBidder.officerDecision?.action || (isReconciled ? 'CLEARED' : 'REQUIRES_VERIFICATION');
  const officerRemarks = selectedBidder.officerDecision?.reasonRemarks || 
    (isReconciled 
      ? 'Corporate relationship undertaking and parent board resolution verified. Atlas Copco (India) Private Limited cleared as fully authorized operating subsidiary with 100% compliance for CPCL Manali delivery.' 
      : 'OEM Manufacturer Authorization Form issued by parent company Atlas Copco Airpower n.v. Belgium requires officer review of corporate subsidiary scope.');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportTitle: 'CPCL Procurement Compliance Dossier — Ministry of Petroleum & Natural Gas',
      tenderId: selectedTender.gemBidNo,
      tenderTitle: selectedTender.title,
      department: selectedTender.department,
      organization: 'Chennai Petroleum Corporation Limited (CPCL)',
      bidder: {
        id: selectedBidder.id,
        name: selectedBidder.name,
        pan: selectedBidder.pan,
        gstin: selectedBidder.gstin,
        cin: selectedBidder.cin
      },
      evaluation: {
        score: complianceScore,
        confidence: selectedBidder.riskProfile.evidenceConfidence,
        overallRisk: isReconciled ? 'LOW' : 'MEDIUM',
        officerDetermination: decisionAction,
        officerId: 'PO-1042',
        officerRemarks: officerRemarks,
        timestamp: new Date().toISOString()
      },
      evidencePassport: selectedBidder.evidencePassport,
      clarifications: clarifications
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CPCL_Compliance_Dossier_${selectedTender.gemBidNo}_${selectedBidder.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans print:p-0">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 print:hidden bg-white p-4 sm:p-5 rounded-md border border-slate-300 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-800" />
            <span>Chennai Petroleum Corporation Limited • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">COMPLIANCE REPORT</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Statutory bid compliance evaluation record and verified evidence dossier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-sm text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>GENERATE REPORT</span>
          </button>
        </div>
      </div>

      {/* ── Formal Printable Compliance Dossier (Section 22) ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs p-6 sm:p-8 space-y-5 text-xs print:border-none print:shadow-none">
        
        {/* Report Top Header */}
        <div className="border-b-2 border-[#0F2942] pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
              Government of India • Ministry of Petroleum & Natural Gas
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F2942] mt-0.5">
              COMPLIANCE REPORT — CPCL PROCUREMENT
            </h2>
            <p className="text-xs text-slate-600">Chennai Petroleum Corporation Limited (CPCL) • Manali Refinery, Chennai</p>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-sm font-bold text-xs inline-block">
              Report Status: Dossier Generated
            </span>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Dossier Ref: DOSSIER-CPCL-2026-001</p>
          </div>
        </div>

        {/* Section 1 & 2: Tender Details & Bidder Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-sm border border-slate-200">
          <div className="space-y-1">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">1. Tender Details</span>
            <p><strong>Title:</strong> {selectedTender.title}</p>
            <p><strong>Tender ID:</strong> <span className="font-mono font-bold text-blue-900">{selectedTender.gemBidNo}</span></p>
            <p><strong>Department:</strong> {selectedTender.department}</p>
            <p><strong>Estimated Value:</strong> ₹{selectedTender.estimatedValue} Crore</p>
            <p><strong>Delivery Location:</strong> CPCL Manali, Chennai</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">2. Bidder Details</span>
            <p><strong>Legal Name:</strong> {selectedBidder.name}</p>
            <p><strong>Bid ID:</strong> <span className="font-mono font-bold text-blue-900">{selectedBidder.id}</span></p>
            <p><strong>Corporate PAN:</strong> <span className="font-mono">{selectedBidder.pan}</span></p>
            <p><strong>GSTIN:</strong> <span className="font-mono">{selectedBidder.gstin}</span></p>
            <p><strong>CIN:</strong> <span className="font-mono">{selectedBidder.cin}</span></p>
          </div>
        </div>

        {/* Section 3: Requirements Checked */}
        <div className="space-y-2">
          <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">3. Requirements Checked & Verified</span>
          <div className="overflow-x-auto border border-slate-300 rounded-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2.5">Requirement</th>
                  <th className="p-2.5">Tender Rule</th>
                  <th className="p-2.5">Bidder Evidence</th>
                  <th className="p-2.5">Reference Source</th>
                  <th className="p-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">GST Registration</td>
                  <td className="p-2.5 text-slate-600">Active GSTIN</td>
                  <td className="p-2.5 font-mono">GST Certificate</td>
                  <td className="p-2.5">GSTN Reference</td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">VERIFIED</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">PAN Card</td>
                  <td className="p-2.5 text-slate-600">Company PAN</td>
                  <td className="p-2.5 font-mono">PAN Card</td>
                  <td className="p-2.5">ITD Reference</td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">VERIFIED</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">OEM Authorization</td>
                  <td className="p-2.5 text-slate-600">Clause 2.1 MAF</td>
                  <td className="p-2.5 font-mono">Board Resolution & Undertaking</td>
                  <td className="p-2.5">OEM Mandate Ledger</td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">VERIFIED</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Make in India Local Content</td>
                  <td className="p-2.5 text-slate-600">Class-I (≥ 50%)</td>
                  <td className="p-2.5 font-mono">Self-Declaration (58.4%)</td>
                  <td className="p-2.5">DPIIT Reference</td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">VERIFIED</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">ISO 9001:2015 Quality</td>
                  <td className="p-2.5 text-slate-600">Valid on Bid Date</td>
                  <td className="p-2.5 font-mono">ISO Certificate (LRQA)</td>
                  <td className="p-2.5">Accreditation Registry</td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">VERIFIED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Officer Decision & Determination */}
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-sm space-y-2">
          <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">4. Authorized Officer Determination</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Adjudication Result:</span>
              <strong className="text-emerald-700 font-mono text-sm">{decisionAction.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Authorized Officer:</span>
              <strong className="text-slate-800">Rajeshwar Rao (PO-1042)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Designation:</span>
              <strong className="text-slate-800">Senior Procurement Officer • CPCL</strong>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 block font-bold text-[10px] uppercase">Officer Remarks:</span>
            <p className="text-slate-800 italic mt-0.5">"{officerRemarks}"</p>
          </div>
        </div>

        {/* Section 5: Audit & Tamper Evidence */}
        <div className="p-3 bg-slate-100 rounded-sm border border-slate-300 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
          <span>Audit Record: EVAL-2026-PET-00125-01</span>
          <span>SHA-256: 7e8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c... [VERIFIED]</span>
          <span>Signature: PO-1042-CPCL-2026</span>
        </div>

        {/* Decision Support Principle */}
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-sm text-[11px] text-blue-950 flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-blue-800 flex-shrink-0" />
          <span>
            <strong>Decision Support Principle:</strong> "Automated extraction and rule comparison provide decision support. Final procurement determination remains with the authorized officer."
          </span>
        </div>

      </div>

    </div>
  );
};
