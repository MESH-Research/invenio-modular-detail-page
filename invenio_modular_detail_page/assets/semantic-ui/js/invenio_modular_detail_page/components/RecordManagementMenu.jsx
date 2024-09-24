import React, { useState } from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Button, Icon, Grid, Popup } from "semantic-ui-react";
import PropTypes from "prop-types";
import Overridable from "react-overridable";
import { NewVersionButton } from "@js/invenio_rdm_records/";
import { http } from "react-invenio-forms";
import { ShareModal } from "./ShareModal";

const ShareButton = ({
  disabled,
  recid,
  handleShareModalOpen,
  handleParentPopupClose,
  tabIndex,
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
          tabIndex={tabIndex}
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

export const EditButton = ({ recid, onError, tabIndex }) => {
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
      tabIndex={tabIndex}
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

const RecordManagementMenu = ({
  record,
  permissions,
  isDraft,
  isPreviewSubmissionRequest,
  currentUserId,
  handleShareModalOpen,
  handleParentPopupClose,
  tabIndex,
}) => {
  const [error, setError] = useState(null);
  const recid = record.id;

  const handleError = (errorMessage) => {
    console.error(errorMessage);
    setError(errorMessage);
  };

  return (
    <section
      id="record-manage-menu"
      aria-label={i18next.t("Record management")}
      class="ui"
    >
      <Grid columns={1} className="record-management" id="recordManagement">
        {permissions.can_edit && !isDraft && (
          <Grid.Column className="pb-5">
            <EditButton
              recid={recid}
              onError={handleError}
              tabIndex={tabIndex + 2}
            />
          </Grid.Column>
        )}
        {isPreviewSubmissionRequest && isDraft && (
          <Grid.Column className="pb-20">
            <Button
              fluid
              className="warning"
              size="medium"
              onClick={() => (window.location = `/uploads/${recid}`)}
              icon
              labelPosition="left"
              tabIndex={tabIndex + 4}
            >
              <Icon name="edit" />
              {i18next.t("Edit")}
            </Button>
          </Grid.Column>
        )}
        {!isPreviewSubmissionRequest && (
          <>
            <Grid.Column className="pt-5 pb-5">
              <NewVersionButton
                fluid
                size="medium"
                record={record}
                onError={handleError}
                disabled={!permissions.can_new_version}
                tabIndex={tabIndex + 6}
              />
            </Grid.Column>

            <Grid.Column className="pt-5">
              {permissions.can_manage && (
                <ShareButton
                  disabled={!permissions.can_update_draft}
                  recid={recid}
                  handleShareModalOpen={handleShareModalOpen}
                  handleParentPopupClose={handleParentPopupClose}
                  tabIndex={tabIndex + 8}
                />
              )}
            </Grid.Column>
          </>
        )}
        <Overridable
          id="InvenioAppRdm.RecordLandingPage.RecordManagement.container"
          isPreviewSubmissionRequest={isPreviewSubmissionRequest}
          record={record}
          currentUserId={currentUserId}
        />
        {error && (
          <Grid.Row className="record-management">
            <Grid.Column>
              <Message negative>{error}</Message>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
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
          basic
          tabIndex={40}
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
          tabIndex={40}
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
