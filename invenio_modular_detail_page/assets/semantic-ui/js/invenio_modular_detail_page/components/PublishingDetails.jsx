import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Accordion, Icon, Popup } from "semantic-ui-react";
import { Creatibutors } from "./Creatibutors";
import { Doi } from "../components/Doi";
import { groupObjectsBy, toPidUrl } from "../util";
import { Analytics } from "./Analytics";

function isDuration(size) {
  const durationUnits = ["minutes", "hours", "days", "weeks", "months", "years", "milliseconds", "seconds", "minutes", "hours", "days", "weeks", "months", "years"];
  return durationUnits.some(unit => size.includes(unit));
}

function getCustomFieldComponents({
  sectionFields,
  customFields,
  detailOrder,
}) {
  if (detailOrder) {
    sectionFields = detailOrder.map(({ section, subsections }) =>
      sectionFields.find((fieldCfg) => fieldCfg.field === section)
    );
  }

  return sectionFields.map((fieldCfg) => {
    const fieldValue = customFields[fieldCfg.field];
    if (!!fieldValue) {
      if (typeof fieldValue === "object") {
        let entries = Object.entries(fieldValue);
        const orderSubsections = detailOrder.find(
          ({ section }) => section === fieldCfg.field
        )?.subsections;
        if (orderSubsections) {
          entries = orderSubsections.reduce((acc, { section }) => {
            const match = entries.find(([key, value]) => key === section);
            return match ? [...acc, match] : acc;
          }, []);
        }
        return (
          <>
            {entries.map(([key, value]) => (
              <DetailItem
                key={key}
                title={fieldCfg.props[key].label}
                value={value}
                trueLabel={fieldCfg.props[key].trueLabel}
                falseLabel={fieldCfg.props[key].falseLabel}
                isVocabulary={fieldCfg.props[key].isVocabulary}
              />
            ))}
          </>
        );
      } else {
        return (
          <DetailItem
            key={fieldCfg.field}
            title={fieldCfg.props.label}
            value={fieldValue}
            trueLabel={fieldCfg.props.trueLabel}
            falseLabel={fieldCfg.props.falseLabel}
            isVocabulary={fieldCfg.props.isVocabulary}
          />
        );
      }
    } else {
      return null;
    }
  });
}

const References = ({ references, identifierSchemes }) => {
  return (
    <>
      {references.map(({ reference, identifier, scheme }, index) => (
        <dd>
          {reference.reference}
          {identifier &&
            (scheme
              ? ` (${identifierSchemes[scheme]} - ${identifier})`
              : ` (${identifier})`)}
        </dd>
      ))}
    </>
  );
};

const AdditionalDates = ({ dates }) => {
  return (
    <>
      {dates.map(({ type, date: dateValue, description }, index) => (
        <React.Fragment key={type.title_l10n}>
          <dt className="ui tiny header">{type.title_l10n}</dt>
          <dd>
            {dateValue}
            {description && (
              <span className="text-muted"> ({description})</span>
            )}
          </dd>
        </React.Fragment>
      ))}
    </>
  );
};

const FundingItem = ({ item, index }) => {
  const { award, funder } = item;

  if (award) {
    const { title_l10n, number, identifiers } = award;

    return (
      <dl class="details-list mt-0">
        {title_l10n && (
          <dt className="ui tiny header">
            <span className="mr-5">{title_l10n}</span>
            {number && (
              <span
                className="ui mini basic label ml-0 mr-5"
                id={`number-label-${index}`}
              >
                {number}
              </span>
            )}
            {identifiers &&
              identifiers
                .filter((identifier) => identifier.scheme === "url")
                .map((identifier) => (
                  <a
                    key={identifier.identifier}
                    href={identifier.identifier}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={i18next.t("Open external link")}
                  >
                    <i className="external alternate icon"></i>
                  </a>
                ))}
          </dt>
        )}
        {funder && <dd className="text-muted">{funder.name}</dd>}
      </dl>
    );
  } else {
    return <h4 className="ui tiny header">{funder.name}</h4>;
  }
};

function Funding({ funding }) {
  return (
    <>
      {funding.map((item, index) => (
        <FundingItem key={index} item={item} index={index} />
      ))}
    </>
  );
}

function IdentifiersForGroup({ identifiers, identifierSchemes, landingUrls }) {
  return (
    <>
      {identifiers.map(({ scheme, identifier, resource_type }) => (
        <dd key={identifier}>
          {scheme && (
            <span className="text-muted">{`${identifierSchemes[scheme]}: `}</span>
          )}
          {identifier && (
            <>
              <a
                href={toPidUrl(identifier, scheme, landingUrls)}
                target="_blank"
                title={i18next.t("Opens in new tab")}
              >
                {identifier}
              </a>
              {resource_type && ` (${resource_type.title_l10n})`}
            </>
          )}
        </dd>
      ))}
    </>
  );
}

