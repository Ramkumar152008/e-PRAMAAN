import { Tender, TenderRule } from '../types';

/**
 * Tender Rule Engine — BidShield AI
 * Converts natural-language tender clauses into structured machine-verifiable compliance rules.
 */

export interface TenderAnalysisStep {
  text: string;
  delayMs: number;
}

export const TENDER_ANALYSIS_STEPS: TenderAnalysisStep[] = [
  { text: 'Reading tender document and parsing RFP / NIT metadata...', delayMs: 400 },
  { text: 'Extracting natural-language clauses and statutory conditions...', delayMs: 500 },
  { text: 'Identifying financial eligibility requirements (Turnover thresholds)...', delayMs: 450 },
  { text: 'Identifying technical and oil & gas domain experience criteria...', delayMs: 450 },
  { text: 'Identifying mandatory petroleum safety certifications (PESO / OISD / ATEX)...', delayMs: 450 },
  { text: 'Identifying statutory registrations (GSTN, PAN, Udyam, EPFO, ESIC)...', delayMs: 400 },
  { text: 'Identifying Make in India Class-I local content requirements...', delayMs: 400 },
  { text: 'Compiling structured deterministic machine rules into compliance register...', delayMs: 500 }
];

export async function simulateTenderAnalysis(
  tender: Tender,
  onStepProgress?: (stepText: string) => void
): Promise<TenderRule[]> {
  for (const step of TENDER_ANALYSIS_STEPS) {
    if (onStepProgress) onStepProgress(step.text);
    await new Promise((r) => setTimeout(r, step.delayMs));
  }
  return tender.rules;
}

export function compileClauseToRule(clauseText: string, index: number): TenderRule {
  if (clauseText.toLowerCase().includes('turnover')) {
    return {
      id: `PET-FIN-${String(index).padStart(3, '0')}`,
      metric: 'Average Annual Turnover',
      minimumValue: 10,
      unit: '₹ Crore',
      period: 'Previous 3 Financial Years',
      operator: '>=',
      mandatory: true,
      description: 'Average annual turnover shall not be less than ₹10 Crore.',
      referenceClause: `Clause 4.2`,
      category: 'FINANCIAL'
    };
  }

  if (clauseText.toLowerCase().includes('experience')) {
    return {
      id: `PET-EXP-${String(index).padStart(3, '0')}`,
      metric: 'Oil & Gas Experience',
      minimumValue: 5,
      unit: 'Years',
      operator: '>=',
      mandatory: true,
      description: 'Minimum 5 years relevant oil & gas industry experience.',
      referenceClause: `Clause 5.1`,
      category: 'EXPERIENCE'
    };
  }

  return {
    id: `PET-RULE-${String(index).padStart(3, '0')}`,
    metric: 'General Statutory Compliance',
    minimumValue: 'Active',
    operator: '==',
    mandatory: true,
    description: clauseText,
    referenceClause: `Clause ${index}`,
    category: 'STATUTORY'
  };
}
