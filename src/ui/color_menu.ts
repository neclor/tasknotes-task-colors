import { type App, type FuzzyMatch, FuzzySuggestModal, Menu, TFile } from "obsidian";

import { colorSource } from "../core/color_source";
import type TaskNotesColorTagsPlugin from "../main";
import { COLOR_NAME_CLASS, COLOR_PREFIX, PALETTE, PATH_ATTRIBUTE, SUGGESTION_CLASS, SWATCH_CLASS } from "../types/dom";
import { VIEWS } from "../types/views";

interface TaskNotesApi {
    hasCapability?(name: string): boolean;
    ui?: {
        taskMenu?: {
            populate(menu: Menu, options: { taskPath: string }): void | Promise<void>;
        };
    };
}

interface FoundTask {
    file: TFile;
    path: string;
}

const REMOVE = "- Remove color -";

export function registerColorMenu(plugin: TaskNotesColorTagsPlugin): void {
    plugin.registerDomEvent(
        document,
        "contextmenu",
        (evt: MouseEvent) => {
            const task = resolveTask(plugin, evt.target);
            if (task === null) return;

            evt.preventDefault();
            evt.stopImmediatePropagation();
            void openMenu(plugin, task, evt);
        },
        { capture: true },
    );
}

function resolveTask(plugin: TaskNotesColorTagsPlugin, target: EventTarget | null): FoundTask | null {
    if (!(target instanceof Element)) return null;

    const element = matchedTaskElement(plugin, target);
    if (element === null) return null;

    const path = element.getAttribute(PATH_ATTRIBUTE);
    if (path === null || path === "") return null;

    const file = plugin.app.vault.getAbstractFileByPath(path);
    return file instanceof TFile ? { file, path } : null;
}

function matchedTaskElement(plugin: TaskNotesColorTagsPlugin, target: Element): HTMLElement | null {
    for (const view of VIEWS) {
        const hit = target.closest<HTMLElement>(view.selector);
        if (hit !== null) return view.enabled(plugin.settings) ? hit : null;
    }
    return null;
}

async function openMenu(plugin: TaskNotesColorTagsPlugin, task: FoundTask, evt: MouseEvent): Promise<void> {
    const menu = new Menu();

    const hasTaskNotesItems = await addTaskNotesItems(plugin, menu, task.path);
    if (hasTaskNotesItems) menu.addSeparator();

    menu.addItem(item =>
        item
            .setTitle("Set color")
            .setIcon("palette")
            .onClick(() => {
                new ColorModal(plugin.app, color => {
                    void setColor(plugin, task.file, color);
                }).open();
            }),
    );

    menu.showAtMouseEvent(evt);
}

async function addTaskNotesItems(plugin: TaskNotesColorTagsPlugin, menu: Menu, taskPath: string): Promise<boolean> {
    const api: TaskNotesApi | null = taskNotesApi(plugin);
    if (api === null) return false;

    const taskMenu = api.ui?.taskMenu;
    if (taskMenu === undefined) return false;
    if (api.hasCapability?.("ui.task-menu") === false) return false;

    try {
        await taskMenu.populate(menu, { taskPath });
        return true;
    } catch {
        return false;
    }
}

function taskNotesApi(plugin: TaskNotesColorTagsPlugin): TaskNotesApi | null {
    const tasknotes = (plugin.app as unknown as {
        plugins: { getPlugin(id: string): { api?: TaskNotesApi } | null };
    }).plugins.getPlugin("tasknotes");
    return tasknotes?.api ?? null;
}

class ColorModal extends FuzzySuggestModal<string> {
    private readonly pick: (color: string | null) => void;

    public constructor(app: App, pick: (color: string | null) => void) {
        super(app);
        this.pick = pick;
        this.setPlaceholder("Pick a color");
    }

    public getItems(): string[] { return [REMOVE, ...PALETTE]; }

    public getItemText(item: string): string { return item; }

    public onChooseItem(item: string): void { this.pick(item === REMOVE ? null : item); }

    public renderSuggestion(match: FuzzyMatch<string>, element: HTMLElement): void {
        const item = match.item;
        if (item === REMOVE) {
            element.setText(item);
            return;
        }
        element.addClass(SUGGESTION_CLASS);
        element.createSpan({ cls: [SWATCH_CLASS, `${COLOR_PREFIX}${item}`] });
        element.createSpan({ text: item, cls: COLOR_NAME_CLASS });
    }
}

async function setColor(plugin: TaskNotesColorTagsPlugin, file: TFile, color: string | null): Promise<void> {
    const source = colorSource(plugin.settings);
    await plugin.app.fileManager.processFrontMatter(
        file,
        (frontmatter: Record<string, unknown>) => source.write(frontmatter, color),
    );
}
