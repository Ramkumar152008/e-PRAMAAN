import React from 'react';
import { 
  Binary, 
  Network, 
  CalendarClock, 
  Activity, 
  SearchCode, 
  UserCheck, 
  ArrowRight, 
  Play, 
  Cpu, 
  Workflow
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingView: React.FC = () => {
  const { setActiveView, runFullDemoWalkthrough, selectBidderById } = useApp();

  const differentiators = [
    {
      icon: Binary,
      title: '1. Tender-to-Rule Compiler',
      subtitle: 'Converts unstructured RFP/NIT natural text clauses into deterministic, machine-executable mathematical and temporal rules (thresholds, operators, validity windows).'
    },
    {
      icon: Network,
      title: '2. Cross-Document Truth Graph',
      subtitle: 'Builds a multi-dimensional relational entity graph connecting PAN, GSTIN, Udyam, MCA21, registered address, and OEM certificates to expose hidden inconsistencies.'
    },
    {
      icon: CalendarClock,
      title: '3. Bid-Date Compliance Engine',
      subtitle: 'Validates strict temporal boundaries between certificate issuance, validity windows, and the exact bid submission cutoff timestamp.'
    },
    {
      icon: Activity,
      title: '4. Bidder Risk Fingerprint',
      subtitle: 'Computes multi-dimensional risk scores (Financial, Document, Statutory Eligibility) and visualizes them on an advisory risk radar without black-box conclusions.'
    },
    {
      icon: SearchCode,
      title: '5. Evidence-First Explainability',
      subtitle: 'Every finding provides a full provenance chain: Tender Requirement → Structured Rule → Bidder Claim → Registry Verification → Discrepancy.'
    },
    {
      icon: UserCheck,
      title: '6. Human-in-the-Loop Decision',
      subtitle: 'Statutory compliance safeguard: AI never disqualifies or rejects a bidder automatically. The authorized Procurement Officer always retains 100% legal decision authority.'
    }
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gem-navy via-gem-navyLight to-slate-900 text-white rounded-xl p-8 sm:p-12 shadow-elevated border border-slate-700 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              e-BID PRAMAAN
            </h1>
            <p className="text-sky-300 font-semibold text-sm sm:text-base mt-1">
              Bid Compliance & Evidence Verification
            </p>
            <p className="text-slate-300 text-xs sm:text-sm font-mono mt-0.5">
              Evidence-Driven Procurement Compliance & Decision Support
            </p>
          </div>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Convert tender requirements into verifiable rules. Detect bidder inconsistencies. Prioritize procurement risks. <strong>Keep the officer in control.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2 px-5 py-3 rounded bg-gem-blue hover:bg-gem-blueHover text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Procurement Officer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('architecture-view')}
              className="flex items-center gap-2 px-5 py-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-600 transition-colors"
            >
              <Cpu className="w-4 h-4 text-slate-300" />
              <span>View Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Core Product Differentiators */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gem-navy">Core Innovation & Differentiators</h2>
          <p className="text-xs text-gem-textMuted">Why e-BID PRAMAAN transforms public procurement evaluation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentiators.map((diff, i) => {
            const Icon = diff.icon;
            return (
              <div 
                key={i} 
                className="p-5 bg-white rounded-lg border border-gem-border shadow-gov hover:shadow-card transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-gem-sky flex items-center justify-center text-gem-blue mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-gem-navy mb-2">{diff.title}</h3>
                  <p className="text-xs text-gem-textMuted leading-relaxed">{diff.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Procurement Workflow Hierarchy Diagram */}
      <div className="p-6 bg-slate-50 rounded-xl border border-gem-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gem-navy uppercase tracking-wider">
              Statutory Decision Hierarchy & Verification Pipeline
            </h3>
            <p className="text-xs text-gem-textMuted">From raw tender ingestion to human officer final adjudication</p>
          </div>
          <span className="text-xs font-mono font-bold text-gem-blue bg-blue-100 px-2.5 py-1 rounded">
            Human-in-the-Loop Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '1. Ingestion', desc: 'Tender & Bidder Docs' },
            { step: '2. Compilation', desc: 'Rule Register JSON' },
            { step: '3. Extraction', desc: 'Claim Extraction' },
            { step: '4. Cross-Check', desc: 'Registry Verification' },
            { step: '5. Truth Graph', desc: 'Relational Graph' },
            { step: '6. Risk Radar', desc: 'Advisory Score' },
            { step: '7. Officer Review', desc: 'Human Adjudication' },
            { step: '8. Audit Log', desc: 'Event Hash' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-white border border-slate-200 rounded shadow-subtle flex flex-col justify-between">
              <span className="font-bold text-gem-navy text-[11px]">{item.step}</span>
              <span className="text-[10px] text-slate-500 mt-1">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Pre-Loaded Bidders Showcase */}
      <div className="bg-white p-6 rounded-xl border border-gem-border shadow-gov space-y-4">
        <div>
          <h3 className="font-bold text-sm text-gem-navy">Evaluation Scenarios</h3>
          <p className="text-xs text-gem-textMuted">Select any bidder below to immediately load their complete forensic evidence dossier</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          
          {/* ABC Industries (Primary Demo Case) */}
          <div 
            onClick={() => {
              selectBidderById('BID-ABC-001');
              setActiveView('dashboard');
            }}
            className="p-3 bg-red-50/70 border-2 border-red-300 rounded-lg hover:bg-red-100/70 cursor-pointer transition shadow-subtle"
          >
            <div className="flex items-center justify-between font-bold text-red-900 mb-1">
              <span>ABC Industries Pvt Ltd</span>
              <span className="bg-red-200 text-red-900 text-[10px] px-1.5 py-0.2 rounded font-bold">HIGH RISK</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              • Turnover: ₹12 Cr claimed vs ₹8.7 Cr verified (Conflict)<br/>
              • Expired ISO cert on 05-Aug vs Bid Date 10-Aug<br/>
              • Address: Chennai claim vs Bengaluru verified
            </p>
            <div className="mt-2 text-red-800 font-bold text-[11px] flex items-center gap-1">
              Load & Inspect Case <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Bharat Tech Solutions */}
          <div 
            onClick={() => {
              selectBidderById('BID-BTS-002');
              setActiveView('dashboard');
            }}
            className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-lg hover:bg-emerald-100/70 cursor-pointer transition shadow-subtle"
          >
            <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
              <span>Bharat Tech Solutions LLP</span>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded font-bold">LOW RISK</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              • Turnover: ₹18.5 Cr verified on MCA Form 8<br/>
              • All ISO certs valid till 2028<br/>
              • OEM direct MAF token verified
            </p>
            <div className="mt-2 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
              Load & Inspect Case <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Nova Systems */}
          <div 
            onClick={() => {
              selectBidderById('BID-NOV-003');
              setActiveView('dashboard');
            }}
            className="p-3 bg-amber-50/70 border border-amber-300 rounded-lg hover:bg-amber-100/70 cursor-pointer transition shadow-subtle"
          >
            <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
              <span>Nova Systems India Ltd</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-bold">MEDIUM RISK</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-snug">
              • Turnover ₹11.2 Cr passes threshold<br/>
              • OEM MAF token pending direct verification<br/>
              • Requires Officer Clarification
            </p>
            <div className="mt-2 text-amber-800 font-bold text-[11px] flex items-center gap-1">
              Load & Inspect Case <ArrowRight className="w-3 h-3" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
