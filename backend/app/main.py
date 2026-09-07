"""
e-BID PRAMAAN — Main FastAPI Application
AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement
Organization: Chennai Petroleum Corporation Limited (CPCL)
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import api_router
from app.data.seed_data import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.PROJECT_DESCRIPTION}\n\nOrganization: {settings.ORGANIZATION}",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS for online deployment and local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main API router
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "From Tender Clause to Verified Evidence to Officer Decision",
        "organization": settings.ORGANIZATION,
        "version": settings.VERSION,
        "docsUrl": "/docs",
        "apiPrefix": settings.API_PREFIX,
        "status": "OPERATIONAL"
    }

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", settings.PORT or 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)

