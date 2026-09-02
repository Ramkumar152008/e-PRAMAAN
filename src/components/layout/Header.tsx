import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogOut,
  Flame,
  Bell,
  KeyRound,
  ChevronDown,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminAccessModal } from '../shared/AdminAccessModal';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { 
    role, 
    setRole,
    setActiveView, 
    notifications 
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read && n.recipientRole === role).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-[#0F2942] text-white sticky top-0 z-40 shadow-xs select-none border-b border-[#0A1D30]">
        
        {/* Main Header Bar */}
        <div className="px-4 sm:px-6 h-13 flex items-center justify-between gap-4">
          
          {/* Left: Canonical Brand & Institutional Subtitle */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-95 transition"
            onClick={() => setActiveView(role === 'VENDOR' ? 'vendor-portal' : role === 'ADMIN' ? 'admin-console' : 'dashboard')}
            title="Return to Dashboard"
          >
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shadow-xs border border-white/20">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wide text-white block leading-tight">
                e-BID PRAMAAN
              </span>
              <p className="text-[10px] text-slate-300 font-normal leading-none hidden sm:block">
                {role === 'VENDOR' 
                  ? 'Vendor Compliance & Clarification Workspace' 
                  : role === 'ADMIN'
                  ? 'System Administration & Governance'
                  : 'Bid Compliance & Evidence Verification'}
              </p>
            </div>
          </div>

          {/* Center: Ministry of Petroleum & Natural Gas · CPCL */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-0.5 bg-white/10 rounded-full border border-white/10 text-[11px] font-semibold text-sky-200">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Ministry of Petroleum & Natural Gas • CPCL</span>
          </div>

          {/* Right: Notifications + Profile Menu */}
          <div className="flex items-center gap-2.5">
            
            {/* Notification Bell */}
            <button
              onClick={() => setActiveView(role === 'VENDOR' ? 'vendor-portal' : 'clarification-center')}
              className="relative p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-md transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#0F2942]" />
              )}
            </button>

            {/* Profile Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 rounded-md border border-slate-700 text-xs transition cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                  role === 'VENDOR' ? 'bg-amber-600' : role === 'ADMIN' ? 'bg-purple-700' : 'bg-blue-700'
                }`}>
                  {role === 'VENDOR' ? 'VN' : role === 'ADMIN' ? 'AD' : 'PO'}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <p className="font-semibold text-white text-[11px]">
                    {role === 'VENDOR' ? 'ABC Industries' : role === 'ADMIN' ? 'Suresh Menon' : 'Rajeshwar Rao'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">
                    {role === 'VENDOR' ? 'VEN-PET-001' : role === 'ADMIN' ? 'ADMIN-001' : 'PO-1042'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Card */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="font-bold text-[#0F2942]">
                      {role === 'VENDOR' ? 'ABC Industries Pvt Ltd' : role === 'ADMIN' ? 'System Administrator' : 'Rajeshwar Rao'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {role === 'VENDOR' ? 'VEN-PET-001 • Seller' : role === 'ADMIN' ? 'ADMIN-001 • Governance' : 'PO-1042 • Senior Procurement Officer'}
                    </p>
                  </div>

                  {/* Administrative Access Link for Officers */}
                  {role === 'OFFICER' && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowAdminModal(true);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-purple-700" />
                      <span>Administrative Access</span>
                    </button>
                  )}

                  {/* Return to Officer Workspace if currently in Admin */}
                  {role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setRole('OFFICER');
                        setActiveView('dashboard');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>Officer Workspace</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-center gap-2 text-red-700 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ── Section 8: Compact Decision Support Protocol Bar ── */}
        <div className="px-4 sm:px-6 py-1 bg-[#0A1D30] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3 h-3 text-sky-400 flex-shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider">Decision Support Protocol:</span>
            <span className="text-slate-300">
              e-BID PRAMAAN provides evidence intelligence for bid verification. The authorized Procurement Officer retains full statutory authority for the final procurement decision.
            </span>
          </div>
          <div className="text-[10px] text-sky-300 font-mono hidden md:block">
            MoPNG / CPCL • Departmental Procurement Access
          </div>
        </div>

      </header>

      {/* Admin Access Modal */}
      <AdminAccessModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </>
  );
};
