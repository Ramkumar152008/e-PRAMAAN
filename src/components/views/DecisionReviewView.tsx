import React, { useState } from 'react';
import { 
  Gavel, 
  FileText, 
  Download, 
  Printer, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Code,
  Scale,
  Building2,
  Lock,
  ArrowRight,
  HelpCircle,
  Clock,
  Search,
  Filter,
  Eye,
  X,
  Sparkles,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DecisionAction } from '../../types';

interface GrievanceRecord {
  id: string;
  tenderId: string;
  tenderingParty: string;
  type: 'NIT_RELATED' | 'TENDER_PROCESS';
  typeLabel: string;
  subject: string;
  submittedOn: string;
  deadlineWindow: string;
  isWithinWindow: boolean;
  status: 'UNDER_COMMITTEE_REVIEW' | 'DISPOSED_WITH_ADDENDUM' | 'REJECTED_TIME_BARRED';
  statusLabel: string;
  assignedCommittee: string;
  grievanceText: string;
  relevantClauses: { clause: string; title: string; excerpt: string }[];
  committeeAction: string;
}

const CPCL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'GRV-CPCL-2026-001',
    tenderId: 'C03H240087',
    tenderingParty: 'Apex Industrial Fittings LLP',
    type: 'NIT_RELATED',
    typeLabel: 'NIT-Related Grievance',
    subject: 'Query on OEM Authorization requirement for radiant furnace tubes',
    submittedOn: '18-Jun-2026 (14:30 IST)',
    deadlineWindow: 'Within 3 working days from document release (Cutoff: 18-Jun-2026 17:00 IST)',
    isWithinWindow: true,
    status: 'DISPOSED_WITH_ADDENDUM',
    statusLabel: 'Disposed with Addendum',
    assignedCommittee: 'CPCL Materials Evaluation Committee & IGRC',
    grievanceText: 'Clarification requested regarding whether Indian subsidiaries of global radiant tube manufacturers can submit corporate board authorization in lieu of individual project MAF.',
    relevantClauses: [
      {
        clause: 'Clause 2.1',
        title: 'Pre-Qualification (OEM / Authorized Agency)',
        excerpt: 'Bidder must be an OEM or OEM Authorized Agency with valid Manufacturer Authorization Form (MAF).'
      },
      {
        clause: 'Clause 6.1',
        title: 'Technical Compliance Spec MS-RAD-6IN-1F3',
        excerpt: 'Adherence to CPCL Radiant Tube specifications and QAP Stage-III inspection clearances.'
      }
    ],
    committeeAction: 'Addendum-01 issued clarifying that 100% Indian operating subsidiaries with global parent board undertaking are eligible under Clause 2.1.'
  },
  {
    id: 'GRV-CPCL-2026-002',
    tenderId: 'C03H240087',
    tenderingParty: 'Southern Piping & Boiler Spares Co.',
    type: 'TENDER_PROCESS',
    typeLabel: 'Tender-Process Grievance',
    subject: 'Representation against techno-commercial rejection under Trader criteria',
    submittedOn: '12-Aug-2026 (10:15 IST)',
    deadlineWindow: 'Submitted prior to price bid opening (Mandatory procedural requirement)',
    isWithinWindow: true,
    status: 'UNDER_COMMITTEE_REVIEW',
    statusLabel: 'Under Committee Review',
    assignedCommittee: 'Independent External Monitor (IEM) / CPCL Grievance Cell',
    grievanceText: 'Bidder contends that trader status should be admissible under MSME procurement policy without requiring direct manufacturer authorization token.',
    relevantClauses: [
      {
        clause: 'Clause 2.1',
        title: 'Mandatory Pre-Qualification',
        excerpt: 'Trader / non-manufacturer bidders without direct OEM authorization token are not eligible for critical refinery heater radiant tubes.'
      },
      {
        clause: 'Clause 5.1',
        title: 'Make in India Local Content Preference',
        excerpt: 'Class-I Local Supplier preference applies to manufacturers or authorized value-adding fabricators.'
      }
    ],
    committeeAction: 'Case placed before Independent External Monitor. Hearing scheduled prior to commercial price bid opening.'
  }
];

