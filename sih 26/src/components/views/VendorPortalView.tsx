import React, { useState } from 'react';
import { 
  Store, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Bell, 
  Send, 
  MessageSquare, 
  Eye, 
  Trash2, 
  FileCheck, 
  HelpCircle, 
  Mail, 
  Flame, 
  Lock, 
  Info,
  Clock,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClarificationDocument, ClarificationRequest } from '../../types';

export const VendorPortalView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    clarifications, 
    activeClarification, 
    setActiveClarification,
    submitVendorClarificationResponse, 
    notifications,
    markNotificationAsRead,
    setRole,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SELF_AUDIT' | 'CLARIFICATIONS' | 'DOCUMENTS' | 'NOTIFICATIONS' | 'PROFILE'>('DASHBOARD');

  // Document self-audit state
  const [documents, setDocuments] = useState(selectedBidder.documents);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccessNotice, setAuditSuccessNotice] = useState(false);

  // Clarification response form state
  const targetClarification: ClarificationRequest = activeClarification || clarifications[0] || {
    id: 'CLAR-2026-001',
    tenderId: selectedTender.gemBidNo,
    tenderTitle: selectedTender.title,
    bidderId: selectedBidder.id,
    bidderName: selectedBidder.name,
    issueCategory: 'OEM Manufacturer Authorization Scope',
    tenderRequirement: 'Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with valid MAF.',
    bidderClaim: 'Authorized Operating Subsidiary of Atlas Copco Airpower n.v., Belgium',
    referenceEvidence: 'Parent Entity Authorization Document',
    variance: 'Subsidiary Scope & Direct Warranty Confirmation Required',
    officerQuery: 'With reference to Tender C03H240087, clarification is requested regarding the Manufacturer Authorization Form (MAF) submitted with your bid. Please provide documentary confirmation of direct parent-subsidiary corporate linkage and back-to-back technical support.',
    evidenceReference: 'OEM_Authorization_Certificate.pdf (Page 2) & Global Corporate Registry',
    responseDeadline: '04-Sep-2026, 17:00 IST (48 Hours)',
    status: 'AWAITING_RESPONSE',
    createdAt: '02-Sep-2026 11:30 IST',
    officerId: 'PO-1042',
    sharedEvidence: [
      {
        id: 'SEV-01',
        title: 'OEM Authorization Certificate (Page 2 Excerpt)',
        sourceRegistry: 'Bidder Submission Dossier',
        documentRef: 'OEM_Authorization_Certificate.pdf (Page 2)',
        type: 'EXTRACTED_PAGE',
        date: '02-Sep-2026',
        excerpt: 'Atlas Copco Airpower n.v. authorizes Atlas Copco (India) Private Limited for regional industrial representation.',
        checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
        size: '1.4 MB',
        selected: true
      }
    ]
  };

  const [vendorExplanation, setVendorExplanation] = useState(
    'Please find attached the Audited Financial Statement for FY 2024–25 and Chartered Accountant reconciliation certificate with UDIN 2688124A explaining standalone vs consolidated turnover. The consolidated audited revenue is ₹12.1 Crore, satisfying the ≥ ₹10 Crore tender requirement.'
  );

  const [uploadedClarDocs, setUploadedClarDocs] = useState<ClarificationDocument[]>([
    {
      id: 'CDOC-01',
      name: 'Audited_Financial_Statement_FY2024-25.pdf',
      size: '2.4 MB',
      type: 'AUDITED_FINANCIALS',
      uploadedAt: '12-Aug-2026 11:15 IST',
      checksum: 'sha256:7e8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
      verifiedStatus: 'VERIFIED'
    },
    {
      id: 'CDOC-02',
      name: 'CA_Turnover_Reconciliation_Statement_UDIN.pdf',
      size: '1.2 MB',
      type: 'CA_RECONCILIATION',
      uploadedAt: '12-Aug-2026 11:18 IST',
      checksum: 'sha256:9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      verifiedStatus: 'VERIFIED'
    }
  ]);

  const [previewingSharedEvidence, setPreviewingSharedEvidence] = useState<any | null>(null);
  const [responseSubmitted, setResponseSubmitted] = useState(targetClarification.status === 'RESPONSE_RECEIVED' || targetClarification.status === 'ACCEPTED');

  const handleRunSelfAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditSuccessNotice(true);
      setTimeout(() => setAuditSuccessNotice(false), 4000);
    }, 1000);
  };

  const handleUploadNewFile = () => {
    const newDoc: ClarificationDocument = {
      id: `CDOC-${Date.now().toString().slice(-4)}`,
      name: 'Audited_Consolidated_Financial_Report_FY24-25.pdf',
      size: '3.1 MB',
      type: 'AUDITED_FINANCIALS',
      uploadedAt: new Date().toLocaleTimeString('en-GB') + ' IST',
      checksum: 'sha256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
      verifiedStatus: 'VERIFIED'
    };
    setUploadedClarDocs(prev => [...prev, newDoc]);
    alert('Document "Audited_Consolidated_Financial_Report_FY24-25.pdf" successfully attached!');
  };

  const handleRemoveUploadedDoc = (id: string) => {
    setUploadedClarDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmitClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorExplanation.trim()) {
      alert('Please provide an explanatory response before submitting.');
      return;
    }
    if (uploadedClarDocs.length === 0) {
      alert('Please upload at least one supporting document before submitting.');
      return;
    }
    submitVendorClarificationResponse(targetClarification.id, vendorExplanation, uploadedClarDocs);
    setResponseSubmitted(true);
  };

  // Vendor-Friendly Checklist Items (Section 5)
  const selfAuditChecklist = [
    {
      id: 'CK-01',
      title: 'Permanent Account Number (PAN)',
      evidence: 'Corporate PAN Card Copy',
      status: 'VERIFIED',
      statusType: 'PASS',
      note: 'PAN card verified and matches legal company entity.',
      recommendation: 'No correction needed.'
    },
    {
      id: 'CK-02',
      title: 'GSTIN Registration & Filing History',
      evidence: 'GST Form REG-06',
      status: 'VERIFIED',
      statusType: 'PASS',
      note: 'Active taxpayer with regular monthly returns filed in state of supply.',
      recommendation: 'No correction needed.'
    },
    {
      id: 'CK-03',
      title: 'Udyam / MSME Registration',
      evidence: 'Udyam Registration Certificate',
      status: 'VERIFIED',
      statusType: 'PASS',
      note: 'Valid Medium Enterprise under NIC Code 26516 (Pipeline Monitoring).',
      recommendation: 'No correction needed.'
    },
    {
      id: 'CK-04',
      title: 'Minimum Annual Turnover Evidence',
      evidence: 'CA Turnover Certificate & Balance Sheets',
      status: 'INCONSISTENCY DETECTED',
      statusType: 'WARN',
      note: 'Declared turnover of ₹12.0 Cr differs from MCA21 standalone filings (₹8.7 Cr).',
      recommendation: 'Upload CA reconciliation certificate with UDIN or consolidated financial statements.'
    },
    {
      id: 'CK-05',
      title: 'Oil & Gas Sector Relevant Experience',
      evidence: 'Previous Work Orders & Completion Certificates',
      status: 'VERIFICATION REQUIRED',
      statusType: 'WARN',
      note: 'Submitted completion certificates require explicit verification of hydrocarbon pipeline scope.',
      recommendation: 'Ensure prior client completion letters specify pipeline telemetry & safety instrumentation.'
    },
    {
      id: 'CK-06',
      title: 'Petroleum Safety Certificate (PESO / ATEX)',
      evidence: 'PESO Flameproof Zone-1 Certificate',
      status: 'EXPIRED BEFORE BID DATE',
      statusType: 'FAIL',
      note: 'Submitted certificate expired on 05-Aug-2026, 5 days prior to bid submission cutoff (10-Aug-2026).',
      recommendation: 'Upload renewed PESO endorsement certificate valid past 10 August 2026.'
    },
    {
      id: 'CK-07',
      title: 'OEM Authorization Form (MAF)',
      evidence: 'Manufacturer Authorization Form Token',
      status: 'UNDER VERIFICATION',
      statusType: 'WARN',
      note: 'MAF token attached (PETRO-SENS-2026-MAF-8812). Product scope confirmation recommended.',
      recommendation: 'Verify OEM token validity through OEM partner portal.'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Departmental Compliance & Bidder Notice ── */}
      <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs shadow-xs">
        <Store className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block sm:inline">Registered Bidder Notice:</strong>{' '}
          <span>
            Submissions and clarifications are managed under applicable tender evaluation guidelines. Official bid submissions and commercial tenders are governed by official procurement portal procedures.
          </span>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Registered Bidder Workspace • {selectedBidder.name} ({selectedBidder.id})</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Vendor Compliance & Clarification Workspace</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Pre-submission compliance self-audit, document readiness, and Clause 14(c) clarification responses
          </p>
        </div>

        <button
          onClick={handleRunSelfAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-300 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Scanning Self-Audit...' : 'Re-Run Compliance Scan'}</span>
        </button>
      </div>

      {auditSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Compliance Self-Audit refreshed against Tender PET/2026/B/00125 parameters.</span>
        </div>
      )}

      {/* ── Navigation Tabs (Section 22) ── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white p-1 rounded-xl shadow-2xs text-xs">
        {[
          { key: 'DASHBOARD', label: 'Vendor Dashboard', icon: Store },
          { key: 'SELF_AUDIT', label: 'Compliance Self-Audit', icon: ShieldCheck },
          { key: 'CLARIFICATIONS', label: 'Clarification Requests', icon: MessageSquare, badge: clarifications.filter(c => c.status === 'AWAITING_RESPONSE').length },
          { key: 'DOCUMENTS', label: 'Document Self-Audit', icon: FileText },
          { key: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read && n.recipientRole === 'VENDOR').length },
          { key: 'PROFILE', label: 'Company Profile & GeM Scope', icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
                isActive 
                  ? 'bg-[#0F2942] text-white font-bold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: VENDOR DASHBOARD (Section 4)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          
          {/* Active Clarification Alert Banner (Section 10) */}
          {clarifications.some(c => c.status === 'AWAITING_RESPONSE') && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-200 text-amber-900 rounded-lg">
                  <Bell className="w-5 h-5 text-amber-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-amber-950">🔔 New Clarification Request</span>
                    <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded font-mono">
                      AWAITING RESPONSE
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Procurement Officer PO-1042 has requested clarification for Tender <strong>PET/2026/B/00125</strong> ({targetClarification.issueCategory}). Response Turnaround Deadline: <strong>{targetClarification.responseDeadline}</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('CLARIFICATIONS')}
                className="px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                Respond to Clarification →
              </button>
            </div>
          )}

          {/* ── Simulated GeM Integration Status Card ── */}
          <div className="bg-white rounded-xl border border-blue-200 shadow-gov p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F2942]">Departmental Clarification Integration Status</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Channel Telemetry & Interface Parameters</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[10px] rounded-md font-mono">
                CHANNEL: CONNECTED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Channel</span>
                <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">Departmental Interface</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Authentication</span>
                <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">Bidder Session Auth</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Delivery Bus</span>
                <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">Secure Event Bus</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Status</span>
                <span className="font-bold text-emerald-700 text-[11px] mt-0.5 block">Active & Monitored</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Governance Framework</span>
                <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">MoPNG Bid Compliance Protocol</span>
              </div>
            </div>
          </div>

          {/* 5 KPI Metric Cards (Section 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Compliance Checks</span>
              <p className="text-2xl font-extrabold text-[#0F2942] mt-1">1</p>
              <span className="text-[10px] text-slate-500">Targeting PET/2026/B/00125</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending Clarifications</span>
              <p className="text-2xl font-extrabold text-amber-700 mt-1">
                {clarifications.filter(c => c.status === 'AWAITING_RESPONSE').length}
              </p>
              <span className="text-[10px] text-amber-800">Requires Vendor Response</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Documents Needing Attention</span>
              <p className="text-2xl font-extrabold text-red-700 mt-1">3</p>
              <span className="text-[10px] text-red-800">Turnover, Experience & PESO</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Expiring Documents</span>
              <p className="text-2xl font-extrabold text-red-700 mt-1">1</p>
              <span className="text-[10px] text-red-800">PESO Zone-1 (Expired 05-Aug)</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Completed Self-Audits</span>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">2</p>
              <span className="text-[10px] text-emerald-800">Archived Checklists</span>
            </div>
          </div>

          {/* Quick Actions & Recent Self-Audit Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Self-Audit Preview */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#0F2942]">Active Petroleum Procurement Self-Audit</h3>
                  <p className="text-slate-500 mt-0.5">{selectedTender.gemBidNo} — {selectedTender.title}</p>
                </div>
                <button
                  onClick={() => setActiveTab('SELF_AUDIT')}
                  className="text-blue-700 hover:text-blue-900 font-bold text-xs cursor-pointer"
                >
                  View Full Checklist ({selfAuditChecklist.length}) →
                </button>
              </div>

              <div className="space-y-2.5">
                {selfAuditChecklist.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-600">{item.note}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] whitespace-nowrap ${
                      item.statusType === 'PASS' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Quick Document Upload Box */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-4 text-xs flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#0F2942]">Pre-Submission Document Locker</h3>
                <p className="text-slate-600 leading-relaxed">
                  Upload updated compliance evidence before submitting your final bid on the GeM portal.
                </p>

                <div 
                  onClick={handleUploadNewFile}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50 hover:bg-blue-50/30 transition cursor-pointer space-y-1.5"
                >
                  <UploadCloud className="w-8 h-8 text-blue-700 mx-auto" />
                  <p className="font-bold text-slate-800">Drop PDF / CA statement here</p>
                  <p className="text-[10px] text-slate-500 font-mono">Click to attach renewal certificate</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('DOCUMENTS')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Manage 14 Bidder Documents →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: COMPLIANCE SELF-AUDIT (Section 5)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'SELF_AUDIT' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 text-xs space-y-2">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Target Procurement NIT / RFP</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-[#0F2942]">{selectedTender.title}</h2>
              <span className="font-mono text-xs text-slate-600">ID: <strong>{selectedTender.gemBidNo}</strong></span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-1">
              <span>Department: <strong>{selectedTender.department}</strong></span>
              <span>•</span>
              <span>Bid Submission Cutoff: <strong>10 August 2026, 15:00 IST</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Self-Audit Engine Active</span>
            </div>
          </div>

          {/* Checklist Table (Section 5) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Vendor Compliance Self-Audit Checklist ({selfAuditChecklist.length} Criteria)</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Pre-Flight Review</span>
            </div>

            <div className="divide-y divide-slate-200 text-xs">
              {selfAuditChecklist.map((item) => {
                const isFail = item.statusType === 'FAIL';
                const isWarn = item.statusType === 'WARN';
                return (
                  <div key={item.id} className={`p-4 space-y-2 transition ${isFail ? 'bg-red-50/20' : isWarn ? 'bg-amber-50/20' : 'hover:bg-slate-50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.statusType === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        {item.statusType === 'WARN' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                        {item.statusType === 'FAIL' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                        <span className="font-bold text-sm text-[#0F2942]">{item.title}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] self-start sm:self-center ${
                        item.statusType === 'PASS' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : item.statusType === 'FAIL'
                          ? 'bg-red-100 text-red-900 border border-red-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-700 pl-6">
                      <div>
                        <span className="text-slate-500 block">Required Evidence:</span>
                        <span className="font-semibold text-slate-900">{item.evidence}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Identified Item / Note:</span>
                        <span className="text-slate-800">{item.note}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Recommended Correction:</span>
                        <span className="font-bold text-blue-900">{item.recommendation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Seller Advisory:</strong> Resolving flagged checklist items prior to bid submission helps avoid post-bid qualification delays and formal GeM Clause 14(c) clarification queries.
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: CLARIFICATION REQUESTS & RESPONSES (Section 11, 12, 13)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CLARIFICATIONS' && (
        <div className="space-y-6">
          
          {/* Active Request Details Card (Section 11) */}
          <div className="bg-white rounded-xl border-2 border-amber-200 shadow-gov p-6 space-y-5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Official GeM Clause 14(c) Clarification Notice
                </span>
                <h2 className="text-base font-bold text-[#0F2942]">
                  Clarification Request: {targetClarification.id}
                </h2>
              </div>
              <span className={`px-2.5 py-1 rounded font-bold text-[11px] ${
                responseSubmitted 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {responseSubmitted ? '✓ RESPONSE SUBMITTED — AWAITING REVIEW' : 'AWAITING VENDOR RESPONSE'}
              </span>
            </div>

            {/* Structured Clarification Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Tender:</span>
                <span className="font-bold text-[#0F2942] block mt-0.5">{targetClarification.tenderId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Bid ID:</span>
                <span className="font-mono font-bold text-blue-900 block mt-0.5">{selectedBidder.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Clarification Reference:</span>
                <span className="font-mono font-bold text-amber-900 block mt-0.5">{targetClarification.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Response Deadline:</span>
                <span className="font-bold text-blue-900 block mt-0.5">{targetClarification.responseDeadline}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Issue:</span>
                <span className="font-bold text-red-700 block mt-0.5">{targetClarification.issueCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Tender Requirement:</span>
                <span className="font-bold text-slate-900 block mt-0.5">{targetClarification.tenderRequirement || '≥ ₹10 Cr'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Bidder Declaration:</span>
                <span className="font-bold text-[#0F2942] block mt-0.5">{targetClarification.bidderClaim}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-semibold">Reference Evidence:</span>
                <span className="font-bold text-red-700 block mt-0.5">{targetClarification.referenceEvidence}</span>
              </div>
            </div>

            {/* Officer Request Text Box */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
              <span className="font-bold text-blue-950 text-xs block flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Officer Clarification Request & Inquiry (PO-1042):</span>
              </span>
              <p className="text-slate-900 text-xs leading-relaxed italic font-medium bg-white p-3 rounded-lg border border-blue-100">
                "{targetClarification.officerQuery}"
              </p>
              {targetClarification.officerRemarks && (
                <p className="text-[11px] text-blue-900 font-medium pt-1">
                  <strong>Officer Instructions:</strong> {targetClarification.officerRemarks}
                </p>
              )}
            </div>

            {/* ── Evidence Shared by Officer (Strictly Only Shared Items) ── */}
            <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-xs text-[#0F2942]">Evidence Shared by Officer</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {targetClarification.sharedEvidence?.filter(e => e.selected).length || 1} Document(s) Disclosed
                </span>
              </div>

              <p className="text-[11px] text-slate-600">
                The Procurement Officer has explicitly attached the following reference records for your review and explanation:
              </p>

              <div className="space-y-2">
                {(targetClarification.sharedEvidence?.filter(e => e.selected) || [
                  {
                    id: 'SEV-01',
                    title: 'MCA21 Form AOC-4 Financial Filing (FY 2024-25)',
                    sourceRegistry: 'MCA21 / Ministry of Corporate Affairs',
                    documentRef: 'SRN-AOC4-2025-99214',
                    type: 'REGISTRY_RECORD',
                    date: '30-Oct-2025',
                    excerpt: 'Line 19 Form AOC-4: Standalone Revenue from Operations ₹8,70,00,000 for CIN U72900KA2018PTC112345.',
                    checksum: 'sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
                    size: '1.8 MB',
                    selected: true
                  }
                ]).map((item) => (
                  <div key={item.id} className="p-3.5 bg-white rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                        <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                        <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                          {item.sourceRegistry}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-700 pl-6">"{item.excerpt}"</p>
                      <p className="text-[10px] text-slate-400 pl-6">Ref: {item.documentRef} • Filing Date: {item.date}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setPreviewingSharedEvidence(item)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold rounded text-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Shared Evidence</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Response Form or Submitted State ── */}
            {responseSubmitted ? (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Response Submitted — Awaiting Officer Review</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded font-bold font-mono text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300">
                    AWAITING OFFICER REVIEW
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-900">
                  <div>
                    <span className="text-slate-600 block">Clarification ID:</span>
                    <span className="font-mono font-bold text-[#0F2942]">{targetClarification.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Status:</span>
                    <span className="font-bold text-emerald-800">Awaiting Officer Review</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Uploaded Evidence:</span>
                    <span className="font-bold">{uploadedClarDocs.length} Supporting Files Attached</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px]">Your Submitted Explanation:</span>
                  <p className="text-slate-900 italic font-medium leading-relaxed">"{vendorExplanation}"</p>
                </div>

                <div>
                  <span className="font-bold text-emerald-950 block text-[11px] mb-1.5">Submitted Supporting Files:</span>
                  <div className="space-y-1.5">
                    {uploadedClarDocs.map((doc) => (
                      <div key={doc.id} className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <div>
                            <span className="font-bold text-slate-800">{doc.name}</span>
                            <span className="text-slate-500 font-mono text-[10px] block">Size: {doc.size} • Checksum: {doc.checksum.slice(0, 24)}...</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold text-[10px]">
                          ✓ TRANSMITTED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-lg border border-emerald-200 text-xs text-slate-700 flex items-center justify-between">
                  <p className="text-[11px] text-slate-600 font-mono">
                    ✓ Transmitted securely to Procurement Officer PO-1042 for AI re-extraction & adjudication.
                  </p>
                  <button
                    type="button"
                    onClick={() => setResponseSubmitted(false)}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                  >
                    Edit / Re-submit Response
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitClarification} className="space-y-5 pt-3 border-t border-slate-100">
                
                {/* 1. Enter Explanation */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block text-xs">
                    1. Enter Your Explanatory Statement <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={vendorExplanation}
                    onChange={(e) => setVendorExplanation(e.target.value)}
                    rows={4}
                    required
                    className="w-full p-3.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-700 text-slate-900 leading-relaxed font-sans"
                    placeholder="Provide a detailed explanation addressing the reference evidence and discrepancy..."
                  />
                </div>

                {/* 2. Upload Supporting Evidence with Remove Option */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-slate-800 block text-xs">
                        2. Upload Supporting Evidence Documents (Audited Financials / CA Reconciliation / UDIN) <span className="text-red-600">*</span>
                      </label>
                      <span className="text-[11px] text-slate-500">Attach documents verifying your claim against the tender requirement.</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleUploadNewFile}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-blue-700" />
                      <span>+ Attach Another Document</span>
                    </button>
                  </div>

                  {/* List of Attached Documents with Remove Button */}
                  <div className="space-y-2">
                    {uploadedClarDocs.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-700 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Size: {doc.size} • Uploaded: {doc.uploadedAt} • Checksum: {doc.checksum.slice(0, 20)}...
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            READY TO SUBMIT
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedDoc(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Remove attached file before submission"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {uploadedClarDocs.length === 0 && (
                      <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-500 text-xs">
                        No files attached. Click "+ Attach Another Document" to upload supporting evidence.
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => alert('Draft response saved locally.')}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    Save Draft
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Clarification Response</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      )}

      {/* ── Shared Evidence Preview Modal for Vendor ── */}
      {previewingSharedEvidence && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4 text-slate-900 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <h3 className="font-bold text-sm text-[#0F2942]">Shared Reference Evidence Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingSharedEvidence(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-blue-900 block">{previewingSharedEvidence.title}</span>
              <p><strong>Source Authority:</strong> {previewingSharedEvidence.sourceRegistry}</p>
              <p><strong>Document Ref:</strong> {previewingSharedEvidence.documentRef}</p>
              <p><strong>Official Date:</strong> {previewingSharedEvidence.date}</p>
              {previewingSharedEvidence.size && <p><strong>Size:</strong> {previewingSharedEvidence.size}</p>}
              {previewingSharedEvidence.checksum && (
                <p><strong>SHA-256 Checksum:</strong> <span className="font-mono text-[10px] text-slate-600 block truncate">{previewingSharedEvidence.checksum}</span></p>
              )}
            </div>

            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-1">
              <span className="font-bold text-[11px] text-amber-950 block">Official Record Excerpt (Disclosed by Officer):</span>
              <p className="font-mono text-slate-800 text-[11px] leading-relaxed bg-white p-2.5 rounded border border-amber-200">
                "{previewingSharedEvidence.excerpt}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500">Government reference record</span>
              <button
                type="button"
                onClick={() => setPreviewingSharedEvidence(null)}
                className="px-4 py-1.5 bg-[#0F2942] text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: DOCUMENT SELF-AUDIT & REPLACEMENT (Section 6)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DOCUMENTS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Uploaded Bidder Documents ({documents.length} Files)</span>
              </div>
              <button
                onClick={handleUploadNewFile}
                className="px-3 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New Document</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3.5">Document Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Size & Pages</th>
                    <th className="p-3.5">Self-Audit Extraction</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 max-w-xs">
                        <p className="font-bold text-[#0F2942] truncate">{doc.name}</p>
                        <span className="font-mono text-[10px] text-slate-500">{doc.checksum.slice(0, 20)}...</span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-700">{doc.type}</td>
                      <td className="p-3.5 text-slate-600">{doc.size} • {doc.pageCount} pgs</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ EXTRACTED ({doc.extractionConfidence || 96}%)
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => alert(`Inspecting document: ${doc.name}`)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => alert(`Select file to replace ${doc.name}`)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-xs transition cursor-pointer"
                          >
                            Replace
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 5: NOTIFICATIONS (Section 10 & 18)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-[#0F2942]">Vendor In-App & Email Notifications</h3>
              <span className="text-[10px] text-slate-500 font-mono">Prototype Delivery System</span>
            </div>

            <div className="space-y-3">
              {notifications.filter(n => n.recipientRole === 'VENDOR').map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-xl border space-y-1.5 transition ${
                    n.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0F2942] flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-blue-700" />
                      {n.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{n.timestamp}</span>
                  </div>

                  <p className="text-slate-800 leading-relaxed font-medium">{n.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>Channels:</span>
                      <span className="font-semibold text-blue-800 font-mono">IN_APP • DASHBOARD • SIMULATED EMAIL</span>
                    </div>

                    {!n.read && (
                      <button
                        onClick={() => markNotificationAsRead(n.id)}
                        className="text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 6: PROFILE & GEM SCOPE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Corporate Registration Credentials</span>
            <h2 className="text-base font-bold text-[#0F2942]">{selectedBidder.name}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block">Vendor ID:</span>
              <span className="font-mono font-bold text-blue-900">{selectedBidder.id} (VEN-PET-001)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Corporate PAN:</span>
              <span className="font-mono font-bold text-slate-900">{selectedBidder.pan}</span>
            </div>
            <div>
              <span className="text-slate-500 block">GSTIN:</span>
              <span className="font-mono font-bold text-slate-900">{selectedBidder.gstin}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Udyam Registration:</span>
              <span className="font-mono font-bold text-slate-900">{selectedBidder.udyamNo}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-l-4 border-[#0F2942] rounded-r-lg text-slate-700 leading-relaxed">
            <strong>GeM Public Procurement Policy:</strong> Official bid participation, seller registration, reverse auctions, and contracts are legally governed by the official Government e-Marketplace (GeM) portal. e-BID PRAMAAN provides compliance intelligence and clarification support.
          </div>
        </div>
      )}

    </div>
  );
};
