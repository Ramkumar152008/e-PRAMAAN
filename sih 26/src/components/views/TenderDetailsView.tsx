import React from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Building2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TenderDetailsView: React.FC = () => {
  const { 
    selectedTender, 
    bidders, 
    selectBidderById, 
    setActiveView 
  } = useApp();

  const tenderBidders = bidders.filter(b => b.tenderId === selectedTender.id);
  const displayBidders = tenderBidders.length > 0 ? tenderBidders : bidders.slice(0, selectedTender.bidsCount || 4);

  const handleVerifyBid = (bidderId: string) => {
    selectBidderById(bidderId);
    setActiveView('bid-verification');
  };

  // Structured requirements mapping based on tender rules
  const getRequirementRows = () => {
    if (selectedTender.id === 'C13A250049') {
      return [
        { req: 'GST Registration (GSTIN)', app: 'Applicable', evidence: 'GST Registration Certificate & Active Filings', status: 'Verified' },
        { req: 'Corporate PAN Verification', app: 'Applicable', evidence: 'Company PAN Card Allotment', status: 'Verified' },
        { req: 'ITR Filing (3 Financial Years)', app: 'Applicable', evidence: 'ITR Acknowledgement & Tax Clearance', status: 'Verified' },
        { req: 'Udyam / MSE Benefits', app: 'If claimed', evidence: 'Valid Udyam Registration Certificate', status: 'Review' },
        { req: 'Make in India Local Content (≥ 50%)', app: 'Applicable', evidence: 'Class-I Local Content Undertaking', status: 'Verified' },
        { req: 'OEM Authorization / Mill Stockist', app: 'If applicable', evidence: 'Manufacturer Authorization Letter (MAF)', status: 'Review' },
        { req: 'Technical Compliance & MTC', app: 'Applicable', evidence: 'ASTM A234 WPB & EN 10204 3.1 MTC', status: 'Issue' }
      ];
    }
    if (selectedTender.id === 'C18B250074') {
      return [
        { req: 'Proprietary OEM Eligibility', app: 'Applicable', evidence: 'Atlas Copco Proprietary Mandate', status: 'Verified' },
        { req: 'OEM Authorization Token', app: 'Applicable', evidence: 'Parent Board Authorization Token', status: 'Verified' },
        { req: 'Non-Spurious Undertaking', app: 'Applicable', evidence: 'Certificate of Authenticity', status: 'Verified' },
        { req: 'GST Registration & CIN Match', app: 'Applicable', evidence: 'Active GSTIN & MCA21 Record', status: 'Verified' },
        { req: 'Corporate PAN & Tax Status', app: 'Applicable', evidence: 'Permanent Account Number Card', status: 'Verified' },
        { req: 'Make in India Local Content (≥ 20%)', app: 'Applicable', evidence: 'Local Content Self-Declaration', status: 'Verified' },
        { req: 'Non-Debarment / Holiday Listing', app: 'Applicable', evidence: 'Non-Holiday Listing Affidavit', status: 'Verified' }
      ];
    }
    if (selectedTender.id === 'C21B240011') {
      return [
        { req: 'PESO / ATEX Flameproof Accreditation', app: 'Applicable', evidence: 'Valid Zone-1 Ex-d License Endorsement', status: 'Issue' },
        { req: 'Earnest Money Deposit (EMD)', app: 'Applicable', evidence: '₹1,50,000 Bank Guarantee / MSE Exemption', status: 'Verified' },
        { req: 'PQC Past Refinery Experience (≥ 50 Units)', app: 'Applicable', evidence: 'Client Installation & Completion Certs', status: 'Review' },
        { req: 'Technical Spec MS-CCTV-EX-24', app: 'Applicable', evidence: 'Technical Compliance Sheet & Datasheet', status: 'Issue' },
        { req: 'Land Border Rule 144(xi) Declaration', app: 'Applicable', evidence: 'Country of Origin Declaration Form', status: 'Verified' },
        { req: 'Non-Disclosure Agreement (NDA)', app: 'Applicable', evidence: 'Signed & Stamped NDA on Stamp Paper', status: 'Verified' },
        { req: 'OEM Authorization Form (MAF)', app: 'If applicable', evidence: 'Direct Manufacturer Authorization Form', status: 'Review' },
        { req: 'Statutory GST & Bank Mandate', app: 'Applicable', evidence: 'GSTIN, PAN & Cancelled Cheque', status: 'Verified' }
      ];
    }
    // Default / C03H240087 (Tube, Radiant 1F3, 6IN)
    return [
      { req: 'GST Registration (GSTIN)', app: 'Applicable', evidence: 'GST Registration Certificate', status: 'Verified' },
      { req: 'Corporate PAN Verification', app: 'Applicable', evidence: 'Company PAN Card', status: 'Verified' },
      { req: 'ITR Filing & Tax Compliance', app: 'Applicable', evidence: 'Previous 2 Years ITR Acknowledgement', status: 'Review' },
      { req: 'Udyam / MSE Exemption', app: 'If claimed', evidence: 'Udyam Registration Certificate', status: 'Review' },
      { req: 'Make in India Local Content (≥ 50%)', app: 'Applicable', evidence: 'Class-I Local Supplier Declaration', status: 'Verified' },
      { req: 'OEM / Authorized Agency Authorization', app: 'Applicable', evidence: 'Manufacturer Authorization Form (MAF)', status: 'Review' },
      { req: 'Technical Compliance (MS-RAD-6IN-1F3)', app: 'Applicable', evidence: 'Compliance Statement & QAP Stage-III', status: 'Issue' }
    ];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>VERIFIED</span>
          </span>
        );
      case 'Review':
        return (
          <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>REVIEW REQUIRED</span>
          </span>
        );
      case 'Issue':
        return (
          <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-700" />
            <span>POTENTIAL NON-COMPLIANCE</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
            N/A
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header & Navigation ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 bg-white p-4 sm:p-5 rounded-md border border-slate-300 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-800" />
            <span>Chennai Petroleum Corporation Limited (CPCL) • {selectedTender.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">Tender Details</h1>
            <span className="font-mono text-xs font-bold text-blue-900 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-300">
              {selectedTender.gemBidNo}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Tender-specific compliance rules, evidence parameters, and submitted bidder work queue.
          </p>
        </div>

        <button
          onClick={() => setActiveView('active-tenders')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tenders</span>
        </button>
      </div>

      {/* ── Section 1: Structured Metadata Rows (Section 18) ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">Tender Metadata & Institutional Parameters</h2>
          <span className="text-[11px] font-mono text-slate-500 font-bold">
            CPCL Ref: {selectedTender.gemBidNo}
          </span>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Tender ID</span>
              <strong className="font-mono text-blue-950 font-bold text-xs mt-0.5 block">{selectedTender.gemBidNo}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200 lg:col-span-2">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Tender Title</span>
              <strong className="text-[#0F2942] font-bold text-xs mt-0.5 block leading-tight">{selectedTender.title}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Organisation</span>
              <strong className="text-[#0F2942] font-bold text-xs mt-0.5 block">CPCL (Manali Refinery)</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Department</span>
              <strong className="text-[#0F2942] font-bold text-xs mt-0.5 block">{selectedTender.department}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Procurement Mode</span>
              <strong className="text-[#0F2942] font-bold text-xs mt-0.5 block">e-Procurement / GeM Custom Bid</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Tender Type</span>
              <strong className="text-[#0F2942] font-bold text-xs mt-0.5 block">{selectedTender.tenderType || 'Open National Tender'}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Evaluation Method</span>
              <strong className="text-blue-900 font-bold text-xs mt-0.5 block">{selectedTender.evaluationMethod || 'Material Code Wise L1'}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Delivery Location</span>
              <strong className="text-[#0F2942] font-bold text-xs mt-0.5 block">{selectedTender.location || 'CPCL Manali, Chennai'}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Bid Closing Date</span>
              <strong className="font-mono text-slate-900 font-bold text-xs mt-0.5 block">{selectedTender.bidEndDate}</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Bid Validity</span>
              <strong className="text-slate-900 font-bold text-xs mt-0.5 block">120 Days from Closing</strong>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
              <span className="text-slate-500 font-bold text-[10px] uppercase block">Estimated Value</span>
              <strong className="text-emerald-800 font-bold text-xs mt-0.5 block">₹{selectedTender.estimatedValue} Crore</strong>
            </div>

          </div>
        </div>
      </div>

      {/* ── Section 2: TENDER REQUIREMENTS TABLE (Section 18) ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">Tender Requirements (Tender-Specific Rules)</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Only applicable requirements are enforced for this specific tender category.
            </p>
          </div>
          <span className="text-[11px] text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200 font-mono">
            Tender-Aware Rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Requirement</th>
                <th className="p-3">Applicability</th>
                <th className="p-3">Evidence Required</th>
                <th className="p-3 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {getRequirementRows().map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-[#0F2942]">
                    {row.req}
                  </td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.2 rounded-sm text-[10px] font-semibold ${
                      row.app === 'Applicable' 
                        ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {row.app}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">
                    {row.evidence}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: BIDS RECEIVED Table ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-xs text-[#0F2942] uppercase tracking-wider">
            Bids Received for this Tender ({displayBidders.length} Bidders)
          </h3>
          <span className="text-[11px] text-slate-500">
            Select a bidder to open the compliance verification workstation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Bidder Legal Entity</th>
                <th className="p-3">Bid ID</th>
                <th className="p-3">Submission Date</th>
                <th className="p-3 text-center">Compliance</th>
                <th className="p-3 text-center">Issues</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayBidders.map((b) => {
                const isHighRisk = b.riskProfile.overallRisk === 'HIGH' || b.riskProfile.overallRisk === 'CRITICAL';
                const isMediumRisk = b.riskProfile.overallRisk === 'MEDIUM';
                const hasDecision = !!b.officerDecision;
                const isPrimary = b.id === 'BID-ATC-001';

                return (
                  <tr key={b.id} className={`hover:bg-slate-50 transition ${isPrimary ? 'bg-blue-50/20' : ''}`}>
                    
                    {/* Bidder Name */}
                    <td className="p-3 font-bold text-[#0F2942] max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F2942]">{b.name}</span>
                        {isPrimary && (
                          <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-950 px-1 py-0.2 rounded-sm border border-blue-300">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">PAN: {b.pan} • GSTIN: {b.gstin}</p>
                    </td>

                    {/* Bid ID */}
                    <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                      {b.id}
                    </td>

                    {/* Submission Date */}
                    <td className="p-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {b.bidSubmissionDate || '10-Aug-2026'}
                    </td>

                    {/* Compliance Score */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <strong className="font-mono text-xs text-slate-800">
                        {b.riskProfile.complianceScore}%
                      </strong>
                    </td>

                    {/* Issues */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-sm text-[10.5px] font-bold ${
                        b.riskProfile.topIssues.length > 0 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {b.riskProfile.topIssues.length} Issue{b.riskProfile.topIssues.length !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="p-3 whitespace-nowrap">
                      {hasDecision ? (
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-purple-100 text-purple-800 border border-purple-300">
                          {b.officerDecision?.action.replace(/_/g, ' ')}
                        </span>
                      ) : isHighRisk ? (
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-red-100 text-red-800 border border-red-300">
                          REVIEW REQUIRED
                        </span>
                      ) : isMediumRisk ? (
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-amber-100 text-amber-800 border border-amber-300">
                          REVIEW REQUIRED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-sm font-bold text-[10.5px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                          VERIFIED
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleVerifyBid(b.id)}
                        className="px-3 py-1 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-sm text-xs shadow-2xs transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Verify Bid</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
