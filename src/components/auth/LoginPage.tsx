import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Users,
  Shield
} from 'lucide-react';
import { StateEmblem } from '../shared/StateEmblem';
import { authenticateUser, saveAuthSession } from '../../services/authService';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'OFFICER' | 'VENDOR'>('OFFICER');
  const [userId, setUserId] = useState('PO-1042');
  const [password, setPassword] = useState('Officer@1042');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ userId?: string; password?: string }>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const userIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userIdRef.current?.focus();
    document.title = 'e-BID PRAMAAN | Bid Compliance & Evidence Verification';
  }, [authMode]);

  const handleSwitchMode = (mode: 'OFFICER' | 'VENDOR') => {
    setAuthMode(mode);
    setUserId(mode === 'OFFICER' ? 'PO-1042' : 'VEN-PET-001');
    setPassword(mode === 'OFFICER' ? 'Officer@1042' : 'Vendor@2026');
    setError('');
    setFieldErrors({});
  };

  const validate = () => {
    const errs: { userId?: string; password?: string } = {};
    if (!userId.trim()) errs.userId = authMode === 'OFFICER' ? 'Officer ID is required.' : 'Vendor ID is required.';
    if (!password.trim()) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);

    try {
      const result = await authenticateUser(userId, password, authMode);
      
      if (!result.success || !result.session) {
        setIsLoading(false);
        setError(result.error || 'Invalid credentials. Please verify your identifier and password.');
        return;
      }

      saveAuthSession(result.session, rememberMe);
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        onLogin();
      }, 350);
    } catch {
      setIsLoading(false);
      setError('An authentication error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 sm:p-6 font-sans antialiased select-none">
      
      {/* ── Main Authentication Card Container ── */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: INSTITUTIONAL BRANDING & IDENTITY
          ══════════════════════════════════════════════════════════════ */}
          <div className="p-8 sm:p-10 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col justify-center text-center relative overflow-hidden">
            
            {/* Subtle bottom-left decorative pattern */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-60 pointer-events-none rounded-full" />
            
            <div className="relative z-10 space-y-4">
              
              {/* 1. Complete Ashoka Lion Capital Emblem */}
              <div className="flex justify-center">
                <StateEmblem className="w-20 h-auto" />
              </div>

              {/* 2. Government Department Header with Blue Dot Indicator */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] block">
                  GOVERNMENT DEPARTMENT
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mx-auto" />
                <h3 className="text-base sm:text-lg font-bold text-[#0F2942] leading-snug pt-0.5">
                  Ministry of Petroleum & Natural Gas
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#1D4ED8]">
                  Chennai Petroleum Corporation Limited (CPCL)
                </p>
              </div>

              {/* Subtle Horizontal Divider */}
              <div className="w-24 h-px bg-slate-200 mx-auto my-2" />

              {/* 3. Canonical Product Identity */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  <span className="text-[#0F2942]">e-BID </span>
                  <span className="text-[#1D4ED8]">PRAMAAN</span>
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#0F2942]">
                  Bid Compliance & Evidence Verification
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed pt-1">
                  Evidence-driven decision support for tender compliance, bidder verification, and procurement evaluation.
                </p>
              </div>

              {/* 4. Departmental Procurement Evaluation Feature Box */}
              <div className="mt-4 p-3 bg-blue-50/60 border border-blue-200/90 rounded-2xl flex items-start gap-3 text-left max-w-sm mx-auto shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-blue-100/80 flex items-center justify-center flex-shrink-0 text-[#1D4ED8] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-[#1D4ED8]">
                    Departmental Procurement Evaluation
                  </h4>
                  <p className="text-[10.5px] text-slate-600 leading-snug">
                    Automated clause requirement extraction, multi-source cross-verification, and tamper-evident audit trails.
                  </p>
                </div>
              </div>

              {/* 5. Secure Access Notice */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2">
                <Lock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Secure access for authorized departmental users only.</span>
              </div>

            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: AUTHENTICATION FORM
          ══════════════════════════════════════════════════════════════ */}
          <div className="p-8 sm:p-10 bg-white flex flex-col justify-center text-left">
            
            <div className="space-y-5">
              
              {/* Top Role Badge & Heading */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold mb-3">
                  <Users className="w-3.5 h-3.5" />
                  <span>{authMode === 'OFFICER' ? 'DEPARTMENTAL USER' : 'REGISTERED BIDDER'}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-[#0F2942]">
                  {authMode === 'OFFICER' ? 'Authenticated User Sign In' : 'Vendor / Seller Sign In'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {authMode === 'OFFICER' 
                    ? 'Enter your departmental employee ID and password.' 
                    : 'Enter your registered vendor identifier and password.'}
                </p>
              </div>

              {/* Success Alert */}
              {loginSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Authentication verified. Loading workspace...</span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
                {/* Employee / Officer ID Field */}
                <div className="space-y-1">
                  <label htmlFor="userId" className="block text-xs font-semibold text-slate-700">
                    {authMode === 'OFFICER' ? 'Employee / Officer ID' : 'Vendor ID / CIN'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="userId"
                      ref={userIdRef}
                      type="text"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        setFieldErrors((p) => ({ ...p, userId: undefined }));
                        setError('');
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-600 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition shadow-2xs"
                      placeholder={authMode === 'OFFICER' ? 'PO-1042' : 'VEN-PET-001'}
                    />
                  </div>
                  {fieldErrors.userId && (
                    <p className="text-red-600 text-[11px] font-medium">{fieldErrors.userId}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, password: undefined }));
                        setError('');
                      }}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition shadow-2xs"
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-600 text-[11px] font-medium">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Remember Session & Authority Marker */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer accent-blue-600"
                    />
                    <span>Remember session</span>
                  </label>

                  <span className="text-xs text-slate-500 font-medium">
                    {authMode === 'OFFICER' ? 'MoPNG Authority' : 'GeM Seller Portal'}
                  </span>
                </div>

                {/* Primary Sign In CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading || loginSuccess}
                  className="w-full py-3 bg-[#0B2347] hover:bg-[#13356A] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-5"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Decorative Divider with Central Shield */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400">
                    <Shield className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Secondary Switch: Vendor / Officer Access */}
              <div className="text-center text-xs text-slate-600">
                {authMode === 'OFFICER' ? (
                  <div>
                    <span>Are you a registered bidder? </span>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('VENDOR')}
                      className="font-bold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer inline-flex items-center gap-0.5 ml-1"
                    >
                      <span>Vendor / Seller Access</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('OFFICER')}
                    className="font-bold text-slate-700 hover:text-[#0F2942] hover:underline cursor-pointer inline-flex items-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Departmental Sign In</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
