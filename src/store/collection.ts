import { useCallback, useEffect, useState } from 'react'

/**
 * Generic persisted collections for the user's own data (sketches, notes, practice
 * entries, drill stats). Everything lives under one localStorage prefix so it can
 * be exported and imported as a single JSON file. Reference content never lives here.
 */
export const PREFIX = 'music-study:'

export interface Entity {
  id: string
  createdAt: string
  updatedAt: string
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function readCollection<T>(name: string): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + name)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

export function writeCollection<T>(name: string, items: T[]) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(items))
  } catch {
    /* storage unavailable; the app still works for the session */
  }
}

/** React hook over a persisted list. */
export function useCollection<T extends Entity>(name: string) {
  const [items, setItems] = useState<T[]>(() => readCollection<T>(name))
  useEffect(() => writeCollection(name, items), [name, items])

  const add = useCallback((data: Omit<T, keyof Entity>): T => {
    const t = nowIso()
    const item = { ...data, id: newId(), createdAt: t, updatedAt: t } as T
    setItems((xs) => [item, ...xs])
    return item
  }, [])

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: nowIso() } : x)))
  }, [])

  const remove = useCallback((id: string) => setItems((xs) => xs.filter((x) => x.id !== id)), [])

  const replaceAll = useCallback((next: T[]) => setItems(next), [])

  return { items, add, update, remove, replaceAll }
}

/** Every key under the prefix, for backup. */
export function exportAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIX)) {
      try {
        out[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k) ?? 'null')
      } catch {
        /* skip */
      }
    }
  }
  return out
}

/** Restore a backup. Replaces collections present in the file; leaves others alone. */
export function importAll(data: Record<string, unknown>) {
  for (const [k, v] of Object.entries(data)) localStorage.setItem(PREFIX + k, JSON.stringify(v))
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
