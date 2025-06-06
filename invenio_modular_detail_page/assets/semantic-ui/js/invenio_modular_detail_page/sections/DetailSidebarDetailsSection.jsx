import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { getDetailsComponents } from "../components/PublishingDetails";
import Overridable from "react-overridable";

const SidebarDetailsSection = (props) => {
  const {
    customFieldsUi,
    doiBadgeUrl,
    identifierSchemes,
    landingUrls,
    record,
    subsections,
    show,
    show_heading,
  } = props;
  const detailOrder = subsections.map(({ section }) => section);
  const idDoi = record.pids.doi ? record.pids.doi.identifier : null;

  return (
    <Overridable
      id="InvenioModularDetailPage.SidebarDetailsSection.layout"
      {...props}
    >
      <div
        id="publication-details"
        className={`sidebar-container ${show}`}
        aria-label={i18next.t("Publication details")}
      >
        {show_heading === true && (
          <h2 className="ui medium top attached header mt-0">
            {i18next.t("Details")}
          </h2>
        )}
        <div id="record-details" className="ui segment rdm-sidebar">
          <div className="badges-row">
            {record.ui.resource_type && (
              <span
                className="ui label horizontal small basic mb-5"
                title={i18next.t("Resource type")}
              >
                {record.ui.resource_type.title_l10n}
              </span>
            )}

            <span
              className={`ui label horizontal small access-status ${record.ui.access_status.id} mb-5`}
              title={i18next.t("Access status")}
              data-tooltip={record.ui.access_status.description_l10n}
              data-inverted=""
            >
              {record.ui.access_status.icon && (
                <i className={`icon ${record.ui.access_status.icon}`}></i>
              )}
              {record.ui.access_status.title_l10n}
            </span>
          </div>

          <dl className="details-list mt-0">
            {getDetailsComponents({
              customFieldsUi,
              detailOrder,
              doiBadgeUrl,
              identifierSchemes,
              landingUrls,
              record,
            })}
          </dl>
        </div>
      </div>
    </Overridable>
  );
};

export { SidebarDetailsSection };
