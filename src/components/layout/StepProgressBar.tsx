import React from 'react';
import { 
  ChevronRight,
  Home,
  FileText,
  UserCheck,
  Building2,
  Check
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

export const StepProgressBar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    selectedTender, 
    selectedBidder,
    selectedDepartment 
  } = useApp();

  // 5 High-Level Officer Workflow Stages
  const workflowStages: { id: string; stepNumber: number; label: string; views: NavView[]; targetView: NavView }[] = [
    { 
      id: 'tenders', 
      stepNumber: 1, 
      label: '1. Select Tender', 
      views: ['dashboard', 'active-tenders', 'tenders', 'tender-details'], 
      targetView: 'active-tenders' 
    },
    { 
      id: 'bids', 
      stepNumber: 2, 
      label: '2. View Bids', 
      views: ['bids-received', 'bid-overview'], 
      targetView: 'bids-received' 
    },
    { 
      id: 'verification', 
      stepNumber: 3, 
      label: '3. Verify Bidder', 
      views: [
        'bid-verification', 
        'document-review', 
        'ai-verification', 
        'government-verification', 
        'cross-verification', 
        'temporal-compliance', 
        'truth-graph', 
        'compliance-matrix', 
        'evidence-passport', 
        'evidence-explorer', 
        'evidence-review', 
        'evidence-analysis',
        'investigation-priority',
        'investigation',
        'findings-list',
        'finding-details'
      ], 
      targetView: 'bid-verification' 
    },
    { 
      id: 'clarification', 
      stepNumber: 4, 
      label: '4. Clarification', 
      views: ['clarification-center', 'clarifications'], 
      targetView: 'clarification-center' 
    },
    { 
      id: 'decision', 
      stepNumber: 5, 
      label: '5. Decision & Report', 
      views: ['decision-review', 'decision', 'officer-review', 'decision-confirmation', 'report', 'reports', 'report-export', 'audit-trail', 'completed'], 
      targetView: 'decision-review' 
    }
  ];

  const currentStage = workflowStages.find(s => s.views.includes(activeView)) || workflowStages[0];

  if (activeView === 'admin-console' || activeView === 'vendor-portal') {
    return null;
  }

  const isHighRisk = selectedBidder.riskProfile.overallRisk === 'HIGH' || selectedBidder.riskProfile.overallRisk === 'CRITICAL';
  const isMediumRisk = selectedBidder.riskProfile.overallRisk === 'MEDIUM';

  const getActiveViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'active-tenders':
      case 'tenders': return 'Tenders';
      case 'tender-details': return 'Tender Overview';
      case 'bids-received': return 'Bids Received';
      case 'bid-verification': return 'Bid Verification';
      case 'clarifications':
      case 'clarification-center': return 'Clarification Centre';
      case 'decision-review':
      case 'decision': return 'Officer Decision';
      case 'report':
      case 'reports': return 'Compliance Dossier';
      case 'audit-trail': return 'Audit Trail';
      default: return 'Verification';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 text-xs select-none sticky top-13 z-20 shadow-2xs">
      
      {/* ── Compact Context Strip (MoPNG/CPCL | Tender | Bidder | Risk) ── */}
      <div className="px-4 sm:px-6 py-1.5 bg-[#0F2942] text-white flex flex-wrap items-center justify-between gap-2 border-b border-[#0A1D30] text-[11px]">
        
        {/* Left: Active Context Identity */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 text-slate-300">
            <Building2 className="w-3 h-3 text-sky-400 flex-shrink-0" />
            <span className="font-semibold">MoPNG / CPCL</span>
          </div>

          <span className="text-slate-600 font-bold hidden sm:inline">|</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">Tender:</span>
            <strong className="font-mono text-white font-bold">{selectedTender.gemBidNo}</strong>
          </div>

          <span className="text-slate-600 font-bold hidden sm:inline">|</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">Bidder:</span>
            <strong className="text-white font-bold max-w-[200px] truncate">{selectedBidder.name}</strong>
          </div>

          <span className="text-slate-600 font-bold hidden sm:inline">|</span>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">Stage:</span>
            <strong className="text-sky-300 font-semibold">{currentStage.stepNumber} of 5 — {currentStage.label.split('. ')[1]}</strong>
          </div>

          <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase tracking-wide ml-1 ${
            isHighRisk 
              ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
              : isMediumRisk 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            {selectedBidder.riskProfile.overallRisk} RISK
          </span>
        </div>

        {/* Right: Quick Context Actions */}
        <div className="text-[10px] text-slate-400 font-mono hidden md:block">
          Officer: PO-1042 (Senior Procurement Officer)
        </div>

      </div>

      {/* ── Compact Breadcrumbs + Stepper ── */}
      <div className="px-4 sm:px-6 py-1 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => setActiveView('dashboard')} 
            className="hover:text-blue-900 font-medium flex items-center gap-1 transition cursor-pointer"
          >
            <Home className="w-3 h-3 text-slate-400" />
            <span>Home</span>
          </button>

          <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />

          <button 
            onClick={() => setActiveView('active-tenders')} 
            className="hover:text-blue-900 font-medium transition cursor-pointer"
          >
            Tenders
          </button>

          {activeView !== 'dashboard' && activeView !== 'active-tenders' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <button 
                onClick={() => setActiveView('tender-details')} 
                className="hover:text-blue-900 font-mono font-bold text-blue-950 transition max-w-[150px] truncate cursor-pointer"
                title={`${selectedTender.gemBidNo} — ${selectedTender.title}`}
              >
                {selectedTender.gemBidNo}
              </button>
            </>
          )}

          {activeView !== 'dashboard' && activeView !== 'active-tenders' && activeView !== 'tender-details' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <button 
                onClick={() => setActiveView('bids-received')} 
                className="hover:text-blue-900 font-medium transition cursor-pointer"
              >
                Bids
              </button>
              
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <button 
                onClick={() => setActiveView('bid-verification')} 
                className="hover:text-blue-900 font-semibold transition max-w-[140px] truncate cursor-pointer text-slate-700"
                title={selectedBidder.name}
              >
                {selectedBidder.name.split(' ')[0]}
              </button>
            </>
          )}

          {activeView !== 'dashboard' && activeView !== 'active-tenders' && activeView !== 'tender-details' && activeView !== 'bids-received' && activeView !== 'bid-verification' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <span className="font-bold text-[#0F2942]">
                {getActiveViewTitle()}
              </span>
            </>
          )}

          {activeView === 'bid-verification' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <span className="font-bold text-[#0F2942]">
                Bid Verification
              </span>
            </>
          )}

          {activeView === 'bids-received' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <span className="font-bold text-[#0F2942]">
                Bids Received
              </span>
            </>
          )}
        </div>

        {/* 5-Step Workflow Process Indicator (Prompt Section 10) */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
          {workflowStages.map((st, idx) => {
            const isCurrent = st.stepNumber === currentStage.stepNumber;
            const isPast = st.stepNumber < currentStage.stepNumber;
            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => setActiveView(st.targetView)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition cursor-pointer text-left ${
                    isCurrent
                      ? 'text-blue-900 font-bold bg-blue-100/70 border border-blue-300'
                      : isPast
                      ? 'text-emerald-800 font-medium hover:text-emerald-950'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isCurrent 
                      ? 'bg-[#0F2942] text-white' 
                      : isPast 
                      ? 'bg-emerald-600 text-white' 
                      : 'border border-slate-300 text-slate-400 bg-white'
                  }`}>
                    {isPast ? '✓' : st.stepNumber}
                  </span>
                  <span>{st.label.split('. ')[1]}</span>
                </button>
                {idx < workflowStages.length - 1 && (
                  <span className="text-slate-300 text-xs font-bold">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>

    </div>
  );
};

