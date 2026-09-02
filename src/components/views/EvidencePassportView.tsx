import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  CreditCard, 
  Briefcase, 
  Flame, 
  Award, 
  MapPin, 
  Lock, 
  Download,
  Activity,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EvidencePassportCategory, SourceFreshnessStatus } from '../../types';

export const EvidencePassportView: React.FC = () => {
  const { selectedBidder, selectedTender, setActiveView } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const passport = selectedBidder.evidencePassport || {
    bidderId: selectedBidder.id,
    bidderName: selectedBidder.name,
    evidenceHealthScore: 74,
    lastVerifiedTimestamp: '10-Aug-2026 10:42 AM IST',
    overallFreshness: 'CURRENT' as SourceFreshnessStatus,
    categories: []
  };

  const handleRefreshPassport = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'VERIFIED':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">✓ VERIFIED MATCH</span>;
      case 'CONFLICT':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-900 border border-red-300">⚠ CONFLICT DETECTED</span>;
      case 'EXPIRED':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-900 border border-rose-300">✕ EXPIRED ON BID DATE</span>;
      case 'WARNING':
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">⚠ VERIFICATION REQUIRED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-300">{st}</span>;
    }
  };

  const getFreshnessBadge = (fr: SourceFreshnessStatus) => {
    switch (fr) {
      case 'CURRENT':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">CURRENT (LIVE)</span>;
      case 'STALE':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">STALE RECORD</span>;
      case 'REFRESH_REQUIRED':
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">REFRESH REQUIRED</span>;
      case 'UNAVAILABLE':
      default:
        return <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-600 border border-slate-300">UNAVAILABLE</span>;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'IDENTITY': return <Building2 className="w-5 h-5 text-blue-700" />;
      case 'FINANCIAL': return <CreditCard className="w-5 h-5 text-purple-700" />;
      case 'EXPERIENCE': return <Briefcase className="w-5 h-5 text-amber-700" />;
      case 'CERTIFICATIONS': return <Award className="w-5 h-5 text-red-700" />;
      case 'OEM': return <ShieldCheck className="w-5 h-5 text-indigo-700" />;
      case 'ADDRESS': return <MapPin className="w-5 h-5 text-teal-700" />;
      default: return <FileText className="w-5 h-5 text-slate-700" />;
    }
  };

  const filteredCategories = filterCategory === 'ALL' 
    ? passport.categories 
    : passport.categories.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>SIH26100 • Ministry of Petroleum & Natural Gas</span>
            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
              Evidence Layer
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Bidder Evidence Passport</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Structured composite evidence profile • Reusable verification health, source freshness & cross-registry ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshPassport}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Querying Registries...' : 'Check Freshness'}</span>
          </button>

          <button
            onClick={() => setActiveView('government-verification')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Verification Hub →</span>
          </button>
        </div>
      </div>

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Bidder Entity</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block truncate">{selectedBidder.name}</span>
          <span className="font-mono text-[10px] text-slate-400">{selectedBidder.cin}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Target Tender</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">{selectedTender.gemBidNo}</span>
          <span className="text-[10px] text-slate-400">Bid Date: 10-Aug-2026</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Evidence Health</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-extrabold text-base text-amber-700">{passport.evidenceHealthScore}%</span>
            <span className="px-1.5 py-0.2 rounded font-bold text-[9px] bg-amber-100 text-amber-900 border border-amber-300">
              MODERATE
            </span>
          </div>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Source Freshness</span>
          <span className="font-mono font-bold text-emerald-700 mt-0.5 block">CURRENT (ACTIVE)</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Identified Conflicts</span>
          <span className="font-bold text-red-700 mt-0.5 block">3 Critical Discrepancies</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Last Verified</span>
          <span className="font-mono text-slate-700 mt-0.5 block text-[11px]">{passport.lastVerifiedTimestamp}</span>
        </div>
      </div>

      {/* ── Product Principle Banner (Section 1 & 4) ── */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <div>
            <strong>Evidence Passport Architecture:</strong> Displays the composite evidence health of the bidder across statutory registries. Tender clause compliance is evaluated in the <strong>Compliance Matrix</strong>.
          </div>
        </div>
        <button
          onClick={() => setActiveView('compliance-matrix')}
          className="text-blue-800 hover:text-blue-950 font-bold underline whitespace-nowrap cursor-pointer"
        >
          View Compliance Matrix →
        </button>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 text-xs">
        <span className="text-slate-500 font-semibold mr-2">Filter Category:</span>
        {[
          { key: 'ALL', label: 'All Dimensions (6)' },
          { key: 'IDENTITY', label: 'Identity' },
          { key: 'FINANCIAL', label: 'Financial' },
          { key: 'EXPERIENCE', label: 'Experience' },
          { key: 'CERTIFICATIONS', label: 'Certifications' },
          { key: 'OEM', label: 'OEM MAF' },
          { key: 'ADDRESS', label: 'Address' }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterCategory(f.key)}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
              filterCategory === f.key
                ? 'bg-[#0F2942] text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Structured Passport Evidence Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat, idx) => {
          const isConflict = cat.status === 'CONFLICT' || cat.status === 'EXPIRED';
          const isWarning = cat.status === 'WARNING';
          return (
            <div 
              key={idx}
              className={`bg-white rounded-xl border p-5 space-y-4 shadow-gov transition hover:shadow-md flex flex-col justify-between ${
                isConflict 
                  ? 'border-red-200 bg-red-50/10' 
                  : isWarning 
                  ? 'border-amber-200 bg-amber-50/10' 
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Title & Icon */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100">
                      {getCategoryIcon(cat.category)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">{cat.category}</span>
                      <h3 className="font-bold text-sm text-[#0F2942]">{cat.title}</h3>
                    </div>
                  </div>
                  {getFreshnessBadge(cat.freshness)}
                </div>

                {/* Status Badge */}
                <div>
                  {getStatusBadge(cat.status)}
                </div>

                {/* Claim vs Verified Comparison Box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Bidder Declared Claim:</span>
                    <p className="font-bold text-slate-900">{cat.claimed}</p>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Verified Reference Evidence:</span>
                    <p className={`font-bold ${isConflict ? 'text-red-700' : 'text-emerald-800'}`}>{cat.verified}</p>
                  </div>

                  {cat.variance && (
                    <div className="pt-1.5 border-t border-slate-200 text-[11px]">
                      <span className="text-[10px] text-red-600 font-bold uppercase block">Identified Variance:</span>
                      <p className="font-mono font-bold text-red-800">{cat.variance}</p>
                    </div>
                  )}
                </div>

                {/* Verification Source Metadata */}
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p><strong>Source:</strong> {cat.source}</p>
                  <p><strong>Evidence Ref:</strong> <span className="font-mono text-slate-700">{cat.evidenceRef}</span></p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {cat.officerActionRequired ? 'Action Required' : 'No Action Needed'}
                </span>
                
                {cat.officerActionRequired ? (
                  <button
                    onClick={() => setActiveView('clarification-center')}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded transition border border-blue-200 cursor-pointer"
                  >
                    Clarify Issue →
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200">
        <button
          onClick={() => setActiveView('document-review')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Document Review
        </button>

        <button
          onClick={() => setActiveView('temporal-compliance')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Bid-Date Truth Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
