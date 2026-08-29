import { VIEW_PREFIX, TASK_PREFIX } from "./dom";
import type { TnctSettings } from "../ui/settings";

export class View {
    public constructor(
        public readonly key: string,
        public readonly label: string,
        public readonly selector: string,
        public readonly enabled: (settings: TnctSettings) => boolean,
    ) {}

    public get bodyClass(): string { return `${VIEW_PREFIX}${this.key}`; }

    public get taskClass(): string { return `${TASK_PREFIX}${this.key}`; }
}

export const VIEWS = [
    new View(
        "agenda",
        "Agenda",
        "[data-view-type='tasknotesCalendar'] .fc-list .task-card:not(.task-card--ics)",
        s => s.colorAgenda,
    ),
    new View(
        "calendar",
        "Calendar",
        "[data-view-type='tasknotesCalendar'] .fc-task-event:not(.fc-list-event):not(.fc-ics-event)",
        s => s.colorCalendar,
    ),
    new View(
        "kanban",
        "Kanban",
        "[data-view-type='tasknotesKanban'] .task-card",
        s => s.colorKanban,
    ),
    new View(
        "list",
        "List",
        "[data-view-type='tasknotesTaskList'] .task-card",
        s => s.colorList,
    ),
] as const;
