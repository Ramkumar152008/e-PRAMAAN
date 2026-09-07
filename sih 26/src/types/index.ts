export type UserRole = 'OFFICER' | 'VENDOR' | 'ADMIN';

export type DecisionAction = 
  | 'PENDING'
  | 'APPROVE' 
  | 'REJECT' 
  | 'REQUEST_CLARIFICATION' 
  | 'MANUAL_INVESTIGATION'
  | 'CLEARED'
  | 'REQUIRES_VERIFICATION'
  | 'FLAGGED_FOR_INVESTIGATION';

export type VerificationStatus = 'PASS' | 'FAIL' | 'CONFLICT' | 'WARNING' | 'PENDING';

export type SourceFreshnessStatus = 'CURRENT' | 'STALE' | 'REFRESH_REQUIRED' | 'UNAVAILABLE';

export type EvidenceStatusTaxonomy = 
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'CONFLICTING'
  | 'UNVERIFIED'
  | 'EXPIRED'
  | 'MISSING'
  | 'NOT_APPLICABLE'
  | 'REQUIRES_HUMAN_REVIEW';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TenderRule {
  id: string;
  ruleVersion?: string; // e.g. 'v1.3'
  effectiveDate?: string; // e.g. '01-Apr-2026'
  sourceClause?: string; // e.g. 'Clause 4.2'
  metric: string;
  minimumValue: string | number;
  unit?: string;
  period?: string;
  operator: '>=' | '<=' | '==' | 'IN' | 'VALID_ON_DATE' | 'NON_BLACKLISTED' | 'CONTAINS';
  mandatory: boolean;
  description: string;
  referenceClause: string;
  category: 'FINANCIAL' | 'EXPERIENCE' | 'REGISTRATION' | 'OEM' | 'SAFETY' | 'TEMPORAL' | 'DEBARMENT' | 'TECHNICAL' | 'LOCAL_CONTENT' | 'STATUTORY';
}

export interface Tender {
  id: string;
  gemBidNo: string;
  title: string;
  ministry: string;
  department: string;
  location?: string;
  estimatedValue: number; // in Crores
  publishDate: string;
  bidEndDate: string;
  submissionDeadline: string;
  status: 'ACTIVE_EVALUATION' | 'PUBLISHED' | 'FINALIZED' | 'UNDER_VERIFICATION' | 'UNDER_EVALUATION' | 'REVIEW_REQUIRED';
  category: string;
  petroleumCategory?: string;
  tenderType?: string;
  evaluationMethod?: string;
  stage?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  issuesCount?: number;
  bidsCount?: number;
  isPrimaryDemo?: boolean;
  rules: TenderRule[];
  rawClauses: string[];
}

export interface CertificateDetail {
  id: string;
  name: string;
  issuer: string;
  certNumber: string;
  issueDate: string;
  expiryDate: string;
  statusOnBidDate: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON';
  fileUrl: string;
}

export interface OEMAuthDetail {
  oemName: string;
  authCode: string;
  issuedTo: string;
  validTill: string;
  verifiedDirectly: boolean;
  qrVerified: boolean;
  notes: string;
}

export interface BidderDocument {
  id: string;
  name: string;
  type: 
    | 'PAN_CERT'
    | 'GST_CERT' 
    | 'UDYAM' 
    | 'AUDITED_FINANCIALS' 
    | 'CA_TURNOVER_CERT' 
    | 'OG_EXPERIENCE_CERT' 
    | 'WORK_ORDERS' 
    | 'OEM_AUTH' 
    | 'SAFETY_CERT' 
    | 'ISO_CERT' 
    | 'COMPANY_REG' 
    | 'ITR' 
    | 'DEBARMENT_DECLARATION' 
    | 'TECHNICAL_SPECS'
    | 'BALANCE_SHEET'
    | 'PAST_EXPERIENCE'
    | 'AFFIDAVIT';
  size: string;
  uploadedAt: string;
  checksum: string;
  status: 'EXTRACTED' | 'FAILED' | 'PENDING';
  pageCount: number;
  extractionConfidence?: number;
  previousHash?: string;
  replacedAt?: string;
}

