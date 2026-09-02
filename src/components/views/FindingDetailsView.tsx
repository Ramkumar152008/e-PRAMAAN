import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  ShieldAlert, 
  HelpCircle,
  FileCheck,
  CheckCircle2,
  GitFork,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FindingDetailsView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    selectedFindingIndex, 
    setActiveView 
  } = useApp();

  const findingData = [
    {
      title: 'Turnover Mismatch',
      risk: 'HIGH',
      findingWhat: 'Declared average annual turnover in submitted CA certificate differs significantly from official financial registry records.',
      evidence: 'Bidder Submitted: CA_Certified_Turnover_Statement_FY23-26.pdf (SHA-256: e3b0c442...) | Reference Record: MCA21 Form AOC-4 Filing (SRN-AOC4-2025-99214).',
      rule: 'Tender Clause 3.1 & 4.2: Average annual turnover shall not be less than ₹10.0 Crore during the previous three financial years (FY 2023-24, FY 2024-25, FY 2025-26).',
      comparison: 'Declared Turnover: ₹12.0 Crore | Reference Verified Turnover: ₹8.7 Crore | Discrepancy: -₹3.3 Crore (-27.5% Deficit below tender threshold).',
      whyMatters: 'The available evidence does not currently support the declared turnover requirement. Manual verification is required before financial bid opening.',
      recommendedAction: 'Review the bidder\'s financial statements and supporting CA certificate or issue a formal technical clarification notice.'
    },
    {
      title: 'Safety Certificate Validity Issue',
      risk: 'HIGH',
      findingWhat: 'Submitted Petroleum Safety Certificate (PESO / ATEX Zone-1 Flameproof) was expired on the mandatory bid submission date.',
      evidence: 'Bidder Submitted: Petroleum_Safety_Certificate_PESO_ATEX.pdf | Statutory Safety Registry Verification: Certificate expired on 05-Aug-2026.',
      rule: 'Tender Clause 8.1 & Rule PET-CERT-003: Mandatory PESO / ATEX Zone-1 safety certification must be legally active on the date of bid submission (10-Aug-2026).',
      comparison: 'Certificate Expiry Date: 05-Aug-2026 | Bid Cutoff Date: 10-Aug-2026 | Validity Deficit: 5 Days expired before bid submission.',
      whyMatters: 'Statutory mandate under Petroleum Rules and OISD standards for explosive environment deployment. Expired credentials cannot be accepted without formal renewal proof.',
      recommendedAction: 'Verify whether a valid renewal certificate or PESO renewal endorsement was submitted in the technical addendum.'
    },
    {
      title: 'Address Inconsistency',
      risk: 'MEDIUM',
      findingWhat: 'Bidder declared operational and registered office address in Chennai, whereas MCA21 master company records indicate registered office in Bengaluru.',
      evidence: 'Bidder Submitted: Bid Submission Form 1 (Chennai Address) | Reference Record: MCA21 Company Master Data (Bengaluru Address).',
      rule: 'Tender Clause 6.1 & 6.2: Declared operational and registered office address should reconcile with statutory registry records.',
      comparison: 'Declared Address: No. 42 Mount Road, Chennai, TN | Reference Record: 5th Block, Koramangala, Bengaluru, KA.',
      whyMatters: 'May affect state-level GST jurisdiction or local presence qualification if specifically mandated in the tender scope.',
      recommendedAction: 'Verify whether Chennai represents a branch/project office or request the bidder\'s GST state registration certificate.'
    }
  ];

  const current = findingData[selectedFindingIndex] || findingData[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 6) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gem-navy mb-1">
            <FileText className="w-4 h-4 text-gem-blue" />
            <span>Tender: {selectedTender.gemBidNo} • Bidder: {selectedBidder.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gem-navy">AI Finding Explanation</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Structured Explainable AI breakdown: Finding, Evidence, Rule, Comparison, Why it matters, and Recommended Action.
          </p>
        </div>

        <button
          onClick={() => setActiveView('findings-list')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Findings</span>
        </button>
      </div>

      {/* ── Structured 6-Part Finding Card (Section 6) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-6 space-y-5 text-xs">
        
        {/* Finding Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">1. FINDING</span>
            <h2 className="text-lg font-bold text-gem-navy mt-0.5">{current.title}</h2>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-900 border border-red-300 rounded font-bold text-xs">
            {current.risk} RISK
          </span>
        </div>

        {/* 1. What was detected? */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-700 block mb-1">What was detected?</span>
          <p className="text-slate-800 font-semibold leading-relaxed">{current.findingWhat}</p>
        </div>

        {/* 2. Evidence */}
        <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200">
          <span className="font-bold text-gem-navy block mb-1">2. EVIDENCE — Supporting Data & Documents</span>
          <p className="text-slate-800 leading-relaxed font-medium">{current.evidence}</p>
        </div>

        {/* 3. Rule */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-700 block mb-1">3. RULE — Referenced Tender Requirement</span>
          <p className="text-slate-700 leading-relaxed font-mono">{current.rule}</p>
        </div>

        {/* 4. Comparison */}
        <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200">
          <span className="font-bold text-amber-900 block mb-1">4. COMPARISON — Parameter Value Comparison</span>
          <p className="text-amber-950 font-bold leading-relaxed">{current.comparison}</p>
        </div>

        {/* 5. Why it matters */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-gem-blue" />
            <span>5. WHY IT MATTERS — Impact on Procurement</span>
          </span>
          <p className="text-slate-600 leading-relaxed pl-5">
            "{current.whyMatters}"
          </p>
        </div>

        {/* 6. Recommended Action */}
        <div className="p-3.5 bg-blue-50/40 rounded-lg border border-gem-blue/30 space-y-1">
          <span className="font-bold text-gem-navy flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-gem-blue" />
            <span>6. RECOMMENDED ACTION — Suggested Officer Next Step</span>
          </span>
          <p className="text-slate-700 leading-relaxed pl-5">
            "{current.recommendedAction}"
          </p>
        </div>

      </div>

      {/* ── Clarification Evidence Exchange Quick Action ── */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span className="font-bold text-[#0F2942] text-sm">Issue Formal GeM Clause 14(c) Clarification</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Selectively attach specific reference evidence (e.g. MCA21 filing) to share with {selectedBidder.name} without exposing internal notes.
          </p>
        </div>

        <button
          onClick={() => setActiveView('clarification-center')}
          className="px-4 py-2.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <span>Request Clarification & Select Evidence →</span>
        </button>
      </div>

      {/* ── Navigation Buttons (Section 6) ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('findings-list')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition"
        >
          Back to Findings List
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('clarification-center')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
          >
            Request Clarification
          </button>
          
          <button
            onClick={() => setActiveView('evidence-review')}
            className="px-6 py-2.5 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-xs rounded-lg shadow-gov transition flex items-center gap-2"
          >
            <span>Review Side-by-Side Evidence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
