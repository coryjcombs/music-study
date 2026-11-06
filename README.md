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

## Install as an app (PWA)

Pushing to `main` builds the app and publishes it to GitHub Pages through
`.github/workflows/pages.yml`. Once in the repo settings under Pages the source is set to
"GitHub Actions", the site is at `https://coryjcombs.github.io/music-study/`. Open that on the
phone in Edge or Chrome and choose "Add to phone" or "Install app" from the browser menu: it
gets a home-screen icon, opens full screen, works offline, and keeps any instrument samples
you have already heard. New pushes reach the installed app on its next open. The repo and site are public; your own data never leaves the browser it was entered in.

## On a phone

The same build works on a phone: below about 720px wide the tabs move to a bottom bar,
the gear at the top right holds tuning, sound and backup, and panels stack. Build the
single file, copy `dist/index.html` to the phone (USB, Drive, or email it to yourself)
and open it from the Files app with Edge or Chrome. Keep opening it from the same place,
since the browser stores your data per file location. The phone's data is separate from
the PC's: Backup on one and Restore on the other to move it. Android browsers cannot
write to a chosen folder, so Backup downloads the file and Restore opens a file picker.
Instrument samples still load from the internet on first use.

See [docs/architecture.md](docs/architecture.md) for the layout and conventions.
