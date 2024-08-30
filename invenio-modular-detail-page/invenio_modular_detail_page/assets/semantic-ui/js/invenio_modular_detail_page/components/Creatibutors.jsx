import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Card, Icon, Label, List } from "semantic-ui-react";
import { AffiliationsAccordion } from "./AffiliationsAccordion";

const IdentifiersList = (ids) => {
  if (ids !== undefined) {
    // ids = creatibutor.person_or_org.identifiers.group(({scheme}) => scheme);
    ids = ids.reduce((x, y) => {
      (x[y.scheme] = x[y.scheme] || []).push(y);
      return x;
    }, {});
    ids = Object.values(ids).reduce((acc, idlist) => [...acc, ...idlist], []);
  } else {
    ids = [];
  }
  return ids;
};

const makeSchemeStrings = (
  iconsGnd,
  iconsKcUsername,
  iconsIsni,
  iconsOrcid,
  iconsRor,
  landingUrls
) => {
  const mystrings = {
    orcid: ["ORCID", iconsOrcid, landingUrls.orcid],
    ror: ["ROR", iconsRor, landingUrls.ror],
    gnd: ["GND", iconsGnd, landingUrls.gnd],
    hc_username: [
      "Knowledge Commons",
      iconsKcUsername,
      landingUrls.kcommons_username,
    ],
    kc_username: [
      "Knowledge Commons",
      iconsKcUsername,
      landingUrls.kcommons_username,
    ],
    isni: ["ISNI", iconsIsni, landingUrls.isni],
  };
  return mystrings;
};

const CreatibutorIcon = ({
  creatibutor,
  iconsRor,
  iconsOrcid,
  iconsGnd,
  iconsKcUsername,
  iconsIsni,
  landingUrls,
}) => {
  let ids = IdentifiersList(creatibutor.person_or_org.identifiers);
  const schemeStrings = makeSchemeStrings(
    iconsGnd,
    iconsKcUsername,
    iconsIsni,
    iconsOrcid,
    iconsRor,
    landingUrls
  );
  console.log("CreatibutorIcon ids", ids);
  console.log("CreatibutorIcon schemeStrings", schemeStrings);
  console.log("CreatibutorIcon creatibutor", creatibutor);
  console.log("CreatibutorIcon iconsOrcid", iconsOrcid);


  return (
    <>
      {!!ids
        ? ids.map(({ scheme, identifier }) => (
            <a
              href={`${schemeStrings[scheme][2]}${identifier}`}
              className={`no-text-decoration ${scheme}-icon-link`}
              key={`${scheme}-${identifier}`}
              aria-label={`${creatibutor.person_or_org.name}'s ${
                schemeStrings[scheme][0]
              } ${i18next.t("profile")}`}
            >
              <img
                className={`ml-5 inline-id-icon ${scheme}`}
                src={schemeStrings[scheme][1]}
                alt={`${schemeStrings[scheme][0]} icon`}
                title={`${creatibutor.person_or_org.name}'s ${
                  schemeStrings[scheme][0]
                } ${i18next.t("profile")}`}
              />
            </a>
          ))
        : ""}
      {!!ids && creatibutor.person_or_org.type == "organizational" ? (
        <Icon name="group" />
      ) : (
        ""
      )}
    </>
  );
};

const Creatibutor = ({
  creatibutor,
  show_affiliations,
  show_ids = true,
  show_roles,
  iconsRor,
  iconsOrcid,
  iconsGnd,
  iconsKcUsername,
  iconsIsni,
  itemIndex,
  listLength,
  landingUrls,
}) => {
  let extra_props = {};
  if (show_affiliations && creatibutor.affiliations) {
    extra_props["data-tooltip"] = creatibutor.affiliations
      .map((a) => a[1])
      .join("; ");
  }
  return (
    <dd className="creatibutor-wrap separated">
      <List.Content as={"span"} className="creatibutor-name">
        <a
          className="ui creatibutor-link"
          href={`../search?q='metadata.creators.person_or_org.name:${creatibutor.person_or_org.name}'`}
          {...extra_props}
        >
          <span>
            {creatibutor.person_or_org.type === "personal" &&
            creatibutor.person_or_org.family_name
              ? `${creatibutor.person_or_org.given_name} ${creatibutor.person_or_org.family_name}`
              : creatibutor.person_or_org.name}
          </span>
        </a>
      </List.Content>
      {!!show_roles &&
      creatibutor.role &&
      creatibutor.role.title !== "Other" ? (
        <Label className="creatibutor-role">{creatibutor.role.title}</Label>
      ) : (
        ""
      )}
      {!!show_ids && creatibutor?.person_or_org?.identifiers && (
        <CreatibutorIcon
          creatibutor={creatibutor}
          iconsRor={iconsRor}
          iconsOrcid={iconsOrcid}
          iconsGnd={iconsGnd}
          iconsKcUsername={iconsKcUsername}
          iconsIsni={iconsIsni}
          landingUrls={landingUrls}
        />
      )}
    </dd>
  );
};

