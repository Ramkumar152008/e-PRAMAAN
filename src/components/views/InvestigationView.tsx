import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  MessageSquare, 
  ShieldAlert,
  ListOrdered,
  Sparkles,
  Bot,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InvestigationView: React.FC = () => {
  const { 
    selectedDepartment,
    selectedTender, 
    selectedBidder, 
    setSelectedFindingIndex,
    setActiveView 
  } = useApp();

  const [selectedQuestion, setSelectedQuestion] = useState<string>('Why is this bidder high risk?');
  const [copilotAnswer, setCopilotAnswer] = useState<string>(
    'Two material issues require officer verification for ABC Energy Systems Pvt Ltd:\n1. Turnover mismatch: Bidder declared ₹12.0 Cr. Reference financial filings (MCA21 Form AOC-4) record ₹8.70 Cr (-27.5% Deficit below tender ₹10 Cr threshold).\n2. Safety Certificate validity: Submitted PESO / ATEX Zone-1 safety certificate expired on 05-Aug-2026, 5 days prior to the mandatory bid submission deadline of 10-Aug-2026.\n\nRecommended next step: Request formal UDIN turnover reconciliation and PESO renewal proof before making a technical evaluation determination.'
  );

  const copilotQA: { [key: string]: string } = {
    'Why is this bidder high risk?': 
      'Two material issues require officer verification for ABC Energy Systems Pvt Ltd:\n1. Turnover mismatch: Bidder declared ₹12.0 Cr. Reference financial filings (MCA21 Form AOC-4) record ₹8.70 Cr (-27.5% Deficit below tender ₹10 Cr threshold).\n2. Safety Certificate validity: Submitted PESO / ATEX Zone-1 safety certificate expired on 05-Aug-2026, 5 days prior to the mandatory bid submission deadline of 10-Aug-2026.\n\nRecommended next step: Request formal UDIN turnover reconciliation and PESO renewal proof before making a technical evaluation determination.',
    'Show conflicting evidence':
      'Identified Evidence Conflicts:\n• Parameter: Average Annual Turnover (Last 3 FY)\n  - Bidder Claim: ₹12.00 Crore (CA Statement)\n  - Government Reference: ₹8.70 Crore (MCA21 Form AOC-4)\n  - Discrepancy: -₹3.30 Crore (-27.5%)\n• Parameter: Operating Address\n  - Bidder Claim: Chennai (Branch / Project Office)\n  - MCA Master: Bengaluru (Registered Corporate Office)',
    'Show expired documents':
      'Temporal Validity Findings:\n• Document: Petroleum Safety Certificate (PESO / ATEX Zone-1 Flameproof)\n  - Certificate Number: PESO-EX-2023-88912\n  - Expiry Date: 05-Aug-2026\n  - Tender Bid Deadline: 10-Aug-2026\n  - Status: Expired 5 days prior to bid submission cutoff. Non-compliant with Tender Clause 8.1 unless formal renewal endorsement exists.',
    'Show missing requirements':
      'Missing Document Assessment:\n• All mandatory submission document categories were uploaded by the bidder.\n• Supporting UDIN verification token for the CA Turnover Certificate is pending reconciliation, and direct OEM confirmation for MAF sensor token is required.',
    'Why does this finding matter?':
      'Regulatory & Procurement Impact:\n• Financial Eligibility: Clause 4.2 mandates ₹10 Cr minimum turnover under General Financial Rules (GFR). If verified revenue is ₹8.7 Cr, the bidder does not meet the qualification threshold.\n• Safety Certification Integrity: Mandatory under Petroleum Rules and OISD standards for explosive hydrocarbon environments.',
    'What should I verify?':
      'Officer Checklist for Next Actions:\n1. Check if bidder submitted a valid UDIN on the CA reconciliation certificate.\n2. Ask bidder to reconcile standalone vs consolidated revenue in Form AOC-4.\n3. Request valid PESO safety renewal confirmation issued on or before 10-Aug-2026.\n4. Route OEM MAF token to equipment manufacturer gateway.',
    'Prepare clarification request':
      'Automated Clarification Drafter Ready:\nA formal GeM Clause 14(c) Clarification Notice #CLAR-2026-001 has been generated in the Clarification Centre. Click "Open Clarification Centre" to review, edit, and approve the notice for bidder dispatch.'
  };

  const handleAskQuestion = (q: string) => {
    setSelectedQuestion(q);
    setCopilotAnswer(copilotQA[q] || 'Advisory evaluation available.');
  };

  const prioritizedFindings = [
    {
      id: 'P1-TURNOVER',
      priority: 'P1',
      finding: 'Turnover Mismatch (-₹3.3 Cr variance)',
      severity: 'HIGH',
      impact: 'Financial Eligibility (Clause 4.2)',
      confidence: '99%',
      timeSensitivity: 'High (Pre-Opening)',
      specialistRequired: 'CA / Finance Reviewer',
      index: 0
    },
    {
      id: 'P2-ISO',
      priority: 'P2',
      finding: 'Expired ISO 9001 Quality Certificate',
      severity: 'HIGH',
      impact: 'Mandatory Technical Qualification',
      confidence: '98%',
      timeSensitivity: 'Immediate (Bid Date)',
      specialistRequired: 'Technical Committee',
      index: 1
    },
    {
      id: 'P3-MII',
      priority: 'P3',
      finding: 'Local Content Cost Breakdown Audit',
      severity: 'MEDIUM',
      impact: 'Preference Eligibility (Clause 9.1)',
      confidence: '88%',
      timeSensitivity: 'Moderate',
      specialistRequired: 'Officer Review',
      index: 2
    }
  ];

  const handleOpenFinding = (index: number) => {
    setSelectedFindingIndex(index);
    setActiveView('finding-details');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Feature 6 & 8) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Investigation & AI Copilot</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Prioritized compliance backlog and interactive AI investigation assistant for tender-aware evaluation.
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

      {/* ── Persistent Context Bar ── */}
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

      {/* ── Feature 8: Investigation Priority Engine Table ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gem-border flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-gem-navy">
            <ListOrdered className="w-4 h-4 text-gem-blue" />
            <span>Investigation Priority Queue ({prioritizedFindings.length} Ranked Items)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ranked by risk severity & audit impact</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-gem-border">
                <th className="p-3">Priority</th>
                <th className="p-3">Finding</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Tender Impact</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Time Sensitivity</th>
                <th className="p-3">Specialist Required</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gem-border">
              {prioritizedFindings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      item.priority === 'P1' 
                        ? 'bg-red-100 text-red-900 border border-red-300' 
                        : item.priority === 'P2'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-slate-900">
                    {item.finding}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                      item.severity === 'HIGH' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.severity}
                    </span>
                  </td>

                  <td className="p-3 text-slate-700 font-medium">
                    {item.impact}
                  </td>

                  <td className="p-3 font-mono text-emerald-700 font-bold">
                    {item.confidence}
                  </td>

                  <td className="p-3 text-slate-600 text-[11px]">
                    {item.timeSensitivity}
                  </td>

                  <td className="p-3 font-semibold text-purple-900">
                    {item.specialistRequired}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenFinding(item.index)}
                      className="px-3 py-1 bg-gem-navy hover:bg-gem-navyLight text-white font-bold rounded text-xs transition"
                    >
                      Open Finding
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Feature 6: AI Investigation Copilot / Assistant Panel ── */}
      <div className="bg-white rounded-xl border border-gem-border shadow-gov p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gem-navy text-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gem-navy">AI Investigation Assistant</h2>
              <p className="text-xs text-slate-500">Ask evidence-based advisory questions for {selectedBidder.name}</p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-blue-50 text-gem-navy px-2.5 py-1 rounded font-bold border border-blue-200">
            Advisory Decision Support
          </span>
        </div>

        {/* Predefined Quick Questions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.keys(copilotQA).map((q) => (
            <button
              key={q}
              onClick={() => handleAskQuestion(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                selectedQuestion === q
                  ? 'bg-gem-navy text-white border-gem-navy shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Copilot Response Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gem-navy font-bold">
            <Sparkles className="w-4 h-4 text-gem-blue" />
            <span>Assistant Evaluation: {selectedQuestion}</span>
          </div>
          <p className="text-slate-800 whitespace-pre-line leading-relaxed font-sans font-medium">
            {copilotAnswer}
          </p>
        </div>

        {/* Governance Disclaimer */}
        <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
          <Scale className="w-4 h-4 text-gem-blue flex-shrink-0" />
          <span>
            The Investigation Assistant provides automated advisory synthesis. Final eligibility decisions remain 100% with the authorized Procurement Officer.
          </span>
        </div>
      </div>

      {/* ── Secondary Clarification Action Banner ── */}
      <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-amber-900 block">Clarification / Specialist Review Required?</span>
          <p className="text-amber-800 mt-0.5">
            Issue formal GeM Clause 14(c) clarification notices or forward evidence packages to CA / Technical Reviewers.
          </p>
        </div>

        <button
          onClick={() => setActiveView('clarification-center')}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-2xs transition self-start sm:self-auto whitespace-nowrap"
        >
          Open Clarification Centre →
        </button>
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
          onClick={() => setActiveView('decision')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Continue to Officer Decision</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
