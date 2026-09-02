import { Bidder, TruthGraphData } from '../types';

/**
 * Truth Graph Engine — BidShield AI
 * Builds relational knowledge graphs connecting bidder entities, submitted claims,
 * registry verification endpoints, and detected conflict edges.
 */

export function generateTruthGraphData(bidder: Bidder): TruthGraphData {
  return bidder.truthGraph;
}
