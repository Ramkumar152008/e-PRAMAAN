"""
Pydantic Validation and Serialization Schemas
e-BID PRAMAAN — CPCL
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# ─── TENDER SCHEMAS ───────────────────────────────────────────────────────────

class TenderRuleSchema(BaseModel):
    id: str
    metric: str
    minimumValue: Any
    unit: Optional[str] = None
    period: Optional[str] = None
    operator: str = "=="
    mandatory: bool = True
    description: str
    referenceClause: str
    category: str = "STATUTORY"

class TenderRequirementCreate(BaseModel):
    requirementId: str
    clauseReference: str
    requirementName: str
    category: str = "STATUTORY"
    mandatory: bool = True
    metric: str
    minimumValue: str
    operator: str = "=="
    applicability: str = "All Bidders"
    validationRule: Optional[str] = None
    requiredEvidence: Optional[str] = None
    cutoffDate: Optional[str] = None
    description: Optional[str] = None

class TenderBase(BaseModel):
    id: str
    gemBidNo: str
    title: str
    ministry: str = "Ministry of Petroleum & Natural Gas"
    department: str = "M&C Department / Materials"
    location: Optional[str] = "CPCL Manali, Chennai"
    estimatedValue: float
    publishDate: str
    bidEndDate: str
    submissionDeadline: str
    status: str = "ACTIVE_EVALUATION"
    stage: Optional[str] = "Techno-Commercial Evaluation"
    priority: Optional[str] = "HIGH"
    tenderType: Optional[str] = "Open National Tender"
    evaluationMethod: Optional[str] = "Item-wise L1"
    category: str
    petroleumCategory: Optional[str] = None
    bidsCount: Optional[int] = 0
    issuesCount: Optional[int] = 0
    isPrimaryDemo: Optional[bool] = False
    rawClauses: List[str] = []

class TenderCreate(TenderBase):
    requirements: List[TenderRequirementCreate] = []

class TenderResponse(TenderBase):
    rules: List[TenderRuleSchema] = []
    model_config = ConfigDict(from_attributes=True)

# ─── BIDDER & EVIDENCE SCHEMAS ───────────────────────────────────────────────

class TurnoverBreakdownItem(BaseModel):
    year: str
    claimed: float
    verified: float

class ExtractedFieldSchema(BaseModel):
    fieldName: str
    extractedValue: str
    confidence: float
    pageNumber: int = 1
    sourceDoc: str
    officerConfirmed: Optional[bool] = False
    officerCorrectedValue: Optional[str] = None

class DocumentSchema(BaseModel):
    id: str
    name: str
    type: str = Field(alias="docType", default="GENERAL")
    size: str
    uploadedAt: str
    checksum: str
    status: str = "EXTRACTED"
    pageCount: int = 1
    extractionConfidence: Optional[float] = 95.0
    extractedFields: Optional[List[Dict[str, Any]]] = []
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ComplianceMatrixRowSchema(BaseModel):
    id: str
    requirement: str
    mandatory: bool
    bidderEvidence: str
    verifiedSource: str
    result: str
    confidence: float
    risk: str
    officerAction: str
    findingId: Optional[str] = None

class TemporalCheckSchema(BaseModel):
    id: str
    documentName: str
    certificateNumber: str
    issueDate: str
    expiryDate: str
    bidDate: str
    status: str
    daysDifference: int
    remarks: str
    confidence: float
    affectedRule: Optional[str] = None
    recommendedOfficerAction: Optional[str] = None

class RiskProfileSchema(BaseModel):
    complianceScore: float
    evidenceConfidence: float
    financialRisk: float
    documentRisk: float
    eligibilityRisk: float
    overallRisk: str
    aiRecommendation: str
    summary: str
    topIssues: List[str] = []

class XAIFindingSchema(BaseModel):
    id: str
    requirement: str
    rule: str
    claim: str
    submittedDocument: str
    verificationSource: str
    comparison: str
    finding: str
    whyItMatters: str
    evidence: str
    confidence: float
    risk: str
    recommendedAction: str

class BidderResponse(BaseModel):
    id: str
    tenderId: str
    name: str
    cin: Optional[str] = None
    pan: Optional[str] = None
    gstin: Optional[str] = None
    udyamNo: Optional[str] = None
    claimedAddress: Optional[str] = None
    verifiedAddress: Optional[str] = None
    claimedTurnover: float = 0.0
    verifiedTurnover: float = 0.0
    claimedExperienceYears: float = 0.0
    verifiedExperienceYears: float = 0.0
    bidSubmissionDate: str
    turnoverBreakdown: List[TurnoverBreakdownItem] = []
    documents: List[DocumentSchema] = []
    extractedFields: List[ExtractedFieldSchema] = []
    complianceMatrix: List[ComplianceMatrixRowSchema] = []
    temporalCompliance: List[TemporalCheckSchema] = []
    riskProfile: Optional[RiskProfileSchema] = None
    findings: List[XAIFindingSchema] = []
    status: str = "PENDING"
    model_config = ConfigDict(from_attributes=True)

# ─── MATCHING & COMPARISON SCHEMAS ──────────────────────────────────────────

class MatchingRequest(BaseModel):
    type: str = "IDENTIFIER"
    claimedValue: str
    referenceValue: str
    field: Optional[str] = None
    threshold: Optional[float] = None

class MatchingResponse(BaseModel):
    matchType: str
    score: float
    isMatch: bool
    status: str
    details: str
    normalizedClaim: str
    normalizedReference: str

# ─── TEMPORAL VALIDATION SCHEMAS ────────────────────────────────────────────

class TemporalValidationRequest(BaseModel):
    documentName: str
    certificateNumber: Optional[str] = None
    validFrom: Optional[str] = None
    validUntil: str
    bidCutoffDate: str

class TemporalValidationResponse(BaseModel):
    status: str
    isValidOnBidDate: bool
    daysRemainingOrOverdue: int
    message: str
    confidence: float

# ─── CLARIFICATION SCHEMAS ──────────────────────────────────────────────────

class SharedEvidenceItemSchema(BaseModel):
    id: str
    title: str
    sourceRegistry: str
    documentRef: str
    type: str
    date: str
    excerpt: str
    checksum: Optional[str] = None
    size: Optional[str] = None
    selected: bool = True

class ClarificationCreate(BaseModel):
    tenderId: str
    tenderTitle: Optional[str] = None
    bidderId: str
    bidderName: Optional[str] = None
    issueCategory: str
    tenderRequirement: Optional[str] = None
    bidderClaim: Optional[str] = None
    referenceEvidence: Optional[str] = None
    variance: Optional[str] = None
    whyRequired: Optional[str] = None
    officerQuery: str
    evidenceReference: Optional[str] = None
    responseDeadline: Optional[str] = None
    officerRemarks: Optional[str] = None
    sharedEvidence: List[SharedEvidenceItemSchema] = []

class VendorClarificationResponseSubmit(BaseModel):
    clarificationId: str
    explanation: str
    documents: List[Dict[str, Any]] = []

class ClarificationAdjudicateRequest(BaseModel):
    clarificationId: str
    action: str
    officerNotes: str

class ClarificationResponse(BaseModel):
    id: str
    tenderId: str
    tenderTitle: str
    bidderId: str
    bidderName: str
    issueCategory: str
    tenderRequirement: Optional[str] = None
    bidderClaim: Optional[str] = None
    referenceEvidence: Optional[str] = None
    variance: Optional[str] = None
    whyRequired: Optional[str] = None
    officerQuery: str
    evidenceReference: Optional[str] = None
    responseDeadline: str
    status: str
    createdAt: str
    sentAt: Optional[str] = None
    officerId: str
    officerRemarks: Optional[str] = None
    sharedEvidence: List[SharedEvidenceItemSchema] = []
    vendorExplanation: Optional[str] = None
    vendorResponseSubmittedAt: Optional[str] = None
    vendorSupportingDocs: List[Dict[str, Any]] = []
    aiExtractedValues: List[Dict[str, Any]] = []
    officerReviewNotes: Optional[str] = None
    reVerificationResult: Optional[str] = None
    aiRecommendation: Optional[str] = None
    recommendedAction: Optional[str] = None
    previousFindingSummary: Optional[str] = None
    updatedFindingSummary: Optional[str] = None
    finalOfficerDecisionStatus: Optional[str] = None
    reVerificationDetails: Optional[str] = None
    resolvedAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ─── DECISION & AUDIT SCHEMAS ───────────────────────────────────────────────

class DecisionCreate(BaseModel):
    evaluationId: str
    bidderId: str
    action: str
    reasonRemarks: str
    clarificationQuery: Optional[str] = None
    officerName: Optional[str] = "Rajeshwar Rao"
    officerDesignation: Optional[str] = "Senior Procurement Officer"
    officerId: Optional[str] = "PO-1042"

class DecisionResponse(BaseModel):
    id: str
    evaluationId: str
    bidderId: str
    action: str
    reasonRemarks: str
    clarificationQuery: Optional[str] = None
    officerName: str
    officerDesignation: str
    officerId: str
    timestamp: str
    digitalSignatureHash: str
    model_config = ConfigDict(from_attributes=True)

class AuditRecordCreate(BaseModel):
    officerId: Optional[str] = "PO-1042"
    evaluationId: str
    bidder: str
    actor: str
    actorRole: str
    action: str
    decision: str
    reason: str
    target: str
    targetRef: Optional[str] = None
    result: str
    evidenceRef: Optional[str] = None
    details: str

class AuditRecordResponse(BaseModel):
    id: str
    timestamp: str
    officerId: str
    evaluationId: str
    bidder: str
    actor: str
    actorRole: str
    action: str
    decision: str
    reason: str
    target: str
    targetRef: Optional[str] = None
    result: str
    evidenceRef: Optional[str] = None
    eventHash: str
    hash: str
    details: str
    model_config = ConfigDict(from_attributes=True)

# ─── DASHBOARD KPIS ──────────────────────────────────────────────────────────

class DashboardKPIs(BaseModel):
    activeTenders: int = 12
    bidsUnderReview: int = 47
    highRiskBidders: int = 6
    complianceConflicts: int = 11
    pendingInvestigations: int = 7
    averageVerificationTime: str = "6.4 min"
    activeEvaluations: Optional[int] = 12
