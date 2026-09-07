"""
Database Models for e-BID PRAMAAN
PostgreSQL / SQLite Compatible ORM Layer
"""

from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base

class Tender(Base):
    __tablename__ = "tenders"

    id = Column(String(50), primary_key=True, index=True)
    gemBidNo = Column(String(50), unique=True, index=True)
    title = Column(String(255), nullable=False)
    ministry = Column(String(255), default="Ministry of Petroleum & Natural Gas")
    department = Column(String(255), default="M&C Department / Materials")
    location = Column(String(255), default="CPCL Manali, Chennai")
    estimatedValue = Column(Float, default=0.0) # In Crores
    publishDate = Column(String(50))
    bidEndDate = Column(String(50))
    submissionDeadline = Column(String(50))
    status = Column(String(50), default="ACTIVE_EVALUATION")
    stage = Column(String(100), default="Techno-Commercial Evaluation")
    priority = Column(String(20), default="HIGH")
    tenderType = Column(String(100), default="Open National Tender")
    evaluationMethod = Column(String(100), default="Item-wise L1")
    category = Column(String(100), default="Refinery Tubes & Piping")
    petroleumCategory = Column(String(100), default="Refinery Tubes & Piping")
    bidsCount = Column(Integer, default=0)
    issuesCount = Column(Integer, default=0)
    isPrimaryDemo = Column(Boolean, default=False)
    rawClauses = Column(JSON, default=list) # List of raw string clauses
    createdAt = Column(DateTime, default=datetime.utcnow)

    # Relationships
    requirements = relationship("TenderRequirement", back_populates="tender", cascade="all, delete-orphan")
    bidders = relationship("Bidder", back_populates="tender", cascade="all, delete-orphan")


class TenderRequirement(Base):
    __tablename__ = "tender_requirements"

    id = Column(String(50), primary_key=True, index=True)
    requirementId = Column(String(50), index=True)
    tenderId = Column(String(50), ForeignKey("tenders.id"), index=True)
    clauseReference = Column(String(100))
    requirementName = Column(String(255))
    category = Column(String(50), default="STATUTORY") # FINANCIAL, OEM, TEMPORAL, STATUTORY, etc.
    mandatory = Column(Boolean, default=True)
    metric = Column(String(255))
    minimumValue = Column(String(255))
    operator = Column(String(50), default="==") # >=, <=, ==, VALID_ON_DATE, NON_BLACKLISTED
    applicability = Column(String(100), default="All Bidders")
    validationRule = Column(Text)
    requiredEvidence = Column(String(255))
    cutoffDate = Column(String(50))
    description = Column(Text)

    tender = relationship("Tender", back_populates="requirements")


class Bidder(Base):
    __tablename__ = "bidders"

    id = Column(String(50), primary_key=True, index=True)
    tenderId = Column(String(50), ForeignKey("tenders.id"), index=True)
    name = Column(String(255), nullable=False)
    cin = Column(String(50))
    pan = Column(String(50))
    gstin = Column(String(50))
    udyamNo = Column(String(50))
    claimedAddress = Column(Text)
    verifiedAddress = Column(Text)
    claimedTurnover = Column(Float, default=0.0) # In Crores
    verifiedTurnover = Column(Float, default=0.0) # In Crores
    claimedExperienceYears = Column(Float, default=0.0)
    verifiedExperienceYears = Column(Float, default=0.0)
    bidSubmissionDate = Column(String(50))
    turnoverBreakdown = Column(JSON, default=list)
    oemAuth = Column(JSON, default=dict)
    riskProfile = Column(JSON, default=dict)
    complianceMatrix = Column(JSON, default=list)
    temporalCompliance = Column(JSON, default=list)
    truthGraph = Column(JSON, default=dict)
    investigationPriorities = Column(JSON, default=list)
    findings = Column(JSON, default=list)
    status = Column(String(50), default="PENDING")
    createdAt = Column(DateTime, default=datetime.utcnow)

    tender = relationship("Tender", back_populates="bidders")
    documents = relationship("Document", back_populates="bidder", cascade="all, delete-orphan")
    evidence = relationship("ExtractedEvidence", back_populates="bidder", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(50), primary_key=True, index=True)
    bidderId = Column(String(50), ForeignKey("bidders.id"), index=True)
    name = Column(String(255), nullable=False)
    docType = Column(String(50)) # PAN_CERT, GST_CERT, UDYAM, OEM_AUTH, AUDITED_FINANCIALS, etc.
    size = Column(String(50))
    uploadedAt = Column(String(50))
    checksum = Column(String(128)) # SHA-256
    status = Column(String(50), default="EXTRACTED") # EXTRACTED, FAILED, PENDING
    pageCount = Column(Integer, default=1)
    extractionConfidence = Column(Float, default=95.0)
    filePath = Column(String(500), nullable=True)
    extractedFields = Column(JSON, default=list)
    createdAt = Column(DateTime, default=datetime.utcnow)

    bidder = relationship("Bidder", back_populates="documents")