export interface ExtractedField {
  fieldName: string;
  extractedValue: string;
  confidence: number;
  extractionConfidence?: number; // AI OCR/parsing confidence
  sourceMatchConfidence?: number; // Registry match confidence
  overallEvidenceConfidence?: number; // Combined evidence certainty
  pageNumber: number;
  sourceDoc: string;
  officerConfirmed?: boolean;
  officerCorrectedValue?: string;
}

export interface VerificationField {
  id: string;
  field: string;
  bidderClaim: string;
  verifiedSource: string;
  sourceRegistry: 
    | 'GSTN' 
    | 'Udyam / MSME' 
    | 'PAN / Income Tax' 
    | 'MCA21' 
    | 'EPFO' 
    | 'ESIC' 
    | 'Startup India' 
    | 'NSIC' 
    | 'OEM Verification' 
    | 'DigiLocker' 
    | 'Make in India / DPIIT' 
    | 'BIS / DPIIT' 
    | 'Blacklisting / Debarment'
    | 'GSTN Portal'
    | 'OEM Gateway'
    | 'CPPP Blacklist'
    | 'State Debarment Registry';
  status: VerificationStatus;
  evidenceStatus?: EvidenceStatusTaxonomy;
  freshnessStatus?: SourceFreshnessStatus;
  confidence: number;
  extractionConfidence?: number;
  sourceMatchConfidence?: number;
  overallEvidenceConfidence?: number;
  evidenceRef: string;
  details: string;
  timestamp: string;
}

export interface TruthGraphNode {
  id: string;
  label: string;
  type: 'entity' | 'registry' | 'attribute' | 'document' | 'alert';
  status: 'verified' | 'conflict' | 'warning' | 'normal';
  value?: string;
  source?: string;
  evidenceRef?: string;
  timestamp?: string;
  description?: string;
  affectedRule?: string;
  recommendedAction?: string;
  x?: number;
  y?: number;
}

export interface TruthGraphEdge {
  from: string;
  to: string;
  label: string;
  status: 'valid' | 'conflict' | 'warning';
}

export interface TruthGraphData {
  nodes: TruthGraphNode[];
  edges: TruthGraphEdge[];
}

export interface TemporalCheck {
  id: string;
  documentName: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  bidDate: string;
  status: 'VALID' | 'EXPIRED_BEFORE_BID' | 'EXPIRING_SOON';
  daysDifference: number;
  remarks: string;
  confidence: number;
  affectedRule?: string;
  impactExplanation?: string;
  recommendedOfficerAction?: string;
}

export interface ComplianceMatrixRow {
  id: string;
  requirement: string;
  mandatory: boolean;
  bidderEvidence: string;
  verifiedSource: string;
  result: VerificationStatus;
  evidenceStatus?: EvidenceStatusTaxonomy;
  confidence: number;
  risk: RiskLevel;
  officerAction: string;
  findingId?: string;
}

export interface RiskFingerprintDimension {
  dimension: 'FINANCIAL' | 'DOCUMENT' | 'ELIGIBILITY' | 'TEMPORAL' | 'IDENTITY' | 'SOURCE_RELIABILITY';
  name: string;
  score: number; // 0-100
  severity: RiskLevel;
  reasons: string[];
  evidenceCited: string[];
}

export interface RiskFingerprint {
  overallScore: number; // 84%
  overallLevel: RiskLevel; // HIGH
  confidence: number; // 78%
  aiRecommendation: DecisionAction; // MANUAL_INVESTIGATION
  dimensions: RiskFingerprintDimension[];
  modelDisclaimer: string;
}

export interface RiskProfile {
  complianceScore: number; // e.g. 84%
  evidenceConfidence: number; // e.g. 78%
  financialRisk: number; // e.g. 72%
  documentRisk: number; // e.g. 61%
  eligibilityRisk: number; // e.g. 32%
  temporalRisk?: number; // e.g. 85%
  identityRisk?: number; // e.g. 8%
  sourceReliability?: number; // e.g. 94%
  overallRisk: RiskLevel; // HIGH
  aiRecommendation: DecisionAction;
  summary: string;
  topIssues: string[];
  fingerprint?: RiskFingerprint;
}

