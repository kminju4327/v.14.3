// Image-first section schema (V14 foundation)
// Keeps every legacy top-level field intact while adding normalized visual/content/design blocks.

export const SECTION_SCHEMA_VERSION = 1;

const text = (value) => String(value ?? "").trim();

function normalizeItems(section = {}) {
  if (Array.isArray(section.items)) return section.items;
  if (Array.isArray(section.content?.items)) return section.content.items;
  return [];
}

function createSectionId(section = {}, index = 0) {
  if (section.id) return String(section.id);
  const type = text(section.type || section.intent || "section")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
  return `${type}-${String(index + 1).padStart(2, "0")}`;
}

export function normalizeSection(section = {}, index = 0) {
  const safe = section && typeof section === "object" ? section : {};
  const items = normalizeItems(safe);
  const title = text(safe.content?.title || safe.title);
  const body = text(safe.content?.body || safe.body);
  const subtitle = text(safe.content?.subtitle || safe.subtitle);

  return {
    ...safe,
    id: createSectionId(safe, index),
    schemaVersion: SECTION_SCHEMA_VERSION,
    type: safe.type || "section",
    content: {
      eyebrow: text(safe.content?.eyebrow || safe.eyebrow),
      title,
      subtitle,
      body,
      items,
      highlights: Array.isArray(safe.content?.highlights)
        ? safe.content.highlights
        : Array.isArray(safe.highlights)
          ? safe.highlights
          : [],
      ctaText: text(safe.content?.ctaText || safe.ctaText),
      ...(safe.content || {}),
      title,
      subtitle,
      body,
      items,
    },
    visual: {
      imageUrl: text(safe.visual?.imageUrl || safe.imageUrl || safe.image?.url),
      prompt: text(safe.visual?.prompt || safe.imagePrompt || safe.image?.prompt),
      provider: text(safe.visual?.provider || safe.image?.provider || "mock"),
      status: safe.visual?.status || safe.image?.status || "idle",
      alt: text(safe.visual?.alt || safe.imageAlt || title),
      ...(safe.visual || {}),
    },
    design: {
      textAlign: safe.design?.textAlign || safe.layout?.align || "left",
      textPosition: safe.design?.textPosition || safe.layout?.textPosition || "center",
      textColor: safe.design?.textColor || "#1F2937",
      overlayOpacity: Number.isFinite(Number(safe.design?.overlayOpacity))
        ? Number(safe.design.overlayOpacity)
        : 0,
      sectionHeight: Number.isFinite(Number(safe.design?.sectionHeight || safe.layout?.height))
        ? Number(safe.design?.sectionHeight || safe.layout?.height)
        : 720,
      ...(safe.design || {}),
    },
  };
}

export function normalizeSections(sections = []) {
  if (!Array.isArray(sections)) return [];
  return sections.map((section, index) => normalizeSection(section, index));
}

export function normalizeDraft(draft) {
  if (!draft || typeof draft !== "object") return draft;
  return {
    ...draft,
    sectionSchemaVersion: SECTION_SCHEMA_VERSION,
    sections: normalizeSections(draft.sections),
  };
}
