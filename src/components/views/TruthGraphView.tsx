import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  Building2, 
  GitCommit, 
  Scale, 
  Sparkles, 
  Flame, 
  Info, 
  Clock, 
  Layers, 
  X, 
  Send,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TruthGraphNode } from '../../types';

export const TruthGraphView: React.FC = () => {
  const { 
    selectedTender, 
    selectedBidder, 
    setActiveView 
  } = useApp();

  const graphData = selectedBidder.truthGraph;
  const [selectedNode, setSelectedNode] = useState<TruthGraphNode>(
    graphData.nodes.find(n => n.id === 'N-TURNOVER') || graphData.nodes[0]
  );
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const handleSelectNode = (node: TruthGraphNode) => {
    setSelectedNode(node);
    setInspectorOpen(true);
  };

  const getNodeColor = (node: TruthGraphNode) => {
    if (node.id === 'N-CENTER') return { bg: '#0F2942', border: '#1E40AF', text: '#FFFFFF', dot: '#60A5FA' };
    if (node.status === 'conflict') return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#DC2626' };
    if (node.status === 'warning') return { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', dot: '#D97706' };
    return { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#059669' };
  };

  // Enriched Conflict Details for Inspector
  const nodeInspectorDetails: Record<string, {
    requirement: string;
    rule: string;
    claim: string;
    submittedEvidence: string;
    verifiedSource: string;
    comparison: string;
    difference: string;
    tenderThreshold: string;
    finding: string;
    risk: string;
    action: string;
  }> = {
    'N-TURNOVER': {
      requirement: 'Tender Clause 4.2: Minimum Average Annual Turnover >= ₹10.0 Crore across 3 audited financial years.',
      rule: 'PET-FIN-001 (Operator: >=, Minimum: ₹10.00 Cr, Mandatory: TRUE)',
      claim: 'Declared Average Turnover: ₹12.00 Crore',
      submittedEvidence: 'CA Certified Turnover Statement & FY23-26 Financials (Page 3)',
      verifiedSource: 'MCA21 Statutory Form AOC-4 & Income Tax Returns (Simulated)',
      comparison: 'Declared ₹12.00 Cr ≠ Verified ₹8.70 Cr',
      difference: '-₹3.30 Crore (-27.5% Deficit)',
      tenderThreshold: '₹10.00 Crore Minimum Mandated',
      finding: 'Material Turnover Conflict: Verified revenue of ₹8.70 Cr fails mandatory ₹10 Cr eligibility threshold.',
      risk: 'HIGH RISK (Financial Discrepancy)',
      action: 'Issue GeM Clause 14(c) Clarification Notice requiring UDIN reconciliation or consolidated financial statements.'
    },
    'N-EXP': {
      requirement: 'Tender Clause 5.1: Minimum 5.0 years operational experience in oil & gas pipeline monitoring / safety systems.',
      rule: 'PET-EXP-002 (Operator: >=, Minimum: 5.0 Years, Mandatory: TRUE)',
      claim: 'Declared Oil & Gas Experience: 7.0 Years',
      submittedEvidence: 'Self-Declared Completion Summary Certificates (Page 2)',
      verifiedSource: 'MCA21 Corporate Incorporation Ledger & CPSE Project Records (Simulated)',
      comparison: 'Declared 7.0 Years ≠ Verified 3.8 Years since incorporation',
      difference: '-3.2 Years Experience Deficit',
      tenderThreshold: '5.0 Years Mandated in Sector',
      finding: 'Experience Deficit: Entity incorporation date (Nov-2018) limits verifiable commercial tenure to 3.8 years.',
      risk: 'HIGH RISK (Technical Eligibility Shortfall)',
      action: 'Request certified CPSE client work order milestone logs and statutory completion certificates.'
    },
    'N-ADDR': {
      requirement: 'Tender Clause 3.1: Registered entity identity and operational headquarters jurisdiction.',
      rule: 'PET-REG-003 (Operator: CONTAINS, Mandatory: TRUE)',
      claim: 'Operating Address: Chennai (Guindy Industrial Estate)',
      submittedEvidence: 'CA Certificate Letterhead Address',
      verifiedSource: 'MCA21 RoC Master Data & GSTN State Filing Records (Simulated)',
      comparison: 'Declared Branch Chennai ≠ Registered RoC Headquarters Bengaluru',
      difference: 'State Jurisdiction Mismatch (Tamil Nadu vs Karnataka)',
      tenderThreshold: 'Statutory RoC Head Office Validation',
      finding: 'Address Inconsistency: Branch operating address declared without legal registered office cross-reference.',
      risk: 'MEDIUM RISK (Administrative Discrepancy)',
      action: 'Confirm GST state jurisdiction and RoC registered headquarters filing status.'
    },
    'N-SAFETY': {
      requirement: 'Tender Clause 8.1: Mandatory PESO / ATEX Zone-1 safety certification active on bid cutoff date (10-Aug-2026).',
      rule: 'PET-SFT-007 / PET-CERT-003 (Operator: VALID_ON_DATE, Mandatory: TRUE)',
      claim: 'PESO Flameproof Zone-1 Safety Certificate',
      submittedEvidence: 'Petroleum_Safety_Certificate_PESO_ATEX.pdf',
      verifiedSource: 'PESO Safety Certification Ledger #PESO-EX-2023-88912',
      comparison: 'Certificate Expiry: 05-Aug-2026 vs Bid Submission Date: 10-Aug-2026',
      difference: '-5 Calendar Days Expiration Deficit',
      tenderThreshold: 'Legally Active on 10 August 2026 Cutoff',
      finding: 'Critical Temporal Deficit: Certificate expired 5 days before the tender bid submission cutoff timestamp.',
      risk: 'CRITICAL RISK (Temporal Eligibility Non-Compliance)',
      action: 'Request proof of renewal endorsement application or renewed certificate valid past 10 August 2026.'
    },
    'N-OEM': {
      requirement: 'Tender Clause 7.1: Manufacturer Authorization Form (MAF) from Tier-1 Acoustic Sensor OEM.',
      rule: 'PET-OEM-006 (Operator: VALID_ON_DATE, Mandatory: TRUE)',
      claim: 'MAF Token: PETRO-SENS-2026-MAF-8812',
      submittedEvidence: 'OEM Manufacturer Authorization Letter (Page 1)',
      verifiedSource: 'Simulated OEM Verification Gateway',
      comparison: 'Token Found in Gateway • Secondary Pipeline Line Coverage Check Required',
      difference: 'Pending Direct Cryptographic Validation',
      tenderThreshold: 'Direct OEM Back-to-Back Warranty Coverage',
      finding: 'Verification Advisory: MAF token registered but secondary product line scope validation required.',
      risk: 'MEDIUM RISK (Third-Party Validation Pending)',
      action: 'Transmit automated secondary validation request to OEM partner nodal officer.'
    }
  };

  const currentDetails = nodeInspectorDetails[selectedNode.id];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-4 sm:px-6 text-slate-900 font-sans">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <Network className="w-4 h-4 text-blue-700" />
            <span>SIH26100 • Relational Intelligence Engine</span>
            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
              Actionable Truth Graph
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2942]">Cross-Source Relational Truth Graph</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Interconnects entity identities, registry endpoints, verified facts, and flagged compliance discrepancies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('temporal-compliance')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Temporal Engine</span>
          </button>

          <button
            onClick={() => setActiveView('compliance-matrix')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Compliance Matrix →</span>
          </button>
        </div>
      </div>

      {/* ── Persistent Context Bar ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-gov p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Center Entity</span>
          <span className="font-bold text-[#0F2942] mt-0.5 block truncate">{selectedBidder.name}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Graph Complexity</span>
          <span className="font-mono font-bold text-blue-900 mt-0.5 block">9 Connected Nodes • 8 Edges</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Flagged Conflicts</span>
          <span className="font-bold text-red-700 mt-0.5 block">4 Material Discrepancies</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Selected Node</span>
          <span className="font-bold text-blue-900 mt-0.5 block truncate">{selectedNode.label}</span>
        </div>
      </div>

      {/* ── Interactive Graph Canvas & Actionable Inspector Drawer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Interactive SVG Visualizer */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          
          {/* Top Canvas Controls & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 z-10 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
              <Network className="w-4 h-4 text-sky-400" />
              <span>Interactive Relational Map (Click nodes to inspect)</span>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Verified</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Conflict</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Warning</span>
              </span>
            </div>
          </div>

          {/* SVG Graph Visualization */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <svg viewBox="0 0 800 500" className="w-full h-auto max-h-[420px] select-none">
              
              {/* Render Edges */}
              {graphData.edges.map((edge, idx) => {
                const fromNode = graphData.nodes.find(n => n.id === edge.from) || { x: 400, y: 250 };
                const toNode = graphData.nodes.find(n => n.id === edge.to) || { x: 400, y: 250 };
                const isConflict = edge.status === 'conflict';
                const isWarning = edge.status === 'warning';

                return (
                  <g key={idx}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isConflict ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981'}
                      strokeWidth={isConflict ? 2.5 : 1.5}
                      strokeDasharray={isConflict ? '5,5' : 'none'}
                      className={isConflict ? 'animate-pulse' : ''}
                    />
                  </g>
                );
              })}

              {/* Render Nodes */}
              {graphData.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isCenter = node.id === 'N-CENTER';
                const colors = getNodeColor(node);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleSelectNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Glow Ring if Selected */}
                    {isSelected && (
                      <circle
                        r={isCenter ? 44 : 32}
                        fill="none"
                        stroke="#60A5FA"
                        strokeWidth="3"
                        className="animate-ping opacity-40"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={isCenter ? 38 : 26}
                      fill={isCenter ? '#0F2942' : colors.bg}
                      stroke={isSelected ? '#3B82F6' : colors.border}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition duration-200 group-hover:scale-110"
                    />

                    {/* Status Dot */}
                    <circle
                      cx={isCenter ? 0 : 16}
                      cy={isCenter ? 0 : -16}
                      r={isCenter ? 4 : 5}
                      fill={colors.dot}
                    />

                    {/* Node Label Text */}
                    <text
                      y={isCenter ? 4 : 4}
                      textAnchor="middle"
                      fill={isCenter ? '#FFFFFF' : '#0F2942'}
                      fontSize={isCenter ? '10' : '9'}
                      fontWeight="bold"
                      fontFamily="system-ui"
                    >
                      {isCenter ? 'ABC Energy' : node.label.split(':')[0].slice(0, 12)}
                    </text>

                    <text
                      y={isCenter ? 54 : 38}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="9"
                      fontFamily="system-ui"
                    >
                      {node.type.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Graph Source: Verification Hub Knowledge Base (Simulated)</span>
            <span className="text-sky-400 font-mono">100% Cryptographic Ledger Traceable</span>
          </div>
        </div>

        {/* Right 5 Cols: Actionable Conflict Inspector (Section 12) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-gov p-5 space-y-4 text-xs flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Actionable Evidence Inspector
                </span>
                <h3 className="font-bold text-base text-[#0F2942]">{selectedNode.label}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                selectedNode.status === 'conflict'
                  ? 'bg-red-100 text-red-900 border border-red-300'
                  : selectedNode.status === 'warning'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            {/* If detailed conflict inspector exists for this node */}
            {currentDetails ? (
              <div className="space-y-3">
                
                {/* Requirement & Rule */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Tender Requirement:</span>
                  <p className="font-bold text-slate-900">{currentDetails.requirement}</p>
                  <p className="font-mono text-[11px] text-blue-900 pt-1 border-t border-slate-200 font-semibold">{currentDetails.rule}</p>
                </div>

                {/* Claim vs Source Comparison Box */}
                <div className="p-3 bg-red-50/40 rounded-lg border border-red-200 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Bidder Submitted Claim:</span>
                    <p className="font-bold text-slate-900">{currentDetails.claim}</p>
                    <span className="font-mono text-[10px] text-slate-500">{currentDetails.submittedEvidence}</span>
                  </div>

                  <div className="pt-1.5 border-t border-red-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Verified Reference Record:</span>
                    <p className="font-bold text-red-700">{currentDetails.verifiedSource}</p>
                  </div>

                  <div className="pt-1.5 border-t border-red-200 text-[11px]">
                    <span className="text-[10px] font-bold text-red-600 uppercase block">Observed Variance / Deficit:</span>
                    <p className="font-mono font-bold text-red-800">{currentDetails.difference}</p>
                  </div>
                </div>

                {/* Finding & Recommended Officer Action */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Recommended Officer Action:</span>
                  <p className="font-semibold text-blue-950 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                    {currentDetails.action}
                  </p>
                </div>

              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <p><strong>Node Value:</strong> {selectedNode.value || 'N/A'}</p>
                <p><strong>Data Source:</strong> {selectedNode.source || 'Statutory Registry'}</p>
                <p><strong>Evidence Reference:</strong> <span className="font-mono">{selectedNode.evidenceRef}</span></p>
                <p className="text-slate-600 pt-1 border-t border-slate-200">{selectedNode.description}</p>
              </div>
            )}

          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setActiveView('evidence-explorer')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer"
            >
              Trace in Evidence Explorer
            </button>

            {selectedNode.status === 'conflict' && (
              <button
                onClick={() => setActiveView('clarification-center')}
                className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Clarification</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ── Bottom Navigation ── */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setActiveView('temporal-compliance')}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          ← Back to Temporal Engine
        </button>

        <button
          onClick={() => setActiveView('compliance-matrix')}
          className="px-6 py-3 bg-[#0F2942] hover:bg-[#1E40AF] text-white font-bold text-sm rounded-lg shadow-gov transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Compliance Matrix</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
