'use client'

import { useCallback, useState } from 'react'
import { MemorialCandle } from './MemorialCandle'
import { Lighters } from './Lighters'

/**
 * The candle and the names, joined.
 *
 * The only reason these two share a parent: when a visitor lights a candle
 * *and* consents to be named, the list below should already have their name in
 * it. A counter that the client bumps is the whole of that coupling — the list
 * refetches rather than being handed a row, so what appears is what the server
 * actually stored.
 */
export function MemorialSection() {
  const [reloadKey, setReloadKey] = useState(0)
  const onPublished = useCallback(() => setReloadKey((n) => n + 1), [])

  return (
    <>
      <MemorialCandle onPublished={onPublished} />
      <Lighters reloadKey={reloadKey} />
    </>
  )
}
