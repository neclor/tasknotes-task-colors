# TaskNotes Color Tags

[![CI](https://github.com/neclor/tasknotes-color-tags/actions/workflows/lint.yml/badge.svg)](https://github.com/neclor/tasknotes-color-tags/actions/workflows/lint.yml)

Colors [TaskNotes](https://github.com/callumalpass/tasknotes) tasks by their tag,
using a Tailwind-based palette, across the calendar, agenda, kanban and list views.

Tag a note `#red`, `#blue`, `#zinc`, … and its task gets a matching tint and
border. Only palette color names are used; other tags are ignored.

## Settings

**Views** — one toggle each: Agenda, Calendar, Kanban, List.
Turn a view on to color its tasks; off to leave it untouched.

**Priority stripe** — keep the left edge of each task in its priority color.
When off, the left edge uses the tag color too.

## How it works

- A small DOM watcher stamps `tnct-task-<view>` and `tnct-tag-<color>` classes
  onto each task element.
- `styles.css` does the coloring, gated by body classes the plugin toggles from
  its settings.

## Develop

```bash
npm install
npm run dev      # esbuild watch -> main.js
npm run build    # tsc check + production bundle
npm run lint
```

## Install manually

Copy `main.js`, `manifest.json` and `styles.css` into
`<vault>/.obsidian/plugins/tasknotes-color-tags/`, then enable the plugin in
**Settings → Community plugins**.

Requires Obsidian 1.13.0+.