const CreatibutorsShortList = ({
  creators,
  contributors,
  iconsRor,
  iconsOrcid,
  iconsGnd,
  iconsKcUsername,
  iconsIsni,
  landingUrls,
  isPreviewSubmissionRequest,
}) => {
  const show_affiliations = false;
  const show_roles = false;
  const creatibutors = contributors
    ? creators?.creators?.concat(contributors?.contributors)
    : creators?.creators;
  console.log("CreatibutorsShortList creatibutors", creatibutors);
  console.log("CreatibutorsShortList iconsOrcid", iconsOrcid);


  return isPreviewSubmissionRequest ? null : (
    <section
      id="creatibutors-list-section"
      className="ui mb-10 mt-10 sixteen wide mobile twelve wide tablet thirteen wide computer column"
    >
      {/* <dt className="hidden">{i18next.t("Creators")}</dt> */}
      <dl className="creatibutors" aria-label={i18next.t("Contributors list")}>
        {creatibutors?.length
          ? creatibutors.map((creator, idx) => (
              <Creatibutor
                creatibutor={creator}
                key={creator.person_or_org.name}
                show_affiliations={show_affiliations}
                show_roles={show_roles}
                iconsRor={iconsRor}
                iconsOrcid={iconsOrcid}
                iconsGnd={iconsGnd}
                iconsKcUsername={iconsKcUsername}
                iconsIsni={iconsIsni}
                landingUrls={landingUrls}
              />
            ))
          : ""}
      </dl>
    </section>
  );
};

const Creatibutors = ({
  creators,
  contributors,
  iconsRor,
  iconsOrcid,
  iconsGnd,
  iconsKcUsername,
  iconsIsni,
  landingUrls,
  section,
  subsections,
}) => {
  const show_affiliations = true;
  const creatibutors =
    contributors !== undefined
      ? creators?.creators?.concat(contributors?.contributors)
      : creators?.creators;
  let ids = creatibutors.reduce((acc, creatibutor) => {
    acc[creatibutor.person_or_org.name] = IdentifiersList(
      creatibutor.person_or_org.identifiers
    );
    return acc;
  }, {});
  const schemeStrings = makeSchemeStrings(
    iconsGnd,
    iconsKcUsername,
    iconsIsni,
    iconsOrcid,
    iconsRor,
    landingUrls
  );
  return (
    <div className="">
      {creatibutors?.map((creator) => (
        <Card fluid>
          <Card.Content className="pb-5">
            <Card.Header>
              <Creatibutor
                creatibutor={creator}
                key={creator.person_or_org.name}
                show_affiliations={show_affiliations}
                show_ids={false}
                iconsRor={iconsRor}
                iconsOrcid={iconsOrcid}
                iconsGnd={iconsGnd}
                iconsKcUsername={iconsKcUsername}
                iconsIsni={iconsIsni}
                landingUrls={landingUrls}
              />
            </Card.Header>
            <Card.Meta>
              {!!creator.role && <span>{creator.role.title}</span>}
            </Card.Meta>
            <Card.Description className="mt-0">
              {!!creator.affiliations && show_affiliations && (
                <small>{creator.affiliations.map((a) => a[1]).join(",")}</small>
              )}
            </Card.Description>
          </Card.Content>
          <Card.Content extra className="mt-0 pt-5">
            {ids[creator.person_or_org.name]?.map(({ scheme, identifier }) => (
              <a
                href={`${schemeStrings[scheme][2]}${identifier}`}
                className="no-text-decoration"
                key={`${scheme}-${identifier}`}
                aria-label={`${creator.person_or_org.name}'s ${
                  schemeStrings[scheme][0]
                } ${i18next.t("profile")}`}
              >
                <img
                  className="mr-5 inline-id-icon"
                  src={schemeStrings[scheme][1]}
                  alt={`${schemeStrings[scheme][0]} icon`}
                  title={`${creator.person_or_org.name}'s ${
                    schemeStrings[scheme][0]
                  } ${i18next.t("profile")}`}
                />
                <small>
                  {["kc_username", "hc_username"].includes(scheme) ? "Knowledge Commons" : scheme}{" "}
                  {i18next.t("profile")}
                </small>
              </a>
            ))}
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

export { Creatibutors, CreatibutorsShortList };
