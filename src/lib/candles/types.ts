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
  /** The name as it was stored, after cleaning. Null when none was given. */
  displayName: string | null
  /**
   * Whether that name will appear publicly.
   *
   * The server decides this, not the browser: a request may ask to publish a
   * name it did not send, and the answer to that is always false.
   */
  publishName: boolean
}

/** One name in the public list. Nothing else about the row is exposed. */
export interface Lighter {
  /** A stable key for rendering. Never the row's own id or token hash. */
  key: string
  name: string
  /** ISO timestamp of when the candle was lit. */
  litAt: string
}

export interface LighterPage {
  lighters: Lighter[]
  /** Whether another page exists after this one. */
  hasMore: boolean
}

/**
 * The storage contract.
 *
 * Everything the site does with candles goes through these four operations.
 * Moving off Supabase means writing one more file that satisfies this
 * interface — no page, component or route changes.
 */
export interface CandleStore {
  readonly name: string
  getCount(): Promise<number>
  getStatus(tokenHash: string): Promise<CandleStatus>
  /**
   * `publishName` is only ever honoured together with a name. A store must
   * never persist true against a null name — the constraint is enforced in the
   * database too, so neither layer can be the only thing standing between a
   * visitor and an unwanted publication.
   */
  lightCandle(
    tokenHash: string,
    displayName: string | null,
    publishName: boolean,
  ): Promise<LightResult>
  /** The published names, newest first. */
  listLighters(limit: number, offset: number): Promise<LighterPage>
}
