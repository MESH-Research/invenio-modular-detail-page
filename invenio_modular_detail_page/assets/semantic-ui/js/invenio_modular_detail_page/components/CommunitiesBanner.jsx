import React, { useState, useEffect, useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button, Image, Grid } from "semantic-ui-react";
import Geopattern from "geopattern";
import { CommunitiesManagement } from "./community_management/CommunitiesManagement";
import { DetailContext } from "../contexts/DetailContext";

const CommunitiesBanner = ({
  show,
  sectionIndex,
}) => {
  const contextStore = useContext(DetailContext);
  const additionalCommunities = contextStore.additionalCommunities;
  const community = contextStore.community;
  const record = contextStore.record;
  const [communities, setCommunities] = useState(community ? (additionalCommunities ? [community, ...additionalCommunities] : [community]) : []);
  const [defaultCommunity, setDefaultCommunity] = useState(
    record.parent.communities.default ? communities.find(community => community.id === record.parent.communities.default) : community
  );
  const [otherCommunities, setOtherCommunities] = useState(
    ( communities.length > 0 && !!defaultCommunity ) ? communities.filter(community => community.id !== defaultCommunity.id) : []
  );
  const isCommunityRestricted = defaultCommunity
    ? defaultCommunity.access.visibility == "restricted"
    : false;

  const communityLogoUrl = defaultCommunity?.links
    ? defaultCommunity?.links?.logo
    : `/api/communities/${defaultCommunity?.id}/logo`;
  const communityTitle = defaultCommunity?.metadata.title;
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setOtherCommunities(communities.filter(community => community.id !== defaultCommunity.id));
  }, [defaultCommunity]);

  // Remove community branding if the user removes from the last community
  // Update other communities if the list of communities has changed
  // If the default community is not in the list, set it to the first community
  // Reset default community if there is only one community
  useEffect(() => {
    if (!communities || communities.length === 0) {
      setDefaultCommunity(null);
      setOtherCommunities([]);
    } else if (communities.length > 1) {
      if (!communities.find(community => community.id === defaultCommunity?.id)) {
        setDefaultCommunity(communities[0]);
      }
      setOtherCommunities(communities.filter(community => community.id !== defaultCommunity?.id));
    } else if (communities.length === 1) {
      setDefaultCommunity(communities[0]);
      setOtherCommunities([]);
    }
  }, [communities]);

  const makePattern = (el, slug) => {
    const pattern = Geopattern.generate(encodeURI(slug));

    // use rgba version of svg pattern color for header background
    const values = pattern.color.match(/\w\w/g);
    const darkenFactor = 0.35;  // to get enough contrast for a11y
    const [r, g, b] = values.map((k) => parseInt(k, 16));
    const [rDark, gDark, bDark] = [r, g, b].map((k) => k * (1 - darkenFactor));
    const wrapper = el.closest(`.row.collection-row.${slug}`);
    if (wrapper) {
      wrapper.querySelector("a").style = `color: rgba( ${rDark}, ${gDark}, ${bDark}, 1);`;
      if (slug === defaultCommunity.slug) {
        wrapper.style = `background: rgba( ${r}, ${g}, ${b}, 0.1); border-color: rgba( ${r}, ${g}, ${b}, 0.3); color: ${pattern.color};`;
      }
    }

    return pattern.toDataUri();
  };

  return !contextStore.isPreviewSubmissionRequest ? (
    <div
      id="communities"
      className={`sidebar-container ${show}`}
      aria-label={i18next.t("Record communities")}
    >
      <div
        className={`ui container segment rdm-sidebar pr-0 mt-0 ${
          defaultCommunity?.slug || "no-community"
        }`}
      >
        <Grid verticalAlign="middle">
          {!!defaultCommunity ? (
            <>
              <Grid.Row
                className={`default-community collection-row ${
                  defaultCommunity.slug
                } ${!otherCommunities && "sole-community"}`}
              >
                <Grid.Column width={10} className="pr-0">
                  <p className="mb-0">
                    <small>part of the</small>
                  </p>
                  <h3 className="ui header small mb-0">
                    <a href={`/collections/${defaultCommunity.slug}`}>
                      {defaultCommunity.metadata.title}
                    </a>
                  </h3>
                  <p className="mt-0">
                    <small>collection</small>
                  </p>
                  {isCommunityRestricted && (
                    <div
                      className="ui label horizontal small access-status restricted rel-ml-1"
                      title={i18next.t("Collection visibility")}
                      data-tooltip={i18next.t(
                        "The collection is restricted to users with access."
                      )}
                      data-inverted=""
                    >
                      <i className="icon ban" aria-hidden="true"></i>{" "}
                      {i18next.t("Restricted")}
                    </div>
                  )}
                </Grid.Column>
                <Grid.Column width={6}>
                  <div className="ui rounded image community-image">
                    <Image
                      src={communityLogoUrl}
                      alt={`logo for ${communityTitle} collection`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = makePattern(
                          e.target,
                          defaultCommunity.slug
                        );
                      }}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              {otherCommunities.length > 0 && (
                <>
                  {showAll &&
                    otherCommunities?.map((com) => (
                      <Grid.Row
                        key={com.id}
                        className={`collection-row ${com.slug}`}
                      >
                        <Grid.Column width={12}>
                          <h3 className="ui header small">
                            <a href={`/collections/${com.slug}`}>
                              {com.metadata.title}
                            </a>
                          </h3>
                          {com.access.visibility === "restricted" && (
                            <div
                              className="ui label horizontal small access-status restricted rel-ml-1"
                              title={i18next.t("Collection visibility")}
                              data-tooltip={i18next.t(
                                "The collection is restricted to users with access."
                              )}
                              data-inverted=""
                            >
                              <i className="icon ban" aria-hidden="true"></i>{" "}
                              {i18next.t("Restricted")}
                            </div>
                          )}
                        </Grid.Column>
                        <Grid.Column width={4} className="pr-0 pl-0">
                          <div className="ui rounded image community-image">
                            <Image
                              src={`/api/communities/${com.id}/logo`}
                              alt={`logo for ${com.metadata.title} collection`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = makePattern(e.target, com.slug);
                              }}
                            />
                          </div>
                        </Grid.Column>
                      </Grid.Row>
                    ))}
                  <Grid.Row
                    className={`additional-communities ${showAll && "open"}`}
                  >
                    <Button
                      size="small"
                      basic
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? i18next.t(`Hide other collections`) : i18next.t(`Show ${otherCommunities.length} more collections...`)}
                    </Button>
                  </Grid.Row>
                </>
              )}
            </>
          ) : null}
          {contextStore.canManage && (
            <CommunitiesManagement
              userCommunitiesMemberships={contextStore.userCommunitiesMemberships}
              recordCommunityEndpoint={contextStore.recordCommunityEndpoint}
              recordUserCommunitySearchConfig={contextStore.recordUserCommunitySearchConfig}
              canManageRecord={contextStore.canManage}
              recordCommunitySearchConfig={contextStore.recordCommunitySearchConfig}
              permissions={contextStore.permissions}
              permissionsPerField={contextStore.permissionsPerField}
              searchConfig={contextStore.searchConfig}
              record={record}
              showAll={showAll}
              defaultCommunity={defaultCommunity}
              setDefaultCommunity={setDefaultCommunity}
              communities={communities}
              setCommunities={setCommunities}
              sectionIndex={sectionIndex + 2}
            />
          )}
        </Grid>
      </div>
    </div>
  ) : null;
};

export { CommunitiesBanner };
