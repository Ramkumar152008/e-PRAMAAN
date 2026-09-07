import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowDown, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Building2, 
  FileText, 
  Users, 
  Cpu, 
  Layers, 
  SearchCode, 
  Scale, 
  Gavel, 
  FileSpreadsheet, 
  History,
  X,
  Play
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

interface FlowchartProps {
  onClose?: () => void;
}

export const ProcurementFlowchart: React.FC<FlowchartProps> = ({ onClose }) => {
  const { setActiveView } = useApp();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const handleStageClick = (view?: NavView) => {
    if (view) {
      setActiveView(view);
      if (onClose) onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gem-border shadow-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col text-xs text-slate-900 font-sans">
      
      {/* ── Modal Header ── */}
      <div className="p-4 sm:p-5 bg-gem-navy text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gem-blue text-white flex items-center justify-center font-bold">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">e-BID PRAMAAN — Procurement Verification Workflow</h2>
            <p className="text-[11px] text-slate-300">
              End-to-end evidence extraction, cross-verification, and vendor clarification process (MoPNG / CPCL)
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Scrollable Flowchart Canvas ── */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/70 space-y-6">
        
        {/* Top Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 text-xs flex items-center justify-between">
          <span className="leading-snug">
            <strong>Interactive Pipeline:</strong> Click on any stage box below to navigate directly to that section in the application.
          </span>
          <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
            27-Step Decision Pipeline
          </span>
        </div>

        {/* ── Phase 1: Authentication & Scope ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gem-navy text-white font-bold flex items-center justify-center text-[10px]">
              1
            </span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
              Phase 1: Access, Authentication & Control Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            
            {/* Box 1: Open App */}
            <div className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1">
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 1</span>
              <p className="font-bold text-gem-navy">Officer opens e-BID PRAMAAN</p>
              <p className="text-[10px] text-slate-500">Bid Compliance & Evidence Verification System</p>
            </div>

            {/* Box 2: Login */}
            <div className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1">
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 2</span>
              <p className="font-bold text-gem-navy">Officer Login</p>
              <p className="text-[10px] text-slate-500">Officer ID & Password / Secure Government SSO</p>
            </div>

            {/* Decision: Credentials Valid? */}
            <div className="p-3 bg-amber-50/80 border-2 border-amber-300 rounded-lg text-center space-y-1">
              <span className="font-mono text-[10px] text-amber-800 font-bold block">DECISION</span>
              <p className="font-bold text-amber-900 text-xs">Credentials Valid?</p>
              <div className="flex justify-center gap-2 pt-1 text-[10px] font-bold">
                <span className="text-red-700 bg-red-100 px-1.5 py-0.2 rounded">NO → Login Error</span>
                <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">YES → Auth</span>
              </div>
            </div>

            {/* Box 3: Officer Dashboard */}
            <div 
              onClick={() => handleStageClick('dashboard')}
              className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-emerald-100 transition"
            >
              <span className="font-mono text-[10px] text-emerald-800 font-bold block">STEP 3 (CLICKABLE)</span>
              <p className="font-bold text-emerald-950">Officer Dashboard</p>
              <p className="text-[10px] text-emerald-800">Select Department / Control Area</p>
            </div>

          </div>
        </div>

        <div className="flex justify-center my-1 text-slate-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* ── Phase 2: Tender Selection & Bids Ingestion ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gem-navy text-white font-bold flex items-center justify-center text-[10px]">
              2
            </span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
              Phase 2: Tender Requirements & Bids Received
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            
            {/* Box 4: Active Tenders */}
            <div 
              onClick={() => handleStageClick('dashboard')}
              className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-100 transition"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 4</span>
              <p className="font-bold text-gem-navy">Active Tenders List</p>
              <p className="text-[10px] text-slate-500">GEM/2026/B/891240 (IT Upgrade) • ₹14.5 Cr</p>
            </div>

            {/* Box 5: Tender Details & Requirements */}
            <div 
              onClick={() => handleStageClick('tender-register')}
              className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-100 transition"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 5</span>
              <p className="font-bold text-gem-navy">Tender Requirements</p>
              <p className="text-[10px] text-slate-500">Eligibility, Financial (₹10 Cr), ISO, OEM, PAN/GST</p>
            </div>

            {/* Box 6: Bids Received */}
            <div 
              onClick={() => handleStageClick('dashboard')}
              className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-100 transition"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 6</span>
              <p className="font-bold text-gem-navy">Bids Received (5)</p>
              <p className="text-[10px] text-slate-500">ABC Industries, Bharat Tech, Nova, Digital, Secure</p>
            </div>

            {/* Box 7: Select Bidder */}
            <div 
              onClick={() => handleStageClick('bid-verification')}
              className="p-3.5 bg-blue-50 border-2 border-gem-blue rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-blue-100 transition"
            >
              <span className="font-mono text-[10px] text-gem-blue font-bold block">STEP 7</span>
              <p className="font-bold text-gem-navy">Select Bidder</p>
              <p className="text-[10px] text-gem-navy font-semibold">ABC Industries Pvt Ltd (BID-ABC-001)</p>
            </div>

          </div>
        </div>

        <div className="flex justify-center my-1 text-slate-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* ── Phase 3: AI Document Processing & Cross-Verification ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gem-navy text-white font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
              Phase 3: AI Processing, Extraction & Cross-Document Verification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            
            {/* Box 8: Submitted Documents */}
            <div 
              onClick={() => handleStageClick('bid-verification')}
              className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-100 transition"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 8</span>
              <p className="font-bold text-gem-navy">Submitted Bid Documents</p>
              <p className="text-[10px] text-slate-500">Balance Sheet, GST, Udyam, ISO, MAF</p>
            </div>

            {/* Decision: Documents Complete? */}
            <div className="p-3 bg-amber-50/80 border-2 border-amber-300 rounded-lg text-center space-y-1">
              <span className="font-mono text-[10px] text-amber-800 font-bold block">DECISION</span>
              <p className="font-bold text-amber-900 text-xs">Documents Complete?</p>
              <div className="flex justify-center gap-1.5 pt-1 text-[10px] font-bold">
                <span className="text-red-700 bg-red-100 px-1 py-0.2 rounded">NO → Missing Finding</span>
                <span className="text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">YES → OCR</span>
              </div>
            </div>

            {/* Box 9: AI Extraction */}
            <div 
              onClick={() => handleStageClick('bid-verification')}
              className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-100 transition"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 9</span>
              <p className="font-bold text-gem-navy">AI Information Extraction</p>
              <p className="text-[10px] text-slate-500">Entities, Dates, Claimed Turnover (₹12 Cr)</p>
            </div>

            {/* Box 10: Cross-Document Check */}
            <div 
              onClick={() => handleStageClick('evidence-analysis')}
              className="p-3.5 bg-red-50 border-2 border-red-400 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-red-100 transition"
            >
              <span className="font-mono text-[10px] text-red-700 font-bold block">STEP 10</span>
              <p className="font-bold text-red-950">Cross-Document Verification</p>
              <p className="text-[10px] text-red-800">Declared ₹12 Cr vs Verified ₹8.7 Cr (Conflict)</p>
            </div>

          </div>
        </div>

        <div className="flex justify-center my-1 text-slate-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* ── Phase 4: AI Risk Assessment & Investigation Priority ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gem-navy text-white font-bold flex items-center justify-center text-[10px]">
              4
            </span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
              Phase 4: Risk Assessment & Investigation Priority Queue
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            
            {/* Box 11: Date Validity Checks */}
            <div 
              onClick={() => handleStageClick('evidence-analysis')}
              className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-amber-100 transition"
            >
              <span className="font-mono text-[10px] text-amber-700 font-bold block">STEP 11</span>
              <p className="font-bold text-amber-950">Date & Validity Checks</p>
              <p className="text-[10px] text-amber-800">ISO expired on 05-Aug vs Bid Date 10-Aug</p>
            </div>

            {/* Box 12: AI Risk Assessment */}
            <div 
              onClick={() => handleStageClick('evidence-analysis')}
              className="p-3.5 bg-slate-900 text-white rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-800 transition"
            >
              <span className="font-mono text-[10px] text-sky-300 font-bold block">STEP 12</span>
              <p className="font-bold text-white">AI Risk Assessment</p>
              <p className="text-[10px] text-yellow-300 font-bold">Overall Risk: HIGH</p>
            </div>

            {/* Box 13: Investigation Queue */}
            <div 
              onClick={() => handleStageClick('investigation-queue')}
              className="p-3.5 bg-blue-50 border-2 border-gem-blue rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-blue-100 transition"
            >
              <span className="font-mono text-[10px] text-gem-blue font-bold block">STEP 13</span>
              <p className="font-bold text-gem-navy">Investigation Priority Queue</p>
              <p className="text-[10px] text-slate-600">P1: Turnover • P2: ISO Expiry • P3: Address</p>
            </div>

            {/* Box 14: Officer Review */}
            <div 
              onClick={() => handleStageClick('decision-review')}
              className="p-3.5 bg-white border-2 border-gem-navy rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-50 transition"
            >
              <span className="font-mono text-[10px] text-gem-navy font-bold block">STEP 14</span>
              <p className="font-bold text-gem-navy">Officer Review</p>
              <p className="text-[10px] text-slate-600">Inspect Evidence, Findings & Remarks</p>
            </div>

          </div>
        </div>

        <div className="flex justify-center my-1 text-slate-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* ── Phase 5: Officer Decision, Report & Audit Trail ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gem-navy text-white font-bold flex items-center justify-center text-[10px]">
              5
            </span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gem-navy">
              Phase 5: Officer Decision, Final Report & Tamper-Evident Audit
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            
            {/* Box 15: Officer Decision (5 States) */}
            <div 
              onClick={() => handleStageClick('decision-review')}
              className="p-3.5 bg-gem-navy text-white rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-gem-navyLight transition"
            >
              <span className="font-mono text-[10px] text-sky-300 font-bold block">STEP 15</span>
              <p className="font-bold text-white">Officer Decision (5 States)</p>
              <p className="text-[10px] text-slate-300">Flagged for Investigation / Requires Clarification</p>
            </div>

            {/* Decision: Confirm Decision? */}
            <div className="p-3 bg-amber-50/80 border-2 border-amber-300 rounded-lg text-center space-y-1">
              <span className="font-mono text-[10px] text-amber-800 font-bold block">CONFIRMATION</span>
              <p className="font-bold text-amber-900 text-xs">Confirm Submission?</p>
              <div className="flex justify-center gap-1.5 pt-1 text-[10px] font-bold">
                <span className="text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">NO → Review</span>
                <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">YES → Commit</span>
              </div>
            </div>

            {/* Box 16: Verification Report */}
            <div 
              onClick={() => handleStageClick('reports')}
              className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-slate-100 transition"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold block">STEP 16</span>
              <p className="font-bold text-gem-navy">Verification Report</p>
              <p className="text-[10px] text-slate-500">7-Part Printable Audit Dossier (PDF/CSV)</p>
            </div>

            {/* Box 17: Audit Trail */}
            <div 
              onClick={() => handleStageClick('audit-trail')}
              className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-lg shadow-subtle text-center space-y-1 cursor-pointer hover:bg-emerald-100 transition"
            >
              <span className="font-mono text-[10px] text-emerald-800 font-bold block">STEP 17</span>
              <p className="font-bold text-emerald-950">Audit Trail Completed</p>
              <p className="text-[10px] text-emerald-800">SHA-256 Ledger • Finalized State</p>
            </div>

          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div className="p-4 bg-white border-t border-gem-border flex items-center justify-between flex-shrink-0">
        <span className="text-[11px] text-slate-500">
          e-BID PRAMAAN • Ministry of Petroleum & Natural Gas • CPCL Procurement Verification Architecture
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F2942] text-white rounded text-xs font-semibold hover:bg-blue-900 transition cursor-pointer"
          >
            Close Flowchart
          </button>
        )}
      </div>

    </div>
  );
};
