import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Popup } from "semantic-ui-react";
import Overridable from "react-overridable";

const SidebarRightsSection = (props) => {
  const { rights, section } = props;
  const licenseLink = (license) => {
    if (license.link) {
      return (
        <a
          className="license-link"
          href={license.link}
          target="_blank"
          rel="noopener noreferrer"
          title={i18next.t("Opens in new tab")}
        >
          Read more
        </a>
      );
    } else if (license.props && license.props.url) {
      return (
        <a
          className="license-link"
          href={license.props.url}
          target="_blank"
          rel="noopener noreferrer"
          title={i18next.t("Opens in new tab")}
        >
          Read more
        </a>
      );
    }
  };

  return !rights ? null : (
    <Overridable
      id="InvenioModularDetailPage.SidebarRightsSection.layout"
      {...props}
    >
      <div id="record-licenses" className="sidebar-container" aria-label="Record licenses">
        <h2 id="licenses-header" className="ui medium top attached header mt-0">
          {section}
        </h2>
        <div id="licenses" className="ui segment bottom attached rdm-sidebar">
          <ul className="details-list m-0 p-0">
            {rights.map((license, index) => (
              <li
                id={`license-${license.id}-${index}`}
                className="has-popup"
                key={index}
              >
                <Popup
                  id={`description-${license.id}-${index}`}
                  className="licenses-description ui flowing popup transition hidden"
                  role="dialog"
                  aria-labelledby={`title-${license.id}-${index}`}
                  tabIndex="0"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-label={license.title_l10n}
                  trigger={
                    <div
                      id={`title-${license.id}-${index}`}
                      className="license clickable"
                      role="button"
                    >
                      {license.icon && (
                        <span className="icon-wrap">
                          <img
                            className="icon"
                            src={`/static/icons/licenses/${license.icon}.svg`}
                            alt={`${license.id} icon`}
                          />
                        </span>
                      )}
                      <span className="title-text">{license.title_l10n}</span>
                    </div>
                  }
                  on="click"
                >
                  <Popup.Content
                    id={`license-description-${index}`}
                    className="description"
                  >
                    {license.description_l10n && (
                      <span className="text-muted">
                        {license.description_l10n}{" "}
                      </span>
                    )}
                    {licenseLink(license)}
                  </Popup.Content>
                </Popup>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Overridable>
  );
};

export { SidebarRightsSection };
