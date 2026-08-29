import { App, PluginSettingTab, SettingDefinition, SettingDefinitionItem } from "obsidian";
import type TaskNotesColorTagsPlugin from "./main";

export interface TnctSettings {
    colorAgenda: boolean;
    colorCalendar: boolean;
    colorKanban: boolean;
    colorList: boolean;
    priorityStripe: boolean;
}

export const DEFAULT_SETTINGS: TnctSettings = {
    colorAgenda: true,
    colorCalendar: true,
    colorKanban: true,
    colorList: true,
    priorityStripe: true,
};

type SettingKey = keyof TnctSettings;

export class TnctSettingTab extends PluginSettingTab {
    private readonly plugin: TaskNotesColorTagsPlugin;

    public constructor(app: App, plugin: TaskNotesColorTagsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    public getSettingDefinitions(): SettingDefinitionItem[] {
        return [
            {
                type: "group",
                heading: "Views",
                items: [
                    toggle(
                        "colorAgenda",
                        "Agenda",
                        "Color tasks by their tag in the agenda view.",
                    ),
                    toggle(
                        "colorCalendar",
                        "Calendar",
                        "Color events by their tag in the calendar.",
                    ),
                    toggle(
                        "colorKanban",
                        "Kanban",
                        "Color tasks by their tag in the kanban view.",
                    ),
                    toggle(
                        "colorList",
                        "List",
                        "Color tasks by their tag in the task list view.",
                    ),
                ],
            },
            {
                type: "group",
                heading: "Priority",
                items: [
                    toggle(
                        "priorityStripe",
                        "Priority stripe",
                        "Keep the left edge of calendar event in its priority color.",
                    ),
                ],
            },
        ];
    }

    public getControlValue(key: string): unknown {
        return this.plugin.settings[key as SettingKey];
    }

    public async setControlValue(key: string, value: unknown): Promise<void> {
        this.plugin.settings[key as SettingKey] = value as boolean;
        await this.plugin.saveSettings();
    }
}

function toggle(key: SettingKey, name: string, desc: string): SettingDefinition {
    return { name, desc, control: { type: "toggle", key } };
}
