import React, { useState, useRef } from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Button, Icon, Grid, Message, Popup, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";
// import Overridable from "react-overridable";
// import { NewVersionButton } from "@js/invenio_rdm_records/";
import { http } from "react-invenio-forms";
import { ShareModal } from "./ShareModal";

/**
 * Deprecated share button
 */
const ShareButton = ({
  disabled,
  recid,
  handleShareModalOpen,
  handleParentPopupClose,
}) => {
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
    <section
      id="mobile-record-management"
      className="ui grid tablet only mobile only"
    >
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

      <div
        id="recordManagementMobile"
        role="dialog"
        className="ui flowing popup transition hidden"
      >
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
 */
const RecordManagementMenu = ({
  asButton=true,
  classNames,
  record,
  permissions,
  pointingDirection="right",
  icon="cog",
  isDraft,
  isPreviewSubmissionRequest,
  currentUserId,
  handleShareModalOpen,
}) => {
  const [error, setError] = useState(null);
  const recid = record.id;
  const [editLoading, setEditLoading] = useState(false);
  const [newVersionLoading, setNewVersionLoading] = useState(false);
  const dropdownRef = useRef(null);

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  const handleEditClick = async () => {
    setEditLoading(true);
    if (!isDraft) {
      try {
        // Create a draft from the published record
        await http.post(`/api/records/${recid}/draft`);
        window.location = `/uploads/${recid}`;
      } catch (error) {
        setEditLoading(false);
        handleError(error.response.data.message);
      }
    } else {
      window.location = `/uploads/${recid}`;
    }
  };

  const handleNewVersionClick = async () => {
    setNewVersionLoading(true);
    try {
      const response = await http.post(record.links.versions);
      window.location = response.data.links.self_html;
    } catch (error) {
      console.error(error);
      setNewVersionLoading(false);
      handleError(error.response.data.message);
    }
  };

  const handleShareClick = async () => {
    handleShareModalOpen();
  };

  console.log("permissions", permissions);

  const handleDropdownChange = (e, { value }) => {
    e.preventDefault();
    console.log("value", value);
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
    options.push({ key: "edit", text: i18next.t("Edit"), icon: "edit", value: "edit-published" });
  } else if (isPreviewSubmissionRequest && isDraft) {
    options.push({ key: "edit", text: i18next.t("Edit"), icon: "edit", value: "edit-draft" });
  }

  if (!isPreviewSubmissionRequest && !isDraft && permissions.can_new_version) {
    options.push({ key: "new-version", text: i18next.t("New version"), icon: "plus", value: "new-version" });
  }

  if (!isPreviewSubmissionRequest && permissions.can_manage && permissions.can_update_draft) {
    options.push({ key: "share", text: i18next.t("Share"), icon: "share", value: "share" });
  }

  const focusDropdownRef = () => {
    const {
      current: {
        ref: { current: dropdownToggle },
      },
    } = dropdownRef;
    dropdownToggle.focus();
  };

  return (
    <section
      id="record-manage-menu"
      aria-label={i18next.t("Record management")}
      className="ui"
    >
      <Dropdown
        ref={dropdownRef}
        as={asButton ? "button" : undefined}
        id="record-management-dropdown"
        className={`button record-management-dropdown fluid secondary sidebar-secondary icon ${classNames}`}
        options={options}
        aria-label={i18next.t("Record management menu dropdown")}
        aria-haspopup="menu"
        basic
        pointing={pointingDirection}
        closeOnChange
        floating
        closeOnBlur={true}
        openOnFocus={false}
        selectOnBlur={false}
        selectOnNavigation={false}
        onChange={handleDropdownChange}
        icon={icon}
        value={null} // A11y: needed to trigger the onChange (-triggers both mouse & keyboard) event on every select
        text={i18next.t("Manage this work")}
      />
      {/* <Grid columns={1} className="record-management" id="recordManagement"> */}
        {/* {permissions.can_edit && !isDraft && (
          <Grid.Column className="pb-5">
            <EditButton
              recid={recid}
              onError={handleError}
            />
          </Grid.Column>
        )} */}
        {/* {isPreviewSubmissionRequest && isDraft && (
          <Grid.Column className="pb-20">
            <Button
              fluid
              className="warning"
              size="medium"
              onClick={() => (window.location = `/uploads/${recid}`)}
              icon
              labelPosition="left"
            >
              <Icon name="edit" />
              {i18next.t("Edit")}
            </Button>
          </Grid.Column>
        )} */}
        {/* {!isPreviewSubmissionRequest && (
          <>
            <Grid.Column className="pt-5 pb-5">
              <NewVersionButton
                fluid
                size="medium"
                record={record}
                onError={handleError}
                disabled={!permissions.can_new_version}
              />
            </Grid.Column>

            <Grid.Column className="pt-5">
              {permissions.can_manage && (
                <ShareButton
                  disabled={!permissions.can_update_draft}
                  recid={recid}
                  handleShareModalOpen={handleShareModalOpen}
                  handleParentPopupClose={handleParentPopupClose}
                />
              )}
            </Grid.Column>
          </>
        )} */}
        {/* <Overridable
          id="InvenioAppRdm.RecordLandingPage.RecordManagement.container"
          isPreviewSubmissionRequest={isPreviewSubmissionRequest}
          record={record}
          currentUserId={currentUserId}
        /> */}
        {error && (
          <Grid.Row className="record-management">
            <Grid.Column>
              <Message negative>{error}</Message>
            </Grid.Column>
          </Grid.Row>
        )}
      {/* </Grid> */}
    </section>
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
