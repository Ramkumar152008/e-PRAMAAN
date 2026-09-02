import React from 'react';
import { 
  Users, 
  ArrowLeft,
  FileText,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Building2,
  FileCheck
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

  const getStatusBadge = (b: typeof displayBidders[0]) => {
    if (b.officerDecision) {
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
          Decision Recorded
        </span>
      );
    }
    if (b.riskProfile.overallRisk === 'HIGH') {
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          Under Review
        </span>
      );
    }
    if (b.riskProfile.overallRisk === 'MEDIUM') {
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
          Clarification Pending
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
        Ready for Decision
      </span>
    );
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Context & Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Tender: <strong>{selectedTender.gemBidNo}</strong> — {selectedTender.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Bids Received</h1>
          <p className="text-xs text-slate-600">
            Bidder submissions received for Tender <strong>{selectedTender.gemBidNo}</strong>. Select a bidder to initiate compliance verification.
          </p>
        </div>

        <button
          onClick={() => setActiveView('tender-details')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tender Overview</span>
        </button>
      </div>

      {/* ── Bids Received Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
            <Users className="w-4 h-4 text-blue-700" />
            <span>Submitted Bids ({displayBidders.length} Entities)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click "VERIFY BID" to inspect documents, compliance matrix, and reference evidence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Bidder Legal Entity</th>
                <th className="p-3">Bid Submitted</th>
                <th className="p-3 text-center">Documents</th>
                <th className="p-3 text-center">Compliance</th>
                <th className="p-3 text-center">Issues</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayBidders.map((b) => {
                const docCount = b.documents.length || 7;
                const isPrimary = b.id === 'BID-ATC-001';
                const issueCount = b.riskProfile.topIssues.length;

                return (
                  <tr 
                    key={b.id} 
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      isPrimary ? 'bg-blue-50/20' : ''
                    }`}
                    onClick={() => handleVerifyBid(b.id)}
                  >
                    
                    {/* Bidder Column */}
                    <td className="p-3 font-bold text-[#0F2942] max-w-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0F2942]">{b.name}</span>
                          {isPrimary && (
                            <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-950 px-1 py-0.2 rounded border border-blue-300">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">
                          ID: {b.id} • PAN: {b.pan} • GSTIN: {b.gstin}
                        </p>
                      </div>
                    </td>

                    {/* Bid Submitted Date */}
                    <td className="p-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                      {b.bidSubmissionDate || '10-Aug-2026'}
                    </td>

                    {/* Documents Submitted */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-mono font-bold text-xs border border-slate-200">
                        {docCount} files
                      </span>
                    </td>

                    {/* Compliance Checks */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <strong className={`font-mono text-xs ${
                        b.riskProfile.complianceScore >= 90 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {b.riskProfile.complianceScore >= 90 ? '9 / 9 Checked' : '8 / 9 Checked'}
                      </strong>
                    </td>

                    {/* Issues Count */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        issueCount > 0 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {issueCount > 0 ? `${issueCount} Issue` : '0 Issues'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 whitespace-nowrap">
                      {getStatusBadge(b)}
                    </td>

                    {/* Primary CTA */}
                    <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleVerifyBid(b.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer ${
                          isPrimary 
                            ? 'bg-[#0F2942] hover:bg-[#1E40AF] text-white shadow-xs' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        }`}
                      >
                        <span>VERIFY BID</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
