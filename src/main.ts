import { Plugin } from "obsidian";
import { ENABLED_CLASS, PRIORITY_STRIPE_CLASS } from "./types/dom";
import { VIEWS } from "./types/views";
import { DEFAULT_SETTINGS, TnctSettingTab, type TnctSettings } from "./ui/settings";
import { registerColorMenu } from "./ui/color_menu";
import { TaskMarker } from "./core/task_marker";

export default class TaskNotesColorTagsPlugin extends Plugin {
    public settings!: TnctSettings;
    private marker!: TaskMarker;

    public async onload(): Promise<void> {
        await this.loadSettings();

        document.body.classList.add(ENABLED_CLASS);
        this.marker = new TaskMarker(this);
        this.applySettings();

        registerColorMenu(this);
        this.addSettingTab(new TnctSettingTab(this.app, this));
    }

    public onunload(): void {
        this.marker?.stop();
        document.body.classList.remove(
            ENABLED_CLASS,
            PRIORITY_STRIPE_CLASS,
            ...VIEWS.map(v => v.bodyClass)
        );
    }

    public async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
        this.applySettings();
        this.marker.refresh();
    }

    private async loadSettings(): Promise<void> {
        const stored: Partial<TnctSettings> =
            ((await this.loadData()) as Partial<TnctSettings> | null) ?? {};
        this.settings = Object.assign({}, DEFAULT_SETTINGS, stored);
    }

    private applySettings(): void {
        const s: TnctSettings = this.settings;
        const body: HTMLElement = document.body;

        body.classList.toggle(PRIORITY_STRIPE_CLASS, s.priorityStripe);

        let anyView = false;
        for (const view of VIEWS) {
            const enabled: boolean = view.enabled(s);
            body.classList.toggle(view.bodyClass, enabled);
            anyView ||= enabled;
        }

        if (anyView) {
            this.marker.start();
        } else {
            this.marker.stop();
        }
    }
}
