// Part of Knowledge Commons Works
// Copyright (C) 2023-2026, MESH Research
//
// Knowledge Commons Works is an instance of InvenioRDM, which is
// Copyright (c) 2019-2026, CERN
//
// Knowledge Commons Works and InvenioRDM are both free software;
// You can redistribute and/or modify them under the terms of the
// MIT License; see LICENSE file for more details.

import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Popup, Label } from "semantic-ui-react";
import Overridable from "react-overridable";

/**
 * Prepend © when the copyright statement does not already start with © or (c).
 *
 * Leading HTML tags are ignored so sanitized markup like `<p>2024 Author</p>`
 * still gets the symbol. Recognizes the unicode symbol, `(c)` / `(C)`, and `&copy;`.
 *
 * @param {string} html - Copyright HTML from record metadata.
 * @returns {string} HTML with © prepended when needed.
 */
const withCopyrightSymbol = (html) => {
  const trimmed = html.trim();
  const textStart = trimmed.replace(/^(?:\s*<[^>]+>\s*)+/, "");
  if (/^(?:©|&copy;|\(c\))/i.test(textStart)) {
    return trimmed;
  }
  return `© ${trimmed}`;
};

const SidebarRightsSection = (props) => {
  const { copyright, rights, section } = props;
  const hasCopyright = typeof copyright === "string" && copyright.trim().length > 0;
  const hasLicenses = Array.isArray(rights) && rights.length > 0;

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

  if (!hasCopyright && !hasLicenses) {
    return null;
  }

  return (
    <Overridable id="InvenioModularDetailPage.SidebarRightsSection.layout" {...props}>
      <div
        id="record-licenses"
        className="sidebar-container"
        aria-label={i18next.t("Copyright and permissions")}
      >
        <h2 id="copyright-permissions-header" className="ui medium top attached header mt-0 pb-0">
          {section}
        </h2>
        <div
          id="copyright-permissions"
          className="ui segment bottom attached rdm-sidebar pt-0 pb-0 pb-10"
        >
          {hasCopyright && (
            <div
              id="copyright"
              className={hasLicenses ? "copyright-text mb-10 pt-5" : "copyright-text"}
              dangerouslySetInnerHTML={{ __html: withCopyrightSymbol(copyright) }}
            />
          )}
          {hasLicenses && (
            <>
              <h3 id="licenses-header" className="ui tiny header mt-10">
                {i18next.t("Licenses")}
              </h3>
              <div id="licenses" className="p-0">
                <ul className="details-list m-0 p-0">
                  {rights.map((license, index) => (
                    <li id={`license-${license.id}-${index}`} className="has-popup" key={index}>
                      <Popup
                        id={`description-${license.id}-${index}`}
                        className="licenses-description ui wide popup transition hidden"
                        role="dialog"
                        aria-labelledby={`title-${license.id}-${index}`}
                        tabIndex="0"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-label={license.title_l10n}
                        trigger={
                          <button
                            id={`title-${license.id}-${index}`}
                            className="ui button license transparent borderless borderless-hover basic fluid left aligned p-0"
                            role="button"
                          >
                            {license.icon && (
                              <span className="icon-wrap right floated ml-15">
                                <img
                                  className="icon"
                                  src={`/static/icons/licenses/${license.icon}.svg`}
                                  alt={`${license.id} icon`}
                                />
                              </span>
                            )}
                            <span className="title-text">{license.title_l10n}</span>
                          </button>
                        }
                        on="click"
                      >
                        <Popup.Content id={`license-description-${index}`} className="description">
                          {license.description_l10n && (
                            <span className="text-muted">{license.description_l10n} </span>
                          )}
                          {licenseLink(license)}
                        </Popup.Content>
                      </Popup>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </Overridable>
  );
};

export { SidebarRightsSection };
