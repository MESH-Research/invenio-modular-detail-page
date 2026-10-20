// This file is part of Knowledge Commons Repository
// Copyright (C) 2023-2024 MESH Research
//
// It is modified from files provided in InvenioRDM
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2021 TU Wien
//
// Knowledge Commons Repository and Invenio RDM Records are both free software;
// you can redistribute them and/or modify them under the terms of the MIT
// License; see LICENSE file for more details.

import React, { useRef, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Icon, Popup } from "semantic-ui-react";
import Overridable from "react-overridable";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";

function PopupInput({ message }) {
  const inputRef = useRef(null);
  const [remember, setRemember] = useState(false);
  const [domain, setDomain] = useState("mastodon.social");
  const [messageText, setMessageText] = useState(message);

  useEffect(() => {
    if (inputRef.current) {
      window.setTimeout(() => {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    const storedDomain = localStorage.getItem("mastodon-instance");
    if (!!storedDomain) {
      setDomain(storedDomain);
      setRemember(true);
    } else {
      setDomain("mastodon.social");
      setRemember(false);
    }
  }, []);

  const handleSubmit = () => {
    window.open(`https://${domain}/share?text=${message}`, "_blank").focus();
    if (remember) {
      localStorage.setItem("mastodon-instance", domain);
    }
  };

  const handleChangeCheckbox = (e, data) => {
    setRemember(data.checked);
    if (!!data.checked) {
      localStorage.setItem("mastodon-instance", domain);
    } else {
      localStorage.removeItem("mastodon-instance");
    }
  };

  const handleChangeDomain = (e) => {
    setDomain(e.target.value);
  };

  const handleChangeText = (e) => {
    setMessageText(e.target.value);
  };

  return (
    <Form>
      <Form.Field>
        <label>Your Mastodon domain</label>
        <Input ref={inputRef} onChange={handleChangeDomain} value={domain} size="small" />
      </Form.Field>
      <Form.Field size="tiny">
        <Checkbox label="Remember me" onChange={handleChangeCheckbox} toggle size="tiny" />
      </Form.Field>
      <Form.Field>
        <textarea rows="6" defaultValue={messageText} onChange={handleChangeText} />
      </Form.Field>
      <Button type="submit" onClick={handleSubmit}>
        Toot
      </Button>
    </Form>
  );
}

function PopupButton({ trigger, message, innerRef }) {
  return (
    <Popup
      ref={innerRef}
      trigger={trigger}
      content={<PopupInput message={message} />}
      on="click"
      position="top right"
    />
  );
}

function SharingIconLink({ name, url, iconName }) {
  const [mastodonHover, setMastodonHover] = useState(false);
  const mastodonRef = useRef();

  let component;

  switch (name) {
    case "Mastodon":
      component = (
        <span className="sharing-icon">
          <Popup
            content={name}
            position="top center"
            on={["hover", "focus"]}
            open={mastodonHover}
            trigger={<span className="mastodon-popup" />}
          />
          <PopupButton
            innerRef={mastodonRef}
            trigger={
              <Button
                target="_blank"
                rel="noopener noreferrer"
                icon
                compact
                size="big"
                onMouseEnter={() => setMastodonHover(true)}
                onMouseLeave={() => setMastodonHover(false)}
              >
                <i className="icon mastodon">
                  <svg alt="Mastodon" viewBox="0 0 24 24">
                    <use xlinkHref="/static/images/mastodon.svg#mastodon" />
                  </svg>
                </i>
              </Button>
            }
            message={url}
          />
        </span>
      );
      break;
    case "Bluesky":
      component = (
        <span className="sharing-icon">
          <Popup
            content={name}
            position="top center"
            trigger={
              <Button
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                on={["hover", "click", "focus"]}
                icon
                compact
                size="big"
              >
                <i className="icon bluesky">
                  <svg alt="Bluesky" viewBox="0 0 600 600">
                    <use xlinkHref={`/static/images/bluesky.svg#bluesky`} />
                  </svg>
                </i>
              </Button>
            }
          />
        </span>
      );
      break;
    default:
      component = (
        <span className="sharing-icon">
          <Popup
            content={name}
            position="top center"
            trigger={
              <Button
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                on={["hover", "click", "focus"]}
                icon
                compact
                size="big"
              >
                <Icon name={iconName} />
              </Button>
            }
          />
        </span>
      );
      break;
  }

  return component;
}

/**
 * Build social share link defs for a record page URL.
 *
 * @param {object} record - Record object with metadata and links.
 * @returns {Array<{name: string, url: string}>}
 */
function buildSocialMediaLinks(record) {
  const pageLink = encodeURI(record.links.self_html);
  return [
    {
      name: "Mastodon",
      url: `${record.metadata.title}%0A${pageLink}`,
    },
    {
      name: "Bluesky",
      url: `https://bsky.app/intent/compose?text=${record.metadata.title}%0A${pageLink}`,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=#${encodeURIComponent(pageLink)}`,
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${pageLink}`,
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${pageLink}&title=${record.metadata.title}`,
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${record.metadata.title}+${pageLink}`,
    },
    {
      name: "Telegram",
      url: `https://telegram.me/share/url?url=${pageLink}&text=${record.metadata.title}`,
    },
    {
      name: "WeChat",
      url: `https://service.wechat.com/share?title=${record.metadata.title}&url=${pageLink}`,
    },
    {
      name: "Weibo",
      url: `http://service.weibo.com/share/share.php?url=${pageLink}&title=${record.metadata.title}`,
    },
    {
      name: "Email",
      url: `mailto:?subject=${"Knowledge Commons Article"}&body=${
        record.metadata.title
      }%0A${pageLink}%0A${record.metadata.description}`,
    },
  ];
}

/**
 * Social share button grid only (no sidebar heading/segment chrome).
 *
 * @param {object} props
 * @param {object} props.record - Record object.
 */
function SharingIconsGrid({ record }) {
  const socialMediaLinks = buildSocialMediaLinks(record);
  return (
    <div className="sharing-icons">
      {socialMediaLinks.map(({ name, url }) => (
        <SharingIconLink
          key={name}
          name={name}
          url={url}
          iconName={name === "Email" ? "mail" : name.toLowerCase()}
        />
      ))}
    </div>
  );
}

function SidebarSharingSection(props) {
  const { record, show, isPreview, isPreviewSubmissionRequest, showHeading = true } = props;

  return isPreview || isPreviewSubmissionRequest ? null : (
    <Overridable id="InvenioModularDetailPage.SidebarSharingSection.layout">
      <div className={`sidebar-container ${show}`} id="social-sharing">
        {showHeading === true && (
          <h2 className="ui medium top attached header mt-0">{i18next.t("Share this work")}</h2>
        )}
        <div className="ui segment bottom attached rdm-sidebar">
          <SharingIconsGrid record={record} />
        </div>
      </div>
    </Overridable>
  );
}

export { SharingIconsGrid, SidebarSharingSection };
