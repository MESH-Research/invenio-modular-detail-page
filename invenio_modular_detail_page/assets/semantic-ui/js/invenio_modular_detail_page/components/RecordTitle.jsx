import React, { useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { DetailContext } from "../contexts/DetailContext";

const RecordTitle = () => {
  const contextStore = useContext(DetailContext);
  return contextStore.isPreviewSubmissionRequest ? null : (
    <section id="record-title-section" aria-label={i18next.t("Record title")}>
      <h1 id="record-title" className="ui header wrap-overflowing-text">
        {contextStore.title}
      </h1>
    </section>
  );
};

export { RecordTitle };
