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
  Check,
  Clock,
  RotateCcw
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

  // 5 Workflow Tabs: Documents | Compliance | Issues | Clarification | Decision
  const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'COMPLIANCE' | 'ISSUES' | 'CLARIFICATION' | 'DECISION'>('COMPLIANCE');

  // Modals & Drawers
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
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
  const complianceScore = isReconciled ? 100 : 86;
  const overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' = isReconciled ? 'LOW' : 'MEDIUM';

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
    { name: 'GSTN Reference', status: 'Verified', date: '02-Sep-2026', ref: selectedBidder.gstin, source: 'Goods & Services Tax Network' },
    { name: 'Corporate PAN (ITD)', status: 'Verified', date: '02-Sep-2026', ref: selectedBidder.pan, source: 'Income Tax Department' },
    { name: 'MCA21 Company Master', status: 'Verified', date: '02-Sep-2026', ref: selectedBidder.cin, source: 'Ministry of Corporate Affairs' },
    { name: 'LRQA Quality Registry', status: 'Valid on Bid Date', date: '10-Aug-2026', ref: 'ISO-9001-LRQA-8812', source: 'Accreditation Body Ledger' },
    { name: 'OEM Verification Portal', status: isReconciled ? 'Reconciled' : 'Review Required', date: 'Scope Checked', ref: 'CPCL-RAD-ATC-2026-MAF', source: 'Manufacturer Mandate Ledger' },
    { name: 'Make in India / DPIIT', status: 'Verified', date: 'Class-I (58.4%)', ref: 'DPIIT-MII-2026', source: 'Public Procurement Portal' },
    { name: 'CPCL Debarment Registry', status: 'Clear', date: 'No Default', ref: 'CPCL-HOLIDAY-NIL', source: 'MoPNG / PSU Debarment Database' },
    { name: 'State Bank of India', status: 'Verified', date: 'BG Confirmed', ref: 'SBI-BG-2026-8812', source: 'Structured Financial Messaging' },
    { name: 'Udyam / MSME Portal', status: 'Verified', date: 'Active', ref: selectedBidder.udyamNo || 'UDYAM-MH-26-0012489', source: 'Ministry of MSME' },
    { name: 'DigiLocker Verification', status: 'Verified', date: 'SHA-256 Hashed', ref: 'DL-CPCL-8821', source: 'National Document Exchange' }
  ];

  // Documents list
  const documentItems = [
    { name: 'GST Registration Certificate', category: 'Statutory', submitted: 'Yes', extractionStatus: 'Extracted', verification: 'Verified', file: 'GST_Registration_Certificate.pdf', size: '890 KB' },
    { name: 'Corporate PAN Card', category: 'Statutory', submitted: 'Yes', extractionStatus: 'Extracted', verification: 'Verified', file: 'Corporate_PAN_Card.pdf', size: '480 KB' },
    { name: 'ITR Acknowledgement & Tax Record', category: 'Financial', submitted: 'Yes', extractionStatus: 'Extracted', verification: isReconciled ? 'Verified' : 'Review', file: 'ITR_Acknowledgement_AY2025_26.pdf', size: '1.1 MB' },
    { name: 'OEM Authorization Certificate (MAF)', category: 'Technical', submitted: 'Yes', extractionStatus: 'Extracted', verification: isReconciled ? 'Verified' : 'Review', file: 'OEM_Authorization_Certificate.pdf', size: '1.4 MB' },
    { name: 'Technical Compliance Sheet (MS-RAD-6IN-1F3)', category: 'Technical', submitted: 'Yes', extractionStatus: 'Extracted', verification: 'Potential Issue', file: 'Technical_Compliance_Sheet_MS_RAD_6IN.pdf', size: '2.8 MB' },
    { name: 'ISO 9001:2015 Quality Certificate (LRQA)', category: 'Technical', submitted: 'Yes', extractionStatus: 'Extracted', verification: 'Verified', file: 'ISO_9001_Certificate_Lloyds.pdf', size: '1.2 MB' },
    { name: 'Make in India Local Content Declaration', category: 'Statutory', submitted: 'Yes', extractionStatus: 'Extracted', verification: 'Verified', file: 'Make_in_India_Local_Content_Declaration.pdf', size: '650 KB' },
    { name: 'Land Border Declaration Rule 144(xi)', category: 'Statutory', submitted: 'Yes', extractionStatus: 'Extracted', verification: 'Verified', file: 'Land_Border_Declaration_Rule144xi.pdf', size: '510 KB' }
  ];

  // 8-Step Traceability Chain
  const evidenceChainSteps = [
    { step: 1, title: 'Tender Requirement', badge: 'Clause 2.1', desc: 'Tender Clause 2.1 specifies that the bidder must be an OEM or OEM Authorized Agency for radiant tubes with verifiable authorization token.' },
    { step: 2, title: 'Compliance Rule', badge: 'CPCL-PQ-001', desc: 'Machine Rule CPCL-PQ-001 enforces OEM verification and direct technical warranty backing for CPCL Manali refinery delivery.' },
    { step: 3, title: 'Bidder Document', badge: 'OEM_Authorization_Certificate.pdf', desc: 'Bidder submitted 2-page OEM authorization letter issued by Atlas Copco Airpower n.v. Belgium.' },
    { step: 4, title: 'Extracted Evidence', badge: 'Grantor: Atlas Copco Airpower n.v.', desc: 'AI extracted grantor name: Atlas Copco Airpower n.v. (Belgium) and authorized entity: Atlas Copco (India) Private Limited.' },
    { step: 5, title: 'Reference Evidence', badge: 'Corporate Reference Dataset', desc: 'Global corporate reference confirms Atlas Copco Airpower n.v. Belgium is global parent entity and Atlas Copco (India) Pvt Ltd is Indian operating subsidiary.' },
    { step: 6, title: 'Comparison', badge: 'Parent-Subsidiary Relationship', desc: 'Authorization is issued by parent entity rather than third-party distributor. Scope requires officer confirmation of back-to-back warranty.' },
    { step: 7, title: 'Finding', badge: isReconciled ? 'RECONCILED' : 'REVIEW REQUIRED', desc: isReconciled ? 'Parent board resolution & corporate undertaking verify 100% Indian operating subsidiary backing with direct OEM warranty.' : 'Parent-to-subsidiary authorization requires confirmation of subsidiary operational mandate for radiant furnace tubes.' },
    { step: 8, title: 'Officer Action', badge: 'Decision Support', desc: isReconciled ? 'Approve Pre-Qualification under Clause 2.1 and proceed to final commercial evaluation.' : 'Discrepancy identified — Officer Action Required. Request formal corporate undertaking from bidder.' }
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
    setActiveTab('DECISION');
  };

  const handleConfirmDecision = () => {
    recordDecision(selectedDecisionAction, decisionRemarks);
    setShowDecisionConfirmModal(false);
    setDecisionRecordedSuccess(true);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Section 9: FLAGSHIP WORKSTATION HEADER ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs p-5 space-y-4">
        
        {/* Top Context Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                BID VERIFICATION WORKSTATION
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-mono">Tender: <strong className="text-slate-900">{selectedTender.gemBidNo}</strong></span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600">{selectedTender.title}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">
                {selectedBidder.name}
              </h1>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-300">
                Bid ID: {selectedBidder.id}
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500 font-mono">
              Submission: 10-Aug-2026 (11:32 IST) • PAN: {selectedBidder.pan} • GSTIN: {selectedBidder.gstin}
            </p>
          </div>

          {/* Bidder Switcher */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <label htmlFor="select-bidder" className="text-xs font-semibold text-slate-600 hidden sm:inline">
              Bidder:
            </label>
            <select
              id="select-bidder"
              value={selectedBidder.id}
              onChange={(e) => {
                selectBidderById(e.target.value);
                setDecisionRecordedSuccess(false);
              }}
              className="p-1.5 border border-slate-300 rounded-sm bg-slate-50 text-xs font-bold text-[#0F2942] focus:bg-white focus:ring-1 focus:ring-blue-700"
            >
              {bidders.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compact Horizontal Metrics Summary (Prompt Section 9) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          
          <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Compliance</span>
            <strong className="text-lg font-bold text-[#0F2942]">{complianceScore}%</strong>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Requirements</span>
            <strong className="text-lg font-bold text-slate-800">14</strong>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Verified</span>
            <strong className="text-lg font-bold text-emerald-700">{isReconciled ? '14' : '12'}</strong>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Review Required</span>
            <strong className="text-lg font-bold text-amber-600">{isReconciled ? '0' : '1'}</strong>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Potential Issue</span>
            <strong className="text-lg font-bold text-red-600">{isReconciled ? '0' : '1'}</strong>
          </div>

        </div>

      </div>

      {/* ── Section 11: PROFESSIONAL TABS ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 text-xs font-bold select-none">
          {[
            { key: 'DOCUMENTS', label: 'Documents' },
            { key: 'COMPLIANCE', label: 'Compliance' },
            { key: 'ISSUES', label: 'Issues' },
            { key: 'CLARIFICATION', label: 'Clarification' },
            { key: 'DECISION', label: 'Decision' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-5 transition text-left cursor-pointer border-b-2 font-bold ${
                activeTab === tab.key
                  ? 'border-[#0F2942] text-[#0F2942] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: DOCUMENTS (Section 12)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F2942]">Submitted Bidder Documents</h3>
                  <p className="text-[11px] text-slate-500">Documentary evidence submitted for Tender {selectedTender.gemBidNo}.</p>
                </div>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                  {documentItems.length} Ingested Documents
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <th className="p-3">Document</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Submitted</th>
                      <th className="p-3 text-center">Extraction Status</th>
                      <th className="p-3">Verification</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {documentItems.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">
                          <p className="text-xs font-bold text-[#0F2942]">{doc.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{doc.file} • {doc.size}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-700 font-medium">{doc.category}</span>
                        </td>
                        <td className="p-3 text-center font-medium">
                          <span className="text-emerald-800 font-bold">Yes</span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-700">
                          Extracted
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-sm text-[10.5px] font-bold ${
                            doc.verification === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : doc.verification === 'Review'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {doc.verification}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('COMPLIANCE')}
                              className="px-2.5 py-1 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs cursor-pointer"
                            >
                              Verify
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: HERO COMPLIANCE VERIFICATION TABLE (Section 12 & 13)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-6">
              
              {/* Hero Table */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider">
                      COMPLIANCE VERIFICATION
                    </h3>
                    <p className="text-[11px] text-slate-500">Tender-specific clause verification against submitted evidence and reference registries.</p>
                  </div>
                  <span className="text-xs text-slate-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-300">
                    Clause-to-Evidence Matrix
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                        <th className="p-3">Requirement</th>
                        <th className="p-3">Tender Rule</th>
                        <th className="p-3">Bidder Evidence</th>
                        <th className="p-3">Reference Evidence</th>
                        <th className="p-3">Comparison</th>
                        <th className="p-3">Result</th>
                        <th className="p-3 text-right">Officer Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      
                      {/* 1. GST Registration */}
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">GST Registration</td>
                        <td className="p-3 text-slate-600">Valid registration required</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">GST Certificate</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">GST reference (GSTN)</td>
                        <td className="p-3 font-semibold text-emerald-800">Match</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            VERIFIED
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setShowSourceDetailsModal(true)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>

                      {/* 2. PAN */}
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">PAN</td>
                        <td className="p-3 text-slate-600">Valid PAN required</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">PAN Document</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">IT Reference</td>
                        <td className="p-3 font-semibold text-emerald-800">Match</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            VERIFIED
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setShowSourceDetailsModal(true)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>

                      {/* 3. ITR Filing */}
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">ITR Filing</td>
                        <td className="p-3 text-slate-600">Applicable ITR evidence</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">ITR Acknowledgement</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">IT Reference</td>
                        <td className="p-3 font-semibold text-amber-800">Review</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-amber-100 text-amber-800 border border-amber-300">
                            REVIEW REQUIRED
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setActiveTab('CLARIFICATION')}
                            className="px-2.5 py-1 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs cursor-pointer"
                          >
                            Clarify
                          </button>
                        </td>
                      </tr>

                      {/* 4. OEM Authorization */}
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">OEM Authorization</td>
                        <td className="p-3 text-slate-600">Valid MAF from manufacturer</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">{isReconciled ? 'Board Resolution & Undertaking' : 'Authorization Letter (Airpower n.v.)'}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">OEM Registry</td>
                        <td className="p-3 font-semibold text-slate-800">{isReconciled ? 'Match' : 'Parent-subsidiary linkage'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-sm font-bold text-[10.5px] ${
                            isReconciled 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {isReconciled ? 'VERIFIED' : 'REVIEW REQUIRED'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setShowEvidenceChainModal(true)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-900 border border-slate-300 rounded-sm text-xs font-bold cursor-pointer"
                          >
                            View Chain
                          </button>
                        </td>
                      </tr>

                      {/* 5. Make in India */}
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">Make in India Local Content</td>
                        <td className="p-3 text-slate-600">Class-I (≥ 50% Local Content)</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">Self-Declaration (58.4%)</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">DPIIT Reference</td>
                        <td className="p-3 font-semibold text-emerald-800">Exceeds threshold</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            VERIFIED
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setShowSourceDetailsModal(true)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>

                      {/* 6. Technical Compliance */}
                      <tr className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-[#0F2942]">Technical Compliance</td>
                        <td className="p-3 text-slate-600">Must satisfy specification</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">Compliance Sheet</td>
                        <td className="p-3 font-mono text-[11px] text-slate-800">Tender Specification</td>
                        <td className="p-3 font-semibold text-red-800">Mismatch</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-red-100 text-red-800 border border-red-300">
                            POTENTIAL NON-COMPLIANCE
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setActiveTab('ISSUES')}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold cursor-pointer"
                          >
                            Investigate
                          </button>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bid-Date Temporal Validation Strip */}
              <div className="p-3.5 bg-slate-50 rounded-sm border border-slate-300 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 uppercase text-[11px]">
                    Bid-Date Temporal Validation (Valid on Statutory Bid Date)
                  </span>
                  <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ Valid on Bid Submission Date
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Certificate Validity:</span>
                    <strong className="font-mono text-slate-800">10-Jan-2024 to 15-Dec-2026</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Bid Submission Date:</span>
                    <strong className="font-mono text-slate-800">10-Aug-2026 (11:32 IST)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Validation Finding:</span>
                    <span className="font-medium text-emerald-800">Active on bid date (+127 days buffer).</span>
                  </div>
                </div>
              </div>

              {/* 10 Reference Verification Sources Checked */}
              <div className="p-3.5 bg-slate-50 rounded-sm border border-slate-300 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 uppercase text-[11px]">
                    Government & Reference Sources Checked (10 Adapters)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSourceDetailsModal(true)}
                    className="text-blue-900 font-bold hover:underline text-[11px]"
                  >
                    View Registry References →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  {govRegistries.map((reg, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-sm border border-slate-200">
                      <span className="font-bold text-slate-800 truncate block">{reg.name}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">✓ {reg.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: ISSUES (Section 14 & 15)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ISSUES' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F2942]">Issues Requiring Officer Action</h3>
                  <p className="text-[11px] text-slate-500">Discrepancies identified requiring authorized officer review or clarification.</p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-sm border border-amber-300">
                  {isReconciled ? '0 Open Issues (Reconciled)' : '1 Review Required'}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <th className="p-3">Priority</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Finding</th>
                      <th className="p-3">Evidence</th>
                      <th className="p-3">Recommended Action</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    
                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-red-100 text-red-900 border border-red-300">
                          HIGH
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#0F2942]">
                        OEM Authorization Scope
                      </td>
                      <td className="p-3 text-slate-700">
                        Grantor is global parent entity (Atlas Copco Airpower n.v., Belgium)
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-700">
                        OEM_Authorization_Certificate.pdf
                      </td>
                      <td className="p-3 font-semibold text-blue-900">
                        Clarify
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-sm font-bold text-[10.5px] ${
                          isReconciled 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {isReconciled ? 'Resolved' : 'Open'}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setActiveTab('CLARIFICATION')}
                          className="px-3 py-1 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs cursor-pointer"
                        >
                          Clarify
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                          MEDIUM
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#0F2942]">
                        ITR Filing
                      </td>
                      <td className="p-3 text-slate-700">
                        Additional verification against applicable tender requirement
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-700">
                        ITR_Acknowledgement.pdf
                      </td>
                      <td className="p-3 font-semibold text-blue-900">
                        Review
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-slate-100 text-slate-700 border border-slate-300">
                          Open
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setShowEvidenceChainModal(true)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-sm text-xs cursor-pointer"
                        >
                          View Chain
                        </button>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: CLARIFICATION (Section 20)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'CLARIFICATION' && (
            <div className="space-y-5">
              
              {clarificationSentNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-sm text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-950 font-bold">Clarification Request Dispatched to Bidder</strong>
                    <button onClick={() => setClarificationSentNotice(false)} className="text-emerald-700 font-bold">✕</button>
                  </div>
                  <p className="text-emerald-900">
                    Official clarification correspondence sent to <strong>{selectedBidder.name}</strong> regarding OEM Authorization Scope.
                  </p>
                </div>
              )}

              {/* Clarification Request Letter Drafter */}
              <form onSubmit={handleSendClarification} className="p-4 bg-slate-50 rounded-sm border border-slate-300 space-y-4 text-xs">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-[#0F2942] uppercase text-xs">CLARIFICATION REQUEST</h4>
                  <span className="text-[11px] font-mono text-slate-500">Official Correspondence</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block font-bold text-[10px] uppercase">Tender:</span>
                    <strong className="text-[#0F2942]">{selectedTender.gemBidNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold text-[10px] uppercase">Bidder:</span>
                    <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold text-[10px] uppercase">Requirement:</span>
                    <span className="text-slate-800">Clause 2.1: OEM Manufacturer Authorization</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold text-[10px] uppercase">Response Due Date:</span>
                    <strong className="text-red-700 font-mono">04-Sep-2026, 17:00 IST</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block text-xs">
                    Message to Bidder:
                  </label>
                  <textarea
                    value={clarificationQuery}
                    onChange={(e) => setClarificationQuery(e.target.value)}
                    rows={3}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-sm text-xs bg-white focus:ring-1 focus:ring-blue-700 text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-500">
                    <em>"Clarifications must not alter commercial price or core tender conditions."</em>
                  </p>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs shadow-2xs transition cursor-pointer"
                  >
                    SEND CLARIFICATION
                  </button>
                </div>
              </form>

              {/* Vendor Response Received & AI Re-Verification Result */}
              <div className="p-4 bg-white rounded-sm border border-slate-300 space-y-4 text-xs">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-[#0F2942] uppercase text-xs">VENDOR RESPONSE RECEIVED</h4>
                  <span className="text-[11px] font-mono text-slate-500">12-Aug-2026 11:15 IST</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 text-[10.5px] uppercase block">Response Statement</span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      "Please find attached the Corporate Relationship Undertaking and Global Board Resolution confirming that Atlas Copco (India) Private Limited is the 100% authorized operating subsidiary with full back-to-back OEM warranty for CPCL Radiant Tube Spec MS-RAD-6IN-1F3."
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 text-[10.5px] uppercase block">Uploaded Documents</span>
                    <p className="font-semibold text-slate-900">• Corporate_Relationship_Undertaking.pdf (1.8 MB)</p>
                    <p className="font-semibold text-slate-900">• Global_Board_Resolution_Subsidiary.pdf (1.4 MB)</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-950 font-bold">Re-verification Result:</strong>
                    <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-emerald-700 text-white font-mono">
                      ✓ EVIDENCE RECONCILED
                    </span>
                  </div>
                  <p className="text-emerald-900 text-xs">
                    Corporate relationship undertaking and parent board resolution confirm direct subsidiary authorization and warranty backing.
                  </p>
                  <p className="text-[11px] text-slate-600 italic">
                    Verification Decision Support: Final procurement determination remains with the authorized officer.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleSimulateVendorResponse}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-sm text-xs cursor-pointer"
                  >
                    Simulate Vendor Upload
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptReverification}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-sm text-xs shadow-2xs transition cursor-pointer"
                  >
                    PROCEED TO OFFICER DECISION →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: DECISION (Section 21)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'DECISION' && (
            <div className="space-y-5">
              
              {decisionRecordedSuccess ? (
                <div className="p-6 bg-slate-50 border border-emerald-400 rounded-sm space-y-4 text-xs text-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F2942]">OFFICER DECISION RECORDED</h3>
                    <p className="text-slate-600 text-xs mt-0.5">
                      Official qualification determination signed and committed to the audit trail under Officer ID <strong>PO-1042</strong>.
                    </p>
                  </div>
                  <div className="max-w-md mx-auto p-3 bg-white rounded-sm border border-slate-200 text-left space-y-1.5 text-xs">
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
                      <strong className="text-emerald-700 font-mono">{selectedDecisionAction.replace(/_/g, ' ')}</strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveView('report')}
                      className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs cursor-pointer"
                    >
                      VIEW COMPLIANCE REPORT
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('audit-trail')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-sm text-xs cursor-pointer"
                    >
                      VIEW AUDIT TRAIL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Verification Summary (Prompt Section 21) */}
                  <div className="p-3.5 bg-slate-50 rounded-sm border border-slate-300 space-y-2">
                    <span className="font-bold text-[#0F2942] block text-xs">Verification Summary:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 bg-white rounded-sm border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Requirements Checked</span>
                        <strong className="text-sm font-bold text-[#0F2942]">14</strong>
                      </div>
                      <div className="p-2 bg-white rounded-sm border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Verified</span>
                        <strong className="text-sm font-bold text-emerald-700">{isReconciled ? '14' : '12'}</strong>
                      </div>
                      <div className="p-2 bg-white rounded-sm border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Review Required</span>
                        <strong className="text-sm font-bold text-amber-600">{isReconciled ? '0' : '1'}</strong>
                      </div>
                      <div className="p-2 bg-white rounded-sm border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Potential Non-Compliance</span>
                        <strong className="text-sm font-bold text-red-600">{isReconciled ? '0' : '1'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Officer Determination Options (Prompt Section 21) */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 block text-xs">
                      Officer Determination: <span className="text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'CLEARED', label: 'Qualified', desc: 'All criteria satisfied.' },
                        { key: 'REQUIRES_VERIFICATION', label: 'Requires Further Verification', desc: 'Seek additional review.' },
                        { key: 'REJECT', label: 'Not Qualified', desc: 'Fails mandatory criteria.' }
                      ].map(opt => (
                        <label
                          key={opt.key}
                          onClick={() => setSelectedDecisionAction(opt.key as any)}
                          className={`p-3 rounded-sm border cursor-pointer transition flex items-start gap-2 select-none ${
                            selectedDecisionAction === opt.key
                              ? 'border-blue-700 bg-blue-50/50 font-bold'
                              : 'border-slate-300 bg-white hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="decisionOption"
                            checked={selectedDecisionAction === opt.key}
                            onChange={() => setSelectedDecisionAction(opt.key as any)}
                            className="mt-0.5 text-blue-700"
                          />
                          <div>
                            <strong className="text-xs text-[#0F2942] block">{opt.label}</strong>
                            <span className="text-[10.5px] text-slate-500 font-normal">{opt.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Officer Remarks */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block text-xs">
                      Officer Remarks: <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={decisionRemarks}
                      onChange={(e) => setDecisionRemarks(e.target.value)}
                      placeholder="Enter official justification..."
                      className="w-full p-2.5 border border-slate-300 rounded-sm text-xs bg-white text-slate-900 focus:ring-1 focus:ring-blue-700"
                      required
                    />
                  </div>

                  {/* Decision Support Principle Banner */}
                  <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-sm text-[11px] text-slate-700 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-800 flex-shrink-0" />
                    <span>
                      <strong>Decision Support Principle:</strong> "Automated extraction and rule comparison provide decision support. Final procurement determination remains with the authorized officer."
                    </span>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDecisionConfirmModal(true)}
                      className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs shadow-2xs transition cursor-pointer"
                    >
                      CONFIRM DECISION
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ── MODAL: Explainable Evidence Chain ── */}
      {showEvidenceChainModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-2xl w-full p-5 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-bold text-sm text-[#0F2942] uppercase">
                Traceable Evidence Lineage (8 Steps)
              </h3>
              <button onClick={() => setShowEvidenceChainModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-2">
              {evidenceChainSteps.map(st => (
                <div key={st.step} className="p-2.5 bg-slate-50 rounded-sm border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0F2942] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {st.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-[#0F2942]">{st.title}</strong>
                      <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-sm text-slate-700">{st.badge}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowEvidenceChainModal(false)}
                className="px-4 py-1.5 bg-[#0F2942] text-white font-bold rounded-sm text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Reference Registry Sources Checked ── */}
      {showSourceDetailsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-2xl w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-bold text-sm text-[#0F2942] uppercase">
                Reference Verification Sources (10 Adapters)
              </h3>
              <button onClick={() => setShowSourceDetailsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {govRegistries.map((reg, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-sm border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-[#0F2942] block">{reg.name}</strong>
                    <span className="text-[11px] text-slate-500">{reg.source} • Ref: {reg.ref}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    ✓ {reg.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowSourceDetailsModal(false)}
                className="px-4 py-1.5 bg-[#0F2942] text-white font-bold rounded-sm text-xs cursor-pointer"
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
          <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-md w-full p-5 space-y-3.5 text-xs">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-sm border-b border-slate-200 pb-2">
              <Gavel className="w-4 h-4 text-blue-800" />
              <span>CONFIRM OFFICER DECISION</span>
            </div>
            <p className="text-slate-600 text-xs">
              This determination will be committed to the cryptographic audit trail under Officer ID <strong>PO-1042</strong>.
            </p>
            <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Tender:</span>
                <strong className="font-mono text-[#0F2942]">{selectedTender.gemBidNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bidder:</span>
                <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Determination:</span>
                <span className="font-bold text-blue-900">{selectedDecisionAction.replace(/_/g, ' ')}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDecisionConfirmModal(false)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Document Viewer ── */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-lg w-full p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <strong className="text-[#0F2942] text-sm">Document: {viewingDoc.name}</strong>
              <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-1.5 text-slate-700">
              <p>Category: <strong>{viewingDoc.category}</strong></p>
              <p>File: <span className="font-mono">{viewingDoc.file} ({viewingDoc.size})</span></p>
              <p>Verification Status: <span className="font-bold text-emerald-700">✓ {viewingDoc.verification}</span></p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 bg-[#0F2942] text-white font-bold rounded-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
