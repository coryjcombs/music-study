# Music Study

A personal, browser-only study app for guitar and music theory. Screens: fretboard with
note names and interval functions, chord voicing analyzer, chord shape library, circle of
fifths, progression catalog and device library in functional-harmony terms, song structure
view, a builder that analyzes your own progressions, ear training, a practice log with key
drills, and a notebook. Everything you save can be backed up to a JSON file.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL. Sound starts on your first click (a browser rule).

Other commands:

| Command | What it does |
|---|---|
| `npm test` | Run the theory engine tests |
| `npm run build` | Production build to `dist/` |
| `npm run build:single` | Single self-contained `dist/index.html` you can open by double-click |

See [docs/architecture.md](docs/architecture.md) for the layout and conventions.
