import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Users, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw,
  Clock,
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tender } from '../../types';

export const DashboardView: React.FC = () => {
  const { 
    tenders,
    selectTenderById,
    bidders,
    selectBidderById,
    resetDemoData,
    setActiveView,
    runFullDemoWalkthrough,
    isDemoRunning,
    demoStepText
  } = useApp();

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Dynamic calculations across all 4 tenders & 18 bidders
  const totalActiveTenders = tenders.length;
  const totalBids = bidders.length;
  const totalIssues = 4;
  const totalPendingVerification = 5;

  const handleOpenTender = (tenderId: string) => {
    selectTenderById(tenderId);
    setActiveView('tender-details');
  };

  const handleInspectFinding = (tenderId: string, bidderId: string) => {
    selectTenderById(tenderId);
    selectBidderById(bidderId);
    setActiveView('bid-verification');
  };

  const getTenderStatusBadge = (t: Tender) => {
    if (t.id === 'C03H240087') {
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-700" />
          <span>2 Pending Review</span>
        </span>
      );
    }
    if (t.id === 'C13A250049') {
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-700" />
          <span>1 Pending Review</span>
        </span>
      );
    }
    if (t.id === 'C18B250074') {
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Ready for Review</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-amber-700" />
        <span>3 Pending Review</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Institutional Header & Officer Identification ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5 bg-white p-4 sm:p-5 rounded-md border border-slate-300 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">Procurement Dashboard</h1>
            <span className="px-2 py-0.5 rounded-sm text-[10.5px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
              CPCL Manali
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Chennai Petroleum Corporation Limited (CPCL) • Materials & Contracts (M&C) • <em>Intelligent Bid Compliance Verification Workstation</em>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={runFullDemoWalkthrough}
            disabled={isDemoRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-sm text-xs font-bold shadow-2xs transition cursor-pointer disabled:opacity-75"
            title="Start guided procurement verification journey"
          >
            <Play className="w-3 h-3 fill-current text-sky-200" />
            <span>{isDemoRunning ? 'Running Walkthrough...' : 'Guided Walkthrough'}</span>
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-sm text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Reset verification state"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Demo status banner if running */}
      {isDemoRunning && (
        <div className="p-3 bg-blue-50 border border-blue-400 rounded-sm text-xs text-blue-950 font-bold flex items-center gap-2 animate-pulse shadow-2xs">
          <div className="w-3 h-3 border-2 border-blue-900 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span>{demoStepText || 'Navigating procurement evaluation story...'}</span>
        </div>
      )}

      {/* ── Top Summary KPI Cards (Section 17: Compact Statistics) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
        
        <div 
          onClick={() => setActiveView('active-tenders')}
          className="p-3.5 bg-white rounded-md border border-slate-300 shadow-2xs hover:border-blue-500 transition cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Active Tenders</span>
          <p className="text-xl font-bold text-[#0F2942] mt-0.5">{totalActiveTenders}</p>
          <span className="text-[11px] text-blue-900 font-semibold mt-1 flex items-center gap-1">
            <span>4 CPCL Tenders →</span>
          </span>
        </div>

        <div 
          onClick={() => setActiveView('bids-received')}
          className="p-3.5 bg-white rounded-md border border-slate-300 shadow-2xs hover:border-blue-500 transition cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Bids Received</span>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{totalBids}</p>
          <span className="text-[11px] text-slate-600 font-semibold mt-1 flex items-center gap-1">
            <span>18 Submitted Bids →</span>
          </span>
        </div>

        <div 
          onClick={() => setActiveView('active-tenders')}
          className="p-3.5 bg-white rounded-md border border-slate-300 shadow-2xs hover:border-amber-500 transition cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Pending Verification</span>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{totalPendingVerification}</p>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 flex items-center gap-1">
            <span>5 Cases in Progress →</span>
          </span>
        </div>

        <div 
          onClick={() => setActiveView('clarification-center')}
          className="p-3.5 bg-white rounded-md border border-slate-300 shadow-2xs hover:border-red-500 transition cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Issues Requiring Action</span>
          <p className="text-xl font-bold text-red-600 mt-0.5">{totalIssues}</p>
          <span className="text-[11px] text-red-800 font-semibold mt-1 flex items-center gap-1">
            <span>4 Priority Action Items →</span>
          </span>
        </div>

      </div>

      {/* ── Main Content: ACTIVE TENDERS TABLE (Section 17) ── */}
      <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-800" />
              <h2 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider">ACTIVE TENDERS WORK QUEUE</h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Current Chennai Petroleum Corporation Limited procurement tenders open for compliance verification.
            </p>
          </div>
          <button
            onClick={() => setActiveView('active-tenders')}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>View All Tenders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-3">Tender ID</th>
                <th className="p-3">Tender Title & Scope</th>
                <th className="p-3">Closing Date</th>
                <th className="p-3 text-center">Bids</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tenders.map((t) => {
                const isPrimary = t.isPrimaryDemo;
                const tenderBidders = bidders.filter(b => b.tenderId === t.id);
                const bidsCount = t.bidsCount || tenderBidders.length || 4;

                return (
                  <tr 
                    key={t.id} 
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      isPrimary ? 'bg-blue-50/20' : ''
                    }`}
                    onClick={() => handleOpenTender(t.id)}
                  >
                    
                    {/* Tender ID */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-900 text-xs bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-300">
                          {t.gemBidNo}
                        </span>
                        {isPrimary && (
                          <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-950 px-1 py-0.2 rounded-sm border border-blue-300">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tender Title */}
                    <td className="p-3 max-w-sm">
                      <strong className="text-xs font-bold text-[#0F2942] block leading-snug">
                        {t.title}
                      </strong>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                        <span>{t.department}</span>
                        <span>•</span>
                        <span>Est. ₹{t.estimatedValue} Cr</span>
                      </div>
                    </td>

                    {/* Closing Date */}
                    <td className="p-3 whitespace-nowrap font-mono text-slate-700 text-[11px]">
                      {t.bidEndDate}
                    </td>

                    {/* Bids Count */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-sm text-slate-800 font-mono font-bold text-xs border border-slate-200">
                        {bidsCount} Bids
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="p-3 whitespace-nowrap">
                      {getTenderStatusBadge(t)}
                    </td>

                    {/* Action Button */}
                    <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenTender(t.id)}
                        className={`px-3 py-1 rounded-sm text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer ${
                          isPrimary
                            ? 'bg-[#0F2942] hover:bg-[#1E40AF] text-white shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        <span>View</span>
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

      {/* ── Section: OFFICER ATTENTION REQUIRED (Section 17) ── */}
      <div className="bg-white rounded-md border border-amber-300 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <h2 className="font-bold text-sm text-[#0F2942] uppercase tracking-wider">Officer Attention Required</h2>
          </div>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-950 font-bold text-xs rounded-sm border border-amber-300">
            4 Priority Action Items
          </span>
        </div>

        <div className="space-y-2.5">
          
          {/* Item 1: Atlas Copco OEM Authorization Scope (Tender C03H240087) */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-sm border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.2 bg-amber-600 text-white font-bold text-[9.5px] rounded-sm uppercase">
                  HIGH
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">Atlas Copco (India) Private Limited</strong>
                <span className="text-[10.5px] text-blue-900 font-mono font-bold bg-blue-50 px-1 py-0.2 rounded-sm border border-blue-200">Tender: C03H240087</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Discrepancy identified: OEM Authorization grantor is global parent entity (Atlas Copco Airpower n.v., Belgium)
              </p>
              <p className="text-[11px] text-slate-600">
                Finding: <strong className="text-amber-800">Review Required</strong> • Confirm Indian operating subsidiary corporate authorization and back-to-back technical warranty for CPCL Radiant Tubes.
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C03H240087', 'BID-ATC-001')}
              className="px-3 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-sm shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1"
            >
              <span>VERIFY BID</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Item 2: ABC Industrial Supplies Trader Status (Tender C03H240087) */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-sm border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.2 bg-red-600 text-white font-bold text-[9.5px] rounded-sm uppercase">
                  HIGH
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">ABC Industrial Supplies Pvt. Ltd.</strong>
                <span className="text-[10.5px] text-blue-900 font-mono font-bold bg-blue-50 px-1 py-0.2 rounded-sm border border-blue-200">Tender: C03H240087</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Discrepancy identified: Non-OEM Trader status for critical refinery furnace tubes (Clause 2.1)
              </p>
              <p className="text-[11px] text-slate-600">
                Finding: <strong className="text-red-700">Pre-Qualification Non-Compliance</strong> • Bidder lacks direct manufacturer authorization from accredited tube fabricator.
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C03H240087', 'BID-ABC-001')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-sm shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1"
            >
              <span>VERIFY BID</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Item 3: Southern Forgings TPI Mandate (Tender C13A250049) */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-sm border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.2 bg-amber-600 text-white font-bold text-[9.5px] rounded-sm uppercase">
                  MEDIUM
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">Southern Forgings & Flanges Ltd.</strong>
                <span className="text-[10.5px] text-blue-900 font-mono font-bold bg-blue-50 px-1 py-0.2 rounded-sm border border-blue-200">Tender: C13A250049</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Discrepancy identified: Third Party Inspection Agency (EIL / Lloyd's) appointment confirmation required
              </p>
              <p className="text-[11px] text-slate-600">
                Finding: <strong className="text-amber-800">Review Required</strong> • Confirm Stage-II QAP and mill material test certificate (MTC).
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C13A250049', 'BID-SFF-002')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-sm shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1"
            >
              <span>VERIFY BID</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Item 4: Axis Surveillance PESO Ex-d Renewal (Tender C21B240011) */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-sm border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.2 bg-amber-600 text-white font-bold text-[9.5px] rounded-sm uppercase">
                  MEDIUM
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">Axis Surveillance Systems India Pvt. Ltd.</strong>
                <span className="text-[10.5px] text-blue-900 font-mono font-bold bg-blue-50 px-1 py-0.2 rounded-sm border border-blue-200">Tender: C21B240011</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Discrepancy identified: PESO / ATEX Zone-1 flameproof enclosure license endorsement verification
              </p>
              <p className="text-[11px] text-slate-600">
                Finding: <strong className="text-amber-800">Review Required</strong> • Hazardous refinery area camera safety certification check.
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C21B240011', 'BID-AXS-002')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-sm shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1"
            >
              <span>VERIFY BID</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* ── Reset Confirmation Modal ── */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-300 shadow-xl max-w-sm w-full p-5 space-y-3.5 text-xs">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-blue-800" />
              <span>Reset Evaluation Session?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This resets all local session data back to default baseline.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirmModal(false);
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold shadow-2xs transition cursor-pointer"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
