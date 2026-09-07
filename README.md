# e-BID PRAMAAN

> **AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement**  
> **Organization:** Chennai Petroleum Corporation Limited (CPCL)  
> **Theme:** Smart Automation | **Category:** Software | **SIH 2026**

---

## 1. Project Overview

**e-BID PRAMAAN** is an enterprise-grade AI-assisted bid compliance verification and decision-support platform engineered for CPCL and GeM (Government e-Marketplace) procurement evaluations.

### Core Value Proposition
> *"From Tender Clause to Verified Evidence to Officer Decision."*

### Core Product Principle
e-BID PRAMAAN is strictly a **decision-support platform**, NOT an autonomous bidder-selection system. The platform automates evidence extraction, multi-registry verification, temporal validity checks, and discrepancy detection while **keeping final qualification and disqualification authority strictly with the authorized procurement officer (`PO-1042`)**.

```
Tender Clause → Compliance Rule → Bidder Document → OCR / Document AI
↓
AI/NLP Extracted Evidence → Reference Evidence → Comparison (Exact / Fuzzy / Semantic)
↓
Bid-Date Temporal Validation → Discrepancy Finding → Clarification Notice
↓
Vendor Response & Supporting Document → AI Re-Verification → Officer Decision → SHA-256 Audit Trail → Compliance Report
```

---

## 2. System Architecture

```
                                  PUBLIC INTERNET / GeM
                                            |
                                            ▼
                                     HTTPS CLOUD GATEWAY
                                            |
                      +---------------------+---------------------+
                      |                                           |
                      ▼                                           ▼
             FRONTEND CLIENT                             BACKEND REST API
          React 19 + TypeScript + Vite                      Python + FastAPI
          (Port 5173 / Cloud CDN)                       (Port 8000 / Cloud App)
                      |                                           |
                      | (Configurable VITE_API_BASE_URL)          |
                      +-------------------------------------------+
                                                                  |
                                                  +---------------+---------------+
                                                  |                               |
                                                  ▼                               ▼
                                            SQL DATABASE                  DOCUMENT STORAGE
                                       PostgreSQL / SQLite             Local / Object Storage
                                                  |
                                                  ▼
                                       VERIFICATION PIPELINE
                                                  |
           +-----------------+--------------------+-------------------+-----------------+
           |                 |                    |                   |                 |
           ▼                 ▼                    ▼                   ▼                 ▼
      DOCUMENT AI      MATCHING ENGINE    TEMPORAL VALIDATOR   REFERENCE ADAPTERS  RULE ENGINE
       PDF / OCR        Exact / Fuzzy /     valid_from <=        13 Statutory        CPCL Tender
      NER Patterns        Semantic          bid_cutoff <=         Registries         Clauses &
                                              valid_until                            Operators
           |                 |                    |                   |                 |
           +-----------------+--------------------+-------------------+-----------------+
                                                  |
                                                  ▼
                                       WEIGHTED RISK ENGINE
                                    (Transparent Scoring & XAI)
                                                  |
                                                  ▼
                                      TAMPER-EVIDENT LEDGER
                                     (SHA-256 Cryptographic)
                                                  |
                                                  ▼
                                      OFFICER DECISION GATEWAY
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons | Responsive e-governance UI & dynamic workflows |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 | High-performance RESTful API microservices |
| **Database** | SQLAlchemy 2.0 (PostgreSQL / SQLite fallback) | Relational persistence & schema validation |
| **Document Processing** | PyPDF, Pillow, Regex NER Parsers | PDF parsing, identifier extraction, SHA-256 checksums |
| **AI / NLP & Matching** | Scikit-Learn (TF-IDF), Token/Levenshtein algorithms | Exact, fuzzy name/address, & semantic clause matching |
| **Temporal Engine** | Python datetime validation engine | Bid cutoff date compliance (`valid_from <= bid <= valid_until`) |
| **Adapters** | 13 Modular Statutory Registry Adapters | GSTN, Udyam, PAN, MCA21, EPFO, ESIC, OEM, Debarment |
| **Integrity & Security** | SHA-256 Cryptographic Hash Chaining, RBAC | Tamper-evident audit ledger & role-based access |

---

## 4. Local Setup

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ and npm

### Quick Start (One-Click Batch Script)
Double-click `start-demo.bat` in the project root to start both backend and frontend, and automatically launch your browser:
```cmd
start-demo.bat
```

---

## 5. Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start FastAPI Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base: `http://localhost:8000`
- Interactive OpenAPI Swagger Docs: `http://localhost:8000/docs`
- ReDoc Docs: `http://localhost:8000/redoc`

---

## 6. Frontend Setup

```bash
# 1. Navigate to frontend
cd "sih 26"

# 2. Install dependencies
npm.cmd install

# 3. Start Vite dev server
npm.cmd run dev
```
- Frontend UI: `http://localhost:5173`

