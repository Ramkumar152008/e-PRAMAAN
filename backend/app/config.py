"""
Application Configuration Settings
e-BID PRAMAAN — CPCL
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union, Any
from pydantic import field_validator

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "e-BID PRAMAAN"
    PROJECT_DESCRIPTION: str = "AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement"
    ORGANIZATION: str = "Chennai Petroleum Corporation Limited (CPCL)"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "ebid-pramaan-cpcl-procurement-verification-secret-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/ebid_pramaan.db")
    
    # CORS
    CORS_ORIGINS: Any = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "*"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                import json
                try:
                    return json.loads(v_str)
                except Exception:
                    pass
            return [i.strip() for i in v_str.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]
    
    # File Storage
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    DOCUMENTS_DIR: Path = BASE_DIR / "documents"
    MAX_UPLOAD_SIZE_MB: int = 50

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow"
    )

settings = Settings()

# Ensure storage directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
