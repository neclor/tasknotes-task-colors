export enum ColorSourceType {
    Property = "property",
    Tag = "tag",
}

export interface ColorSource {
    read(frontmatter: Frontmatter): string[];
    write(frontmatter: Record<string, unknown>, color: string | null): void;
}

export type Frontmatter = Record<string, unknown> | null | undefined;

export function toStringArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string") return [value];
    return [];
}