---

## 7. Environment Variables

Create `.env` file in the root or backend folder based on `.env.example`:

```ini
# Backend Settings
PORT=8000
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secure-32-char-secret-key-here
DATABASE_URL=sqlite:///./ebid_pramaan.db

# Frontend API URL
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 8. Database Setup

The application automatically creates tables and initializes pre-seeded CPCL demo datasets upon startup using SQLAlchemy ORM.
- **SQLite (Local Demo Mode)**: Zero-configuration file database `ebid_pramaan.db`.
- **PostgreSQL (Production Mode)**: Set `DATABASE_URL=postgresql://user:password@host:5432/dbname`.

---

## 9. Demo Data Setup

The platform includes pre-seeded CPCL petroleum procurement tenders:
1. **`C03H240087`** (Primary Demo): *Procurement of Tube, Radiant 1F3, 6IN* (₹18.5 Cr) — OEM MAF, ISO 9001, EMD/MSE, GSTIN, PAN, Class-I Local Content (>= 50%), Land Border, Non-Debarment, Technical QAP.
2. **`C13A250049`**: *Pipe Fittings (CS)* (₹6.8 Cr) — Make in India, MSE Exemption, GSTIN, 3 Years ITR, Mill OEM, TPI (EIL/Lloyds).
3. **`C18B250074`**: *Atlas Copco Compressor Spares for Manali Refinery* (₹12.4 Cr) — Proprietary Nomination OEM, Non-Spurious Spares Certificate.
4. **`C21B240011`**: *CPCL Explosion Proof CCTV Cameras* (₹4.2 Cr) — PESO / ATEX Zone-1 Flameproof Certificate, Past Refinery Experience (>= 50 units).

---

## 10. Deployment Instructions

### Option A: Cloud Deployment (Vercel / Render / Railway / AWS)
1. **Frontend**: Deploy `sih 26/` to Vercel/Netlify with build command `npm run build` and output directory `dist`. Set `VITE_API_BASE_URL=https://<your-backend-domain>/api`.
2. **Backend**: Deploy `backend/` to Render/Railway/AWS App Runner with command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

### Option B: Docker Container Deployment
```bash
docker-compose up --build -d
```

---

## 11. API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service liveness, metadata, and operating mode |
| `GET` | `/api/kpis` | Aggregated procurement dashboard statistics |
| `GET` | `/api/tenders` | List all active CPCL procurement tenders |
| `GET` | `/api/tenders/{id}` | Retrieve tender details and compiled rule matrix |
| `GET` | `/api/tenders/{id}/bids` | Retrieve submitted bids for a tender |
| `GET` | `/api/bidders/{id}` | Bidder compliance dossier and extracted fields |
| `POST` | `/api/documents/upload` | Upload PDF/image document, compute SHA-256, run OCR/NER |
| `POST` | `/api/compliance/analyze` | Evaluate bidder documents against CPCL tender rules |
| `POST` | `/api/reference/verify` | Execute 13 statutory reference source adapters |
| `POST` | `/api/matching/compare` | Exact, Fuzzy (Levenshtein), or Semantic Cosine matching |
| `POST` | `/api/temporal/validate` | Check certificate validity against statutory bid cutoff date |
| `GET` | `/api/clarifications` | Retrieve clarification notices and response statuses |
| `POST` | `/api/clarifications` | Officer PO-1042 dispatches clarification with shared evidence |
| `POST` | `/api/vendor-responses` | Vendor submits explanation & new supporting documents |
| `POST` | `/api/reverification` | AI re-extracts evidence & updates compliance matrix |
| `POST` | `/api/decisions` | Record Procurement Officer decision with digital signature |
| `GET` | `/api/audit` | Chronological SHA-256 tamper-evident audit ledger |
| `GET` | `/api/reports/{bidder_id}` | Generate exportable forensic compliance evaluation report |

---

## 12. Demo Credentials

| Role | Username / ID | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Procurement Officer** | `PO-1042` | `Officer@1042` | Full verification, tender analysis, clarification dispatch, final qualification decision, audit ledger export |
| **Authorized Vendor** | `VEN-PET-001` | `Vendor@2026` | Clarification notice response, explanation submission, supporting document upload |
| **System Admin** | `ADMIN-001` | `Admin@2026` | Technical administration, registry status, audit log inspection |

---

## 13. Known Limitations

1. **Simulated Reference Registries**: Live direct API access to GSTN, MCA21 V3, and CBDT PAN portals requires official government API credentials and sandbox access. e-BID PRAMAAN uses modular adapters connected to deterministic controlled verification datasets simulating live registry structures.
2. **Offline-First Fallback**: When running disconnected from internet, document AI uses deterministic fallback extraction based on pre-compiled CPCL bidder test documents.
