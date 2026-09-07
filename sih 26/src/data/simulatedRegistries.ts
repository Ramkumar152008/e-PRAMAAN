/**
 * DEMO DATA — Simulated Government & Authorized Verification Registries
 * Prototype Demonstration — Government API integrations are simulated.
 * Not an official Government application.
 */

// 1. GSTN Simulated Registry
export interface SimulatedGSTNRecord {
  gstin: string;
  legalName: string;
  tradeName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'SUSPENDED';
  taxpayerType: 'REGULAR' | 'COMPOSITION';
  registrationDate: string;
  principalAddress: string;
  stateCode: string;
  lastFilingMonth: string;
  filingFrequencyRegular: boolean;
  complianceRating: string;
}

export const SIMULATED_GSTN_DATABASE: Record<string, SimulatedGSTNRecord> = {
  '29ABCDE1234F1Z5': {
    gstin: '29ABCDE1234F1Z5',
    legalName: 'ABC Energy Systems Pvt Ltd',
    tradeName: 'ABC Energy Systems',
    status: 'ACTIVE',
    taxpayerType: 'REGULAR',
    registrationDate: '2019-04-12',
    principalAddress: 'Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100',
    stateCode: '29 (Karnataka)',
    lastFilingMonth: 'July 2026',
    filingFrequencyRegular: true,
    complianceRating: '10/10'
  },
  '07AAACB1234P1Z2': {
    gstin: '07AAACB1234P1Z2',
    legalName: 'Bharat Heavy Petro Equipments Ltd',
    tradeName: 'Bharat Petro Equipments',
    status: 'ACTIVE',
    taxpayerType: 'REGULAR',
    registrationDate: '2015-08-20',
    principalAddress: '14/2, Barakhamba Road, Connaught Place, New Delhi - 110001',
    stateCode: '07 (Delhi)',
    lastFilingMonth: 'July 2026',
    filingFrequencyRegular: true,
    complianceRating: '10/10'
  }
};

// 2. PAN / Income Tax Registry
export interface SimulatedPANRecord {
  pan: string;
  entityName: string;
  status: 'ACTIVE_AND_ALLOTTED' | 'INVALID';
  category: 'COMPANY' | 'FIRM' | 'INDIVIDUAL';
  aadhaarLinked: boolean;
  itrFiledLast3Years: boolean;
  averageAnnualTurnoverCr: number;
}

export const SIMULATED_PAN_DATABASE: Record<string, SimulatedPANRecord> = {
  'ABCDE1234F': {
    pan: 'ABCDE1234F',
    entityName: 'ABC Energy Systems Pvt Ltd',
    status: 'ACTIVE_AND_ALLOTTED',
    category: 'COMPANY',
    aadhaarLinked: true,
    itrFiledLast3Years: true,
    averageAnnualTurnoverCr: 8.7 // Discrepancy with declared 12 Cr!
  },
  'AAACB1234P': {
    pan: 'AAACB1234P',
    entityName: 'Bharat Heavy Petro Equipments Ltd',
    status: 'ACTIVE_AND_ALLOTTED',
    category: 'COMPANY',
    aadhaarLinked: true,
    itrFiledLast3Years: true,
    averageAnnualTurnoverCr: 45.2
  }
};

// 3. Udyam / MSME Registry
export interface SimulatedUdyamRecord {
  udyamNumber: string;
  enterpriseName: string;
  enterpriseType: 'MICRO' | 'SMALL' | 'MEDIUM';
  majorActivity: 'MANUFACTURING' | 'SERVICES';
  nicCodes: string[];
  dateOfIncorporation: string;
  socialCategory: string;
  status: 'ACTIVE' | 'CANCELLED';
}

export const SIMULATED_UDYAM_DATABASE: Record<string, SimulatedUdyamRecord> = {
  'UDYAM-KR-03-0049218': {
    udyamNumber: 'UDYAM-KR-03-0049218',
    enterpriseName: 'ABC Energy Systems Pvt Ltd',
    enterpriseType: 'MEDIUM',
    majorActivity: 'MANUFACTURING',
    nicCodes: ['26516 - Manufacture of industrial process control equipment', '28132 - Manufacture of pipeline equipment'],
    dateOfIncorporation: '2019-02-18',
    socialCategory: 'General',
    status: 'ACTIVE'
  }
};

// 4. MCA21 Master Company Registry
export interface SimulatedMCARecord {
  cin: string;
  companyName: string;
  companyStatus: 'ACTIVE' | 'STRIKE_OFF' | 'DORMANT';
  rocCode: string;
  registrationNumber: string;
  incorporationDate: string;
  registeredOfficeAddress: string;
  authorizedCapitalCr: number;
  paidUpCapitalCr: number;
  directors: { din: string; name: string; designation: string }[];
  auditedFinancials: {
    fy24RevenueCr: number;
    fy25RevenueCr: number;
    fy26RevenueCr: number;
    avg3YrRevenueCr: number;
    formAOC4FilingDate: string;
  };
  operationalExperienceYears: number;
}

export const SIMULATED_MCA_DATABASE: Record<string, SimulatedMCARecord> = {
  'U72900KA2018PTC112345': {
    cin: 'U72900KA2018PTC112345',
    companyName: 'ABC Energy Systems Pvt Ltd',
    companyStatus: 'ACTIVE',
    rocCode: 'RoC-Bangalore',
    registrationNumber: '112345',
    incorporationDate: '2018-11-20',
    registeredOfficeAddress: 'Plot 42, Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100', // Verified Address (Bengaluru, NOT Chennai!)
    authorizedCapitalCr: 5.0,
    paidUpCapitalCr: 3.5,
    directors: [
      { din: '08129931', name: 'Vikramaditya Rao', designation: 'Managing Director' },
      { din: '08129932', name: 'Kavita Sundaram', designation: 'Whole-time Director' }
    ],
    auditedFinancials: {
      fy24RevenueCr: 7.8,
      fy25RevenueCr: 8.9,
      fy26RevenueCr: 9.4,
      avg3YrRevenueCr: 8.70, // Discrepancy: Declared 12.0 Cr, Verified 8.70 Cr
      formAOC4FilingDate: '2025-10-30'
    },
    operationalExperienceYears: 3.8 // Discrepancy: Claimed 7 yrs in oil & gas, verified 3.8 yrs since incorporation
  }
};

