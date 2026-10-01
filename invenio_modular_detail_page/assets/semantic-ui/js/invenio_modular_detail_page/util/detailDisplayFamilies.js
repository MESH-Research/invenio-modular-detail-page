/**
 * Resolve resource-type display families for modular detail layout.
 *
 * Layout config may supply `subsections` as a plain array (no family split)
 * or as `{ family: [...], default: [...] }`. Family membership is dumped
 * from the server as `detailDisplayTypeToFamily`.
 */

/** Fallback type→family map mirroring KCWorks `DETAIL_DISPLAY_TYPE_TO_FAMILY`. */
const FALLBACK_DETAIL_DISPLAY_TYPE_TO_FAMILY = {
  "textDocument-journalArticle": "journal",
  "textDocument-journal": "journal",
  "textDocument-abstract": "journal",
  "textDocument-legalComment": "journal",
  "textDocument-legalResponse": "journal",
  "textDocument-preprint": "journal",
  "textDocument-review": "journal",
  "other-peerReview": "journal",
  "textDocument-bookSection": "book_section",
  "textDocument-essay": "book_section",
  "textDocument-bibliography": "book_section",
  "textDocument-poeticWork": "book_section",
  "textDocument-proceedingsPaper": "proceedings_paper",
  "textDocument-book": "book",
  "textDocument-monograph": "book",
  "textDocument-conferenceProceeding": "book",
  "textDocument-musicalNotation": "book",
  "textDocument-thesis": "thesis",
};

const DEFAULT_FAMILY = "default";

/**
 * @param {string|null|undefined} resourceTypeId
 * @param {Record<string, string>|null|undefined} familyMap
 * @returns {string}
 */
function resolveDisplayFamily(resourceTypeId, familyMap) {
  const map =
    familyMap && Object.keys(familyMap).length > 0
      ? familyMap
      : FALLBACK_DETAIL_DISPLAY_TYPE_TO_FAMILY;
  if (!resourceTypeId) {
    return DEFAULT_FAMILY;
  }
  return map[resourceTypeId] || DEFAULT_FAMILY;
}

/**
 * Resolve family-keyed or plain subsection lists.
 *
 * @param {unknown} subsections Array (use as-is) or `{ family: array, default?: array }`
 * @param {string|null|undefined} resourceTypeId
 * @param {Record<string, string>|null|undefined} familyMap
 * @returns {Array}
 */
function resolveFamilySubsections(subsections, resourceTypeId, familyMap) {
  if (Array.isArray(subsections)) {
    return subsections;
  }
  if (!subsections || typeof subsections !== "object") {
    return [];
  }
  const family = resolveDisplayFamily(resourceTypeId, familyMap);
  const byFamily = /** @type {Record<string, unknown>} */ (subsections);
  const resolved = byFamily[family] ?? byFamily[DEFAULT_FAMILY] ?? [];
  return Array.isArray(resolved) ? resolved : [];
}

export {
  DEFAULT_FAMILY,
  FALLBACK_DETAIL_DISPLAY_TYPE_TO_FAMILY,
  resolveDisplayFamily,
  resolveFamilySubsections,
};
