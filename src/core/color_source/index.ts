import { PREFIX } from "../../types/dom";
import type { TnctSettings } from "../../ui/settings";
import { type ColorSource, ColorSourceType } from "./color_source";
import { PropertyColorSource } from "./property_color_source";
import { TagColorSource } from "./tag_color_source";

export { ColorSourceType } from "./color_source";
export type { ColorSource } from "./color_source";

export const DEFAULT_PROPERTY = `${PREFIX}color`;

export function colorSource(settings: TnctSettings): ColorSource {
    if (settings.source === ColorSourceType.Property) {
        return new PropertyColorSource(settings.property.trim() || DEFAULT_PROPERTY);
    }
    return new TagColorSource(settings.tagPrefix.trim().toLowerCase());
}
