import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  PieChart as PieIcon, 
  HelpCircle, 
  FileSearch, 
  Scale, 
  CreditCard, 
  CalendarClock, 
  FileText, 
  Award, 
  Building2, 
  ShieldCheck,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { RiskFingerprintDimension } from '../../types';

export const RiskIntelligenceView: React.FC = () => {
  const { selectedBidder, selectedTender, setActiveView } = useApp();

  const risk = selectedBidder.riskProfile;
  const fingerprint = risk.fingerprint || {
    overallScore: risk.complianceScore,
    overallLevel: risk.overallRisk,
    confidence: risk.evidenceConfidence,
    aiRecommendation: risk.aiRecommendation,
    modelDisclaimer: 'Prototype Risk Model — Dimensions computed from empirical verification discrepancies for SIH26100.',
    dimensions: [
      {
        dimension: 'FINANCIAL' as const,
        name: 'Financial Risk',
        score: risk.financialRisk,
        severity: 'HIGH' as const,
        reasons: ['Turnover discrepancy of ₹3.30 Cr between claimed (₹12 Cr) and verified (₹8.7 Cr)'],
        evidenceCited: ['MCA21 Form AOC-4', 'CA Turnover Statement']
      },
      {
        dimension: 'TEMPORAL' as const,
        name: 'Temporal Risk',
        score: risk.temporalRisk || 85,
        severity: 'CRITICAL' as const,
        reasons: ['PESO Safety Certificate expired on 05-Aug-2026 before 10-Aug-2026 bid date'],
        evidenceCited: ['Certificate #PESO-EX-2023-88912']
      },
      {
        dimension: 'DOCUMENT' as const,
        name: 'Document Risk',
        score: risk.documentRisk,
        severity: 'MEDIUM' as const,
        reasons: ['CA turnover statement lacks UDIN verification number'],
        evidenceCited: ['CA Certificate FY23-26']
      },
      {
        dimension: 'ELIGIBILITY' as const,
        name: 'Eligibility Risk',
        score: risk.eligibilityRisk,
        severity: 'LOW' as const,
        reasons: ['Clean debarment check across CPPP and GeM blacklist repositories'],
        evidenceCited: ['CPPP Repository']
      },
      {
        dimension: 'IDENTITY' as const,
        name: 'Identity Risk',
        score: risk.identityRisk || 8,
        severity: 'LOW' as const,
        reasons: ['PAN, GSTIN and Udyam registrations matched 100%'],
        evidenceCited: ['PAN Registry', 'GSTN GSTR-3B']
      },
      {
        dimension: 'SOURCE_RELIABILITY' as const,
        name: 'Source Reliability',
        score: risk.sourceReliability || 94,
        severity: 'LOW' as const,
        reasons: ['11 of 11 verification adapters responded successfully with current records'],
        evidenceCited: ['Verification Hub Adapter Telemetry']
      }
    ]
  };

  const radarData = [
    { subject: 'Financial Risk', score: risk.financialRisk, fullMark: 100 },
    { subject: 'Temporal Risk', score: risk.temporalRisk || 85, fullMark: 100 },
    { subject: 'Document Risk', score: risk.documentRisk, fullMark: 100 },
    { subject: 'Eligibility Risk', score: risk.eligibilityRisk, fullMark: 100 },
    { subject: 'Identity Risk', score: risk.identityRisk || 8, fullMark: 100 },
    { subject: 'Uncertainty', score: 100 - risk.evidenceConfidence, fullMark: 100 }
  ];

  const getDimensionIcon = (dim: string) => {
    switch (dim) {
      case 'FINANCIAL': return <CreditCard className="w-4 h-4 text-red-600" />;
      case 'TEMPORAL': return <CalendarClock className="w-4 h-4 text-rose-600" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-amber-600" />;
      case 'ELIGIBILITY': return <Award className="w-4 h-4 text-blue-600" />;
      case 'IDENTITY': return <Building2 className="w-4 h-4 text-teal-600" />;
      case 'SOURCE_RELIABILITY': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <Activity className="w-4 h-4 text-blue-700" />
            <span>Petroleum Bid Compliance • Explainable Risk Evaluation</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Compliance Risk Fingerprint</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Multi-dimensional explainable risk stratification for <strong className="text-[#0F2942]">{selectedBidder.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('compliance-matrix')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Compliance Matrix</span>
          </button>

          <button
            onClick={() => setActiveView('investigation-priority')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Ranked Investigation Queue →</span>
          </button>
        </div>
      </div>

      {/* ── Statutory Disclaimer Banner (Section 10 & 44) ── */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2.5 shadow-2xs">
        <Scale className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="text-blue-900 font-bold">Public Procurement Advisory Rule:</strong> The Risk Fingerprint is an advisory heuristic computed from empirical registry discrepancies. It is non-binding decision support and does not automatically reject the bidder.
        </div>
      </div>

      {/* ── 6 Core Risk Dimension Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Compliance Score</span>
          <p className="text-2xl font-extrabold text-[#0F2942] mt-1">{risk.complianceScore}%</p>
          <span className="text-[10px] text-slate-500">Overall Rule Alignment</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evidence Confidence</span>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{risk.evidenceConfidence}%</p>
          <span className="text-[10px] text-slate-500">Registry & OCR Certainty</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Financial Risk</span>
          <p className="text-2xl font-extrabold text-red-700 mt-1">{risk.financialRisk}%</p>
          <span className="text-[10px] text-red-800">Turnover Deficit Gap</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Temporal Risk</span>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">{risk.temporalRisk || 85}%</p>
          <span className="text-[10px] text-rose-800">-5 Days Expiration Deficit</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Document Risk</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{risk.documentRisk}%</p>
          <span className="text-[10px] text-amber-800">Missing UDIN Verification</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-gov">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Overall Risk</span>
          <p className="text-2xl font-extrabold text-red-700 mt-1">HIGH</p>
          <span className="text-[10px] text-red-800">Officer Review Required</span>
        </div>
      </div>

      {/* ── Radar Chart & Dimension Breakdown Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Recharts Radar Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-bold text-sm text-[#0F2942]">Risk Radar Visualization</span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              6-Axis Heuristic
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <Radar name="Risk Index" dataKey="score" stroke="#DC2626" fill="#EF4444" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#0F2942', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 italic text-center border-t border-slate-100 pt-2">
            Peak exposure points: Financial Risk (72%) & Temporal Risk (85%).
          </p>
        </div>

        {/* Right 7 Cols: Explainable Dimensions Cards (Section 10) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F2942]">Explainable Risk Dimensions (Scores & Evidence Reasons)</h3>
            <span className="text-xs text-slate-500 font-mono">Derived from Verified Registry Findings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {fingerprint.dimensions.map((dim, idx) => {
              const isCritical = dim.severity === 'CRITICAL';
              const isHigh = dim.severity === 'HIGH';
              const isMed = dim.severity === 'MEDIUM';

              return (
                <div 
                  key={idx}
                  className={`bg-white rounded-xl border p-4 space-y-2 shadow-2xs ${
                    isCritical 
                      ? 'border-rose-300 bg-rose-50/20' 
                      : isHigh 
                      ? 'border-red-200 bg-red-50/20' 
                      : isMed 
                      ? 'border-amber-200 bg-amber-50/20' 
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      {getDimensionIcon(dim.dimension)}
                      <span>{dim.name}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      isCritical ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                      isHigh ? 'bg-red-100 text-red-900 border border-red-300' :
                      isMed ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {dim.score}% ({dim.severity})
                    </span>
                  </div>

                  <ul className="space-y-1 text-[11px] text-slate-700 pl-4 list-disc">
                    {dim.reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Evidence Cited:</span>
                    <span className="font-mono text-slate-700 font-semibold">{dim.evidenceCited.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Bottom Navigation ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('compliance-matrix')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Compliance Matrix
        </button>

        <button
          onClick={() => setActiveView('investigation-priority')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Investigation Queue (P1-P4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
