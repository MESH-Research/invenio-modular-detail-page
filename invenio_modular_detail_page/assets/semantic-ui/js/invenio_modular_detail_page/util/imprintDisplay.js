/**
 * Imprint / journal values for the record detail page.
 *
 * Builds labeled-row values from raw custom fields (`imprint:imprint`,
 * `journal:journal`), not from condensed `ui.publishing_information` blobs.
 * Resource-type family only chooses citation source and slot; discrete
 * Place / ISBN / ISSN are always surfaced when present (layout decides rows).
 *
 * Citation fragments follow MLA container-segment conventions (not full
 * citations): italicized title, ``vol.`` / ``no.`` / ``p.``/``pp.``, year
 * before pages for journals; title, edition, pages for book containers.
 * No terminal period.
 */

import { resolveDisplayFamily } from "./detailDisplayFamilies";

/** @typedef {{ title?: string, pages?: string, place?: string, isbn?: string, edition?: string }} ImprintFields */

/** @typedef {{ title?: string, volume?: string|number, issue?: string|number, pages?: string, issn?: string }} JournalFields */

/**
 * @typedef {object} ImprintDisplay
 * @property {string|null} publishedIn Container or journal citation (HTML; title in ``<em>``).
 * @property {string|null} inProceedings Container citation for proceedings papers.
 * @property {string|null} isbn Discrete ISBN from imprint when present.
 * @property {string|null} issn Discrete ISSN from journal when present.
 * @property {string|null} place Discrete place from imprint when present.
 * @property {boolean} suppressPublicationDate Hide Publication date when year is already in Published in.
 */

/**
 * Read raw imprint fields from a record.
 *
 * @param {object} record
 * @returns {ImprintFields|null}
 */
function getImprint(record) {
  const imprint = record?.custom_fields?.["imprint:imprint"];
  if (!imprint || typeof imprint !== "object") {
    return null;
  }
  return imprint;
}

/**
 * Resource type id from metadata (preferred) or UI payload.
 *
 * @param {object} record
 * @returns {string|null}
 */
function getResourceTypeId(record) {
  return record?.metadata?.resource_type?.id || record?.ui?.resource_type?.id || null;
}

/**
 * True when a container title looks like a URL (legacy import noise).
 *
 * @param {string|null|undefined} title
 * @returns {boolean}
 */
function isUrlLike(title) {
  if (typeof title !== "string") {
    return false;
  }
  const trimmed = title.trim();
  if (!trimmed) {
    return false;
  }
  return /^(https?:\/\/|www\.)/i.test(trimmed);
}

/**
 * @param {unknown} value
 * @returns {string|null}
 */
function trimmedField(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  const asString = String(value).trim();
  return asString || null;
}

/**
 * Escape text for inclusion in HTML citation fragments.
 *
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * MLA page locator: ``p.`` for a single page, ``pp.`` for a range/list.
 *
 * @param {string} pages
 * @returns {string}
 */
function formatPagesLocator(pages) {
  const escaped = escapeHtml(pages);
  return /[-–—,;]/.test(pages) ? `pp. ${escaped}` : `p. ${escaped}`;
}

/**
 * Format a journal issue for an MLA container fragment.
 *
 * Numeric issues use ``no.`` (e.g. ``no. 2``). Seasonal or other non-numeric
 * labels are left bare (e.g. ``Spring``) so we do not emit ``no. Spring``.
 *
 * @param {string} issue
 * @returns {string}
 */
function formatIssuePart(issue) {
  const escaped = escapeHtml(issue);
  // Pure digits, optional single trailing letter (2a), optional leading zeros.
  if (/^\d+[a-zA-Z]?$/.test(issue)) {
    return `no. ${escaped}`;
  }
  return escaped;
}

/**
 * Format an edition for an MLA container fragment.
 *
 * Values that already look like an edition phrase (contain ``ed`` / ``edition``)
 * are used as-is; bare numbers or short labels get `` ed.`` appended
 * (e.g. ``2`` → ``2 ed.``, ``2nd ed.`` unchanged).
 *
 * @param {string} edition
 * @returns {string}
 */
function formatEditionPart(edition) {
  const escaped = escapeHtml(edition);
  if (/\bed\.?\b/i.test(edition) || /\bedition\b/i.test(edition)) {
    return escaped;
  }
  return `${escaped} ed.`;
}

/**
 * Format container citation as MLA fragment:
 * ``<em>Title</em>{, edition}{, p./pp. pages}``
 * Place/ISBN omitted (separate rows). Requires a non-URL title.
 * No terminal period — this is not a complete citation.
 *
 * Edition prefers ``editionOverride`` (KCWorks ``kcr:edition``) and falls
 * back to ``imprint.edition`` when present.
 *
 * @param {ImprintFields|null|undefined} imprint
 * @param {string|null|undefined} [editionOverride]
 * @returns {string|null}
 */
