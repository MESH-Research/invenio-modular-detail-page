import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { CommunitiesManagementDropdown } from "./CommunitiesManagementDropdown";
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
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("defaultCommunity", defaultCommunity);

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
  };

  const handleCommunityRemoval = (community) => {
    setCommunities(communities.filter((c) => c.id !== community.id));
    console.log("communities", communities);
  };

  useEffect(() => {
    getCommunities();
  }, []);

  // TODO: Somehow cancel the fetch when the component unmounts

  return (
    !!canManageRecord ? (
      <Grid.Row className={`manage-communities ${showAll ? "open" : ""} ml-0 mr-0 pt-0 pb-0`}>

        <CommunitiesManagementDropdown
          classNames="mobile tablet only"
          communities={communities}
          direction="bottom"
          getCommunities={getCommunities}
          handleCommunityRemoval={handleCommunityRemoval}
          handleDefaultCommunityChange={handleDefaultCommunityChange}
          permissions={permissions}
          record={record}
          recordCommunityEndpoint={recordCommunityEndpoint}
          recordCommunitySearchConfig={recordCommunitySearchConfig}
          recordUserCommunitySearchConfig={recordUserCommunitySearchConfig}
          searchConfig={searchConfig}
          userCommunitiesMemberships={userCommunitiesMemberships}
        />

        <CommunitiesManagementDropdown
          classNames="computer large-monitor widescreen only"
          communities={communities}
          direction="left"
          getCommunities={getCommunities}
          handleCommunityRemoval={handleCommunityRemoval}
          handleDefaultCommunityChange={handleDefaultCommunityChange}
          permissions={permissions}
          record={record}
          recordCommunityEndpoint={recordCommunityEndpoint}
          recordCommunitySearchConfig={recordCommunitySearchConfig}
          recordUserCommunitySearchConfig={recordUserCommunitySearchConfig}
          searchConfig={searchConfig}
          userCommunitiesMemberships={userCommunitiesMemberships}
        />
      </Grid.Row>
    ) : (
      null
    )
  )
};

export { CommunitiesManagement };
