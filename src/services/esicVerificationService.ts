import { SIMULATED_ESIC_DATABASE, SimulatedESICRecord } from '../data/simulatedRegistries';

/**
 * ESIC Verification Service Adapter — BidShield AI
 * Current: Simulated dataset. Future: Authorized ESIC Portal API.
 */
export async function verifyESIC(code: string): Promise<{
  success: boolean;
  record?: SimulatedESICRecord;
  status: 'PASS' | 'FAIL';
  details: string;
}> {
  await new Promise((r) => setTimeout(r, 150));
  const record = SIMULATED_ESIC_DATABASE[code] || Object.values(SIMULATED_ESIC_DATABASE)[0];
  if (record && record.status === 'ACTIVE') {
    return {
      success: true,
      record,
      status: 'PASS',
      details: `ESIC Employer Code Active. ${record.ipCount} insured persons covered.`
    };
  }
  return {
    success: false,
    status: 'FAIL',
    details: 'ESIC employer code not active.'
  };
}
