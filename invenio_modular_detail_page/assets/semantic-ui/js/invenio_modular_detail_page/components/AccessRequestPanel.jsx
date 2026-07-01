import React, { useContext } from "react";
import { Divider } from "semantic-ui-react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { AccessRequestForm } from "@js/invenio_app_rdm/landing_page/AccessRequestForm";
import { DetailContext } from "../contexts/DetailContext";

/**
 * Viewer-facing access request form (upstream landing-page parity).
 *
 * Renders when the record has files, the viewer cannot read them, and the
 * owner has enabled user or guest access requests.
 */
function AccessRequestPanel() {
  const {
    acceptConditionsText,
    record,
    showAccessRequestForm,
    userAnonymous,
    userAvatar,
    userEmail,
    userFullName,
  } = useContext(DetailContext);

  if (!showAccessRequestForm) {
    return null;
  }

  return (
    <>
      <Divider />
      <h4>{i18next.t("Request access")}</h4>
      <p>
        {i18next.t(
          "If you would like to request access to these files, please fill out the form below."
        )}
      </p>
      {acceptConditionsText ? (
        <>
          <p className="ui small header rel-mt-2 rel-mb-1">
            {i18next.t(
              "You need to satisfy these conditions in order for this request to be accepted:"
            )}
          </p>
          <div
            className="rel-mt-2 rich-input-content"
            dangerouslySetInnerHTML={{ __html: acceptConditionsText }}
          />
        </>
      ) : null}
      {userAnonymous ? (
        <p className="rel-mb-2">
          <i aria-hidden="true" className="user secret icon"></i>
          <strong>{i18next.t("You are currently not logged in")}</strong>.{" "}
          {i18next.t("Do you have an account?")}{" "}
          <a href="/login/">{i18next.t("Log in here")}</a>
        </p>
      ) : (
        <>
          <h4>{i18next.t("You are logged in as")}</h4>
          <div className="flex align-items-center column-mobile mb-10">
            {userAvatar ? (
              <div className="ui image label mb-10 rel-mr-1">
                <img src={userAvatar} alt="" />
                <strong className="text-muted mr-5">{userFullName}</strong>
              </div>
            ) : (
              <strong className="text-muted mr-5 rel-mb-1">{userFullName}</strong>
            )}
            <p className="mt-0 mb-10">
              {i18next.t("Not you?")}{" "}
              <a href="/login/">{i18next.t("Log out")}</a>{" "}
              {i18next.t("to switch account.")}
            </p>
          </div>
        </>
      )}
      <AccessRequestForm
        record={record}
        email={userEmail || ""}
        fullName={userFullName || ""}
        isAnonymous={userAnonymous}
      />
    </>
  );
}

export { AccessRequestPanel };
