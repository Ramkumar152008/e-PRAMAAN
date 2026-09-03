import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users,
  ShieldCheck, 
  MessageSquare, 
  UserCheck, 
  Flame, 
  Store, 
  Settings, 
  KeyRound 
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';
import { AdminAccessModal } from '../shared/AdminAccessModal';

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeView, setActiveView, role, clarifications } = useApp();
  const [showAdminModal, setShowAdminModal] = useState(false);

  interface NavItem {
    id: NavView | 'admin-modal';
    label: string;
    icon: any;
    matchViews?: NavView[];
    badge?: number;
    isAction?: boolean;
  }

  // 6 Core Government Navigation Items
  const officerNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      matchViews: ['dashboard']
    },
    {
      id: 'active-tenders',
      label: 'Tenders',
      icon: FileText,
      matchViews: ['active-tenders', 'tenders', 'tender-details', 'compliance-rules', 'tender-requirement-analysis', 'create-evaluation', 'tender-register']
    },
    {
      id: 'bids-received',
      label: 'Bids Received',
      icon: Users,
      matchViews: ['bids-received', 'bid-overview']
    },
    {
      id: 'bid-verification',
      label: 'Bid Verification',
      icon: ShieldCheck,
      matchViews: [
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
        'investigation-queue',
        'risk-intelligence',
        'findings-list',
        'finding-details'
      ]
    },
    {
      id: 'clarification-center',
      label: 'Clarifications',
      icon: MessageSquare,
      matchViews: ['clarification-center', 'clarifications'],
      badge: clarifications.some(c => c.status === 'RESPONSE_RECEIVED') ? 1 : undefined
    },
    {
      id: 'decision-review',
      label: 'Decisions & Reports',
      icon: UserCheck,
      matchViews: ['decision-review', 'decision', 'officer-review', 'decision-confirmation', 'report', 'reports', 'report-export', 'audit-trail', 'completed']
    }
  ];

  const vendorNavItems: NavItem[] = [
    {
      id: 'vendor-portal',
      label: 'Compliance & Clarifications',
      icon: Store,
      matchViews: ['vendor-portal']
    }
  ];

  const adminNavItems: NavItem[] = [
    {
      id: 'admin-console',
      label: 'Governance & Rules',
      icon: Settings,
      matchViews: ['admin-console']
    }
  ];

  const isNavActive = (item: NavItem): boolean => {
    if (item.id === 'admin-modal') return false;
    if (activeView === item.id) return true;
    if (item.matchViews && item.matchViews.includes(activeView)) return true;
    return false;
  };

  const navItems = role === 'VENDOR' ? vendorNavItems : role === 'ADMIN' ? adminNavItems : officerNavItems;

  return (
    <>
      <aside className="w-56 bg-[#0B2347] text-slate-300 flex-shrink-0 flex flex-col h-[calc(100vh-3.5rem)] border-r border-[#081B38] select-none text-xs">
        
        {/* Navigation Header */}
        <div className="px-3 pt-3.5 pb-1">
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {role === 'VENDOR' ? 'VENDOR WORKSPACE' : role === 'ADMIN' ? 'ADMINISTRATION' : 'PROCUREMENT WORKFLOW'}
          </p>
        </div>

        {/* Primary Navigation List */}
        <nav className="py-2 space-y-0.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'admin-modal') {
                    setShowAdminModal(true);
                  } else {
                    setActiveView(item.id as NavView);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition text-left cursor-pointer border-l-4 ${
                  active
                    ? 'border-blue-500 bg-[#163354] text-white font-bold'
                    : 'border-transparent text-slate-300 hover:bg-[#10294C] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {Boolean(item.badge && item.badge > 0) && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-amber-950 font-bold rounded text-[9px] animate-pulse">
                    Action
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick System Action */}
          {role === 'OFFICER' && (
            <div className="pt-3 mt-3 border-t border-slate-800/80 px-2">
              <button
                onClick={() => setShowAdminModal(true)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded text-[11px] transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Governance</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer Info */}
        <div className="p-3 bg-[#081B38] border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>e-BID PRAMAAN</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {role === 'VENDOR' ? 'Registered Bidder Channel' : 'CPCL Procurement Verification'}
          </p>
        </div>

      </aside>

      {/* Admin Access Modal */}
      <AdminAccessModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </>
  );
};
