import React from 'react';
import { 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  Lock, 
  Network, 
  Server, 
  ArrowRight,
  Scale, 
  FileCheck2,
  Workflow
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ArchitectureView: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gem-navy text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Platform Technical Architecture
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gem-navy mt-1">e-BID PRAMAAN Platform System Architecture</h1>
          <p className="text-xs text-gem-textMuted mt-0.5">
            Modular Service Layer • Truth Graph Engine • Micro-Connectors • Cryptographic Governance
          </p>
        </div>

        <button
          onClick={() => setActiveView('dashboard')}
          className="px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition"
        >
          Go to Dashboard
        </button>
      </div>

      {/* 5-Tier Architectural Pipeline Diagram */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-6 space-y-6">
        <h2 className="text-sm font-bold text-gem-navy uppercase tracking-wider flex items-center gap-2">
          <Workflow className="w-4 h-4 text-gem-blue" />
          End-to-End Forensic Processing Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          
          {/* Layer 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tier 1: Ingestion</span>
            <h3 className="font-bold text-gem-navy text-sm">Document OCR & Tokenizer</h3>
            <p className="text-slate-600 leading-relaxed">
              • PDF / Scanned TIFF Parsing<br/>
              • SHA-256 Checksum Ledger<br/>
              • Bid Submission Cutoff Lock (T0)
            </p>
          </div>

          {/* Layer 2 */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gem-blue block">Tier 2: Compilation</span>
            <h3 className="font-bold text-gem-navy text-sm">Tender-to-Rule Engine</h3>
            <p className="text-slate-600 leading-relaxed">
              • Semantic Clause Parser<br/>
              • Rule Register JSON-LD<br/>
              • Deterministic Logic Bindings
            </p>
          </div>

          {/* Layer 3 */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Tier 3: Verification</span>
            <h3 className="font-bold text-gem-navy text-sm">Multi-Registry Gateway</h3>
            <p className="text-slate-600 leading-relaxed">
              • MCA21 / ROC AOC-4 Pulls<br/>
              • GSTN GSTR-3B/9 Feeds<br/>
              • Udyam MSME Validation<br/>
              • OEM & CPPP Blacklist Scan
            </p>
          </div>

          {/* Layer 4 */}
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-lg space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Tier 4: Forensics</span>
            <h3 className="font-bold text-gem-navy text-sm">Truth Graph & Temporal</h3>
            <p className="text-slate-600 leading-relaxed">
              • Entity Relation Graph<br/>
              • Conflict Edge Detection<br/>
              • Bid-Date Expiration Engine<br/>
              • XAI Reasoning Tree
            </p>
          </div>

          {/* Layer 5 */}
          <div className="p-4 bg-slate-900 text-white rounded-lg border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">Tier 5: Governance</span>
            <h3 className="font-bold text-white text-sm">Officer Decision & DSC</h3>
            <p className="text-slate-300 leading-relaxed">
              • Human Adjudication Panel<br/>
              • NIC Digital Signature (DSC)<br/>
              • Tamper-Evident Audit Hash<br/>
              • Formal CPPP Export
            </p>
          </div>

        </div>
      </div>

      {/* Security & Statutory Governance Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov space-y-2">
          <div className="w-8 h-8 rounded bg-gem-sky flex items-center justify-center text-gem-blue mb-2">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-gem-navy">Human-in-the-Loop Safeguard</h3>
          <p className="text-slate-600 leading-relaxed">
            Statutory requirement: No AI model can execute an automated disqualification or award. Every decision requires authorized officer authentication.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov space-y-2">
          <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-gem-navy">Cryptographic Non-Repudiation</h3>
          <p className="text-slate-600 leading-relaxed">
            All system observations, OCR extractions, and officer actions are cryptographically signed and sequenced in a tamper-evident audit log.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov space-y-2">
          <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center text-purple-700 mb-2">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-gem-navy">Decoupled Adapter Layer</h3>
          <p className="text-slate-600 leading-relaxed">
            The platform isolates simulated/connector engines from business logic, allowing seamless integration with national e-procurement registries.
          </p>
        </div>
      </div>

    </div>
  );
};
