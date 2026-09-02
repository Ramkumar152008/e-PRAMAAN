/**
 * BidShield AI — Government & Authorized Verification Gateway & Source Adapters
 * 
 * Abstraction layer connecting BidShield AI verification pipeline to 
 * configured government and institutional reference registries for Problem Statement SIH26100.
 * 
 * Architecture:
 * Verification Gateway -> Source Adapters -> Configured Reference Datasets / APIs -> Normalized Result -> AI Compliance Engine
 */

export type VerificationResultStatus = 
  | 'VERIFIED'
  | 'POTENTIAL ISSUE'
  | 'MISSING'
  | 'REQUIRES REVIEW'
  | 'NOT APPLICABLE'
  | 'CLEAR';

export interface SourceVerificationRecord {
  id: string;
  sourceName: string;
  authority: string;
  category: 'STATUTORY' | 'TAX' | 'LABOUR' | 'QUALITY' | 'PROCUREMENT';
  checkedInfo: string;
  result: VerificationResultStatus;
  evidence: string;
  referenceDatasetName: string;
  lastChecked: string;
  token: string;
  details: Record<string, any>;
}

export interface VerificationGatewaySummary {
  totalChecked: number;
  verified: number;
  potentialIssues: number;
  requiresReview: number;
  notApplicable: number;
  missing: number;
  clear: number;
}

// ── 13 Source Adapters Definition (Section 16 & 30) ──

export const udyamAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-UDYAM-01',
  sourceName: 'Udyam / MSME',
  authority: 'Ministry of MSME, Government of India',
  category: 'STATUTORY',
  checkedInfo: `Registration: ${bidder.udyamNo || 'UDYAM-KR-03-0049218'}`,
  result: 'VERIFIED',
  evidence: 'Active Medium Enterprise under NIC Code 26516 & 28132 (Industrial Process & Pipeline Monitoring). Eligible for MSME preference.',
  referenceDatasetName: 'Udyam National Portal Master Directory (Simulated)',
  lastChecked: '30-Aug-2026 12:44:10',
  token: 'MSME-UDYAM-KR-03',
  details: {
    udyamNumber: bidder.udyamNo || 'UDYAM-KR-03-0049218',
    enterpriseType: 'Medium Enterprise (Manufacturing)',
    nicCode: '26516 - Manufacture of industrial process control & pipeline equipment',
    msmeStatus: 'Active & Verified',
    purchasePreference: 'Applicable'
  }
});

export const gstnAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-GSTN-02',
  sourceName: 'GSTN',
  authority: 'Goods and Services Tax Network (GSTN)',
  category: 'TAX',
  checkedInfo: `GSTIN: ${bidder.gstin || '29ABCDE1234F1Z5'}`,
  result: 'VERIFIED',
  evidence: 'Active regular taxpayer status. 36 consecutive monthly GSTR-3B filings up-to-date with 0 defaults. Compliance Rating: 10/10.',
  referenceDatasetName: 'GSTN Taxpayer Registry Service (Simulated)',
  lastChecked: '30-Aug-2026 12:44:11',
  token: 'GSTN-AUTH-99124',
  details: {
    gstin: bidder.gstin || '29ABCDE1234F1Z5',
    constitution: 'Private Limited Company',
    stateJurisdiction: 'Karnataka Ward-04',
    returnFilingStatus: '36/36 Monthly Returns Filed',
    taxpayerStatus: 'Active Regular'
  }
});

export const panAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-PAN-03',
  sourceName: 'PAN / Income Tax',
  authority: 'Central Board of Direct Taxes (CBDT)',
  category: 'TAX',
  checkedInfo: `PAN: ${bidder.pan || 'ABCDE1234F'} (${bidder.name})`,
  result: 'VERIFIED',
  evidence: 'Operative corporate PAN matching legal name. Valid ITR-6 acknowledgments on file for AY 2024-25 & AY 2025-26.',
  referenceDatasetName: 'Income Tax Entity Verification API Dataset (Simulated)',
  lastChecked: '30-Aug-2026 12:44:12',
  token: 'CBDT-PAN-88124',
  details: {
    pan: bidder.pan || 'ABCDE1234F',
    nameOnPan: bidder.name,
    panStatus: 'Operative & Linked',
    nonFilerSurcharge206AB: 'Not Applicable (Regular Filer)'
  }
});

