import React, { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Cpu, 
  Users, 
  PlusCircle, 
  ArchiveRestore
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminConsoleView: React.FC = () => {
  const { selectedTender, setActiveView, setRole, resetDemoData } = useApp();
  const [activeTab, setActiveTab] = useState<'RULES' | 'DATA' | 'MODELS' | 'USERS' | 'BACKUP'>('RULES');

  // Rule Builder Form state
  const [newMetric, setNewMetric] = useState('');
  const [newThreshold, setNewThreshold] = useState('');
  const [newCategory, setNewCategory] = useState<'FINANCIAL' | 'REGISTRATION' | 'OEM' | 'TEMPORAL' | 'DEBARMENT'>('FINANCIAL');
  const [newMandatory, setNewMandatory] = useState(true);
  const [newClause, setNewClause] = useState('');
  const [ruleSaved, setRuleSaved] = useState(false);

  // Simulated Registry Toggles
  const [simFailGST, setSimFailGST] = useState(false);
  const [simFailMCA, setSimFailMCA] = useState(false);

  // Model parameters
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [financialWeight, setFinancialWeight] = useState(40);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetric || !newThreshold) return;
    setRuleSaved(true);
    setTimeout(() => setRuleSaved(false), 2500);
    setNewMetric('');
    setNewThreshold('');
    setNewClause('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              System Administration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gem-navy mt-1">Admin Management & Governance Console</h1>
          <p className="text-xs text-gem-textMuted mt-0.5">
            Rule Compiler Configurations, Simulated Registry Parameters, AI Weights & Access Governance
          </p>
        </div>

        <button
          onClick={() => {
            setRole('OFFICER');
            setActiveView('dashboard');
          }}
          className="px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E40AF] text-white rounded text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          Return to Procurement Officer Flow
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-gem-border bg-white p-1 rounded-lg shadow-subtle text-xs">
        {[
          { key: 'RULES', label: 'Rule Management', icon: Sliders },
          { key: 'DATA', label: 'Simulated Registries', icon: Database },
          { key: 'MODELS', label: 'AI Model & Weights', icon: Cpu },
          { key: 'USERS', label: 'User & Role Access', icon: Users },
          { key: 'BACKUP', label: 'Backup & Recovery', icon: ArchiveRestore },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                isActive
                  ? 'bg-gem-navy text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Rule Management & Builder */}
      {activeTab === 'RULES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Rule Builder Form */}
          <div className="bg-white p-5 rounded-xl border border-gem-border shadow-gov space-y-4 text-xs">
            <div className="pb-2 border-b border-gem-border">
              <h3 className="font-bold text-sm text-gem-navy flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-gem-blue" />
                Add Structured Tender Rule
              </h3>
              <p className="text-slate-500 mt-0.5">Define new deterministic evaluation criterion</p>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Requirement / Metric Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Average Annual Turnover"
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gem-blue"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                >
                  <option value="FINANCIAL">Financial Eligibility</option>
                  <option value="REGISTRATION">Statutory Registration</option>
                  <option value="OEM">OEM Authorization</option>
                  <option value="TEMPORAL">Temporal Validity</option>
                  <option value="DEBARMENT">Non-Debarment</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Threshold / Minimum Condition</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. >= ₹10 Crore"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-gem-blue"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source Clause Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Tender Clause 4.2"
                  value={newClause}
                  onChange={(e) => setNewClause(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatory-check"
                  checked={newMandatory}
                  onChange={(e) => setNewMandatory(e.target.checked)}
                  className="rounded text-gem-blue"
                />
                <label htmlFor="mandatory-check" className="font-semibold text-slate-800">
                  Mandatory (Non-compliance disqualifies)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gem-navy hover:bg-gem-navyLight text-white font-bold rounded transition shadow-sm mt-2"
              >
                Register Rule
              </button>

              {ruleSaved && (
                <p className="text-emerald-700 font-bold text-[11px] text-center animate-in fade-in">
                  Rule registered and bound to active evaluation pipeline!
                </p>
              )}
            </form>
          </div>

          {/* Active Rules Grid */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gem-border shadow-gov p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-gem-navy">Active Tender Rules ({selectedTender.rules.length})</h3>
            <div className="divide-y divide-gem-border">
              {selectedTender.rules.map((rule) => (
                <div key={rule.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-gem-blue text-[11px]">{rule.id}</span>
                    <p className="font-bold text-slate-800">{rule.metric} ({rule.operator} {rule.minimumValue} {rule.unit || ''})</p>
                    <p className="text-[10px] text-slate-500">{rule.referenceClause} • {rule.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.mandatory ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'}`}>
                    {rule.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Simulated Registry Connectors & GeM Integration Adapter */}
      {activeTab === 'DATA' && (
        <div className="bg-white p-6 rounded-xl border border-gem-border shadow-gov space-y-6 text-xs">
          <div className="pb-3 border-b border-gem-border">
            <h3 className="font-bold text-sm text-gem-navy">Simulated Registry Endpoints & GeM Integration Adapter</h3>
            <p className="text-slate-500 mt-0.5">Control live simulation parameters for GSTN, MCA21, Udyam, PESO, OEM and GeM Adapter</p>
          </div>

          {/* Official GeM Integration Boundary Callout (Feature 14) */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-1.5">
            <span className="font-bold text-xs text-blue-900 uppercase tracking-wider block">
              Official GeM Integration Architecture Boundary:
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              "e-BID PRAMAAN is designed as a compliance intelligence layer around GeM procurement workflows. The current prototype uses a simulated integration adapter. Production deployment would require authorized GeM integration mechanisms, security approval, data-sharing agreements and applicable government authorization."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">GSTN Simulated Gateway</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">ONLINE (DEMO)</span>
              </div>
              <p className="text-slate-600">Simulates GSTR-3B and GSTR-9 annual return lookups.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span>Simulate Connector Outage</span>
                <input
                  type="checkbox"
                  checked={simFailGST}
                  onChange={(e) => setSimFailGST(e.target.checked)}
                  className="rounded text-gem-blue"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">MCA21 Simulated Gateway</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">ONLINE (DEMO)</span>
              </div>
              <p className="text-slate-600">Simulates AOC-4 audited financial statements and registered office records.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span>Simulate Connector Outage</span>
                <input
                  type="checkbox"
                  checked={simFailMCA}
                  onChange={(e) => setSimFailMCA(e.target.checked)}
                  className="rounded text-gem-blue"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Model Parameters & Weights */}
      {activeTab === 'MODELS' && (
        <div className="bg-white p-6 rounded-xl border border-gem-border shadow-gov space-y-6 text-xs max-w-2xl">
          <h3 className="font-bold text-sm text-gem-navy">AI Risk Weighting & Calibration</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Minimum Extraction Confidence Threshold</span>
                <span className="font-bold font-mono">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Financial Discrepancy Penalty Weight</span>
                <span className="font-bold font-mono">{financialWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={financialWeight}
                onChange={(e) => setFinancialWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: User & Role Access */}
      {activeTab === 'USERS' && (
        <div className="bg-white p-6 rounded-xl border border-gem-border shadow-gov space-y-4 text-xs">
          <h3 className="font-bold text-sm text-gem-navy">Authorized Procurement Personnel Roster</h3>
          <table className="w-full text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Officer Name</th>
                <th className="p-2.5">Officer ID</th>
                <th className="p-2.5">Designation</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-bold text-gem-navy">Rajeev Sharma</td>
                <td className="p-2.5 font-mono">PO-GEM-8812</td>
                <td className="p-2.5">Director (Procurement)</td>
                <td className="p-2.5 font-semibold text-gem-blue">Procurement Officer (Primary)</td>
                <td className="p-2.5 text-emerald-700 font-bold">AUTHORIZED</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-gem-navy">Dr. Anita Roy</td>
                <td className="p-2.5 font-mono">EV-GEM-4401</td>
                <td className="p-2.5">Senior Technical Evaluator</td>
                <td className="p-2.5 font-semibold text-slate-700">Technical Evaluator</td>
                <td className="p-2.5 text-emerald-700 font-bold">AUTHORIZED</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Backup & Recovery (Section 44) */}
      {activeTab === 'BACKUP' && (
        <div className="bg-white p-6 rounded-xl border border-gem-border shadow-gov space-y-4 text-xs max-w-xl">
          <h3 className="font-bold text-sm text-gem-navy">System State Backup, Recovery & Reset</h3>
          <p className="text-slate-600">
            Generate encrypted state snapshots of all compiled rules, evaluation dossiers, and audit trails.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => alert('Encrypted snapshot successfully exported!')}
              className="px-4 py-2 bg-gem-navy hover:bg-gem-navyLight text-white font-bold rounded transition"
            >
              Export System Snapshot (.enc)
            </button>
            <button
              onClick={() => {
                if (confirm('Reset system evaluation data to initial defaults? All changes will be reinitialized.')) {
                  resetDemoData();
                  alert('System evaluation state successfully reset to defaults.');
                }
              }}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-300 font-semibold rounded transition"
            >
              Reset Evaluation State
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
