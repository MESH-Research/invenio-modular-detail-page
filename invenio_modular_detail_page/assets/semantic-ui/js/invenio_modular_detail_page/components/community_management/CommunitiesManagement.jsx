import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { CommunitiesManagementDropdown } from "./CommunitiesManagementDropdown";
import { RecordCommunitiesListModal } from "./RecordCommunitiesListModal";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { http, withCancel } from "react-invenio-forms";

const CommunitiesManagement = ({
  userCommunitiesMemberships,
  recordCommunityEndpoint,
  recordUserCommunitySearchConfig,
  canManageRecord,
  recordCommunitySearchConfig,
  permissions,
  searchConfig,
  record,
  showAll,
  defaultCommunity,
  setDefaultCommunity,
  communities,
  setCommunities,
  sectionIndex,
}) => {
  const [manageCommunitiesModalOpen, setManageCommunitiesModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("defaultCommunity", defaultCommunity);


  const toggleManageCommunitiesModal = (value) => {
    if (!value) {
      const modalDropdown = document.getElementById("modal-dropdown"); // A11y: Focus community management dropdown when modal closes
      modalDropdown && modalDropdown.focus();
    }
    setManageCommunitiesModalOpen(value);
  };

  const fetchRecordCommunities = async () => {
    return await http.get(recordCommunityEndpoint, {
      headers: {
        Accept: "application/vnd.inveniordm.v1+json",
      },
    });
  };

  const getCommunities = async () => {
    const cancellableFetchCommunities = withCancel(fetchRecordCommunities());
    setLoading(true);
    setError(null);
    try {
      const response = await cancellableFetchCommunities.promise;
      const {
        data: {
          hits: { hits },
        },
      } = response;
      console.log("hits", hits);
      setCommunities(hits);
      if (hits.length == 1) {
        setDefaultCommunity(hits[0]);
        setCommunities(hits);
      }
      setLoading(false);
    } catch (error) {
      if (error !== "UNMOUNTED") {
        setLoading(false);
        setError(i18next.t("An error occurred while fetching communities."));
      }
    }
  };

  const handleDefaultCommunityChange = (communityId) => {
    setDefaultCommunity(communities.find((c) => c.id === communityId));
    console.log("defaultCommunity in handler", defaultCommunity);
  };

  const handleCommunityRemoval = (community) => {
    setCommunities(communities.filter((c) => c.id !== community.id));
    console.log("communities", communities);
  };

  const handleRefresh = () => {
    getCommunities();
    toggleManageCommunitiesModal(false);
  };

  useEffect(() => {
    getCommunities();
  }, []);

  // TODO: Somehow cancel the fetch when the component unmounts

  return (
    !!canManageRecord ? (
      <Grid.Row className={`manage-communities ${showAll ? "open" : ""}`}>
        <RecordCommunitiesListModal
          id="record-communities-list-modal"
          modalOpen={manageCommunitiesModalOpen}
          handleOnOpen={() => toggleManageCommunitiesModal(true)}
          handleOnClose={() => toggleManageCommunitiesModal(false)}
          successActionCallback={handleRefresh}
          recordCommunityEndpoint={recordCommunityEndpoint}
          permissions={permissions}
          record={record}
          handleDefaultCommunityChange={handleDefaultCommunityChange}
          handleCommunityRemoval={handleCommunityRemoval}
        />

        <CommunitiesManagementDropdown
          actionSucceed={handleRefresh}
          userCommunitiesMemberships={userCommunitiesMemberships}
          recordCommunityEndpoint={recordCommunityEndpoint}
          searchConfig={searchConfig}
          recordCommunitySearchConfig={recordCommunitySearchConfig}
          recordUserCommunitySearchConfig={recordUserCommunitySearchConfig}
          toggleManageCommunitiesModal={toggleManageCommunitiesModal}
          record={record}
          communities={communities}
          handleDefaultCommunityChange={handleDefaultCommunityChange}
          handleCommunityRemoval={handleCommunityRemoval}
          direction="bottom"
          classNames="mobile tablet only"
          sectionIndex={sectionIndex + 1}
        />

        <CommunitiesManagementDropdown
          actionSucceed={handleRefresh}
          userCommunitiesMemberships={userCommunitiesMemberships}
          recordCommunityEndpoint={recordCommunityEndpoint}
          searchConfig={searchConfig}
          recordCommunitySearchConfig={recordCommunitySearchConfig}
          recordUserCommunitySearchConfig={recordUserCommunitySearchConfig}
          toggleManageCommunitiesModal={toggleManageCommunitiesModal}
          record={record}
          communities={communities}
          handleDefaultCommunityChange={handleDefaultCommunityChange}
          handleCommunityRemoval={handleCommunityRemoval}
          direction="left"
          classNames="computer widescreen large monitor only"
          sectionIndex={sectionIndex + 2}
        />
      </Grid.Row>
    ) : (
      null
    )
  )
};

export { CommunitiesManagement };
