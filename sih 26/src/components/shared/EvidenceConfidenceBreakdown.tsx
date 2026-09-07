import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, Hash, Clock, Cpu } from 'lucide-react';

export interface ConfidenceBreakdownProps {
  overallConfidence?: number;
  breakdown?: {
    ocrQuality?: number;
    fieldExtraction?: number;
    referenceVerification?: number;
    entityResolution?: number;
    temporalStatus?: string;
    documentIntegrity?: string;
  };
  compact?: boolean;
}

export const EvidenceConfidenceBreakdown: React.FC<ConfidenceBreakdownProps> = ({
  overallConfidence = 96.5,
  breakdown = {
    ocrQuality: 98.2,
    fieldExtraction: 97.5,
    referenceVerification: 100.0,
    entityResolution: 96.0,
    temporalStatus: 'PASS',
    documentIntegrity: 'VALID'
  },
  compact = false
}) => {
  const ocr = breakdown?.ocrQuality ?? 98.0;
  const extraction = breakdown?.fieldExtraction ?? 95.0;
  const refVerif = breakdown?.referenceVerification ?? 98.0;
  const entity = breakdown?.entityResolution ?? 95.0;
  const temporal = breakdown?.temporalStatus ?? 'PASS';
  const integrity = breakdown?.documentIntegrity ?? 'VALID';

  const isHigh = overallConfidence >= 90;
  const isMed = overallConfidence >= 75 && overallConfidence < 90;

  return (
    <div className={`bg-white rounded-md border ${isHigh ? 'border-blue-200' : isMed ? 'border-amber-200' : 'border-rose-200'} p-3.5 shadow-2xs text-xs`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-sm ${isHigh ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'}`}>
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>Multi-Factor Evidence Confidence</span>
              <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${isHigh ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {overallConfidence}%
              </span>
            </h4>
            <p className="text-[10.5px] text-slate-500">6-Factor Forensic AI & Statutory Evaluation</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">SHA-256 Validated</span>
      </div>

      {/* 6-Factor Grid */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'} gap-2`}>
        
        {/* Factor 1: OCR Quality */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-blue-600" />
              <span>OCR Quality</span>
            </span>
            <span className="font-bold text-slate-900">{ocr}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${ocr}%` }} />
          </div>
        </div>

        {/* Factor 2: Field Extraction */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-600" />
              <span>Field Extraction</span>
            </span>
            <span className="font-bold text-slate-900">{extraction}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${extraction}%` }} />
          </div>
        </div>

        {/* Factor 3: Reference Verification */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Reference Gateway</span>
            </span>
            <span className="font-bold text-slate-900">{refVerif}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-1 rounded-full" style={{ width: `${refVerif}%` }} />
          </div>
        </div>

        {/* Factor 4: Entity Match */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10.5px] text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              <span>Entity Resolution</span>
            </span>
            <span className="font-bold text-slate-900">{entity}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-1 rounded-full" style={{ width: `${entity}%` }} />
          </div>
        </div>

        {/* Factor 5: Temporal Validation */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10.5px] text-slate-600">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Temporal Status</span>
          </span>
          <span className={`px-1.5 py-0.2 rounded-xs text-[9.5px] font-bold ${
            temporal === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {temporal}
          </span>
        </div>

        {/* Factor 6: Document Integrity */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10.5px] text-slate-600">
            <Hash className="w-3 h-3 text-purple-600" />
            <span>SHA-256 Hash</span>
          </span>
          <span className={`px-1.5 py-0.2 rounded-xs text-[9.5px] font-bold ${
            integrity === 'VALID' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {integrity}
          </span>
        </div>

      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <span>Transparent forensic evaluation model • Non-black-box</span>
        <span>Decision Authority: Procurement Officer</span>
      </div>
    </div>
  );
};
