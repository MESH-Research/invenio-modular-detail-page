import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Icon, Message, Modal } from "semantic-ui-react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { http } from "react-invenio-forms";
import { APIRoutes } from "@js/invenio_app_rdm/administration/users/api/routes";
import { ShareModal } from "../components/ShareModal";

/**
 * Sticky-bar Manage dropdown: edit/share actions as top-level items, plus an
 * optional Moderation submenu when the user can moderate.
 *
 * @param {object} props
 * @param {boolean} props.groupsEnabled - Whether group sharing is enabled.
 * @param {boolean} props.isDraft - Whether the record is a draft.
 * @param {boolean} props.isPreviewSubmissionRequest - Preview submission request.
 * @param {object} props.permissions - Record permissions.
 * @param {object} props.record - Record object.
 * @param {string} props.recordOwnerId - Record owner user id.
 */
const DetailMobileManageMenu = ({
  groupsEnabled,
  isDraft,
  isPreviewSubmissionRequest,
  permissions,
  record,
  recordOwnerId = "",
}) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [error, setError] = useState(null);

  const recid = record.id;
  const canModerate = !!permissions?.can_moderate;

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  const handleEditClick = async () => {
    if (!isDraft) {
      try {
        await http.post(`/api/records/${recid}/draft`);
        window.location = `/uploads/${recid}`;
      } catch (err) {
        handleError(err.response?.data?.message || err.message);
      }
    } else {
      window.location = `/uploads/${recid}`;
    }
  };

  const handleNewVersionClick = async () => {
    try {
      const response = await http.post(record.links.versions);
      window.location = response.data.links.self_html;
    } catch (err) {
      console.error(err);
      handleError(err.response?.data?.message || err.message);
    }
  };

  const handleShareModalOpen = () => setShareModalOpen(true);
  const handleShareModalClose = () => setShareModalOpen(false);

  const handleConfirmClose = () => setConfirmAction(null);

  const handleConfirm = () => {
    if (confirmAction === "block") {
      http.post(APIRoutes.block({ id: recordOwnerId }));
    } else if (confirmAction === "deactivate") {
      http.post(APIRoutes.deactivate({ id: recordOwnerId }));
    }
    handleConfirmClose();
  };

  const managementItems = [];

  if (permissions?.can_edit && !isDraft) {
    managementItems.push({
      key: "edit",
      icon: "edit",
      text: i18next.t("Edit"),
      onClick: handleEditClick,
    });
  } else if (isPreviewSubmissionRequest && isDraft) {
    managementItems.push({
      key: "edit",
      icon: "edit",
      text: i18next.t("Edit"),
      onClick: handleEditClick,
    });
  }

  if (!isPreviewSubmissionRequest && !isDraft && permissions?.can_new_version) {
    managementItems.push({
      key: "new-version",
      icon: "plus",
      text: i18next.t("New version"),
      onClick: handleNewVersionClick,
    });
  }

  if (!isPreviewSubmissionRequest && permissions?.can_manage) {
    managementItems.push({
      key: "share",
      icon: "share",
      text: i18next.t("Share"),
      disabled: !permissions?.can_update_draft,
      onClick: handleShareModalOpen,
    });
  }

  if (managementItems.length === 0 && !canModerate && !error) {
    return null;
  }

  const confirmConfig =
    confirmAction === "block"
      ? {
          title: i18next.t("Block User"),
          warning: i18next.t(
            "Blocking the user will delete all existing records of the user."
          ),
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
    <>
      {/* Keep modals outside the dropdown so closing the menu does not unmount them. */}
      {permissions?.can_manage ? (
        <ShareModal
          open={shareModalOpen}
          handleClose={handleShareModalClose}
          record={record}
          permissions={permissions}
          groupsEnabled={groupsEnabled}
        />
      ) : null}
      {recordOwnerId && confirmConfig ? (
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

      <Dropdown
        as="button"
        id="record-details-manage"
        className="pointing"
        aria-label={i18next.t("Manage record")}
        aria-haspopup="menu"
        basic
        floating
        pointing="bottom"
        button={false}
        fluid={false}
        item
        icon={null}
        openOnFocus={false}
        closeOnBlur
        selectOnBlur={false}
        selectOnNavigation={false}
        text={
          <>
            <Icon name="cog" />
            {i18next.t("Manage")}
          </>
        }
      >
        <Dropdown.Menu>
          {managementItems.map((item) => (
            <Dropdown.Item
              key={item.key}
              icon={item.icon}
              text={item.text}
              disabled={item.disabled}
              onClick={item.onClick}
            />
          ))}
          {canModerate ? (
            <Dropdown
              item
              icon={null}
              text={
                <>
                  <Icon name="user secret" />
                  {i18next.t("Moderation")}
                </>
              }
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  icon="file alternate"
                  text={i18next.t("Manage record")}
                  onClick={() =>
                    window.open(`/administration/records?q=id:${recid}`, "_blank")
                  }
                />
                <Dropdown.Item
                  icon="user"
                  text={i18next.t("Manage user")}
                  onClick={() =>
                    window.open(
                      `/administration/users?q=id:${recordOwnerId}`,
                      "_blank"
                    )
                  }
                />
                {recordOwnerId ? (
                  <>
                    <Dropdown.Item
                      className="warning"
                      icon="pause"
                      text={i18next.t("Deactivate user")}
                      onClick={() => setConfirmAction("deactivate")}
                    />
                    <Dropdown.Item
                      className="error"
                      icon="ban"
                      text={i18next.t("Block user")}
                      onClick={() => setConfirmAction("block")}
                    />
                  </>
                ) : null}
              </Dropdown.Menu>
            </Dropdown>
          ) : null}
          {error ? (
            <Dropdown.Item disabled>
              <Message negative size="tiny" content={error} />
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

DetailMobileManageMenu.propTypes = {
  groupsEnabled: PropTypes.bool,
  isDraft: PropTypes.bool,
  isPreviewSubmissionRequest: PropTypes.bool,
  permissions: PropTypes.object,
  record: PropTypes.object.isRequired,
  recordOwnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { DetailMobileManageMenu };
