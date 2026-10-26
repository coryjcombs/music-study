import { useMemo, useState, type ReactNode } from 'react'
import { useCollection, type Entity } from '../../store/collection'

interface Note extends Entity {
  title: string
  body: string
  tags: string[]
}

/** Minimal markdown: # headings, **bold**, *italic*, `code`, - lists, blank-line paragraphs. */
function renderMarkdown(src: string): ReactNode[] {
  const blocks = src.replace(/\r\n/g, '\n').split(/\n{2,}/)
  return blocks.map((block, i) => {
    const lines = block.split('\n')
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ''))}</li>)}</ul>
    }
    const h = block.match(/^(#{1,3})\s+(.*)$/)
    if (h && lines.length === 1) {
      const level = h[1].length
      const text = inline(h[2])
      return level === 1 ? <h2 key={i}>{text}</h2> : level === 2 ? <h3 key={i}>{text}</h3> : <h4 key={i}>{text}</h4>
    }
    return <p key={i}>{lines.map((l, j) => <span key={j}>{inline(l)}{j < lines.length - 1 && <br />}</span>)}</p>
  })
}

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const t = m[0]
    if (t.startsWith('**')) parts.push(<b key={k++}>{t.slice(2, -2)}</b>)
    else if (t.startsWith('`')) parts.push(<code key={k++}>{t.slice(1, -1)}</code>)
    else parts.push(<i key={k++}>{t.slice(1, -1)}</i>)
    last = m.index + t.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function NotebookModule() {
  const notes = useCollection<Note>('notes')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ title: '', body: '', tags: '' })

  const selected = notes.items.find((n) => n.id === selectedId) ?? null
  const allTags = useMemo(() => [...new Set(notes.items.flatMap((n) => n.tags))].sort(), [notes.items])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes.items
    return notes.items.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q)))
  }, [notes.items, query])

  const startNew = () => {
    setSelectedId(null)
    setDraft({ title: '', body: '', tags: '' })
    setEditing(true)
  }

  const startEdit = () => {
    if (!selected) return
    setDraft({ title: selected.title, body: selected.body, tags: selected.tags.join(', ') })
    setEditing(true)
  }

  const save = () => {
    const tags = draft.tags.split(',').map((t) => t.trim()).filter(Boolean)
    const title = draft.title.trim() || 'Untitled'
    if (selected) {
      notes.update(selected.id, { title, body: draft.body, tags })
    } else {
      const n = notes.add({ title, body: draft.body, tags })
      setSelectedId(n.id)
    }
    setEditing(false)
  }

  return (
    <div className="catalog-layout">
      <aside className="panel catalog-list">
        <div className="section-head" style={{ marginBottom: 8 }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search notes" style={{ flex: 1 }} />
          <button className="small" onClick={startNew}>New</button>
        </div>
        {allTags.length > 0 && (
          <div className="notes-row" style={{ marginTop: 0, marginBottom: 8 }}>
            {allTags.map((t) => <button key={t} className="chip small-chip" onClick={() => setQuery(t)}>{t}</button>)}
          </div>
        )}
        <ul className="entry-list">
          {list.map((n) => (
            <li key={n.id} className={n.id === selectedId ? 'active' : ''} onClick={() => { setSelectedId(n.id); setEditing(false) }}>
              <div className="entry-name">{n.title}</div>
              <div className="entry-sub">{n.updatedAt.slice(0, 10)}{n.tags.length ? ` · ${n.tags.join(', ')}` : ''}</div>
            </li>
          ))}
          {list.length === 0 && <li className="muted">{notes.items.length ? 'No matches.' : 'Your own observations go here: what a chord did in a song, a voicing that worked, a question for your teacher.'}</li>}
        </ul>
      </aside>

      <section className="panel">
        {editing ? (
          <div className="editor">
            <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" className="title-input" />
            <input type="text" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="tags, comma separated (e.g. modal interchange, Cm9, song: Blue in Green)" />
            <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} rows={18} placeholder={'Write in plain text. # Heading, **bold**, *italic*, `code`, and - lists are rendered.'} />
            <div className="section-head">
              <span className="muted">Markdown-lite. Blank line between paragraphs.</span>
              <div className="seg-group">
                <button className="seg" onClick={() => setEditing(false)}>Cancel</button>
                <button className="seg primary" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        ) : selected ? (
          <article className="note-view">
            <div className="section-head">
              <h2 className="chord-title">{selected.title}</h2>
              <div className="seg-group">
                <button className="seg" onClick={startEdit}>Edit</button>
                <button className="seg" onClick={() => { notes.remove(selected.id); setSelectedId(null) }}>Delete</button>
              </div>
            </div>
            <p className="muted" style={{ marginTop: 2 }}>
              {selected.tags.map((t) => <span key={t} className="chip" style={{ marginRight: 6 }}>{t}</span>)}
              <span style={{ fontSize: 12 }}>updated {selected.updatedAt.slice(0, 10)}</span>
            </p>
            <div className="prose rendered">{renderMarkdown(selected.body)}</div>
          </article>
        ) : (
          <p className="muted">Select a note or create a new one.</p>
        )}
      </section>
    </div>
  )
}
