// This file is part of Knowledge Commons Repository
// Copyright (C) 2023 MESH Research
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
import {
  Button,
  Checkbox,
  Form,
  Input,
  Icon,
  Label,
  Popup,
} from "semantic-ui-react";
import Overridable from "react-overridable";
import { i18next } from "@translations/invenio_app_rdm/i18next";

function PopupInput({ message }) {
  const inputRef = useRef(null);
  const [remember, setRemember] = useState(false);
  const [domain, setDomain] = useState("mastodon.social");
  const [messageText, setMessageText] = useState(message);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
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
        <Input
          ref={inputRef}
          onChange={handleChangeDomain}
          value={domain}
          size="small"
        />
      </Form.Field>
      <Form.Field size="tiny">
        <Checkbox
          label="Remember me"
          onChange={handleChangeCheckbox}
          toggle
          size="tiny"
        />
      </Form.Field>
      <Form.Field>
        <textarea
          rows="6"
          defaultValue={messageText}
          onChange={handleChangeText}
        />
      </Form.Field>
      <Button type="submit" onClick={handleSubmit}>
        Toot
      </Button>
    </Form>
  );
}

function PopupButton({ trigger, message }) {
  return (
    <Popup
      trigger={trigger}
      content={<PopupInput message={message} />}
      on="click"
      position="top right"
    />
  );
}

function SharingIconLink({ name, tabIndex, url, iconName }) {
  const [mastodonHover, setMastodonHover] = useState(false);
  const mastodonRef = useRef();

  return name === "Mastodon" ? (
    <>
      <Popup
        content={name}
        position="top center"
        on={['hover', 'focus']}
        open={mastodonHover}
        trigger={<span className="mastodon-popup" />}
      />
      <PopupButton
        ref={mastodonRef}
        trigger={
          <Button
            target="_blank"
            rel="noopener noreferrer"
            icon
            compact
            basic
            secondary
            size="big"
            tabIndex={tabIndex}
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
    </>
  ) : (
    <Popup content={name} position="top center"
     trigger={
      <Button
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        on={['hover', 'click', 'focus']}
        icon
        compact
        basic
        secondary
        size="big"
        tabIndex={tabIndex}
      >
        <Icon name={iconName} />
      </Button>
     }
    />
  );
}

function SidebarSharingSection(props) {
  const { record, sectionIndex, show, showHeading = true } = props;
  const pageLink = encodeURIComponent(record.links.self_html);

  const socialMediaLinks = [
    {
      name: "Mastodon",
      url: `${record.metadata.title}%0A${pageLink}`,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${pageLink}`,
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
      name: "VK",
      url: `http://vk.com/share.php?url=${pageLink}&title=${record.metadata.title}&description=${record.metadata.description}`,
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

  return (
    <Overridable id="InvenioModularDetailPage.SidebarSharingSection.layout">
      <div className={`sidebar-container ${show}`} id="social-sharing">
        {showHeading === true && (
          <h2 className="ui medium top attached header mt-0">
            {i18next.t("Share this work")}
          </h2>
        )}
        <div className="ui segment bottom attached rdm-sidebar">
          {/* <h2 className="ui medium top attached header mt-0">Share</h2> */}
          {socialMediaLinks.map(({ name, url }, idx) => (
            <SharingIconLink
              key={name}
              name={name}
              url={url}
              iconName={name === "Email" ? "mail" : name.toLowerCase()}
              tabIndex={sectionIndex + idx + 1}
            />
          ))}
        </div>
      </div>
    </Overridable>
  );
}

export { SidebarSharingSection };
