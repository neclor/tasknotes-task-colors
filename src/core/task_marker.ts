import { App, CachedMetadata, TAbstractFile, TFile, parseFrontMatterTags } from "obsidian";
import { PATH_ATTRIBUTE, PALETTE_SET, COLOR_PREFIX, MARKED_ATTRIBUTE, TASK_PREFIX } from "../types/dom";
import { type View, VIEWS } from "../types/views";
import type TaskNotesColorTagsPlugin from "../main";

export class TaskMarker {
    private readonly plugin: TaskNotesColorTagsPlugin;
    private readonly app: App;
    private observer: MutationObserver | null = null;
    private queued: boolean = false;

    public constructor(plugin: TaskNotesColorTagsPlugin) {
        this.plugin = plugin;
        this.app = plugin.app;
        plugin.registerEvent(
            this.app.workspace.on("layout-change", () => this.schedule()),
        );
        plugin.registerEvent(
            this.app.metadataCache.on("changed", () => this.schedule()),
        );
    }

    public start(): void {
        if (this.observer !== null) return;

        this.scan();
        this.observer = new MutationObserver(() => this.schedule());
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    public stop(): void {
        this.observer?.disconnect();
        this.observer = null;

        document
            .querySelectorAll<HTMLElement>(`[${MARKED_ATTRIBUTE}]`)
            .forEach(element => clean(element));
    }

    public refresh(): void {
        if (this.observer !== null) this.scan();
    }

    private schedule(): void {
        if (this.queued || this.observer === null) return;

        this.queued = true;
        queueMicrotask(() => {
            this.queued = false;
            if (this.observer !== null) this.scan();
        });
    }

    private scan(): void {
        for (const view of VIEWS) {
            const enabled: boolean = view.enabled(this.plugin.settings);
            document
                .querySelectorAll<HTMLElement>(view.selector)
                .forEach(element =>
                    enabled ? this.update(element, view) : clean(element),
                );
        }
    }

    private update(element: HTMLElement, view: View): void {
        const color_tags: Set<string> = new Set(
            this.getColors(element).map(color => `${COLOR_PREFIX}${color}`),
        );

        for (const cls of Array.from(element.classList)) {
            if (cls.startsWith(COLOR_PREFIX) && !color_tags.has(cls)) {
                element.classList.remove(cls);
            }
        }

        if (color_tags.size === 0) {
            clean(element);
            return;
        }

        addClass(element, view.taskClass);
        for (const cls of color_tags) {
            addClass(element, cls);
        }
    }

    private getColors(element: HTMLElement): string[] {
        const cache: CachedMetadata | null = this.getCache(element);
        if (cache === null) return [];

        const prefix: string = this.plugin.settings.tagPrefix.toLowerCase();

        return (parseFrontMatterTags(cache.frontmatter) ?? [])
            .map(tag => tag.replace(/^#/, "").toLowerCase())
            .filter(tag => prefix === "" || tag.startsWith(prefix))
            .map(tag => tag.slice(prefix.length))
            .filter(tag => PALETTE_SET.has(tag));
    }

    private getCache(element: HTMLElement): CachedMetadata | null {
        const path: string | null = element.getAttribute(PATH_ATTRIBUTE);
        if (path === null) return null;

        const file: TAbstractFile | null = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) return null;

        return this.app.metadataCache.getFileCache(file);
    }
}

function addClass(element: HTMLElement, cls: string): void {
    if (!element.classList.contains(cls)) {
        element.classList.add(cls);
        element.setAttribute(MARKED_ATTRIBUTE, "");
    }
}

function clean(element: HTMLElement): void {
    Array.from(element.classList)
        .filter(cls => cls.startsWith(COLOR_PREFIX) || cls.startsWith(TASK_PREFIX))
        .forEach(cls => element.classList.remove(cls));
    element.removeAttribute(MARKED_ATTRIBUTE);
}
