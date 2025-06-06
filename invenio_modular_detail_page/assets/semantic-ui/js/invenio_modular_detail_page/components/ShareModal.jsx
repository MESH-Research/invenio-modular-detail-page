// This file is part of InvenioRDM
// Copyright (C) 2021 Northwestern University.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Icon,
  Input,
  Button,
  Message,
  Modal,
  Popup,
} from "semantic-ui-react";
import axios from "axios";
import { Trans } from "react-i18next";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { http } from "react-invenio-forms";
import PropTypes from "prop-types";

const ShareModal = ({ recid, open, handleClose }) => {
  const [accessLinkObj, setAccessLinkObj] = useState();
  const [linkCreated, setLinkCreated] = useState(false);
  const [shareMode, setShareMode] = useState("view");
  const [copied, setCopied] = useState(false);

  const dropdownOptions = [
    { key: "view", text: i18next.t("Can view"), value: "view" },
    { key: "preview", text: i18next.t("Can preview"), value: "preview" },
    { key: "edit", text: i18next.t("Can edit"), value: "edit" },
  ];

  const message = {
    view: (
      <span>
        <Trans>
          Anyone with this link <strong>can view all versions</strong> of this
          record & files.
        </Trans>
      </span>
    ),
    preview: (
      <span>
        <Trans>
          Anyone with this link{" "}
          <strong>can view all published and unpublished versions</strong> of
          this record & files.
        </Trans>
      </span>
    ),
    edit: (
      <span>
        <Trans>
          Anyone with an account and this link{" "}
          <strong>can edit all versions</strong> of this record & files.
        </Trans>
      </span>
    ),
  };

  const copyButtonRef = React.createRef();

  const getAccessLink = (linkObj) => {
    const extraParam = shareMode === "preview" ? "preview=1&" : "";
    return linkObj
      ? `${window.location}?${extraParam}token=${linkObj.token}`
      : "";
  };

  const createAccessLink = async () => {
    await http
      .post(
        `/api/records/${recid}/access/links`,
        { permission: shareMode },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((resp) => {
        setAccessLinkObj(resp.data);
        setLinkCreated(true);
      });
  };

  const copyAccessLink = () => {
    const copyText = document.querySelector("#input");
    copyText.select();
    let copySuccess = document.execCommand("copy");
    setCopied(copySuccess);
  };

  const handleChangeMode = (e, { value }) => setShareMode(value);

  const handleDelete = async () => {
    await http
      .delete(`/api/records/${recid}/access/links/${accessLinkObj.id}`, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      })
      .then(() => {
        setAccessLinkObj();
        setLinkCreated(false);
      });
  };

  useEffect(() => {
    linkCreated && copyAccessLink();
  }, [linkCreated]);

  useEffect(() => {
    // Update access link according to share mode
    let source = axios.CancelToken.source();

    if (accessLinkObj) {
      (async () => {
        await http.patch(
          `/api/records/${recid}/access/links/${accessLinkObj.id}`,
          { permission: shareMode },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
            cancelToken: source.token,
          }
        );
      })();
    }
    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareMode]);

  useEffect(() => {
    if (accessLinkObj) {
      setShareMode(accessLinkObj.permission);
    }
  }, [accessLinkObj]);

  useEffect(() => {
    // Fetch existing access link
    let source = axios.CancelToken.source();

    (async () => {
      const result = await axios(`/api/records/${recid}/access/links`, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
        cancelToken: source.token,
      });
      const { hits, total } = result.data.hits;
      if (total > 0) {
        // Only accessing first access link for MVP.
        setAccessLinkObj(hits[0]);
      }
    })();

    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    copyButtonRef.current?.focus(); // Accessiblity: focus the copy-button when modal opens
  }, [copyButtonRef]);

  useEffect(() => {
    let popupTimeout = setTimeout(() => {
      setCopied(false);
    }, 1500);

    return () => {
      clearTimeout(popupTimeout);
    };
  }, [copied]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="share-modal"
      role="dialog"
      aria-labelledby="access-link-modal-header"
      aria-modal="true"
      tab-index="-1"
      closeOnDocumentClick={false}
    >
      <Modal.Header id="access-link-modal-header">
        <Icon name="share alternate" />
        {i18next.t("Get a link")}
      </Modal.Header>

      <Modal.Content className="ui grid">
        <div className="share-content row">
          <Input
            id="input"
            className="sixteen wide mobile column"
            value={getAccessLink(accessLinkObj)}
            readOnly
          />
          <div className="ui sixteen wide mobile column share-content-buttons">
            <Dropdown
              className="ui small share-link-dropdown"
              size="small"
              selectOnNavigation={false}
              button
              options={dropdownOptions}
              defaultValue={shareMode}
              onChange={handleChangeMode}
            />
            <Popup
              position="top center"
              content={i18next.t("Copied!")}
              inverted
              open={copied}
              on="click"
              size="small"
              trigger={
                <Button
                  ref={copyButtonRef}
                  size="small"
                  positive={accessLinkObj ? true : false}
                  color={!accessLinkObj ? "blue" : ""}
                  onClick={
                    (accessLinkObj && copyAccessLink) || createAccessLink
                  }
                  aria-label={
                    accessLinkObj
                      ? i18next.t("Copy link")
                      : i18next.t("Get a link")
                  }
                >
                  <Icon name="copy outline" />
                  {accessLinkObj
                    ? i18next.t("Copy link")
                    : i18next.t("Get a link")}
                </Button>
              }
              className=""
            />
            <div role="alert" style={{ position: "absolute", opacity: 0 }}>
              <p>{copied && i18next.t("Copied")}</p>
            </div>
          </div>

          <Modal.Description>
            <Message className="share-description info">
              <Icon name="warning circle" size="large" />
              {!accessLinkObj
                ? i18next.t(
                    "No link has been created. Click on 'Get a Link' to make a new link."
                  )
                : message[shareMode]}
            </Message>
          </Modal.Description>
        </div>
      </Modal.Content>

      <Modal.Actions>
        {!!accessLinkObj && (
          <Button
            size="small"
            negative
            floated="left"
            onClick={handleDelete}
            icon
          >
            <Icon name="trash alternate outline" />
            {i18next.t("Delete link")}
          </Button>
        )}
        <Button size="small" onClick={handleClose}>
          {i18next.t("Done")}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

ShareModal.propTypes = {
  recid: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export { ShareModal };
