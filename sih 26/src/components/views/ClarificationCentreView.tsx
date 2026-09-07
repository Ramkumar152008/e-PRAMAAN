import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Clock, 
  Edit3, 
  X, 
  ShieldCheck, 
  Eye, 
  Check, 
  ShieldAlert, 
  Lock, 
  Plus, 
  Trash2, 
  History,
  Layers,
  ChevronDown,
  ChevronUp,
  Inbox,
  Save,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClarificationRequest, ClarificationStatus, SharedEvidenceItem } from '../../types';
import { gemIntegrationService } from '../../services/gemIntegrationService';

export const ClarificationCentreView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    clarifications,
    activeClarification,
    setActiveClarification,
    sendClarificationRequest,
    submitVendorClarificationResponse,
    adjudicateClarificationResponse,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'REQUEST' | 'RESPONSE_REVERIFICATION' | 'HISTORY'>('REQUEST');
  const [showEvidenceChain, setShowEvidenceChain] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendSuccessData, setSendSuccessData] = useState<ClarificationRequest | null>(null);
  const [previewingEvidence, setPreviewingEvidence] = useState<SharedEvidenceItem | null>(null);

  // Form inputs for drafting clarification
  const [draftSubject, setDraftSubject] = useState(
    `Clarification regarding OEM Manufacturer Authorization Scope — Tender ${selectedTender.gemBidNo}`
  );
  const [draftIssue, setDraftIssue] = useState('OEM Manufacturer Authorization Scope');
  const [draftRequirement, setDraftRequirement] = useState('Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with valid MAF.');
  const [draftClaim, setDraftClaim] = useState('Authorized Operating Subsidiary of Atlas Copco Airpower n.v., Belgium');
  const [draftRef, setDraftRef] = useState('Direct OEM Authorization Token for CPCL Radiant Tube Spec');
  const [draftVariance, setDraftVariance] = useState('Parent-Subsidiary Linkage & Direct Warranty Undertaking Required');
  const [draftWhyRequired, setDraftWhyRequired] = useState(
    'Critical refinery radiant heater furnace tubes require direct OEM engineering warranty and technical back-to-back backing under CPCL Specification MS-RAD-6IN-1F3.'
  );
  const [draftDeadline, setDraftDeadline] = useState('04-Sep-2026, 17:00 IST (48 Hours)');
  const [draftOfficerRemarks, setDraftOfficerRemarks] = useState(
    'Disclose parent-subsidiary corporate linkage undertaking and global board resolution for CPCL Manali refinery delivery.'
  );
  const [draftQuery, setDraftQuery] = useState(
    `With reference to Tender ${selectedTender.gemBidNo}, clarification is requested regarding the Manufacturer Authorization Form (MAF) submitted with your bid. The submitted MAF is issued by parent entity Atlas Copco Airpower n.v., Belgium. Please provide documentary confirmation of direct parent-subsidiary corporate linkage and confirmation that back-to-back technical support and warranty cover CPCL Radiant Tube Spec MS-RAD-6IN-1F3.`
  );

  // Selectable Evidence to Share
  const [selectableEvidence, setSelectableEvidence] = useState<SharedEvidenceItem[]>([
    {
      id: 'SEV-01',
      title: 'OEM Authorization Certificate (Page 2 Excerpt)',
      sourceRegistry: 'Bidder Submission Locker',
      documentRef: 'OEM_Authorization_Certificate.pdf (Page 2)',
      type: 'EXTRACTED_PAGE',
      date: '02-Sep-2026',
      excerpt: 'Atlas Copco Airpower n.v. authorizes Atlas Copco (India) Private Limited for regional industrial representation.',
      checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
      size: '1.4 MB',
      selected: true
    },
    {
      id: 'SEV-02',
      title: 'Tender Pre-Qualification Rule CPCL-PQ-001 Excerpt',
      sourceRegistry: 'CPCL Requirement Matrix',
      documentRef: 'Tender Clause 2.1',
      type: 'REGISTRY_RECORD',
      date: '15-Jun-2026',
      excerpt: 'Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with verifiable authorization token.',
      checksum: 'sha256:4a8c91d2e0f872b65103a8904712ec3105ab6719cd288231aa492147810fed01',
      size: '520 KB',
      selected: true
    },
    {
      id: 'SEV-03',
      title: 'Technical Specification MS-RAD-6IN-1F3 Excerpt',
      sourceRegistry: 'CPCL Engineering Standard',
      documentRef: 'CPCL Spec MS-RAD-6IN-1F3',
      type: 'CALCULATION_DIFF',
      date: '15-Jun-2026',
      excerpt: 'Furnace heater radiant tube design specifications and QAP Stage-III testing protocols.',
      checksum: 'sha256:9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      size: '890 KB',
      selected: false
    }
  ]);

  // Officer Adjudication State
  const [selectedOutcome, setSelectedOutcome] = useState<'RESOLVED' | 'FURTHER_VERIFICATION_REQUIRED' | 'MISMATCH_REMAINS' | 'ESCALATE_TO_SPECIALIST'>('RESOLVED');
  const [officerNotes, setOfficerNotes] = useState(
    'Corporate relationship undertaking and parent board resolution verified. Atlas Copco (India) Private Limited confirmed as authorized operating subsidiary with direct OEM backing.'
  );

  const selectedClar = activeClarification || clarifications[0];

  const handleToggleEvidenceSelection = (id: string) => {
    setSelectableEvidence(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleRemoveEvidence = (id: string) => {
    setSelectableEvidence(prev => prev.filter(item => item.id !== id));
  };

  const handleAddEvidenceItem = () => {
    const newItem: SharedEvidenceItem = {
      id: `SEV-${Date.now().toString().slice(-4)}`,
      title: 'Board Undertaking Format Guidance Excerpt',
      sourceRegistry: 'CPCL Procurement Standard',
      documentRef: 'CPCL-ANNEXURE-OEM-2026.pdf',
      type: 'REGISTRY_RECORD',
      date: new Date().toLocaleDateString('en-GB'),
      excerpt: 'Annexure IV: Standard parent company technical and commercial warranty guarantee template.',
      checksum: 'sha256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
      size: '420 KB',
      selected: true
    };
    setSelectableEvidence(prev => [...prev, newItem]);
  };

  const handleOpenSendConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectableEvidence.some(e => e.selected)) {
      alert('Please select at least one evidence attachment to share with the vendor.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSend = () => {
    const created = sendClarificationRequest({
      tenderId: selectedTender.gemBidNo,
      tenderTitle: selectedTender.title,
      bidderId: selectedBidder.id,
      bidderName: selectedBidder.name,
      issueCategory: draftIssue,
      tenderRequirement: draftRequirement,
      bidderClaim: draftClaim,
      referenceEvidence: draftRef,
      variance: draftVariance,
      whyRequired: draftWhyRequired,
      officerQuery: draftQuery,
      evidenceReference: 'OEM Authorization Certificate & CPCL Specification MS-RAD-6IN-1F3',
      responseDeadline: draftDeadline,
      officerRemarks: draftOfficerRemarks,
      sharedEvidence: selectableEvidence.filter(e => e.selected)
    });

    setShowConfirmModal(false);
    setSendSuccessData(created);
  };

  const handleAdjudicateOutcome = () => {
    if (!selectedClar) return;
    if (selectedOutcome === 'RESOLVED') {
      adjudicateClarificationResponse(selectedClar.id, 'ACCEPT', officerNotes);
      alert(`Clarification marked as RESOLVED. Evidence reconciled and compliance status updated.`);
    } else if (selectedOutcome === 'FURTHER_VERIFICATION_REQUIRED') {
      adjudicateClarificationResponse(selectedClar.id, 'ADDITIONAL', officerNotes);
      alert(`Clarification marked: FURTHER VERIFICATION REQUIRED. Follow-up inquiry drafted.`);
    } else if (selectedOutcome === 'MISMATCH_REMAINS') {
      adjudicateClarificationResponse(selectedClar.id, 'MISMATCH_REMAINS', officerNotes);
      alert(`Clarification marked: MISMATCH REMAINS. Non-compliance finding retained.`);
    } else {
      adjudicateClarificationResponse(selectedClar.id, 'ESCALATE_TO_SPECIALIST', officerNotes);
      alert(`Clarification escalated to Technical Committee.`);
    }
  };

  const getStatusBadge = (st: ClarificationStatus) => {
    switch (st) {
      case 'AWAITING_RESPONSE':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-900 border border-amber-300">⚠ AWAITING BIDDER RESPONSE</span>;
      case 'RESPONSE_RECEIVED':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-blue-900 border border-blue-300">● RESPONSE RECEIVED</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-purple-50 text-purple-900 border border-purple-300">UNDER OFFICER REVIEW</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-300">✓ RESOLVED / ACCEPTED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-red-50 text-red-900 border border-red-300">✕ NON-COMPLIANT</span>;
      case 'ADDITIONAL_CLARIFICATION_REQUIRED':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-900 border border-amber-300">ADDITIONAL EVIDENCE REQ.</span>;
      case 'DRAFT':
      default:
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-300">DRAFT</span>;
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto py-4 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Title Strip (Section 7) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2942] tracking-tight">CLARIFICATION CENTRE</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Review compliance findings, prepare a targeted clarification request, and re-verify bidder responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('bid-verification')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Verification</span>
          </button>
        </div>
      </div>

      {/* ── Compact Context Strip (Section 23) ── */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-slate-400">Tender: </span>
            <strong className="font-mono text-[#0F2942] font-bold">{selectedTender.gemBidNo}</strong>
          </div>
          <span className="text-slate-300 font-bold">•</span>
          <div>
            <span className="text-slate-400">Bidder: </span>
            <strong className="text-[#0F2942] font-bold">{selectedBidder.name}</strong>
          </div>
          <span className="text-slate-300 font-bold">•</span>
          <div>
            <span className="text-slate-400">Officer: </span>
            <span className="font-mono text-slate-800">PO-1042</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium text-[11px]">Active Clarifications:</span>
          <span className="font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded text-[11px] font-mono">
            {clarifications.length} Registered Case(s)
          </span>
        </div>
      </div>

      {/* ── 3 Primary Workflow Tabs (Section 21) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('REQUEST')}
          className={`pb-2 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'REQUEST'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
          <span>1. Request</span>
        </button>

        <button
          onClick={() => setActiveTab('RESPONSE_REVERIFICATION')}
          className={`pb-2 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'RESPONSE_REVERIFICATION'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>2. Response & Re-verification</span>
          {clarifications.some(c => c.status === 'RESPONSE_RECEIVED') && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-2 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'HISTORY'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-slate-600" />
          <span>3. Clarification History</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: REQUEST WORKFLOW (Section 10, 11, 12, 13, 14, 15, 16, 17, 18)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'REQUEST' && (
        <div className="space-y-4">
          
          {/* ── SUCCESS BANNER AFTER DISPATCH ── */}
          {sendSuccessData ? (
            <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-in fade-in text-xs">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 block">CLARIFICATION SENT</span>
                    <h3 className="text-sm font-extrabold text-[#0F2942]">✓ Request Dispatched to Bidder</h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                  AWAITING BIDDER RESPONSE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-emerald-200 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Notice Ref:</span>
                  <strong className="font-mono text-[#0F2942]">{sendSuccessData.id}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Sent To:</span>
                  <strong className="text-[#0F2942]">{sendSuccessData.bidderName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Attached Evidence:</span>
                  <strong className="text-emerald-700">{sendSuccessData.sharedEvidence?.filter(e => e.selected).length || 0} Files</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Response Required By:</span>
                  <strong className="font-mono text-blue-900">{sendSuccessData.responseDeadline}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="text-[11px] text-slate-500">
                  Notice logged to audit trail with SHA-256 tamper-evident checksum.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('RESPONSE_REVERIFICATION')}
                    className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Review Response</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOpenSendConfirmation} className="space-y-4">
              
              {/* ── SECTION 1: FINDING REQUIRING CLARIFICATION (Section 10 & 11) ── */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3.5 text-xs">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 font-extrabold text-[10px] rounded uppercase tracking-wider">
                      HIGH PRIORITY
                    </span>
                    <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                      FINDING REQUIRING CLARIFICATION
                    </h2>
                  </div>
                  <span className="font-bold text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    ⚠ Clarification Required
                  </span>
                </div>

                {/* Finding Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium block text-[11px]">Requirement:</span>
                    <p className="text-slate-900 font-semibold">{draftRequirement}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium block text-[11px]">Submitted Document:</span>
                    <p className="text-blue-900 font-mono font-semibold">OEM_Authorization_Certificate.pdf</p>
                  </div>
                  <div className="sm:col-span-2 space-y-1 pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium block text-[11px]">Compliance Finding:</span>
                    <p className="text-red-700 font-medium leading-relaxed">
                      {draftVariance} — Submitted MAF is issued by parent entity Atlas Copco Airpower n.v., Belgium. Corporate linkage confirmation and direct warranty backing required for CPCL Specification MS-RAD-6IN-1F3.
                    </p>
                  </div>
                  <div className="sm:col-span-2 space-y-1 pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium block text-[11px]">Why This Matters:</span>
                    <p className="text-slate-700 leading-relaxed">
                      {draftWhyRequired}
                    </p>
                  </div>
                </div>

                {/* Compact Expandable: VIEW EVIDENCE CHAIN (Section 11) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEvidenceChain(!showEvidenceChain)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <Layers className="w-4 h-4 text-blue-700" />
                    <span>{showEvidenceChain ? 'Hide Evidence Chain' : 'VIEW EVIDENCE CHAIN (7-Node Traceability)'}</span>
                    {showEvidenceChain ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showEvidenceChain && (
                    <div className="mt-3 p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2.5 animate-in fade-in">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                        Explainable Evidence Traceability
                      </span>

                      <div className="relative pl-6 space-y-3 border-l-2 border-blue-300 text-xs">
                        
                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-slate-900 block text-[11px]">1. Tender Requirement</strong>
                          <p className="text-slate-600 text-[11px]">Clause 2.1: Must be OEM or authorized subsidiary with direct backing.</p>
                        </div>

                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-slate-900 block text-[11px]">2. Compliance Rule</strong>
                          <p className="text-slate-600 text-[11px]">Rule CPCL-PQ-001: Validate OEM authorization validity & corporate subsidiary linkage.</p>
                        </div>

                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-slate-900 block text-[11px]">3. Bidder Document</strong>
                          <p className="text-slate-600 text-[11px]">OEM_Authorization_Certificate.pdf (Submitted by bidder).</p>
                        </div>

                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-slate-900 block text-[11px]">4. Extracted Value</strong>
                          <p className="text-slate-600 text-[11px]">Issuer: Atlas Copco Airpower n.v., Belgium • Entity: Atlas Copco (India) Pvt Ltd.</p>
                        </div>

                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-slate-900 block text-[11px]">5. Reference Evidence</strong>
                          <p className="text-slate-600 text-[11px]">CPCL Specification MS-RAD-6IN-1F3 radiant furnace tube engineering standard.</p>
                        </div>

                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-amber-900 block text-[11px]">6. Comparison</strong>
                          <p className="text-slate-600 text-[11px]">Parent authorization token present, but subsidiary warranty undertaking missing.</p>
                        </div>

                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-red-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                          <strong className="text-red-900 block text-[11px]">7. Finding</strong>
                          <p className="text-red-700 font-semibold text-[11px]">Parent-subsidiary corporate linkage undertaking required before clearing.</p>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* ── SECTION 2: EVIDENCE TO SHARE WITH BIDDER (Section 12 & 13) ── */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3.5 text-xs">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                      EVIDENCE TO SHARE WITH BIDDER
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Select only the evidence necessary to explain the clarification request.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddEvidenceItem}
                    className="text-blue-700 hover:text-blue-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Reference</span>
                  </button>
                </div>

                {/* Evidence Rows Table */}
                <div className="space-y-2">
                  {selectableEvidence.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.selected 
                          ? 'bg-blue-50/40 border-blue-300' 
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox"
                          id={`chk-${item.id}`}
                          checked={item.selected}
                          onChange={() => handleToggleEvidenceSelection(item.id)}
                          className="w-4 h-4 mt-0.5 rounded text-blue-700 focus:ring-blue-500 cursor-pointer accent-blue-700"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <label htmlFor={`chk-${item.id}`} className="font-bold text-slate-900 text-xs cursor-pointer">
                              {item.title}
                            </label>
                            <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-white text-slate-700 font-bold border border-slate-200">
                              {item.sourceRegistry}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{item.excerpt}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Ref: {item.documentRef} • {item.date} {item.size && `• ${item.size}`}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewingEvidence(item)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs border border-slate-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveEvidence(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PRIVACY CHECK GOVERNANCE BOX (Section 12) */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>PRIVACY CHECK & GOVERNANCE BOUNDARY</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-emerald-900 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Internal notes excluded</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>AI reasoning excluded</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Other bidder information excluded</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Only relevant evidence selected ({selectableEvidence.filter(e => e.selected).length} items)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── SECTION 3: CLARIFICATION REQUEST (Section 14 & 15) ── */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
                
                <div className="border-b border-slate-100 pb-2.5">
                  <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                    CLARIFICATION REQUEST
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Formal procurement communication to be dispatched to the bidder.
                  </p>
                </div>

                {/* Subject Field */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block text-xs">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 text-xs">
                      Clarification Message
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className="text-blue-700 hover:text-blue-900 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingDraft ? 'Lock Message' : 'Edit Custom Message'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={draftQuery}
                    onChange={(e) => setDraftQuery(e.target.value)}
                    className={`w-full p-3 border rounded-lg text-xs leading-relaxed font-sans ${
                      isEditingDraft
                        ? 'border-blue-600 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600/30'
                        : 'border-slate-300 bg-slate-50 text-slate-800'
                    }`}
                  />
                </div>

                {/* Response Deadline Card (Section 15) */}
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">RESPONSE REQUIRED BY</span>
                      <strong className="text-blue-950 font-bold text-xs">{draftDeadline}</strong>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300">
                    ✓ Response window active (2 working days)
                  </span>
                </div>

                {/* PRE-SEND REVIEW SUMMARY (Section 17) */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <span className="font-bold text-[#0F2942] uppercase text-[10px] tracking-wider block">READY TO SEND</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Recipient:</span>
                      <strong className="text-slate-900 truncate block">{selectedBidder.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Evidence attached:</span>
                      <strong className="text-blue-900">{selectableEvidence.filter(e => e.selected).length} items</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Response due:</span>
                      <strong className="text-slate-900">04-Sep-2026</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Privacy check:</span>
                      <strong className="text-emerald-700">✓ Passed</strong>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Action (Section 16) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => alert('Draft saved to session storage.')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveView('bid-verification')}
                      className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND CLARIFICATION</span>
                  </button>
                </div>

              </div>

            </form>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: RESPONSE & RE-VERIFICATION (Section 19 & 20)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'RESPONSE_REVERIFICATION' && (
        <div className="space-y-4 text-xs">
          
          {/* Section 4: Bidder Response Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                  BIDDER RESPONSE
                </h2>
              </div>
              <div>{getStatusBadge(selectedClar?.status || 'AWAITING_RESPONSE')}</div>
            </div>

            {selectedClar?.vendorExplanation ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span className="font-bold text-blue-950">Bidder Explanatory Statement</span>
                    <span>Received: <strong>{selectedClar.vendorResponseSubmittedAt || '12-Aug-2026 11:20 IST'}</strong></span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    "{selectedClar.vendorExplanation}"
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block text-xs mb-1.5">Uploaded Supporting Documents:</span>
                  <div className="space-y-1.5">
                    {(selectedClar.vendorSupportingDocs || [
                      { id: 'D1', name: 'AtlasCopco_Corporate_Undertaking_BoardResolution.pdf', size: '2.4 MB' },
                      { id: 'D2', name: 'Global_Parent_BackToBack_Warranty_Guarantee.pdf', size: '1.2 MB' }
                    ]).map((doc: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-700" />
                          <div>
                            <span className="font-bold text-slate-800">{doc.name}</span>
                            <span className="text-slate-400 font-mono text-[10px] block">Size: {doc.size}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px]">
                          ✓ VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-500 space-y-3">
                <Clock className="w-8 h-8 text-amber-600 mx-auto" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Awaiting Bidder Response Submission</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">The bidder has been notified and the 48-hour clarification window is active until <strong>04-Sep-2026, 17:00 IST</strong>.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => submitVendorClarificationResponse(selectedClar.id, '', [])}
                    className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Simulate Bidder Response Submission</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('vendor-portal')}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 shadow-2xs cursor-pointer transition"
                  >
                    Open Vendor Portal →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Re-Verification & Adjudication: Rendered once Bidder Response is received */}
          {selectedClar?.vendorExplanation ? (
            <>
              {/* AI Re-Verification Panel (Section 20) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                      AI RE-VERIFICATION
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Comparison Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-red-900 uppercase block">1. PREVIOUS FINDING</span>
                    <p className="text-slate-800 font-medium">Parent-subsidiary corporate linkage required for MAF scope.</p>
                    <p className="text-red-700 font-bold text-[11px]">Status: UNVERIFIED</p>
                  </div>

                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-blue-900 uppercase block">2. NEW EVIDENCE</span>
                    <p className="text-slate-800 font-medium">Board Resolution & Parent Company Undertaking (Belgium).</p>
                    <p className="text-blue-900 font-bold text-[11px]">LRQA & Undertaking Verified</p>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-emerald-950 uppercase block">3. VERIFICATION RESULT</span>
                    <p className="text-slate-800 font-medium">Match confirmed · Direct OEM Support & Warranty Backing.</p>
                    <p className="text-emerald-800 font-bold text-[11px]">✓ 100% COMPLIANT</p>
                  </div>
                </div>

                {/* MANDATORY OFFICER REVIEW REQUIRED GOVERNANCE BOX */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>OFFICER REVIEW REQUIRED</span>
                  </div>
                  <p className="text-amber-900 text-[11px] leading-relaxed">
                    AI-supported comparison completed. Officer review is strictly required before compliance status is finalized. AI does not make autonomous procurement determinations.
                  </p>
                </div>
              </div>

              {/* Officer Clarification Adjudication */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                <div className="border-b border-slate-100 pb-2.5">
                  <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                    OFFICER DETERMINATION
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Record your determination based on the re-verified evidence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { id: 'RESOLVED', label: '✓ Accept & Resolve', desc: 'Clarification satisfied' },
                    { id: 'FURTHER_VERIFICATION_REQUIRED', label: '⚠ Further Proof Required', desc: 'Seek additional certificates' },
                    { id: 'MISMATCH_REMAINS', label: '✕ Retain Finding', desc: 'Discrepancy unresolved' },
                    { id: 'ESCALATE_TO_SPECIALIST', label: '⚑ Escalate to Committee', desc: 'Refer to Technical Panel' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOutcome(opt.id as any)}
                      className={`p-3 rounded-lg border-2 text-left transition cursor-pointer ${
                        selectedOutcome === opt.id 
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs text-[#0F2942]">
                        <span>{opt.label}</span>
                        {selectedOutcome === opt.id && <Check className="w-3.5 h-3.5 text-blue-700" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block text-xs">
                    Officer Remarks (Committed to Immutable Audit Ledger) <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                    placeholder="Record statutory basis for this determination..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleAdjudicateOutcome}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>RECORD CLARIFICATION DETERMINATION</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('decision-review')}
                    className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>PROCEED TO OFFICER DECISION</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>AI RE-VERIFICATION PENDING BIDDER RESPONSE</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Automated evidence extraction, OCR validation, and compliance comparison will execute immediately upon receipt of the bidder's response documents.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: CLARIFICATION HISTORY (Section 22)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4 text-xs">
          
          {/* Vertical Chronological Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wide">
                  CLARIFICATION TIMELINE
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Case Ref: CLAR-2026-001</span>
            </div>

            <div className="relative pl-6 space-y-4 border-l-2 border-slate-200">
              
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <strong className="text-[#0F2942] font-bold">Clarification Requested</strong>
                  <span className="text-[10px] font-mono text-slate-400">02-Sep-2026 11:30 IST</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">Procurement Officer (PO-1042) dispatched notice regarding MAF corporate linkage.</p>
              </div>

              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <strong className="text-[#0F2942] font-bold">Vendor Response Received</strong>
                  <span className="text-[10px] font-mono text-slate-400">03-Sep-2026 14:15 IST</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">Atlas Copco (India) submitted Board Resolution & Parent Company Undertaking.</p>
              </div>

              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[31px] top-0.5 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-900 font-bold">Documents Re-Verified</strong>
                  <span className="text-[10px] font-mono text-slate-400">03-Sep-2026 14:16 IST</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">e-BID PRAMAAN verified corporate linkage to LRQA certification standard.</p>
              </div>

              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[31px] top-0.5 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <strong className="text-amber-900 font-bold">Officer Review Pending</strong>
                  <span className="text-[10px] font-mono text-slate-400">03-Sep-2026 Active</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">Awaiting authorized officer sign-off in Clarification Centre.</p>
              </div>

            </div>
          </div>

          {/* Clarification Register Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#0F2942] uppercase tracking-wide">Clarification Register ({clarifications.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Notice ID</th>
                    <th className="p-3">Tender</th>
                    <th className="p-3">Bidder</th>
                    <th className="p-3">Issue Category</th>
                    <th className="p-3">Deadline</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clarifications.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-blue-900">{c.id}</td>
                      <td className="p-3 font-mono text-slate-700">{c.tenderId}</td>
                      <td className="p-3 font-bold text-[#0F2942]">{c.bidderName}</td>
                      <td className="p-3 text-slate-800">{c.issueCategory}</td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{c.responseDeadline}</td>
                      <td className="p-3">{getStatusBadge(c.status)}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveClarification(c);
                            setActiveTab('RESPONSE_REVERIFICATION');
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded text-xs border border-slate-300 transition cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ── Interactive Evidence Preview Modal ── */}
      {previewingEvidence && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full p-5 space-y-3.5 text-slate-900 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-sm text-[#0F2942]">Evidence Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingEvidence(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-xs text-blue-900 block">{previewingEvidence.title}</span>
              <p><strong>Source Registry:</strong> {previewingEvidence.sourceRegistry}</p>
              <p><strong>Document Ref:</strong> {previewingEvidence.documentRef}</p>
              <p><strong>Date:</strong> {previewingEvidence.date}</p>
              {previewingEvidence.size && <p><strong>File Size:</strong> {previewingEvidence.size}</p>}
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-1">
              <span className="font-bold text-[11px] text-blue-950 block">Official Record Excerpt:</span>
              <p className="font-mono text-slate-800 text-[11px] leading-relaxed bg-white p-2.5 rounded border border-blue-200">
                "{previewingEvidence.excerpt}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500">Authorized for vendor disclosure</span>
              <button
                type="button"
                onClick={() => setPreviewingEvidence(null)}
                className="px-4 py-1.5 bg-[#0F2942] text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal Before Dispatch (Section 17) ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-md w-full p-5 space-y-3.5 text-slate-900 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-base border-b border-slate-100 pb-2.5">
              <MessageSquare className="w-5 h-5 text-blue-700" />
              <span>Confirm Clarification Dispatch</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Confirm sending this clarification notice with <strong>{selectableEvidence.filter(e => e.selected).length} selected evidence attachment(s)</strong> to <strong>{selectedBidder.name}</strong>.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
              <p><strong>Tender:</strong> {selectedTender.gemBidNo}</p>
              <p><strong>Subject:</strong> {draftSubject}</p>
              <p><strong>Attached Evidence:</strong> {selectableEvidence.filter(e => e.selected).map(e => e.title).join(', ')}</p>
              <p><strong>Response Deadline:</strong> {draftDeadline}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Confirm & Send Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation Footer (Section 36) ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('bid-verification')}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Verification
        </button>

        <button
          onClick={() => setActiveView('decision-review')}
          className="px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Officer Decision</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
