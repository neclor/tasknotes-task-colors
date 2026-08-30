import { type App, type CachedMetadata, type TAbstractFile, TFile } from "obsidian";

import type TaskNotesColorTagsPlugin from "../main";
import { COLOR_PREFIX, MARKED_ATTRIBUTE, PATH_ATTRIBUTE, TASK_PREFIX } from "../types/dom";
import { type View, VIEWS } from "../types/views";
import { type ColorSource, colorSource } from "./color_source";

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
        const source: ColorSource = colorSource(this.plugin.settings);
        for (const view of VIEWS) {
            const enabled: boolean = view.enabled(this.plugin.settings);
            document
                .querySelectorAll<HTMLElement>(view.selector)
                .forEach(element =>
                    enabled ? this.update(element, view, source) : clean(element),
                );
        }
    }

    private update(element: HTMLElement, view: View, source: ColorSource): void {
        const wanted: Set<string> = new Set(
            this.getColors(element, source).map(name => `${COLOR_PREFIX}${name}`),
        );

        for (const cls of Array.from(element.classList)) {
            if (cls.startsWith(COLOR_PREFIX) && !wanted.has(cls)) {
                element.classList.remove(cls);
            }
        }

        if (wanted.size === 0) {
            clean(element);
            return;
        }

        addClass(element, view.taskClass);
        for (const cls of wanted) {
            addClass(element, cls);
        }
    }

    private getColors(element: HTMLElement, source: ColorSource): string[] {
        const cache: CachedMetadata | null = this.getCache(element);
        return cache === null ? [] : source.read(cache.frontmatter);
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
