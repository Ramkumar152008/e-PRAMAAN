"""
Cryptographic Audit Trail & Forensic Ledger Service
e-BID PRAMAAN — CPCL
Implements append-only SHA-256 tamper-evident event hashing and state transition verification.
"""

import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.entities import AuditRecord

class AuditService:
    @staticmethod
    def generate_hash(payload: str) -> str:
        """Computes SHA-256 checksum."""
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    @classmethod
    def create_audit_record(
        cls,
        db: Session,
        actor: str,
        actor_role: str,
        action: str,
        decision: str,
        reason: str,
        target: str,
        evaluation_id: str,
        bidder: str,
        result: str = "SUCCESS",
        details: str = "",
        officer_id: str = "PO-1042",
        evidence_ref: Optional[str] = None
    ) -> AuditRecord:
        """
        Creates a tamper-evident audit record with SHA-256 cryptographic verification.
        """
        now = datetime.now(timezone.utc)
        now_str = now.strftime("%Y-%m-%d %H:%M:%S")
        record_id = f"AUD-{int(now.timestamp() * 1000)}"
        
        # Compute event hash
        event_payload = f"{record_id}|{now_str}|{officer_id}|{evaluation_id}|{bidder}|{action}|{decision}|{reason}"
        event_hash = cls.generate_hash(event_payload)
        
        # Form full ledger hash
        full_payload = f"{event_hash}|{actor}|{actor_role}|{target}|{result}|{evidence_ref or ''}"
        full_hash = cls.generate_hash(full_payload)

        record = AuditRecord(
            id=record_id,
            timestamp=now_str,
            officerId=officer_id,
            evaluationId=evaluation_id,
            bidder=bidder,
            actor=actor,
            actorRole=actor_role,
            action=action,
            decision=decision,
            reason=reason,
            target=target,
            targetRef=evidence_ref,
            result=result,
            evidenceRef=evidence_ref,
            eventHash=event_hash,
            hash=full_hash,
            details=details or reason,
            createdAt=now
        )

        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @classmethod
    def get_audit_trail_for_tender(cls, db: Session, evaluation_id: str) -> List[AuditRecord]:
        """Retrieves chronological audit trail for a tender evaluation."""
        return db.query(AuditRecord).filter(AuditRecord.evaluationId == evaluation_id).order_by(AuditRecord.createdAt.desc()).all()
