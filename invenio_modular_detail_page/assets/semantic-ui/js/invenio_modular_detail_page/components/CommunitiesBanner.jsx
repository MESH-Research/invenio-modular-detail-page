import React, { useState } from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Button, Icon, Image, Grid } from "semantic-ui-react";
import Geopattern from "geopattern";
import { set } from "lodash";

const CommunitiesBanner = ({ additionalCommunities, community, isPreviewSubmissionRequest, show }) => {

  const isCommunityRestricted = community
    ? community.access.visibility == "restricted"
    : false;

  const communityLogoUrl = community?.links ? community?.links?.logo : `/api/communities/${community?.id}/logo`;
  const communityTitle = community?.metadata.title;
  const [showAll, setShowAll] = useState(false);

  const makePattern = (el, slug) => {
    const pattern = Geopattern.generate(encodeURI(slug));

    // use rgba version of svg pattern color for header background
    const values = pattern.color.match(/\w\w/g);
    const [r, g, b] = values.map((k) => parseInt(k, 16));
    const wrapper = el.closest(`.row.collection-row.${slug}`);
    if (wrapper) {
      wrapper.querySelector("a").style = `color: ${pattern.color};`;
      if (slug === community.slug) {
        wrapper.style = `background: rgba( ${r}, ${g}, ${b}, 0.1); border-color: rgba( ${r}, ${g}, ${b}, 0.3); color: ${pattern.color};`;
      }
    }

    return pattern.toDataUri();
  };

  return (
    (!isPreviewSubmissionRequest &&
    community) ? (
      <div
        id="communities"
        className={`sidebar-container ${show}`}
        aria-label={i18next.t("Record communities")}
      >
        <div
          className={`ui container segment rdm-sidebar pr-0 mt-0 ${community.slug}`}
        >
          <Grid verticalAlign="middle">
            <Grid.Row className={`default-community collection-row ${community.slug} ${!additionalCommunities && "sole-community" }`}>
              <Grid.Column width={9} widescreen={10}>
                <p className="mb-0"><small>part of the</small></p>
                <h3 className="ui header small mb-0">
                  <a href={`/collections/${community.slug}`}>
                    {community.metadata.title}
                  </a>
                </h3>
                <p className="mt-0"><small>collection</small></p>
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
                    // fallbackSrc={pattern !== "" ? pattern.toDataUri() : ""}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = makePattern(e.target, community.slug);
                    }}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
            {additionalCommunities && (
              <>
              {showAll && additionalCommunities?.map((com) => (
              <Grid.Row key={com.id} className={`collection-row ${com.slug}`}>
                <Grid.Column width={12}>
                  <h3 className="ui header small">
                    <a href={`/collections/${com.slug}`}>
                      {com.metadata.title}
                    </a>
                  </h3>
                  {com.access.visibility==="restricted" && (
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
              )
            )}
              <Grid.Row className={`additional-communities ${showAll && "open"}`}>
                {!showAll && (
                  `and ${additionalCommunities.length} more collections...`
                ) }
                <Button size="small" basic onClick={() => setShowAll(!showAll)}>{showAll ? "Hide" : "Show"}</Button>
              </Grid.Row>
            </>
            )}
          </Grid>
        </div>
      </div>
    )
    : null
  );
};

export { CommunitiesBanner };
