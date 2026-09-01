import { type App, PluginSettingTab, type SettingDefinition, type SettingDefinitionItem } from "obsidian";

import { ColorSourceType, DEFAULT_PROPERTY } from "../core/color_source";
import type TaskNotesColorTagsPlugin from "../main";

export interface TnctSettings {
    source: ColorSourceType;
    tagPrefix: string;
    property: string;
    colorAgenda: boolean;
    colorCalendar: boolean;
    colorKanban: boolean;
    colorList: boolean;
    colorWidget: boolean;
    priorityStripe: boolean;
}

export const DEFAULT_SETTINGS: TnctSettings = {
    source: ColorSourceType.Property,
    tagPrefix: "",
    property: DEFAULT_PROPERTY,
    colorAgenda: true,
    colorCalendar: true,
    colorKanban: true,
    colorList: true,
    colorWidget: true,
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
                heading: "Color source",
                items: [
                    {
                        name: "Source",
                        desc: "Where each task's color name is read from and written to.",
                        control: {
                            type: "dropdown",
                            key: "source",
                            options: {
                                [ColorSourceType.Property]: "Property",
                                [ColorSourceType.Tag]: "Tag",
                            },
                        },
                    },
                    {
                        name: "Tag prefix",
                        desc: "Only tags starting with this prefix are treated as colors. Empty means bare color names like #red.",
                        visible: () => this.plugin.settings.source === ColorSourceType.Tag,
                        control: {
                            type: "text",
                            key: "tagPrefix",
                            placeholder: "e.g. tntc-",
                        },
                    },
                    {
                        name: "Property name",
                        desc: "Frontmatter property holding the color name, e.g. color: red.",
                        visible: () => this.plugin.settings.source === ColorSourceType.Property,
                        control: {
                            type: "text",
                            key: "property",
                            placeholder: DEFAULT_PROPERTY,
                        },
                    },
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
                    toggle(
                        "colorWidget",
                        "Widget",
                        "Color tasks by their tag in note task widgets.",
                    ),
                ],
            },
        ];
    }

    public getControlValue(key: string): unknown {
        return this.plugin.settings[key as SettingKey];
    }

    public async setControlValue(key: string, value: unknown): Promise<void> {
        (this.plugin.settings as unknown as Record<string, unknown>)[key] =
            value;
        await this.plugin.saveSettings();
        if (key === "source") this.update();
    }
}

function toggle(key: SettingKey, name: string, desc: string): SettingDefinition {
    return { name, desc, control: { type: "toggle", key } };
}
