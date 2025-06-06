import React, { useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Card, Icon, Label, List } from "semantic-ui-react";
import { AffiliationsAccordion } from "./AffiliationsAccordion";
import { DetailContext } from "../contexts/DetailContext";

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
    email: ["Email", "mail", "mailto:"],
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
              {scheme === "email" ? (
                <Icon name="mail outline" aria-label={`${creatibutor.person_or_org.name}'s email`} alt={`${creatibutor.person_or_org.name}'s email`} className="ml-5 inline-id-icon" />
              ) : (
                <img
                  className={`ml-5 inline-id-icon ${scheme}`}
                  src={schemeStrings[scheme][1]}
                  alt={`${schemeStrings[scheme][0]} icon`}
                  title={`${creatibutor.person_or_org.name}'s ${
                    schemeStrings[scheme][0]
                  } ${i18next.t("profile")}`}
                />
              )}
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
          href={`../search?q=metadata.creators.person_or_org.name:"${creatibutor.person_or_org.name}"`}
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

const CreatibutorsShortList = () => {
  const contextStore = useContext(DetailContext);
  const creators = contextStore.creators;
  const contributors = contextStore.contributors;

  const show_affiliations = false;
  const show_roles = false;
  const allCreatibutors = contextStore.contributors
    ? creators?.creators?.concat(contributors?.contributors)
    : creators?.creators;

  // Get first three creatibutors and count remaining
  const firstThreeCreatibutors = allCreatibutors?.slice(0, 3) || [];
  const remainingCount = allCreatibutors ? Math.max(0, allCreatibutors.length - 3) : 0;

  return contextStore.isPreviewSubmissionRequest ? null : (
    <section
      id="creatibutors-list-section"
      className="ui mb-10 mt-10 sixteen wide mobile twelve wide tablet thirteen wide computer column"
    >
      <dl className="creatibutors" aria-label={i18next.t("Contributors list")}>
        {firstThreeCreatibutors?.length
          ? firstThreeCreatibutors.map((creator, idx) => (
              <Creatibutor
                creatibutor={creator}
                key={creator.person_or_org.name}
                show_affiliations={show_affiliations}
                show_roles={show_roles}
                iconsRor={contextStore.iconsRor}
                iconsOrcid={contextStore.iconsOrcid}
                iconsGnd={contextStore.iconsGnd}
                iconsKcUsername={contextStore.iconsKcUsername}
                iconsIsni={contextStore.iconsIsni}
                landingUrls={contextStore.landingUrls}
              />
            ))
          : ""}
        {remainingCount > 0 && (
          <dd className="creatibutor-wrap separated">
            <List.Content as={"span"} className="creatibutor-name">
              {remainingCount > 1 ? i18next.t("and {{count}} others", { count: remainingCount }) : i18next.t("and {{count}} other", { count: remainingCount })}
            </List.Content>
          </dd>
        )}
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
