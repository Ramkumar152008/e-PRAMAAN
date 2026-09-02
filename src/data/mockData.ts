import { Tender, Bidder, DashboardKPIs } from '../types';
import { PETROLEUM_TENDERS, PETROLEUM_CATEGORIES } from './petroleumTendersData';
import { PETROLEUM_BIDDERS } from './biddersData';

export { PETROLEUM_CATEGORIES };

// Exact KPIs from Prompt Section 8
export const INITIAL_KPIS: DashboardKPIs = {
  activeTenders: 12,
  bidsUnderReview: 47,
  highRiskBidders: 6,
  complianceConflicts: 11,
  pendingInvestigations: 7,
  averageVerificationTime: '6.4 min',
  activeEvaluations: 12 // backward compat
};

export const MOCK_TENDERS: Tender[] = PETROLEUM_TENDERS;
export const MOCK_BIDDERS: Bidder[] = PETROLEUM_BIDDERS;

export const MOCK_DEPARTMENTS: string[] = [
  'Ministry of Petroleum & Natural Gas',
  'Oil & Gas Equipment Directorate',
  'Pipeline Infrastructure Division',
  'Refinery Safety Directorate',
  'Petroleum Storage & Strategic Reserves',
  'All Departments'
];