class ExtractedEvidence(Base):
    __tablename__ = "extracted_evidence"

    id = Column(String(50), primary_key=True, index=True)
    evidenceId = Column(String(50), index=True)
    tenderId = Column(String(50), index=True)
    bidderId = Column(String(50), ForeignKey("bidders.id"), index=True)
    requirementId = Column(String(50), nullable=True)
    documentId = Column(String(50), nullable=True)
    source = Column(String(255))
    fieldName = Column(String(100))
    extractedValue = Column(Text)
    referenceValue = Column(Text)
    comparisonResult = Column(String(50)) # EXACT_MATCH, HIGH_SIMILARITY, MISMATCH, CONFLICT
    confidence = Column(Float, default=95.0)
    validFrom = Column(String(50), nullable=True)
    validUntil = Column(String(50), nullable=True)
    bidCutoffDate = Column(String(50), nullable=True)
    finding = Column(Text)
    officerAction = Column(String(255), nullable=True)
    timestamp = Column(String(50))
    details = Column(JSON, default=dict)

    bidder = relationship("Bidder", back_populates="evidence")


class ReferenceVerification(Base):
    __tablename__ = "reference_verifications"

    id = Column(String(50), primary_key=True, index=True)
    bidderId = Column(String(50), index=True)
    sourceName = Column(String(100))
    authority = Column(String(255))
    category = Column(String(50))
    checkedInfo = Column(String(255))
    result = Column(String(50)) # VERIFIED, POTENTIAL ISSUE, MISSING, REQUIRES REVIEW
    evidence = Column(Text)
    referenceDatasetName = Column(String(255))
    token = Column(String(100))
    lastChecked = Column(String(50))
    details = Column(JSON, default=dict)


class ComplianceFinding(Base):
    __tablename__ = "compliance_findings"

    id = Column(String(50), primary_key=True, index=True)
    findingId = Column(String(50), index=True)
    tenderId = Column(String(50), index=True)
    bidderId = Column(String(50), index=True)
    requirement = Column(String(255))
    rule = Column(String(255))
    claim = Column(Text)
    submittedDocument = Column(String(255))
    verificationSource = Column(String(255))
    comparison = Column(Text)
    finding = Column(Text)
    whyItMatters = Column(Text)
    evidence = Column(Text)
    confidence = Column(Float, default=90.0)
    risk = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    recommendedAction = Column(String(255))
    status = Column(String(50), default="OPEN") # OPEN, UNDER_REVIEW, RESOLVED


class Clarification(Base):
    __tablename__ = "clarifications"

    id = Column(String(50), primary_key=True, index=True) # e.g. CLAR-2026-001
    tenderId = Column(String(50), index=True)
    tenderTitle = Column(String(255))
    bidderId = Column(String(50), index=True)
    bidderName = Column(String(255))
    issueCategory = Column(String(255))
    tenderRequirement = Column(Text)
    bidderClaim = Column(Text)
    referenceEvidence = Column(Text)
    variance = Column(String(255))
    whyRequired = Column(Text)
    officerQuery = Column(Text)
    evidenceReference = Column(String(255))
    responseDeadline = Column(String(50))
    status = Column(String(50), default="AWAITING_RESPONSE")
    createdAt = Column(String(50))
    sentAt = Column(String(50))
    officerId = Column(String(50), default="PO-1042")
    officerRemarks = Column(Text)
    sharedEvidence = Column(JSON, default=list)
    vendorExplanation = Column(Text, nullable=True)
    vendorResponseSubmittedAt = Column(String(50), nullable=True)
    vendorSupportingDocs = Column(JSON, default=list)
    aiExtractedValues = Column(JSON, default=list)
    officerReviewNotes = Column(Text, nullable=True)
    reVerificationResult = Column(String(50), nullable=True)
    aiRecommendation = Column(String(255), nullable=True)
    recommendedAction = Column(String(255), nullable=True)
    previousFindingSummary = Column(Text, nullable=True)
    updatedFindingSummary = Column(Text, nullable=True)
    finalOfficerDecisionStatus = Column(String(50), nullable=True)
    reVerificationDetails = Column(Text, nullable=True)
    resolvedAt = Column(String(50), nullable=True)


class OfficerDecision(Base):
    __tablename__ = "officer_decisions"

    id = Column(String(50), primary_key=True, index=True)
    evaluationId = Column(String(50), index=True)
    bidderId = Column(String(50), index=True)
    action = Column(String(50)) # APPROVE, REJECT, REQUEST_CLARIFICATION, MANUAL_INVESTIGATION, CLEARED
    reasonRemarks = Column(Text, nullable=False)
    clarificationQuery = Column(Text, nullable=True)
    investigationChecklist = Column(JSON, default=list)
    officerName = Column(String(100), default="Rajeshwar Rao")
    officerDesignation = Column(String(100), default="Senior Procurement Officer")
    officerId = Column(String(50), default="PO-1042")
    timestamp = Column(String(50))
    digitalSignatureHash = Column(String(100))


class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(String(50), primary_key=True, index=True)
    timestamp = Column(String(50))
    officerId = Column(String(50), default="PO-1042")
    evaluationId = Column(String(50), index=True)
    bidder = Column(String(255))
    actor = Column(String(100))
    actorRole = Column(String(50))
    action = Column(String(100))
    decision = Column(String(50))
    reason = Column(Text)
    target = Column(String(255))
    targetRef = Column(String(255), nullable=True)
    result = Column(String(100))
    evidenceRef = Column(String(255), nullable=True)
    eventHash = Column(String(128))
    hash = Column(String(128)) # SHA-256
    details = Column(Text)
    createdAt = Column(DateTime, default=datetime.utcnow)