export interface InvestigationPriorityItem {
  id: string;
  priority: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  claimedValue: string;
  verifiedValue: string;
  recommendedOfficerAction: string;
  affectedRule: string;
  evidenceRef: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface XAIFinding {
  id: string;
  requirement: string;
  rule: string;
  claim: string;
  submittedDocument: string;
  verificationSource: string;
  verifiedSource?: string;
  comparison: string;
  finding: string;
  whyItMatters: string;
  evidence: string;
  confidence: number;
  extractionConfidence?: number;
  sourceMatchConfidence?: number;
  overallEvidenceConfidence?: number;
  risk: RiskLevel;
  recommendedAction: string;
}

export interface EvidencePassportCategory {
  category: 'IDENTITY' | 'FINANCIAL' | 'EXPERIENCE' | 'CERTIFICATIONS' | 'OEM' | 'ADDRESS' | 'DEBARMENT';
  title: string;
  status: 'VERIFIED' | 'CONFLICT' | 'WARNING' | 'EXPIRED' | 'UNAVAILABLE';
  claimed: string;
  verified: string;
  variance?: string;
  freshness: SourceFreshnessStatus;
  source: string;
  evidenceRef: string;
  officerActionRequired: boolean;
}

export interface EvidencePassport {
  bidderId: string;
  bidderName: string;
  evidenceHealthScore: number; // e.g. 74%
  lastVerifiedTimestamp: string;
  overallFreshness: SourceFreshnessStatus;
  categories: EvidencePassportCategory[];
}

export interface EvidenceChangeDiff {
  parameter: string;
  ruleId: string;
  before: {
    claimed: string;
    verified: string;
    status: VerificationStatus;
    risk: RiskLevel;
    evidence: string;
  };
  clarification: {
    noticeId: string;
    submittedDoc: string;
    udin?: string;
    explanation: string;
  };
  after: {
    reconciledValue: string;
    status: VerificationStatus;
    risk: RiskLevel;
    reVerificationDetails: string;
  };
}

export interface OfficerDecision {
  id: string;
  evaluationId: string;
  bidderId: string;
  action: DecisionAction;
  reasonRemarks: string;
  clarificationQuery?: string;
  investigationChecklist?: string[];
  officerName: string;
  officerDesignation: string;
  officerId: string;
  timestamp: string;
  digitalSignatureHash: string;
}

export interface Bidder {
  id: string;
  tenderId: string;
  name: string;
  cin: string;
  pan: string;
  gstin: string;
  udyamNo: string;
  claimedAddress: string;
  verifiedAddress: string;
  claimedTurnover: number; // in Crores
  verifiedTurnover: number; // in Crores
  claimedExperienceYears: number;
  verifiedExperienceYears: number;
  turnoverBreakdown: { year: string; claimed: number; verified: number }[];
  bidSubmissionDate: string;
  documents: BidderDocument[];
  extractedFields: ExtractedField[];
  certificates: CertificateDetail[];
  oemAuth: OEMAuthDetail;
  crossVerifications: VerificationField[];
  truthGraph: TruthGraphData;
  temporalCompliance: TemporalCheck[];
  complianceMatrix: ComplianceMatrixRow[];
  riskProfile: RiskProfile;
  investigationPriorities: InvestigationPriorityItem[];
  findings: XAIFinding[];
  evidencePassport?: EvidencePassport;
  officerDecision?: OfficerDecision;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerId: string;
  evaluationId: string;
  bidder: string;
  actor: string;
  actorRole: string;
  action: string;
  decision: string;
  reason: string;
  target: string;
  targetRef?: string;
  result: string;
  evidenceRef?: string;
  eventHash: string;
  hash: string;
  details: string;
}

export interface DashboardKPIs {
  activeTenders: number; // 12
  bidsUnderReview: number; // 47
  highRiskBidders: number; // 6
  complianceConflicts: number; // 11
  pendingInvestigations: number; // 7
  averageVerificationTime: string; // 6.4 min
  activeEvaluations?: number;
}

export type ClarificationStatus = 
  | 'DRAFT' 
  | 'AWAITING_RESPONSE' 
  | 'RESPONSE_RECEIVED' 
  | 'UNDER_REVIEW' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'ADDITIONAL_CLARIFICATION_REQUIRED';

export interface ClarificationDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  checksum: string;
  verifiedStatus?: 'VERIFIED' | 'PENDING' | 'INVALID';
  extractedData?: Record<string, any>;
}

