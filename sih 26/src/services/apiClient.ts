/**
 * e-BID PRAMAAN — Unified Backend REST API Client
 * Organization: Chennai Petroleum Corporation Limited (CPCL)
 * 
 * Communicates with FastAPI backend configured at VITE_API_BASE_URL.
 * Seamlessly provides fallback to local verified logic if offline or if backend is unreachable.
 */

const host = import.meta.env.VITE_API_HOST;
let fallbackUrl = 'http://localhost:8000/api';
if (host) {
  fallbackUrl = host.startsWith('http') ? `${host}/api` : `https://${host}/api`;
}
const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || fallbackUrl).trim();
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');


export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isOnline: boolean;
}

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout for quick fallback

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { data: null, error: `HTTP ${response.status}: ${response.statusText}`, isOnline: false };
    }

    const data = await response.json();
    return { data, error: null, isOnline: true };
  } catch (err: any) {
    return { data: null, error: err.message || 'API connection unavailable', isOnline: false };
  }
}

export const ApiClient = {
  // Health
  checkHealth: async () => fetchFromApi<{ status: string; platform: string }>('/health'),
  getKpis: async () => fetchFromApi<any>('/kpis'),

  // Tenders
  getTenders: async () => fetchFromApi<any[]>('/tenders'),
  getTenderById: async (id: string) => fetchFromApi<any>(`/tenders/${id}`),
  getTenderRequirements: async (id: string) => fetchFromApi<any[]>(`/tenders/${id}/requirements`),
  getTenderBids: async (id: string) => fetchFromApi<any[]>(`/tenders/${id}/bids`),

  // Bidders
  getBidderById: async (id: string) => fetchFromApi<any>(`/bidders/${id}`),

  // Evidence & Compliance
  getBidderEvidence: async (bidderId: string) => fetchFromApi<any[]>(`/evidence/${bidderId}`),
  analyzeCompliance: async (tenderId: string, bidderId: string) => fetchFromApi<any>('/compliance/analyze', {
    method: 'POST',
    body: JSON.stringify({ tenderId, bidderId })
  }),
  verifyReferenceSources: async (bidderId: string) => fetchFromApi<any>('/reference/verify', {
    method: 'POST',
    body: JSON.stringify({ bidderId })
  }),

  // Matching & Temporal
  compareMatching: async (type: string, claimedValue: string, referenceValue: string) => fetchFromApi<any>('/matching/compare', {
    method: 'POST',
    body: JSON.stringify({ type, claimedValue, referenceValue })
  }),
  validateTemporal: async (documentName: string, validUntil: string, bidCutoffDate: string) => fetchFromApi<any>('/temporal/validate', {
    method: 'POST',
    body: JSON.stringify({ documentName, validUntil, bidCutoffDate })
  }),

  // Clarifications
  getClarifications: async () => fetchFromApi<any[]>('/clarifications'),
  sendClarification: async (clarificationData: any) => fetchFromApi<any>('/clarifications', {
    method: 'POST',
    body: JSON.stringify(clarificationData)
  }),
  submitVendorResponse: async (clarificationId: string, explanation: string, documents: any[]) => fetchFromApi<any>('/vendor-responses', {
    method: 'POST',
    body: JSON.stringify({ clarificationId, explanation, documents })
  }),
  reverifyClarification: async (clarificationId: string) => fetchFromApi<any>('/reverification', {
    method: 'POST',
    body: JSON.stringify({ clarificationId })
  }),

  // Decisions & Audit
  recordOfficerDecision: async (decisionData: any) => fetchFromApi<any>('/decisions', {
    method: 'POST',
    body: JSON.stringify(decisionData)
  }),
  getAuditTrail: async (tenderId?: string) => fetchFromApi<any[]>(`/audit${tenderId ? `?tenderId=${tenderId}` : ''}`),
  getReport: async (bidderId: string) => fetchFromApi<any>(`/reports/${bidderId}`),

  // RAG & Knowledge Base
  queryRag: async (query: string, tenderId?: string) => fetchFromApi<any>('/rag/query', {
    method: 'POST',
    body: JSON.stringify({ query, tenderId })
  }),
  explainFindingRag: async (findingId: string, tenderId?: string) => fetchFromApi<any>('/rag/explain-finding', {
    method: 'POST',
    body: JSON.stringify({ findingId, tenderId })
  }),

  // Controlled Investigation Assistant
  queryAssistant: async (question: string, tenderId: string, bidderId: string) => fetchFromApi<any>('/assistant/query', {
    method: 'POST',
    body: JSON.stringify({ question, tenderId, bidderId })
  }),
  executeAssistantTool: async (toolName: string, params: any = {}, tenderId?: string, bidderId?: string) => fetchFromApi<any>('/assistant/execute-tool', {
    method: 'POST',
    body: JSON.stringify({ toolName, params, tenderId, bidderId })
  }),

  // Bidder Compliance Passport
  getBidderPassport: async (bidderId: string, tenderId?: string) => fetchFromApi<any>(`/bidders/${bidderId}/passport${tenderId ? `?tenderId=${tenderId}` : ''}`),

  // n8n Workflow Automation
  getN8nStatus: async () => fetchFromApi<any>('/n8n/status'),
  triggerN8nClarification: async (clarificationId: string) => fetchFromApi<any>('/n8n/trigger/clarification', {
    method: 'POST',
    body: JSON.stringify({ clarificationId })
  }),
  triggerN8nEscalation: async (clarificationId: string) => fetchFromApi<any>('/n8n/trigger/escalation', {
    method: 'POST',
    body: JSON.stringify({ clarificationId })
  })
};

