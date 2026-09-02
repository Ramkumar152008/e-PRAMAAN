import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  Send, 
  Lock, 
  Sparkles, 
  Layers, 
  History, 
  Scale, 
  Printer, 
  Download, 
  Gavel, 
  RefreshCw, 
  X, 
  ExternalLink, 
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BidderDocument, DecisionAction, SharedEvidenceItem } from '../../types';

export const BidVerificationView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    bidders, 
    selectBidderById, 
    sendClarificationRequest, 
    submitVendorClarificationResponse, 
    reverifyBidderWithClarification, 
    recordDecision, 
    setActiveView 
  } = useApp();

  // 5 Steps: 1 Documents | 2 Compliance | 3 Issues | 4 Clarification | 5 Decision
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Modals & Drawers
  const [viewingDoc, setViewingDoc] = useState<BidderDocument | null>(null);
  const [showSourceDetailsModal, setShowSourceDetailsModal] = useState(false);
  const [showEvidenceChainModal, setShowEvidenceChainModal] = useState(false);
  const [activeChainStep, setActiveChainStep] = useState<number>(1);
  const [showDecisionConfirmModal, setShowDecisionConfirmModal] = useState(false);
  const [decisionRecordedSuccess, setDecisionRecordedSuccess] = useState(false);

  // Clarification Form State
  const [clarificationQuery, setClarificationQuery] = useState(
    'Your submitted Manufacturer Authorization Form (MAF) is issued by Atlas Copco Airpower n.v., Belgium. Please provide documentary confirmation of direct parent-subsidiary corporate linkage and confirmation that back-to-back technical support and warranty cover CPCL Radiant Tube Spec MS-RAD-6IN-1F3.'
  );
  const [shareOemEvidence, setShareOemEvidence] = useState(true);
  const [shareRuleEvidence, setShareRuleEvidence] = useState(true);
  const [clarificationSentNotice, setClarificationSentNotice] = useState(false);

  const isReconciled = selectedBidder.riskProfile.complianceScore >= 95 || selectedBidder.complianceMatrix.every(c => c.result === 'PASS');
  const complianceScore = isReconciled ? 100 : (selectedBidder.riskProfile.complianceScore || 86);
  const overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' = isReconciled ? 'LOW' : (selectedBidder.riskProfile.overallRisk as any || 'MEDIUM');

  // Step 5 Decision Form State
  const [selectedDecisionAction, setSelectedDecisionAction] = useState<DecisionAction>(
    isReconciled ? 'CLEARED' : 'REQUIRES_VERIFICATION'
  );
  const [decisionRemarks, setDecisionRemarks] = useState(
    isReconciled
      ? 'Corporate relationship undertaking and parent board resolution verified. Atlas Copco (India) Private Limited cleared as fully authorized operating subsidiary with 100% compliance for CPCL Manali delivery.'
      : 'OEM Manufacturer Authorization Form issued by parent company Atlas Copco Airpower n.v. Belgium requires officer review of corporate subsidiary scope.'
  );

  // Reference Registries checked (10 reference adapters)
  const govRegistries = [
    { name: 'GSTN Reference', status: 'Verified', date: '02-Sep-2026', ref: selectedBidder.gstin },
    { name: 'Corporate PAN (ITD)', status: 'Verified', date: '02-Sep-2026', ref: selectedBidder.pan },
    { name: 'MCA21 Company Master', status: 'Verified', date: '02-Sep-2026', ref: selectedBidder.cin },
    { name: 'LRQA Quality Registry', status: 'Valid on Bid Date', date: '10-Aug-2026', ref: 'ISO-9001-LRQA-8812' },
    { name: 'OEM Verification Portal', status: isReconciled ? 'Reconciled' : 'Review Required', date: 'Scope Checked', ref: 'CPCL-RAD-ATC-2026-MAF' },
    { name: 'Make in India / DPIIT', status: 'Verified', date: 'Class-I (58.4%)', ref: 'DPIIT-MII-2026' },
    { name: 'CPCL Debarment Registry', status: 'Clear', date: 'No Default', ref: 'CPCL-HOLIDAY-NIL' },
    { name: 'State Bank of India', status: 'Verified', date: 'BG Confirmed', ref: 'SBI-BG-2026-8812' },
    { name: 'Udyam / MSME Portal', status: 'Verified', date: 'Active', ref: selectedBidder.udyamNo || 'UDYAM-MH-26-0012489' },
    { name: 'DigiLocker Verification', status: 'Verified', date: 'SHA-256 Hashed', ref: 'DL-CPCL-8821' }
  ];

  // Document list with status
  const documentItems = [
    { name: 'OEM Authorization Certificate', type: 'OEM_AUTH', status: isReconciled ? 'Verified' : 'Needs Review', file: 'OEM_Authorization_Certificate.pdf', size: '1.4 MB' },
    { name: 'ISO 9001:2015 Quality Certificate (LRQA)', type: 'ISO_CERT', status: 'Verified', file: 'ISO_9001_Certificate_Lloyds.pdf', size: '1.2 MB' },
    { name: 'GST Registration Certificate', type: 'GST_CERT', status: 'Verified', file: 'GST_Registration_Certificate.pdf', size: '890 KB' },
    { name: 'Corporate PAN Card', type: 'PAN_CERT', status: 'Verified', file: 'Corporate_PAN_Card.pdf', size: '480 KB' },
    { name: 'Technical Compliance Sheet (MS-RAD-6IN-1F3)', type: 'TECHNICAL_SPECS', status: 'Verified', file: 'Technical_Compliance_Sheet_MS_RAD_6IN.pdf', size: '2.8 MB' },
    { name: 'QAP (Quality Assurance Plan Stage-III)', type: 'TECHNICAL_SPECS', status: 'Verified', file: 'QAP_Quality_Assurance_Plan.pdf', size: '3.4 MB' },
    { name: 'Make in India Local Content Declaration', type: 'AFFIDAVIT', status: 'Verified', file: 'Make_in_India_Local_Content_Declaration.pdf', size: '650 KB' },
    { name: 'Land Border Declaration Rule 144(xi)', type: 'DEBARMENT_DECLARATION', status: 'Verified', file: 'Land_Border_Declaration_Rule144xi.pdf', size: '510 KB' }
  ];

  // 8-Step Explainable Evidence Chain Nodes
  const evidenceChainSteps = [
    {
      step: 1,
      title: 'Tender Requirement',
      badge: 'Clause 2.1',
      desc: 'Tender Clause 2.1 specifies that the bidder must be an OEM or OEM Authorized Agency for radiant tubes with verifiable authorization token.'
    },
    {
      step: 2,
      title: 'Compliance Rule',
      badge: 'CPCL-PQ-001',
      desc: 'Machine Rule CPCL-PQ-001 enforces OEM verification and direct technical warranty backing for CPCL Manali refinery delivery.'
    },
    {
      step: 3,
      title: 'Bidder Document',
      badge: 'OEM_Authorization_Certificate.pdf',
      desc: 'Bidder submitted 2-page OEM authorization letter issued by Atlas Copco Airpower n.v. Belgium.'
    },
    {
      step: 4,
      title: 'AI Extracted Value',
      badge: 'Grantor: Atlas Copco Airpower n.v.',
      desc: 'AI extracted grantor name: Atlas Copco Airpower n.v. (Belgium) and authorized entity: Atlas Copco (India) Private Limited with 94% confidence.'
    },
    {
      step: 5,
      title: 'Reference Evidence',
      badge: 'Corporate Reference Dataset',
      desc: 'Global corporate reference confirms Atlas Copco Airpower n.v. Belgium is global parent entity and Atlas Copco (India) Pvt Ltd is Indian operating subsidiary.'
    },
    {
      step: 6,
      title: 'Comparison',
      badge: 'Parent-Subsidiary Relationship',
      desc: 'Authorization is issued by parent entity rather than third-party distributor. Scope requires officer confirmation of back-to-back warranty.'
    },
    {
      step: 7,
      title: 'Finding',
      badge: isReconciled ? 'Reconciled & Compliant' : 'Review Required',
      desc: isReconciled 
        ? 'Parent board resolution & corporate undertaking verify 100% Indian operating subsidiary backing with direct OEM warranty.' 
        : 'Parent-to-subsidiary authorization requires confirmation of subsidiary operational mandate for radiant furnace tubes.'
    },
    {
      step: 8,
      title: 'Officer Action',
      badge: 'Decision Support',
      desc: isReconciled 
        ? 'Approve Pre-Qualification under Clause 2.1 and proceed to final commercial evaluation.' 
        : 'Request formal corporate undertaking from bidder confirming direct OEM warranty coverage.'
    }
  ];

  const handleSendClarification = (e: React.FormEvent) => {
    e.preventDefault();
    const shared: SharedEvidenceItem[] = [];
    if (shareOemEvidence) {
      shared.push({
        id: 'SEV-01',
        title: 'OEM Authorization Certificate (Page 2 Excerpt)',
        sourceRegistry: 'Bidder Submission Dossier',
        documentRef: 'OEM_Authorization_Certificate.pdf (Page 2)',
        type: 'EXTRACTED_PAGE',
        date: '09-Aug-2026',
        excerpt: 'Atlas Copco Airpower n.v. authorizes Atlas Copco (India) Private Limited for regional industrial representation.',
        checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
        size: '1.4 MB',
        selected: true
      });
    }
    if (shareRuleEvidence) {
      shared.push({
        id: 'SEV-02',
        title: 'Tender Pre-Qualification Rule CPCL-PQ-001 Excerpt',
        sourceRegistry: 'CPCL Tender Requirement Matrix',
        documentRef: 'Tender Clause 2.1',
        type: 'REGISTRY_RECORD',
        date: '15-Jun-2026',
        excerpt: 'Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with verifiable authorization token.',
        checksum: 'sha256:4a8c91d2e0f872b65103a8904712ec3105ab6719cd288231aa492147810fed01',
        size: '520 KB',
        selected: true
      });
    }

    sendClarificationRequest({
      tenderId: selectedTender.gemBidNo,
      tenderTitle: selectedTender.title,
      bidderId: selectedBidder.id,
      bidderName: selectedBidder.name,
      issueCategory: 'OEM Manufacturer Authorization Scope',
      tenderRequirement: 'Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with valid MAF.',
      bidderClaim: 'Authorized Operating Subsidiary of Atlas Copco Airpower n.v., Belgium',
      referenceEvidence: 'Parent Entity Authorization Document',
      variance: 'Corporate Relationship Undertaking & Direct Warranty Backing Required',
      officerQuery: clarificationQuery,
      sharedEvidence: shared
    });

    setClarificationSentNotice(true);
  };

  const handleSimulateVendorResponse = () => {
    submitVendorClarificationResponse(
      'CLAR-2026-001',
      'Please find attached the Corporate Relationship Undertaking and Global Board Resolution confirming that Atlas Copco (India) Private Limited is the 100% authorized operating subsidiary with full back-to-back OEM warranty for CPCL Radiant Tube Spec MS-RAD-6IN-1F3.',
      [
        {
          id: 'CDOC-01',
          name: 'Corporate_Relationship_Undertaking_OEM.pdf',
          size: '1.8 MB',
          type: 'OEM_AUTH',
          uploadedAt: '12-Aug-2026 11:15 IST',
          checksum: 'sha256:7e8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
          verifiedStatus: 'VERIFIED'
        },
        {
          id: 'CDOC-02',
          name: 'Global_Board_Resolution_Subsidiary_Mandate.pdf',
          size: '1.4 MB',
          type: 'COMPANY_REG',
          uploadedAt: '12-Aug-2026 11:18 IST',
          checksum: 'sha256:9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
          verifiedStatus: 'VERIFIED'
        }
      ]
    );
  };

  const handleAcceptReverification = () => {
    reverifyBidderWithClarification('CLAR-2026-001');
    setSelectedDecisionAction('CLEARED');
    setDecisionRemarks('Corporate relationship undertaking and parent board resolution verified. Atlas Copco (India) Private Limited cleared as fully authorized operating subsidiary with 100% compliance for CPCL Manali delivery.');
    setActiveStep(5);
  };

  const handleConfirmDecision = () => {
    recordDecision(selectedDecisionAction, decisionRemarks);
    setShowDecisionConfirmModal(false);
    setDecisionRecordedSuccess(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Section 5: BID VERIFICATION WORKSPACE HEADER ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 sm:p-6 space-y-4">
        
        {/* Top Identification */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Bid Verification Workspace
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">Tender: <strong>{selectedTender.gemBidNo}</strong></span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600">CPCL Manali, Chennai</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">
              {selectedBidder.name}
            </h1>
            <p className="text-xs text-slate-600 font-mono">
              Bid ID: <strong className="text-slate-800">{selectedBidder.id}</strong> • Submission: 10-Aug-2026 (11:32 IST) • Material Code Wise L1
            </p>
          </div>

          {/* Bidder Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <label htmlFor="select-bidder" className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Compare Bidder:
            </label>
            <select
              id="select-bidder"
              value={selectedBidder.id}
              onChange={(e) => {
                selectBidderById(e.target.value);
                setActiveStep(1);
                setDecisionRecordedSuccess(false);
              }}
              className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 text-xs font-bold text-[#0F2942] focus:bg-white focus:ring-2 focus:ring-blue-700"
            >
              {bidders.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status & Assessment Indicator Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium">COMPLIANCE SCORE:</span>
            <span className="font-extrabold text-base text-[#0F2942]">
              {complianceScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-medium">RISK PROFILE:</span>
            <span className={`px-2.5 py-0.5 rounded font-extrabold text-xs uppercase ${
              overallRisk === 'HIGH' 
                ? 'bg-red-100 text-red-800 border border-red-300' 
                : overallRisk === 'MEDIUM'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {overallRisk} RISK
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 flex items-center justify-between">
            <span className="text-blue-900 font-medium">AI DECISION SUPPORT:</span>
            <span className="font-bold text-blue-900 text-xs text-right">
              {isReconciled ? 'Issue Reconciled (Qualified)' : 'Requires Officer Verification'}
            </span>
          </div>

        </div>

        {/* ── 5-STEP WORKSPACE STEPPER ── */}
        <div className="pt-2">
          <div className="grid grid-cols-5 gap-1.5 bg-slate-100 p-1.5 rounded-xl text-center text-xs font-bold select-none">
            {[
              { num: 1, label: '1 Documents' },
              { num: 2, label: '2 Compliance' },
              { num: 3, label: '3 Issues' },
              { num: 4, label: '4 Clarification' },
              { num: 5, label: '5 Decision' }
            ].map(step => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num as any)}
                className={`py-2 px-1 rounded-lg transition cursor-pointer text-xs ${
                  activeStep === step.num
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : activeStep > step.num
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1 — DOCUMENTS (Bidder Compliance Passport)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeStep === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0F2942]">DOCUMENTS SUBMITTED (Bidder Compliance Passport)</h2>
              <p className="text-slate-500 text-xs">Ingested submission documents for CPCL Tender C03H240087 eligibility evaluation.</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">8 Documents Ingested</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3.5">Document Name</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">File Details</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documentItems.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-700 flex-shrink-0" />
                        <div>
                          <p>{doc.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{doc.file}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : doc.status === 'Needs Review'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                      {doc.size} • PDF
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingDoc(selectedBidder.documents[idx] || selectedBidder.documents[0])}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                        >
                          View Document
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveStep(2)}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-900 border border-slate-200 font-semibold rounded text-xs transition cursor-pointer"
                        >
                          View Evidence
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveView('active-tenders')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              ← Back to Tenders
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>CONTINUE TO COMPLIANCE →</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2 — COMPLIANCE (Tender-Aware Intelligence & Verification)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeStep === 2 && (
        <div className="space-y-6">
          
          {/* Tender-Aware Compliance Banner */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0" />
              <div>
                <strong className="text-blue-950 font-bold block">Tender-Aware Compliance Intelligence</strong>
                <p className="text-blue-900 text-[11px]">
                  <em>"e-BID PRAMAAN dynamically identifies the compliance requirements applicable to the selected tender (CPCL C03H240087)."</em>
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-blue-900 bg-white px-2.5 py-1 rounded border border-blue-200 font-bold">
              9 Clauses Identified
            </span>
          </div>

          {/* Main Compliance Table Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5 text-xs">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#0F2942]">COMPLIANCE MATRIX</h2>
                <p className="text-slate-500 text-xs">Comparison of Tender Clause Requirements against Submitted Bid Evidence and Reference Datasets.</p>
              </div>
              <span className="font-bold text-xs text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Score: {complianceScore} / 100 • {isReconciled ? 'All 9 Clauses Compliant' : '1 Clause Requires Review'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3.5">REQUIREMENT & CLAUSE</th>
                    <th className="p-3.5">RESULT</th>
                    <th className="p-3.5">BIDDER EVIDENCE & REFERENCE</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  
                  {/* OEM Authorization */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>OEM / OEM Authorized Agency</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 2.1: Valid MAF for Radiant Furnace Tubes</span>
                    </td>
                    <td className="p-3.5">
                      {isReconciled ? (
                        <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Compliant (Subsidiary Backing)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                          ⚠ Scope Review Required
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      {isReconciled ? 'Board Resolution & Parent Corporate Undertaking' : 'Atlas Copco Airpower n.v. (Belgium Parent MAF)'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowEvidenceChainModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-blue-900 border border-slate-300 font-bold rounded text-xs transition cursor-pointer"
                      >
                        VIEW CHAIN
                      </button>
                    </td>
                  </tr>

                  {/* ISO 9001 */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>ISO 9001:2015 Accreditation</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 2.2: Active on Statutory Bid Date</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant (Valid on Bid Date)
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      LRQA Cert valid till 15-Dec-2026 (127 Days Remaining)
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                  {/* EMD */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>Earnest Money Deposit (EMD)</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 3.1: ₹3,70,000 Guarantee</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      SBI Bank Guarantee #SBI-BG-2026-8812 Verified
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                  {/* GST */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>GST Registration (GSTIN)</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 4.1: Active Regular Taxpayer</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      GSTN Reference Verified (27AAACA1234F1Z8)
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                  {/* PAN */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>Corporate PAN Verification</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 4.1: Valid Company PAN</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      Income Tax Record Allotted (AAACA1234F)
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                  {/* Make in India */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>Make in India Local Content</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 5.1: Class-I Supplier (≥ 50%)</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant (58.4% Local)
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      DPIIT Self-Declaration Verified
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                  {/* Land Border */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>Land Border Declaration</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 5.2: GFR Rule 144(xi)</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      Declaration Form on Record
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                  {/* Technical Spec */}
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>Technical Spec MS-RAD-6IN-1F3</p>
                      <span className="text-[10px] text-slate-500 font-normal">Clause 6.1: QAP Stage-III Clearance</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Compliant
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                      CPCL Radiant Tube Specification Matched
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowSourceDetailsModal(true)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded text-xs transition cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                ← Back to Documents
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <span>CONTINUE TO ISSUES →</span>
              </button>
            </div>
          </div>

          {/* ── Section 11: Temporal Verification (VALID ON BID DATE?) ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <History className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2942]">
                BID-DATE TEMPORAL VALIDATION
              </h3>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-xs text-[#0F2942]">ISO 9001:2015 Quality Management Certificate (LRQA)</strong>
                <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ VALID ON BID DATE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1 border-t border-emerald-200">
                <div>
                  <span className="text-slate-500 block">Certificate Validity Window:</span>
                  <strong className="font-mono text-emerald-800">10-Jan-2024 to 15-Dec-2026</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Bid Submission Date:</span>
                  <strong className="font-mono text-slate-800">10-Aug-2026 (11:32 IST)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Temporal Margin:</span>
                  <span className="font-semibold text-emerald-900">
                    Active on bid date (+127 days remaining).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 10: Relevant Government Sources Checked ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2942]">
                  Relevant Reference Sources Checked (10 Adapters)
                </h3>
                <p className="text-[11px] text-slate-500">Cross-verified against statutory government registries and manufacturer reference records.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSourceDetailsModal(true)}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                VIEW SOURCE DETAILS
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              {govRegistries.map((reg, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">{reg.name}</span>
                  <span className={`text-[10px] font-bold ${
                    reg.status === 'Verified' || reg.status === 'Clear' || reg.status === 'Valid on Bid Date' || reg.status === 'Reconciled'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}>
                    ✓ {reg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 3 — ISSUES (Actionable Issue Cards)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeStep === 3 && (
        <div className="bg-white rounded-xl border-2 border-amber-200 shadow-gov p-6 space-y-5 text-xs">
          
          <div className="border-b border-amber-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0F2942]">ISSUES REQUIRING ATTENTION</h2>
              <p className="text-slate-500 text-xs">Specific findings requiring officer confirmation or supporting clarification.</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-200">
              {isReconciled ? '0 Pending Issues (Reconciled)' : '1 Review Required'}
            </span>
          </div>

          {/* Issue 1: OEM Authorization Scope */}
          <div className={`p-4 rounded-xl border transition space-y-3 ${
            isReconciled ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-white font-bold text-[10px] rounded uppercase ${
                  isReconciled ? 'bg-emerald-700' : 'bg-amber-600'
                }`}>
                  {isReconciled ? 'Resolved' : 'Review Required'}
                </span>
                <strong className="text-sm font-bold text-[#0F2942]">Issue #01: OEM Authorization — Parent-Subsidiary Relationship Scope</strong>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                isReconciled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isReconciled ? '✓ Clarification Reconciled' : 'Review Required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Tender Requirement:</span>
                <strong className="text-slate-900 font-mono">Clause 2.1: OEM / Authorized Agency</strong>
                <span className="text-[10px] text-slate-500 block">Refinery Radiant Tube Spec</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Submitted Document:</span>
                <strong className="text-blue-900 font-mono">Atlas Copco Airpower n.v., Belgium</strong>
                <span className="text-[10px] text-slate-500 block">Parent Entity MAF Certificate</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Why it matters:</span>
                <span className="font-semibold text-slate-800">
                  Critical radiant tubes require direct OEM technical backing and manufacturer warranty.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-500 text-[11px]">
                Status: <strong>{isReconciled ? 'Reconciled via Board Resolution & Corporate Undertaking' : 'Scope Confirmation Required'}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceChainModal(true)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs transition cursor-pointer"
                >
                  VIEW EVIDENCE CHAIN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition cursor-pointer"
                >
                  REQUEST CLARIFICATION
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              ← Back to Compliance
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>CONTINUE TO CLARIFICATION →</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 4 — CLARIFICATION (Formal Communication & AI Re-Verification)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeStep === 4 && (
        <div className="space-y-6">
          
          {/* Notice Sent Alert */}
          {clarificationSentNotice && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Clarification Notice Dispatched to Bidder</span>
                </div>
                <button onClick={() => setClarificationSentNotice(false)} className="text-emerald-700 font-bold">✕</button>
              </div>
              <p className="text-emerald-900">
                Notice CLAR-2026-001 sent to <strong>Atlas Copco (India) Private Limited</strong> with shared OEM Certificate Page 2 excerpt.
              </p>
            </div>
          )}

          {/* Allowed vs Not Allowed Info Box */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
            <strong className="text-blue-950 font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-700" />
              Clarification Bounds under CPCL Procurement Rules
            </strong>
            <p className="text-blue-900 text-[11px] leading-relaxed">
              Clarifications are restricted to seeking confirmation or authenticating existing submitted documents without altering commercial pricing, delivery periods, or material terms of the bid.
            </p>
          </div>

          {/* 1. Request Clarification Form */}
          <form onSubmit={handleSendClarification} className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5 text-xs">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#0F2942]">REQUEST CLARIFICATION (Formal Letter Drafter)</h2>
                <p className="text-slate-500 text-xs">Draft clarification communication to bidder requesting supporting parent corporate undertaking.</p>
              </div>
              <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                CPCL Procurement Protocol
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Tender:</span>
                <strong className="font-mono text-[#0F2942]">{selectedTender.gemBidNo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Bidder:</span>
                <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Issue Category:</span>
                <strong className="text-amber-800">OEM Authorization Scope</strong>
              </div>
            </div>

            {/* Evidence Being Shared */}
            <div className="space-y-2 p-3.5 bg-blue-50/40 rounded-lg border border-blue-200">
              <span className="font-bold text-blue-900 text-xs block">
                Evidence reference attached in notice:
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareOemEvidence}
                    onChange={(e) => setShareOemEvidence(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-800">
                    ☑ Submitted OEM Certificate Page 2 excerpt (Atlas Copco Airpower n.v., Belgium)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareRuleEvidence}
                    onChange={(e) => setShareRuleEvidence(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-800">
                    ☑ Tender Clause 2.1 Pre-Qualification Rule excerpt
                  </span>
                </label>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 border-t border-blue-200/60">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Internal officer ratings and analytical models are strictly excluded from the vendor dispatch.</span>
              </p>
            </div>

            {/* Clarification Request Textarea */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                CLARIFICATION COMMUNICATION TEXT:
              </label>
              <textarea
                value={clarificationQuery}
                onChange={(e) => setClarificationQuery(e.target.value)}
                rows={3}
                required
                className="w-full p-3 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-700 text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert('Draft saved to session storage.')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                SAVE DRAFT
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND TO BIDDER</span>
              </button>
            </div>
          </form>

          {/* 2. Vendor Response & AI Re-Verification Workspace */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5 text-xs">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0F2942]">VENDOR RESPONSE & AI RE-VERIFICATION</h3>
                <p className="text-slate-500 text-xs">Review submitted corporate undertaking, board resolution, and automated evidence reconciliation.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-900 border border-blue-200">
                RESPONSE RECEIVED
              </span>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Box 1: Original Finding */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <span className="font-bold text-amber-900 text-[10px] uppercase tracking-wider block">
                  ORIGINAL FINDING
                </span>
                <p className="text-xs">Grantor: <strong>Atlas Copco Airpower n.v. (Belgium)</strong></p>
                <p className="text-[11px] text-slate-600">Parent-subsidiary corporate linkage confirmation required for radiant tubes.</p>
              </div>

              {/* Box 2: Vendor Response */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 text-[10px] uppercase tracking-wider block">
                  VENDOR RESPONSE
                </span>
                <p className="text-xs font-bold text-blue-950">100% Operating Subsidiary</p>
                <p className="text-[11px] text-slate-700 font-medium">
                  "Submitted Global Board Resolution confirming direct parent corporate backing and back-to-back OEM warranty."
                </p>
              </div>

              {/* Box 3: Supporting Documents */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
                  NEW SUPPORTING DOCUMENTS
                </span>
                <div className="space-y-1 text-[11px]">
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Corporate_Relationship_Undertaking.pdf</span>
                  </p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Global_Board_Resolution_Subsidiary.pdf</span>
                  </p>
                </div>
              </div>

            </div>

            {/* AI Re-Verification Result Banner */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <strong className="text-sm font-bold text-emerald-950">AI RE-VERIFICATION RESULT:</strong>
                </div>
                <span className="px-2.5 py-0.5 rounded font-extrabold text-xs bg-emerald-700 text-white font-mono">
                  ✓ ISSUE APPEARS RESOLVED
                </span>
              </div>
              <p className="text-xs text-emerald-900">
                AI evidence extraction validated parent-subsidiary corporate linkage with 99% confidence. Direct OEM technical warranty covers CPCL Radiant Tubes.
              </p>
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-xs text-slate-700">
                <strong className="text-slate-900">AI Recommendation:</strong> 100% compliance criteria satisfied. Officer must verify and record final qualification determination.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSimulateVendorResponse}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                Simulate Vendor Document Upload
              </button>

              <button
                type="button"
                onClick={handleAcceptReverification}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>REVIEW & DECIDE →</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 5 — DECISION & REPORT
      ══════════════════════════════════════════════════════════════════════ */}
      {activeStep === 5 && (
        <div className="space-y-6">
          
          {decisionRecordedSuccess ? (
            <div className="bg-white rounded-xl border-2 border-emerald-300 shadow-gov p-6 sm:p-8 space-y-6 text-xs text-center animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Procurement Officer Adjudication
                </span>
                <h2 className="text-2xl font-extrabold text-[#0F2942] mt-1">VERIFICATION COMPLETED</h2>
                <p className="text-slate-600 mt-1 text-xs">
                  Official qualification determination signed and committed to tamper-evident audit ledger.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Tender:</span>
                  <strong className="font-mono text-[#0F2942]">{selectedTender.gemBidNo}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Bidder:</span>
                  <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Compliance Score:</span>
                  <strong className="text-emerald-700 font-bold">{complianceScore} / 100</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Officer Decision:</span>
                  <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-emerald-800 font-mono">
                    {selectedDecisionAction.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Adjudicated By:</span>
                  <span className="font-mono text-slate-700">Rajeshwar Rao (PO-1042)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('decision-review')}
                  className="px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>VIEW COMPLIANCE DOSSIER</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-lg text-xs shadow-2xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>PRINT / DOWNLOAD REPORT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView('decision-review')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  <span>VIEW AUDIT TRAIL</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#0F2942]">RECORD PROCUREMENT OFFICER DECISION</h2>
                  <p className="text-slate-500 text-xs">Official determination for {selectedBidder.name} under CPCL Tender C03H240087.</p>
                </div>
                <span className="font-bold text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded">
                  Score: {complianceScore} / 100 • 100% Compliant
                </span>
              </div>

              {/* Summary Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-[#0F2942] block">Summary of Compliance Findings:</span>
                <p className="text-slate-700 leading-relaxed">
                  Bidder has fulfilled all 9 mandatory pre-qualification, technical, statutory, and procurement policy requirements. OEM parent-subsidiary corporate linkage has been verified with global parent board undertaking.
                </p>
              </div>

              {/* Decision Options */}
              <div className="space-y-3">
                <label className="font-bold text-slate-800 block text-xs">
                  Select Officer Determination: <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'CLEARED', label: 'Cleared for Further Evaluation', desc: 'Bidder satisfies all mandatory technical, statutory, and OEM criteria.' },
                    { key: 'REQUIRES_VERIFICATION', label: 'Requires Verification', desc: 'Seek additional documentation or original certificates.' },
                    { key: 'FLAGGED_FOR_INVESTIGATION', label: 'Flagged for Investigation', desc: 'Refer dossier to Technical Evaluation Committee.' },
                    { key: 'REJECT', label: 'Rejected', desc: 'Bidder fails mandatory criteria without right to cure.' }
                  ].map(opt => (
                    <label
                      key={opt.key}
                      onClick={() => setSelectedDecisionAction(opt.key as any)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 select-none ${
                        selectedDecisionAction === opt.key
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="finalDecisionAction"
                        checked={selectedDecisionAction === opt.key}
                        onChange={() => setSelectedDecisionAction(opt.key as any)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <strong className="text-xs font-bold text-[#0F2942] block">{opt.label}</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Officer Remarks */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  Mandatory Officer Reason & Justification: <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={decisionRemarks}
                  onChange={(e) => setDecisionRemarks(e.target.value)}
                  placeholder="Enter detailed statutory reasons..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>

              {/* Digital Signature Metadata */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                <div>
                  <span className="block text-slate-400">Authorized Officer:</span>
                  <strong className="text-slate-800">Rajeshwar Rao (PO-1042)</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Designation:</span>
                  <strong className="text-slate-800">Senior Procurement Officer</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Timestamp:</span>
                  <strong className="text-slate-800 font-mono">{new Date().toLocaleString()}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  <em>"AI provides decision support. Final procurement decision remains with the authorized officer."</em>
                </p>

                <button
                  type="button"
                  onClick={() => setShowDecisionConfirmModal(true)}
                  className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Gavel className="w-4 h-4" />
                  <span>CONFIRM & RECORD DECISION</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── MODAL: Explainable Evidence Chain (8-Node Traceability) ── */}
      {showEvidenceChainModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-3xl w-full p-6 space-y-4 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0F2942] font-bold text-base">
                <Layers className="w-5 h-5 text-blue-700" />
                <span>EXPLAINABLE EVIDENCE CHAIN (8-Node Traceability)</span>
              </div>
              <button onClick={() => setShowEvidenceChainModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>

            <p className="text-slate-600 text-xs">
              Complete, end-to-end traceable lineage explaining why this requirement was evaluated and how evidence was verified:
            </p>

            {/* Horizontal Node Navigation */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 bg-slate-100 p-1.5 rounded-xl text-center text-[10px] font-bold">
              {evidenceChainSteps.map(node => (
                <button
                  key={node.step}
                  onClick={() => setActiveChainStep(node.step)}
                  className={`py-1.5 px-1 rounded-lg transition cursor-pointer truncate ${
                    activeChainStep === node.step 
                      ? 'bg-[#0F2942] text-white shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                  title={`${node.step}. ${node.title}`}
                >
                  {node.step}. {node.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Active Node Detail Card */}
            {evidenceChainSteps.filter(n => n.step === activeChainStep).map(activeNode => (
              <div key={activeNode.step} className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white font-bold flex items-center justify-center text-xs">
                      {activeNode.step}
                    </span>
                    <strong className="text-sm font-bold text-[#0F2942]">{activeNode.title}</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-100 text-blue-900 border border-blue-200">
                    {activeNode.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {activeNode.desc}
                </p>
              </div>
            ))}

            {/* 8-Step Timeline Summary */}
            <div className="space-y-2 py-1 max-h-56 overflow-y-auto pr-1">
              {evidenceChainSteps.map((item) => (
                <div 
                  key={item.step} 
                  onClick={() => setActiveChainStep(item.step)}
                  className={`p-2.5 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                    activeChainStep === item.step 
                      ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-blue-900 font-mono text-[11px] whitespace-nowrap">
                    Step {item.step}:
                  </span>
                  <div className="flex-1">
                    <strong className="text-xs text-[#0F2942]">{item.title}</strong>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">({item.badge})</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* "Why was this flagged?" AI Explanation Panel */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 space-y-1">
              <strong className="block text-amber-900 font-bold">Why was this flagged by AI?</strong>
              <p className="leading-relaxed">
                The AI detected that the issuing entity on the Manufacturer Authorization Form is the global parent entity located in Belgium rather than a direct Indian office. This requires administrative verification of corporate subsidiary linkage to ensure direct manufacturer backing.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                Cryptographic Evidence Checksum: sha256:19581e27de...
              </span>
              <button
                type="button"
                onClick={() => setShowEvidenceChainModal(false)}
                className="px-4 py-2 bg-[#0F2942] text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Close Chain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Government Source Details (10 Adapters) ── */}
      {showSourceDetailsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0F2942] font-bold text-sm">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>Reference Verification Adapters (10 Sources)</span>
              </div>
              <button onClick={() => setShowSourceDetailsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {govRegistries.map((reg, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#0F2942] text-xs block">{reg.name}</strong>
                    <span className="text-[11px] text-slate-500 font-mono">Reference Ref: {reg.ref}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      ✓ {reg.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{reg.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSourceDetailsModal(false)}
                className="px-4 py-2 bg-[#0F2942] text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Document Viewer ── */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#0F2942]">
                <FileText className="w-5 h-5 text-blue-700" />
                <span>Document: {viewingDoc.name}</span>
              </div>
              <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Document Type:</span>
                <strong className="text-[#0F2942] font-mono">{viewingDoc.type}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">File Size & Pages:</span>
                <span>{viewingDoc.size} • {viewingDoc.pageCount} Pages</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cryptographic Checksum:</span>
                <span className="font-mono text-[10px] text-slate-600 truncate max-w-xs">{viewingDoc.checksum}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                SHA-256 integrity verified against submission timestamp.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-[#0F2942] text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Decision Confirmation ── */}
      {showDecisionConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-base border-b border-slate-100 pb-3">
              <Gavel className="w-5 h-5 text-blue-700" />
              <span>CONFIRM OFFICER DECISION</span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              This determination will be recorded in the tamper-evident audit ledger under Officer ID <strong>PO-1042</strong> with a cryptographic SHA-256 signature.
            </p>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tender:</span>
                <strong className="font-mono text-[#0F2942]">{selectedTender.gemBidNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bidder:</span>
                <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Decision:</span>
                <span className="font-bold text-blue-900 uppercase font-mono">{selectedDecisionAction.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDecisionConfirmModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
