import { Bidder, VerificationField, TemporalCheck, RiskProfile, VerificationStatus } from '../types';

export interface VerificationSimulationProgress {
  step: string;
  progress: number;
  currentSource: string;
}

export function simulateVerificationWorkflow(
  bidder: Bidder,
  onProgress?: (p: VerificationSimulationProgress) => void
): Promise<{
  crossVerifications: VerificationField[];
  temporalChecks: TemporalCheck[];
  riskProfile: RiskProfile;
}> {
  return new Promise((resolve) => {
    const steps = [
      { step: 'Ingesting bidder documents & extracting OCR tokens...', progress: 15, currentSource: 'Document AI Gateway' },
      { step: 'Querying MCA21 database for CIN & Annual Financial Filings...', progress: 35, currentSource: 'MCA21 Registry' },
      { step: 'Validating GSTIN, active status & GSTR-3B filing regularity...', progress: 55, currentSource: 'GSTN Live Gateway' },
      { step: 'Cross-verifying MSME status on Udyam Portal...', progress: 70, currentSource: 'Udyam Registry' },
      { step: 'Querying OEM Manufacturer Authorization Gateway & ISO registrars...', progress: 85, currentSource: 'OEM Gateway & ISO' },
      { step: 'Executing Temporal Compliance & Bid-Date Range Analysis...', progress: 95, currentSource: 'Temporal Engine' },
      { step: 'Synthesizing Truth Graph & calculating Explainable Risk Fingerprint...', progress: 100, currentSource: 'e-BID PRAMAAN Engine' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        if (onProgress) onProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        resolve({
          crossVerifications: bidder.crossVerifications,
          temporalChecks: bidder.temporalCompliance,
          riskProfile: bidder.riskProfile
        });
      }
    }, 450);
  });
}

export function calculateLiveRiskScores(crossVerifications: VerificationField[]): {
  complianceScore: number;
  evidenceConfidence: number;
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
} {
  const fails = crossVerifications.filter(c => c.status === 'FAIL').length;
  const conflicts = crossVerifications.filter(c => c.status === 'CONFLICT').length;
  const warnings = crossVerifications.filter(c => c.status === 'WARNING').length;
  const total = crossVerifications.length || 1;

  let complianceScore = 100 - (fails * 20 + conflicts * 12 + warnings * 8);
  if (complianceScore < 0) complianceScore = 15;

  let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (fails > 0 || conflicts >= 2) overallRisk = 'HIGH';
  else if (conflicts === 1 || warnings > 0) overallRisk = 'MEDIUM';

  return {
    complianceScore: Math.max(10, Math.min(100, complianceScore)),
    evidenceConfidence: 88,
    overallRisk
  };
}
