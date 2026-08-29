import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, TnctSettings, TnctSettingTab } from "./settings";
import { TaskMarker } from "./task_marker";
import { BodyClass } from "./constants";

export default class TaskNotesColorTagsPlugin extends Plugin {
    public settings!: TnctSettings;
    private marker!: TaskMarker;

    public async onload(): Promise<void> {
        await this.loadSettings();

        activeDocument.body.classList.add(BodyClass.Enabled);
        this.marker = new TaskMarker(this);
        this.applySettings();

        this.addSettingTab(new TnctSettingTab(this.app, this));
    }

    public onunload(): void {
        this.marker?.stop();
        activeDocument.body.classList.remove(...Object.values(BodyClass));
    }

    public async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
        this.applySettings();
    }

    private async loadSettings(): Promise<void> {
        const stored: Partial<TnctSettings> =
            ((await this.loadData()) as Partial<TnctSettings> | null) ?? {};
        this.settings = Object.assign({}, DEFAULT_SETTINGS, stored);
    }

    private applySettings(): void {
        const s: TnctSettings = this.settings;
        const body: HTMLElement = activeDocument.body;

        body.classList.toggle(BodyClass.ColorAgenda, s.colorAgenda);
        body.classList.toggle(BodyClass.ColorCalendar, s.colorCalendar);
        body.classList.toggle(BodyClass.ColorKanban, s.colorKanban);
        body.classList.toggle(BodyClass.ColorList, s.colorList);
        body.classList.toggle(BodyClass.PriorityStripe, s.priorityStripe);

        const needsMarker: boolean =
            s.colorAgenda || s.colorCalendar || s.colorKanban || s.colorList;
        if (needsMarker) {
            this.marker.start();
        } else {
            this.marker.stop();
        }
    }
}
