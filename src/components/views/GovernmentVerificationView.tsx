import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database,
  HelpCircle,
  X,
  ChevronDown,
  ShieldCheck,
  Scale,
  Send,
  UserCheck,
  Code,
  ExternalLink,
  GitCommit
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  queryGovernmentVerificationGateway, 
  SourceVerificationRecord,
  VerificationResultStatus 
} from '../../services/verificationGateway';

export const GovernmentVerificationView: React.FC = () => {
  const { 
    selectedDepartment,
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const [activeSourceModal, setActiveSourceModal] = useState<SourceVerificationRecord | null>(null);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [verifyProgressStep, setVerifyProgressStep] = useState(0);
  const [verifiedSourcesList, setVerifiedSourcesList] = useState<string[]>([]);
  const [hasCompletedVerification, setHasCompletedVerification] = useState(true);
  const [showStructuredPayload, setShowStructuredPayload] = useState(false);
  const [activeChainStep, setActiveChainStep] = useState<number | null>(null);
  const [reviewedSources, setReviewedSources] = useState<{ [key: string]: boolean }>({});

  const { sources } = queryGovernmentVerificationGateway(selectedBidder);

  const progressSequence = [
    'Udyam / MSME',
    'GSTN',
    'PAN / Income Tax',
    'MCA21',
    'EPFO Labour Registry',
    'ESIC Social Security',
    'Startup India Registry',
    'NSIC Single Point Registration',
    'OEM Authorization Form',
    'DigiLocker Document Exchange',
    'Make in India Local Content Declaration',
    'BIS / DPIIT Quality Accreditation',
    'Blacklisting & Debarment Database'
  ];

  const handleVerifyAll = () => {
    setIsVerifyingAll(true);
    setVerifyProgressStep(0);
    setVerifiedSourcesList([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < progressSequence.length) {
        setVerifyProgressStep(step);
        setVerifiedSourcesList(prev => [...prev, progressSequence[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsVerifyingAll(false);
        setHasCompletedVerification(true);
      }
    }, 150);
  };

  const getStatusBadge = (res: VerificationResultStatus | string) => {
    switch (res) {
      case 'VERIFIED':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED</span>
          </span>
        );
      case 'CLEAR':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-teal-100 text-teal-800 border border-teal-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>CLEAR</span>
          </span>
        );
      case 'POTENTIAL ISSUE':
      case 'POTENTIAL COMPLIANCE ISSUE':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>POTENTIAL ISSUE</span>
          </span>
        );
      case 'REQUIRES REVIEW':
      case 'REQUIRES OFFICER VERIFICATION':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-gem-blue" />
            <span>REQUIRES REVIEW</span>
          </span>
        );
      case 'UNAVAILABLE':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-300 inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>UNAVAILABLE (MANUAL VERIFY)</span>
          </span>
        );
      case 'STALE':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>STALE RECORD</span>
          </span>
        );
      case 'NOT APPLICABLE':
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1">
            <span>NOT APPLICABLE</span>
          </span>
        );
      case 'MISSING':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-red-100 text-red-900 border border-red-300 inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-700" />
            <span>MISSING</span>
          </span>
        );
    }
  };

  const getSourceInspectionDetails = (src: SourceVerificationRecord) => {
    switch (src.sourceName) {
      case 'MCA21':
        return {
          sourceTitle: 'MCA21 / Company Financial Records',
          refId: 'MCA-AOC4-99214',
          verificationResult: 'REQUIRES OFFICER VERIFICATION',
          confidence: 'HIGH',
          confidenceReason: "Reference record matched the bidder's CIN (U72900KA2018PTC112345).",
          company: selectedBidder.name,
          cin: selectedBidder.cin || 'U72900KA2018PTC112345',
          period: 'Financial Years 2023–24, 2024–25, 2025–26 (Average)',
          findingTitle: 'Turnover Mismatch',
          bidderDeclaration: `₹${selectedBidder.claimedTurnover} Crore (Average)`,
          referenceRecord: `₹${selectedBidder.verifiedTurnover} Crore (Form AOC-4)`,
          tenderRequirement: 'Minimum ₹10 Crore',
          comparisonResult: 'POTENTIAL COMPLIANCE ISSUE',
          explanation: 'The turnover declared in the bid (₹12 Cr) is higher than the turnover available in the reference financial record (₹8.7 Cr). The verified value is below the tender minimum requirement of ₹10 Cr.',
          whyMatters: 'The tender requires a minimum turnover of ₹10 Crore under GFR eligibility criteria. The available reference evidence indicates ₹8.7 Crore (-27.5% deficit). Therefore, the bidder financial eligibility requires officer verification.',
          recommendedAction: "Review the bidder's audited financial statements and obtain CA reconciliation clarification before making a procurement decision.",
          chain: [
            { label: 'Tender Requirement', value: 'Turnover ≥ ₹10 Cr (Clause 4.2)' },
            { label: 'Bidder Declaration', value: 'Claimed ₹12 Cr (CA Certificate)' },
            { label: 'Reference Record', value: 'MCA21 Form AOC-4 shows ₹8.7 Cr' },
            { label: 'AI Comparison', value: '-₹3.3 Cr (-27.5% variance deficit)' },
            { label: 'Finding', value: 'Potential Turnover Eligibility Shortfall' },
            { label: 'Officer Action', value: 'Issue Clarification / Forward to CA Reviewer' }
          ],
          technical: {
            token: 'TKN-MCA21-SRN-AOC4-99214',
            authority: 'Ministry of Corporate Affairs (MCA21 Registry)',
            timestamp: '30-Aug-2026, 12:44:10 IST',
            datasetId: 'REF-MCA-2026-AOC4-V2',
            registryVersion: 'v4.2-AOC4-REVENUE',
            rawPayload: {
              cin: 'U72900KA2018PTC112345',
              company_name: selectedBidder.name,
              filing_type: 'Form AOC-4',
              srn: 'SRN-AOC4-2025-99214',
              filing_date: '30-Oct-2025',
              reported_revenue_fy24: '₹8.10 Cr',
              reported_revenue_fy25: '₹8.90 Cr',
              reported_revenue_fy26: '₹9.10 Cr',
              three_year_average: '₹8.70 Cr',
              discrepancy_vs_bid: '-₹3.30 Cr',
              status: 'FLAGGED_FOR_OFFICER_REVIEW'
            }
          }
        };

      case 'BIS / DPIIT':
        return {
          sourceTitle: 'BIS / DPIIT / National Quality Standards Registry',
          refId: 'BIS-ISO-EXP-0508',
          verificationResult: 'REQUIRES OFFICER VERIFICATION',
          confidence: 'HIGH',
          confidenceReason: "Accreditation ledger matched Certificate #TUV-IN-2023-88912.",
          company: selectedBidder.name,
          cin: selectedBidder.cin || 'U72900KA2018PTC112345',
          period: 'Certificate Validity Window vs Bid Cutoff (10-Aug-2026)',
          findingTitle: 'Expired Quality Management Certificate',
          bidderDeclaration: 'ISO 9001:2015 Submitted',
          referenceRecord: 'Valid Until: 05-Aug-2026 (Expired)',
          tenderRequirement: 'Active Validity on Bid Submission Date (10-Aug-2026)',
          comparisonResult: 'POTENTIAL COMPLIANCE ISSUE',
          explanation: 'The submitted ISO 9001:2015 certificate expired on 05-Aug-2026, which is 5 days prior to the tender bid submission cutoff timestamp (10-Aug-2026).',
          whyMatters: 'Tender Clause 7.1 establishes that all mandatory quality certificates must be legally active on the bid submission date. Accepting an expired certification exposes the tender to post-award challenge.',
          recommendedAction: 'Request proof of ISO renewal certificate or formal registrar renewal endorsement issued on or before 10-Aug-2026.',
          chain: [
            { label: 'Tender Requirement', value: 'ISO 9001 Active on 10-Aug-2026 (Clause 7.1)' },
            { label: 'Bidder Declaration', value: 'Submitted Certificate #TUV-IN-2023-88912' },
            { label: 'Reference Record', value: 'Accreditation ledger confirms expiry on 05-Aug-2026' },
            { label: 'AI Comparison', value: 'Expired 5 days before submission cutoff' },
            { label: 'Finding', value: 'Temporal Validity Deficit' },
            { label: 'Officer Action', value: 'Request Renewal Proof / Technical Review' }
          ],
          technical: {
            token: 'TKN-BIS-NABCB-ISO-0508',
            authority: 'National Quality Standards Accreditation Ledger (NABCB / BIS)',
            timestamp: '30-Aug-2026, 12:44:15 IST',
            datasetId: 'REF-BIS-ISO-2026-V1',
            registryVersion: 'v2.1-ISO-AUDIT',
            rawPayload: {
              certificate_no: 'TUV-IN-2023-88912',
              standard: 'ISO 9001:2015',
              scope: 'Design, Supply and Maintenance of IT Hardware',
              issue_date: '06-Aug-2023',
              expiry_date: '05-Aug-2026',
              tender_bid_cutoff: '10-Aug-2026',
              temporal_delta_days: -5,
              status: 'EXPIRED_BEFORE_BID_SUBMISSION'
            }
          }
        };

      case 'Make in India / Local Content':
        return {
          sourceTitle: 'DPIIT / Make in India Self-Declaration Database',
          refId: 'MII-LOCAL-624',
          verificationResult: 'REQUIRES REVIEW',
          confidence: 'HIGH',
          confidenceReason: "Matched self-declaration document executed on 09-Aug-2026.",
          company: selectedBidder.name,
          cin: selectedBidder.cin || 'U72900KA2018PTC112345',
          period: 'Tender Execution Schedule (FY 2026–27)',
          findingTitle: 'Local Content Cost Breakdown Audit',
          bidderDeclaration: '62.4% Local Content (Class-I Local Supplier)',
          referenceRecord: 'Self-Declaration Submitted (Cost Audit Pending)',
          tenderRequirement: 'Class-I Local Supplier ≥ 50% for Purchase Preference',
          comparisonResult: 'REQUIRES REVIEW',
          explanation: 'Bidder declared 62.4% local content to claim Class-I purchase preference. Supporting calculation annexure requires officer review of excluded import items.',
          whyMatters: 'Under Public Procurement (Preference to Make in India) Order, eligibility for Class-I preference requires substantiated cost schedules excluding customs and imported components.',
          recommendedAction: 'Verify cost audit breakdown and ensure imported hardware subsystems are correctly accounted for.',
          chain: [
            { label: 'Tender Requirement', value: 'Class-I Local Supplier ≥ 50% (Clause 9.1)' },
            { label: 'Bidder Declaration', value: 'Claimed 62.4% Local Content' },
            { label: 'Reference Record', value: 'Self-declaration document verified on portal' },
            { label: 'AI Comparison', value: 'Claim meets threshold (>50%), cost breakdown pending' },
            { label: 'Finding', value: 'Preference Claim Requires Audit' },
            { label: 'Officer Action', value: 'Review Detailed Cost Schedule' }
          ],
          technical: {
            token: 'TKN-MII-DPIIT-2026-624',
            authority: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
            timestamp: '30-Aug-2026, 12:44:18 IST',
            datasetId: 'REF-DPIIT-MII-2026',
            registryVersion: 'v3.0-LOCAL-CONTENT',
            rawPayload: {
              bidder_pan: selectedBidder.pan,
              declared_percentage: '62.4%',
              classification_claimed: 'Class-I Local Supplier',
              location_of_value_addition: 'Bengaluru, Karnataka',
              auditor_certificate_attached: true,
              status: 'REQUIRES_OFFICER_COST_AUDIT'
            }
          }
        };

      case 'Blacklisting / Debarment':
        return {
          sourceTitle: 'Central Public Procurement Portal / Debarment Database',
          refId: 'DEBAR-CLEAR-001',
          verificationResult: 'CLEAR',
          confidence: 'HIGH',
          confidenceReason: "Matched corporate PAN and CIN against central and state debarment registers.",
          company: selectedBidder.name,
          cin: selectedBidder.cin || 'U72900KA2018PTC112345',
          period: 'All Active Debarment Orders (2020–2026)',
          findingTitle: 'No Adverse Debarment Records Found',
          bidderDeclaration: 'Non-Debarment Affidavit Submitted',
          referenceRecord: 'Zero Adverse Records Across Central/State PSUs',
          tenderRequirement: 'No active debarment by any Government department / GeM',
          comparisonResult: 'CLEAR',
          explanation: 'No record of blacklisting, debarment, holiday listing, or active de-registration was found for this bidder across any public procurement portal.',
          whyMatters: 'Tender Clause 8.4 mandates clean regulatory standing. The entity is legally clear to participate.',
          recommendedAction: 'No adverse action required. Proceed with statutory clearance.',
          chain: [
            { label: 'Tender Requirement', value: 'Clean Non-Debarment Record (Clause 8.4)' },
            { label: 'Bidder Declaration', value: 'Submitted Non-Debarment Affidavit' },
            { label: 'Reference Record', value: 'CPPP & GeM Debarment Registry Match' },
            { label: 'AI Comparison', value: 'Zero adverse matching entries' },
            { label: 'Finding', value: 'Entity Clear for Evaluation' },
            { label: 'Officer Action', value: 'Mark Verified' }
          ],
          technical: {
            token: 'TKN-CPPP-DEBAR-CLEAR-001',
            authority: 'Central Public Procurement Portal (CPPP) & GeM Repository',
            timestamp: '30-Aug-2026, 12:44:20 IST',
            datasetId: 'REF-CPPP-DEBAR-2026-AUG',
            registryVersion: 'v5.0-DEBAR-CHECK',
            rawPayload: {
              pan: selectedBidder.pan,
              cin: selectedBidder.cin,
              entity_name: selectedBidder.name,
              matching_debarment_records: 0,
              active_sanctions: false,
              status: 'CLEAR_NO_ADVERSE_RECORDS'
            }
          }
        };

      case 'GSTN':
        return {
          sourceTitle: 'Goods and Services Tax Network (GSTN)',
          refId: 'GSTN-29-REG-001',
          verificationResult: 'VERIFIED',
          confidence: 'HIGH',
          confidenceReason: "Matched GSTIN 29ABCDE1234F1Z5 with regular GSTR-3B filings.",
          company: selectedBidder.name,
          cin: selectedBidder.cin || 'U72900KA2018PTC112345',
          period: 'Last 36 Months Filing History (Up to July 2026)',
          findingTitle: 'Active Regular Taxpayer Status',
          bidderDeclaration: 'GSTIN: 29ABCDE1234F1Z5 (Form REG-06)',
          referenceRecord: 'Active Taxpayer (36/36 Timely Returns Filed)',
          tenderRequirement: 'Active GST registration in state of supply with compliant filings',
          comparisonResult: 'VERIFIED',
          explanation: 'GSTIN is active with zero default notices. 36 consecutive monthly returns filed up to July 2026 prior to tender submission.',
          whyMatters: 'Statutory tax compliance is satisfied under General Financial Rules.',
          recommendedAction: 'No adverse action required. Statutory requirement fully satisfied.',
          chain: [
            { label: 'Tender Requirement', value: 'Active GSTIN in State of Supply (Clause 6.2)' },
            { label: 'Bidder Declaration', value: 'Submitted GST Form REG-06' },
            { label: 'Reference Record', value: 'GSTN Portal confirms regular active status' },
            { label: 'AI Comparison', value: 'Complete match; zero default history' },
            { label: 'Finding', value: 'Tax Compliance Satisfied' },
            { label: 'Officer Action', value: 'Mark Verified' }
          ],
          technical: {
            token: 'TKN-GSTN-KA-29ABCDE1234F1Z5',
            authority: 'Goods and Services Tax Network (GSTN Gateway)',
            timestamp: '30-Aug-2026, 12:44:05 IST',
            datasetId: 'REF-GSTN-2026-KA',
            registryVersion: 'v2.4-GSTR3B-CHECK',
            rawPayload: {
              gstin: selectedBidder.gstin,
              legal_name: selectedBidder.name,
              registration_date: '01-Jul-2018',
              state_jurisdiction: 'Karnataka',
              returns_filed_last_12m: 12,
              status: 'ACTIVE_REGULAR_TAXPAYER'
            }
          }
        };

      default:
        return {
          sourceTitle: `${src.sourceName} Reference Verification`,
          refId: src.token,
          verificationResult: src.result,
          confidence: 'HIGH',
          confidenceReason: `Reference record matched the entity identifiers (${selectedBidder.pan}).`,
          company: selectedBidder.name,
          cin: selectedBidder.cin || 'U72900KA2018PTC112345',
          period: 'Tender Eligibility Period',
          findingTitle: `${src.sourceName} Verification Finding`,
          bidderDeclaration: src.checkedInfo,
          referenceRecord: src.evidence,
          tenderRequirement: 'Must be active, verified, and compliant with tender terms',
          comparisonResult: src.result,
          explanation: `The information provided for ${src.sourceName} was verified against reference records. Result: ${src.result}.`,
          whyMatters: 'Mandatory statutory and technical credentials must be validated against official repositories.',
          recommendedAction: src.result === 'VERIFIED' ? 'No adverse action required.' : 'Review supporting evidence before final decision.',
          chain: [
            { label: 'Tender Requirement', value: `Verification of ${src.sourceName}` },
            { label: 'Bidder Declaration', value: src.checkedInfo },
            { label: 'Reference Record', value: src.evidence },
            { label: 'AI Comparison', value: `Status: ${src.result}` },
            { label: 'Finding', value: 'Record verified in reference dataset' },
            { label: 'Officer Action', value: 'Officer confirmation recorded' }
          ],
          technical: {
            token: src.token,
            authority: src.authority,
            timestamp: src.lastChecked,
            datasetId: src.referenceDatasetName,
            registryVersion: 'v2.0-REFERENCE-GATEWAY',
            rawPayload: src.details
          }
        };
    }
  };

  const handleMarkAsReviewed = (sourceId: string) => {
    setReviewedSources(prev => ({ ...prev, [sourceId]: true }));
    setActiveSourceModal(null);
  };

  const handleRequestClarification = () => {
    setActiveSourceModal(null);
    setActiveView('clarification-center');
  };

  const handleSpecialistReview = () => {
    setActiveSourceModal(null);
    setActiveView('clarification-center');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Government & Reference Verification</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Verify bidder statutory and technical information against configured reference datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyAll}
            disabled={isVerifyingAll}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs shadow-gov transition ${
              isVerifyingAll 
                ? 'bg-slate-400 text-white cursor-not-allowed' 
                : 'bg-gem-navy hover:bg-gem-navyLight text-white active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-300 ${isVerifyingAll ? 'animate-spin' : ''}`} />
            <span>{isVerifyingAll ? 'Checking Sources...' : 'Verify All Sources'}</span>
          </button>

          <button
            onClick={() => setActiveView('document-review')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Documents</span>
          </button>
        </div>
      </div>

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Department</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedDepartment}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Tender</span>
          <span className="font-mono font-bold text-gem-navy mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bidder</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bid ID</span>
          <span className="font-mono font-bold text-gem-blue mt-0.5 block">{selectedBidder.id}</span>
        </div>
      </div>

      {/* ── Environment Configuration Notice ── */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
        <span>
          <strong>Environment Configuration:</strong> Verification sources shown are configured according to the current system environment.
        </span>
        <span className="text-[11px] text-slate-500 font-medium">
          Clear = No adverse record found • Verified = Matches registry data
        </span>
      </div>

      {/* ── Simulated Progress Sequence ── */}
      {isVerifyingAll && (
        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-2 animate-in fade-in shadow-gov">
          <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              Verifying against reference sources...
            </span>
            <span>Step {verifyProgressStep + 1} of {progressSequence.length}</span>
          </div>
          <div className="space-y-1 pt-1 text-slate-300">
            {verifiedSourcesList.map((sourceName, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">{sourceName}</span>
                <span className="text-emerald-400 font-bold">✓ Checked</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Summary Counters ── */}
      {hasCompletedVerification && !isVerifyingAll && (
        <div className="bg-white rounded-xl border border-gem-border shadow-gov p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gem-navy">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>13 Sources Checked — Overall: REVIEW REQUIRED</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Clear = No adverse record found</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-3 text-xs">
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Verified</span>
              <span className="text-xl font-bold text-emerald-700 mt-0.5 block">9</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-amber-800 font-medium block">Potential Issues</span>
              <span className="text-xl font-bold text-amber-700 mt-0.5 block">2</span>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium block">Requires Review</span>
              <span className="text-xl font-bold text-gem-blue mt-0.5 block">1</span>
            </div>
            <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-200">
              <span className="text-teal-800 font-medium block">Clear</span>
              <span className="text-xl font-bold text-teal-700 mt-0.5 block">1</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Government Verification Table ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gem-border flex items-center justify-between">
          <span className="font-bold text-sm text-gem-navy">Verification Sources ({sources.length})</span>
          <span className="text-xs text-slate-500 font-medium">Click View Result for evidence inspection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-gem-border">
                <th className="p-3.5">Source</th>
                <th className="p-3.5">What Was Checked</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gem-border">
              {sources.map((src) => {
                const isReviewed = reviewedSources[src.id];
                return (
                  <tr key={src.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-gem-navy max-w-[200px]">
                      <p className="text-sm">{src.sourceName}</p>
                      <span className="text-[10px] text-slate-500 font-normal block">{src.authority}</span>
                    </td>

                    <td className="p-3.5 text-slate-800 max-w-sm font-medium">
                      {src.checkedInfo}
                      {isReviewed && (
                        <span className="ml-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          ✓ Officer Reviewed
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {getStatusBadge(src.result)}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveSourceModal(src);
                          setShowStructuredPayload(false);
                          setActiveChainStep(null);
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-gem-navy hover:text-white text-gem-navy font-bold rounded text-xs transition border border-slate-300 hover:border-gem-navy"
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Primary Action Button ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('document-review')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition"
        >
          Back to Document Review
        </button>

        <button
          onClick={() => setActiveView('compliance-matrix')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Continue to Compliance Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── REDESIGNED OFFICER-FACING REFERENCE SOURCE INSPECTION MODAL ── */}
      {activeSourceModal && (() => {
        const d = getSourceInspectionDetails(activeSourceModal);
        const isIssue = activeSourceModal.result === 'POTENTIAL ISSUE' || activeSourceModal.result === 'REQUIRES REVIEW';

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 space-y-5 text-slate-900 text-xs animate-in fade-in max-h-[92vh] overflow-y-auto">
              
              {/* 1. Modal Top Bar: Header & Result */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gem-blue uppercase tracking-wider block">
                    REFERENCE VERIFICATION
                  </span>
                  <h2 className="text-lg font-bold text-gem-navy">{d.sourceTitle}</h2>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Reference ID: <strong>{d.refId}</strong></span>
                    <span>•</span>
                    <span className="text-slate-600 font-semibold">Evidence Confidence: <strong className="text-emerald-700">{d.confidence}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSourceModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block text-[11px]">Verification Result:</span>
                  <span className="font-bold text-sm text-gem-navy mt-0.5 block">{d.verificationResult}</span>
                </div>
                <div>{getStatusBadge(activeSourceModal.result)}</div>
              </div>

              {/* 2. WHAT WAS VERIFIED? */}
              <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block">
                  WHAT WAS VERIFIED?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 font-medium block">Company:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{d.company}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">CIN / Identifier:</span>
                    <span className="font-mono font-bold text-slate-800 mt-0.5 block">{d.cin}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Verification Scope:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{d.period}</span>
                  </div>
                </div>
              </div>

              {/* 3. VISUAL EVIDENCE COMPARISON CARD */}
              <div className={`p-4 rounded-xl border-2 space-y-3 ${
                isIssue 
                  ? 'bg-amber-50/40 border-amber-300' 
                  : 'bg-emerald-50/30 border-emerald-300'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-xs text-gem-navy uppercase tracking-wider">
                    {d.findingTitle}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isIssue ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {d.comparisonResult}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Bidder Declaration</span>
                    <span className="font-bold text-sm text-gem-navy mt-1 block">{d.bidderDeclaration}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Reference Record</span>
                    <span className={`font-bold text-sm mt-1 block ${isIssue ? 'text-red-700' : 'text-emerald-700'}`}>
                      {d.referenceRecord}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Tender Requirement</span>
                    <span className="font-bold text-sm text-slate-800 mt-1 block">{d.tenderRequirement}</span>
                  </div>
                </div>

                <p className="text-slate-800 text-xs leading-relaxed pt-1">
                  {d.explanation}
                </p>
              </div>

              {/* 4. WHY THIS MATTERS & RECOMMENDED ACTION */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="font-bold text-gem-navy text-xs block">
                    Why does this matter?
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {d.whyMatters}
                  </p>
                </div>

                <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 space-y-1">
                  <span className="font-bold text-gem-blue text-xs block">
                    Recommended Officer Action:
                  </span>
                  <p className="text-slate-800 text-xs font-medium leading-relaxed">
                    {d.recommendedAction}
                  </p>
                </div>
              </div>

              {/* 5. SIMPLE EVIDENCE CHAIN */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block">
                  EVIDENCE CHAIN (Click step for details)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-center text-xs">
                  {d.chain.map((step, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveChainStep(activeChainStep === idx ? null : idx)}
                      className={`p-2 rounded border cursor-pointer transition select-none ${
                        activeChainStep === idx 
                          ? 'bg-gem-navy text-white border-gem-navy font-bold shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-[10px] opacity-75 block">{idx + 1}. {step.label}</span>
                      <span className="font-semibold text-[11px] truncate block mt-0.5">{step.value}</span>
                    </div>
                  ))}
                </div>

                {activeChainStep !== null && (
                  <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-xs text-slate-800 animate-in fade-in">
                    <strong>Step {activeChainStep + 1} ({d.chain[activeChainStep].label}):</strong> {d.chain[activeChainStep].value}
                  </div>
                )}
              </div>

              {/* 6. COLLAPSED TECHNICAL DETAILS (Hidden by default) */}
              <details className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 cursor-pointer">
                <summary className="font-bold text-slate-700 select-none">
                  Technical Details ▸
                </summary>
                
                <div className="mt-3 space-y-2 font-mono text-[11px] pt-2 border-t border-slate-200">
                  <p><strong>Verification Token:</strong> {d.technical.token}</p>
                  <p><strong>Originating Authority:</strong> {d.technical.authority}</p>
                  <p><strong>Timestamp:</strong> {d.technical.timestamp}</p>
                  <p><strong>Reference Dataset ID:</strong> {d.technical.datasetId}</p>
                  <p><strong>Technical Registry Version:</strong> {d.technical.registryVersion}</p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowStructuredPayload(!showStructuredPayload);
                      }}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold text-[10px] transition inline-flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      <span>{showStructuredPayload ? 'Hide Structured Payload' : 'View Structured Payload'}</span>
                    </button>

                    {showStructuredPayload && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-slate-500 font-sans italic">
                          Technical evidence for audit/debugging purposes:
                        </p>
                        <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg overflow-x-auto text-[10px] leading-relaxed">
{JSON.stringify(d.technical.rawPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* 7. OFFICER ACTION BAR (Bottom Buttons) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAsReviewed(activeSourceModal.id)}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-2xs transition"
                  >
                    Mark as Reviewed
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestClarification}
                    className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-2xs transition"
                  >
                    Request Clarification
                  </button>

                  <button
                    type="button"
                    onClick={handleSpecialistReview}
                    className="px-3.5 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg shadow-2xs transition"
                  >
                    Send for Specialist Review
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSourceModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold rounded-lg transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
