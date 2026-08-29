export const MARKED_ATTRIBUTE = "data-tnct-marked";

export enum BodyClass {
    Enabled = "tnct-enabled",
    ColorAgenda = "tnct-color-agenda",
    ColorCalendar = "tnct-color-calendar",
    ColorKanban = "tnct-color-kanban",
    ColorList = "tnct-color-list",
    PriorityStripe = "tnct-priority-stripe",
}

export enum ClassPrefix {
    Tag = "tnct-tag-",
    Task = "tnct-task-",
}

export enum TaskView {
    Agenda = "agenda",
    Calendar = "calendar",
    Kanban = "kanban",
    List = "list",
}

export const TAG_SELECTOR = "a.tag";

export const TASK_SELECTORS: Record<TaskView, string> = {
    [TaskView.Agenda]: "[data-view-type='tasknotesAgenda'] .task-card",
    [TaskView.Calendar]: "[data-view-type='tasknotesCalendar'] .fc-event",
    [TaskView.Kanban]: "[data-view-type='tasknotesKanban'] .task-card",
    [TaskView.List]: "[data-view-type='tasknotesTaskList'] .task-card",
};

export const TAG_COLORS: ReadonlySet<string> = new Set([
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
    "slate",
    "gray",
    "zinc",
    "neutral",
    "stone",
    "mauve",
    "olive",
    "mist",
    "taupe",
    "black",
    "white",
]);
