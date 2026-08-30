# TaskNotes Task Colors

Colors [TaskNotes](https://community.obsidian.md/plugins/tasknotes) tasks by a color-name frontmatter property
or tag across the calendar, agenda, kanban, list and widget views.

---

## Contents

- [Download](#download)
- [Usage](#usage)
- [Settings](#settings)
- [Screenshots](#screenshots)

---

## Download

Requires the [**TaskNotes**](https://community.obsidian.md/plugins/tasknotes) plugin and Obsidian **1.13+**.

- [TaskNotes Task Colors](https://obsidian.md/plugins?id=tasknotes-task-colors)
- [GitHub](https://github.com/neclor/tasknotes-task-colors)

---

## Usage

1. Enable the plugin. By default every view is colored.
2. Give a task note a [Tailwind color name](https://tailwindcss.com/docs/colors) - `red`, `blue`, `zinc`, … The task is then tinted with that color everywhere it appears.
   - **Property** source (default): set a frontmatter property, e.g. `tntc-color: red`.
   - **Tag** source: add a tag, e.g. `#red`.
3. Or set it from the UI: **right‑click a task → Set color**, pick from the list, or *Remove color*.

Only recognized color names are used; anything else is ignored. If a task carries several, the last one wins.

---

## Settings

| Setting | Default | What it does |
| --- | --- | --- |
| **Source** | Property | Read the color from a frontmatter property or from a `#tag`. |
| **Property name** | `tntc-color` | *(Property source)* Frontmatter property holding the color name. |
| **Tag prefix** | *(empty)* | *(Tag source)* Restrict color tags to this prefix (e.g. `tntc-` - only `#tntc-red` counts). |
| **Agenda / Calendar / Kanban / List / Widget** | on | Toggle coloring per view. |
| **Priority stripe** | on | Keep the calendar event's left edge in its priority color. |

---

## Screenshots

| Agenda | Calendar | Kanban | List |
| --- | --- | --- | --- |
| ![Agenda](media/agenda.png) | ![Calendar](media/calendar.png) | ![Kanban](media/kanban.png) | ![List](media/list.png) | ![Color picker](media/picker.png) |

| Settings | Color picker |
| --- | --- |
| ![Agenda](media/settings.png) | ![Color picker](media/colors.png) |

---
