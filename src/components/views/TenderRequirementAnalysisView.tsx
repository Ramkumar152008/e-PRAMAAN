import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Cpu, 
  Scale, 
  Calendar, 
  Layers, 
  ShieldCheck,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TenderRequirementAnalysisView: React.FC = () => {
  const { 
    selectedTender, 
    setActiveView 
  } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  // Exact processing steps from Prompt Section 11
  const processingSteps = [
    'Reading tender...',
    'Extracting clauses...',
    'Identifying eligibility requirements...',
    'Identifying mandatory documents...',
    'Identifying financial requirements...',
    'Identifying experience requirements...',
    'Identifying statutory requirements...',
    'Building compliance rules...'
  ];

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < processingSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }
    }, 320);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Ministry of Petroleum & Natural Gas • Tender: {selectedTender.gemBidNo}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">AI Tender Intelligence & Clause Extractor</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Parses natural-language petroleum RFP/NIT clauses and structures mandatory compliance criteria.
          </p>
        </div>

        <button
          onClick={() => setActiveView('active-tenders')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tenders</span>
        </button>
      </div>

      {/* ── Target Tender Information Box ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Selected Petroleum Procurement NIT / RFP
            </span>
            <h2 className="text-lg font-bold text-[#0F2942] mt-0.5">{selectedTender.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-mono">
              <span>Tender ID: <strong>{selectedTender.gemBidNo}</strong></span>
              <span>•</span>
              <span>Est. Value: <strong>₹{selectedTender.estimatedValue} Cr</strong></span>
              <span>•</span>
              <span>Bid Submission Date: <strong>{selectedTender.bidEndDate}</strong></span>
              <span>•</span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-sans font-bold text-[10px]">
                Demo / Simulated Tender
              </span>
            </div>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs text-white shadow-md transition cursor-pointer ${
              isAnalyzing 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-[#0F2942] hover:bg-[#1E40AF] active:scale-95'
            }`}
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Reading Tender...' : 'Re-Run AI Tender Analysis'}</span>
          </button>
        </div>

        {/* ── Live Step-by-Step Simulation Progress Stream (Section 11) ── */}
        {isAnalyzing && (
          <div className="p-4 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-sky-400" />
                AI Inference Engine Active
              </span>
              <span>Step {currentStepIndex + 1} of {processingSteps.length}</span>
            </div>
            <p className="text-yellow-300 font-semibold pt-1">
              → {processingSteps[currentStepIndex]}
            </p>
          </div>
        )}

        {/* ── Requirements Identified (Section 10 & 11) ── */}
        {analysisComplete && !isAnalyzing && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F2942]">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Requirements Identified ({selectedTender.rules.length} Petroleum Rules Compiled)</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                Extraction Confidence: 98.6%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {selectedTender.rules.map((rule, idx) => (
                <div key={rule.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 hover:bg-white hover:border-blue-300 transition shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#0F2942] text-xs">{rule.metric}</span>
                    </div>
                    <span className="px-2 py-0.2 rounded font-mono text-[9px] font-bold bg-white text-slate-700 border border-slate-300">
                      {rule.category}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-medium pl-7">
                    {rule.description}
                  </p>

                  <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 pl-7">
                    <span>Threshold: <strong className="text-blue-900">{rule.minimumValue} {rule.unit || ''}</strong></span>
                    <span className="font-mono text-blue-700">{rule.referenceClause}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Primary Action Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('active-tenders')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          Back to Tenders
        </button>

        <button
          onClick={() => setActiveView('compliance-rules')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Inspect Tender-to-Rule Compiler</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