export const mcaAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-MCA-04',
  sourceName: 'MCA21',
  authority: 'Ministry of Corporate Affairs (MCA21 V3 Registry)',
  category: 'STATUTORY',
  checkedInfo: `Company: ${bidder.name} (CIN: ${bidder.cin || 'U72900KA2018PTC112345'})`,
  result: 'POTENTIAL ISSUE',
  evidence: `Company active. Statutory Form AOC-4 reveals audited 3-year average turnover of ₹${bidder.verifiedTurnover || '8.70'} Cr vs declared ₹${bidder.claimedTurnover || '12.00'} Cr (-27.5% Deficit). Address: Bengaluru vs Chennai declared. Experience: 3.8 yrs vs 7 yrs claimed.`,
  referenceDatasetName: 'MCA21 Company Financial Registry Repository (Simulated)',
  lastChecked: '30-Aug-2026 12:44:13',
  token: 'MCA-SRN-AOC4-99214',
  details: {
    cin: bidder.cin || 'U72900KA2018PTC112345',
    incorporationDate: '20-Nov-2018',
    registeredOffice: 'Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru - 560100',
    auditedTurnoverAOC4: `₹${bidder.verifiedTurnover || '8.70'} Crore`,
    declaredTurnoverInBid: `₹${bidder.claimedTurnover || '12.00'} Crore`,
    variance: '-₹3.30 Crore (-27.5% Discrepancy)'
  }
});

export const epfoAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-EPFO-05',
  sourceName: 'EPFO',
  authority: 'Employees\' Provident Fund Organisation',
  category: 'LABOUR',
  checkedInfo: 'Registration: KNBLR0049128000 (Active)',
  result: 'VERIFIED',
  evidence: '84 active contributing engineering members with regular Electronic Challan cum Return (ECR) monthly remittances.',
  referenceDatasetName: 'EPFO Unified Employer Registry (Simulated)',
  lastChecked: '30-Aug-2026 12:44:14',
  token: 'EPFO-ECR-7721',
  details: {
    establishmentCode: 'KNBLR0049128000',
    contributingMembers: 84,
    ecrRegularity: '100% Up to Date',
    complianceDefault: 'Nil'
  }
});

export const esicAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-ESIC-06',
  sourceName: 'ESIC',
  authority: 'Employees\' State Insurance Corporation',
  category: 'LABOUR',
  checkedInfo: 'Registration: 53000491280001001 (Active)',
  result: 'VERIFIED',
  evidence: 'Active employer code. Verified monthly social security contributions for 68 insured persons with zero outstanding dues.',
  referenceDatasetName: 'ESIC National Portal Database (Simulated)',
  lastChecked: '30-Aug-2026 12:44:15',
  token: 'ESIC-REG-4412',
  details: {
    employerCode: '53000491280001001',
    insuredPersons: 68,
    challanVerification: 'Valid & Remitted'
  }
});

export const startupIndiaAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-STP-07',
  sourceName: 'Startup India',
  authority: 'DPIIT, Ministry of Commerce & Industry',
  category: 'STATUTORY',
  checkedInfo: 'DPIIT Recognition Status',
  result: 'NOT APPLICABLE',
  evidence: 'Operates as established medium corporate manufacturing enterprise. Regular procurement evaluation route applies.',
  referenceDatasetName: 'Startup India DPIIT Recognition Master (Simulated)',
  lastChecked: '30-Aug-2026 12:44:16',
  token: 'DPIIT-STP-1192',
  details: {
    certificateNumber: 'N/A',
    category: 'Corporate Non-Startup Route',
    emdExemptionApplicable: 'NO'
  }
});

export const nsicAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-NSIC-08',
  sourceName: 'NSIC',
  authority: 'National Small Industries Corporation',
  category: 'STATUTORY',
  checkedInfo: 'Single Point Registration (SPRS): NSIC/BNG/GP/2024/912',
  result: 'VERIFIED',
  evidence: 'Active SPRS enlistment certificate for pipeline instrumentation & hazardous monitoring equipment.',
  referenceDatasetName: 'NSIC SPRS Portal Database (Simulated)',
  lastChecked: '30-Aug-2026 12:44:17',
  token: 'NSIC-SPRS-8831',
  details: {
    sprsNumber: 'NSIC/BNG/GP/2024/912',
    monetaryLimit: '₹15.00 Crore',
    validity: 'Valid till 30-Jun-2027'
  }
});

export const oemAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-OEM-09',
  sourceName: 'OEM Verification',
  authority: 'Tier-1 Petroleum Equipment OEM Authorization Protocol',
  category: 'PROCUREMENT',
  checkedInfo: 'Manufacturer Authorization Form (MAF) Token: PETRO-SENS-2026-MAF-8812',
  result: 'REQUIRES REVIEW',
  evidence: 'MAF token recorded in database; secondary verification required with OEM regarding acoustic sensor product line scope.',
  referenceDatasetName: 'Tier-1 OEM Partner Verification Ledger (Simulated)',
  lastChecked: '30-Aug-2026 12:44:18',
  token: 'PETRO-SENS-2026-MAF-8812',
  details: {
    oemPartnerId: 'Honeywell Enraf / Emerson Process Management',
    authorizedProductLine: 'Acoustic Pipeline Leak Detectors & Flow Telemetry',
    validTill: '31-Dec-2026',
    status: 'REQUIRES_MANUAL_VERIFICATION'
  }
});

