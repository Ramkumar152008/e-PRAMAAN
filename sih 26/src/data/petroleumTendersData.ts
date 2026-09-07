import { Tender } from '../types';

/**
 * PRODUCTION DEMO DATA — CPCL Petroleum Procurement Tenders Work Queue
 * Organization: Chennai Petroleum Corporation Limited (CPCL)
 */

export const PETROLEUM_CATEGORIES = [
  'Refinery Tubes & Piping',
  'Pipe Fittings & Flanges',
  'Compressor Spares & Machinery',
  'Surveillance & Industrial Safety',
  'Oil & Gas Equipment',
  'Pipeline Infrastructure'
] as const;

export const PRIMARY_DEMO_TENDER_ID = 'C03H240087';

export const PETROLEUM_TENDERS: Tender[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // TENDER 1 — PRIMARY GOLDEN PATH (C03H240087)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'C03H240087',
    gemBidNo: 'C03H240087',
    title: 'Procurement of Tube, Radiant 1F3, 6IN',
    ministry: 'Ministry of Petroleum & Natural Gas',
    department: 'M&C Department / Materials',
    location: 'CPCL Manali, Chennai',
    estimatedValue: 18.5, // ₹18.5 Cr
    publishDate: '2026-06-15',
    bidEndDate: '2026-08-10',
    submissionDeadline: '2026-08-10T15:00:00+05:30',
    status: 'UNDER_VERIFICATION',
    stage: 'Techno-Commercial Evaluation',
    priority: 'HIGH',
    tenderType: 'Open National Tender',
    evaluationMethod: 'Material Code Wise L1',
    category: 'Refinery Tubes & Piping',
    petroleumCategory: 'Refinery Tubes & Piping',
    bidsCount: 4,
    issuesCount: 2,
    isPrimaryDemo: true,
    rawClauses: [
      'Clause 1.1 (Bid Completeness): Submission of Bidder Information, Technical Compliance Sheet, Deviation Sheet, Specification Sheet, QAP, and Bank Details.',
      'Clause 2.1 (Pre-Qualification - OEM): Bidder must be an OEM or OEM Authorized Agency with valid Manufacturer Authorization Form (MAF).',
      'Clause 2.2 (ISO Accreditation): Valid ISO 9001:2015 certification active on the statutory bid submission date (10-Aug-2026).',
      'Clause 3.1 (EMD Requirement): Submission of EMD of ₹3,70,000 or valid MSE / Udyam registration for exemption applicability.',
      'Clause 4.1 (Statutory - GST & PAN): Valid and active PAN and regular GSTIN registration with verified filing records.',
      'Clause 5.1 (Policy - Make in India): Class-I Local Supplier preference (minimum 50% local content declaration required).',
      'Clause 5.2 (Land Border & Debarment): Compliance with Rule 144(xi) Land Border Declaration and Non-Debarment certificate.',
      'Clause 6.1 (Technical Compliance): Adherence to CPCL Material Spec MS-RAD-6IN-1F3, QAP Stage-III, and Third Party Inspection (TPI) clearance.'
    ],
    rules: [
      {
        id: 'CPCL-PQ-001',
        metric: 'OEM / OEM Authorized Agency',
        minimumValue: 'Authorized',
        operator: '==',
        mandatory: true,
        description: 'Bidder must be an OEM or OEM Authorized Agency with verifiable authorization token.',
        referenceClause: 'Tender Clause 2.1',
        category: 'OEM'
      },
      {
        id: 'CPCL-ISO-002',
        metric: 'ISO 9001 Quality Certificate',
        minimumValue: 'Valid on Bid Date',
        operator: 'VALID_ON_DATE',
        mandatory: true,
        description: 'Valid ISO 9001:2015 certificate active on statutory bid submission date (10-Aug-2026).',
        referenceClause: 'Tender Clause 2.2',
        category: 'TEMPORAL'
      },
      {
        id: 'CPCL-EMD-003',
        metric: 'Earnest Money Deposit (EMD)',
        minimumValue: '₹3,70,000 / MSE Exemption',
        operator: '==',
        mandatory: true,
        description: 'Submission of ₹3.7 Lakh EMD or valid Udyam certificate for exemption.',
        referenceClause: 'Tender Clause 3.1',
        category: 'FINANCIAL'
      },
      {
        id: 'CPCL-STAT-004',
        metric: 'GST Registration (GSTIN)',
        minimumValue: 'Active',
        operator: '==',
        mandatory: true,
        description: 'Valid active GST registration verified against GSTN reference records.',
        referenceClause: 'Tender Clause 4.1',
        category: 'REGISTRATION'
      },
      {
        id: 'CPCL-STAT-005',
        metric: 'Corporate PAN Verification',
        minimumValue: 'Active',
        operator: '==',
        mandatory: true,
        description: 'Valid Corporate PAN issued by Income Tax Department in matching entity name.',
        referenceClause: 'Tender Clause 4.1',
        category: 'REGISTRATION'
      },
      {
        id: 'CPCL-MII-006',
        metric: 'Make in India Local Content',
        minimumValue: '>= 50%',
        operator: '>=',
        mandatory: true,
        description: 'Class-I Local Supplier with minimum 50% domestic value addition certificate.',
        referenceClause: 'Tender Clause 5.1',
        category: 'LOCAL_CONTENT'
      },
      {
        id: 'CPCL-LBD-007',
        metric: 'Land Border Declaration',
        minimumValue: 'Compliant',
        operator: '==',
        mandatory: true,
        description: 'Declaration of compliance with Rule 144(xi) of GFR 2017 (Land Border restrictions).',
        referenceClause: 'Tender Clause 5.2',
        category: 'STATUTORY'
      },
      {
        id: 'CPCL-DEB-008',
        metric: 'Non-Debarment / Holiday Listing Check',
        minimumValue: 'Clean Record',
        operator: 'NON_BLACKLISTED',
        mandatory: true,
        description: 'Bidder must not be under active debarment or holiday listing by CPCL / MoPNG.',
        referenceClause: 'Tender Clause 5.2',
        category: 'DEBARMENT'
      },
      {
        id: 'CPCL-TECH-009',
        metric: 'Technical Specification & QAP',
        minimumValue: 'Compliant with MS-RAD-6IN-1F3',
        operator: '==',
        mandatory: true,
        description: 'Full compliance with CPCL Radiant Tube 1F3 6IN specifications and QAP Stage-III approval.',
        referenceClause: 'Tender Clause 6.1',
        category: 'TECHNICAL'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TENDER 2 — PIPE FITTINGS (CS) (C13A250049)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'C13A250049',
    gemBidNo: 'C13A250049',
    title: 'Pipe Fittings (CS)',
    ministry: 'Ministry of Petroleum & Natural Gas',
    department: 'M&C / Materials',
    location: 'CPCL Manali, Chennai',
    estimatedValue: 6.8, // ₹6.8 Cr
    publishDate: '2026-07-02',
    bidEndDate: '2026-08-20',
    submissionDeadline: '2026-08-20T14:30:00+05:30',
    status: 'UNDER_EVALUATION',
    stage: 'Compliance Verification',
    priority: 'MEDIUM',
    tenderType: 'National Competitive Bidding (NCB)',
    evaluationMethod: 'Overall Item-wise L1',
    category: 'Pipe Fittings & Flanges',
    petroleumCategory: 'Pipe Fittings & Flanges',
    bidsCount: 6,
    issuesCount: 1,
    isPrimaryDemo: false,
    rawClauses: [
      'Clause 2.1 (Make in India): Mandatory Class-I Local Supplier status with minimum 50% domestic value addition certificate.',
      'Clause 2.2 (MSE Benefits): Valid MSE / Udyam registration for exemption from prior turnover and experience criteria.',
      'Clause 3.1 (Statutory Filings): Active GSTIN registration and 100% matched GSTR-3B return verification.',
      'Clause 3.2 (PAN & Tax Returns): Valid PAN card with submitted Income Tax Returns for last 3 Assessment Years (AY 2023-24 to 2025-26).',
      'Clause 4.1 (OEM Authorization): Direct manufacturer authorization or approved mill stockist authorization letter.',
      'Clause 5.1 (Third Party Inspection): Mandatory TPI inspection by EIL / Lloyd’s / Bureau Veritas prior to dispatch.',
      'Clause 6.1 (Material Test Certificates): Compliance with ASTM A234 WPB / ASME B16.9 with EN 10204 Type 3.1 MTC.',
      'Clause 6.2 (Quality & Hydrostatic Tests): Mandatory 100% hydrostatic testing and Stage-II QAP approval.'
    ],
    rules: [
      {
        id: 'CPCL-MII-101',
        metric: 'Make in India Local Content',
        minimumValue: '>= 50%',
        operator: '>=',
        mandatory: true,
        description: 'Class-I Local Supplier certificate showing >= 50% local manufacturing content.',
        referenceClause: 'Tender Clause 2.1',
        category: 'LOCAL_CONTENT'
      },
      {
        id: 'CPCL-MSE-102',
        metric: 'MSE Applicability / Exemption',
        minimumValue: 'Valid Udyam',
        operator: '==',
        mandatory: false,
        description: 'Valid Udyam Registration Certificate for turnover exemption eligibility.',
        referenceClause: 'Tender Clause 2.2',
        category: 'REGISTRATION'
      },
      {
        id: 'CPCL-STAT-103',
        metric: 'GST Registration & Active Filings',
        minimumValue: 'Active',
        operator: '==',
        mandatory: true,
        description: 'Active Regular GSTIN with verified GSTR-3B filing consistency.',
        referenceClause: 'Tender Clause 3.1',
        category: 'REGISTRATION'
      },
      {
        id: 'CPCL-STAT-104',
        metric: 'PAN & 3 Years ITR Filings',
        minimumValue: '3 Financial Years',
        operator: '==',
        mandatory: true,
        description: 'Permanent Account Number with filed ITR-V acknowledgements for past 3 FYs.',
        referenceClause: 'Tender Clause 3.2',
        category: 'FINANCIAL'
      },
      {
        id: 'CPCL-OEM-105',
        metric: 'Manufacturer Authorization',
        minimumValue: 'Approved Mill / OEM',
        operator: '==',
        mandatory: true,
        description: 'Direct manufacturer authorization or primary mill supply undertaking.',
        referenceClause: 'Tender Clause 4.1',
        category: 'OEM'
      },
      {
        id: 'CPCL-TPI-106',
        metric: 'Third Party Inspection (TPI)',
        minimumValue: 'EIL / Lloyds / BV',
        operator: '==',
        mandatory: true,
        description: 'Undertaking to engage approved TPI agency for stage-wise inspection.',
        referenceClause: 'Tender Clause 5.1',
        category: 'TECHNICAL'
      },
      {
        id: 'CPCL-TECH-107',
        metric: 'Material Test Certificate (MTC)',
        minimumValue: 'EN 10204 3.1',
        operator: '==',
        mandatory: true,
        description: 'Compliance with ASTM A234 WPB carbon steel specs and EN 10204 Type 3.1 MTC.',
        referenceClause: 'Tender Clause 6.1',
        category: 'TECHNICAL'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TENDER 3 — ATLAS COPCO COMPRESSOR SPARES (C18B250074)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'C18B250074',
    gemBidNo: 'C18B250074',
    title: 'Procurement of Atlas Copco Compressor Spares for Manali Refinery',
    ministry: 'Ministry of Petroleum & Natural Gas',
    department: 'M&C Department – Materials',
    location: 'CPCL Manali, Chennai',
    estimatedValue: 12.4, // ₹12.4 Cr
    publishDate: '2026-07-10',
    bidEndDate: '2026-08-18',
    submissionDeadline: '2026-08-18T16:00:00+05:30',
    status: 'REVIEW_REQUIRED',
    stage: 'Bid Verification',
    priority: 'HIGH',
    tenderType: 'Domestic Nomination Tender',
    evaluationMethod: 'Item-wise L1',
    category: 'Compressor Spares & Machinery',
    petroleumCategory: 'Compressor Spares & Machinery',
    bidsCount: 3,
    issuesCount: 1,
    isPrimaryDemo: false,
    rawClauses: [
      'Clause 1.1 (Proprietary Eligibility): Nomination tender restricted to OEM M/s Atlas Copco Airpower or 100% authorized Indian subsidiary.',
      'Clause 2.1 (OEM Authorization Token): Verified OEM authorization token and parent manufacturing backing for genuine compressor parts.',
      'Clause 2.2 (Non-Spurious Undertaking): Mandatory certificate of authenticity confirming zero counterfeit or reconditioned components.',
      'Clause 3.1 (GST & Entity Verification): Active GSTIN registration and matching entity legal address in MCA21 records.',
      'Clause 3.2 (PAN & Statutory Tax): Corporate PAN with verified income tax compliance.',
      'Clause 4.1 (Non-Debarment): Non-holiday listing affidavit on ₹100 non-judicial stamp paper.',
      'Clause 5.1 (Make in India Preference): Local content self-declaration under DPIIT PPP-MII policy.',
      'Clause 5.2 (MSE Registration): Udyam certificate for micro/small enterprise preference applicability.'
    ],
    rules: [
      {
        id: 'CPCL-PROP-201',
        metric: 'Proprietary OEM Eligibility',
        minimumValue: 'Atlas Copco / Authorized Subsidiary',
        operator: '==',
        mandatory: true,
        description: 'Nomination tender strictly restricted to proprietary OEM or authorized Indian entity.',
        referenceClause: 'Tender Clause 1.1',
        category: 'OEM'
      },
      {
        id: 'CPCL-AUTH-202',
        metric: 'OEM Authorization Token',
        minimumValue: 'Direct Parent Mandate',
        operator: '==',
        mandatory: true,
        description: 'Parent corporate board authorization guaranteeing genuine OEM spare supply.',
        referenceClause: 'Tender Clause 2.1',
        category: 'OEM'
      },
      {
        id: 'CPCL-NSP-203',
        metric: 'Non-Spurious Guarantee Certificate',
        minimumValue: 'Submitted & Verified',
        operator: '==',
        mandatory: true,
        description: 'Certificate of authenticity guaranteeing 100% new, unused genuine spares.',
        referenceClause: 'Tender Clause 2.2',
        category: 'TECHNICAL'
      },
      {
        id: 'CPCL-STAT-204',
        metric: 'GSTIN & Legal Entity Match',
        minimumValue: 'Active',
        operator: '==',
        mandatory: true,
        description: 'Active GST registration with verified corporate CIN and registered office.',
        referenceClause: 'Tender Clause 3.1',
        category: 'REGISTRATION'
      },
      {
        id: 'CPCL-DEB-205',
        metric: 'Non-Holiday Listing Affidavit',
        minimumValue: 'Clean Record',
        operator: 'NON_BLACKLISTED',
        mandatory: true,
        description: 'Affidavit confirming no holiday listing or debarment by any PSU / MoPNG entity.',
        referenceClause: 'Tender Clause 4.1',
        category: 'DEBARMENT'
      },
      {
        id: 'CPCL-MII-206',
        metric: 'Make in India Local Content',
        minimumValue: '>= 20%',
        operator: '>=',
        mandatory: true,
        description: 'Local content declaration under MoPNG public procurement policy.',
        referenceClause: 'Tender Clause 5.1',
        category: 'LOCAL_CONTENT'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TENDER 4 — EXPLOSION PROOF CCTV CAMERAS (C21B240011)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'C21B240011',
    gemBidNo: 'C21B240011',
    title: 'CPCL Explosion Proof CCTV Cameras',
    ministry: 'Ministry of Petroleum & Natural Gas',
    department: 'M&C / Materials',
    location: 'CPCL Manali, Chennai',
    estimatedValue: 4.2, // ₹4.2 Cr
    publishDate: '2026-07-15',
    bidEndDate: '2026-08-25',
    submissionDeadline: '2026-08-25T15:00:00+05:30',
    status: 'UNDER_EVALUATION',
    stage: 'Compliance Verification',
    priority: 'HIGH',
    tenderType: 'Two-Cover Techno-Commercial Tender',
    evaluationMethod: 'Comprehensive Package L1',
    category: 'Surveillance & Industrial Safety',
    petroleumCategory: 'Surveillance & Industrial Safety',
    bidsCount: 5,
    issuesCount: 3,
    isPrimaryDemo: false,
    rawClauses: [
      'Clause 1.1 (Flameproof Accreditation): Valid PESO (Petroleum & Explosives Safety Org) / ATEX Zone-1 Gas Group IIA/IIB/IIC certificate.',
      'Clause 2.1 (EMD Deposit): EMD of ₹1,50,000 via BG / online transfer or MSE exemption certificate.',
      'Clause 2.2 (PQC Past Experience): Successful supply and installation of >= 50 explosion-proof CCTV cameras in oil refineries / petrochemical plants.',
      'Clause 3.1 (Technical Specification): Adherence to CPCL Spec MS-CCTV-EX-24 (4K, Ex-d enclosure, IP68, optical defogging, wiper).',
      'Clause 4.1 (Land Border Rule 144xi): Mandatory declaration regarding camera optical sensors and SoC chipset country of origin.',
      'Clause 4.2 (Confidentiality Agreement): Executed Non-Disclosure Agreement (NDA) for refinery layout access.',
      'Clause 5.1 (OEM Authorization & Catalogues): OEM Authorization certificate and unpriced technical datasheet catalogues.',
      'Clause 6.1 (Commercial Mandate): PAN, GSTIN, and Bank ECS Mandate form with cancelled cheque.'
    ],
    rules: [
      {
        id: 'CPCL-EX-301',
        metric: 'PESO / ATEX Flameproof Certificate',
        minimumValue: 'Valid Zone-1 Ex-d',
        operator: 'VALID_ON_DATE',
        mandatory: true,
        description: 'Active PESO or ATEX certification for hazardous refinery hydrocarbon environment.',
        referenceClause: 'Tender Clause 1.1',
        category: 'SAFETY'
      },
      {
        id: 'CPCL-EMD-302',
        metric: 'Earnest Money Deposit (EMD)',
        minimumValue: '₹1,50,000 / MSE Exemption',
        operator: '==',
        mandatory: true,
        description: 'Submission of ₹1.5 Lakh EMD deposit or valid Udyam registration.',
        referenceClause: 'Tender Clause 2.1',
        category: 'FINANCIAL'
      },
      {
        id: 'CPCL-PQC-303',
        metric: 'Past Refinery Experience (PQC)',
        minimumValue: 50,
        unit: 'Cameras Supplied',
        operator: '>=',
        mandatory: true,
        description: 'Supply of >= 50 explosion-proof camera units to refineries with completion certificates.',
        referenceClause: 'Tender Clause 2.2',
        category: 'EXPERIENCE'
      },
      {
        id: 'CPCL-TECH-304',
        metric: 'Technical Specification MS-CCTV-EX-24',
        minimumValue: 'Fully Compliant',
        operator: '==',
        mandatory: true,
        description: 'Compliance with CPCL explosion-proof CCTV camera engineering specifications.',
        referenceClause: 'Tender Clause 3.1',
        category: 'TECHNICAL'
      },
      {
        id: 'CPCL-LBD-305',
        metric: 'Land Border Rule 144(xi) Declaration',
        minimumValue: 'Compliant Declaration',
        operator: '==',
        mandatory: true,
        description: 'Declaration on electronics and chipset origin under GFR Rule 144(xi).',
        referenceClause: 'Tender Clause 4.1',
        category: 'STATUTORY'
      },
      {
        id: 'CPCL-NDA-306',
        metric: 'Non-Disclosure Agreement (NDA)',
        minimumValue: 'Executed',
        operator: '==',
        mandatory: true,
        description: 'Signed and stamped Non-Disclosure Agreement for CPCL Manali refinery security.',
        referenceClause: 'Tender Clause 4.2',
        category: 'STATUTORY'
      },
      {
        id: 'CPCL-OEM-307',
        metric: 'OEM Authorization Form (MAF)',
        minimumValue: 'Authorized',
        operator: '==',
        mandatory: true,
        description: 'Manufacturer Authorization Form with back-to-back replacement warranty.',
        referenceClause: 'Tender Clause 5.1',
        category: 'OEM'
      },
      {
        id: 'CPCL-STAT-308',
        metric: 'Bank ECS Mandate & Cancelled Cheque',
        minimumValue: 'Verified',
        operator: '==',
        mandatory: true,
        description: 'Bank Mandate form stamped by schedule commercial bank with cancelled cheque.',
        referenceClause: 'Tender Clause 6.1',
        category: 'REGISTRATION'
      }
    ]
  }
];
