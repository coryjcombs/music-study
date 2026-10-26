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
3. Progression catalog and device library with playback and transposition, song structure view.
4. Builder and analyzer, practice log, notebook, ear training.

## Content: chord shapes

`src/content/shapes.ts` holds every library shape for one concrete root (usually C), with
tags for its family (open, barre, shell, drop 2, drop 3, extended, altered). Shapes without
open strings are transposed to other roots in the UI. `src/content/__tests__/shapes.test.ts`
runs every shape through the voicing analyzer and asserts it reads as its declared symbol,
so a wrong fret fails the build. Add a shape by adding a line and running `npm test`.
