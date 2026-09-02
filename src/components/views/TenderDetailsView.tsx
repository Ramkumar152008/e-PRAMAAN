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
  Calendar, 
  Building2,
  Layers,
  Award,
  FileCheck,
  Tag,
  MapPin,
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

  // Helper to map rule categories to distinct badges
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'OEM': return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'TEMPORAL': return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'FINANCIAL': return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'LOCAL_CONTENT': return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'SAFETY': return 'bg-red-50 text-red-900 border-red-200';
      case 'EXPERIENCE': return 'bg-indigo-50 text-indigo-900 border-indigo-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header & Navigation ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Chennai Petroleum Corporation Limited (CPCL) • {selectedTender.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2942]">{selectedTender.title}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tender eligibility requirements and submitted bidder evaluation queue.
          </p>
        </div>

        <button
          onClick={() => setActiveView('active-tenders')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tenders</span>
        </button>
      </div>

      {/* ── Section 1: Comprehensive Tender Information Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-5">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Tender No: {selectedTender.gemBidNo}
              </span>
              {selectedTender.isPrimaryDemo && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-950 px-2 py-0.5 rounded border border-blue-300">
                  Primary Workflow
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#0F2942]">{selectedTender.title}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-right">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Estimated Value</span>
              <strong className="text-sm font-extrabold text-[#0F2942]">₹{selectedTender.estimatedValue} Crore</strong>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-right">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Closing Date</span>
              <strong className="text-sm font-mono font-bold text-slate-800">{selectedTender.bidEndDate}</strong>
            </div>
          </div>
        </div>

        {/* Tender Meta Grid (8 Institutional Parameters) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Organization</span>
            <strong className="text-[#0F2942] font-semibold">Chennai Petroleum Corp. Ltd.</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Department</span>
            <strong className="text-[#0F2942] font-semibold">{selectedTender.department}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Delivery Location</span>
            <strong className="text-[#0F2942] font-semibold">{selectedTender.location || 'CPCL Manali, Chennai'}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Tender Type</span>
            <strong className="text-[#0F2942] font-semibold">{selectedTender.tenderType || 'Open National Tender'}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Evaluation Method</span>
            <strong className="text-blue-900 font-semibold">{selectedTender.evaluationMethod || 'Material Code Wise L1'}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Current Stage</span>
            <strong className="text-slate-900 font-semibold">{selectedTender.stage || 'Techno-Commercial'}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Priority</span>
            <span className="font-extrabold text-xs text-red-700">{selectedTender.priority || 'HIGH'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Bids Status</span>
            <strong className="text-emerald-700 font-semibold">{displayBidders.length} Bids Ingested</strong>
          </div>
        </div>

        {/* ── Section 2: TENDER REQUIREMENTS IDENTIFIED (Dynamic Clause Analysis) ── */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">
                TENDER REQUIREMENTS IDENTIFIED ({selectedTender.rules.length} Specific Clauses)
              </h3>
            </div>
            <span className="text-[11px] text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Tender-Aware Compliance Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {selectedTender.rules.map((rule, idx) => (
              <div key={rule.id || idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 hover:bg-blue-50/20 transition">
                <div className="flex items-center justify-between gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getCategoryColor(rule.category)}`}>
                    {rule.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{rule.referenceClause}</span>
                </div>
                <strong className="text-[#0F2942] font-bold text-xs block leading-snug">{rule.metric}</strong>
                <p className="text-[11px] text-slate-600 leading-snug">{rule.description}</p>
                <div className="pt-1 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span>Threshold: <strong>{String(rule.minimumValue)}</strong></span>
                  <span className={rule.mandatory ? 'text-red-700 font-bold' : 'text-slate-500'}>
                    {rule.mandatory ? 'Mandatory' : 'Optional / Preference'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Section 3: BIDS RECEIVED Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-sm text-[#0F2942]">
              BIDS RECEIVED FOR THIS TENDER ({displayBidders.length} Bidders)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Select a bidder to verify compliance and inspect evidence chain
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Bidder Legal Entity</th>
                <th className="p-3.5">Bid ID</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Compliance Score</th>
                <th className="p-3.5">Risk Profile</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayBidders.map((b) => {
                const isHighRisk = b.riskProfile.overallRisk === 'HIGH' || b.riskProfile.overallRisk === 'CRITICAL';
                const isMediumRisk = b.riskProfile.overallRisk === 'MEDIUM';
                const hasDecision = !!b.officerDecision;

                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    
                    {/* Bidder Legal Name */}
                    <td className="p-3.5 font-bold text-[#0F2942] max-w-xs">
                      <p className="text-xs font-bold text-[#0F2942]">{b.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">PAN: {b.pan} • GSTIN: {b.gstin}</p>
                    </td>

                    {/* Bid ID */}
                    <td className="p-3.5 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      {b.id}
                    </td>

                    {/* Submission Date */}
                    <td className="p-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {b.bidSubmissionDate || '10-Aug-2026'}
                    </td>

                    {/* Compliance Score */}
                    <td className="p-3.5 whitespace-nowrap">
                      <strong className={`font-mono text-xs ${
                        b.riskProfile.complianceScore >= 90 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {b.riskProfile.complianceScore} / 100
                      </strong>
                    </td>

                    {/* Risk Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isHighRisk 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : isMediumRisk 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {b.riskProfile.overallRisk} RISK
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      {hasDecision ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                          {b.officerDecision?.action.replace(/_/g, ' ')}
                        </span>
                      ) : isHighRisk ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                          Review Required
                        </span>
                      ) : isMediumRisk ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Requires Verification
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Ready for Decision
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleVerifyBid(b.id)}
                        className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-2xs transition inline-flex items-center gap-1.5 cursor-pointer"
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
