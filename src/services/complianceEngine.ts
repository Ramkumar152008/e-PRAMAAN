import { Bidder, ComplianceMatrixRow, VerificationStatus, RiskLevel } from '../types';

/**
 * Compliance Engine — BidShield AI
 * Evaluates compliance matrix across financial, domain experience, safety, and statutory criteria.
 */

export interface EvaluationOutcome {
  complianceScore: number;
  totalRequirements: number;
  passCount: number;
  conflictCount: number;
  warningCount: number;
  failCount: number;
  overallStatus: 'COMPLIANT' | 'CONFLICTS_DETECTED' | 'NON_COMPLIANT';
  matrix: ComplianceMatrixRow[];
}

export function evaluateBidderCompliance(bidder: Bidder): EvaluationOutcome {
  const matrix = bidder.complianceMatrix;
  const passCount = matrix.filter((r) => r.result === 'PASS').length;
  const conflictCount = matrix.filter((r) => r.result === 'CONFLICT').length;
  const warningCount = matrix.filter((r) => r.result === 'WARNING').length;
  const failCount = matrix.filter((r) => r.result === 'FAIL').length;

  const complianceScore = Math.round((passCount / matrix.length) * 100);

  let overallStatus: 'COMPLIANT' | 'CONFLICTS_DETECTED' | 'NON_COMPLIANT' = 'COMPLIANT';
  if (failCount > 0 || conflictCount > 0) {
    overallStatus = 'CONFLICTS_DETECTED';
  }

  return {
    complianceScore,
    totalRequirements: matrix.length,
    passCount,
    conflictCount,
    warningCount,
    failCount,
    overallStatus,
    matrix
  };
}
