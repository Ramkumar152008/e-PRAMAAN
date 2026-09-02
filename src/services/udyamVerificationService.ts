import { SIMULATED_UDYAM_DATABASE, SimulatedUdyamRecord } from '../data/simulatedRegistries';

/**
 * Udyam / MSME Verification Service Adapter — BidShield AI
 * Current: Simulated dataset. Future: Authorized MSME / Udyam API.
 */
export async function verifyUdyam(udyamNo: string): Promise<{
  success: boolean;
  record?: SimulatedUdyamRecord;
  status: 'PASS' | 'FAIL';
  details: string;
}> {
  await new Promise((r) => setTimeout(r, 150));
  const record = SIMULATED_UDYAM_DATABASE[udyamNo];
  if (record && record.status === 'ACTIVE') {
    return {
      success: true,
      record,
      status: 'PASS',
      details: `Udyam Registration is Active. Enterprise Category: ${record.enterpriseType} (${record.majorActivity}).`
    };
  }
  return {
    success: false,
    status: 'FAIL',
    details: 'Udyam registration number could not be validated.'
  };
}
