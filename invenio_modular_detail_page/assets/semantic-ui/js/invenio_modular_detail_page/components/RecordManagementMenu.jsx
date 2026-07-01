import React, { useState } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button, Icon, Popup } from "semantic-ui-react";
import PropTypes from "prop-types";
// import Overridable from "react-overridable";
// import { NewVersionButton } from "@js/invenio_rdm_records/";
import { http } from "react-invenio-forms";
import { RecordSidebarDropdown } from "./RecordSidebarDropdown";

/**
 * Deprecated share button
 */
const ShareButton = ({ disabled, recid, handleShareModalOpen, handleParentPopupClose }) => {
  const handleClick = () => {
    handleShareModalOpen();
    handleParentPopupClose();
  };
  return (
    <Popup
      content={i18next.t("You don't have permissions to share this record.")}
      disabled={!disabled}
      trigger={
        <Button
          fluid
          onClick={handleClick}
          disabled={disabled}
          primary
          size="medium"
          aria-haspopup="dialog"
          icon
          labelPosition="left"
        >
          <Icon name="share square" />
          {i18next.t("Share")}
        </Button>
      }
    />
  );
};

ShareButton.propTypes = {
  disabled: PropTypes.bool,
  recid: PropTypes.string.isRequired,
};

ShareButton.defaultProps = {
  disabled: false,
};

/**
 * Deprecated edit button
 */
export const EditButton = ({ recid, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await http.post(`/api/records/${recid}/draft`);
      window.location = `/uploads/${recid}`;
    } catch (error) {
      setLoading(false);
      onError(error.response.data.message);
    }
  };

  return (
    <Button
      fluid
      className="warning"
      size="medium"
      onClick={handleClick}
      loading={loading}
      icon
      labelPosition="left"
    >
      <Icon name="edit" />
      {i18next.t("Edit")}
    </Button>
  );
};

function RecordManagementMenuMobile({
  record,
  permissions,
  isDraft,
  isPreviewSubmissionRequest,
  currentUserId,
}) {
  return (
    <section id="mobile-record-management" className="ui grid tablet only mobile only">
      <div className="sixteen wide column right aligned">
        <button
          id="manage-record-btn"
          className="ui small basic icon button m-0"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <i className="cog icon"></i> Manage record
        </button>
      </div>

      <div id="recordManagementMobile" role="dialog" className="ui flowing popup transition hidden">
        <RecordManagementMenu
          record={record}
          permissions={permissions}
          isDraft={isDraft}
          isPreviewSubmissionRequest={isPreviewSubmissionRequest}
          currentUserId={currentUserId}
        />
      </div>
    </section>
  );
}

/**
 * Record management menu
 *
 * @param {boolean} asButton - Whether to render the dropdown as a button or not.
 * @param {string} classNames - Additional class names for the
 *    dropdown component.
 * @param {object} record - The record object.
 * @param {object} permissions - The permissions object.
 * @param {string} pointingDirection - The direction of the dropdown. The
 *    direction indicates the side of the dropdown menu on which the
 *    pointer triangle will be displayed. If the direction is "right",
 *    the pointer triangle will be displayed on the right side of the
 *    dropdown menu, but the menu will open on the *left* side of the
 *    trigger button.
 * @param {string} icon - The icon for the dropdown trigger button.
 * @param {boolean} isDraft - Whether the record is a draft or not.
 * @param {boolean} isPreviewSubmissionRequest - Whether the record is
 *    a preview submission request or not.
 * @param {string} currentUserId - The current user ID.
 * @param {function} handleShareModalOpen - The function to open the
 *    share modal.
 * @param {boolean} sidebarContainer - Wrap in `#record-management` sidebar container.
 */
const RecordManagementMenu = ({
  asButton = true,
  classNames,
  record,
  permissions,
  pointingDirection = "right",
  icon = "cog",
  isDraft,
  isPreviewSubmissionRequest,
  currentUserId,
  handleShareModalOpen,
  sidebarContainer = false,
}) => {
  const [error, setError] = useState(null);
  const recid = record.id;

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  const handleEditClick = async () => {
    if (!isDraft) {
      try {
        // Create a draft from the published record
        await http.post(`/api/records/${recid}/draft`);
        window.location = `/uploads/${recid}`;
      } catch (error) {
        handleError(error.response.data.message);
      }
    } else {
      window.location = `/uploads/${recid}`;
    }
  };

  const handleNewVersionClick = async () => {
    try {
      const response = await http.post(record.links.versions);
      window.location = response.data.links.self_html;
    } catch (error) {
      console.error(error);
      handleError(error.response.data.message);
    }
  };

  const handleShareClick = async () => {
    handleShareModalOpen();
  };

  const handleDropdownChange = (e, { value }) => {
    e.preventDefault();
    switch (value) {
      case "edit-published":
        handleEditClick();
        break;
      case "edit-draft":
        handleEditClick();
        break;
      case "new-version":
        handleNewVersionClick();
        break;
      case "share":
        handleShareClick();
        break;
    }
  };

  const options = [];

  if (permissions.can_edit && !isDraft) {
    options.push({
      key: "edit",
      text: i18next.t("Edit"),
      icon: "edit",
      value: "edit-published",
    });
  } else if (isPreviewSubmissionRequest && isDraft) {
    options.push({
      key: "edit",
      text: i18next.t("Edit"),
      icon: "edit",
      value: "edit-draft",
    });
  }

  if (!isPreviewSubmissionRequest && !isDraft && permissions.can_new_version) {
    options.push({
      key: "new-version",
      text: i18next.t("New version"),
      icon: "plus",
      value: "new-version",
    });
  }

  if (!isPreviewSubmissionRequest && permissions.can_manage) {
    options.push({
      key: "share",
      text: i18next.t("Share"),
      icon: "share",
      value: "share",
      disabled: !permissions.can_update_draft,
    });
  }

  if (options.length === 0 && !error) {
    return null;
  }

  return (
    <RecordSidebarDropdown
      asButton={asButton}
      classNames={classNames}
      sidebarContainer={sidebarContainer}
      containerId="record-management"
      sectionId="record-manage-menu"
      sectionAriaLabel={i18next.t("Record management")}
      dropdownId="record-management-dropdown"
      dropdownAriaLabel={i18next.t("Record management menu dropdown")}
      text={i18next.t("Edit or share")}
      icon={icon}
      pointingDirection={pointingDirection}
      options={options}
      onChange={handleDropdownChange}
      error={error}
    />
  );
};

const RecordManagementPopup = ({
  currentUserId,
  handleShareModalOpen,
  isDraft,
  isPreviewSubmissionRequest,
  record,
  permissions,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Popup
      id="record-management-popup"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      inline
      trigger={
        <Button
          fluid
          labelPosition="right"
          icon="cog"
          content="Manage this work"
          className="secondary basic"
        />
      }
      on="click"
      flowing
      content={
        <RecordManagementMenu
          record={record}
          permissions={permissions}
          isDraft={isDraft}
          isPreviewSubmissionRequest={isPreviewSubmissionRequest}
          currentUserId={currentUserId}
          handleShareModalOpen={handleShareModalOpen}
          handleParentPopupClose={handleClose}
          sectionIndex={50}
        />
      }
    />
  );
};

export {
  RecordManagementMenu,
  RecordManagementMenuMobile,
  RecordManagementPopup,
};
