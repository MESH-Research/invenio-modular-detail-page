import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Icon, Image, Grid } from "semantic-ui-react";
import Geopattern from "geopattern";
import { set } from "lodash";

const CommunitiesBanner = ({ community, isPreviewSubmissionRequest, show }) => {
  const isCommunityRestricted = community
    ? community.access.visibility == "restricted"
    : false;

  const communityLogoUrl = community.links.logo;
  const communityTitle = community.metadata.title;

  const pattern = Geopattern.generate(encodeURI(community.slug));
  const setCommunityColors = (el) => {
    console.log("slug", encodeURI(community.slug));

    // use rgba version of svg pattern color for header background
    const values = pattern.color.match(/\w\w/g);
    const [r, g, b] = values.map((k) => parseInt(k, 16));
    const wrapper = el.closest(".segment.rdm-sidebar");
    if (wrapper) {
      wrapper.style = `background: rgba( ${r}, ${g}, ${b}, 0.1); border-color: rgba( ${r}, ${g}, ${b}, 0.3); color: ${pattern.color};`;
      wrapper.querySelector("a").style = `color: ${pattern.color};`;
    }
  };

  return (
    !isPreviewSubmissionRequest &&
    community && (
      <div
        id="communities"
        className={`sidebar-container ${show}`}
        aria-label={i18next.t("Record communities")}
      >
        <div
          className={`ui container segment rdm-sidebar pr-0 ${community.slug}`}
        >
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={10}>
                <h3 className="ui header small">
                  <a href={`/communities/${community.slug}`}>
                    {community.metadata.title}
                  </a>
                </h3>
                {isCommunityRestricted && (
                  <div
                    className="ui label horizontal small access-status restricted rel-ml-1"
                    title={i18next.t("Community visibility")}
                    data-tooltip={i18next.t(
                      "The community is restricted to users with access."
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
                      setCommunityColors(e.target);
                      e.target.src = pattern.toDataUri();
                    }}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    )
  );
};

export { CommunitiesBanner };
