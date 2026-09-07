import { Bidder, ComplianceMatrixRow, RiskProfile, TruthGraphData } from '../types';

/**
 * PRODUCTION DEMO DATA — CPCL Procurement Bidders Dataset
 * Linked to the 4 CPCL active tenders:
 * 1. C03H240087 (4 Bids) - Primary Golden Demo Path
 * 2. C13A250049 (6 Bids) - Pipe Fittings (CS)
 * 3. C18B250074 (3 Bids) - Compressor Spares (Proprietary)
 * 4. C21B240011 (5 Bids) - Explosion Proof CCTV Cameras
 */

export const PRIMARY_DEMO_BIDDER_ID = 'BID-ATC-001';

const createDefaultRisk = (
  score: number,
  risk: 'LOW' | 'MEDIUM' | 'HIGH',
  recommendation: 'CLEARED' | 'REQUIRES_VERIFICATION' | 'REJECT',
  summary: string,
  topIssues: string[] = []
): RiskProfile => ({
  complianceScore: score,
  evidenceConfidence: 95,
  financialRisk: risk === 'HIGH' ? 80 : risk === 'MEDIUM' ? 40 : 10,
  documentRisk: risk === 'HIGH' ? 75 : risk === 'MEDIUM' ? 35 : 10,
  eligibilityRisk: risk === 'HIGH' ? 85 : risk === 'MEDIUM' ? 45 : 10,
  overallRisk: risk,
  aiRecommendation: recommendation,
  summary,
  topIssues
});

const emptyGraph: TruthGraphData = { nodes: [], edges: [] };

const createBidder = (data: Partial<Bidder> & { id: string; tenderId: string; name: string }): Bidder => {
  return {
    cin: data.cin || 'U28999TN2015PTC099812',
    pan: data.pan || 'AABCA1234F',
    gstin: data.gstin || '33AABCA1234F1Z5',
    udyamNo: data.udyamNo || 'UDYAM-TN-02-0019284',
    claimedAddress: data.claimedAddress || 'Chennai, Tamil Nadu',
    verifiedAddress: data.verifiedAddress || 'Chennai, Tamil Nadu',
    claimedTurnover: data.claimedTurnover || 25.0,
    verifiedTurnover: data.verifiedTurnover || 25.0,
    claimedExperienceYears: data.claimedExperienceYears || 8.0,
    verifiedExperienceYears: data.verifiedExperienceYears || 8.0,
    bidSubmissionDate: data.bidSubmissionDate || '2026-08-10',
    turnoverBreakdown: data.turnoverBreakdown || [],
    documents: data.documents || [],
    extractedFields: data.extractedFields || [],
    certificates: data.certificates || [],
    oemAuth: data.oemAuth || {
      oemName: 'CPCL Approved Manufacturer',
      authCode: 'AUTH-CPCL-2026',
      issuedTo: data.name,
      validTill: '2027-12-31',
      verifiedDirectly: true,
      qrVerified: true,
      notes: 'OEM Authorization Verified'
    },
    crossVerifications: data.crossVerifications || [],
    truthGraph: data.truthGraph || emptyGraph,
    temporalCompliance: data.temporalCompliance || [],
    complianceMatrix: data.complianceMatrix || [],
    riskProfile: data.riskProfile || createDefaultRisk(90, 'LOW', 'CLEARED', 'Compliant with tender requirements.'),
    investigationPriorities: data.investigationPriorities || [],
    findings: data.findings || [],
    ...data
  };
};