function RelatedIdentifiers({
  relatedIdentifiers,
  identifierSchemes,
  landingUrls,
}) {
  const groups = groupObjectsBy(
    relatedIdentifiers,
    ({ relation_type }) => relation_type.title_l10n
  );

  return (
    <>
      {Object.entries(groups).map(([relationType, identifiers]) => (
        <React.Fragment key={relationType}>
          <dt className="ui tiny header">{relationType}</dt>
          <IdentifiersForGroup
            identifiers={identifiers}
            identifierSchemes={identifierSchemes}
            landingUrls={landingUrls}
          />
        </React.Fragment>
      ))}
    </>
  );
}

const DOITextLink = ({ doi, doiLink, workDoi }) => {
  return (
    <>
      <dt className="ui tiny header">DOI (this version)</dt>
      <dd key={doi}>
        {doi} &nbsp;
        <Popup
          content={i18next.t("Always resolves to this version of the work")}
          trigger={<Icon name="info circle" />}
        />
      </dd>
      {workDoi && (
        <>
          <dt className="ui tiny header">DOI (newest version)</dt>
          <dd>
            {workDoi} &nbsp;
            <Popup
              content={i18next.t("Always resolves to the latest version of the work")}
              trigger={<Icon name="info circle" />}
            />
          </dd>
        </>
      )}
    </>
  );
};

const URLs = ({ identifiers }) => {
  return (
    <>
      <dt className="ui tiny header">URLs</dt>
      {identifiers
        .filter(({ scheme }) => scheme === "url")
        .map(({ identifier }) => (
          <dd key={identifier}>
            {identifier && (
              <a
                href={identifier}
                target="_blank"
                title={_("Opens in new tab")}
              >
                {identifier}
              </a>
            )}
          </dd>
        ))}
    </>
  );
};

const AlternateIdentifiers = ({
  alternateIdentifiers,
  identifierSchemes,
  landingUrls,
}) => {
  const groups = groupObjectsBy(alternateIdentifiers, ({ scheme }) => scheme);
  return Object.keys(groups)
    .filter((scheme) => scheme !== "url")
    .map((scheme) => (
      <React.Fragment key={scheme}>
        <dt className="ui tiny header">{identifierSchemes[scheme]}</dt>
        {groups[scheme].map(({ scheme, identifier }) => (
          <dd key={identifier}>
            {identifier && (
              <a
                href={toPidUrl(identifier, scheme, landingUrls)}
                target="_blank"
                title={_("Opens in new tab")}
              >
                {identifier}
              </a>
            )}
          </dd>
        ))}
      </React.Fragment>
    ));
};

const TitleDetail = ({ titleType, titleLang, title }) => {
  return (
    <React.Fragment key={title}>
      <dt className="ui tiny header">
        {titleType}
        {titleLang && (
          <span className="language text-muted">{` (${titleLang})`}</span>
        )}
      </dt>
      <dd>{title}</dd>
    </React.Fragment>
  );
};

const AdditionalTitles = ({ addTitles }) => {
  return (
    <>
      {addTitles.map(({ type, lang, title }) => (
        <TitleDetail
          key={title}
          titleType={type.title_l10n}
          titleLang={lang && lang.title_l10n}
          title={title}
        />
      ))}
    </>
  );
};

const Volumes = ({ volumes }) => {
  let volString = "";
  const this_vol = volumes["volume"] ? `Volume ${volumes["volume"]}` : null;
  const vols = volumes["total_volumes"] ? volumes["total_volumes"] : null;
  if (this_vol && vols) {
    volString = `${this_vol} of ${vols}`;
  } else if (this_vol) {
    volString = this_vol;
  } else {
    volString = `${vols} volumes`;
  }
  return (
    <React.Fragment key="volumes">
      <dt className="ui tiny header">Volumes</dt>
      <dd>{volString}</dd>
    </React.Fragment>
  );
};

/** Function to get the list of publication details for display.
 *
 * @param {*} record The record object
 * @param {*} doiBadgeUrl The URL of the DOI badge image
 * @param {*} detailOrder The order of the details to display. An array
 *  of strings that should match titles in the detailsInfo list within
 *  this function.
 * @returns Array of objects with title and value. The values are React components.
 */
