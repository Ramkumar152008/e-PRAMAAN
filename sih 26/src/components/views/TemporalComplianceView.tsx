import React, { useState } from 'react';
import { 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert, 
  FileText,
  Calendar,
  Clock,
  Flame,
  Milestone,
  HelpCircle,
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TemporalComplianceView: React.FC = () => {
  const { selectedTender, selectedBidder, setActiveView } = useApp();
  const [selectedTemporalId, setSelectedTemporalId] = useState<string>('TC-01');

  const temporalChecks = [
    {
      id: 'TC-01',
      requirement: 'Petroleum Safety Certificate (PESO / ATEX Zone-1)',
      affectedRule: 'PET-CERT-003 / PET-SFT-007',
      sourceClause: 'Tender Clause 8.1',
      issueDate: '01-Jan-2025',
      expiryDate: '05-Aug-2026',
      bidDate: '10-Aug-2026',
      horizonResult: 'EXPIRED BEFORE BID SUBMISSION DATE',
      validityDeficit: '-5 Days Deficit',
      status: 'FAIL',
      why: 'Certificate was not valid on the statutory bid submission date (10-Aug-2026). Expiration occurred on 05-Aug-2026.',
      impact: 'Mandatory Technical Eligibility: PESO / ATEX Zone-1 flameproof certification is legally mandatory under Petroleum Rules for explosive hydrocarbon pipeline environments.',
      officerAction: 'Issue GeM Clause 14(c) Clarification Notice or request proof of renewal endorsement issued prior to bid cutoff date.',
      evidenceRef: 'Certificate #PESO-EX-2023-88912 (Page 1)'
    },
    {
      id: 'TC-02',
      requirement: 'ISO 9001:2015 Quality Management System',
      affectedRule: 'PET-QMS-008',
      sourceClause: 'Tender Clause 7.2',
      issueDate: '10-Jan-2024',
      expiryDate: '31-Dec-2026',
      bidDate: '10-Aug-2026',
      horizonResult: 'VALID ON BID DATE',
      validityDeficit: '+143 Days Remaining',
      status: 'PASS',
      why: 'Accreditation remains active on the bid date with 143 days surplus validity.',
      impact: 'Satisfies quality management requirement under NABCB accredited registrar.',
      officerAction: 'None — Verified Compliant on Bid Date.',
      evidenceRef: 'Certificate #ISO-9001-2023-9912'
    },
    {
      id: 'TC-03',
      requirement: 'OEM Manufacturer Authorization Form (MAF)',
      affectedRule: 'PET-OEM-006',
      sourceClause: 'Tender Clause 7.1',
      issueDate: '01-Jan-2025',
      expiryDate: '31-Dec-2026',
      bidDate: '10-Aug-2026',
      horizonResult: 'VALID ON BID DATE',
      validityDeficit: '+143 Days Remaining',
      status: 'PASS',
      why: 'Authorization spans full project execution and delivery horizon.',
      impact: 'Ensures direct OEM back-to-back warranty and spare parts support.',
      officerAction: 'Secondary cryptographic token validation recommended.',
      evidenceRef: 'MAF Token #PETRO-SENS-2026-MAF-8812'
    },
    {
      id: 'TC-04',
      requirement: 'GSTIN Filing Regularity Horizon',
      affectedRule: 'PET-TAX-004',
      sourceClause: 'Tender Clause 6.1',
      issueDate: '01-Jul-2018',
      expiryDate: 'Continuous (Active)',
      bidDate: '10-Aug-2026',
      horizonResult: 'VALID ON BID DATE',
      validityDeficit: '36 Months Regular',
      status: 'PASS',
      why: '36 consecutive monthly GSTR-3B filings up to July 2026 with 0 defaults.',
      impact: 'Statutory compliance satisfied without tax default liabilities.',
      officerAction: 'None — Verified Compliant.',
      evidenceRef: 'GSTN Returns Ledger #29ABCDE1234F1Z5'
    },
    {
      id: 'TC-05',
      requirement: 'Turnover Evaluation Financial Years',
      affectedRule: 'PET-FIN-001',
      sourceClause: 'Tender Clause 4.2',
      issueDate: '01-Apr-2023',
      expiryDate: '31-Mar-2026',
      bidDate: '10-Aug-2026',
      horizonResult: 'ELIGIBLE 3-YEAR WINDOW',
      validityDeficit: 'FY 2023-24, FY 2024-25, FY 2025-26',
      status: 'PASS',
      why: 'Financial statements submitted correspond exactly to the 3 preceding audited financial years.',
      impact: 'Correct baseline period utilized; numerical turnover mismatch addressed separately.',
      officerAction: 'Cross-verify with MCA21 Form AOC-4 statutory revenue.',
      evidenceRef: 'CA Turnover Statement & Balance Sheets'
    }
  ];

  const activeCheck = temporalChecks.find(c => c.id === selectedTemporalId) || temporalChecks[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 22) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <CalendarClock className="w-4 h-4 text-blue-700" />
            <span>e-BID PRAMAAN • Bid-Date Truth Engine</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
              Temporal Horizon Analysis
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Bid-Date Compliance Verification</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Evaluates: <em>"Was this evidence legally valid and active on the exact bid cutoff date?"</em> (10 August 2026, 15:00 IST)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('evidence-passport')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Evidence Passport</span>
          </button>

          <button
            onClick={() => setActiveView('truth-graph')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Truth Graph →</span>
          </button>
        </div>
      </div>

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Tender ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bidder Entity</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block truncate">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Statutory Bid Cutoff Date</span>
          <span className="font-bold text-red-700 mt-0.5 block">10 August 2026, 15:00 IST</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Temporal Verdict</span>
          <span className="font-bold text-red-700 mt-0.5 block">1 Critical Validity Deficit (-5 Days)</span>
        </div>
      </div>

      {/* ── 3-Point Interactive Timeline Banner (Section 6) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
              Flagged Temporal Incident (Primary Demo Finding)
            </span>
            <h2 className="text-base font-bold text-[#0F2942]">
              PESO Safety Certificate Expiration Timeline vs Bid Cutoff
            </h2>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-300 font-mono font-bold text-xs rounded-lg self-start sm:self-center">
            -5 DAYS VALIDITY DEFICIT
          </span>
        </div>

        {/* 3-Point Visual Timeline Line */}
        <div className="relative py-4 px-2 sm:px-8">
          <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gradient-to-r from-emerald-500 via-red-500 to-slate-400 -translate-y-1/2 rounded-full hidden sm:block" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            {/* Point 1: Issue Date */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">1</span>
                <span className="font-bold text-xs text-emerald-950 uppercase">Issue Date</span>
              </div>
              <p className="font-mono font-extrabold text-sm text-emerald-900">01 January 2025</p>
              <p className="text-[11px] text-slate-600">PESO Zone-1 Certificate issued by statutory authority.</p>
            </div>

            {/* Point 2: Expiration Date */}
            <div className="p-4 bg-red-50 border-2 border-red-400 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-700 text-white font-bold text-xs flex items-center justify-center">2</span>
                <span className="font-bold text-xs text-red-950 uppercase">Certificate Expiry</span>
              </div>
              <p className="font-mono font-extrabold text-sm text-red-900">05 August 2026</p>
              <p className="text-[11px] text-red-800 font-semibold">Validity lapsed 5 calendar days before bid submission cutoff.</p>
            </div>

            {/* Point 3: Bid Submission Cutoff */}
            <div className="p-4 bg-slate-900 text-white rounded-xl border-2 border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">3</span>
                <span className="font-bold text-xs text-amber-300 uppercase">Bid Cutoff Date</span>
              </div>
              <p className="font-mono font-extrabold text-sm text-white">10 August 2026</p>
              <p className="text-[11px] text-slate-300">Statutory tender cutoff timestamp (15:00 IST).</p>
            </div>
          </div>
        </div>

        {/* Explainability Callout (Why, Rule, Impact, Action) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Why It Failed:</span>
            <p className="font-semibold text-slate-900 mt-0.5">{primaryCertWhy(activeCheck.why)}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Affected Machine Rule:</span>
            <p className="font-mono font-bold text-blue-900 mt-0.5">{activeCheck.affectedRule} ({activeCheck.sourceClause})</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Mandatory Eligibility Impact:</span>
            <p className="font-semibold text-red-800 mt-0.5">{activeCheck.impact}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Recommended Officer Action:</span>
            <p className="font-semibold text-blue-900 mt-0.5">{activeCheck.officerAction}</p>
          </div>
        </div>
      </div>

      {/* ── All Temporal Horizon Checks Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-sm text-[#0F2942]">Bid-Date Temporal Register ({temporalChecks.length} Criteria)</span>
          <span className="text-xs text-slate-500 font-medium">Evaluation Reference: 10 August 2026 Cutoff</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Requirement / Certificate</th>
                <th className="p-3.5">Rule Reference</th>
                <th className="p-3.5">Validity Window</th>
                <th className="p-3.5">Bid Date (10-Aug-2026)</th>
                <th className="p-3.5">Temporal Verdict</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {temporalChecks.map((tc) => {
                const isFail = tc.status === 'FAIL';
                return (
                  <tr key={tc.id} className={`hover:bg-slate-50 transition ${isFail ? 'bg-red-50/20' : ''}`}>
                    <td className="p-3.5 font-bold text-[#0F2942]">
                      <p>{tc.requirement}</p>
                      <span className="font-mono text-[10px] text-slate-400 font-normal">{tc.evidenceRef}</span>
                    </td>
                    <td className="p-3.5 font-mono text-blue-900 font-bold text-[11px]">
                      {tc.affectedRule}
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <span className="font-mono">{tc.issueDate} → {tc.expiryDate}</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      {tc.validityDeficit}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                        isFail 
                          ? 'bg-red-100 text-red-900 border border-red-300' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {tc.horizonResult}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedTemporalId(tc.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#0F2942] hover:text-white text-slate-800 font-bold rounded text-xs transition border border-slate-300 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('evidence-passport')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Evidence Passport
        </button>

        <button
          onClick={() => setActiveView('truth-graph')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Relational Truth Graph</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

function primaryCertWhy(fallback: string): string {
  return fallback || 'Certificate was not valid on the bid date.';
}
