import { Tender, Bidder, OfficerDecision } from '../types';

/**
 * Report Generator Service — BidShield AI
 * Generates the "GeM Bid Compliance & Forensic Evaluation Report".
 * 
 * Statutory Principle:
 * "AI-generated findings are advisory. Final procurement decision rests with the authorized Procurement Officer."
 */

export interface ForensicReportPayload {
  reportTitle: string;
  reportId: string;
  generatedAt: string;
  officerId: string;
  department: string;
  tender: Tender;
  bidder: Bidder;
  decision?: OfficerDecision;
  disclaimer: string;
}

export function generateForensicReportPayload(
  tender: Tender,
  bidder: Bidder,
  decision?: OfficerDecision
): ForensicReportPayload {
  return {
    reportTitle: 'GeM Bid Compliance & Forensic Evaluation Report',
    reportId: `REP-${tender.gemBidNo.replace(/[^a-zA-Z0-9]/g, '-')}-${bidder.id}`,
    generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    officerId: 'PO-1042',
    department: 'Ministry of Petroleum & Natural Gas',
    tender,
    bidder,
    decision,
    disclaimer: 'AI-generated findings are advisory. Final procurement decision rests with the authorized Procurement Officer. Prototype Demonstration — Government API integrations are simulated.'
  };
}

export function printReport(): void {
  window.print();
}
