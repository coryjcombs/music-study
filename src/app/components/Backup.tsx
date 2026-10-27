import { useEffect, useRef, useState } from 'react'
import { downloadJson, exportAll, importAll } from '../../store/collection'
import {
  chooseBackupDir, ensurePermission, forgetBackupDir, getBackupDir, listBackups, readBackup,
  supportsBackupFolder, writeBackup, type BackupFile,
} from '../../store/backupDir'

/**
 * Export and import of everything the user has saved (settings, sketches, notes,
 * practice log, drill stats). With a chosen backup folder (Chrome, Edge) backups
 * are written straight into it and Restore lists what is there; otherwise
 * Backup downloads a file and Restore opens a file picker.
 */
export function Backup() {
  const fileRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const [dir, setDir] = useState<FileSystemDirectoryHandle | null>(null)
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<BackupFile[] | null>(null)
  const [status, setStatus] = useState('')
  const canFolder = supportsBackupFolder()

  useEffect(() => { void getBackupDir().then(setDir) }, [])

  // Close the panel on an outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const say = (msg: string) => {
    setStatus(msg)
    window.setTimeout(() => setStatus((s) => (s === msg ? '' : s)), 6000)
  }

  const backupName = () => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `music-study-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`
  }

  const doBackup = async () => {
    const name = backupName()
    const data = exportAll()
    if (dir) {
      try {
        if (await ensurePermission(dir, 'readwrite')) {
          await writeBackup(dir, name, data)
          say(`Saved ${name} in ${dir.name}`)
          if (open) await refresh(dir)
          return
        }
        say('Folder access was not granted; downloading instead')
      } catch {
        say('Could not write to the folder; downloading instead')
      }
    }
    downloadJson(name, data)
  }

  const refresh = async (handle: FileSystemDirectoryHandle) => {
    try {
      if (!(await ensurePermission(handle, 'read'))) { setFiles(null); return }
      setFiles(await listBackups(handle))
    } catch {
      setFiles(null)
    }
  }

  const openPanel = async () => {
    setOpen((o) => !o)
    if (!open && dir) await refresh(dir)
  }

  const restoreText = (text: string, label: string) => {
    try {
      const data = JSON.parse(text)
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('not an object')
      if (!confirm(`Restore ${label}? Collections in the file replace the ones in this browser.`)) return
      importAll(data as Record<string, unknown>)
      location.reload()
    } catch {
      alert('That file is not a Music Study backup.')
    }
  }

  const restoreFromFolder = async (name: string) => {
    if (!dir) return
    try {
      restoreText(await readBackup(dir, name), name)
    } catch {
      alert(`Could not read ${name}.`)
    }
  }

  const restoreFromFile = async (file: File) => restoreText(await file.text(), file.name)

  const pickFolder = async () => {
    const handle = await chooseBackupDir()
    if (!handle) return
    setDir(handle)
    await refresh(handle)
  }

  const forget = async () => {
    await forgetBackupDir()
    setDir(null)
    setFiles(null)
  }

  const fmtSize = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`)
  const fmtDate = (d: Date) => d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <span className="backup" ref={wrapRef}>
      <button className="small" onClick={() => void doBackup()} title={dir ? `Save a backup into ${dir.name}` : 'Download everything you have saved as a JSON file'}>Backup</button>
      <button className="small" onClick={() => void openPanel()} title="Restore from a backup">Restore ▾</button>
      {status && <span className="backup-status">{status}</span>}
      <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) void restoreFromFile(f); e.target.value = '' }} />

      {open && (
        <div className="backup-panel">
          <div className="backup-folder">
            {dir ? (
              <>
                <span>Backup folder: <b>{dir.name}</b></span>
                <button className="small" onClick={() => void pickFolder()}>Change</button>
                <button className="small" onClick={() => void forget()}>Forget</button>
              </>
            ) : canFolder ? (
              <>
                <span className="muted">No backup folder chosen. Backups download instead.</span>
                <button className="small" onClick={() => void pickFolder()}>Choose folder…</button>
              </>
            ) : (
              <span className="muted">This browser cannot write to a folder; backups download and restore from a picked file.</span>
            )}
          </div>

          {dir && (
            files === null ? (
              <p className="muted">Folder access was not granted. <button className="small" onClick={() => void refresh(dir)}>Try again</button></p>
            ) : files.length === 0 ? (
              <p className="muted">No backups in this folder yet.</p>
            ) : (
              <ul className="backup-list">
                {files.map((f) => (
                  <li key={f.name}>
                    <span className="backup-name">{f.name}</span>
                    <span className="muted">{fmtDate(f.modified)} · {fmtSize(f.size)}</span>
                    <button className="small" onClick={() => void restoreFromFolder(f.name)}>Restore</button>
                  </li>
                ))}
              </ul>
            )
          )}

          <div className="backup-foot">
            <button className="small" onClick={() => fileRef.current?.click()}>Pick a file…</button>
            <span className="muted">Restoring replaces what is saved in this browser and reloads.</span>
          </div>
        </div>
      )}
    </span>
  )
}
