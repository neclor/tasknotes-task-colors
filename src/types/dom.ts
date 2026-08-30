export const PREFIX = "tntc-";

export const ENABLED_CLASS = `${PREFIX}enabled`;
export const PRIORITY_STRIPE_CLASS = `${PREFIX}priority-stripe`;
export const VIEW_PREFIX = `${PREFIX}view-`;

export const TASK_PREFIX = `${PREFIX}task-`;
export const COLOR_PREFIX = `${PREFIX}color-`;

export const MARKED_ATTRIBUTE = `${PREFIX}marked`;

export const SUGGESTION_CLASS = `${PREFIX}color-suggestion`;
export const SWATCH_CLASS = `${PREFIX}color-swatch`;
export const COLOR_NAME_CLASS = `${PREFIX}color-name`;

export const PATH_ATTRIBUTE = "data-task-path";

export const PALETTE = [
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
] as const;

export const PALETTE_SET: ReadonlySet<string> = new Set(PALETTE);
