/** What the site knows about the candles, and about this visitor. */
export interface CandleStatus {
  /** Total candles lit, ever. */
  count: number
  /** Whether this visitor lit one inside the cooldown window. */
  hasLitRecently: boolean
  /** When they may light another, if they have lit one. ISO string. */
  nextAllowedAt: string | null
}

export interface LightResult extends CandleStatus {
  /** False when the cooldown blocked it — not an error, just nothing added. */
  accepted: boolean
}

/**
 * The storage contract.
 *
 * Everything the site does with candles goes through these three operations.
 * Moving off Supabase means writing one more file that satisfies this
 * interface — no page, component or route changes.
 */
export interface CandleStore {
  readonly name: string
  getCount(): Promise<number>
  getStatus(tokenHash: string): Promise<CandleStatus>
  lightCandle(tokenHash: string, displayName: string | null): Promise<LightResult>
}