function formatContainerCitation(imprint, editionOverride) {
  if (!imprint || typeof imprint !== "object") {
    return null;
  }
  const title = trimmedField(imprint.title);
  if (!title || isUrlLike(title)) {
    return null;
  }

  const parts = [`<em>${escapeHtml(title)}</em>`];

  const edition =
    trimmedField(editionOverride) || trimmedField(imprint.edition);
  if (edition) {
    parts.push(formatEditionPart(edition));
  }

  const pages = trimmedField(imprint.pages);
  if (pages) {
    parts.push(formatPagesLocator(pages));
  }

  return parts.join(", ");
}

/**
 * @param {object} record
 * @returns {JournalFields|null}
 */
function getJournal(record) {
  const journal = record?.custom_fields?.["journal:journal"];
  if (!journal || typeof journal !== "object") {
    return null;
  }
  return journal;
}

/**
 * @param {object} record
 * @returns {string|null}
 */
function publicationYearFromRecord(record) {
  const pubDate = record?.metadata?.publication_date;
  if (typeof pubDate !== "string") {
    return null;
  }
  const match = pubDate.trim().match(/^(-?\d{4})/);
  return match ? match[1] : null;
}

/**
 * Journal Published-in as an MLA container fragment (not a full citation):
 * ``<em>Title</em>, vol. 10, no. 2, 2023, pp. 15-22``
 * Requires a journal title — volume, issue, pages, and year alone do not
 * produce a citation. Any subset of vol / year / pages with a title is fine.
 * Numeric issues use ``no.``; non-numeric issues (e.g. ``Spring``) are bare.
 * No ISSN (separate row). No terminal period.
 *
 * @param {JournalFields|null|undefined} journal
 * @param {string|null|undefined} publicationYear
 * @returns {string|null}
 */
function formatJournalCitation(journal, publicationYear) {
  if (!journal || typeof journal !== "object") {
    return null;
  }

  const title = trimmedField(journal.title);
  if (!title) {
    return null;
  }

  const parts = [`<em>${escapeHtml(title)}</em>`];

  const volume = trimmedField(journal.volume);
  if (volume) {
    parts.push(`vol. ${escapeHtml(volume)}`);
  }

  const issue = trimmedField(journal.issue);
  if (issue) {
    parts.push(formatIssuePart(issue));
  }

  const year = trimmedField(publicationYear);
  if (year) {
    parts.push(escapeHtml(year));
  }

  const pages = trimmedField(journal.pages);
  if (pages) {
    parts.push(formatPagesLocator(pages));
  }

  return parts.join(", ");
}

/**
 * @param {string|null|undefined} resourceTypeId
 * @param {Record<string, string>|null|undefined} familyMap
 * @returns {boolean}
 */
function isJournalLikeResourceType(resourceTypeId, familyMap) {
  return resolveDisplayFamily(resourceTypeId, familyMap) === "journal";
}

/**
 * Map a record to imprint/journal display values.
 *
 * Family selects citation source and slot (`publishedIn` vs `inProceedings`)
 * only. Discrete Place / ISBN / ISSN come from the raw fields when present;
 * layout subsections decide which of those rows appear.
 *
 * @param {object} record
 * @param {Record<string, string>|null|undefined} [familyMap]
 * @returns {ImprintDisplay}
 */
function imprintDisplayForRecord(record, familyMap) {
  const resourceTypeId = getResourceTypeId(record);
  const family = resolveDisplayFamily(resourceTypeId, familyMap);
  const imprint = getImprint(record);
  const journal = getJournal(record);

  let publishedIn = null;
  let inProceedings = null;
  let suppressPublicationDate = false;
  const kcrEdition = trimmedField(record?.custom_fields?.["kcr:edition"]);

  if (family === "journal") {
    const year = publicationYearFromRecord(record);
    publishedIn = formatJournalCitation(journal, year);
    suppressPublicationDate = Boolean(publishedIn && year);
  } else if (family === "book_section") {
    publishedIn = formatContainerCitation(imprint, kcrEdition);
  } else if (family === "proceedings_paper") {
    inProceedings = formatContainerCitation(imprint, kcrEdition);
  }

  return {
    publishedIn,
    inProceedings,
    isbn: trimmedField(imprint?.isbn),
    issn: trimmedField(journal?.issn),
    place: trimmedField(imprint?.place),
    suppressPublicationDate,
  };
}

export {
  getImprint,
  getResourceTypeId,
  isUrlLike,
  formatContainerCitation,
  formatJournalCitation,
  isJournalLikeResourceType,
  imprintDisplayForRecord,
};