export const DecisionReviewView: React.FC = () => {
  const { 
    selectedBidder, 
    selectedTender, 
    recordDecision, 
    auditLogs,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DECISION' | 'REPORT' | 'AUDIT_TRAIL' | 'GRIEVANCE'>('DECISION');
  const [grievanceFilter, setGrievanceFilter] = useState<'ALL' | 'NIT_RELATED' | 'TENDER_PROCESS'>('ALL');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);

  const isReconciled = selectedBidder.verifiedTurnover >= 10 || selectedBidder.riskProfile.complianceScore >= 90;
  const complianceScore = isReconciled ? 100 : 86;

  const currentDecisionAction: DecisionAction = selectedBidder.officerDecision?.action || (isReconciled ? 'CLEARED' : 'REQUIRES_VERIFICATION');
  const [selectedAction, setSelectedAction] = useState<DecisionAction>(currentDecisionAction);
  const [remarks, setRemarks] = useState<string>(
    selectedBidder.officerDecision?.reasonRemarks || 
    (isReconciled 
      ? 'Corporate relationship undertaking and parent board resolution verified. Atlas Copco (India) Private Limited cleared as fully authorized operating subsidiary with 100% compliance for CPCL Manali delivery.' 
      : 'OEM Manufacturer Authorization Form issued by parent company Atlas Copco Airpower n.v. Belgium requires officer review of corporate subsidiary scope.')
  );
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!selectedBidder.officerDecision);

  // 3 Clear Officer Determination Options with Explanations (Section 32)
  const determinationOptions: { key: DecisionAction; label: string; desc: string }[] = [
    {
      key: 'CLEARED',
      label: 'Qualified',
      desc: "All applicable requirements are satisfied and evidence is sufficient for the officer's determination."
    },
    {
      key: 'REJECT',
      label: 'Not Qualified',
      desc: 'One or more applicable requirements are not satisfied based on verified evidence.'
    },
    {
      key: 'REQUIRES_VERIFICATION',
      label: 'Requires Further Verification',
      desc: 'Evidence is insufficient or unresolved and requires additional verification.'
    }
  ];

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Officer remarks are mandatory under public procurement rules.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    recordDecision(selectedAction, remarks);
    setShowConfirmModal(false);
    setIsSubmitted(true);
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportTitle: 'CPCL Procurement Forensic Bid Compliance & Evaluation Dossier',
      tenderId: selectedTender.gemBidNo,
      tenderTitle: selectedTender.title,
      department: selectedTender.department,
      organization: 'Chennai Petroleum Corporation Limited (CPCL)',
      deliveryLocation: 'CPCL Manali, Chennai',
      evaluationMethod: 'Material Code Wise L1',
      bidder: {
        id: selectedBidder.id,
        name: selectedBidder.name,
        pan: selectedBidder.pan,
        gstin: selectedBidder.gstin,
        turnoverDeclared: selectedBidder.claimedTurnover,
        turnoverVerified: selectedBidder.verifiedTurnover
      },
      evaluation: {
        score: complianceScore,
        overallRisk: isReconciled ? 'LOW' : 'MEDIUM',
        officerDetermination: selectedAction,
        officerId: 'PO-1042',
        officerRemarks: remarks,
        timestamp: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CPCL_Evaluation_Dossier_${selectedTender.gemBidNo}_${selectedBidder.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredGrievances = CPCL_GRIEVANCES.filter(g => {
    if (grievanceFilter === 'ALL') return true;
    return g.type === grievanceFilter;
  });

  return (
    <div className="space-y-5 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 28) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Chennai Petroleum Corporation Limited (CPCL) • M&C Division</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">OFFICER DECISION</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Review the verified evidence and record the authorized procurement determination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('bid-verification')}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            ← Bid Verification
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('DECISION')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'DECISION'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-blue-700" />
          <span>Officer Decision</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REPORT')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'REPORT'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          <span>Compliance Dossier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('AUDIT_TRAIL')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'AUDIT_TRAIL'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-purple-700" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('GRIEVANCE')}
          className={`pb-2.5 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'GRIEVANCE'
              ? 'border-[#0F2942] text-[#0F2942] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>Grievance Centre ({CPCL_GRIEVANCES.length})</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: OFFICER DECISION (Sections 29–35)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DECISION' && (
        <div className="space-y-4">
          
          {/* Section 29: 4 Compact Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-white rounded-md border border-slate-300 shadow-2xs">
              <span className="text-[10.5px] font-semibold text-slate-500 block">Applicable Requirements</span>
              <strong className="text-xl font-bold text-[#0F2942] mt-0.5 block">9</strong>
              <span className="text-[10px] text-slate-500 font-mono">Clauses Identified</span>
            </div>

            <div className="p-3 bg-white rounded-md border border-slate-300 shadow-2xs">
              <span className="text-[10.5px] font-semibold text-slate-500 block">Verified</span>
              <strong className="text-xl font-bold text-emerald-700 mt-0.5 block">{isReconciled ? '9 / 9' : '8 / 9'}</strong>
              <span className="text-[10px] text-emerald-700 font-semibold">{isReconciled ? '100% Satisfied' : '1 Under Clarification'}</span>
            </div>

            <div className="p-3 bg-white rounded-md border border-slate-300 shadow-2xs">
              <span className="text-[10.5px] font-semibold text-slate-500 block">Issues</span>
              <strong className={`text-xl font-bold mt-0.5 block ${isReconciled ? 'text-slate-700' : 'text-amber-700'}`}>
                {isReconciled ? '0 Pending' : '1 Pending'}
              </strong>
              <span className="text-[10px] text-slate-500">{isReconciled ? 'All Findings Resolved' : 'Review Required'}</span>
            </div>

            <div className="p-3 bg-white rounded-md border border-slate-300 shadow-2xs">
              <span className="text-[10.5px] font-semibold text-slate-500 block">Clarifications</span>
              <strong className="text-xl font-bold text-blue-900 mt-0.5 block">{isReconciled ? '1 Resolved' : '0 Resolved'}</strong>
              <span className="text-[10px] text-blue-800">{isReconciled ? 'Undertaking Accepted' : 'Inquiry Pending'}</span>
            </div>
          </div>

          {/* Section 30: DECISION SUPPORT */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-md space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-800" />
                <span className="font-bold text-xs uppercase tracking-wider text-blue-950">VERIFICATION DECISION SUPPORT</span>
              </div>
              <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-blue-100 text-blue-950 border border-blue-300">
                READY FOR OFFICER DECISION
              </span>
            </div>

            <p className="text-xs font-semibold text-blue-950">
              "All applicable evidence has been verified."
            </p>

            {/* Supporting Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bidder documents verified</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Government / reference evidence checked</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Valid on bid cutoff date</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tender-specific requirements met</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Clarifications resolved</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>0 outstanding issues</span>
              </div>
            </div>

            {/* Mandatory Governance Disclaimer */}
            <p className="text-[10.5px] text-slate-600 italic pt-1 border-t border-blue-200">
              Verification provides decision support; final procurement determination remains with the authorized officer.
            </p>
          </div>

          {/* Section 31: VERIFICATION SUMMARY TABLE */}
          <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-xs text-[#0F2942] uppercase tracking-wider">VERIFICATION SUMMARY</span>
              <div className="flex items-center gap-3 text-xs text-blue-900 font-bold">
                <button 
                  type="button" 
                  onClick={() => setActiveView('bid-verification')}
                  className="hover:underline cursor-pointer"
                >
                  VIEW COMPLIANCE MATRIX →
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('REPORT')}
                  className="hover:underline cursor-pointer"
                >
                  VIEW EVIDENCE DOSSIER →
                </button>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700 font-medium">Bidder Documents</td>
                  <td className="p-3 font-bold text-emerald-700 text-right">✓ Verified</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700 font-medium">Government / Reference Evidence</td>
                  <td className="p-3 font-bold text-emerald-700 text-right">✓ Matched</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700 font-medium">Bid-Date Validity</td>
                  <td className="p-3 font-bold text-emerald-700 text-right">✓ Valid</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700 font-medium">Tender Requirements</td>
                  <td className="p-3 font-bold text-emerald-700 text-right">✓ Satisfied</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700 font-medium">Clarifications</td>
                  <td className="p-3 font-bold text-emerald-700 text-right">✓ Resolved</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700 font-medium">Outstanding Issues</td>
                  <td className="p-3 font-bold text-slate-800 text-right">0 Pending</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 32 & 33: OFFICER DETERMINATION & REMARKS */}
          <div className="bg-white rounded-md border border-slate-300 shadow-2xs p-5 space-y-4 text-xs">
            
            <div className="border-b border-slate-200 pb-2.5">
              <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider">OFFICER DETERMINATION</h2>
              <p className="text-slate-500 text-xs mt-0.5">Select the statutory qualification outcome and enter required remarks.</p>
            </div>

            <form onSubmit={handlePreSubmit} className="space-y-4">
              
              {/* 3 Radio Options */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block text-xs">
                  Determination: <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {determinationOptions.map((opt) => (
                    <label
                      key={opt.key}
                      onClick={() => setSelectedAction(opt.key)}
                      className={`p-3 rounded-md border cursor-pointer transition flex flex-col justify-between space-y-1.5 select-none ${
                        selectedAction === opt.key
                          ? 'border-[#0F2942] bg-blue-50/40 shadow-2xs ring-1 ring-[#0F2942]'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="determinationChoice"
                          checked={selectedAction === opt.key}
                          onChange={() => setSelectedAction(opt.key)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <strong className="text-xs font-bold text-[#0F2942]">{opt.label}</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Officer Remarks (Section 33) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="remarks-text" className="font-bold text-slate-800 block text-xs">
                    Officer Remarks <span className="text-red-600">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {remarks.length} characters
                  </span>
                </div>
                <textarea
                  id="remarks-text"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Record the basis for your determination, including relevant evidence or compliance findings."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-700 bg-white placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Digital Signing Meta */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                <div>
                  <span className="block text-slate-400">Authorized Officer:</span>
                  <strong className="text-slate-800">Rajeshwar Rao (PO-1042)</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Designation:</span>
                  <strong className="text-slate-800">Senior Procurement Officer, CPCL</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Timestamp:</span>
                  <strong className="text-slate-800 font-mono">{new Date().toLocaleString()}</strong>
                </div>
              </div>

              {/* Single Primary CTA */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  <em>"AI provides decision support. Final procurement decision remains with the authorized officer."</em>
                </p>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Gavel className="w-4 h-4" />
                  <span>RECORD OFFICER DECISION</span>
                </button>
              </div>

            </form>
          </div>

          {/* Section 35: After Decision Recorded Card */}
          {isSubmitted && (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <div>
                  <strong className="text-emerald-950 font-bold text-sm block">DECISION RECORDED</strong>
                  <span className="text-emerald-900 text-xs">✓ Officer determination recorded in tamper-evident log.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/80 p-3 rounded-lg border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Reference ID:</span>
                  <strong className="font-mono text-slate-800">DEC-CPCL-2026-001</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Tender ID:</span>
                  <strong className="font-mono text-slate-800">{selectedTender.gemBidNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Determination:</span>
                  <strong className="text-emerald-800 font-bold">{selectedAction.replace(/_/g, ' ')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Audit Hash:</span>
                  <strong className="font-mono text-slate-800 text-[10px]">sha256:4a8c91d...</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('REPORT')}
                  className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW COMPLIANCE DOSSIER</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('AUDIT_TRAIL')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-lg text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>VIEW AUDIT TRAIL</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: COMPLIANCE DOSSIER (Section 36)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'REPORT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-6 text-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                Official Compliance Dossier
              </span>
              <h2 className="text-xl font-bold text-[#0F2942]">COMPLIANCE DOSSIER</h2>
              <p className="text-slate-500 text-xs">Chennai Petroleum Corporation Limited (CPCL) • Tender No. {selectedTender.gemBidNo}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadJSON}
                className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>GENERATE REPORT</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 1. Tender & Bidder Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold text-xs uppercase block border-b border-slate-200 pb-1">
                  1. Tender Information
                </strong>
                <p><strong>Tender No:</strong> <span className="font-mono">{selectedTender.gemBidNo}</span></p>
                <p><strong>Description:</strong> {selectedTender.title}</p>
                <p><strong>Department:</strong> {selectedTender.department}</p>
                <p><strong>Location:</strong> CPCL Manali, Chennai</p>
                <p><strong>Evaluation Method:</strong> Material Code Wise L1</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold text-xs uppercase block border-b border-slate-200 pb-1">
                  2. Bidder Information
                </strong>
                <p><strong>Legal Entity:</strong> {selectedBidder.name}</p>
                <p><strong>CIN:</strong> <span className="font-mono">{selectedBidder.cin}</span></p>
                <p><strong>PAN / GSTIN:</strong> <span className="font-mono">{selectedBidder.pan} / {selectedBidder.gstin}</span></p>
                <p><strong>Declared Turnover:</strong> ₹{selectedBidder.claimedTurnover} Crore</p>
                <p><strong>Verified Turnover:</strong> ₹{selectedBidder.verifiedTurnover} Crore</p>
              </div>
            </div>

            {/* 2. Applicable Requirements & Submitted Evidence */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold text-xs uppercase block border-b border-slate-200 pb-1">
                3. Applicable Requirements & Evidence Status
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span>OEM / MAF Authorization:</span>
                  <strong className="text-emerald-700 block mt-0.5">✓ Verified (Board Undertaking)</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span>ISO 9001:2015 Quality:</span>
                  <strong className="text-emerald-700 block mt-0.5">✓ Valid on Bid Date (LRQA)</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span>EMD BG (₹3.70 Lakh):</span>
                  <strong className="text-emerald-700 block mt-0.5">✓ Confirmed (SBI)</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span>GSTIN / PAN Registration:</span>
                  <strong className="text-emerald-700 block mt-0.5">✓ Active Regular</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span>Make in India Local Content:</span>
                  <strong className="text-emerald-700 block mt-0.5">✓ 58.4% Class-I Verified</strong>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span>Technical Spec MS-RAD-6IN:</span>
                  <strong className="text-emerald-700 block mt-0.5">✓ Stage-III QAP Compliant</strong>
                </div>
              </div>
            </div>

            {/* 3. Officer Determination & Audit Reference */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 font-bold text-xs uppercase block border-b border-emerald-200 pb-1">
                4. Officer Determination & Record
              </strong>
              <p><strong>Determination:</strong> {selectedAction.replace(/_/g, ' ')}</p>
              <p><strong>Officer Remarks:</strong> {remarks}</p>
              <p><strong>Signatory:</strong> Rajeshwar Rao, Senior Procurement Officer (PO-1042)</p>
              <p className="font-mono text-[10px] text-slate-500">
                Audit Checksum: sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: AUDIT TRAIL (Section 37)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden text-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F2942]">IMMUTABLE AUDIT TRAIL</h3>
              <p className="text-slate-500 text-[11px]">Cryptographic audit trail tracking all evaluation events and officer determinations.</p>
            </div>
            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Evidence Ref</th>
                  <th className="p-3">Reference / Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="p-3 text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 text-slate-800 font-sans font-semibold">{log.actor} ({log.actorRole})</td>
                    <td className="p-3 text-[#0F2942] font-sans font-bold">{log.action}</td>
                    <td className="p-3 text-blue-900">{log.evidenceRef || log.targetRef || 'System Dossier'}</td>
                    <td className="p-3 text-slate-500 font-mono text-[10px] truncate max-w-xs">{log.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: GRIEVANCE CENTRE (Section 38)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'GRIEVANCE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5 text-xs">
          
          <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-700" />
                <h2 className="text-base font-bold text-[#0F2942]">CPCL TENDER GRIEVANCE CENTRE</h2>
              </div>
              <p className="text-slate-500 text-xs">Statutory representations submitted under CPCL Public Procurement Grievance Redressal Policy.</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setGrievanceFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  grievanceFilter === 'ALL' ? 'bg-[#0F2942] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({CPCL_GRIEVANCES.length})
              </button>
              <button
                onClick={() => setGrievanceFilter('NIT_RELATED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  grievanceFilter === 'NIT_RELATED' ? 'bg-[#0F2942] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                NIT-Related (3-Day Window)
              </button>
              <button
                onClick={() => setGrievanceFilter('TENDER_PROCESS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  grievanceFilter === 'TENDER_PROCESS' ? 'bg-[#0F2942] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tender-Process (Pre-Price-Bid)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredGrievances.map((g) => (
              <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {g.id}
                    </span>
                    <strong className="text-xs font-bold text-[#0F2942]">{g.subject}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    g.status === 'DISPOSED_WITH_ADDENDUM' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {g.statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <p><strong>Complainant:</strong> {g.tenderingParty}</p>
                  <p><strong>Type:</strong> {g.typeLabel}</p>
                  <p><strong>Submission:</strong> {g.submittedOn}</p>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <p className="font-medium">{g.grievanceText}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-blue-900 font-mono text-[10px]">
                    {g.relevantClauses.map((c, i) => (
                      <span key={i} className="bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {c.clause}: {c.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Committee: <strong>{g.assignedCommittee}</strong></span>
                  <button
                    onClick={() => setSelectedGrievance(g)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded text-xs transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── Section 34: DECISION CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-base border-b border-slate-100 pb-3">
              <Gavel className="w-5 h-5 text-blue-700" />
              <span>DECISION CONFIRMATION</span>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Tender:</span>
                <strong className="font-mono text-[#0F2942]">{selectedTender.gemBidNo}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Bidder:</span>
                <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Determination:</span>
                <strong className="text-emerald-700 font-bold">{selectedAction.replace(/_/g, ' ')}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Officer:</span>
                <span className="font-semibold text-slate-800">Rajeshwar Rao (PO-1042)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-600">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Recording this decision creates an immutable entry in the audit trail and commits the qualification determination.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition cursor-pointer"
              >
                CONFIRM OFFICER DECISION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Detail Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-xl w-full p-6 space-y-4 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0F2942] font-bold text-sm">
                <Scale className="w-5 h-5 text-blue-700" />
                <span>{selectedGrievance.id} — {selectedGrievance.typeLabel}</span>
              </div>
              <button onClick={() => setSelectedGrievance(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Subject:</span>
                <p className="font-bold text-[#0F2942] text-xs">{selectedGrievance.subject}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Grievance Submission Text:</span>
                <p className="text-slate-800 leading-relaxed">{selectedGrievance.grievanceText}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Relevant CPCL Tender Clauses:</span>
                {selectedGrievance.relevantClauses.map((c, i) => (
                  <div key={i} className="p-2.5 bg-blue-50/50 rounded border border-blue-200">
                    <strong className="text-blue-950 font-bold text-xs">{c.clause}: {c.title}</strong>
                    <p className="text-[11px] text-blue-900 mt-0.5">{c.excerpt}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                <span className="text-emerald-950 block text-[10px] font-bold uppercase">Committee Adjudication & Action:</span>
                <p className="text-emerald-900 font-medium">{selectedGrievance.committeeAction}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-2 bg-[#0F2942] text-white font-bold rounded-lg text-xs cursor-pointer"
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
