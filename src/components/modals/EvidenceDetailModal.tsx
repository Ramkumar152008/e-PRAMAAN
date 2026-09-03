import React from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Clock, 
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationField, VerificationStatus } from '../../types';

interface EvidenceDetailModalProps {
  field?: VerificationField | null;
  onClose: () => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({ field, onClose }) => {
  const { selectedBidder, selectedTender, setActiveView } = useApp();

  if (!field) return null;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>VERIFIED</span>
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-red-100 text-red-800 border border-red-300 font-bold text-xs">
            <XCircle className="w-3.5 h-3.5 text-red-700" />
            <span>DISCREPANCY IDENTIFIED</span>
          </span>
        );
      case 'CONFLICT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>REVIEW REQUIRED</span>
          </span>
        );
    }
  };

  const chainSteps = [
    { label: 'Tender Requirement', value: `Clause Requirement under ${selectedTender.gemBidNo}` },
    { label: 'Compliance Rule', value: `Rule: ${field.field} Verification` },
    { label: 'Bidder Document', value: field.evidenceRef || 'Submitted Dossier PDF' },
    { label: 'Extracted Evidence', value: field.bidderClaim },
    { label: 'Reference Evidence', value: `${field.sourceRegistry}: ${field.verifiedSource}` },
    { label: 'Comparison', value: field.details },
    { label: 'Finding', value: field.status === 'PASS' ? 'VERIFIED' : 'REVIEW REQUIRED' },
    { label: 'Officer Action', value: 'Discrepancy identified — Officer Action Required.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-xl border border-slate-300 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-150 text-xs font-sans">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-900 rounded-sm">
              <ShieldAlert className="w-4 h-4 text-blue-800" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                COMPLIANCE ISSUE DETAILS
              </span>
              <h3 className="font-bold text-base text-[#0F2942]">{field.field}</h3>
              <p className="text-[11px] text-slate-500">
                Bidder: <strong className="text-slate-800">{selectedBidder.name}</strong> • Tender: <strong className="font-mono text-slate-800">{selectedTender.gemBidNo}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-sm hover:bg-slate-200 transition cursor-pointer font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 space-y-4 text-xs text-slate-900">
          
          {/* Finding & Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                Finding Status
              </p>
              {getStatusBadge(field.status)}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                Extraction Confidence
              </p>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-800 h-full rounded-full" 
                    style={{ width: `${field.confidence || 95}%` }}
                  />
                </div>
                <span className="font-bold text-[#0F2942]">{field.confidence || 95}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                Reference Registry Source
              </p>
              <span className="font-mono text-xs font-bold text-blue-950 bg-white px-2 py-0.5 rounded-sm border border-slate-300">
                {field.sourceRegistry}
              </span>
            </div>
          </div>

          {/* Side-by-Side Comparison: Bidder Evidence vs Reference Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Bidder Evidence */}
            <div className="p-3.5 bg-white border border-slate-300 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  Bidder Submitted Evidence
                </span>
                <FileText className="w-3.5 h-3.5 text-blue-800" />
              </div>
              <p className="font-bold text-xs text-[#0F2942]">{field.bidderClaim}</p>
              <p className="text-[11px] text-slate-600">
                Document Ref: <strong className="font-mono text-slate-800">{field.evidenceRef || 'Submitted Dossier PDF'}</strong>
              </p>
            </div>

            {/* Reference Evidence */}
            <div className="p-3.5 bg-white border border-slate-300 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  Reference Evidence
                </span>
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <p className="font-bold text-xs text-blue-900">{field.verifiedSource}</p>
              <p className="text-[11px] text-slate-600">
                Registry Source: <strong className="text-slate-800">{field.sourceRegistry}</strong>
              </p>
            </div>

          </div>

          {/* Comparison & Discrepancy Finding */}
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-sm space-y-1">
            <h4 className="font-bold text-xs text-[#0F2942] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-800" /> 
              <span>Comparison & Finding</span>
            </h4>
            <p className="text-slate-800 leading-relaxed font-medium">
              {field.details}
            </p>
          </div>

          {/* 8-Node Linear Traceability Chain (Prompt Section 15) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F2942]">
              <Layers className="w-3.5 h-3.5 text-blue-800" />
              <span>Evidence Traceability Chain (8 Steps)</span>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 space-y-1.5">
              {chainSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <strong className="text-[#0F2942]">{step.label}: </strong>
                    <span className="text-slate-700">{step.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Microcopy: Officer Responsibility Notice */}
          <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-sm text-[11px] text-slate-600 flex items-center gap-2">
            <span>
              <strong>Officer Action:</strong> Discrepancy identified — Officer Action Required. Verification provides decision support; final procurement determination remains with the authorized officer.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 rounded-b-md flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-sm transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveView('bid-verification');
            }}
            className="px-4 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-sm shadow-2xs transition cursor-pointer"
          >
            Open in Bid Verification
          </button>
        </div>

      </div>
    </div>
  );
};
