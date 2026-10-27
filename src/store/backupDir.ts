/**
 * A remembered backup folder, via the File System Access API (Chrome, Edge).
 * The directory handle is kept in IndexedDB because localStorage cannot hold
 * handles. Browsers without the API (Firefox, Safari) fall back to downloads.
 */

// The picker and permission methods are not in TypeScript's DOM lib yet.
interface PickerDirHandle extends FileSystemDirectoryHandle {
  queryPermission?(opts: { mode: 'read' | 'readwrite' }): Promise<PermissionState>
  requestPermission?(opts: { mode: 'read' | 'readwrite' }): Promise<PermissionState>
}
declare global {
  interface Window {
    showDirectoryPicker?(opts?: { id?: string; mode?: 'read' | 'readwrite'; startIn?: string }): Promise<FileSystemDirectoryHandle>
  }
}

const DB = 'music-study'
const STORE = 'handles'
const KEY = 'backup-dir'

export function supportsBackupFolder(): boolean {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(key)
    req.onsuccess = () => resolve(req.result as T | undefined)
    req.onerror = () => reject(req.error)
  })
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getBackupDir(): Promise<FileSystemDirectoryHandle | null> {
  try {
    return (await idbGet<FileSystemDirectoryHandle>(KEY)) ?? null
  } catch {
    return null
  }
}

/** Ask the user for a folder and remember it. Returns null if they cancel. */
export async function chooseBackupDir(): Promise<FileSystemDirectoryHandle | null> {
  if (!window.showDirectoryPicker) return null
  try {
    const handle = await window.showDirectoryPicker({ id: 'music-study-backups', mode: 'readwrite', startIn: 'documents' })
    await idbSet(KEY, handle)
    return handle
  } catch {
    return null // cancelled
  }
}

export async function forgetBackupDir(): Promise<void> {
  await idbSet(KEY, null)
}

/**
 * Browsers remember the handle but usually ask again for permission once per
 * session. Must be called from a user gesture (a click) when it has to prompt.
 */
export async function ensurePermission(handle: FileSystemDirectoryHandle, mode: 'read' | 'readwrite'): Promise<boolean> {
  const h = handle as PickerDirHandle
  if (!h.queryPermission || !h.requestPermission) return true
  if ((await h.queryPermission({ mode })) === 'granted') return true
  return (await h.requestPermission({ mode })) === 'granted'
}

export interface BackupFile {
  name: string
  modified: Date
  size: number
}

/** Backup files in the folder, newest first. */
export async function listBackups(handle: FileSystemDirectoryHandle): Promise<BackupFile[]> {
  const out: BackupFile[] = []
  for await (const entry of handle.values()) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.json')) continue
    const f = await (entry as FileSystemFileHandle).getFile()
    out.push({ name: entry.name, modified: new Date(f.lastModified), size: f.size })
  }
  return out.sort((a, b) => b.modified.getTime() - a.modified.getTime())
}

export async function writeBackup(handle: FileSystemDirectoryHandle, name: string, data: unknown): Promise<void> {
  const fh = await handle.getFileHandle(name, { create: true })
  const w = await fh.createWritable()
  await w.write(JSON.stringify(data, null, 2))
  await w.close()
}

export async function readBackup(handle: FileSystemDirectoryHandle, name: string): Promise<string> {
  const fh = await handle.getFileHandle(name)
  return (await fh.getFile()).text()
}
