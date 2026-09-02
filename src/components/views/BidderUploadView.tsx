import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Hash, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Building2,
  FileCheck2,
  Lock,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BidderDocument } from '../../types';

export const BidderUploadView: React.FC = () => {
  const { bidders, selectedBidder, setSelectedBidder, setActiveView } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [extractedSuccess, setExtractedSuccess] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setExtractedSuccess(false);
    setTimeout(() => {
      setIsUploading(false);
      setExtractedSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Bidder Document Ingestion & Evidence Extraction</h1>
          <p className="text-xs text-gem-textMuted mt-0.5">
            OCR Document Parsing, Cryptographic Checksum Computation & Semantic Field Extraction
          </p>
        </div>

        <button
          onClick={() => setActiveView('cross-verification')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition self-start sm:self-auto"
        >
          <span>Run Cross-Source Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Select Bidder Dossier to Ingest */}
      <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gem-blue" />
            <h2 className="font-bold text-sm text-gem-navy">Select Active Bidder Dossier</h2>
          </div>
          <span className="text-xs text-slate-500">5 Pre-Configured Test Bidders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {bidders.map((b) => {
            const isSelected = selectedBidder.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBidder(b)}
                className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-blue-50/80 border-gem-blue ring-2 ring-gem-blue' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-slate-500">{b.pan}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      b.riskProfile.overallRisk === 'HIGH' ? 'bg-red-100 text-red-800' :
                      b.riskProfile.overallRisk === 'CRITICAL' ? 'bg-rose-200 text-rose-900' :
                      b.riskProfile.overallRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {b.riskProfile.overallRisk}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-gem-navy mb-1">{b.name}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Claimed: ₹{b.claimedTurnover} Cr
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Zone & Extraction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Container */}
        <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-gem-navy mb-2">Ingest Additional Bid Documents</h3>
            <p className="text-xs text-gem-textMuted mb-4">
              Upload balance sheets, audited ITRs, ISO certificates or OEM MAF letters.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100 transition">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Drop PDF / DOCX / Scanned Images here</p>
              <p className="text-[10px] text-slate-500 mt-1">Multi-page OCR extraction enabled</p>
              <button
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="mt-3 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-xs font-medium text-slate-700 transition"
              >
                {isUploading ? 'Extracting via AI...' : 'Upload & Parse File'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gem-blue" /> Cryptographic Integrity
            </p>
            <p className="text-slate-600">
              Files are hashed with SHA-256 immediately upon ingestion to guarantee tamper-proof audit trails.
            </p>
          </div>
        </div>

        {/* Ingested Documents List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gem-border shadow-gov overflow-hidden">
          <div className="p-4 border-b border-gem-border bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gem-navy">
                Submitted Documents for {selectedBidder.name} ({selectedBidder.documents.length})
              </h3>
              <p className="text-xs text-gem-textMuted">Extracted text tokens and verified document signatures</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              OCR PARSING: 100% COMPLETE
            </span>
          </div>

          {selectedBidder.documents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>No documents uploaded for this bidder. Click upload above to simulate ingestion.</p>
            </div>
          ) : (
            <div className="divide-y divide-gem-border">
              {selectedBidder.documents.map((doc) => (
                <div key={doc.id} className="p-3.5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gem-sky rounded text-gem-blue mt-0.5">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gem-navy">{doc.name}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.pageCount} Pages</span>
                        <span>•</span>
                        <span>Uploaded: {doc.uploadedAt}</span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-1 truncate max-w-md">
                        {doc.checksum}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
                    EXTRACTED & INDEXED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
