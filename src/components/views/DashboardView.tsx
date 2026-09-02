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
  Flame,
  Layers,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { 
    tenders,
    selectTenderById,
    bidders,
    selectBidderById,
    resetDemoData,
    setActiveView,
    clarifications,
    runFullDemoWalkthrough,
    isDemoRunning,
    demoStepText
  } = useApp();

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Dynamic calculations across all 4 tenders & 18 bidders
  const totalActiveTenders = tenders.length;
  const totalBids = bidders.length;
  const totalIssues = 5;
  const totalDecisionsPending = 2;

  const handleOpenTender = (tenderId: string) => {
    selectTenderById(tenderId);
    setActiveView('tender-details');
  };

  const handleInspectFinding = (tenderId: string, bidderId: string) => {
    selectTenderById(tenderId);
    selectBidderById(bidderId);
    setActiveView('bid-verification');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Institutional Header & Officer Identification ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#0F2942] text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2942]">Procurement Officer Work Queue</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Chennai Petroleum Corporation Limited (CPCL) • M&C / Materials • <em>"From Tender Clause to Verified Evidence to Officer Decision."</em>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Walkthrough & Session Reset */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={runFullDemoWalkthrough}
            disabled={isDemoRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-75"
            title="Run interactive 1-click end-to-end evaluation walkthrough"
          >
            <Play className="w-3.5 h-3.5 fill-current text-sky-200" />
            <span>{isDemoRunning ? 'Running Demo...' : 'Primary Workflow Walkthrough'}</span>
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Reset evaluation state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Demo status banner if running */}
      {isDemoRunning && (
        <div className="p-3 bg-blue-50 border-2 border-blue-400 rounded-xl text-xs text-blue-950 font-bold flex items-center gap-2 animate-pulse shadow-xs">
          <div className="w-3.5 h-3.5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span>{demoStepText || 'Navigating procurement evaluation story...'}</span>
        </div>
      )}

      {/* ── Section 2: Top 4 Dynamic Summary Cards ── */}
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Officer Work Queue Summary
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          
          <div 
            onClick={() => setActiveView('active-tenders')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition cursor-pointer text-left"
          >
            <span className="text-[11px] font-semibold text-slate-500 block">Active Tenders</span>
            <p className="text-2xl font-extrabold text-[#0F2942] mt-1">{totalActiveTenders}</p>
            <span className="text-[10px] text-blue-800 font-bold mt-1 block">4 Active CPCL Tenders →</span>
          </div>

          <div 
            onClick={() => setActiveView('active-tenders')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition cursor-pointer text-left"
          >
            <span className="text-[11px] font-semibold text-slate-500 block">Bids Under Verification</span>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">{totalBids}</p>
            <span className="text-[10px] text-slate-600 font-medium mt-1 block">18 Bids across 4 Tenders</span>
          </div>

          <div 
            onClick={() => setActiveView('clarification-center')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer text-left"
          >
            <span className="text-[11px] font-semibold text-slate-500 block">Issues Requiring Review</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{totalIssues}</p>
            <span className="text-[10px] text-amber-800 font-bold mt-1 block">5 Priority Issues Pending →</span>
          </div>

          <div 
            onClick={() => setActiveView('decision-review')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition cursor-pointer text-left"
          >
            <span className="text-[11px] font-semibold text-slate-500 block">Decisions Pending</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{totalDecisionsPending}</p>
            <span className="text-[10px] text-emerald-800 font-bold mt-1 block">2 Ready for Officer Sign-off →</span>
          </div>

        </div>
      </div>

      {/* ── Section 2: REQUIRES YOUR ATTENTION ── */}
      <div className="bg-white rounded-xl border-2 border-amber-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#0F2942]">REQUIRES YOUR ATTENTION</h2>
              <p className="text-xs text-slate-500">Unresolved compliance items across active CPCL tenders requiring officer review</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-200">
            4 Priority Action Items
          </span>
        </div>

        <div className="space-y-3">
          
          {/* Item 1: Atlas Copco OEM Authorization Scope (Tender C03H240087) */}
          <div className="p-4 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded uppercase">
                  Primary Review Required
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">Atlas Copco (India) Private Limited</strong>
                <span className="text-[11px] text-blue-900 font-mono font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Tender: C03H240087</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Issue #01: OEM Authorization grantor is global parent entity (Atlas Copco Airpower n.v., Belgium)
              </p>
              <p className="text-[11px] text-slate-600">
                Status: <strong className="text-amber-800">Requires Verification</strong> • Confirm Indian operating subsidiary corporate authorization and back-to-back technical warranty for CPCL Radiant Tubes.
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C03H240087', 'BID-ATC-001')}
              className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1.5"
            >
              <span>OPEN VERIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item 2: ABC Industrial Supplies Trader Status (Tender C03H240087) */}
          <div className="p-4 bg-slate-50 hover:bg-red-50/40 rounded-xl border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] rounded uppercase">
                  Eligibility Issue
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">ABC Industrial Supplies Pvt. Ltd.</strong>
                <span className="text-[11px] text-blue-900 font-mono font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Tender: C03H240087</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Issue: Non-OEM Trader status for critical refinery furnace tubes (Clause 2.1)
              </p>
              <p className="text-[11px] text-slate-600">
                Status: <strong className="text-red-700">Pre-Qualification Non-Compliance</strong> • Bidder lacks direct manufacturer authorization from accredited tube fabricator.
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C03H240087', 'BID-ABC-001')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1.5"
            >
              <span>OPEN VERIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item 3: Southern Forgings TPI Mandate (Tender C13A250049) */}
          <div className="p-4 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded uppercase">
                  TPI Confirmation
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">Southern Forgings & Flanges Ltd.</strong>
                <span className="text-[11px] text-blue-900 font-mono font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Tender: C13A250049</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Issue: Third Party Inspection Agency (EIL / Lloyd's) appointment confirmation required
              </p>
              <p className="text-[11px] text-slate-600">
                Status: <strong className="text-amber-800">Under Evaluation</strong> • Confirm Stage-II QAP and mill material test certificate (MTC).
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C13A250049', 'BID-SFF-002')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1.5"
            >
              <span>OPEN VERIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item 4: Axis Surveillance PESO Ex-d Renewal (Tender C21B240011) */}
          <div className="p-4 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-200 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded uppercase">
                  Statutory Renewal
                </span>
                <strong className="text-xs font-bold text-[#0F2942]">Axis Surveillance Systems India Pvt. Ltd.</strong>
                <span className="text-[11px] text-blue-900 font-mono font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Tender: C21B240011</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Issue: PESO / ATEX Zone-1 flameproof enclosure license endorsement verification
              </p>
              <p className="text-[11px] text-slate-600">
                Status: <strong className="text-amber-800">Under Evaluation</strong> • Hazardous refinery area camera safety certification check.
              </p>
            </div>

            <button
              onClick={() => handleInspectFinding('C21B240011', 'BID-AXS-002')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-2xs transition whitespace-nowrap cursor-pointer self-start md:self-center flex items-center gap-1.5"
            >
              <span>OPEN VERIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ── Section 3: ACTIVE CPCL TENDERS WORK QUEUE (All 4 Tenders) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
              Enterprise Work Queue
            </span>
            <h2 className="text-lg font-bold text-[#0F2942]">
              Active CPCL Procurement Tenders ({tenders.length} Active Cases)
            </h2>
          </div>
          <button
            onClick={() => setActiveView('active-tenders')}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Tenders List</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {tenders.map((t) => {
            const isPrimary = t.isPrimaryDemo;
            const tenderBidders = bidders.filter(b => b.tenderId === t.id);
            const bidsCount = t.bidsCount || tenderBidders.length || 4;

            return (
              <div 
                key={t.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                  isPrimary 
                    ? 'bg-blue-50/30 border-blue-300 ring-1 ring-blue-300' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                      {t.gemBidNo}
                    </span>
                    {isPrimary ? (
                      <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-950 px-1.5 py-0.5 rounded border border-blue-300">
                        Primary Workflow
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500">
                        {t.stage}
                      </span>
                    )}
                  </div>
                  <strong className="text-xs font-bold text-[#0F2942] block leading-snug">
                    {t.title}
                  </strong>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>{t.location || 'CPCL Manali, Chennai'}</span>
                    <span>•</span>
                    <span>Est. ₹{t.estimatedValue} Cr</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0F2942]">
                    {bidsCount} Bids Ingested • {t.rules.length} Rules
                  </span>
                  <button
                    onClick={() => handleOpenTender(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isPrimary
                        ? 'bg-[#0F2942] hover:bg-[#1E40AF] text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    <span>OPEN TENDER</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Reset Confirmation Modal ── */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Reset Evaluation Session?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This resets all local session data back to the default procurement baseline.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirmModal(false);
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
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