const getDetailsComponents = ({
  customFieldsUi,
  detailOrder,
  doiBadgeUrl,
  hasFiles,
  iconsKcUsername,
  iconsGnd,
  iconsOrcid,
  iconsRor,
  identifierSchemes,
  landingUrls,
  localizedStats,
  record,
  showDecimalSizes,
}) => {
  const idDoi = record.pids.doi ? record.pids.doi.identifier : null;
  const workDoi = record.parent.pids.doi ? record.parent.pids.doi.identifier : null;
  const detailsInfo = [
    {
      title: i18next.t("Additional dates"),
      value: record.ui.dates ? (
        <AdditionalDates dates={record.ui.dates} />
      ) : null,
    },
    {
      title: i18next.t("Additional titles"),
      value: record.ui.additional_titles ? (
        <AdditionalTitles addTitles={record.ui.additional_titles} />
      ) : null,
    },
    {
      title: i18next.t("Alternate identifiers"),
      value: record.metadata.identifiers?.filter(
        (id) => id.scheme !== "url"
      ) ? (
        <AlternateIdentifiers
          alternateIdentifiers={record.metadata.identifiers}
          identifierSchemes={identifierSchemes}
          landingUrls={landingUrls}
        />
      ) : null,
    },
    {
      title: i18next.t("Analytics"),
      value: (
        <Analytics
          record={record}
          hasFiles={hasFiles}
          localizedStats={localizedStats}
          showDecimalSizes={showDecimalSizes}
        />
      ),
    },
    {
      title: i18next.t("Awarding university"),
      value:
        record.ui.publishing_information &&
        record.ui.publishing_information.thesis
          ? record.ui.publishing_information.thesis
          : null,
    },
    {
      title: i18next.t("Chapter label"),
      value: record.ui.custom_fields["kcr:chapter_label"]
        ? record.ui.custom_fields["kcr:chapter_label"]
        : null,
    },
    {
      title: i18next.t("Conference"),
      value: record.ui.conference ? (
        <ConferenceDetailSection conference={record.ui.conference} />
      ) : null,
    },
    {
      title: i18next.t("Conference organization"),
      value: record.ui.custom_fields["kcr:meeting_organization"]
        ? record.ui.custom_fields["kcr:meeting_organization"]
        : null,
    },
    {
      title: i18next.t("Contributors"),
      value: (
        <Creatibutors
          creators={record.ui.creators}
          contributors={record.ui.contributors}
          iconsRor={iconsRor}
          iconsOrcid={iconsOrcid}
          iconsKcUsername={iconsKcUsername}
          iconsGnd={iconsGnd}
          landingUrls={landingUrls}
        />
      ),
    },
    {
      title: i18next.t("Course title"),
      value: record.custom_fields["kcr:course_title"]
        ? record.custom_fields["kcr:course_title"]
        : null,
    },
    {
      title: i18next.t("Degree"),
      value: record.custom_fields["kcr:degree"]
        ? record.custom_fields["kcr:degree"]
        : null,
    },
    {
      title: i18next.t("Department"),
      value: record.custom_fields["kcr:institution_department"]
        ? record.custom_fields["kcr:institution_department"]
        : null,
    },
    {
      title: i18next.t("Development status"),
      value: record.ui.custom_fields["code:developmentStatus"]
        ? record.ui.custom_fields["code:developmentStatus"]["title_l10n"]
        : null,
    },
    {
      title: i18next.t("DOI badge"),
      value:
        idDoi !== null ? (
          <Doi
            key={"doi_badge"}
            idDoi={idDoi}
            doiBadgeUrl={doiBadgeUrl}
            doiLink={record.links.doi}
          />
        ) : null,
    },
    {
      title: i18next.t("DOI"),
      value:
        idDoi !== null ? (
          <DOITextLink key={"doi"} doiLink={record.links.doi} doi={idDoi} workDoi={workDoi} />
        ) : null,
    },
    {
      title: i18next.t("Edition"),
      value: record.custom_fields["kcr:edition"]
        ? record.custom_fields["kcr:edition"]
        : null,
    },
    {
      title: i18next.t("Frameworks or runtimes"),
      value: record.custom_fields["code:runtimePlatform"]
        ? record.custom_fields["code:runtimePlatform"]
        : null,
    },
    {
      title: i18next.t("Funding"),
      value: record.ui.funding ? <Funding funding={record.ui.funding} /> : null,
    },
    {
      title: i18next.t("Imprint"),
      value:
        record.ui.publishing_information &&
        record.ui.publishing_information.imprint
          ? record.ui.publishing_information.imprint
          : null,
    },
    {
      title: i18next.t("Formats"),
      value: record.metadata.formats
        ? record.metadata.formats.join(", ")
        : null,
    },
    {
      title: i18next.t("Languages"),
      value: record.ui.languages
        ? record.ui.languages.map(({ title_l10n }) => title_l10n).join(", ")
        : null,
    },
    {
      title: i18next.t("Media and materials"),
      value: record.custom_fields["kcr:media"]
        ? record.custom_fields["kcr:media"].join(",")
        : null,
    },
    {
      title: i18next.t("Operating systems supported"),
      value: record.custom_fields["code:operatingSystem"]
        ? record.custom_fields["code:operatingSystem"]
        : null,
    },
    {
      title: i18next.t("Programming languages"),
      value: record.custom_fields["code:programmingLanguage"]
        ? record.custom_fields["code:programmingLanguage"]
        : null,
    },
    {
      title: i18next.t("Project title"),
      value: record.custom_fields["kcr:project_title"]
        ? record.custom_fields["kcr:project_title"]
        : null,
    },
    {
      title: i18next.t("Publication date"),
      value: record.ui.publication_date_l10n_long,
    },
    {
      title: i18next.t("Project or publication website"),
      value: record.custom_fields["kcr:publication_url"]
        ? record.custom_fields["kcr:publication_url"]
        : null,
    },
    { title: i18next.t("Publisher"), value: record.metadata.publisher },
    {
      title: i18next.t("Published in"),
      value:
        record.ui.publishing_information &&
        record.ui.publishing_information.journal
          ? record.ui.publishing_information.journal
          : null,
    },
    {
      title: i18next.t("References"),
      value: record.ui.references ? (
        <References
          references={record.ui.references}
          identifierSchemes={identifierSchemes}
        />
      ) : null,
    },
    {
      title: i18next.t("Related identifiers"),
      value: record.ui.related_identifiers ? (
        <RelatedIdentifiers
          relatedIdentifiers={record.ui.related_identifiers}
          identifierSchemes={identifierSchemes}
          landingUrls={landingUrls}
        />
      ) : null,
    },
    {
      title: i18next.t("Source code repository"),
      value: record.custom_fields["code:codeRepository"]
        ? record.custom_fields["code:codeRepository"]
        : null,
    },
    {
      title: i18next.t("Resource type"),
      value: record.ui.resource_type.title_l10n,
    },
    {
      title: i18next.t("Series"),
      value: record.custom_fields["kcr:series"]
        ? record.custom_fields["kcr:series"]
        : null,
    },
    {
      title: i18next.t("Sizes"),  // FIXME: Hack because the size field is used for both sizes and duration
      value: record.metadata.sizes && !record.metadata.sizes.find(size => isDuration(size)) ? record.metadata.sizes.join(", ") : null,
    },
    {
      title: i18next.t("Duration"),  // FIXME: Hack because the size field is used for both sizes and duration
      value: record.metadata.sizes && record.metadata.sizes.find(size => isDuration(size)) ? record.metadata.sizes.join(", ") : null,
    },
    {
      title: i18next.t("Sponsoring institution"),
      value: record.custom_fields["kcr:sponsoring_institution"]
        ? record.custom_fields["kcr:sponsoring_institution"]
        : null,
    },
    {
      title: i18next.t("URLs"),
      value: record.metadata.identifiers?.filter(
        (id) => id.scheme === "url"
      ) ? (
        <URLs identifiers={record.metadata.identifiers} />
      ) : null,
    },
    {
      title: i18next.t("Version"),
      value: record.metadata.version ? record.metadata.version : null,
    },
    {
      title: i18next.t("Volumes"),
      value: record.custom_fields["kcr:volumes"] ? (
        <Volumes volumes={record.custom_fields["kcr:volumes"]} />
      ) : null,
    },
  ];

  const filteredDetailsInfo = detailsInfo.filter(
    ({ title, value }) =>
      (typeof value === "string" || React.isValidElement(value)) &&
      detailOrder.includes(title)
  );
  const sortedDetailsInfo = filteredDetailsInfo.toSorted(
    (a, b) => detailOrder.indexOf(a.title) - detailOrder.indexOf(b.title)
  );

  const detailsComponentArray = sortedDetailsInfo.map(({ title, value }) =>
    typeof value === "string" ? (
      <DetailItem title={title} value={value} key={title} />
    ) : (
      value
    )
  );

  return detailsComponentArray.length > 0 ? detailsComponentArray : null;
};

