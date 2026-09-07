import React from 'react';
import { 
  Users, 
  ArrowLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BidsReceivedView: React.FC = () => {
  const { 
    selectedTender, 
    bidders, 
    selectBidderById, 
    setActiveView 
  } = useApp();

  // Bidders for current tender
  const tenderBidders = bidders.filter(b => b.tenderId === selectedTender.id);
  const displayBidders = tenderBidders.length > 0 ? tenderBidders : bidders.slice(0, selectedTender.bidsCount || 4);

  const handleVerifyBid = (bidderId: string) => {
    selectBidderById(bidderId);
    setActiveView('bid-verification');
  };

  const getVerificationStatusBadge = (b: typeof displayBidders[0]) => {
    if (b.officerDecision) {
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-purple-100 text-purple-900 border border-purple-300 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-purple-700" />
          <span>{b.officerDecision.action.replace(/_/g, ' ')}</span>
        </span>
      );
    }
    if (b.riskProfile.complianceScore >= 95 || b.riskProfile.topIssues.length === 0) {
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>VERIFIED</span>
        </span>
      );
    }
    if (b.riskProfile.overallRisk === 'HIGH') {
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-red-100 text-red-900 border border-red-300 inline-flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-700" />
          <span>POTENTIAL NON-COMPLIANCE</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
        <Clock className="w-3 h-3 text-amber-700" />
        <span>REVIEW REQUIRED</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Context & Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 bg-white p-4 sm:p-5 rounded-md border border-slate-300 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-800" />
            <span>Chennai Petroleum Corporation Limited • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">Bids Received</h1>
          <p className="text-xs text-slate-600">
            Official list of bidder submissions received for Tender <strong>{selectedTender.gemBidNo}</strong> ({selectedTender.title}).
          </p>
        </div>

        <button
          onClick={() => setActiveView('tender-details')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tender Details</span>
        </button>
      </div>

      {/* ── Bids Received Table (Prompt Section 19) ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-xs text-[#0F2942] uppercase tracking-wider">
            <Users className="w-4 h-4 text-blue-800" />
            <span>Submitted Bids ({displayBidders.length} Entities)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Click "Verify" to open compliance matrix and inspect evidence chain
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3 text-center w-14">Sl. No.</th>
                <th className="p-3">Bidder</th>
                <th className="p-3 text-center">Submission Status</th>
                <th className="p-3 text-center">Compliance</th>
                <th className="p-3 text-center">Issues</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayBidders.map((b, index) => {
                const slNo = String(index + 1).padStart(2, '0');
                const isPrimary = b.id === 'BID-ATC-001';
                const issueCount = b.riskProfile.topIssues.length;
                const isVerified = b.riskProfile.complianceScore >= 95 || issueCount === 0;

                return (
                  <tr 
                    key={b.id} 
                    className={`hover:bg-slate-50 transition ${
                      isPrimary ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    
                    {/* Sl. No. */}
                    <td className="p-3 text-center font-mono font-bold text-slate-600">
                      {slNo}
                    </td>

                    {/* Bidder Column */}
                    <td className="p-3 font-bold text-[#0F2942] max-w-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0F2942]">{b.name}</span>
                          {isPrimary && (
                            <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-950 px-1 py-0.2 rounded-sm border border-blue-300">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">
                          ID: {b.id} • PAN: {b.pan} • GSTIN: {b.gstin}
                        </p>
                      </div>
                    </td>

                    {/* Submission Status */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-sm font-semibold text-[10.5px] border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Submitted</span>
                      </span>
                    </td>

                    {/* Compliance */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <strong className="font-mono text-xs text-slate-800">
                        {b.riskProfile.complianceScore}%
                      </strong>
                    </td>

                    {/* Issues */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-sm text-[10.5px] font-bold ${
                        issueCount > 0 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {issueCount === 0 ? '0 Issues' : `${issueCount} Issue${issueCount > 1 ? 's' : ''}`}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="p-3 whitespace-nowrap">
                      {getVerificationStatusBadge(b)}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleVerifyBid(b.id)}
                        className={`px-3 py-1 rounded-sm text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer ${
                          isVerified
                            ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-[#0F2942] hover:bg-[#1E40AF] text-white shadow-2xs'
                        }`}
                      >
                        <span>{isVerified ? 'View' : 'Verify'}</span>
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
