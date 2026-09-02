import { SIMULATED_LOCAL_CONTENT_DATABASE, SimulatedLocalContentRecord } from '../data/simulatedRegistries';

/**
 * Local Content / Make in India Verification Service Adapter — BidShield AI
 * Reconciles domestic value addition against DPIIT / MoPNG Make-in-India guidelines.
 * Current: Simulated dataset. Future: Authorized DPIIT MII Portal API.
 */
export async function verifyLocalContent(entityPan: string): Promise<{
  success: boolean;
  record?: SimulatedLocalContentRecord;
  status: 'PASS' | 'FAIL';
  details: string;
}> {
  await new Promise((r) => setTimeout(r, 100));
  const record = SIMULATED_LOCAL_CONTENT_DATABASE[entityPan] || Object.values(SIMULATED_LOCAL_CONTENT_DATABASE)[0];
  if (record && record.verifiedLocalContentPercentage >= 50.0) {
    return {
      success: true,
      record,
      status: 'PASS',
      details: `Class-I Local Supplier (Verified Local Content: ${record.verifiedLocalContentPercentage}% >= 50.0% mandatory threshold).`
    };
  }
  return {
    success: false,
    status: 'FAIL',
    details: 'Local content percentage does not meet minimum Class-I requirement.'
  };
}
