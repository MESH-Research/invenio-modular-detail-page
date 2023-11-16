import React from "react";

const DetailSidebarRightsSection = ({ rights }) => {
  const licenseLink = (license) => {
    if (license.link) {
      return (
        <a
          className="license-link"
          href={license.link}
          target="_blank"
          rel="noopener noreferrer"
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
        >
          Read more
        </a>
      );
    }
  };

  return (
    rights && (
      <div className="sidebar-container">
        <h2 className="ui medium top attached header mt-0">Rights</h2>
        <div id="licenses" className="ui segment bottom attached rdm-sidebar">
          <ul className="details-list m-0 p-0">
            {rights.map((license, index) => (
              <li
                id={`license-${license.id}-${index}`}
                className="has-popup"
                key={index}
              >
                <div
                  id={`title-${license.id}-${index}`}
                  className="license clickable"
                  tabIndex="0"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  role="button"
                  aria-label={license.title_l10n}
                >
                  {license.icon && (
                    <span className="icon-wrap">
                      <img
                        className="icon"
                        src={`icons/licenses/${license.icon}.svg`}
                        alt={`${license.id} icon`}
                      />
                    </span>
                  )}
                  <span className="title-text">{license.title_l10n}</span>
                </div>
                <div
                  id={`description-${license.id}-${index}`}
                  className="licenses-description ui flowing popup transition hidden"
                  role="dialog"
                  aria-labelledby={`title-${license.id}-${index}`}
                >
                  <i
                    role="button"
                    tabIndex="0"
                    className="close icon text-muted"
                    aria-label="Close"
                  ></i>
                  <div
                    id={`license-description-${index}`}
                    className="description"
                  >
                    <span className="text-muted">
                      {license.description_l10n || "No further description."}
                    </span>
                    {licenseLink(license)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export { DetailSidebarRightsSection };
