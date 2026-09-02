import React from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Copy, 
  Hash, 
  Lock, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationField, VerificationStatus } from '../../types';

interface EvidenceDetailModalProps {
  field?: VerificationField | null;
  onClose: () => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({ field, onClose }) => {
  const { selectedBidder, setActiveView } = useApp();

  if (!field) return null;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PASS (VERIFIED)
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-50 text-red-800 border border-red-300 font-bold text-xs">
            <XCircle className="w-4 h-4 text-red-600" /> FAIL (NON-COMPLIANT)
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> CONFLICT DETECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-50 text-yellow-800 border border-yellow-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-yellow-600" /> WARNING / UNVERIFIED
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-elevated border border-gem-border max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-gem-border flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gem-sky rounded text-gem-blue">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gem-navy">Forensic Evidence Inspector</h3>
              <p className="text-xs text-gem-textMuted">
                Field: <span className="font-semibold text-gem-textMain">{field.field}</span> | Bidder: {selectedBidder.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 text-xs text-gem-textMain">
          
          {/* Status and Verification Confidence Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-gem-border rounded-lg">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gem-textSubtle mb-1">
                Verification State
              </p>
              {getStatusBadge(field.status)}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gem-textSubtle mb-1">
                AI Confidence Score
              </p>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gem-blue h-full rounded-full" 
                    style={{ width: `${field.confidence}%` }}
                  />
                </div>
                <span className="font-bold text-gem-navy">{field.confidence}%</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gem-textSubtle mb-1">
                Simulated Registry
              </p>
              <span className="font-mono text-xs font-bold text-gem-navy bg-slate-200/80 px-2 py-0.5 rounded">
                {field.sourceRegistry}
              </span>
            </div>
          </div>

          {/* Side-by-Side Claim vs Verified Source Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bidder Claim */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Bidder Self-Declared Claim
                </span>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <p className="font-bold text-sm text-gem-navy mb-2">{field.bidderClaim}</p>
              <p className="text-[11px] text-slate-600">
                Extracted from submitted bidder PDF documentation with cryptographic OCR timestamp.
              </p>
            </div>

            {/* Verified External Registry */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Simulated Registry Source
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                  {field.sourceRegistry}
                </span>
              </div>
              <p className="font-bold text-sm text-gem-blue mb-2">{field.verifiedSource}</p>
              <p className="text-[11px] text-slate-600">
                Retrieved via simulated institutional data connector endpoint.
              </p>
            </div>
          </div>

          {/* Deep Discrepancy / Forensic Details */}
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-xs text-gem-navy mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-gem-blue" /> Discrepancy & Forensic Analysis
            </h4>
            <p className="text-slate-700 leading-relaxed">{field.details}</p>
          </div>

          {/* Provenance & Evidence Reference Chain */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-gem-navy">Provenance & Cryptographic Metadata</h4>
            <div className="bg-slate-900 text-slate-300 p-3 rounded font-mono text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Evidence Reference:</span>
                <span className="text-slate-200 truncate ml-2">{field.evidenceRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Timestamp:</span>
                <span className="text-slate-200">{field.timestamp} (IST)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Checksum:</span>
                <span className="text-emerald-400 font-mono">sha256:4a8b...19ef [VALID]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Legal Admissibility:</span>
                <span className="text-slate-200">Advisory Decision-Support Only (Procurement Officer Authority)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-gem-border bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              setActiveView('evidence-explorer');
            }}
            className="text-xs text-gem-blue font-semibold hover:underline flex items-center gap-1"
          >
            Open Full Explainable AI Chain <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded transition"
            >
              Close Inspector
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveView('officer-review');
              }}
              className="px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white text-xs font-semibold rounded shadow-sm transition"
            >
              Proceed to Officer Review
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