const DetailItem = ({ title, value, trueLabel, falseLabel, isVocabulary }) => {
  let valueComponent = <dd></dd>;
  if (typeof value === "string") {
    valueComponent = <dd dangerouslySetInnerHTML={{ __html: value }} />;
  } else if (typeof value === "boolean") {
    valueComponent = <dd>{value ? trueLabel : falseLabel}</dd>;
  } else if (isVocabulary) {
    valueComponent = <dd>{value.join(", ")}</dd>;
  } else if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "string"
  ) {
    valueComponent = <dd>{value.join(", ")}</dd>;
  } else {
    valueComponent = <dd>{value}</dd>;
  }

  return (
    <React.Fragment key={title}>
      <dt className="ui tiny header">{title}</dt>
      {valueComponent}
    </React.Fragment>
  );
};

const ConferenceDetailSection = ({ conference }) => {
  let titlePiece = conference.url ? (
    <a href={conference.url}>
      <i className="fa fa-external-link"></i> {conference.title}
    </a>
  ) : (
    `${conference.title}`
  );
  let conferencePieces = [
    conference.place,
    conference.dates,
    conference.session,
    conference.session_part,
  ];
  conferencePieces = conferencePieces.filter((piece) => piece);

  return (
    <>
      <dt className="ui tiny header">Event</dt>
      <dd>{titlePiece}, {conferencePieces.join(", ")}</dd>
      {conference.url && !conference.title && (
        <>
          <dt className="ui tiny header">Event</dt>
          <dd>
            <a href={conference.url}>
              <i className="fa fa-external-link"></i>{" "}
              {i18next.t("Conference website")}
            </a>
          </dd>
        </>
      )}
    </>
  );
};

