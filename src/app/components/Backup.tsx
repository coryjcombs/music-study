import { useRef } from 'react'
import { downloadJson, exportAll, importAll } from '../../store/collection'

/** Export and import of everything the user has saved (settings, sketches, notes, log, stats). */
export function Backup() {
  const fileRef = useRef<HTMLInputElement>(null)

  const doExport = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJson(`music-study-backup-${stamp}.json`, exportAll())
  }

  const doImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text())
      if (!data || typeof data !== 'object') throw new Error('not an object')
      if (!confirm('Restore this backup? Collections in the file replace the ones in this browser.')) return
      importAll(data)
      location.reload()
    } catch {
      alert('That file is not a Music Study backup.')
    }
  }

  return (
    <span className="backup">
      <button className="small" onClick={doExport} title="Download everything you have saved as a JSON file">Backup</button>
      <button className="small" onClick={() => fileRef.current?.click()} title="Restore from a backup file">Restore</button>
      <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = '' }} />
    </span>
  )
}
