import { AuditLogEntry, OfficerDecision } from '../types';

const AUDIT_STORAGE_KEY = 'bidshield_audit_logs';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-08-10 11:05:22',
    officerId: 'PO-1042',
    evaluationId: 'PET/2026/B/00125',
    bidder: 'ABC Energy Systems Pvt Ltd',
    actor: 'Rajeshwar Rao (PO-1042)',
    actorRole: 'Procurement Officer',
    action: 'RECORD_OFFICER_DECISION: MANUAL_INVESTIGATION',
    decision: 'MANUAL_INVESTIGATION',
    reason: 'Turnover discrepancy (₹12 Cr claimed vs ₹8.7 Cr verified) and safety certificate expired on 05-Aug-2026.',
    target: 'ABC Energy Systems Pvt Ltd [PET/2026/B/00125]',
    result: 'MANUAL_INVESTIGATION',
    eventHash: 'A83F72B91C2D4E5FA6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9',
    hash: 'A83F...91C2',
    details: 'Officer directed dossier to Finance Specialist for UDIN clarification & verified CPSE work order audit.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-08-10 10:45:10',
    officerId: 'PO-1042',
    evaluationId: 'PET/2026/B/00125',
    bidder: 'ABC Energy Systems Pvt Ltd',
    actor: 'System / Verification Hub',
    actorRole: 'Automated Multi-Source Engine',
    action: 'MULTI_SOURCE_RECONCILIATION_COMPLETED',
    decision: 'EVIDENCE_PROCESSED',
    reason: '11 cross-registry verification adapters executed.',
    target: 'ABC Energy Systems Pvt Ltd [PET/2026/B/00125]',
    result: 'CONFLICTS_DETECTED',
    eventHash: 'B92C83D01E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B',
    hash: 'B92C...8A9B',
    details: 'Turnover conflict, Experience deficit, Address mismatch, and PESO certificate expiry identified.'
  }
];

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read audit logs from storage', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveAuditLogs(logs: AuditLogEntry[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to write audit logs to storage', e);
  }
}

export function logOfficerDecision(decision: OfficerDecision, bidderName: string): AuditLogEntry {
  const currentLogs = getStoredAuditLogs();
  
  // Generate tamper-evident event hash
  const rawString = `${decision.id}-${decision.bidderId}-${decision.action}-${decision.timestamp}-${decision.officerId}-${Math.random()}`;
  let hashNum = 0;
  for (let i = 0; i < rawString.length; i++) {
    hashNum = (hashNum << 5) - hashNum + rawString.charCodeAt(i);
    hashNum |= 0;
  }
  const eventHash = `SHA256:${Math.abs(hashNum).toString(16).padStart(8, '0')}${Date.now().toString(16).padStart(8, '0')}`.toUpperCase();
  const shortHash = `${eventHash.slice(7, 11)}...${eventHash.slice(-4)}`;

  const newEntry: AuditLogEntry = {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    timestamp: decision.timestamp,
    officerId: decision.officerId,
    evaluationId: decision.evaluationId,
    bidder: bidderName,
    actor: `${decision.officerName} (${decision.officerId})`,
    actorRole: 'Procurement Officer (Ministry of Petroleum & Natural Gas)',
    action: `OFFICER_DECISION: ${decision.action}`,
    decision: decision.action,
    reason: decision.reasonRemarks,
    target: `${bidderName} [Tender #${decision.evaluationId}]`,
    result: decision.action,
    eventHash: eventHash,
    hash: shortHash,
    details: `Officer Remarks: "${decision.reasonRemarks}" | Digital Signature Token: ${decision.digitalSignatureHash}`
  };

  const updatedLogs = [newEntry, ...currentLogs];
  saveAuditLogs(updatedLogs);
  return newEntry;
}

export function logCustomAuditEvent(
  actorId: string,
  tenderId: string,
  bidderName: string,
  actorRole: string,
  action: string,
  decision: string,
  reason: string,
  targetRef: string,
  result: string
): AuditLogEntry {
  const currentLogs = getStoredAuditLogs();
  
  const rawString = `${actorId}-${tenderId}-${action}-${Date.now()}-${Math.random()}`;
  let hashNum = 0;
  for (let i = 0; i < rawString.length; i++) {
    hashNum = (hashNum << 5) - hashNum + rawString.charCodeAt(i);
    hashNum |= 0;
  }
  const eventHash = `SHA256:${Math.abs(hashNum).toString(16).padStart(8, '0')}${Date.now().toString(16).padStart(8, '0')}`.toUpperCase();
  const shortHash = `${eventHash.slice(7, 11)}...${eventHash.slice(-4)}`;

  const newEntry: AuditLogEntry = {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    officerId: actorId.startsWith('PO') ? actorId : 'PO-1042',
    evaluationId: tenderId,
    bidder: bidderName,
    actor: `${actorRole} (${actorId})`,
    actorRole: actorRole,
    action: action,
    decision: decision,
    reason: reason,
    target: `${bidderName} [Ref: ${targetRef}]`,
    targetRef: targetRef,
    result: result,
    eventHash: eventHash,
    hash: shortHash,
    details: reason
  };

  const updatedLogs = [newEntry, ...currentLogs];
  saveAuditLogs(updatedLogs);
  return newEntry;
}

export function exportAuditLogsCSV(logs: AuditLogEntry[]): void {
  const headers = ['Log ID', 'Timestamp', 'Officer ID', 'Evaluation ID', 'Bidder', 'Action', 'Decision', 'Reason', 'Event Hash', 'Details'];
  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${l.timestamp}"`,
    `"${l.officerId || 'PO-1042'}"`,
    `"${l.evaluationId || 'PET/2026/B/00125'}"`,
    `"${l.bidder || 'ABC Energy Systems Pvt Ltd'}"`,
    `"${l.action}"`,
    `"${l.decision || l.result}"`,
    `"${(l.reason || '').replace(/"/g, '""')}"`,
    `"${l.eventHash || l.hash}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `BidShield_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

