/**
 * e-BID PRAMAAN — Clarification Integration Service & Adapter
 * 
 * Demonstrates how e-BID PRAMAAN interfaces with the Departmental / GeM
 * Seller Clarification Channel for CPCL / MoPNG tenders.
 */

import { logCustomAuditEvent } from './auditTrailService';
import { createNotification } from './notificationService';

export interface GeMIntegrationStatus {
  mode: 'REFERENCE / ADAPTER';
  sellerChannel: 'Departmental Clarification Channel';
  authMode: 'Role-Based Authentication';
  messageDelivery: 'Local Event Dispatcher';
  externalApi: 'Reference Dataset Adapter';
  productionStatus: 'Departmental Procurement Access';
  lastEventTimestamp: string;
}

export interface GeMTimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  actor: 'OFFICER' | 'VENDOR' | 'EBID_PRAMAAN' | 'CHANNEL_ADAPTER';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface GeMClarificationMessage {
  clarificationId: string;
  evaluationId: string;
  tenderId: string;
  tenderTitle: string;
  bidderId: string;
  bidderName: string;
  issueCategory: string;
  officerId: string;
  officerQuery: string;
  bidderClaim: string;
  referenceEvidence: string;
  responseDeadline: string;
  sentAt: string;
  status: 'DRAFT' | 'APPROVED' | 'SENT_DEMO' | 'VENDOR_VIEWED' | 'RESPONSE_RECEIVED' | 'RE_VERIFYING' | 'RESOLVED' | 'UNRESOLVED';
  timeline: GeMTimelineEvent[];
}

export interface GeMVendorResponsePayload {
  clarificationId: string;
  vendorId: string;
  vendorName: string;
  explanation: string;
  uploadedDocuments: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    checksum: string;
    uploadedAt: string;
  }>;
  submittedAt: string;
}

export interface IGeMIntegrationAdapter {
  sendClarificationNotice(message: GeMClarificationMessage): Promise<{ success: boolean; eventId: string; timestamp: string }>;
  markClarificationViewedByVendor(clarificationId: string): void;
  submitVendorClarificationResponse(payload: GeMVendorResponsePayload): Promise<{ success: boolean; reVerificationId: string }>;
  getIntegrationStatus(): GeMIntegrationStatus;
  getClarificationTimeline(clarificationId: string): GeMTimelineEvent[];
}

class DepartmentalIntegrationAdapter implements IGeMIntegrationAdapter {
  private status: GeMIntegrationStatus = {
    mode: 'REFERENCE / ADAPTER',
    sellerChannel: 'Departmental Clarification Channel',
    authMode: 'Role-Based Authentication',
    messageDelivery: 'Local Event Dispatcher',
    externalApi: 'Reference Dataset Adapter',
    productionStatus: 'Departmental Procurement Access',
    lastEventTimestamp: '02-Sep-2026 11:35 IST'
  };

  private defaultTimeline: GeMTimelineEvent[] = [
    {
      id: 'EVT-01',
      time: '02-Sep 11:30',
      title: 'Clarification Drafted by Officer',
      description: 'Senior Procurement Officer PO-1042 prepared clarification for OEM Authorization Scope (Tender C03H240087).',
      actor: 'OFFICER',
      status: 'COMPLETED'
    },
    {
      id: 'EVT-02',
      time: '02-Sep 11:35',
      title: 'Clarification Dispatched to Bidder',
      description: 'Notice dispatched to Atlas Copco (India) Private Limited with shared OEM certificate excerpt.',
      actor: 'CHANNEL_ADAPTER',
      status: 'COMPLETED'
    },
    {
      id: 'EVT-03',
      time: '02-Sep 14:10',
      title: 'Bidder Accessed Notice',
      description: 'Bidder accessed Clarification Notice CLAR-2026-001 in Vendor Compliance Workspace.',
      actor: 'VENDOR',
      status: 'COMPLETED'
    },
    {
      id: 'EVT-04',
      time: '03-Sep 14:15',
      title: 'Bidder Submitted Response & Board Resolution',
      description: 'Bidder uploaded Board Resolution & Global Parent Undertaking from Atlas Copco Airpower n.v., Belgium.',
      actor: 'VENDOR',
      status: 'COMPLETED'
    },
    {
      id: 'EVT-05',
      time: '03-Sep 14:16',
      title: 'e-BID PRAMAAN Re-Verification Executed',
      description: 'Corporate relationship and back-to-back warranty backing verified. 100% compliant with Tender Specification MS-RAD-6IN-1F3.',
      actor: 'EBID_PRAMAAN',
      status: 'COMPLETED'
    }
  ];

