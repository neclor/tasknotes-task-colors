import { PALETTE_SET } from "../../types/dom";
import { type ColorSource, type Frontmatter, toStringArray } from "./color_source";

export class PropertyColorSource implements ColorSource {
    public constructor(private readonly property: string) {}

    public read(frontmatter: Frontmatter): string[] {
        return toStringArray(frontmatter?.[this.property])
            .map(value => value.toLowerCase())
            .filter(name => PALETTE_SET.has(name));
    }

    public write(frontmatter: Record<string, unknown>, color: string | null): void {
        if (color === null) delete frontmatter[this.property];
        else frontmatter[this.property] = color;
    }
}
