/**
 * The storage contract for the visitor count.
 *
 * Two operations, because that is all the feature is: register this browser
 * (idempotent), and count the rows.
 */
export interface VisitorStore {
  readonly name: string
  getCount(): Promise<number>
  /** Insert if absent, do nothing if present. Returns the count either way. */
  register(tokenHash: string): Promise<number>
}
