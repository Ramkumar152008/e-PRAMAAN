import React, { useState } from 'react';
import { 
  PlusCircle, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Cpu, 
  FileCode2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { simulateTenderAnalysis } from '../../services/tenderRuleEngine';

export const CreateEvaluationView: React.FC = () => {
  const { tenders, selectedTender, setSelectedTender, setActiveView } = useApp();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    await simulateTenderAnalysis(selectedTender, (step) => {
      setCurrentStepText(step);
    });
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gem-navy">Create GeM Tender Evaluation Dossier</h1>
        <p className="text-xs text-gem-textMuted mt-0.5">
          Ingest RFP / NIT Tender Documents and Compile Natural Language Criteria into Verifiable Structured Machine Rules
        </p>
      </div>

      {/* Tender Selection / Upload Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option A: Select Pre-Loaded GeM Tender */}
        <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gem-border">
            <FileText className="w-5 h-5 text-gem-blue" />
            <h2 className="font-bold text-sm text-gem-navy">Option A: Select Active GeM Tender</h2>
          </div>

          <div className="space-y-3">
            {tenders.map((t) => {
              const isSelected = selectedTender.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTender(t);
                    setAnalysisComplete(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition text-xs ${
                    isSelected 
                      ? 'bg-blue-50/70 border-gem-blue ring-1 ring-gem-blue' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold text-gem-blue mb-1">
                    <span>{t.gemBidNo}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 text-slate-700">
                      Est: ₹{t.estimatedValue} Cr
                    </span>
                  </div>
                  <p className="font-semibold text-gem-navy text-xs mb-1">{t.title}</p>
                  <p className="text-[11px] text-slate-500">{t.ministry} • {t.department}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Option B: Upload Custom RFP / NIT */}
        <div className="bg-white p-5 rounded-lg border border-gem-border shadow-gov flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-gem-border">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-sm text-gem-navy">Option B: Ingest Custom Tender Document</h2>
            </div>
            <p className="text-xs text-gem-textMuted mt-3">
              Upload PDF, DOCX or scanned NIT. e-BID PRAMAAN will perform OCR clause extraction and classification.
            </p>

            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-gem-blue transition-colors bg-slate-50">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Drag & Drop Tender NIT / RFP file here</p>
              <p className="text-[10px] text-slate-500 mt-1">Supported: PDF, DOCX (Max 25 MB)</p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                }}
              />
              <label
                htmlFor="file-upload"
                className="mt-3 inline-block px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Browse Local Files
              </label>
              {selectedFile && (
                <p className="text-xs font-bold text-emerald-700 mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Document checksum will be verified against GeM CPPP SHA-256 ledger.</span>
          </div>
        </div>

      </div>

      {/* Trigger AI Analysis Button */}
      <div className="bg-white p-6 rounded-lg border border-gem-border shadow-gov space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-gem-navy">AI Tender Clause Parser & Rule Compiler</h3>
            <p className="text-xs text-gem-textMuted">
              Target: <strong className="text-gem-navy">{selectedTender.gemBidNo}</strong> ({selectedTender.rawClauses.length} Raw Legal Clauses Identified)
            </p>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded font-bold text-xs text-white shadow-sm transition ${
              isAnalyzing 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gem-blue hover:bg-gem-blueHover active:scale-95'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Parsing Legal Clauses...' : 'Start AI Tender Analysis'}</span>
          </button>
        </div>

        {/* Live Simulation Progress Stream */}
        {isAnalyzing && (
          <div className="p-4 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-gem-accent" />
                AI Inference Engine Active
              </span>
              <span>Processing...</span>
            </div>
            <p className="text-yellow-300 font-semibold">{currentStepText}</p>
          </div>
        )}

        {/* Successful Compilation Report Card */}
        {analysisComplete && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Successfully Compiled 7 Verifiable Machine Rules with 97.4% Extraction Confidence</span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                COMPILATION COMPLETE
              </span>
            </div>

            <p className="text-xs text-slate-700">
              Rules classified into: <strong>Financial (Turnover), Statutory (GSTIN/Udyam), Temporal (ISO validity on bid date), OEM Authorization, and Debarment Check.</strong>
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveView('tender-register')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded text-xs font-bold shadow-sm transition"
              >
                <span>Inspect Structured Rule Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