const PublishingDetails = ({
  customFieldsUi,
  doiBadgeUrl,
  hasFiles,
  iconsKcUsername,
  iconsGnd,
  iconsOrcid,
  iconsRor,
  identifierSchemes,
  landingUrls,
  localizedStats,
  record,
  section,
  show: showWhole,
  showDecimalSizes,
  showAccordionIcons = false,
  subsections: accordionSections,
}) => {
  const [activeIndex, setActiveIndex] = React.useState([1]);
  const customFieldSectionNames = customFieldsUi.map(({ section }) => section);
  const sectionsArray = accordionSections.reduce(
    (acc, { section: sectionTitle, subsections, icon, show }) => {
      if (customFieldSectionNames.includes(sectionTitle)) {
        const detailOrder = subsections;
        const sectionCustomFields = customFieldsUi.find(
          ({ section }) => section === sectionTitle
        );
        const fieldContent = getCustomFieldComponents({
          sectionFields: sectionCustomFields.fields,
          customFields: record.custom_fields,
          detailOrder: detailOrder,
        });
        if (fieldContent[0]) {
          acc.push({
            key: sectionTitle,
            title: { content: sectionTitle, icon: sectionCustomFields.icon },
            content: {
              content: fieldContent,
            },
          });
        }
      } else {
        const detailOrder = subsections?.map(({ section }) => section);
        acc.push({
          title: { content: sectionTitle, icon: icon },
          content: {
            content: getDetailsComponents({
              customFieldsUi: customFieldsUi,
              detailOrder: detailOrder,
              doiBadgeUrl: doiBadgeUrl,
              hasFiles: hasFiles,
              iconsKcUsername: iconsKcUsername,
              iconsGnd: iconsGnd,
              iconsOrcid: iconsOrcid,
              iconsRor: iconsRor,
              identifierSchemes: identifierSchemes,
              landingUrls: landingUrls,
              localizedStats: localizedStats,
              record: record,
              showDecimalSizes: showDecimalSizes,
            }),
          },
          show: show,
        });
      }
      return acc;
    },
    []
  );

  const handleHeaderClick = (index) => {
    const newIndex = activeIndex.includes(index)
      ? activeIndex.filter((i) => i !== index)
      : [...activeIndex, index];
    setActiveIndex(newIndex);
  };

  return (
    <Accordion fluid exclusive={false} defaultActiveIndex={[1]}>
      {sectionsArray.map(
        ({ title, content, show }, idx) =>
          content.content && (
            <>
              <Accordion.Title
                as="button"
                active={activeIndex.includes(idx)}
                index={idx}
                onClick={() => handleHeaderClick(idx)}
                className={`${title.content} ${show}`}
              >
                <Icon
                  name={
                    !!title.icon && !!showAccordionIcons
                      ? title.icon
                      : "dropdown"
                  }
                />
                {title.content}
              </Accordion.Title>
              <Accordion.Content
                active={activeIndex.includes(idx)}
                className={`ui ${title.content} ${show}`}
              >
                <dl className="details-list mt-0">
                  {content.content.map((component) => component)}
                </dl>
              </Accordion.Content>
            </>
          )
      )}
    </Accordion>
  );
};

export { PublishingDetails, getDetailsComponents };