  public getIntegrationStatus(): GeMIntegrationStatus {
    return { ...this.status };
  }

  public getClarificationTimeline(clarificationId: string): GeMTimelineEvent[] {
    return [...this.defaultTimeline];
  }

  public async sendClarificationNotice(message: GeMClarificationMessage): Promise<{ success: boolean; eventId: string; timestamp: string }> {
    const timestamp = '02-Sep-2026 11:35 IST';
    this.status.lastEventTimestamp = timestamp;

    // Record in Audit Trail
    logCustomAuditEvent(
      'PO-1042',
      message.tenderId,
      message.bidderName,
      'Procurement Officer',
      `CLARIFICATION_NOTICE_SENT: ${message.clarificationId}`,
      'NOTICE_DISPATCHED',
      `Clarification notice dispatched regarding ${message.issueCategory}. Response due by ${message.responseDeadline}.`,
      message.clarificationId,
      'DELIVERED'
    );

    // Create Notification for Vendor
    createNotification(
      'VENDOR',
      message.bidderId || 'BID-ATC-001',
      `New Clarification Notice for Tender ${message.tenderId}`,
      `Procurement Officer has requested clarification regarding ${message.issueCategory}. Response due by ${message.responseDeadline}.`,
      'CLARIFICATION_REQUEST',
      message.clarificationId
    );

    return {
      success: true,
      eventId: `EVT-${Date.now().toString().slice(-6)}`,
      timestamp
    };
  }

  public markClarificationViewedByVendor(clarificationId: string): void {
    const timestamp = '02-Sep-2026 14:10 IST';
    this.status.lastEventTimestamp = timestamp;

    logCustomAuditEvent(
      'BID-ATC-001',
      'C03H240087',
      'Atlas Copco (India) Private Limited',
      'Registered Bidder',
      `CLARIFICATION_VIEWED_BY_BIDDER: ${clarificationId}`,
      'ACCESSED',
      'Bidder viewed clarification notice in Vendor Compliance Workspace.',
      clarificationId,
      'ACKNOWLEDGED'
    );
  }

  public async submitVendorClarificationResponse(payload: GeMVendorResponsePayload): Promise<{ success: boolean; reVerificationId: string }> {
    const timestamp = '03-Sep-2026 14:15 IST';
    this.status.lastEventTimestamp = timestamp;

    // Log Response Submission
    logCustomAuditEvent(
      payload.vendorId || 'BID-ATC-001',
      'C03H240087',
      payload.vendorName || 'Atlas Copco (India) Private Limited',
      'Registered Bidder',
      `CLARIFICATION_RESPONSE_SUBMITTED: ${payload.clarificationId}`,
      'RESPONSE_RECORDED',
      `Bidder submitted explanatory statement and attached ${payload.uploadedDocuments.length} document(s).`,
      payload.clarificationId,
      'SUCCESS'
    );

    // Create Notification for Procurement Officer
    createNotification(
      'OFFICER',
      'PO-1042',
      `Bidder Response Received: ${payload.clarificationId}`,
      `Atlas Copco (India) Private Limited has submitted clarification explanation and ${payload.uploadedDocuments.length} supporting document(s).`,
      'CLARIFICATION_RESPONSE',
      payload.clarificationId
    );

    return {
      success: true,
      reVerificationId: `REVERIFY-2026-${Date.now().toString().slice(-4)}`
    };
  }
}

export const gemIntegrationService: IGeMIntegrationAdapter = new DepartmentalIntegrationAdapter();
