# Architecture

A static single-page app. No server, no accounts. Runs with `npm run dev`, or build a
single self-contained HTML file with `npm run build:single` and open `dist/index.html`.

## Layers

| Folder | Role | Rule |
|---|---|---|
| `src/theory/` | Pure functions: spelling, intervals, fretboard math, chord templates, voicing analysis, keys, scales. Built on [tonal](https://github.com/tonaljs/tonal). | No UI, no audio. Every function has tests in `__tests__/`. |
| `src/audio/` | One adapter (`player.ts`) over [smplr](https://github.com/danigb/smplr) SoundFont instruments. | Screens call `player.playNote`, `playChord`, `strum`, `playSequence`. Nothing else touches Web Audio. |
| `src/content/` | Data only: chord shapes, progression catalog, device library. | Validated by a script; no code. |
| `src/modules/<name>/` | One folder per screen. | Depends on `theory/`, `audio/`, `store/`. Never on another module. Registered in `src/app/modules.ts`. |
| `src/app/` | Shell, navigation, module registry. | |
| `src/store/` | Your own data (settings, later notes and sketches) in localStorage, with export and import. | Reference content never lives here. |

## Conventions

- Notes are spelled strings (`"Eb"`, `"F#4"`). Midi numbers are integers. Pitch class vs. midi is always explicit.
- Every display takes a spelling context (key, scale, or chord notes). Never spell from a raw pitch class.
- Interval labels come from the spelled interval, so C to D# is `#9` while C to Eb is `b3`.
- Tunings are data (`theory/tuning.ts`). Strings are indexed low to high: index 0 is the 6th string.
- Shapes are frets per string, low to high, `null` for muted. Text form: `x3133x` or `x 10 8 10 10 x`.
- Chord identification uses our own template table (`theory/chords.ts`), not tonal's detector, because jazz voicings omit the fifth and sometimes the root. A root can be asserted to re-read an ambiguous shape.

## Build phases

1. Scaffold, theory engine with tests, audio adapter, fretboard viewer. **(done)**
2. Voicing analyzer, chord shape library, circle of fifths. **(done)**
3. Progression catalog and device library with playback and transposition, song structure view. **(done)**
4. Builder and analyzer, practice log with key drills, notebook, ear training, backup. **(done)**

## Content: chord shapes

`src/content/shapes.ts` holds every library shape for one concrete root (usually C), with
tags for its family (open, barre, shell, drop 2, drop 3, extended, altered). Shapes without
open strings are transposed to other roots in the UI. `src/content/__tests__/shapes.test.ts`
runs every shape through the voicing analyzer and asserts it reads as its declared symbol,
so a wrong fret fails the build. Add a shape by adding a line and running `npm test`.

## Content: progressions, devices, forms

- `src/content/progressions.ts`: the catalog. Each entry has `bars` in Roman numerals, the
  devices it illustrates, genres, a one-line feel, a "why it works" explanation, and examples
  to listen to.
- `src/content/devices.ts`: the device library (modal interchange, secondary dominants,
  chromatic mediants, and so on). Progressions link to devices by id.
- `src/content/forms.ts`: song forms for the structure view, as sections of bars.
- `src/content/__tests__/progressions.test.ts` realizes every entry in all twelve keys and
  checks every device reference, so a typo in a numeral fails the tests.

### Numeral convention

Numerals are always measured against the MAJOR scale of the tonic, in both modes. A minor
progression is written `i bVII bVI V`, never `i VII VI V`. Case gives triad quality; an explicit
suffix overrides it (`ii7` is m7, `iiø7` is m7b5, `vii°7` is dim7, `imaj7` is mMaj7). `X/Y`
applies X to the root of Y (`V7/ii`, `subV7/I`). A bar string holds one or more numerals
separated by spaces, which share the bar equally (`"ii V"`). See `src/theory/progressions.ts`.

## Your own data

Sketches, notes, practice sessions, and drill and ear-training stats live in localStorage
under the `music-study:` prefix, through `src/store/collection.ts`. The Backup button in the
top bar saves all of it as one JSON file; Restore loads such a file back and reloads.

In Chrome and Edge you can choose a backup folder once (Restore > Choose folder…). The folder
handle is remembered in IndexedDB (`src/store/backupDir.ts`); the browser may ask you to
re-allow access once per session. Backup then writes timestamped files straight into that
folder and Restore lists them newest first. Without a folder, or in browsers without the
File System Access API, Backup downloads the file and Restore opens a file picker. The repo's
`backups/` folder is gitignored and a sensible choice; remove the ignore line if you want git
history for your notes.

Reference content never lives in localStorage. Clearing browser site data erases your data, and
`file://` and `localhost` are different origins with separate data, so back up before switching.

## Analysis

`src/theory/analysis.ts` is the reverse of `progressions.ts`: chord symbols in, numerals and
devices out. It ranks keys by how many chords are diatonic (the harmonic-minor V counts in
minor), then names each non-diatonic chord by the most common reading: secondary dominant or
leading-tone chord (from what follows it), tritone substitute, borrowed from the parallel key,
chromatic mediant, or plain chromatic. Order matters for the secondary-dominant rules.
