import { Plugin } from "obsidian";
import { MARKED_ATTRIBUTE, ClassPrefix, TaskView, TAG_SELECTOR, TASK_SELECTORS, TAG_COLORS } from "./constants";

export class TaskMarker {
    private observer: MutationObserver | null = null;
    private queued: boolean = false;

    public constructor(plugin: Plugin) {
        plugin.registerEvent(
            plugin.app.workspace.on("layout-change", () => this.schedule()),
        );
    }

    public start(): void {
        if (this.observer !== null) return;

        scan();
        this.observer = new MutationObserver(() => this.schedule());
        this.observer.observe(activeDocument.body, {
            childList: true,
            subtree: true,
        });
    }

    public stop(): void {
        this.observer?.disconnect();
        this.observer = null;

        activeDocument
            .querySelectorAll<HTMLElement>(`[${MARKED_ATTRIBUTE}]`)
            .forEach(element => clean(element));
    }

    private schedule(): void {
        if (this.queued || this.observer === null) return;

        this.queued = true;
        window.requestAnimationFrame(() => {
            this.queued = false;
            if (this.observer !== null) {
                scan();
            }
        });
    }
}

function scan(): void {
    for (const view of Object.values(TaskView)) {
        activeDocument
            .querySelectorAll<HTMLElement>(TASK_SELECTORS[view])
            .forEach(element => mark(element, view));
    }
}

function mark(element: HTMLElement, view: TaskView): void {
    addClass(element, `${ClassPrefix.Task}${view}`);

    element.querySelectorAll<HTMLElement>(TAG_SELECTOR).forEach(tag => {
        const slug: string = slugify(tag.textContent ?? "");
        if (TAG_COLORS.has(slug)) {
            addClass(element, `${ClassPrefix.Tag}${slug}`);
        }
    });
}

function addClass(element: HTMLElement, cls: string): void {
    if (!element.classList.contains(cls)) {
        element.classList.add(cls);
        element.setAttribute(MARKED_ATTRIBUTE, "");
    }
}

function clean(element: HTMLElement): void {
    Array.from(element.classList)
        .filter(cls => cls.startsWith(ClassPrefix.Tag) || cls.startsWith(ClassPrefix.Task))
        .forEach(cls => element.classList.remove(cls));
    element.removeAttribute(MARKED_ATTRIBUTE);
}

function slugify(raw: string): string {
    return raw
        .trim()
        .replace(/^#/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
