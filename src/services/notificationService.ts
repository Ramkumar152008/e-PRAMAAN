/**
 * BidShield AI — Notification Service
 * Manages in-app alerts, simulated emails, and clarification notifications
 * between Procurement Officers and Vendors.
 */

import { SystemNotification } from '../types';

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'NOTIF-001',
    recipientRole: 'VENDOR',
    recipientId: 'VEN-PET-001',
    title: 'New Clarification Request',
    message: 'Procurement Officer has requested clarification regarding Financial Turnover for Tender PET/2026/B/00125.',
    type: 'CLARIFICATION_REQUEST',
    referenceId: 'CLAR-2026-001',
    timestamp: '10-Aug-2026 15:30 IST',
    read: false,
    deliveryChannels: ['IN_APP', 'DASHBOARD', 'SIMULATED_EMAIL']
  },
  {
    id: 'NOTIF-002',
    recipientRole: 'OFFICER',
    recipientId: 'PO-1042',
    title: 'High Risk Discrepancies Flagged',
    message: 'ABC Energy Systems Pvt Ltd flagged with turnover deficit (-₹3.3 Cr) and expired PESO safety certificate (-5 days).',
    type: 'VERIFICATION_UPDATE',
    referenceId: 'PET/2026/B/00125',
    timestamp: '10-Aug-2026 14:45 IST',
    read: false,
    deliveryChannels: ['IN_APP', 'DASHBOARD']
  }
];

const NOTIF_STORAGE_KEY = 'bidshield_system_notifications';

export function getStoredNotifications(): SystemNotification[] {
  try {
    const data = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (!data) return INITIAL_NOTIFICATIONS;
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: SystemNotification[]): void {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
}

export function createNotification(
  recipientRole: 'OFFICER' | 'VENDOR',
  recipientId: string,
  title: string,
  message: string,
  type: SystemNotification['type'],
  referenceId: string,
  deliveryChannels: ('IN_APP' | 'DASHBOARD' | 'SIMULATED_EMAIL')[] = ['IN_APP', 'DASHBOARD', 'SIMULATED_EMAIL']
): SystemNotification {
  const newNotif: SystemNotification = {
    id: `NOTIF-${Date.now().toString().slice(-6)}`,
    recipientRole,
    recipientId,
    title,
    message,
    type,
    referenceId,
    timestamp: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    read: false,
    deliveryChannels
  };

  const current = getStoredNotifications();
  const updated = [newNotif, ...current];
  saveNotifications(updated);
  return newNotif;
}
