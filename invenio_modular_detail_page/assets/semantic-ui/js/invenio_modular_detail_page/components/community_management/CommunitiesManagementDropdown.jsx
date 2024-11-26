// This file is part of InvenioRDM
// Copyright (C) 2023 CERN.
// Copyright (C) 2024 KTH Royal Institute of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useRef, useState } from "react";
import { PendingCommunitiesModal } from "./PendingCommunitiesModal";
import { RecordCommunitySubmissionModal } from "./RecordCommunitySubmissionModal";
import { RecordCommunitiesListModal } from "./RecordCommunitiesListModal";
import { Dropdown, Icon } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
// import { SuccessIcon } from "@js/invenio_communities/members";
import PropTypes from "prop-types";

const CommunitiesManagementDropdown = ({
  classNames="",
  communities,
  direction,
  getCommunities,
  handleCommunityRemoval,
  handleDefaultCommunityChange,
  permissions,
  record,
  recordCommunityEndpoint,
  recordCommunitySearchConfig,
  recordUserCommunitySearchConfig,
  searchConfig,
  userCommunitiesMemberships,
}) => {
  const [manageCommunitiesModalOpen, setManageCommunitiesModalOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [pendingRequestModalOpen, setPendingRequestModalOpen] = useState(false);
  const [visibleSuccessAction, setVisibleSuccessAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState("");
  const dropdownRef = useRef(null);

  const focusDropdownRef = () => {
    // A11y: Bring focus to the dropdown menu (e.g. when the modal closes)
    console.log("focusDropdownRef");
    console.log(dropdownRef);
    const {
      current: {
        ref: { current: dropdownToggle },
      },
    } = dropdownRef;
    dropdownToggle.focus();
  };

  const toggleSubmissionModal = (value) => {
    setSubmissionModalOpen(value);
    if (!value) focusDropdownRef();
  };

  const togglePendingRequestsModal = (value) => {
    setPendingRequestModalOpen(value);
    if (!value) focusDropdownRef();
  };

  const toggleManageCommunitiesModal = (value) => {
    setManageCommunitiesModalOpen(value);
    if (!value) focusDropdownRef();
  };

  const handleActionSucceed = (data, text) => {
    console.log("handleActionSucceed", data, text);
    setActionFeedback(text);
    getCommunities();
    toggleSubmissionModal(false);
    togglePendingRequestsModal(false);
    setVisibleSuccessAction(true);
  };

  const handleManageActionSucceed = (data, text) => {
    console.log("handleManageActionSucceed", data, text);
    getCommunities();
    toggleManageCommunitiesModal(false);
  };

  const handleChange = (event, data) => {
    // A11y: Needed to trigger keyboard events as well as click events

    switch (data.value) {
      case "submit-to-community":
        toggleSubmissionModal(true);
        break;
      case "pending-submissions":
        togglePendingRequestsModal(true);
        break;
      case "manage-communities":
        toggleManageCommunitiesModal(true);
        break;
      default:
        return;
    }
  };

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
          ref={dropdownRef}
          as="button"
          id="modal-dropdown"
          className={`button manage-menu-dropdown fluid secondary sidebar-secondary icon ${classNames}`}
          aria-label={i18next.t("Collection management menu dropdown")}
          aria-haspopup="menu"
          basic
          pointing={pointingDirection}
          closeOnChange
          floating
          options={communities.length > 0 ? options : options.slice(0, 2)}
          closeOnBlur={true}
          openOnFocus={false}
          selectOnBlur={false}
          selectOnNavigation={false}
          onChange={handleChange}
          icon={communities.length > 0 ? "cog" : "plus"}
          value={null} // A11y: needed to trigger the onChange (-triggers both mouse & keyboard) event on every select
          trigger={
            communities.length > 0 ? (
              <>
                <span className="manage-collections-text mobile tablet only">
                  {i18next.t("Manage collections for this work")}
                </span>
                <span className="manage-collections-text computer only">
                  {i18next.t("Manage collections")}
                </span>
                <span className="manage-collections-text widescreen large-monitor only">
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
                <span className="manage-collections-text widescreen large-monitor only">
                  {i18next.t("Submit this work to a collection")}
                </span>
              </>
            )
          }
        />
      )}

      <RecordCommunitiesListModal
        id="record-communities-list-modal"
        modalOpen={manageCommunitiesModalOpen}
        handleOnOpen={() => toggleManageCommunitiesModal(true)}
        handleOnClose={() => toggleManageCommunitiesModal(false)}
        successActionCallback={handleManageActionSucceed}
        recordCommunityEndpoint={recordCommunityEndpoint}
        permissions={permissions}
        record={record}
        handleDefaultCommunityChange={handleDefaultCommunityChange}
        handleCommunityRemoval={handleCommunityRemoval}
      />
      <RecordCommunitySubmissionModal
        modalOpen={submissionModalOpen}
        userCommunitiesMemberships={userCommunitiesMemberships}
        toggleModal={toggleSubmissionModal}
        handleClose={() => toggleSubmissionModal(false)}
        handleSuccessAction={handleActionSucceed}
        recordCommunityEndpoint={recordCommunityEndpoint}
        recordCommunitySearchConfig={recordCommunitySearchConfig}
        recordUserCommunitySearchConfig={recordUserCommunitySearchConfig}
        record={record}
      />
      <PendingCommunitiesModal
        modalOpen={pendingRequestModalOpen}
        handleOnOpen={() => togglePendingRequestsModal(true)}
        handleOnClose={() => togglePendingRequestsModal(false)}
        successActionCallback={handleActionSucceed}
        searchConfig={searchConfig}
      />
    </>
  );
}

CommunitiesManagementDropdown.propTypes = {
  classNames: PropTypes.string,
  communities: PropTypes.array.isRequired,
  direction: PropTypes.string,
  getCommunities: PropTypes.func.isRequired,
  handleCommunityRemoval: PropTypes.func.isRequired,
  handleDefaultCommunityChange: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.string.isRequired,
  recordCommunitySearchConfig: PropTypes.object.isRequired,
  recordUserCommunitySearchConfig: PropTypes.object.isRequired,
  searchConfig: PropTypes.object.isRequired,
  userCommunitiesMemberships: PropTypes.object.isRequired,
};

export { CommunitiesManagementDropdown };