import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Button } from "semantic-ui-react";

const DraftBackButton = ({
  backPage,
  isPreview,
  isDraft,
  canManage,
  isPreviewSubmissionRequest,
  show,
}) => {
  return isPreview && !isPreviewSubmissionRequest && canManage && isDraft ? (
    <nav
      className={`back-navigation rel-pb-2 pl-0 ${show} sidebar-container`}
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
