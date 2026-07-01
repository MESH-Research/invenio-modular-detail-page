import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Message, Modal } from "semantic-ui-react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { http } from "react-invenio-forms";
import { APIRoutes } from "@js/invenio_app_rdm/administration/users/api/routes";
import { RecordSidebarDropdown } from "./RecordSidebarDropdown";

/**
 * Admin moderation flyout (manage record / user, deactivate / block user).
 *
 * @param {object} props
 * @param {string} props.recid - Record identifier.
 * @param {string} props.recordOwnerID - Record owner user id.
 * @param {boolean} props.sidebarContainer - Wrap in `#record-moderation` sidebar container.
 */
function RecordModerationMenu({ recid, recordOwnerID, sidebarContainer = false }) {
  const [confirmAction, setConfirmAction] = useState(null);

  const options = [
    {
      key: "manage-record",
      text: i18next.t("Manage record"),
      icon: "file alternate",
      value: "manage-record",
    },
    {
      key: "manage-user",
      text: i18next.t("Manage user"),
      icon: "user",
      value: "manage-user",
    },
  ];

  if (recordOwnerID) {
    options.push({
      key: "deactivate-user",
      text: i18next.t("Deactivate user"),
      icon: "pause",
      value: "deactivate-user",
      className: "warning",
    });
    options.push({
      key: "block-user",
      text: i18next.t("Block user"),
      icon: "ban",
      value: "block-user",
      className: "error",
    });
  }

  const handleDropdownChange = (e, { value }) => {
    e.preventDefault();
    switch (value) {
      case "manage-record":
        window.open(`/administration/records?q=id:${recid}`, "_blank");
        break;
      case "manage-user":
        window.open(`/administration/users?q=id:${recordOwnerID}`, "_blank");
        break;
      case "deactivate-user":
        setConfirmAction("deactivate");
        break;
      case "block-user":
        setConfirmAction("block");
        break;
      default:
        break;
    }
  };

  const handleConfirmClose = () => setConfirmAction(null);

  const handleConfirm = () => {
    if (confirmAction === "block") {
      http.post(APIRoutes.block({ id: recordOwnerID }));
    } else if (confirmAction === "deactivate") {
      http.post(APIRoutes.deactivate({ id: recordOwnerID }));
    }
    handleConfirmClose();
  };

  const confirmConfig =
    confirmAction === "block"
      ? {
          title: i18next.t("Block User"),
          warning: i18next.t("Blocking the user will delete all existing records of the user."),
          confirmLabel: i18next.t("Block"),
          confirmColor: "red",
          confirmIcon: "warning",
        }
      : confirmAction === "deactivate"
        ? {
            title: i18next.t("Deactivate User"),
            warning: i18next.t(
              "Deactivating the user will suspend their account. They will not be able to sign in until the account is activated again."
            ),
            confirmLabel: i18next.t("Deactivate"),
            confirmColor: "orange",
            confirmIcon: "pause",
          }
        : null;

  return (
    <RecordSidebarDropdown
      sidebarContainer={sidebarContainer}
      containerId="record-moderation"
      sectionId="record-moderation-menu"
      sectionAriaLabel={i18next.t("Record moderation")}
      dropdownId="record-moderation-dropdown"
      dropdownAriaLabel={i18next.t("Record moderation menu dropdown")}
      text={i18next.t("Moderation")}
      options={options}
      onChange={handleDropdownChange}
    >
      {recordOwnerID && confirmConfig ? (
        <Modal open closeIcon onClose={handleConfirmClose} role="dialog" closeOnDimmerClick={false}>
          <Modal.Header as="h2">{confirmConfig.title}</Modal.Header>
          <Modal.Description>
            <Message warning icon="warning sign" content={confirmConfig.warning} />
          </Modal.Description>
          <Modal.Actions>
            <Button onClick={handleConfirmClose} floated="left">
              {i18next.t("Cancel")}
            </Button>
            <Button
              size="small"
              labelPosition="left"
              icon={confirmConfig.confirmIcon}
              color={confirmConfig.confirmColor}
              content={confirmConfig.confirmLabel}
              onClick={handleConfirm}
            />
          </Modal.Actions>
        </Modal>
      ) : null}
    </RecordSidebarDropdown>
  );
}

RecordModerationMenu.propTypes = {
  recid: PropTypes.string.isRequired,
  recordOwnerID: PropTypes.string,
  sidebarContainer: PropTypes.bool,
};

RecordModerationMenu.defaultProps = {
  recordOwnerID: "",
  sidebarContainer: false,
};

export { RecordModerationMenu };
