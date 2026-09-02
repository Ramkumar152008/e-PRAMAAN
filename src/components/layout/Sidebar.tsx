import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
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

  interface NavSection {
    title: string;
    items: { 
      id: NavView | 'admin-modal'; 
      label: string; 
      icon: any; 
      matchViews?: NavView[]; 
      badge?: number;
      isAction?: boolean;
    }[];
  }

  // 5 Primary Officer Navigation Sections as per Prompt Section 1 & 17
  const officerNavSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          matchViews: ['dashboard']
        }
      ]
    },
    {
      title: 'PROCUREMENT',
      items: [
        {
          id: 'active-tenders',
          label: 'Tenders',
          icon: FileText,
          matchViews: ['active-tenders', 'tenders', 'tender-details', 'compliance-rules', 'tender-requirement-analysis', 'create-evaluation', 'tender-register', 'bids-received']
        }
      ]
    },
    {
      title: 'VERIFICATION',
      items: [
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
            'finding-details',
            'bid-overview'
          ]
        }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        {
          id: 'clarification-center',
          label: 'Clarifications',
          icon: MessageSquare,
          matchViews: ['clarification-center'],
          badge: clarifications.some(c => c.status === 'RESPONSE_RECEIVED') ? 1 : undefined
        }
      ]
    },
    {
      title: 'REVIEW',
      items: [
        {
          id: 'decision-review',
          label: 'Decisions & Reports',
          icon: UserCheck,
          matchViews: ['decision-review', 'decision', 'officer-review', 'decision-confirmation', 'report', 'reports', 'report-export', 'audit-trail', 'completed']
        }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'admin-modal',
          label: 'Administrative Access',
          icon: KeyRound,
          isAction: true
        }
      ]
    }
  ];

  const vendorNavSections: NavSection[] = [
    {
      title: 'VENDOR WORKSPACE',
      items: [
        {
          id: 'vendor-portal',
          label: 'Compliance & Clarifications',
          icon: Store,
          matchViews: ['vendor-portal']
        }
      ]
    }
  ];

  const adminNavSections: NavSection[] = [
    {
      title: 'ADMINISTRATION',
      items: [
        {
          id: 'admin-console',
          label: 'Governance & Rules',
          icon: Settings,
          matchViews: ['admin-console']
        }
      ]
    }
  ];

  const isNavActive = (item: { id: NavView | 'admin-modal'; matchViews?: NavView[] }): boolean => {
    if (item.id === 'admin-modal') return false;
    if (activeView === item.id) return true;
    if (item.matchViews && item.matchViews.includes(activeView)) return true;
    return false;
  };

  const navSections = role === 'VENDOR' ? vendorNavSections : role === 'ADMIN' ? adminNavSections : officerNavSections;

  return (
    <>
      <aside className="w-56 bg-[#0F2942] text-slate-300 flex-shrink-0 flex flex-col h-[calc(100vh-3.5rem)] border-r border-[#0A1D30] select-none text-xs">
        
        {/* Navigation Sections */}
        <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </p>
              {section.items.map((item) => {
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition text-left cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="p-3.5 bg-[#0A1D30] border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
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

