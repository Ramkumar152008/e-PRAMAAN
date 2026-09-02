import React, { useState } from 'react';
import { ShieldCheck, Lock, X, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authenticateUser, saveAuthSession } from '../../services/authService';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({ isOpen, onClose }) => {
  const { setRole, setActiveView } = useApp();
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessKey.trim()) {
      setError('Administrative access key is required.');
      return;
    }

    setIsAuthenticating(true);

    try {
      // Validate administrative access key
      const result = await authenticateUser('ADMIN-001', accessKey, 'ADMIN');

      if (result.success && result.session) {
        saveAuthSession(result.session, false);
        setIsSuccess(true);
        setTimeout(() => {
          setRole('ADMIN');
          setActiveView('admin-console');
          setIsAuthenticating(false);
          setIsSuccess(false);
          setAccessKey('');
          onClose();
        }, 500);
      } else {
        setIsAuthenticating(false);
        setError('Access denied. Administrative authorization required.');
      }
    } catch {
      setIsAuthenticating(false);
      setError('Authorization error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#0F2942] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-purple-700 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Administrative Access</h3>
              <span className="text-[10px] text-slate-300">System Governance & Rule Configuration</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
            <p className="font-medium text-slate-800">
              Administrative access requires additional authorization.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Authorized personnel can configure compliance thresholds, registry connection parameters, and system governance.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Authorization confirmed. Opening Admin Console...</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="adminKey" className="block text-xs font-semibold text-slate-800">
              Administrative Access Key <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="adminKey"
                type="password"
                value={accessKey}
                onChange={(e) => {
                  setAccessKey(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2942]"
                placeholder="Enter administrative access key"
                autoFocus
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAuthenticating || isSuccess}
              className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded-lg font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              {isAuthenticating ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticate & Continue</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
