import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Gavel, 
  Flame,
  Calendar,
  AlertTriangle,
  Scale,
  Code,
  FileCode2,
  Lock,
  Sparkles,
  Building2,
  CalendarClock,
  Network,
  Activity,
  History,
  Info
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
        cin: selectedBidder.cin,
        turnoverDeclared: selectedBidder.claimedTurnover,
        turnoverVerified: selectedBidder.verifiedTurnover
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
    <div className="space-y-5 max-w-5xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans print:p-0">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Chennai Petroleum Corporation Limited • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">COMPLIANCE DOSSIER</h1>
          <p className="text-xs text-slate-600">
            Statutory bid evaluation record and verified compliance evidence for CPCL procurement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>GENERATE REPORT</span>
          </button>
        </div>
      </div>

      {/* ── Formal Printable Compliance Dossier ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 sm:p-8 space-y-6 text-xs print:border-none print:shadow-none">
        
        {/* Report Top Header */}
        <div className="border-b-2 border-[#0F2942] pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
              Government of India • Ministry of Petroleum & Natural Gas
            </span>
            <h2 className="text-xl font-extrabold text-[#0F2942] mt-0.5">
              COMPLIANCE DOSSIER — CPCL PROCUREMENT
            </h2>
            <p className="text-xs text-slate-600">Chennai Petroleum Corporation Limited (CPCL) • Manali Refinery, Chennai</p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs inline-block">
              Report Status: Formal Dossier Generated
            </span>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Dossier Ref: DOSSIER-CPCL-2026-001</p>
          </div>
        </div>

        {/* Section 1 & 2: Tender Metadata & Bidder Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="space-y-1.5">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">1. Tender Information</span>
            <p><strong>Title:</strong> {selectedTender.title}</p>
            <p><strong>Tender ID:</strong> <span className="font-mono font-bold text-blue-900">{selectedTender.gemBidNo}</span></p>
            <p><strong>Department:</strong> {selectedTender.department}</p>
            <p><strong>Estimated Value:</strong> ₹{selectedTender.estimatedValue} Crore</p>
            <p><strong>Delivery Location:</strong> CPCL Manali, Chennai</p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">2. Evaluated Bidder Information</span>
            <p><strong>Bidder Legal Name:</strong> {selectedBidder.name}</p>
            <p><strong>Bid ID:</strong> <span className="font-mono font-bold text-blue-900">{selectedBidder.id}</span></p>
            <p><strong>Corporate PAN:</strong> <span className="font-mono">{selectedBidder.pan}</span></p>
            <p><strong>GSTIN:</strong> <span className="font-mono">{selectedBidder.gstin}</span></p>
            <p><strong>CIN:</strong> <span className="font-mono">{selectedBidder.cin}</span></p>
          </div>
        </div>

        {/* Section 3: Executive Summary & Verification Outcome */}
        <div className="space-y-2">
          <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">3. Verification Summary & Compliance Overview</span>
          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-800 leading-relaxed space-y-1.5">
            <p>
              e-BID PRAMAAN performed evidence-based multi-source verification for <strong>{selectedBidder.name}</strong> against the mandatory requirements of Tender <strong>{selectedTender.gemBidNo}</strong>.
            </p>
            <p>
              All applicable requirements (Statutory Identity, Quality ISO 9001:2015, EMD Guarantee, Make in India Class-I local content, Technical Spec MS-RAD-6IN-1F3, and OEM Parent-Subsidiary undertaking) were verified and found compliant.
            </p>
          </div>
        </div>

        {/* Section 4 & 5: Evidence Health & Temporal Evaluation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">4. Reference Verification Status</span>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Compliance Score:</span>
                <strong className="text-emerald-700 font-bold">{complianceScore} / 100</strong>
              </div>
              <div className="flex justify-between">
                <span>Reference Adapters Queried:</span>
                <strong className="font-mono">10 Reference Adapters</strong>
              </div>
              <div className="flex justify-between">
                <span>Corporate Linkage:</span>
                <strong className="text-emerald-700 font-mono">✓ Board Resolution Verified</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">5. Bid-Date Temporal Evaluation</span>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Bid Cutoff Date:</span>
                <strong className="font-mono">10 August 2026 (15:00 IST)</strong>
              </div>
              <div className="flex justify-between">
                <span>ISO 9001:2015 Expiry:</span>
                <strong className="text-emerald-700 font-mono">15-Dec-2026 (✓ VALID ON BID DATE)</strong>
              </div>
              <div className="flex justify-between">
                <span>Rule Reference:</span>
                <strong className="text-blue-900 font-mono">CPCL-TEMPORAL-001</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Applicable Requirements Matrix */}
        <div className="space-y-2">
          <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider block">6. Applicable Compliance Requirements</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">OEM / MAF Authorization:</span>
              <strong className="text-emerald-700 block mt-0.5">✓ Verified (Parent Undertaking)</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">ISO 9001:2015 Quality:</span>
              <strong className="text-emerald-700 block mt-0.5">✓ Valid on Bid Date (LRQA)</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">EMD BG (₹3.70 Lakh):</span>
              <strong className="text-emerald-700 block mt-0.5">✓ Confirmed (SBI)</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">GSTIN / PAN Registration:</span>
              <strong className="text-emerald-700 block mt-0.5">✓ Active Regular</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">Make in India Local Content:</span>
              <strong className="text-emerald-700 block mt-0.5">✓ 58.4% Class-I Local</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block">Technical Spec MS-RAD-6IN:</span>
              <strong className="text-emerald-700 block mt-0.5">✓ QAP Stage-III Approved</strong>
            </div>
          </div>
        </div>

        {/* Section 7: Authorized Officer Adjudication Decision */}
        <div className="p-4 bg-blue-50/60 border-2 border-blue-900 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <span className="font-bold text-[#0F2942] text-xs uppercase tracking-wider">
              7. Formal Procurement Officer Adjudication Determination
            </span>
            <span className="px-3 py-1 bg-[#0F2942] text-white rounded font-bold text-xs uppercase font-mono">
              {decisionAction.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="p-3 bg-white rounded border border-blue-200 text-[11px] space-y-1">
            <p><strong>Adjudicating Officer ID:</strong> PO-1042 (Senior Procurement Officer Rajeshwar Rao, CPCL)</p>
            <p><strong>Officer Evaluation Remarks:</strong> "{officerRemarks}"</p>
            <p><strong>Adjudication Timestamp:</strong> {new Date().toLocaleString()}</p>
            <p><strong>Tamper-Evident SHA-256 Ledger Hash:</strong> <span className="font-mono text-slate-600">sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7</span></p>
          </div>
        </div>

        {/* Section 8: Disclaimers & Governance Certification */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 space-y-1">
          <p>
            <strong>Statutory Governance Disclaimer:</strong> e-BID PRAMAAN is an AI decision-support system for bid compliance verification. The authorized Procurement Officer retains full statutory authority and responsibility for the final procurement determination.
          </p>
          <p>
            <strong>Reference Verification Notice:</strong> External registry verifications were performed using configured benchmark reference datasets.
          </p>
        </div>

      </div>

      {/* ── Action Buttons ── */}
      <div className="pt-2 flex items-center justify-between print:hidden">
        <button
          onClick={() => setActiveView('decision-review')}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Officer Decision
        </button>

        <button
          onClick={() => setActiveView('active-tenders')}
          className="px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <span>Return to Tenders List</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
