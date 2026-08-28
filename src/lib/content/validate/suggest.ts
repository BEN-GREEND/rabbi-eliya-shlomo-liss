/**
 * "Did you mean…" support. Most broken references are typos, so pointing at
 * the nearest existing id turns a build failure into a one-second fix.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  let curr = new Array<number>(n + 1)

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]!
}

/** Closest candidate, if it is close enough to be worth suggesting. */
export function nearest(value: string, candidates: readonly string[]): string | undefined {
  let best: string | undefined
  let bestScore = Infinity
  for (const c of candidates) {
    const d = levenshtein(value, c)
    if (d < bestScore) {
      bestScore = d
      best = c
    }
  }
  const threshold = Math.max(2, Math.floor(value.length / 3))
  return best !== undefined && bestScore <= threshold ? best : undefined
}
