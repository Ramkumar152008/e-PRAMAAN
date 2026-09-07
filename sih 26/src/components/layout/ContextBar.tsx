import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  UserCheck, 
  ChevronDown, 
  ChevronRight,
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  GitFork,
  Home
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

interface ContextBarProps {
  onOpenFlowchart?: () => void;
}

export const ContextBar: React.FC<ContextBarProps> = ({ onOpenFlowchart }) => {
  const { 
    departments,
    selectedDepartment, 
    setSelectedDepartment,
    tenders,
    selectedTender, 
    selectTenderById,
    bidders,
    selectedBidder, 
    selectBidderById,
    activeView,
    setActiveView
  } = useApp();

  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showTenderDropdown, setShowTenderDropdown] = useState(false);
  const [showBidderDropdown, setShowBidderDropdown] = useState(false);

  const deptRef = useRef<HTMLDivElement>(null);
  const tenderRef = useRef<HTMLDivElement>(null);
  const bidderRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) setShowDeptDropdown(false);
      if (tenderRef.current && !tenderRef.current.contains(e.target as Node)) setShowTenderDropdown(false);
      if (bidderRef.current && !bidderRef.current.contains(e.target as Node)) setShowBidderDropdown(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered tenders for selected department
  const filteredTenders = selectedDepartment === 'All Departments' 
    ? tenders 
    : tenders.filter(t => t.department === selectedDepartment || t.ministry.includes('Electronics') && selectedDepartment.includes('Technology'));

  // Bidders for current tender
  const tenderBidders = bidders.filter(b => b.tenderId === selectedTender.id);
  const displayBidders = tenderBidders.length > 0 ? tenderBidders : bidders;

  // View-specific breadcrumb suffix (Section 31)
  const getViewBreadcrumb = () => {
    switch (activeView) {
      case 'tender-details':
        return 'Tender Details';
      case 'tender-requirement-analysis':
        return 'Requirement Analysis';
      case 'compliance-rules':
        return 'Tender Requirements';
      case 'bids-received':
        return 'Bids Received';
      case 'bid-overview':
        return 'Compliance Passport';
      case 'document-review':
        return 'Bid Documents';
      case 'ai-verification':
        return 'AI Document Analysis';
      case 'government-verification':
        return 'Government Verification';
      case 'temporal-compliance':
        return 'Bid-Date Compliance';
      case 'truth-graph':
        return 'Evidence Graph';
      case 'compliance-matrix':
        return 'Compliance Matrix';
      case 'findings-list':
      case 'finding-details':
        return 'Evidence & Findings';
      case 'evidence-review':
        return 'Side-by-Side Review';
      case 'investigation':
        return 'Investigation & AI';
      case 'clarification-center':
        return 'Clarification Centre';
      case 'decision':
      case 'decision-confirmation':
        return 'Officer Decision';
      case 'report':
        return 'Verification Report';
      case 'audit-trail':
        return 'Audit Trail';
      default:
        return null;
    }
  };

  const viewBreadcrumb = getViewBreadcrumb();

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md text-xs sticky top-14 z-30 select-none">
      
      {/* ── Top Bar: Persistent Department, Tender & Bidder Context (Section 16 & 36) ── */}
      <div className="px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        
        {/* Left: Context Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* 1. Ministry / Department Badge */}
          <div className="relative" ref={deptRef}>
            <button
              onClick={() => {
                setShowDeptDropdown(!showDeptDropdown);
                setShowTenderDropdown(false);
                setShowBidderDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-200 transition cursor-pointer"
              title="Change Department Scope"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span className="font-semibold text-slate-400 hidden lg:inline">Dept:</span>
              <span className="font-bold text-white max-w-[160px] truncate">
                MoPNG / CPCL
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Department Dropdown */}
            {showDeptDropdown && (
              <div className="absolute left-0 mt-1.5 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-1 animate-in fade-in">
                <p className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  Select Department / Control Area
                </p>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setShowDeptDropdown(false);
                      const matchingTender = tenders.find(t => dept === 'All Departments' || t.department === dept);
                      if (matchingTender) selectTenderById(matchingTender.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition flex items-center justify-between ${
                      selectedDepartment === dept ? 'bg-blue-50 text-gem-navy font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{dept}</span>
                    {selectedDepartment === dept && <CheckCircle2 className="w-3.5 h-3.5 text-gem-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-600 font-bold">/</span>

          {/* 2. Tender Badge */}
          <div className="relative" ref={tenderRef}>
            <button
              onClick={() => {
                setShowTenderDropdown(!showTenderDropdown);
                setShowDeptDropdown(false);
                setShowBidderDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-200 transition"
              title="Change Active Tender"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="font-semibold text-slate-400 hidden lg:inline">Tender:</span>
              <span className="font-bold text-white max-w-[150px] sm:max-w-[200px] truncate">
                {selectedTender.gemBidNo}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Tender Dropdown */}
            {showTenderDropdown && (
              <div className="absolute left-0 mt-1.5 w-80 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-1 animate-in fade-in max-h-72 overflow-y-auto">
                <p className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  Active Tenders Under Scope
                </p>
                {filteredTenders.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      selectTenderById(t.id);
                      setShowTenderDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded text-xs transition border-b border-slate-50 last:border-0 ${
                      selectedTender.id === t.id ? 'bg-blue-50 text-gem-navy font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-900">{t.gemBidNo}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded font-semibold text-slate-600">₹{t.estimatedValue} Cr</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{t.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-600 font-bold">/</span>

          {/* 3. Bidder Badge */}
          <div className="relative" ref={bidderRef}>
            <button
              onClick={() => {
                setShowBidderDropdown(!showBidderDropdown);
                setShowDeptDropdown(false);
                setShowTenderDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-200 transition"
              title="Change Active Bidder"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-slate-400 hidden lg:inline">Bidder:</span>
              <span className="font-bold text-white max-w-[130px] sm:max-w-[170px] truncate">
                {selectedBidder.name}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                selectedBidder.riskProfile.overallRisk === 'HIGH' || selectedBidder.riskProfile.overallRisk === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : selectedBidder.riskProfile.overallRisk === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {selectedBidder.riskProfile.overallRisk}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Bidder Dropdown */}
            {showBidderDropdown && (
              <div className="absolute left-0 mt-1.5 w-80 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-1 animate-in fade-in">
                <p className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  Bids Received for {selectedTender.gemBidNo}
                </p>
                {displayBidders.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      selectBidderById(b.id);
                      setShowBidderDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded text-xs transition border-b border-slate-50 last:border-0 ${
                      selectedBidder.id === b.id ? 'bg-blue-50 text-gem-navy font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{b.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        b.riskProfile.overallRisk === 'HIGH' || b.riskProfile.overallRisk === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : b.riskProfile.overallRisk === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.riskProfile.overallRisk} RISK
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span className="font-mono">{b.id}</span>
                      <span>Turnover: ₹{b.claimedTurnover} Cr</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right: Flowchart & Step Navigation Triggers */}
        <div className="flex items-center gap-2">
          {onOpenFlowchart && (
            <button
              onClick={onOpenFlowchart}
              className="flex items-center gap-1.5 px-3 py-1 bg-gem-blue hover:bg-gem-blueHover text-white rounded text-[11px] font-bold shadow-xs transition"
              title="Open Procurement Decision Architecture & User Workflow"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Procurement Workflow</span>
            </button>
          )}

          <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-400 pl-2 border-l border-slate-800 font-medium">
            <span className={activeView === 'bid-verification' ? 'text-sky-300 font-bold' : ''}>1. Docs</span>
            <span>→</span>
            <span className={activeView === 'evidence-analysis' ? 'text-sky-300 font-bold' : ''}>2. Evidence</span>
            <span>→</span>
            <span className={activeView === 'investigation-queue' ? 'text-sky-300 font-bold' : ''}>3. Investigation</span>
            <span>→</span>
            <span className={activeView === 'decision-review' ? 'text-sky-300 font-bold' : ''}>4. Decision</span>
            <span>→</span>
            <span className={activeView === 'reports' ? 'text-sky-300 font-bold' : ''}>5. Report</span>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar: Breadcrumb Trail (Section 6) ── */}
      <div className="px-4 sm:px-6 py-1 bg-slate-950/70 text-[11px] text-slate-400 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => setActiveView('dashboard')} 
          className="hover:text-white flex items-center gap-1 transition cursor-pointer"
        >
          <Home className="w-3 h-3 text-slate-400" />
          <span>Dashboard</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
        
        <button 
          onClick={() => setActiveView('active-tenders')} 
          className="hover:text-white transition cursor-pointer"
        >
          Procurement
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />

        <button 
          onClick={() => setActiveView('compliance-rules')} 
          className="hover:text-white font-mono font-medium transition text-slate-300 max-w-[200px] truncate cursor-pointer"
        >
          {selectedTender.gemBidNo}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />

        <button 
          onClick={() => setActiveView('bids-received')} 
          className="hover:text-white font-medium transition text-slate-200 max-w-[180px] truncate cursor-pointer"
        >
          {selectedBidder.name}
        </button>

        {viewBreadcrumb && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="font-bold text-sky-400">
              {viewBreadcrumb}
            </span>
          </>
        )}
      </div>

    </div>
  );
};
