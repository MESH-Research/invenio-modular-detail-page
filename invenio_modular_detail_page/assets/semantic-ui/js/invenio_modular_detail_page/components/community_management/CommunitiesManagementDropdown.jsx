// This file is part of InvenioRDM
// Copyright (C) 2023 CERN.
// Copyright (C) 2024 KTH Royal Institute of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { PendingCommunitiesModal } from "./PendingCommunitiesModal";
import { RecordCommunitySubmissionModal } from "./RecordCommunitySubmissionModal";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown, Icon } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { SuccessIcon } from "@js/invenio_communities/members";

export class CommunitiesManagementDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submissionModalOpen: false,
      pendingRequestModalOpen: false,
      visibleSuccessAction: false,
      actionFeedback: "",
    };
    this.dropdownRef = React.createRef();
  }

  focusDropdownRef = () => {
    // A11y: Bring focus to the dropdown menu (e.g. when the modal closes)
    const {
      current: {
        ref: { current: dropdownToggle },
      },
    } = this.dropdownRef;
    dropdownToggle.focus();
  };

  handleSuccessAction = (data, text) => {
    const { actionSucceed } = this.props;
    this.setState({ actionFeedback: text, visibleSuccessAction: false });
    this.toggleSubmissionModal(false);
    this.togglePendingRequestsModal(false);
    this.setState({ visibleSuccessAction: true });
    this.focusDropdownRef();

    actionSucceed();
  };

  toggleSubmissionModal = (value) => {
    this.setState({ submissionModalOpen: value });
    if (!value) this.focusDropdownRef();
  };

  togglePendingRequestsModal = (value) => {
    this.setState({ pendingRequestModalOpen: value });
    if (!value) this.focusDropdownRef();
  };

  handleChange = (event, data) => {
    // A11y: Needed to trigger keyboard events as well as click events
    const { toggleManageCommunitiesModal } = this.props;

    switch (data.value) {
      case "submit-to-community":
        this.toggleSubmissionModal(true);
        break;
      case "pending-submissions":
        this.togglePendingRequestsModal(true);
        break;
      case "manage-communities":
        toggleManageCommunitiesModal(true);
        break;
      default:
        return;
    }
  };

  render() {
    const {
      visibleSuccessAction,
      submissionModalOpen,
      actionFeedback,
      pendingRequestModalOpen,
    } = this.state;

    const {
      userCommunitiesMemberships,
      searchConfig,
      recordCommunitySearchConfig,
      recordCommunityEndpoint,
      recordUserCommunitySearchConfig,
      record,
      communities,
      setDefaultCommunity,
      handleCommunityRemoval,
      direction,
      classNames,
      sectionIndex,
    } = this.props;

    const options = [
      {
        id: "submit-to-community",
        value: "submit-to-community",
        text: i18next.t("Submit to a collection"),
        icon: "plus",
      },
      {
        id: "pending-submissions",
        value: "pending-submissions",
        text: i18next.t("Pending submissions"),
        icon: "comments outline",
      },
      {
        id: "manage-communities",
        value: "manage-communities",
        text: i18next.t("Manage collections"),
        icon: "settings",
      },
    ];

    let pointingDirection;

    switch (direction) {
      case "left":
        pointingDirection = "right";
        break;
      case "right":
        pointingDirection = "left";
        break;
      case "bottom":
        pointingDirection = "top";
        break;
      default:
        pointingDirection = direction;
    }

    return (
      <>
        {/* {visibleSuccessAction && (
          <div className="flex align-items-baseline ml-auto rel-mr-1 green-color">
            <SuccessIcon
              timeOutDelay={5000}
              show={visibleSuccessAction}
              content={
                <div
                  role="alert"
                  className="half-width sub header small text size truncated"
                >
                  {actionFeedback}
                </div>
              }
            />
          </div>
        )} */}
        {!record.is_draft && (
          <Dropdown
            ref={this.dropdownRef}
            id="modal-dropdown"
            className={`manage-menu-dropdown fluid secondary sidebar-secondary pl-15 pr-5 ${classNames}`}
            aria-label={i18next.t("Collection management menu dropdown")}
            closeOnChange
            options={communities.length > 0 ? options : options.slice(0, 2)}
            onChange={this.handleChange}
            selectOnBlur={false}
            selectOnNavigation={false}
            floating
            labeled
            pointing={pointingDirection}
            icon={communities.length > 0 ? "cog" : "plus"}
            value={null} // A11y: needed to trigger the onChange (-triggers both mouse & keyboard) event on every select
            tabIndex={sectionIndex + 2}
            trigger={
              communities.length > 0 ? (
                <>
                  <span className="manage-collections-text mobile tablet only">
                    {i18next.t("Manage collections for this work")}
                  </span>
                  <span className="manage-collections-text computer only">
                    {i18next.t("Manage collections")}
                  </span>
                  <span className="manage-collections-text widescreen large monitor only">
                    {i18next.t("Manage collections for this work")}
                  </span>
                </>
              ) : (
                <>
                  <span className="manage-collections-text mobile tablet only">
                    {i18next.t("Submit this work to a collection")}
                  </span>
                  <span className="manage-collections-text computer only">
                    {i18next.t("Submit to a collection")}
                  </span>
                  <span className="manage-collections-text widescreen large monitor only">
                    {i18next.t("Submit this work to a collection")}
                  </span>
                </>
              )
            }
          />
        )}

        <RecordCommunitySubmissionModal
          modalOpen={submissionModalOpen}
          userCommunitiesMemberships={userCommunitiesMemberships}
          toggleModal={this.toggleSubmissionModal}
          handleClose={() => this.toggleSubmissionModal(false)}
          handleSuccessAction={this.handleSuccessAction}
          recordCommunityEndpoint={recordCommunityEndpoint}
          recordCommunitySearchConfig={recordCommunitySearchConfig}
          recordUserCommunitySearchConfig={recordUserCommunitySearchConfig}
          record={record}
        />
        <PendingCommunitiesModal
          modalOpen={pendingRequestModalOpen}
          handleOnOpen={() => this.togglePendingRequestsModal(true)}
          handleOnClose={() => this.togglePendingRequestsModal(false)}
          successActionCallback={this.handleSuccessAction}
          searchConfig={searchConfig}
        />
      </>
    );
  }
}

CommunitiesManagementDropdown.propTypes = {
  userCommunitiesMemberships: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.string.isRequired,
  recordCommunitySearchConfig: PropTypes.string.isRequired,
  recordUserCommunitySearchConfig: PropTypes.string.isRequired,
  toggleManageCommunitiesModal: PropTypes.func.isRequired,
  actionSucceed: PropTypes.func,
  searchConfig: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
};

CommunitiesManagementDropdown.defaultProps = {
  actionSucceed: undefined,
};
