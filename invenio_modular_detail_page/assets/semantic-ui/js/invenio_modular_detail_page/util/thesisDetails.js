import { i18next } from "@translations/invenio_modular_detail_page/i18next";

/** @typedef {"university" | "department" | "type" | "date_submitted" | "date_defended"} ThesisFieldKey */

/**
 * Display labels for `thesis:thesis` subfields on the record detail page.
 *
 * @type {Record<ThesisFieldKey, string>}
 */
export const THESIS_DETAIL_FIELD_LABELS = {
  university: () => i18next.t("Awarding university"),
  department: () => i18next.t("Awarding department"),
  type: () => i18next.t("Thesis type"),
  date_submitted: () => i18next.t("Submission date"),
  date_defended: () => i18next.t("Defense date"),
};

/**
 * Read a thesis detail value from upstream nested custom fields, with legacy
 * fallbacks where KCWorks fields overlapped the upstream model.
 *
 * @param {object} record
 * @param {ThesisFieldKey} field
 * @returns {string|null}
 */
export function getThesisFieldValue(record, field) {
  const customFields = record?.custom_fields ?? {};
  const thesis = customFields["thesis:thesis"];

  if (thesis && typeof thesis === "object") {
    const value = thesis[field];
    if (value) {
      return value;
    }
  }

  if (field === "university") {
    const legacyUniversity = customFields["thesis:university"];
    if (typeof legacyUniversity === "string" && legacyUniversity) {
      return legacyUniversity;
    }
  }

  if (field === "department") {
    return customFields["kcr:institution_department"] || null;
  }

  if (field === "type") {
    return customFields["kcr:degree"] || null;
  }

  return null;
}
