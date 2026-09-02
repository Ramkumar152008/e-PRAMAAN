import { TemporalCheck, CertificateDetail } from '../types';

/**
 * Temporal Validation Service — BidShield AI
 * Evaluates certificate and authorization validity horizons against the mandatory Bid Submission Date.
 */

export function validateTemporalHorizon(
  cert: CertificateDetail,
  bidSubmissionDate: string = '2026-08-10'
): TemporalCheck {
  const expiry = new Date(cert.expiryDate);
  const bidDate = new Date(bidSubmissionDate);
  const diffTime = expiry.getTime() - bidDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      id: `TC-${cert.id}`,
      documentName: cert.name,
      certificateNumber: cert.certNumber,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      bidDate: bidSubmissionDate,
      status: 'EXPIRED_BEFORE_BID',
      daysDifference: diffDays,
      remarks: `Expired on ${cert.expiryDate}, ${Math.abs(diffDays)} days before the mandatory bid submission deadline (${bidSubmissionDate}).`,
      confidence: 98
    };
  }

  if (diffDays <= 30) {
    return {
      id: `TC-${cert.id}`,
      documentName: cert.name,
      certificateNumber: cert.certNumber,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      bidDate: bidSubmissionDate,
      status: 'EXPIRING_SOON',
      daysDifference: diffDays,
      remarks: `Active on bid date, but expiring within ${diffDays} days during anticipated tender evaluation window.`,
      confidence: 94
    };
  }

  return {
    id: `TC-${cert.id}`,
    documentName: cert.name,
    certificateNumber: cert.certNumber,
    issueDate: cert.issueDate,
    expiryDate: cert.expiryDate,
    bidDate: bidSubmissionDate,
    status: 'VALID',
    daysDifference: diffDays,
    remarks: `Legally active and valid on bid submission date (+${diffDays} days remaining).`,
    confidence: 99
  };
}
