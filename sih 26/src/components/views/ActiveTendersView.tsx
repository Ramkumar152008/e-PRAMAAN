import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Building2, 
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  X,
  Eye,
  Info,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tender } from '../../types';

export const ActiveTendersView: React.FC = () => {
  const { 
    tenders, 
    selectTenderById, 
    bidders,
    setActiveView 
  } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Quick View Drawer / Modal
  const [quickViewTender, setQuickViewTender] = useState<Tender | null>(null);

  // Dynamic calculations for the header summary strip
  const totalActiveTenders = tenders.length;
  const totalBidsUnderReview = bidders.length;
  const totalOpenIssues = tenders.reduce((acc, t) => acc + (t.issuesCount || 0), 0);
  const totalDecisionsPending = 2; // Atlas Copco (C03H240087) & Southern Forgings (C13A250049)

  // Status mapping helper
  const getDisplayStatus = (t: Tender) => {
    if (t.status === 'UNDER_VERIFICATION') return 'Under Verification';
    if (t.status === 'UNDER_EVALUATION') return 'Under Evaluation';
    if (t.status === 'REVIEW_REQUIRED') return 'Review Required';
    return t.status.replace(/_/g, ' ');
  };

  // Filter & Sort Logic
  const filteredTenders = useMemo(() => {
    return tenders
      .filter(t => {
        // Search
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchNo = t.gemBidNo.toLowerCase().includes(q);
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDept = t.department.toLowerCase().includes(q);
          if (!matchNo && !matchTitle && !matchDept) return false;
        }

        // Status Filter
        if (selectedStatus !== 'ALL') {
          const displayStatus = getDisplayStatus(t);
          if (selectedStatus === 'Under Verification' && displayStatus !== 'Under Verification') return false;
          if (selectedStatus === 'Under Evaluation' && displayStatus !== 'Under Evaluation') return false;
          if (selectedStatus === 'Review Required' && displayStatus !== 'Review Required') return false;
        }

        // Department Filter
        if (selectedDepartment !== 'ALL' && t.department !== selectedDepartment) {
          return false;
        }

        // Stage Filter
        if (selectedStage !== 'ALL' && t.stage !== selectedStage) {
          return false;
        }

        // Priority Filter
        if (selectedPriority !== 'ALL' && (t.priority || 'MEDIUM') !== selectedPriority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Priority Sorting: Primary Demo first, then High Priority, then others
        if (a.isPrimaryDemo) return -1;
        if (b.isPrimaryDemo) return 1;
        const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const pA = priorityWeight[a.priority || 'MEDIUM'] || 1;
        const pB = priorityWeight[b.priority || 'MEDIUM'] || 1;
        return pB - pA;
      });
  }, [tenders, searchTerm, selectedStatus, selectedDepartment, selectedStage, selectedPriority]);

  const handleOpenTender = (tenderId: string) => {
    selectTenderById(tenderId);
    setActiveView('tender-details');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedDepartment('ALL');
    setSelectedStage('ALL');
    setSelectedPriority('ALL');
  };

  const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'ALL' || selectedDepartment !== 'ALL' || selectedStage !== 'ALL' || selectedPriority !== 'ALL';

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header & Institutional Identity ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>Chennai Petroleum Corporation Limited (CPCL) • Procurement Work Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2942]">Tenders</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage active procurement evaluations, inspect tender-specific compliance matrices, and verify bidder dossiers.
          </p>
        </div>

        <button
          onClick={() => setActiveView('dashboard')}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-center cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* ── Summary Strip (Institutional Metrics) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Tenders</span>
            <strong className="text-lg font-extrabold text-[#0F2942]">{totalActiveTenders} Active</strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Bids Under Review</span>
            <strong className="text-lg font-extrabold text-blue-900">{totalBidsUnderReview} Bids</strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Issues Attention</span>
            <strong className="text-lg font-extrabold text-amber-700">{totalOpenIssues} Issues</strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Decisions Pending</span>
            <strong className="text-lg font-extrabold text-emerald-700">{totalDecisionsPending} Pending</strong>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tender No., Description, or Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-700"
            >
              <option value="ALL">Status: All</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Review Required">Review Required</option>
            </select>

            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-700"
            >
              <option value="ALL">Stage: All</option>
              <option value="Techno-Commercial Evaluation">Techno-Commercial</option>
              <option value="Compliance Verification">Compliance Verification</option>
              <option value="Bid Verification">Bid Verification</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-700"
            >
              <option value="ALL">Priority: All</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

          </div>

        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong>{filteredTenders.length}</strong> of <strong>{tenders.length}</strong> active procurement tenders</span>
          <span className="font-mono">Work Queue Sorted by: Priority & Verification Status</span>
        </div>
      </div>

      {/* ── Section 5: Tender Work Queue Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov overflow-hidden">
        {filteredTenders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No tenders match the selected filters.</h3>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or resetting the filter parameters.</p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs transition cursor-pointer"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3.5">Tender No.</th>
                  <th className="p-3.5">Tender Description & Details</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5 text-center">Bids</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5 text-center">Issues</th>
                  <th className="p-3.5 text-center">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTenders.map((t) => {
                  const tenderBidders = bidders.filter(b => b.tenderId === t.id);
                  const bidsCount = t.bidsCount || tenderBidders.length || 4;
                  const issuesCount = t.issuesCount || 1;
                  const priority = t.priority || 'MEDIUM';
                  const displayStatus = getDisplayStatus(t);

                  return (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-blue-50/30 transition cursor-pointer ${
                        t.isPrimaryDemo ? 'bg-blue-50/15' : ''
                      }`}
                      onClick={() => setQuickViewTender(t)}
                    >
                      
                      {/* Tender No. */}
                      <td className="p-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="text-xs">{t.gemBidNo}</span>
                          {t.isPrimaryDemo && (
                            <span className="block text-[9px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-950 px-1.5 py-0.5 rounded border border-blue-300 w-fit">
                              Primary Workflow
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tender Description */}
                      <td className="p-3.5 max-w-sm">
                        <p className="text-xs font-bold text-[#0F2942] leading-snug">{t.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                          <span>{t.location || 'CPCL Manali, Chennai'}</span>
                          <span>•</span>
                          <span>Est. ₹{t.estimatedValue} Cr</span>
                          <span>•</span>
                          <span>{t.tenderType || 'Open Tender'}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="p-3.5 text-slate-700 text-[11px] font-medium whitespace-nowrap">
                        {t.department}
                      </td>

                      {/* Bids Count */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 font-extrabold text-[#0F2942] rounded-full border border-slate-200 text-xs">
                          {bidsCount}
                        </span>
                      </td>

                      {/* Stage Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-semibold rounded text-[11px] border border-slate-200">
                          {t.stage || 'Techno-Commercial'}
                        </span>
                      </td>

                      {/* Issues Count */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          issuesCount > 1 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {issuesCount}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          priority === 'HIGH'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          {priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                          displayStatus === 'Under Verification'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : displayStatus === 'Review Required'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {displayStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setQuickViewTender(t)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded border border-slate-300 transition"
                            title="Quick Overview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenTender(t.id)}
                            className="px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>VIEW</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 8: "Why This Matters" Institutional Banner ── */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-blue-950 font-bold block text-xs">
            Tender-Aware Verification Architecture
          </strong>
          <p className="text-blue-900 text-[11px] leading-relaxed">
            <em>"Each tender is evaluated against its own applicable requirements. e-BID PRAMAAN does not apply a fixed compliance checklist across all procurements."</em> — Refinery radiant tubes evaluate OEM direct backing, pipe fittings mandate TPI and material mill certificates, while compressor spares enforce proprietary nomination eligibility.
          </p>
        </div>
      </div>

      {/* ── Section 9: TENDER QUICK VIEW MODAL ── */}
      {quickViewTender && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs animate-in fade-in">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  Tender Quick Overview
                </span>
                <h3 className="text-base font-bold text-[#0F2942]">{quickViewTender.gemBidNo}</h3>
                <p className="text-xs text-slate-600 font-medium">{quickViewTender.title}</p>
              </div>
              <button 
                onClick={() => setQuickViewTender(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Tender Status:</span>
                <strong className="text-blue-900 font-bold">{getDisplayStatus(quickViewTender)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Bids Received:</span>
                <strong className="text-[#0F2942] font-bold">{quickViewTender.bidsCount || 4} Bids</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Requirements Identified:</span>
                <strong className="text-slate-900 font-bold">{quickViewTender.rules.length} Clauses</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Open Issues:</span>
                <strong className="text-amber-700 font-bold">{quickViewTender.issuesCount || 1} Findings</strong>
              </div>
            </div>

            {/* Tender Scope Meta */}
            <div className="space-y-1 text-[11px] text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p><strong>Department:</strong> {quickViewTender.department}</p>
              <p><strong>Delivery Location:</strong> {quickViewTender.location || 'CPCL Manali, Chennai'}</p>
              <p><strong>Evaluation Method:</strong> {quickViewTender.evaluationMethod || 'Material Code Wise L1'}</p>
              <p><strong>Estimated Value:</strong> ₹{quickViewTender.estimatedValue} Crore</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickViewTender(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const id = quickViewTender.id;
                  setQuickViewTender(null);
                  handleOpenTender(id);
                }}
                className="px-5 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>VIEW BIDS RECEIVED →</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
