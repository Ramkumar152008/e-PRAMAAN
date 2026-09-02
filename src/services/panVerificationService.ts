import { SIMULATED_PAN_DATABASE, SimulatedPANRecord } from '../data/simulatedRegistries';

/**
 * PAN / Income Tax Verification Service Adapter — BidShield AI
 * Current: Simulated dataset. Future: Authorized Income Tax e-Filing API / NSDL.
 */
export async function verifyPAN(pan: string): Promise<{
  success: boolean;
  record?: SimulatedPANRecord;
  status: 'PASS' | 'FAIL';
  details: string;
}> {
  await new Promise((r) => setTimeout(r, 150));
  const record = SIMULATED_PAN_DATABASE[pan];
  if (record && record.status === 'ACTIVE_AND_ALLOTTED') {
    return {
      success: true,
      record,
      status: 'PASS',
      details: `PAN is Active and Allotted to ${record.entityName}. ITR filed for last 3 years.`
    };
  }
  return {
    success: false,
    status: 'FAIL',
    details: 'PAN could not be verified against Income Tax database.'
  };
}