// 5. EPFO Simulated Registry
export interface SimulatedEPFORecord {
  establishmentCode: string;
  establishmentName: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalActiveMembers: number;
  lastRemittanceDate: string;
  remittanceRegular: boolean;
}

export const SIMULATED_EPFO_DATABASE: Record<string, SimulatedEPFORecord> = {
  'KNBLR0049128000': {
    establishmentCode: 'KNBLR0049128000',
    establishmentName: 'ABC Energy Systems Pvt Ltd',
    status: 'ACTIVE',
    totalActiveMembers: 84,
    lastRemittanceDate: '15-Jul-2026',
    remittanceRegular: true
  }
};

// 6. ESIC Simulated Registry
export interface SimulatedESICRecord {
  employerCode: string;
  employerName: string;
  status: 'ACTIVE';
  ipCount: number;
  lastContributionMonth: string;
}

export const SIMULATED_ESIC_DATABASE: Record<string, SimulatedESICRecord> = {
  '53000491280001001': {
    employerCode: '53000491280001001',
    employerName: 'ABC Energy Systems Pvt Ltd',
    status: 'ACTIVE',
    ipCount: 68,
    lastContributionMonth: 'June 2026'
  }
};

// 7. OEM Gateway Registry (Simulated Direct Endpoint)
export interface SimulatedOEMRecord {
  authCode: string;
  oemName: string;
  authorizedPartner: string;
  productLine: string;
  validFrom: string;
  validTill: string;
  tokenStatus: 'VALID' | 'REVOKED' | 'EXPIRED' | 'REQUIRES_MANUAL_VERIFICATION';
  notes: string;
}

export const SIMULATED_OEM_DATABASE: Record<string, SimulatedOEMRecord> = {
  'PETRO-SENS-2026-MAF-8812': {
    authCode: 'PETRO-SENS-2026-MAF-8812',
    oemName: 'Honeywell Enraf / Emerson Process Management (Simulated OEM)',
    authorizedPartner: 'ABC Energy Systems Pvt Ltd',
    productLine: 'Acoustic Pipeline Leak Detectors & Ultrasonic Flowmeters',
    validFrom: '2025-01-01',
    validTill: '2026-12-31',
    tokenStatus: 'REQUIRES_MANUAL_VERIFICATION', // Flagged for verification!
    notes: 'MAF token digital signature is pending secondary cryptographic OEM ledger confirmation.'
  }
};

// 8. Safety Certification Registry (OISD / PESO / ATEX / BIS)
export interface SimulatedSafetyCertRecord {
  certNumber: string;
  standard: string;
  issuedTo: string;
  issueDate: string;
  expiryDate: string;
  status: 'EXPIRED' | 'VALID';
  accreditationBody: string;
}

export const SIMULATED_SAFETY_CERT_DATABASE: Record<string, SimulatedSafetyCertRecord> = {
  'PESO-EX-2023-88912': {
    certNumber: 'PESO-EX-2023-88912',
    standard: 'PESO / ATEX Zone-1 Flameproof Safety Loop',
    issuedTo: 'ABC Energy Systems Pvt Ltd',
    issueDate: '2025-01-01',
    expiryDate: '2026-08-05', // Expired 5 days before 10-Aug-2026 bid date!
    status: 'EXPIRED',
    accreditationBody: 'Petroleum and Explosives Safety Organization (PESO - Simulated)'
  },
  'ISO-9001-2023-9912': {
    certNumber: 'ISO-9001-2023-9912',
    standard: 'ISO 9001:2015 Quality Management',
    issuedTo: 'ABC Energy Systems Pvt Ltd',
    issueDate: '2024-01-10',
    expiryDate: '2026-12-31',
    status: 'VALID',
    accreditationBody: 'NABCB Accredited Registrar (Simulated)'
  }
};

// 9. Make in India (MII) / Local Content Registry
export interface SimulatedLocalContentRecord {
  entityIdentifier: string;
  selfDeclaredPercentage: number;
  verifiedLocalContentPercentage: number;
  classType: 'Class-I' | 'Class-II' | 'Non-Local';
  locationOfValueAddition: string;
}

export const SIMULATED_LOCAL_CONTENT_DATABASE: Record<string, SimulatedLocalContentRecord> = {
  'ABCDE1234F': {
    entityIdentifier: 'ABCDE1234F',
    selfDeclaredPercentage: 62.5,
    verifiedLocalContentPercentage: 58.0,
    classType: 'Class-I', // Meets >= 50%
    locationOfValueAddition: 'Bengaluru Industrial Area, Karnataka'
  }
};

// 10. Central Blacklisting & Debarment Registry (CPPP / GeM)
export interface SimulatedDebarmentRecord {
  pan: string;
  companyName: string;
  isDebarred: boolean;
  debarredBy?: string;
  period?: string;
  reason?: string;
}

export const SIMULATED_DEBARMENT_DATABASE: Record<string, SimulatedDebarmentRecord> = {
  'ABCDE1234F': {
    pan: 'ABCDE1234F',
    companyName: 'ABC Energy Systems Pvt Ltd',
    isDebarred: false // Clean record, no debarment
  }
};
