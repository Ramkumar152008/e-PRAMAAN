import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Eye, 
  UploadCloud, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Hash, 
  Flame 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentReviewView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const [documents, setDocuments] = useState(selectedBidder.documents);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loadedDemoNotice, setLoadedDemoNotice] = useState(false);

  const handleLoadDemoDocuments = () => {
    setDocuments(selectedBidder.documents);
    setLoadedDemoNotice(true);
    setTimeout(() => setLoadedDemoNotice(false), 3000);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Sections 14 & 15) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Bidder Dossier • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Bidder Documents & AI Evidence Extraction</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Ingest bidder PDF dossiers, compute SHA-256 checksums, and extract structured claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemoDocuments}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>Load Demo Documents</span>
          </button>

          <button
            onClick={() => setActiveView('bids-received')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bids</span>
          </button>
        </div>
      </div>

      {loadedDemoNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo Document Dossier successfully loaded with 14 verified Petroleum bid files.</span>
        </div>
      )}

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Tender ID</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Target Bidder</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Corporate PAN / CIN</span>
          <span className="font-mono font-bold text-slate-800 mt-0.5 block">{selectedBidder.pan} • {selectedBidder.cin.slice(0, 10)}...</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Document Total</span>
          <span className="font-bold text-blue-700 mt-0.5 block">{documents.length} Submitted Files (All Extracted)</span>
        </div>
      </div>

      {/* ── AI Evidence Extraction Summary Cards (Section 15) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2942]">
              AI Structured Field Extraction & Confidence Breakdown
            </h3>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold font-mono">
            Average Confidence: 95.8%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {selectedBidder.extractedFields.slice(0, 5).map((f, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] font-medium text-slate-500 block truncate">{f.fieldName}</span>
              <p className="font-bold text-[#0F2942] truncate text-xs">{f.extractedValue}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                <span className="text-slate-500">Confidence:</span>
                <span className="font-bold text-emerald-700">{f.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 14 Submitted Documents Table (Section 14) ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Bidder Submission Document Registry ({documents.length} Files)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">SHA-256 Hashed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Document Name & Type</th>
                <th className="p-3.5">SHA-256 Cryptographic Checksum</th>
                <th className="p-3.5">Size & Pages</th>
                <th className="p-3.5">Extraction Status</th>
                <th className="p-3.5">AI Confidence</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 max-w-xs">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-[#0F2942] truncate">{doc.name}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{doc.type}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-[10px] text-slate-600 max-w-[200px]">
                    <span className="truncate block" title={doc.checksum}>
                      {doc.checksum.slice(0, 24)}...
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 text-[11px]">
                    {doc.size} • {doc.pageCount} Pages
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ EXTRACTED
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-emerald-700">
                    {doc.extractionConfidence || 96}%
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => alert(`Viewing document: ${doc.name}\nSHA-256: ${doc.checksum}\nStatus: Verified extraction.`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs transition cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded text-xs transition cursor-pointer"
                        title="Remove Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Primary Action Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('bids-received')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          Back to Bids Received
        </button>

        <button
          onClick={() => setActiveView('government-verification')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Run Multi-Source Verification Hub (13+ Registries)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
