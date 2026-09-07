import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  ShieldAlert, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FindingsListView: React.FC = () => {
  const { 
    selectedDepartment,
    selectedTender, 
    selectedBidder, 
    setSelectedFindingIndex,
    setActiveView 
  } = useApp();

  const findings = [
    {
      id: 0,
      title: 'Turnover Mismatch',
      risk: 'HIGH',
      summary: 'Declared average turnover (₹12 Cr) does not match the reference financial evidence (₹8.7 Cr). Discrepancy of -₹3.3 Cr below the tender threshold.',
      clause: 'Tender Clause 3.1 & 4.2'
    },
    {
      id: 1,
      title: 'Safety Certificate Validity Issue',
      risk: 'HIGH',
      summary: 'PESO / ATEX Zone-1 safety certificate expired on 05-Aug-2026, 5 days prior to bid submission cutoff (10-Aug-2026).',
      clause: 'Tender Clause 8.1 & Rule PET-CERT-003'
    },
    {
      id: 2,
      title: 'Address Inconsistency',
      risk: 'MEDIUM',
      summary: 'Bidder declared registered address in Chennai, whereas MCA21 master record indicates Bengaluru.',
      clause: 'Tender Clause 6.1'
    }
  ];

  const handleSelectFinding = (idx: number) => {
    setSelectedFindingIndex(idx);
    setActiveView('finding-details');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Section 13) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Verification Findings</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Compliance inconsistencies detected during automated document and cross-evidence reconciliation.
          </p>
        </div>

        <button
          onClick={() => setActiveView('compliance-matrix')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Matrix</span>
        </button>
      </div>

      {/* ── Persistent Context Bar (Section 3) ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Department</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedDepartment}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Tender</span>
          <span className="font-mono font-bold text-gem-navy mt-0.5 block">{selectedTender.gemBidNo}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bidder</span>
          <span className="font-bold text-gem-navy mt-0.5 block">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Bid ID</span>
          <span className="font-mono font-bold text-gem-blue mt-0.5 block">{selectedBidder.id}</span>
        </div>
      </div>

      {/* ── Findings List Cards (Section 13) ── */}
      <div className="space-y-4">
        {findings.map((f, idx) => {
          const isHigh = f.risk === 'HIGH';
          return (
            <div 
              key={f.id}
              className={`p-5 rounded-xl border bg-white shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-md ${
                isHigh ? 'border-red-200 hover:border-red-400' : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-500">{idx + 1}.</span>
                  <h3 className="font-bold text-base text-gem-navy">{f.title}</h3>
                  <span className={`px-2 py-0.2 rounded font-bold text-[10px] uppercase ${
                    isHigh 
                      ? 'bg-red-100 text-red-900 border border-red-300' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {f.risk} RISK
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-5">
                  {f.summary}
                </p>
                <p className="text-[11px] text-slate-400 pl-5 font-mono">
                  Referenced Condition: {f.clause}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => {
                    handleSelectFinding(f.id);
                    setActiveView('clarification-center');
                  }}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Draft clarification request with shared evidence"
                >
                  <span>Request Clarification</span>
                </button>

                <button
                  onClick={() => handleSelectFinding(f.id)}
                  className="px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Finding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('compliance-matrix')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition"
        >
          Back to Compliance Matrix
        </button>

        <button
          onClick={() => setActiveView('investigation')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Continue to Investigation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
