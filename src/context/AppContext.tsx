import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Tender, 
  Bidder, 
  UserRole, 
  OfficerDecision, 
  AuditLogEntry, 
  DashboardKPIs,
  DecisionAction,
  ClarificationRequest,
  ClarificationDocument,
  SystemNotification
} from '../types';
import { MOCK_TENDERS, MOCK_BIDDERS, INITIAL_KPIS, MOCK_DEPARTMENTS } from '../data/mockData';
import { getStoredAuditLogs, logOfficerDecision, logCustomAuditEvent } from '../services/auditTrailService';
import { getStoredNotifications, createNotification, saveNotifications, INITIAL_NOTIFICATIONS } from '../services/notificationService';
import { getActiveAuthSession } from '../services/authService';

export type NavView = 
  | 'dashboard'
  | 'active-tenders'
  | 'tender-details'
  | 'tender-requirement-analysis'
  | 'compliance-rules'
  | 'bids-received'
  | 'bid-overview'
  | 'document-review'
  | 'evidence-passport'
  | 'ai-verification'
  | 'government-verification'
  | 'temporal-compliance'
  | 'truth-graph'
  | 'compliance-matrix'
  | 'risk-intelligence'
  | 'investigation-priority'
  | 'findings-list'
  | 'finding-details'
  | 'evidence-review'
  | 'evidence-explorer'
  | 'investigation'
  | 'clarification-center'
  | 'decision'
  | 'officer-review'
  | 'decision-confirmation'
  | 'report'
  | 'report-export'
  | 'audit-trail'
  | 'completed'
  // Secondary & Vendor Views
  | 'vendor-portal'
  | 'admin-console'
  | 'tenders'
  | 'bidders'
  | 'bid-verification'
  | 'clarifications'
  | 'decisions-reports'
  | 'cross-verification'
  | 'evidence-analysis'
  | 'investigation-queue'
  | 'decision-review'
  | 'reports'
  | 'landing'
  | 'create-evaluation'
  | 'tender-register'
  | 'architecture-view';

export const INITIAL_CLARIFICATIONS: ClarificationRequest[] = [
  {
    id: 'CLAR-2026-001',
    tenderId: 'C03H240087',
    tenderTitle: 'Procurement of Tube, Radiant 1F3, 6IN',
    bidderId: 'BID-ATC-001',
    bidderName: 'Atlas Copco (India) Private Limited',
    issueCategory: 'OEM Manufacturer Authorization Scope',
    tenderRequirement: 'Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with valid MAF.',
    bidderClaim: 'Authorized Operating Subsidiary of Atlas Copco Airpower n.v., Belgium',
    referenceEvidence: 'Parent Entity Authorization Document',
    variance: 'Subsidiary Scope & Direct Warranty Confirmation Required',
    whyRequired: 'Submitted Manufacturer Authorization Form (MAF) is issued by global parent entity Atlas Copco Airpower n.v. Belgium. Tender requires confirmation of Indian subsidiary operational authorization and back-to-back technical warranty for CPCL Manali refinery delivery.',
    officerQuery: 'Your submitted Manufacturer Authorization Form (MAF) is issued by Atlas Copco Airpower n.v., Belgium. Please provide documentary confirmation of direct parent-subsidiary corporate linkage and confirmation that back-to-back technical support and warranty cover CPCL Radiant Tube Spec MS-RAD-6IN-1F3.',
    evidenceReference: 'OEM_Authorization_Certificate.pdf (Page 2) & Global Corporate Registry',
    responseDeadline: '04-Sep-2026, 17:00 IST (48 Hours)',
    status: 'AWAITING_RESPONSE',
    createdAt: '02-Sep-2026 11:30 IST',
    sentAt: '02-Sep-2026 11:35 IST',
    officerId: 'PO-1042',
    officerRemarks: 'Submit parent corporate undertaking and technical compliance backing certificate.',
    sharedEvidence: [
      {
        id: 'SEV-01',
        title: 'OEM Authorization Certificate (Page 2 Excerpt)',
        sourceRegistry: 'Bidder Submission Dossier',
        documentRef: 'OEM_Authorization_Certificate.pdf (Page 2)',
        type: 'EXTRACTED_PAGE',
        date: '02-Sep-2026',
        excerpt: 'Atlas Copco Airpower n.v. authorizes Atlas Copco (India) Private Limited for regional industrial representation.',
        checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
        size: '1.4 MB',
        selected: true
      },
      {
        id: 'SEV-02',
        title: 'Tender Pre-Qualification Rule CPCL-PQ-001 Excerpt',
        sourceRegistry: 'CPCL Tender Requirement Matrix',
        documentRef: 'Tender Clause 2.1',
        type: 'REGISTRY_RECORD',
        date: '15-Jun-2026',
        excerpt: 'Clause 2.1: Bidder must be an OEM or OEM Authorized Agency with verifiable authorization token.',
        checksum: 'sha256:4a8c91d2e0f872b65103a8904712ec3105ab6719cd288231aa492147810fed01',
        size: '520 KB',
        selected: true
      }
    ],
    aiRecommendation: 'AI Recommendation: Requires Officer Verification',
    previousFindingSummary: 'OEM MAF Scope Check: Authorization issued by parent company Atlas Copco Airpower n.v. Belgium requires confirmation of subsidiary operational mandate.',
    updatedFindingSummary: 'Pending bidder submission of parent corporate linkage undertaking.'
  }
];

