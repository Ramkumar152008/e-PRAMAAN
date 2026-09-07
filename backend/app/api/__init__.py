from fastapi import APIRouter
from app.api.tenders import router as tenders_router
from app.api.bidders import router as bidders_router
from app.api.documents import router as documents_router
from app.api.evidence import router as evidence_router
from app.api.compliance import router as compliance_router
from app.api.reference import router as reference_router
from app.api.matching import router as matching_router
from app.api.temporal import router as temporal_router
from app.api.findings import router as findings_router
from app.api.clarifications import router as clarifications_router
from app.api.decisions import router as decisions_router
from app.api.audit import router as audit_router
from app.api.reports import router as reports_router
from app.api.health import router as health_router
from app.api.rag import router as rag_router
from app.api.assistant import router as assistant_router
from app.api.n8n_webhooks import router as n8n_router
from app.api.passport import router as passport_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(tenders_router)
api_router.include_router(bidders_router)
api_router.include_router(documents_router)
api_router.include_router(evidence_router)
api_router.include_router(compliance_router)
api_router.include_router(reference_router)
api_router.include_router(matching_router)
api_router.include_router(temporal_router)
api_router.include_router(findings_router)
api_router.include_router(clarifications_router)
api_router.include_router(decisions_router)
api_router.include_router(audit_router)
api_router.include_router(reports_router)
api_router.include_router(rag_router)
api_router.include_router(assistant_router)
api_router.include_router(n8n_router)
api_router.include_router(passport_router)

