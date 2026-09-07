# e-BID PRAMAAN (ई-बिड प्रमाण)
### Bid Compliance & Evidence Verification Platform

[![Ministry](https://img.shields.io/badge/Ministry-Petroleum%20%26%20Natural%20Gas-blue.svg)](https://mopng.gov.in)
[![Organization](https://img.shields.io/badge/CPSE-Chennai%20Petroleum%20Corporation%20Limited-navy.svg)](https://cpcl.co.in)
[![Standard](https://img.shields.io/badge/Governance-GFR%202017%20%2F%20GeM%20Protocol-green.svg)](https://gem.gov.in)
[![TypeScript](https://img.shields.io/badge/TypeScript-React%2019%20%2B%20Vite-blue.svg)](https://www.typescriptlang.org/)

---

## 🏛️ Project Overview

**e-BID PRAMAAN** is an institutional evidence-based procurement compliance verification platform designed for **Chennai Petroleum Corporation Limited (CPCL)** under the **Ministry of Petroleum & Natural Gas (MoPNG)**.

The system bridges tender clauses, submitted bidder documents, statutory reference records (GSTN, MCA21, DigiLocker, LRQA, DPIIT), and officer determinations into a tamper-evident verification workspace.

### Core Value Proposition
> *"From Tender Clause to Verified Evidence to Officer Decision."*

---

## 🚀 Key Architectural Modules

1. **Active Tenders & Requirement Analysis**: Tender clause parser breaking down pre-qualification rules, financial thresholds, and technical specifications into discrete verification rules.
2. **Multi-Source Evidence Verification**: Automated reconciliation against statutory registries (GSTIN filings, MCA21 Form AOC-4, ICAI UDIN, DPIIT Make in India, ISO/LRQA accreditation).
3. **Temporal Compliance & Validity Check**: Verifies that certificates and guarantees were legally active on the statutory bid submission date.
4. **Explainable 7-Node Evidence Chain**: Full provenance tracing from Tender Requirement → Compliance Rule → Bidder Document → Extracted Value → Reference Evidence → Comparison → Finding.
5. **Clarification Centre (GeM Clause 14c Protocol)**: Targeted clarification exchange with security boundaries, privacy scrub (internal notes excluded), and evidence-backed re-verification.
6. **Officer Decision & Compliance Dossier**: Statutory officer determination interface with automated generation of PDF-ready evaluation dossiers and tamper-evident SHA-256 event ledger.

---

## 🔒 Statutory Decision Support Protocol

e-BID PRAMAAN strictly enforces human-in-the-loop governance:
- **Decision Support Only**: AI provides automated extraction, cross-referencing, and discrepancy detection.
- **Officer Authority**: Final technical qualification, disqualification, or clarification adjudication strictly belongs to the authorized **Procurement Officer (PO-1042)**.
- **Zero Autonomous Determinations**: Statutory determinations are cryptographically signed and committed to the immutable audit trail.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti
- **Build Tooling**: Vite 8, TypeScript Compiler (`tsc`)
- **Linting**: Oxlint

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Ramkumar152008/e-bid-pramaan.git

# Navigate to project directory
cd e-bid-pramaan

# Install dependencies
npm install
```

### 3. Running Locally
```bash
# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173/` (or port indicated in the terminal).

### 4. Building for Production
```bash
# Compile TypeScript & bundle production assets
npm run build

# Preview production build
npm run preview
```

---

## 👥 Authentication & Roles

- **Procurement Officer**: `PO-1042` (Senior Procurement Officer, CPCL / MoPNG)
- **Bidder / Vendor Portal**: `VEN-PET-001` (Atlas Copco India Private Limited)
- **Departmental Admin**: `ADM-1001` (System Administrator & Rule Engine Manager)

---

## 📜 License & Institutional Attribution

Developed for **Smart India Hackathon (SIH 2026)** — Problem Statement: Integrated Bid Compliance & Evidence Verification.  
**Organization**: Chennai Petroleum Corporation Limited (CPCL) · Ministry of Petroleum & Natural Gas (MoPNG).