export const PETROLEUM_BIDDERS: Bidder[] = [
  // ═════════════════════════════════════════════════════════════════════════════
  // TENDER 1: C03H240087 (Procurement of Tube, Radiant 1F3, 6IN) — 4 BIDS
  // ═════════════════════════════════════════════════════════════════════════════

  // 1.1 PRIMARY GOLDEN DEMO BIDDER: Atlas Copco (India) Private Limited
  createBidder({
    id: 'BID-ATC-001',
    tenderId: 'C03H240087',
    name: 'Atlas Copco (India) Private Limited',
    cin: 'U27100MH1960PLC011649',
    pan: 'AAACA1234F',
    gstin: '27AAACA1234F1Z8',
    udyamNo: 'UDYAM-MH-26-0012489',
    claimedAddress: 'Sveanagar, Dapodi, Pune, Maharashtra - 411012',
    verifiedAddress: 'Sveanagar, Dapodi, Pune, Maharashtra - 411012',
    claimedTurnover: 84.5,
    verifiedTurnover: 84.5,
    claimedExperienceYears: 12.0,
    verifiedExperienceYears: 12.0,
    bidSubmissionDate: '2026-08-10',
    turnoverBreakdown: [
      { year: 'FY 2023-24', claimed: 78.2, verified: 78.2 },
      { year: 'FY 2024-25', claimed: 84.5, verified: 84.5 },
      { year: 'FY 2025-26', claimed: 91.0, verified: 91.0 }
    ],
    documents: [
      {
        id: 'DOC-ATC-01',
        name: 'OEM_Authorization_Certificate.pdf',
        type: 'OEM_AUTH',
        size: '1.4 MB',
        uploadedAt: '2026-08-09 11:15',
        checksum: 'sha256:19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
        status: 'EXTRACTED',
        pageCount: 2,
        extractionConfidence: 94
      },
      {
        id: 'DOC-ATC-02',
        name: 'ISO_9001_Certificate_Lloyds.pdf',
        type: 'ISO_CERT',
        size: '1.2 MB',
        uploadedAt: '2026-08-09 11:18',
        checksum: 'sha256:4410293847192837491827394817293847192837491827394817293847192837',
        status: 'EXTRACTED',
        pageCount: 2,
        extractionConfidence: 98
      },
      {
        id: 'DOC-ATC-03',
        name: 'GST_Registration_Certificate.pdf',
        type: 'GST_CERT',
        size: '890 KB',
        uploadedAt: '2026-08-09 11:20',
        checksum: 'sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
        status: 'EXTRACTED',
        pageCount: 3,
        extractionConfidence: 99
      },
      {
        id: 'DOC-ATC-04',
        name: 'Corporate_PAN_Card.pdf',
        type: 'PAN_CERT',
        size: '480 KB',
        uploadedAt: '2026-08-09 11:22',
        checksum: 'sha256:4a8c91d2e0f872b65103a8904712ec3105ab6719cd288231aa492147810fed01',
        status: 'EXTRACTED',
        pageCount: 1,
        extractionConfidence: 99
      },
      {
        id: 'DOC-ATC-05',
        name: 'Technical_Compliance_Sheet_MS_RAD_6IN.pdf',
        type: 'TECHNICAL_SPECS',
        size: '2.8 MB',
        uploadedAt: '2026-08-09 11:25',
        checksum: 'sha256:5519203948172938471928374918273948172938471928374918273948172938',
        status: 'EXTRACTED',
        pageCount: 14,
        extractionConfidence: 95
      },
      {
        id: 'DOC-ATC-06',
        name: 'Make_in_India_Local_Content_Declaration.pdf',
        type: 'AFFIDAVIT',
        size: '650 KB',
        uploadedAt: '2026-08-09 11:28',
        checksum: 'sha256:6619203948172938471928374918273948172938471928374918273948172938',
        status: 'EXTRACTED',
        pageCount: 2,
        extractionConfidence: 96
      },
      {
        id: 'DOC-ATC-07',
        name: 'Land_Border_Declaration_Rule144xi.pdf',
        type: 'DEBARMENT_DECLARATION',
        size: '510 KB',
        uploadedAt: '2026-08-09 11:30',
        checksum: 'sha256:7719203948172938471928374918273948172938471928374918273948172938',
        status: 'EXTRACTED',
        pageCount: 1,
        extractionConfidence: 98
      }
    ],
    complianceMatrix: [
      {
        id: 'CM-ATC-01',
        requirement: 'OEM / OEM Authorized Agency (Clause 2.1)',
        mandatory: true,
        bidderEvidence: 'Atlas Copco Airpower n.v., Belgium (Parent MAF)',
        verifiedSource: 'Bidder Submission Locker',
        result: 'WARNING',
        confidence: 94,
        risk: 'HIGH',
        officerAction: 'Request Corporate Undertaking'
      },
      {
        id: 'CM-ATC-02',
        requirement: 'ISO 9001 Quality Certificate (Clause 2.2)',
        mandatory: true,
        bidderEvidence: 'Valid through 15-Dec-2026',
        verifiedSource: 'LRQA Quality Registry',
        result: 'PASS',
        confidence: 98,
        risk: 'LOW',
        officerAction: 'Verified Valid on Bid Date'
      },
      {
        id: 'CM-ATC-03',
        requirement: 'Earnest Money Deposit (Clause 3.1)',
        mandatory: true,
        bidderEvidence: '₹3,70,000 SBI Bank Guarantee',
        verifiedSource: 'State Bank of India',
        result: 'PASS',
        confidence: 99,
        risk: 'LOW',
        officerAction: 'Guarantee Confirmed'
      },
      {
        id: 'CM-ATC-04',
        requirement: 'GST Registration (Clause 4.1)',
        mandatory: true,
        bidderEvidence: '27AAACA1234F1Z8 Active Regular',
        verifiedSource: 'GSTN Reference Adapter',
        result: 'PASS',
        confidence: 99,
        risk: 'LOW',
        officerAction: 'Status Active'
      },
      {
        id: 'CM-ATC-05',
        requirement: 'Corporate PAN (Clause 4.1)',
        mandatory: true,
        bidderEvidence: 'AAACA1234F Matched Entity',
        verifiedSource: 'ITD PAN Adapter',
        result: 'PASS',
        confidence: 99,
        risk: 'LOW',
        officerAction: 'Valid Entity PAN'
      },
      {
        id: 'CM-ATC-06',
        requirement: 'Make in India Local Content (Clause 5.1)',
        mandatory: true,
        bidderEvidence: '58.4% Class-I Local Content',
        verifiedSource: 'DPIIT Self-Declaration',
        result: 'PASS',
        confidence: 96,
        risk: 'LOW',
        officerAction: 'Class-I Verified'
      },
      {
        id: 'CM-ATC-07',
        requirement: 'Land Border Declaration (Clause 5.2)',
        mandatory: true,
        bidderEvidence: 'Rule 144(xi) Compliant Declaration',
        verifiedSource: 'Statutory Registry',
        result: 'PASS',
        confidence: 98,
        risk: 'LOW',
        officerAction: 'No Restrictions'
      },
      {
        id: 'CM-ATC-08',
        requirement: 'Non-Debarment Check (Clause 5.2)',
        mandatory: true,
        bidderEvidence: 'No Holiday Listing Affidavit',
        verifiedSource: 'CPCL Debarment Registry',
        result: 'PASS',
        confidence: 99,
        risk: 'LOW',
        officerAction: 'Clean Record'
      },
      {
        id: 'CM-ATC-09',
        requirement: 'Technical Spec MS-RAD-6IN-1F3 (Clause 6.1)',
        mandatory: true,
        bidderEvidence: 'Full Compliance & Stage-III QAP',
        verifiedSource: 'CPCL Engineering Matrix',
        result: 'PASS',
        confidence: 95,
        risk: 'LOW',
        officerAction: 'Spec Approved'
      }
    ],
    riskProfile: createDefaultRisk(
      86,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'Bidder satisfies 8 of 9 requirements. Clarification required regarding parent company MAF scope.',
      ['OEM Manufacturer Authorization issued by parent company Atlas Copco Airpower n.v. Belgium requires officer review of corporate subsidiary scope.']
    ),
    truthGraph: {
      nodes: [
        { id: 'N-REQ', label: 'Tender Requirement', type: 'attribute', status: 'verified', value: 'Clause 2.1: OEM / Authorized Agency' },
        { id: 'N-RULE', label: 'Compliance Rule', type: 'attribute', status: 'verified', value: 'CPCL-PQ-001' },
        { id: 'N-DOC', label: 'Bidder Document', type: 'document', status: 'verified', value: 'OEM_Authorization_Certificate.pdf' },
        { id: 'N-EXT', label: 'AI Extracted Value', type: 'attribute', status: 'verified', value: 'Grantor: Atlas Copco Airpower n.v. (Belgium)' },
        { id: 'N-REF', label: 'Reference Evidence', type: 'registry', status: 'verified', value: 'Corporate Reference: Global Parent Entity' },
        { id: 'N-CMP', label: 'Comparison', type: 'attribute', status: 'conflict', value: 'Parent Entity to Indian Subsidiary Relationship' },
        { id: 'N-FND', label: 'Finding', type: 'alert', status: 'conflict', value: 'Scope Confirmation Required' },
        { id: 'N-ACT', label: 'Officer Action', type: 'entity', status: 'normal', value: 'Request Corporate Undertaking' }
      ],
      edges: [
        { from: 'N-REQ', to: 'N-RULE', label: 'Maps to', status: 'valid' },
        { from: 'N-RULE', to: 'N-DOC', label: 'Evaluates', status: 'valid' },
        { from: 'N-DOC', to: 'N-EXT', label: 'Extracts', status: 'valid' },
        { from: 'N-EXT', to: 'N-REF', label: 'References', status: 'valid' },
        { from: 'N-REF', to: 'N-CMP', label: 'Compares', status: 'valid' },
        { from: 'N-CMP', to: 'N-FND', label: 'Determines', status: 'warning' },
        { from: 'N-FND', to: 'N-ACT', label: 'Recommends', status: 'warning' }
      ]
    }
  }),

  // 1.2 SECONDARY BIDDER: ABC Industrial Supplies Pvt. Ltd. (FAIL / NON-OEM TRADER)
  createBidder({
    id: 'BID-ABC-001',
    tenderId: 'C03H240087',
    name: 'ABC Industrial Supplies Pvt. Ltd.',
    cin: 'U72900DL2018PTC334512',
    pan: 'AABCA9876K',
    gstin: '07AABCA9876K1Z2',
    udyamNo: 'UDYAM-DL-01-0088912',
    claimedAddress: '14 Okhla Industrial Area Phase-III, New Delhi - 110020',
    verifiedAddress: '14 Okhla Industrial Area Phase-III, New Delhi - 110020',
    claimedTurnover: 12.0,
    verifiedTurnover: 8.7,
    claimedExperienceYears: 4.0,
    verifiedExperienceYears: 4.0,
    bidSubmissionDate: '2026-08-09',
    documents: [
      {
        id: 'DOC-ABC-01',
        name: 'Trader_Declaration.pdf',
        type: 'OEM_AUTH',
        size: '850 KB',
        uploadedAt: '2026-08-08 14:20',
        checksum: 'sha256:3319203948172938471928374918273948172938471928374918273948172938',
        status: 'EXTRACTED',
        pageCount: 2,
        extractionConfidence: 82
      }
    ],
    complianceMatrix: [
      {
        id: 'CM-ABC-01',
        requirement: 'OEM / OEM Authorized Agency (Clause 2.1)',
        mandatory: true,
        bidderEvidence: 'Industrial Stockist / Trader',
        verifiedSource: 'Bidder Submission Locker',
        result: 'FAIL',
        confidence: 98,
        risk: 'CRITICAL',
        officerAction: 'Reject Bid under Clause 2.1'
      }
    ],
    riskProfile: createDefaultRisk(
      62,
      'HIGH',
      'REJECT',
      'Bidder is non-compliant under Clause 2.1 (Trader status without OEM authorization).',
      ['Mandatory Manufacturer Authorization Form (MAF) missing. Non-OEM trader bidding for critical refinery furnace tubes.']
    )
  }),

  // 1.3 BIDDER: Chennai Heat Transfer Components LLP (QUALIFIED)
  createBidder({
    id: 'BID-CHT-003',
    tenderId: 'C03H240087',
    name: 'Chennai Heat Transfer Components LLP',
    cin: 'AAA-9921',
    pan: 'AACFC4455E',
    gstin: '33AACFC4455E1Z5',
    claimedAddress: 'Plot 42, SIDCO Industrial Estate, Ambattur, Chennai - 600058',
    verifiedAddress: 'Plot 42, SIDCO Industrial Estate, Ambattur, Chennai - 600058',
    claimedTurnover: 42.0,
    verifiedTurnover: 42.0,
    claimedExperienceYears: 8.0,
    verifiedExperienceYears: 8.0,
    bidSubmissionDate: '2026-08-08',
    riskProfile: createDefaultRisk(92, 'LOW', 'CLEARED', 'Compliant with all technical and statutory requirements.')
  }),

  // 1.4 BIDDER: Apex Thermal Radiants Co. (UNDER REVIEW)
  createBidder({
    id: 'BID-ATR-004',
    tenderId: 'C03H240087',
    name: 'Apex Thermal Radiants Co.',
    cin: 'U28112TN2015PTC099812',
    pan: 'AABCA5511D',
    gstin: '33AABCA5511D1Z4',
    claimedAddress: 'SIPCOT Industrial Park, Sriperumbudur, Tamil Nadu - 602105',
    verifiedAddress: 'SIPCOT Industrial Park, Sriperumbudur, Tamil Nadu - 602105',
    claimedTurnover: 28.5,
    verifiedTurnover: 28.5,
    claimedExperienceYears: 6.0,
    verifiedExperienceYears: 6.0,
    bidSubmissionDate: '2026-08-09',
    riskProfile: createDefaultRisk(
      78,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'EMD Bank Guarantee format verification required.',
      ['EMD Bank Guarantee format requires standard CPCL wording reconciliation.']
    )
  }),

  // ═════════════════════════════════════════════════════════════════════════════
  // TENDER 2: C13A250049 (Pipe Fittings - CS) — 6 BIDS
  // ═════════════════════════════════════════════════════════════════════════════

  createBidder({
    id: 'BID-TVI-001',
    tenderId: 'C13A250049',
    name: 'Tube & Valves (India) Pvt. Ltd.',
    cin: 'U28999TN1998PTC040112',
    pan: 'AABCT1234E',
    gstin: '33AABCT1234E1Z6',
    claimedAddress: 'Guindy Industrial Estate, Chennai - 600032',
    verifiedAddress: 'Guindy Industrial Estate, Chennai - 600032',
    claimedTurnover: 18.2,
    verifiedTurnover: 18.2,
    claimedExperienceYears: 15.0,
    verifiedExperienceYears: 15.0,
    bidSubmissionDate: '2026-08-19',
    riskProfile: createDefaultRisk(95, 'LOW', 'CLEARED', '100% compliant with ASTM A234 WPB specifications, TPI undertaking and Make in India.')
  }),

  createBidder({
    id: 'BID-SFF-002',
    tenderId: 'C13A250049',
    name: 'Southern Forgings & Flanges Ltd.',
    cin: 'U27109TN1995PLC031448',
    pan: 'AABCS9988D',
    gstin: '33AABCS9988D1Z2',
    claimedAddress: 'Maraimalai Nagar, Chengalpattu, Tamil Nadu - 603209',
    verifiedAddress: 'Maraimalai Nagar, Chengalpattu, Tamil Nadu - 603209',
    claimedTurnover: 35.0,
    verifiedTurnover: 35.0,
    claimedExperienceYears: 20.0,
    verifiedExperienceYears: 20.0,
    bidSubmissionDate: '2026-08-18',
    riskProfile: createDefaultRisk(
      88,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'TPI Agency appointment mandate requires formal confirmation of EIL approval.',
      ['Third-party inspection agency appointment requires confirmation.']
    )
  }),

  createBidder({
    id: 'BID-CPF-003',
    tenderId: 'C13A250049',
    name: 'Coromandel Pipe Fittings LLP',
    cin: 'AAB-1124',
    pan: 'AABCC8844G',
    gstin: '33AABCC8844G1Z8',
    claimedAddress: 'Ennore High Road, Chennai - 600057',
    verifiedAddress: 'Ennore High Road, Chennai - 600057',
    claimedTurnover: 12.5,
    verifiedTurnover: 12.5,
    claimedExperienceYears: 7.0,
    verifiedExperienceYears: 7.0,
    bidSubmissionDate: '2026-08-19',
    riskProfile: createDefaultRisk(91, 'LOW', 'CLEARED', 'Verified Mill Test Certificate and 62% Class-I local content.')
  }),

  createBidder({
    id: 'BID-MHH-004',
    tenderId: 'C13A250049',
    name: 'Madras Heavy Hydraulics Co.',
    cin: 'U29100TN2012PTC084124',
    pan: 'AABCM4411K',
    gstin: '33AABCM4411K1Z1',
    claimedAddress: 'Ranipet Industrial Area, Vellore, Tamil Nadu - 632403',
    verifiedAddress: 'Ranipet Industrial Area, Vellore, Tamil Nadu - 632403',
    claimedTurnover: 9.8,
    verifiedTurnover: 9.8,
    claimedExperienceYears: 5.0,
    verifiedExperienceYears: 5.0,
    bidSubmissionDate: '2026-08-17',
    riskProfile: createDefaultRisk(
      74,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'MSE Udyam certificate NIC code verification required for pipe fitting manufacture.',
      ['Udyam category verification needed for manufacturing exemption.']
    )
  }),

  createBidder({
    id: 'BID-SAF-005',
    tenderId: 'C13A250049',
    name: 'Super Alloy Fittings & Flanges Pvt. Ltd.',
    cin: 'U28111MH2008PTC184192',
    pan: 'AABCS5599M',
    gstin: '27AABCS5599M1Z3',
    claimedAddress: 'Rabale MIDC, Navi Mumbai, Maharashtra - 400701',
    verifiedAddress: 'Rabale MIDC, Navi Mumbai, Maharashtra - 400701',
    claimedTurnover: 48.0,
    verifiedTurnover: 48.0,
    claimedExperienceYears: 16.0,
    verifiedExperienceYears: 16.0,
    bidSubmissionDate: '2026-08-18',
    riskProfile: createDefaultRisk(93, 'LOW', 'CLEARED', 'Fully compliant with ASTM A234 WPB and EN 10204 3.1 MTC.')
  }),

  createBidder({
    id: 'BID-DIP-006',
    tenderId: 'C13A250049',
    name: 'Deccan Industrial Piping Corp.',
    cin: 'U28900TG2014PTC092811',
    pan: 'AABCD7722R',
    gstin: '36AABCD7722R1Z5',
    claimedAddress: 'Balanagar Industrial Area, Hyderabad, Telangana - 500037',
    verifiedAddress: 'Balanagar Industrial Area, Hyderabad, Telangana - 500037',
    claimedTurnover: 14.2,
    verifiedTurnover: 14.2,
    claimedExperienceYears: 9.0,
    verifiedExperienceYears: 9.0,
    bidSubmissionDate: '2026-08-19',
    riskProfile: createDefaultRisk(82, 'LOW', 'CLEARED', 'Verified GSTR-3B filings and technical QAP.')
  }),

  // ═════════════════════════════════════════════════════════════════════════════
  // TENDER 3: C18B250074 (Atlas Copco Compressor Spares - Proprietary) — 3 BIDS
  // ═════════════════════════════════════════════════════════════════════════════

  createBidder({
    id: 'BID-ATC-002',
    tenderId: 'C18B250074',
    name: 'Atlas Copco (India) Private Limited',
    cin: 'U27100MH1960PLC011649',
    pan: 'AAACA1234F',
    gstin: '27AAACA1234F1Z8',
    udyamNo: 'UDYAM-MH-26-0012489',
    claimedAddress: 'Sveanagar, Dapodi, Pune, Maharashtra - 411012',
    verifiedAddress: 'Sveanagar, Dapodi, Pune, Maharashtra - 411012',
    claimedTurnover: 84.5,
    verifiedTurnover: 84.5,
    claimedExperienceYears: 12.0,
    verifiedExperienceYears: 12.0,
    bidSubmissionDate: '2026-08-17',
    riskProfile: createDefaultRisk(
      89,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'Proprietary OEM authorization token submitted from Atlas Copco Belgium.',
      ['Proprietary single-source pricing certificate verification required.']
    )
  }),

  createBidder({
    id: 'BID-IR-002',
    tenderId: 'C18B250074',
    name: 'Ingersoll Rand (India) Ltd.',
    cin: 'L29120KA1921PLC000002',
    pan: 'AAACI0022G',
    gstin: '29AAACI0022G1Z9',
    claimedAddress: 'Peenya Industrial Area, Bengaluru, Karnataka - 560058',
    verifiedAddress: 'Peenya Industrial Area, Bengaluru, Karnataka - 560058',
    claimedTurnover: 120.0,
    verifiedTurnover: 120.0,
    claimedExperienceYears: 25.0,
    verifiedExperienceYears: 25.0,
    bidSubmissionDate: '2026-08-16',
    riskProfile: createDefaultRisk(
      45,
      'HIGH',
      'REJECT',
      'Non-compliant: Alternate compressor spares not admissible under nomination tender.',
      ['Nomination tender strictly restricted to Atlas Copco OEM equipment.']
    )
  }),

  createBidder({
    id: 'BID-KC-003',
    tenderId: 'C18B250074',
    name: 'Kaeser Compressors India Pvt. Ltd.',
    cin: 'U29120PN1999PTC013891',
    pan: 'AAACK4499P',
    gstin: '27AAACK4499P1Z1',
    claimedAddress: 'D-II Block, MIDC Chinchwad, Pune - 411019',
    verifiedAddress: 'D-II Block, MIDC Chinchwad, Pune - 411019',
    claimedTurnover: 65.0,
    verifiedTurnover: 65.0,
    claimedExperienceYears: 18.0,
    verifiedExperienceYears: 18.0,
    bidSubmissionDate: '2026-08-17',
    riskProfile: createDefaultRisk(
      40,
      'HIGH',
      'REJECT',
      'Non-compliant: Alternate manufacturer spares ineligible.',
      ['Non-OEM spare bid for proprietary compressor equipment.']
    )
  }),

  // ═════════════════════════════════════════════════════════════════════════════
  // TENDER 4: C21B240011 (Explosion Proof CCTV Cameras) — 5 BIDS
  // ═════════════════════════════════════════════════════════════════════════════

  createBidder({
    id: 'BID-HON-001',
    tenderId: 'C21B240011',
    name: 'Honeywell Automation India Limited',
    cin: 'L29299PN1984PLC017951',
    pan: 'AAACH0099M',
    gstin: '27AAACH0099M1Z8',
    claimedAddress: '56/57 Hadapsar Industrial Estate, Pune, Maharashtra - 411013',
    verifiedAddress: '56/57 Hadapsar Industrial Estate, Pune, Maharashtra - 411013',
    claimedTurnover: 320.0,
    verifiedTurnover: 320.0,
    claimedExperienceYears: 30.0,
    verifiedExperienceYears: 30.0,
    bidSubmissionDate: '2026-08-24',
    riskProfile: createDefaultRisk(96, 'LOW', 'CLEARED', 'Full PESO/ATEX Zone-1 certification, PQC experience proof and Rule 144(xi) declaration.')
  }),

  createBidder({
    id: 'BID-AXS-002',
    tenderId: 'C21B240011',
    name: 'Axis Surveillance Systems India Pvt. Ltd.',
    cin: 'U72200KA2006PTC040912',
    pan: 'AAACA8899Q',
    gstin: '29AAACA8899Q1Z4',
    claimedAddress: 'Prestige Tech Park, Marathahalli, Bengaluru - 560103',
    verifiedAddress: 'Prestige Tech Park, Marathahalli, Bengaluru - 560103',
    claimedTurnover: 95.0,
    verifiedTurnover: 95.0,
    claimedExperienceYears: 14.0,
    verifiedExperienceYears: 14.0,
    bidSubmissionDate: '2026-08-23',
    riskProfile: createDefaultRisk(
      84,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'PESO Flameproof certificate renewal endorsement pending.',
      ['PESO Ex-d enclosure renewal endorsement required.']
    )
  }),

  createBidder({
    id: 'BID-SVE-003',
    tenderId: 'C21B240011',
    name: 'SecureView Industrial Electronics LLP',
    cin: 'AAB-9981',
    pan: 'AABCS1144J',
    gstin: '33AABCS1144J1Z6',
    claimedAddress: 'TIDEL Park, Tharamani, Chennai - 600113',
    verifiedAddress: 'TIDEL Park, Tharamani, Chennai - 600113',
    claimedTurnover: 8.5,
    verifiedTurnover: 8.5,
    claimedExperienceYears: 4.0,
    verifiedExperienceYears: 4.0,
    bidSubmissionDate: '2026-08-24',
    riskProfile: createDefaultRisk(
      68,
      'HIGH',
      'REQUIRES_VERIFICATION',
      'Land Border Rule 144(xi) declaration incomplete regarding camera optical sensor origin.',
      [
        'Land Border Declaration Rule 144(xi) missing camera sensor origin disclosure.',
        'PQC past refinery supply proof shortfall.'
      ]
    )
  }),

  createBidder({
    id: 'BID-PSC-004',
    tenderId: 'C21B240011',
    name: 'Penta Security & CCTV Solutions Co.',
    cin: 'U74900DL2016PTC294112',
    pan: 'AABCP8822N',
    gstin: '07AABCP8822N1Z9',
    claimedAddress: 'Nehru Place, New Delhi - 110019',
    verifiedAddress: 'Nehru Place, New Delhi - 110019',
    claimedTurnover: 14.0,
    verifiedTurnover: 14.0,
    claimedExperienceYears: 6.0,
    verifiedExperienceYears: 6.0,
    bidSubmissionDate: '2026-08-22',
    riskProfile: createDefaultRisk(
      79,
      'MEDIUM',
      'REQUIRES_VERIFICATION',
      'PQC experience certificate from refinery client required.',
      ['PQC past supply completion certificate pending verification.']
    )
  }),

  createBidder({
    id: 'BID-SEI-005',
    tenderId: 'C21B240011',
    name: 'Schneider Electric India Pvt. Ltd.',
    cin: 'U74899DL1995PTC065842',
    pan: 'AAACS0088L',
    gstin: '07AAACS0088L1Z4',
    claimedAddress: 'C-56, Mayapuri Industrial Area Phase-II, New Delhi - 110064',
    verifiedAddress: 'C-56, Mayapuri Industrial Area Phase-II, New Delhi - 110064',
    claimedTurnover: 450.0,
    verifiedTurnover: 450.0,
    claimedExperienceYears: 28.0,
    verifiedExperienceYears: 28.0,
    bidSubmissionDate: '2026-08-23',
    riskProfile: createDefaultRisk(94, 'LOW', 'CLEARED', 'Fully compliant with ATEX/PESO specifications, OEM warranty and bank ECS mandate.')
  })
];
