import { parseFrontMatterTags } from "obsidian";

import { PALETTE, PALETTE_SET } from "../../types/dom";
import { type ColorSource, type Frontmatter, toStringArray } from "./color_source";

export class TagColorSource implements ColorSource {
    public constructor(private readonly prefix: string) {}

    public read(frontmatter: Frontmatter): string[] {
        return (parseFrontMatterTags(frontmatter ?? null) ?? [])
            .map(tag => tag.replace(/^#/, "").toLowerCase())
            .filter(tag => tag.startsWith(this.prefix))
            .map(tag => tag.slice(this.prefix.length))
            .filter(name => PALETTE_SET.has(name));
    }

    public write(frontmatter: Record<string, unknown>, color: string | null): void {
        const known = new Set(PALETTE.map(name => this.prefix + name));
        const kept = toStringArray(frontmatter.tags).filter(
            tag => !known.has(tag.toLowerCase()),
        );
        if (color !== null) kept.push(this.prefix + color);
        frontmatter.tags = kept;
    }
}