export const digilockerAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-DL-10',
  sourceName: 'DigiLocker',
  authority: 'DigiLocker National Document Exchange',
  category: 'STATUTORY',
  checkedInfo: 'Cryptographic Document Checksums: 14 Submitted Certificates',
  result: 'VERIFIED',
  evidence: '14 of 14 submitted PDF certificates verified against issuing authority hashes with tamper-evident SHA-256 signatures.',
  referenceDatasetName: 'DigiLocker National Document Repository (Simulated)',
  lastChecked: '30-Aug-2026 12:44:19',
  token: 'DLOCK-SHA256-VALID',
  details: {
    documentsChecked: 14,
    tamperEvidentMatches: '14/14 Matched (0 Mismatches)',
    issuerSignatures: 'Valid X.509 Cryptographic Signatures'
  }
});

export const makeInIndiaAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-MII-11',
  sourceName: 'Make in India / DPIIT',
  authority: 'Public Procurement (Preference to Make in India) Order - MoPNG Policy',
  category: 'PROCUREMENT',
  checkedInfo: 'Local Content Declared: 62.5% (Class-I Local Supplier)',
  result: 'VERIFIED',
  evidence: 'Class-I classification confirmed (58.0% verified domestic value addition >= 50% mandatory MoPNG threshold).',
  referenceDatasetName: 'GeM Make-in-India Self-Declaration Records (Simulated)',
  lastChecked: '30-Aug-2026 12:44:20',
  token: 'MII-LOCAL-625',
  details: {
    claimedTier: 'Class-I Local Supplier (Threshold >= 50%)',
    declaredPercentage: '62.5%',
    verifiedPercentage: '58.0%',
    manufacturingPlant: 'Electronic City, Bengaluru, Karnataka',
    status: 'VERIFIED_COMPLIANT'
  }
});

export const bisDpiitAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-BIS-12',
  sourceName: 'BIS / DPIIT / Safety',
  authority: 'Petroleum & Explosives Safety Organization (PESO) / NABCB',
  category: 'QUALITY',
  checkedInfo: 'Petroleum Safety Certificate (PESO-EX-2023-88912) & ISO 9001',
  result: 'POTENTIAL ISSUE',
  evidence: 'PESO Zone-1 Safety Certificate expired on 05-Aug-2026, 5 days prior to the mandatory tender bid submission cutoff date (10-Aug-2026).',
  referenceDatasetName: 'PESO Safety Certification Ledger (Simulated)',
  lastChecked: '30-Aug-2026 12:44:21',
  token: 'PESO-EX-2023-88912',
  details: {
    certNumber: 'PESO-EX-2023-88912',
    standard: 'PESO / ATEX Zone-1 Flameproof Safety Loop',
    expiryDate: '05-Aug-2026',
    tenderBidDate: '10-Aug-2026',
    validityDeficit: '5 Days expired before bid cutoff'
  }
});

export const blacklistingAdapter = (bidder: any): SourceVerificationRecord => ({
  id: 'SRC-DEB-13',
  sourceName: 'Blacklisting / Debarment',
  authority: 'Central Public Procurement Portal & GeM Holiday Listing Registry',
  category: 'STATUTORY',
  checkedInfo: `Entity CIN (${bidder.cin}) & PAN (${bidder.pan}) vs Central Debarment Database`,
  result: 'CLEAR',
  evidence: 'No matching debarment, blacklisting, or holiday listing records found in configured reference dataset.',
  referenceDatasetName: 'GeM & CPPP Central Debarment Database Repository (Simulated)',
  lastChecked: '30-Aug-2026 12:44:22',
  token: 'DEBAR-CLEAR-00',
  details: {
    entityChecked: bidder.name,
    panChecked: bidder.pan,
    cinChecked: bidder.cin,
    debarmentStatus: 'CLEAN RECORD (No Active Disqualification Orders)'
  }
});

export function queryGovernmentVerificationGateway(bidder: any): {
  sources: SourceVerificationRecord[];
  summary: VerificationGatewaySummary;
} {
  const sources: SourceVerificationRecord[] = [
    udyamAdapter(bidder),
    gstnAdapter(bidder),
    panAdapter(bidder),
    mcaAdapter(bidder),
    epfoAdapter(bidder),
    esicAdapter(bidder),
    startupIndiaAdapter(bidder),
    nsicAdapter(bidder),
    oemAdapter(bidder),
    digilockerAdapter(bidder),
    makeInIndiaAdapter(bidder),
    bisDpiitAdapter(bidder),
    blacklistingAdapter(bidder)
  ];

  const summary: VerificationGatewaySummary = {
    totalChecked: sources.length,
    verified: sources.filter(s => s.result === 'VERIFIED').length,
    potentialIssues: sources.filter(s => s.result === 'POTENTIAL ISSUE').length,
    requiresReview: sources.filter(s => s.result === 'REQUIRES REVIEW').length,
    notApplicable: sources.filter(s => s.result === 'NOT APPLICABLE').length,
    missing: sources.filter(s => s.result === 'MISSING').length,
    clear: sources.filter(s => s.result === 'CLEAR').length
  };

  return { sources, summary };
}
