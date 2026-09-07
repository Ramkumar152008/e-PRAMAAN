import React, { useState } from 'react';
import { 
  FileText, 
  SearchCode, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Database, 
  ExternalLink,
  Layers,
  Network,
  CalendarClock,
  TableProperties
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationField } from '../../types';
import { EvidenceDetailModal } from '../modals/EvidenceDetailModal';
import { TruthGraphView } from './TruthGraphView';
import { TemporalComplianceView } from './TemporalComplianceView';
import { CrossVerificationView } from './CrossVerificationView';
import { ComplianceMatrixView } from './ComplianceMatrixView';

export const EvidenceAnalysisView: React.FC = () => {
  const { selectedBidder, setActiveView } = useApp();
  const [selectedField, setSelectedField] = useState<VerificationField | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'CROSS_SOURCE' | 'TEMPORAL' | 'TRUTH_GRAPH' | 'MATRIX'>('OVERVIEW');

  // Key cross-document comparisons
  const comparisons = [
    {
      field: 'Annual Turnover',
      declared: `₹${selectedBidder.claimedTurnover} Crore (Declaration Form & CA Statement)`,
      verified: `₹${selectedBidder.verifiedTurnover} Crore (MCA21 Filings & GST Returns)`,
      status: selectedBidder.claimedTurnover !== selectedBidder.verifiedTurnover ? 'Potential Conflict' : 'Verified',
      implication: selectedBidder.verifiedTurnover < 10 ? 'Verified amount below mandatory ₹10 Cr tender threshold' : 'Meets tender requirement'
    },
    {
      field: 'Registered Corporate Address',
      declared: selectedBidder.claimedAddress,
      verified: selectedBidder.verifiedAddress,
      status: selectedBidder.claimedAddress !== selectedBidder.verifiedAddress ? 'Potential Conflict' : 'Verified',
      implication: 'Operational headquarters differs from registered office on MCA21'
    },
    {
      field: 'ISO 9001 Quality Certificate Validity',
      declared: 'Valid on Bid Submission Date (10-Aug-2026)',
      verified: 'Expired on 05-Aug-2026 (5 days prior to submission)',
      status: selectedBidder.id === 'BID-ABC-001' ? 'Potential Conflict' : 'Verified',
      implication: 'Certificate was not valid on the statutory bid cutoff date'
    },
    {
      field: 'OEM Authorization Code',
      declared: selectedBidder.oemAuth.authCode,
      verified: selectedBidder.oemAuth.verifiedDirectly ? 'Verified via Direct OEM Portal' : 'Pending Direct OEM Gateway Verification',
      status: selectedBidder.oemAuth.verifiedDirectly ? 'Verified' : 'Potential Conflict',
      implication: 'Authorized manufacturer partner token reconciliation'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gem-navy">Evidence Analysis</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Review evidence extracted from documents and cross-document verification for <strong className="text-gem-navy">{selectedBidder.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('investigation-queue')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition"
          >
            <span>Investigation Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Sub-navigation Tabs (Section 39) ── */}
      <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg border border-gem-border shadow-gov text-xs">
        <button
          onClick={() => setActiveSubTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            activeSubTab === 'OVERVIEW'
              ? 'bg-gem-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Evidence Overview
        </button>
        <button
          onClick={() => setActiveSubTab('CROSS_SOURCE')}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            activeSubTab === 'CROSS_SOURCE'
              ? 'bg-gem-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cross-Document Verification
        </button>
        <button
          onClick={() => setActiveSubTab('TEMPORAL')}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            activeSubTab === 'TEMPORAL'
              ? 'bg-gem-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Date & Validity Checks
        </button>
        <button
          onClick={() => setActiveSubTab('TRUTH_GRAPH')}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            activeSubTab === 'TRUTH_GRAPH'
              ? 'bg-gem-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cross-Document Evidence Graph
        </button>
        <button
          onClick={() => setActiveSubTab('MATRIX')}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            activeSubTab === 'MATRIX'
              ? 'bg-gem-navy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Compliance Rules Matrix
        </button>
      </div>

      {/* ── Main Tab Content ── */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">

          {/* 1. Source Documents */}
          <div className="bg-white rounded-lg border border-gem-border shadow-gov p-5 space-y-3">
            <h2 className="font-bold text-sm text-gem-navy">Source Documents</h2>
            <p className="text-xs text-slate-500">Documents submitted by the bidder supporting the evaluation</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
              {selectedBidder.documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gem-navy">
                    <FileText className="w-4 h-4 text-gem-blue flex-shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{doc.type.replace(/_/g, ' ')} • {doc.size}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{doc.checksum}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Extracted Information */}
          <div className="bg-white rounded-lg border border-gem-border shadow-gov p-5 space-y-3">
            <h2 className="font-bold text-sm text-gem-navy">Extracted Information</h2>
            <p className="text-xs text-slate-500">Key values extracted and reconciled by the system</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Declared Turnover</span>
                <span className="font-bold text-sm text-gem-navy">₹{selectedBidder.claimedTurnover} Cr</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Verified Turnover</span>
                <span className={`font-bold text-sm ${selectedBidder.verifiedTurnover < 10 ? 'text-red-700' : 'text-emerald-700'}`}>
                  ₹{selectedBidder.verifiedTurnover} Cr
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">PAN / GSTIN</span>
                <span className="font-mono font-bold text-slate-800">{selectedBidder.pan}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[11px]">Udyam Registration</span>
                <span className="font-mono font-bold text-slate-800">{selectedBidder.udyamNo}</span>
              </div>
            </div>
          </div>

          {/* 3. Cross-Document Comparison & Evidence Status (Section 12) */}
          <div className="bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden">
            <div className="p-4 border-b border-gem-border bg-slate-50">
              <h2 className="font-bold text-sm text-gem-navy">Cross-Document Comparison</h2>
              <p className="text-xs text-slate-500">Reconciliation between bidder claims and verified data sources</p>
            </div>

            <div className="divide-y divide-gem-border text-xs">
              {comparisons.map((c, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-sm text-gem-navy">{c.field}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        c.status === 'Potential Conflict' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {c.status}
                      </span>
                      <button
                        onClick={() => setSelectedField(selectedBidder.crossVerifications[idx] || selectedBidder.crossVerifications[0])}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-[11px] text-gem-navy transition"
                      >
                        Review Evidence
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500 block">Declared Claim:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{c.declared}</p>
                    </div>
                    <div className="p-2.5 bg-blue-50/40 rounded border border-blue-200">
                      <span className="text-[11px] font-semibold text-blue-900 block">Verified Evidence:</span>
                      <p className="font-semibold text-gem-navy mt-0.5">{c.verified}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 italic">
                    Note: {c.implication}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sub-tab 2: Cross-Source Matrix */}
      {activeSubTab === 'CROSS_SOURCE' && <CrossVerificationView />}

      {/* Sub-tab 3: Temporal Compliance */}
      {activeSubTab === 'TEMPORAL' && <TemporalComplianceView />}

      {/* Sub-tab 4: Truth Graph */}
      {activeSubTab === 'TRUTH_GRAPH' && <TruthGraphView />}

      {/* Sub-tab 5: Compliance Matrix */}
      {activeSubTab === 'MATRIX' && <ComplianceMatrixView />}

      {/* Evidence Modal */}
      {selectedField && (
        <EvidenceDetailModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
        />
      )}

    </div>
  );
};
