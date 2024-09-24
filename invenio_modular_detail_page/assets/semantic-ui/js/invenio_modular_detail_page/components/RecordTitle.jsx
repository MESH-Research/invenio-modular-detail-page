import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";

const RecordTitle = ({ title, isPreviewSubmissionRequest }) => {
  return isPreviewSubmissionRequest ? null : (
    <section id="record-title-section" aria-label={i18next.t("Record title")}>
      <h1 id="record-title" className="ui header wrap-overflowing-text">
        {title}
      </h1>
    </section>
  );
};

export { RecordTitle };