export interface SharedEvidenceItem {
  id: string;
  title: string;
  sourceRegistry: string;
  documentRef: string;
  type: 'REGISTRY_RECORD' | 'EXTRACTED_PAGE' | 'CALCULATION_DIFF' | 'AUDITED_STATEMENT';
  date: string;
  excerpt: string;
  checksum?: string;
  size?: string;
  selected: boolean;
}

export interface AIExtractedValueItem {
  field: string;
  claimed: string;
  previousEvidence: string;
  newExtractedValue: string;
  documentSource: string;
  udin?: string;
  confidence: number;
  timestamp: string;
}

export interface ClarificationRequest {
  id: string; // e.g. 'CLAR-2026-001'
  tenderId: string;
  tenderTitle: string;
  bidderId: string;
  bidderName: string;
  issueCategory: string; // e.g. 'Financial Turnover Discrepancy'
  tenderRequirement?: string; // e.g. '≥ ₹10 Cr'
  bidderClaim: string; // e.g. '₹12.0 Crore'
  referenceEvidence: string; // e.g. '₹8.7 Crore'
  variance: string; // e.g. '-₹3.3 Crore'
  whyRequired?: string; // Why clarification is required
  officerQuery: string; // AI generated / edited officer query
  evidenceReference: string; // e.g. 'CA Turnover Statement (Page 3)'
  responseDeadline: string; // e.g. '14-Aug-2026, 17:00 IST' (48 Hours)
  status: ClarificationStatus;
  createdAt: string;
  sentAt?: string;
  officerId: string;
  officerRemarks?: string;
  
  // Officer Selected Shared Evidence (Strictly only these are sent to vendor)
  sharedEvidence?: SharedEvidenceItem[];
  
  // Vendor Response Section
  vendorExplanation?: string;
  vendorResponseSubmittedAt?: string;
  vendorSupportingDocs?: ClarificationDocument[];
  
  // Officer Review & Re-verification Section
  aiExtractedValues?: AIExtractedValueItem[];
  officerReviewNotes?: string;
  reVerificationResult?: 
    | 'RESOLVED' 
    | 'FURTHER_VERIFICATION_REQUIRED' 
    | 'MISMATCH_REMAINS' 
    | 'ESCALATE_TO_SPECIALIST'
    | 'UNRESOLVED' 
    | 'ADDITIONAL_EVIDENCE_REQUIRED' 
    | 'MANUAL_INVESTIGATION';
  aiRecommendation?: string; // e.g. 'Requires Officer Verification'
  recommendedAction?: string;
  previousFindingSummary?: string;
  updatedFindingSummary?: string;
  finalOfficerDecisionStatus?: 'PENDING' | 'QUALIFIED' | 'DISQUALIFIED' | 'SPECIALIST_ESCALATION';
  reVerificationDetails?: string;
  resolvedAt?: string;
}

export interface SystemNotification {
  id: string;
  recipientRole: 'OFFICER' | 'VENDOR';
  recipientId: string;
  title: string;
  message: string;
  type: 'CLARIFICATION_REQUEST' | 'CLARIFICATION_RESPONSE' | 'VERIFICATION_UPDATE' | 'DECISION_ALERT';
  referenceId: string;
  timestamp: string;
  read: boolean;
  deliveryChannels: ('IN_APP' | 'DASHBOARD' | 'SIMULATED_EMAIL')[];
}
