import React, { useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button } from "semantic-ui-react";
import { DetailContext } from "../contexts/DetailContext";

const DraftBackButton = ({ show }) => {

  const contextStore = useContext(DetailContext);

  const backPage = `${contextStore.backPage}?depositFormPage=page-7`;
  const isPreview = contextStore.isPreview;
  const isDraft = contextStore.isDraft;
  const canManage = contextStore.canManage;
  const isPreviewSubmissionRequest = contextStore.isPreviewSubmissionRequest;

  return isPreview && !isPreviewSubmissionRequest && canManage && isDraft ? (
    <nav
      className={`back-navigation rel-pb-2 pl-0 pr-0 ${show} sidebar-container`}
      aria-label={i18next.t("Back-navigation")}
    >
        <Button
          fluid
          labelPosition="right"
          icon="angle left"
          content={i18next.t("Back to edit")}
          className="secondary basic"
          onClick={() => {
            window.location.href = backPage;
          }}
        />
    </nav>
  ) : (
    null
  );
};

export { DraftBackButton };
