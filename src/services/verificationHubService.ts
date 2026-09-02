import { VerificationField, Bidder } from '../types';
import { verifyGST } from './gstVerificationService';
import { verifyPAN } from './panVerificationService';
import { verifyUdyam } from './udyamVerificationService';
import { verifyMCA } from './mcaVerificationService';
import { verifyEPFO } from './epfoVerificationService';
import { verifyESIC } from './esicVerificationService';
import { verifyOEMAuth } from './oemVerificationService';
import { verifyLocalContent } from './localContentVerificationService';
import { verifyDebarmentStatus } from './debarmentVerificationService';

/**
 * Multi-Source Verification Hub — BidShield AI
 * Central orchestrator connecting modular government/authorized source adapters.
 * Note: Prototype uses simulated verification datasets.
 */

export interface VerificationHubSummary {
  bidderId: string;
  totalChecks: number;
  passedChecks: number;
  conflictChecks: number;
  warningChecks: number;
  failedChecks: number;
  fields: VerificationField[];
}

export async function runMultiSourceVerificationHub(
  bidder: Bidder
): Promise<VerificationHubSummary> {
  // Run all modular adapters in parallel
  const [gstRes, panRes, udyamRes, mcaRes, epfoRes, esicRes, oemRes, miiRes, debRes] = await Promise.all([
    verifyGST(bidder.gstin),
    verifyPAN(bidder.pan),
    verifyUdyam(bidder.udyamNo),
    verifyMCA(bidder.cin),
    verifyEPFO('KNBLR0049128000'),
    verifyESIC('53000491280001001'),
    verifyOEMAuth(bidder.oemAuth.authCode),
    verifyLocalContent(bidder.pan),
    verifyDebarmentStatus(bidder.pan)
  ]);

  const fields = bidder.crossVerifications;
  const passed = fields.filter((f) => f.status === 'PASS').length;
  const conflicts = fields.filter((f) => f.status === 'CONFLICT').length;
  const warnings = fields.filter((f) => f.status === 'WARNING').length;
  const failed = fields.filter((f) => f.status === 'FAIL').length;

  return {
    bidderId: bidder.id,
    totalChecks: fields.length,
    passedChecks: passed,
    conflictChecks: conflicts,
    warningChecks: warnings,
    failedChecks: failed,
    fields
  };
}
