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
import { StateEmblem } from '../shared/StateEmblem';

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
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Left: Canonical Brand & Institutional Subtitle */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-95 transition"
            onClick={() => setActiveView(role === 'VENDOR' ? 'vendor-portal' : role === 'ADMIN' ? 'admin-console' : 'dashboard')}
            title="Return to Dashboard"
          >
            {/* Official Indian State Emblem Panel */}
            <div className="w-10 h-10 bg-white rounded-xl p-0.5 flex items-center justify-center shadow-xs border border-white/20 flex-shrink-0">
              <StateEmblem className="w-full h-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider text-white block leading-tight">
                  e-BID PRAMAAN
                </span>
                <span className="text-[11px] bg-[#1D4ED8] text-white px-2 py-0.5 rounded-lg border border-blue-400/40 font-bold hidden md:inline-flex items-center">
                  CPCL
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-none mt-0.5">
                {role === 'VENDOR' 
                  ? 'Registered Bidder Compliance & Clarification Workspace' 
                  : role === 'ADMIN'
                  ? 'System Administration & Governance Console'
                  : 'AI-Powered Bid Compliance Verification Platform'}
              </p>
            </div>
          </div>

          {/* Center: Ministry of Petroleum & Natural Gas · CPCL */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full border border-white/15 text-[11px] font-semibold text-sky-100 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Chennai Petroleum Corporation Limited (CPCL) • Government Procurement / GeM</span>
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
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-900 rounded-lg border border-slate-700 text-xs transition cursor-pointer shadow-2xs"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold ${
                  role === 'VENDOR' ? 'bg-amber-600' : role === 'ADMIN' ? 'bg-purple-700' : 'bg-blue-700'
                }`}>
                  {role === 'VENDOR' ? 'VN' : role === 'ADMIN' ? 'AD' : 'PO'}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <p className="font-bold text-white text-[11px]">
                    {role === 'VENDOR' ? 'ABC Industries Pvt Ltd' : role === 'ADMIN' ? 'Suresh Menon' : 'Rajeshwar Rao'}
                  </p>
                  <p className="text-[9.5px] text-slate-300 font-mono">
                    {role === 'VENDOR' ? 'VEN-PET-001 • Seller' : role === 'ADMIN' ? 'ADMIN-001 • Governance' : 'Senior Procurement Officer • PO-1042'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Dropdown Card */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                    <p className="font-bold text-[#0F2942] text-sm">
                      {role === 'VENDOR' ? 'ABC Industries Pvt Ltd' : role === 'ADMIN' ? 'System Administrator' : 'Rajeshwar Rao'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {role === 'VENDOR' ? 'VEN-PET-001 • GeM Seller' : role === 'ADMIN' ? 'ADMIN-001 • Governance' : 'PO-1042 • Senior Procurement Officer'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Chennai Petroleum Corporation Limited (CPCL)
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
                      <span>Administrative & System Console</span>
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
                      <span>Officer Procurement Workspace</span>
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
        <div className="px-4 sm:px-6 py-1.5 bg-[#0A1D30] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-300">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider">Decision Support Principle:</span>
            <span className="text-slate-300">
              "Tender → Evidence → Verification → Finding → Officer Decision. AI provides decision support. Final procurement decision remains with the authorized officer."
            </span>
          </div>
          <div className="text-[10px] text-sky-300 font-mono hidden md:block">
            CPCL Manali Refinery • Materials & Contracts (M&C)
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
