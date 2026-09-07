import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  XCircle,
  Building2,
  Calendar,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BidOverviewView: React.FC = () => {
  const { 
    selectedDepartment,
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const [selectedPassportItem, setSelectedPassportItem] = useState<any | null>(null);

  const passportGrid = [
    {
      id: 'PAN',
      title: 'PAN Registration',
      status: 'VERIFIED',
      value: selectedBidder.pan,
      evidence: 'CBDT PAN Registry match (Active & Operative)',
      refNo: 'CBDT-PAN-001'
    },
    {
      id: 'GST',
      title: 'GSTIN Registration',
      status: 'VERIFIED',
      value: selectedBidder.gstin,
      evidence: 'GSTN Gateway 36 regular GSTR-3B filings (Karnataka jurisdiction)',
      refNo: 'GSTN-29-REG'
    },
    {
      id: 'UDYAM',
      title: 'Udyam / MSME',
      status: 'VERIFIED',
      value: selectedBidder.udyamNo,
      evidence: 'Active Medium Enterprise under NIC 26201 (Manufacturing)',
      refNo: 'UDYAM-KA-01'
    },
    {
      id: 'ITR',
      title: 'Income Tax (ITR)',
      status: 'VERIFIED',
      value: 'FY23-26 ITR-V Filed',
      evidence: 'Regular corporate tax filings confirmed across previous 3 financial years',
      refNo: 'ITR-V-FY26'
    },
    {
      id: 'MCA21',
      title: 'MCA21 Financials',
      status: 'POTENTIAL ISSUE',
      value: 'Turnover Variance',
      evidence: 'Claimed ₹12.0 Cr vs MCA21 Form AOC-4 revenue ₹8.7 Cr (-27.5% Deficit)',
      refNo: 'MCA-AOC4-99214'
    },
    {
      id: 'EPFO',
      title: 'EPFO Labour',
      status: 'VERIFIED',
      value: '142 Active Members',
      evidence: 'KN/BNG/0088124/000 with regular monthly ECR remittances',
      refNo: 'EPFO-KN-BNG'
    },
    {
      id: 'ESIC',
      title: 'ESIC Security',
      status: 'VERIFIED',
      value: 'Active Remitter',
      evidence: '53000991240001001 with up-to-date monthly contribution records',
      refNo: 'ESIC-5300'
    },
    {
      id: 'STARTUP',
      title: 'Startup India',
      status: 'VERIFIED',
      value: 'DIPP88214',
      evidence: 'DPIIT recognized entity certificate active',
      refNo: 'DIPP-STARTUP-88'
    },
    {
      id: 'NSIC',
      title: 'NSIC SPRS',
      status: 'VERIFIED',
      value: 'Active SPRS',
      evidence: 'Single Point Registration Scheme certificate active till Nov-2027',
      refNo: 'NSIC-BNG-2024'
    },
    {
      id: 'OEM',
      title: 'OEM Authorization',
      status: 'VERIFIED',
      value: 'MAF Verified',
      evidence: 'Tier-1 Hardware OEM Token: OEM-AUTH-2026-991204 (Valid till 31-Dec-2026)',
      refNo: 'OEM-AUTH-991204'
    },
    {
      id: 'DIGILOCKER',
      title: 'DigiLocker Exchange',
      status: 'VERIFIED',
      value: '8/8 Checksums Valid',
      evidence: 'All submitted certificates match cryptographic SHA-256 DigiLocker hashes',
      refNo: 'DGL-SHA-VER'
    },
    {
      id: 'MII',
      title: 'Make in India',
      status: 'REQUIRES REVIEW',
      value: '62.4% Local Content',
      evidence: 'Class-I Local Supplier claim requires officer cost breakdown audit',
      refNo: 'MII-624-REV'
    },
    {
      id: 'BIS',
      title: 'BIS / DPIIT (ISO)',
      status: 'POTENTIAL ISSUE',
      value: 'Expired 05-Aug-2026',
      evidence: 'ISO 9001:2015 expired 5 days before bid submission deadline (10-Aug-2026)',
      refNo: 'BIS-ISO-EXP'
    },
    {
      id: 'DEBAR',
      title: 'Debarment Registry',
      status: 'CLEAR',
      value: 'No Adverse Records',
      evidence: 'Zero blacklisting / holiday listing entries across CPPP and GeM repository',
      refNo: 'DEBAR-CLEAR-001'
    }
  ];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">VERIFIED</span>;
      case 'CLEAR':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-100 text-teal-800 border border-teal-300">CLEAR</span>;
      case 'POTENTIAL ISSUE':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">POTENTIAL ISSUE</span>;
      case 'REQUIRES REVIEW':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-900 border border-blue-300">REQUIRES REVIEW</span>;
      case 'MISSING':
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-300">MISSING</span>;
      case 'NOT APPLICABLE':
      default:
        return <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-300">NOT APPLICABLE</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header (Feature 2: Bidder Compliance Passport) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gem-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gem-navy">Bidder Compliance Passport</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Single consolidated compliance passport verifying statutory, technical, and regulatory standings.
          </p>
        </div>

        <button
          onClick={() => setActiveView('bids-received')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bids</span>
        </button>
      </div>

      {/* ── Prominent Passport Card ── */}
      <div className="bg-white rounded-xl border-2 border-gem-navy/20 shadow-gov p-6 space-y-6">
        
        {/* Top Passport Identification Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Bidder Name</span>
            <span className="font-bold text-gem-navy text-sm block mt-0.5">{selectedBidder.name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Bid ID</span>
            <span className="font-mono font-bold text-gem-blue text-sm block mt-0.5">{selectedBidder.id}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Tender ID</span>
            <span className="font-mono font-bold text-slate-800 text-sm block mt-0.5">{selectedTender.gemBidNo}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Compliance Score</span>
            <span className="font-bold text-purple-700 text-base block mt-0.5">78 / 100</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Overall Risk</span>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded font-bold text-xs bg-red-100 text-red-900 border border-red-300">
              HIGH RISK
            </span>
          </div>
        </div>

        {/* ── 14-Item Status Grid (Feature 2) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-gem-navy uppercase tracking-wider">
              Statutory & Gateway Verification Matrix (14 Indicators)
            </span>
            <span className="text-[11px] text-slate-500">Click any card to inspect evidence</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {passportGrid.map((item) => {
              const isIssue = item.status === 'POTENTIAL ISSUE';
              const isReview = item.status === 'REQUIRES REVIEW';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPassportItem(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-md flex flex-col justify-between space-y-2 ${
                    isIssue 
                      ? 'bg-amber-50/50 border-amber-300 hover:border-amber-400' 
                      : isReview 
                      ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">{item.title}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-slate-600 truncate block font-medium">
                      {item.value}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.refNo}</span>
                    <span className="text-gem-blue font-semibold hover:underline">View →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Primary Action Buttons ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('document-review')}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition"
        >
          Review Submitted Documents (8)
        </button>

        <button
          onClick={() => setActiveView('ai-verification')}
          className="px-6 py-3 bg-gem-navy hover:bg-gem-navyLight text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2"
        >
          <span>Start AI Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Passport Item Evidence Modal ── */}
      {selectedPassportItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-900 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base text-gem-navy">{selectedPassportItem.title}</h3>
              <button
                onClick={() => setSelectedPassportItem(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status:</span>
                <div>{getStatusBadge(selectedPassportItem.status)}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Checked Value:</span>
                <span className="font-bold text-slate-800">{selectedPassportItem.value}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Verification Evidence:</span>
                <p className="text-slate-700 leading-relaxed mt-0.5">{selectedPassportItem.evidence}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Reference:</span>
                <span className="font-bold text-gem-navy">{selectedPassportItem.refNo}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPassportItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPassportItem(null);
                  setActiveView('government-verification');
                }}
                className="px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white font-bold rounded-lg transition"
              >
                Go to Verification Gateway
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
