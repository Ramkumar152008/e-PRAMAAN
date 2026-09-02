import { Bidder, InvestigationPriorityItem } from '../types';

/**
 * Investigation Priority Service — BidShield AI
 * Ranks verification findings into an actionable priority queue for the Procurement Officer.
 */

export function getRankedInvestigationPriorities(bidder: Bidder): InvestigationPriorityItem[] {
  return bidder.investigationPriorities || [
    {
      id: 'PRI-01',
      priority: 1,
      severity: 'HIGH',
      title: 'Turnover Mismatch (Clause 4.2)',
      description: '₹12.0 Cr claimed vs ₹8.70 Cr verified in MCA21 Form AOC-4.',
      claimedValue: '₹12.00 Crore',
      verifiedValue: '₹8.70 Crore',
      recommendedOfficerAction: 'Review financial evidence and request UDIN clarification.',
      affectedRule: 'PET-FIN-001',
      evidenceRef: 'CA Statement vs MCA21 AOC-4',
      status: 'OPEN'
    },
    {
      id: 'PRI-02',
      priority: 2,
      severity: 'HIGH',
      title: 'Insufficient Verified Oil & Gas Industry Experience (Clause 5.1)',
      description: '7 years claimed vs 3.8 years verified tenure since incorporation.',
      claimedValue: '7.0 Years',
      verifiedValue: '3.8 Years',
      recommendedOfficerAction: 'Verify previous petroleum-sector work orders.',
      affectedRule: 'PET-EXP-002',
      evidenceRef: 'Experience Dossier vs MCA21 Record',
      status: 'OPEN'
    },
    {
      id: 'PRI-03',
      priority: 3,
      severity: 'HIGH',
      title: 'Safety Certificate Expired Before Bid Date (Clause 8.1)',
      description: 'PESO certificate expired on 05-Aug-2026, 5 days prior to 10-Aug-2026 bid date.',
      claimedValue: 'Valid on Bid Date',
      verifiedValue: 'Expired on 05-Aug-2026',
      recommendedOfficerAction: 'Verify original certificate / request valid renewal evidence.',
      affectedRule: 'PET-SFT-007',
      evidenceRef: 'PESO Safety Certificate #PESO-EX-2023-88912',
      status: 'OPEN'
    },
    {
      id: 'PRI-04',
      priority: 4,
      severity: 'MEDIUM',
      title: 'OEM Authorization Form Requires Verification (Clause 7.1)',
      description: 'MAF token logged in registry; requires secondary validation with OEM issuer.',
      claimedValue: 'Verified MAF Token',
      verifiedValue: 'Requires Verification',
      recommendedOfficerAction: 'Verify authorization directly with OEM issuer.',
      affectedRule: 'PET-OEM-006',
      evidenceRef: 'MAF Token PETRO-SENS-2026-MAF-8812',
      status: 'OPEN'
    }
  ];
}