const CLAR_STORAGE_KEY = 'bidshield_clarifications';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  departments: string[];
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  tenders: Tender[];
  bidders: Bidder[];
  selectedTender: Tender;
  setSelectedTender: (t: Tender) => void;
  selectTenderById: (id: string) => void;
  selectedBidder: Bidder;
  setSelectedBidder: (b: Bidder) => void;
  selectBidderById: (id: string) => void;
  selectedFindingIndex: number;
  setSelectedFindingIndex: (index: number) => void;
  kpis: DashboardKPIs;
  auditLogs: AuditLogEntry[];
  recordDecision: (action: DecisionAction, remarks: string, query?: string) => void;
  resetDemoData: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFindingModalId: string | null;
  setActiveFindingModalId: (id: string | null) => void;
  runFullDemoWalkthrough: () => void;
  runClarificationDemo: () => void;
  isDemoRunning: boolean;
  demoStepText: string;
  addCustomBidder: (bidder: Bidder) => void;

  // Clarification & Notification System
  clarifications: ClarificationRequest[];
  activeClarification: ClarificationRequest | null;
  setActiveClarification: (c: ClarificationRequest | null) => void;
  sendClarificationRequest: (req: Partial<ClarificationRequest>) => ClarificationRequest;
  submitVendorClarificationResponse: (clarificationId: string, explanation: string, docs: ClarificationDocument[]) => void;
  adjudicateClarificationResponse: (
    clarificationId: string, 
    action: 'ACCEPT' | 'ADDITIONAL' | 'INVESTIGATION' | 'MISMATCH_REMAINS' | 'ESCALATE_TO_SPECIALIST', 
    notes: string
  ) => void;
  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  reverifyBidderWithClarification: (clarificationId: string) => void;
  syncAuthSession: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSession = getActiveAuthSession();
  const [role, setRole] = useState<UserRole>(initialSession?.role || 'OFFICER');
  const [activeView, setActiveView] = useState<NavView>(
    initialSession?.role === 'VENDOR' ? 'vendor-portal' : initialSession?.role === 'ADMIN' ? 'admin-console' : 'dashboard'
  );
  const [departments] = useState<string[]>(MOCK_DEPARTMENTS);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Ministry of Petroleum & Natural Gas');
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
  const [bidders, setBidders] = useState<Bidder[]>(MOCK_BIDDERS);
  const [selectedTender, setSelectedTender] = useState<Tender>(MOCK_TENDERS[0]);
  const [selectedBidder, setSelectedBidder] = useState<Bidder>(MOCK_BIDDERS[0]);
  const [selectedFindingIndex, setSelectedFindingIndex] = useState<number>(0);
  const [kpis, setKpis] = useState<DashboardKPIs>(INITIAL_KPIS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFindingModalId, setActiveFindingModalId] = useState<string | null>(null);
  
  // Clarification & Notification State
  const [clarifications, setClarifications] = useState<ClarificationRequest[]>(() => {
    try {
      const saved = localStorage.getItem(CLAR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CLARIFICATIONS;
    } catch {
      return INITIAL_CLARIFICATIONS;
    }
  });
  const [activeClarification, setActiveClarification] = useState<ClarificationRequest | null>(clarifications[0] || null);
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => getStoredNotifications());

  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStepText, setDemoStepText] = useState('');

  useEffect(() => {
    setAuditLogs(getStoredAuditLogs());
  }, []);

  const saveClarificationsState = (list: ClarificationRequest[]) => {
    setClarifications(list);
    localStorage.setItem(CLAR_STORAGE_KEY, JSON.stringify(list));
  };

  const selectTenderById = (id: string) => {
    const found = tenders.find(t => t.id === id || t.gemBidNo === id);
    if (found) {
      setSelectedTender(found);
      const matchingBidder = bidders.find(b => b.tenderId === found.id);
      if (matchingBidder) {
        setSelectedBidder(matchingBidder);
      }
    }
  };

  const selectBidderById = (id: string) => {
    const found = bidders.find(b => b.id === id);
    if (found) {
      setSelectedBidder(found);
    }
  };

  const addCustomBidder = (bidder: Bidder) => {
    setBidders(prev => [bidder, ...prev]);
    setSelectedBidder(bidder);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  // ── Officer creates & dispatches Clarification (Section 8 & 9) ──
  const sendClarificationRequest = (req: Partial<ClarificationRequest>): ClarificationRequest => {
    const newId = req.id || `CLAR-2026-${(clarifications.length + 1).toString().padStart(3, '0')}`;
    const newClar: ClarificationRequest = {
      id: newId,
      tenderId: req.tenderId || selectedTender.gemBidNo,
      tenderTitle: req.tenderTitle || selectedTender.title,
      bidderId: req.bidderId || selectedBidder.id,
      bidderName: req.bidderName || selectedBidder.name,
      issueCategory: req.issueCategory || 'Turnover discrepancy',
      tenderRequirement: req.tenderRequirement || '≥ ₹10 Cr (Average annual turnover during previous 3 FYs)',
      bidderClaim: req.bidderClaim || `₹${selectedBidder.claimedTurnover} Crore`,
      referenceEvidence: req.referenceEvidence || `₹${selectedBidder.verifiedTurnover} Crore`,
      variance: req.variance || '-₹3.3 Crore (-27.5% Deficit below tender threshold)',
      whyRequired: req.whyRequired || 'Declared turnover in submitted CA statement differs from official financial registry records (MCA21 Form AOC-4), falling below the mandatory ₹10 Cr threshold without reconciliation.',
      officerQuery: req.officerQuery || 'Your submitted bid declares an average annual turnover of ₹12.0 Crore. Available reference evidence in MCA21 Form AOC-4 records ₹8.7 Crore. Please provide supporting audited financial statements (FY 2024-25) and/or CA reconciliation explaining the discrepancy.',
      evidenceReference: req.evidenceReference || 'MCA21 Form AOC-4 Financial Filing & CA Turnover Certificate (Page 3)',
      responseDeadline: req.responseDeadline || '04-Sep-2026, 17:00 IST (48 Hours)',
      status: 'AWAITING_RESPONSE',
      createdAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB').slice(0, 5) + ' IST',
      sentAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB').slice(0, 5) + ' IST',
      officerId: 'PO-1042',
      officerRemarks: req.officerRemarks || 'Disclose standalone vs consolidated financial turnover statements for FY 2023-24, 2024-25, and 2025-26.',
      sharedEvidence: req.sharedEvidence || [
        {
          id: 'SEV-01',
          title: 'MCA21 Form AOC-4 Financial Filing (FY 2024-25)',
          sourceRegistry: 'MCA21 / Ministry of Corporate Affairs',
          documentRef: 'SRN-AOC4-2025-99214',
          type: 'REGISTRY_RECORD',
          date: '30-Oct-2025',
          excerpt: 'Line 19 Form AOC-4: Standalone Revenue from Operations ₹8,70,00,000 for CIN U72900KA2018PTC112345.',
          checksum: 'sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
          size: '1.8 MB',
          selected: true
        }
      ],
      aiRecommendation: 'AI Recommendation: Requires Officer Verification',
      previousFindingSummary: `Turnover discrepancy: Declared ₹${selectedBidder.claimedTurnover} Cr vs Reference ₹${selectedBidder.verifiedTurnover} Cr (Shortfall below requirement)`,
      updatedFindingSummary: 'Pending vendor evidence submission and AI re-extraction.'
    };

    const updated = [newClar, ...clarifications.filter(c => c.id !== newId)];
    saveClarificationsState(updated);
    setActiveClarification(newClar);

    // Create Notification for Vendor
    createNotification(
      'VENDOR',
      newClar.bidderId,
      'New Clarification Request',
      `Procurement Officer PO-1042 has requested clarification for Tender ${newClar.tenderId} regarding ${newClar.issueCategory}. Selected evidence attached.`,
      'CLARIFICATION_REQUEST',
      newClar.id,
      ['IN_APP', 'DASHBOARD', 'SIMULATED_EMAIL']
    );
    setNotifications(getStoredNotifications());

    // Record in Audit Trail
    const log = logCustomAuditEvent(
      'PO-1042',
      newClar.tenderId,
      newClar.bidderName,
      'Procurement Officer',
      `Clarification Notice Dispatched (${newClar.id})`,
      'CLARIFICATION_SENT',
      `Sent clarification regarding ${newClar.issueCategory} with ${newClar.sharedEvidence?.filter(e => e.selected).length || 0} shared evidence record(s). Deadline: ${newClar.responseDeadline}`,
      newClar.id,
      'AWAITING_RESPONSE'
    );
    setAuditLogs(prev => [log, ...prev]);

    return newClar;
  };

  // ── Vendor Submits Clarification Response (Section 12 & 13) ──
  const submitVendorClarificationResponse = (
    clarificationId: string,
    explanation: string,
    docs: ClarificationDocument[]
  ) => {
    const updated = clarifications.map(c => {
      if (c.id === clarificationId) {
        return {
          ...c,
          status: 'RESPONSE_RECEIVED' as const,
          vendorExplanation: explanation || 'Submitted Global Board Resolution & Parent Corporate Undertaking from Atlas Copco Airpower n.v., Belgium confirming Atlas Copco (India) Private Limited as 100% operational subsidiary with direct technical support and back-to-back OEM warranty.',
          vendorResponseSubmittedAt: '02-Sep-2026 12:15 IST',
          vendorSupportingDocs: docs.length > 0 ? docs : [
            { id: 'D1', name: 'AtlasCopco_Corporate_Undertaking_BoardResolution.pdf', size: '2.4 MB', type: 'PDF', checksum: 'sha256:4a8c91d2e0f872b65103a8904712ec3105ab6719cd288231aa492147810fed44', uploadedAt: '02-Sep-2026 12:15 IST' },
            { id: 'D2', name: 'Global_Parent_BackToBack_Warranty_Guarantee.pdf', size: '1.2 MB', type: 'PDF', checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7', uploadedAt: '02-Sep-2026 12:15 IST' }
          ],
          aiExtractedValues: [
            {
              field: 'OEM Authorization Status',
              claimed: 'Authorized Indian Operating Subsidiary',
              previousEvidence: 'Parent Entity MAF (Pending Scope Confirmation)',
              newExtractedValue: 'Fully Authorized Subsidiary with Direct OEM Warranty Backing',
              documentSource: 'Corporate Relationship Undertaking & Global Board Resolution',
              confidence: 99,
              timestamp: '02-Sep-2026 12:16 IST'
            }
          ],
          aiRecommendation: 'AI Recommendation: Requires Officer Verification',
          recommendedAction: 'Review the submitted Global Board Resolution and confirm back-to-back warranty coverage before approving Pre-Qualification.',
          updatedFindingSummary: 'OEM MAF Reconciled: Submitted Corporate Undertaking & Board Resolution confirm 100% Indian operating subsidiary status with direct OEM warranty backing.'
        };
      }
      return c;
    });

    saveClarificationsState(updated);
    const active = updated.find(c => c.id === clarificationId);
    if (active) setActiveClarification(active);

    // Notify Officer
    createNotification(
      'OFFICER',
      'PO-1042',
      'New Vendor Clarification Response',
      `${selectedBidder.name} has submitted a response with ${docs.length} supporting document(s) for Clarification ${clarificationId}.`,
      'CLARIFICATION_RESPONSE',
      clarificationId,
      ['IN_APP', 'DASHBOARD']
    );
    setNotifications(getStoredNotifications());

    // Record in Audit Trail
    const log = logCustomAuditEvent(
      'VEN-PET-001',
      selectedTender.gemBidNo,
      selectedBidder.name,
      'Authorized Vendor',
      `Clarification Response Submitted (${clarificationId})`,
      'RESPONSE_SUBMITTED',
      `Vendor provided explanation and uploaded ${docs.length} supporting file(s): ${docs.map(d => d.name).join(', ')}`,
      clarificationId,
      'RESPONSE_RECEIVED'
    );
    setAuditLogs(prev => [log, ...prev]);
  };

  // ── Officer Reviews & Re-verifies Clarification ──
  const reverifyBidderWithClarification = (clarificationId: string) => {
    // Re-verify: update Atlas Copco / Bidder state
    const updatedBidder: Bidder = {
      ...selectedBidder,
      complianceMatrix: selectedBidder.complianceMatrix.map(row => {
        if (row.id === 'CM-01' || row.requirement.includes('OEM') || row.findingId === 'FND-OEM-01') {
          return {
            ...row,
            verifiedSource: 'OEM Parent Undertaking & Board Resolution Verified',
            result: 'PASS',
            confidence: 99,
            risk: 'LOW',
            officerAction: 'Clarification Accepted — 100% Direct OEM Operating Backing Confirmed'
          };
        }
        return row;
      }),
      riskProfile: {
        ...selectedBidder.riskProfile,
        complianceScore: 100,
        overallRisk: 'LOW',
        aiRecommendation: 'CLEARED',
        summary: 'All 9 compliance requirements verified. OEM manufacturer authorization fully validated with direct parent company backing.',
        topIssues: []
      },
      truthGraph: {
        ...selectedBidder.truthGraph,
        nodes: selectedBidder.truthGraph.nodes.map(n => {
          if (n.id === 'N-OEM') {
            return {
              ...n,
              status: 'verified',
              value: 'Direct OEM Authorized Subsidiary',
              description: 'Confirmed via Board Resolution & Global Undertaking.'
            };
          }
          return n;
        }),
        edges: selectedBidder.truthGraph.edges.map(e => {
          if (e.to === 'N-OEM') {
            return { ...e, status: 'valid' };
          }
          return e;
        })
      }
    };

    setBidders(prev => prev.map(b => b.id === updatedBidder.id ? updatedBidder : b));
    setSelectedBidder(updatedBidder);

    // Update Clarification Status
    const updatedClarifications = clarifications.map(c => {
      if (c.id === clarificationId) {
        return {
          ...c,
          status: 'ACCEPTED' as const,
          reVerificationResult: 'RESOLVED' as const,
          aiRecommendation: 'AI Recommendation: Requires Officer Verification',
          updatedFindingSummary: 'OEM MAF Reconciled: Submitted Corporate Undertaking & Board Resolution confirm 100% Indian operating subsidiary status with direct OEM warranty backing.',
          reVerificationDetails: 'AI Evidence extraction confirmed parent-subsidiary corporate linkage and back-to-back warranty coverage for CPCL Radiant Tubes.',
          resolvedAt: new Date().toLocaleDateString('en-GB') + ' IST'
        };
      }
      return c;
    });
    saveClarificationsState(updatedClarifications);

    // Add Audit Log
    const log = logCustomAuditEvent(
      'PO-1042',
      selectedTender.gemBidNo,
      selectedBidder.name,
      'Procurement Officer',
      `AI Re-Verification Completed (${clarificationId})`,
      'CLARIFICATION_ACCEPTED',
      'AI Re-extraction confirmed OEM subsidiary relationship & warranty backing. Compliance Matrix updated to 100% PASS.',
      clarificationId,
      'RESOLVED'
    );
    setAuditLogs(prev => [log, ...prev]);
  };

  const adjudicateClarificationResponse = (
    clarificationId: string,
    action: 'ACCEPT' | 'ADDITIONAL' | 'INVESTIGATION' | 'MISMATCH_REMAINS' | 'ESCALATE_TO_SPECIALIST',
    notes: string
  ) => {
    if (action === 'ACCEPT') {
      reverifyBidderWithClarification(clarificationId);
    } else {
      const outcomeStatus: 'RESOLVED' | 'FURTHER_VERIFICATION_REQUIRED' | 'MISMATCH_REMAINS' | 'ESCALATE_TO_SPECIALIST' | 'ADDITIONAL_EVIDENCE_REQUIRED' | 'MANUAL_INVESTIGATION' = 
        action === 'ADDITIONAL' ? 'ADDITIONAL_EVIDENCE_REQUIRED' :
        action === 'MISMATCH_REMAINS' ? 'MISMATCH_REMAINS' :
        action === 'ESCALATE_TO_SPECIALIST' ? 'ESCALATE_TO_SPECIALIST' :
        'MANUAL_INVESTIGATION';

      const updated = clarifications.map(c => {
        if (c.id === clarificationId) {
          return {
            ...c,
            status: action === 'ADDITIONAL' ? ('ADDITIONAL_CLARIFICATION_REQUIRED' as const) : ('UNDER_REVIEW' as const),
            officerReviewNotes: notes,
            reVerificationResult: outcomeStatus,
            aiRecommendation: 'AI Recommendation: Requires Officer Verification',
            updatedFindingSummary: `Officer Adjudication recorded: ${action}. Notes: ${notes}`
          };
        }
        return c;
      });
      saveClarificationsState(updated);

      const log = logCustomAuditEvent(
        'PO-1042',
        selectedTender.gemBidNo,
        selectedBidder.name,
        'Procurement Officer',
        `Clarification Adjudication (${clarificationId})`,
        action === 'ADDITIONAL' ? 'ADDITIONAL_CLARIFICATION' : action,
        `Officer Notes: ${notes}`,
        clarificationId,
        action
      );
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const recordDecision = (action: DecisionAction, remarks: string, query?: string) => {
    const decision: OfficerDecision = {
      id: `DEC-${Date.now().toString().slice(-6)}`,
      evaluationId: selectedTender.gemBidNo,
      bidderId: selectedBidder.id,
      action,
      reasonRemarks: remarks,
      clarificationQuery: query,
      officerName: 'Rajeshwar Rao',
      officerDesignation: 'Senior Procurement Officer',
      officerId: 'PO-1042',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      digitalSignatureHash: `SIG-PO1042-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    const updatedBidder: Bidder = {
      ...selectedBidder,
      officerDecision: decision
    };

    setBidders(prev => prev.map(b => b.id === updatedBidder.id ? updatedBidder : b));
    setSelectedBidder(updatedBidder);

    const newLog = logOfficerDecision(decision, selectedBidder.name);
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const resetDemoData = () => {
    setTenders(MOCK_TENDERS);
    setBidders(MOCK_BIDDERS);
    setSelectedDepartment('Ministry of Petroleum & Natural Gas');
    setSelectedTender(MOCK_TENDERS[0]);
    setSelectedBidder(MOCK_BIDDERS[0]);
    setKpis(INITIAL_KPIS);
    localStorage.removeItem('bidshield_audit_logs');
    localStorage.removeItem(CLAR_STORAGE_KEY);
    localStorage.removeItem('bidshield_system_notifications');
    setClarifications(INITIAL_CLARIFICATIONS);
    setActiveClarification(INITIAL_CLARIFICATIONS[0]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(getStoredAuditLogs());
    setActiveView(role === 'VENDOR' ? 'vendor-portal' : 'dashboard');
  };

  const runFullDemoWalkthrough = () => {
    setIsDemoRunning(true);
    const steps: { view: NavView; text: string; delay: number }[] = [
      { view: 'dashboard', text: 'Step 1/23: Authenticated Officer PO-1042 — Petroleum Procurement Dashboard', delay: 1800 },
      { view: 'active-tenders', text: 'Step 2/23: Selecting Petroleum Tender GEM/2026/B/921450 (Pipeline Monitoring & Safety)...', delay: 1800 },
      { view: 'tender-requirement-analysis', text: 'Step 3/23: AI Analyzing Tender clauses, financial thresholds (≥ ₹10 Cr) & safety criteria...', delay: 2000 },
      { view: 'compliance-rules', text: 'Step 4/23: Tender-to-Rule Compiler: Compiled Structured Machine Rules (PET-FIN-001, etc.)...', delay: 2000 },
      { view: 'bids-received', text: 'Step 5/23: Selecting Primary Demo Bidder: ABC Industries Pvt Ltd...', delay: 1800 },
      { view: 'document-review', text: 'Step 6/23: Loading Bidder Documents & computing SHA-256 Checksums...', delay: 1800 },
      { view: 'ai-verification', text: 'Step 7/23: AI Evidence Extraction: Extracted claims with 94-99% field confidence...', delay: 1800 },
      { view: 'government-verification', text: 'Step 8/23: Running Multi-Source Verification Hub across statutory registries...', delay: 2200 },
      { view: 'government-verification', text: 'Step 9/23: Inconsistency Detected: Turnover Mismatch (Claimed ₹12 Cr vs MCA21 ₹8.7 Cr)...', delay: 2000 },
      { view: 'temporal-compliance', text: 'Step 10/23: Temporal Engine: Certificate Validity Check...', delay: 2000 },
      { view: 'truth-graph', text: 'Step 11/23: Truth Graph: Interconnecting entity, claims, registries, and conflict edges...', delay: 2200 },
      { view: 'compliance-matrix', text: 'Step 12/23: Compliance Matrix: Compiled requirement evaluation (Score: 84%)...', delay: 2000 },
      { view: 'risk-intelligence', text: 'Step 13/23: Risk Intelligence Radar: Financial Risk (72%), Document Risk (61%), Overall: HIGH...', delay: 2000 },
      { view: 'investigation-priority', text: 'Step 14/23: Investigation Priority Engine: Ranked P1 (Turnover Mismatch)...', delay: 2000 },
      { view: 'clarification-center', text: 'Step 15/23: Clarification Drafter: Selecting MCA21 evidence to share & dispatching notice...', delay: 2200 },
      { view: 'vendor-portal', text: 'Step 16/23: Vendor Portal: Viewing shared MCA21 evidence & uploading Audited Financial Statement FY 2024-25...', delay: 2400 },
      { view: 'clarification-center', text: 'Step 17/23: Officer Review: AI extracts ₹12.1 Cr & confirms UDIN 2688124A (Recommendation: Requires Officer Verification)...', delay: 2400 },
      { view: 'clarification-center', text: 'Step 18/23: Officer accepts response: Turnover updated to RESOLVED (Score: 94%)...', delay: 2000 },
      { view: 'decision', text: 'Step 19/23: Procurement Officer PO-1042 records final qualification determination...', delay: 2000 },
      { view: 'audit-trail', text: 'Step 20/23: Audit Trail: Tamper-evident ledger record committed...', delay: 1800 },
      { view: 'report', text: 'Step 21/23: Verification Flow Complete — Forensic Evaluation Report generated with full audit trail.', delay: 2000 }
    ];

    let currentIdx = 0;
    const runNextStep = () => {
      if (currentIdx < steps.length) {
        const s = steps[currentIdx];
        setActiveView(s.view);
        setDemoStepText(s.text);
        currentIdx++;
        setTimeout(runNextStep, s.delay);
      } else {
        setIsDemoRunning(false);
        setDemoStepText('');
      }
    };
    runNextStep();
  };

  const runClarificationDemo = () => {
    setIsDemoRunning(true);
    setRole('OFFICER');
    setActiveView('clarification-center');
    setDemoStepText('Step 1/6: Officer reviewing Turnover Mismatch & selecting MCA21 evidence to share with bidder...');

    setTimeout(() => {
      // Step 2: Officer Sends Clarification with shared MCA21 evidence
      setDemoStepText('Step 2/6: Clarification Notice CLAR-2026-001 dispatched with MCA21 Form AOC-4 evidence attachment...');
      sendClarificationRequest({
        tenderId: selectedTender.gemBidNo,
        tenderTitle: selectedTender.title,
        bidderId: selectedBidder.id,
        bidderName: selectedBidder.name,
        issueCategory: 'Turnover discrepancy',
        tenderRequirement: '≥ ₹10 Cr (Average annual turnover during previous 3 FYs)',
        bidderClaim: `₹${selectedBidder.claimedTurnover} Crore`,
        referenceEvidence: `₹${selectedBidder.verifiedTurnover} Crore`,
        variance: '-₹3.3 Crore (-27.5% Deficit below tender threshold)',
        whyRequired: 'Declared turnover of ₹12.0 Cr in submitted CA statement differs from official financial registry filings (MCA21 Form AOC-4: ₹8.7 Cr), falling below the mandatory ₹10 Cr threshold without reconciliation.',
        officerQuery: 'Your submitted bid declares an average annual turnover of ₹12.0 Crore. Available reference evidence in MCA21 Form AOC-4 records ₹8.7 Crore. Please provide supporting audited financial statements (FY 2024-25) and/or CA reconciliation statement explaining the discrepancy.',
        evidenceReference: 'MCA21 Form AOC-4 Filing (SRN-AOC4-2025-99214) & CA Turnover Certificate (Page 3)',
        responseDeadline: '04-Sep-2026, 17:00 IST (48 Hours)',
        officerRemarks: 'Disclose standalone vs consolidated financial turnover statements for FY 2023-24, 2024-25, and 2025-26.',
        sharedEvidence: [
          {
            id: 'SEV-01',
            title: 'MCA21 Form AOC-4 Financial Filing (FY 2024-25)',
            sourceRegistry: 'MCA21 / Ministry of Corporate Affairs',
            documentRef: 'SRN-AOC4-2025-99214',
            type: 'REGISTRY_RECORD',
            date: '30-Oct-2025',
            excerpt: 'Line 19 Form AOC-4: Standalone Revenue from Operations ₹8,70,00,000 for CIN U72900KA2018PTC112345.',
            checksum: 'sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
            size: '1.8 MB',
            selected: true
          }
        ]
      });

      setTimeout(() => {
        // Step 3: Switch to Vendor Role & View Portal
        setRole('VENDOR');
        setActiveView('vendor-portal');
        setDemoStepText('Step 3/6: Vendor (ABC Industries Pvt Ltd) opens Clarification Requests & inspects shared MCA21 evidence...');

        setTimeout(() => {
          // Step 4: Vendor Submits Response with Audited Financial Statement FY 2024-25
          setDemoStepText('Step 4/6: Vendor uploads Audited_Financial_Statement_FY2024-25.pdf (UDIN 2688124A) & submits response...');
          submitVendorClarificationResponse(
            'CLAR-2026-001',
            'Please find attached the Audited Financial Statement for FY 2024–25 and Chartered Accountant reconciliation certificate with UDIN 2688124A explaining standalone vs consolidated turnover. The consolidated audited revenue is ₹12.1 Crore, satisfying the ≥ ₹10 Crore tender requirement.',
            [
              {
                id: 'CDOC-01',
                name: 'Audited_Financial_Statement_FY2024-25.pdf',
                size: '2.4 MB',
                type: 'AUDITED_FINANCIALS',
                uploadedAt: '12-Aug-2026 11:15 IST',
                checksum: 'sha256:7e8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
                verifiedStatus: 'VERIFIED'
              },
              {
                id: 'CDOC-02',
                name: 'CA_Turnover_Reconciliation_Statement_UDIN.pdf',
                size: '1.2 MB',
                type: 'CA_RECONCILIATION',
                uploadedAt: '12-Aug-2026 11:18 IST',
                checksum: 'sha256:9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
                verifiedStatus: 'VERIFIED'
              }
            ]
          );

          setTimeout(() => {
            // Step 5: Switch back to Officer
            setRole('OFFICER');
            setActiveView('clarification-center');
            setDemoStepText('Step 5/6: Officer notified of submission. AI extracts ₹12.1 Cr from Audited Statement (AI Recommendation: Requires Officer Verification)...');

            setTimeout(() => {
              // Step 6: Officer Accepts Response & Finding is Updated
              setDemoStepText('Step 6/6: Officer accepts response: Turnover discrepancy RESOLVED (Score: 94%). Ready for Final Officer Decision.');
              adjudicateClarificationResponse(
                'CLAR-2026-001',
                'ACCEPT',
                'Vendor submitted Audited Financial Statement FY 2024–25 with valid UDIN 2688124A substantiating ₹12.1 Cr consolidated turnover (≥ ₹10 Cr requirement). Re-verification confirms compliance.'
              );

              setTimeout(() => {
                setIsDemoRunning(false);
                setDemoStepText('');
              }, 3000);
            }, 2500);
          }, 2500);
        }, 2500);
      }, 2500);
    }, 2000);
  };

  const syncAuthSession = () => {
    const session = getActiveAuthSession();
    if (session) {
      setRole(session.role);
      if (session.role === 'VENDOR') {
        setActiveView('vendor-portal');
      } else if (session.role === 'ADMIN') {
        setActiveView('admin-console');
      } else {
        setActiveView('dashboard');
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeView,
        setActiveView,
        departments,
        selectedDepartment,
        setSelectedDepartment,
        tenders,
        bidders,
        selectedTender,
        setSelectedTender,
        selectTenderById,
        selectedBidder,
        setSelectedBidder,
        selectBidderById,
        selectedFindingIndex,
        setSelectedFindingIndex,
        kpis,
        auditLogs,
        recordDecision,
        resetDemoData,
        searchQuery,
        setSearchQuery,
        activeFindingModalId,
        setActiveFindingModalId,
        runFullDemoWalkthrough,
        runClarificationDemo,
        isDemoRunning,
        demoStepText,
        addCustomBidder,
        clarifications,
        activeClarification,
        setActiveClarification,
        sendClarificationRequest,
        submitVendorClarificationResponse,
        adjudicateClarificationResponse,
        notifications,
        markNotificationAsRead,
        reverifyBidderWithClarification,
        syncAuthSession
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
