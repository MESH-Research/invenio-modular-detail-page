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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Button, Icon, Modal } from "semantic-ui-react";
import { Citation } from "../components/Citation";
import Overridable from "react-overridable";

const CitationModal = (props) => {
  const {
    record,
    citationStyles,
    citationStyleDefault,
    onCloseHandler,
    trigger,
  } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      document.querySelector(".citation-dropdown")?.focus();
    }, 20);
  }, [open]);

  const handleOnClose = () => {
    setOpen(false);
    onCloseHandler && onCloseHandler();
  };

  return (
    <Overridable id="InvenioModularDetailPage.CitationModal.layout" {...props}>
      <Modal
        closeIcon
        trigger={trigger}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleOnClose}
        className="citation-modal"
      >
        <Modal.Header>Generate a citation for this work</Modal.Header>
        <Modal.Content>
          <Citation
            passedClassNames={`ui`}
            record={record}
            citationStyles={citationStyles}
            citationStyleDefault={citationStyleDefault}
          />
          <Button icon floated="right" onClick={handleOnClose}>
            <Icon name="close" />
            Close
          </Button>
        </Modal.Content>
      </Modal>
    </Overridable>
  );
};

const CitationSection = (props) => {
  const { record, citationStyles, citationStyleDefault, sectionIndex, show } =
    props;
  return (
    <Overridable
      id="InvenioModularDetailPage.CitationSection.layout"
      {...props}
    >
      <div
        id="citation"
        className={`sidebar-container ${show}`}
        aria-label={i18next.t("Cite this")}
      >
        <CitationModal
          record={record}
          citationStyles={citationStyles}
          citationStyleDefault={citationStyleDefault}
          trigger={
            <Button
              fluid
              content={i18next.t("Cite this")}
              icon="quote right"
              labelPosition="right"
            ></Button>
          }
        />
      </div>
    </Overridable>
  );
};

CitationSection.propTypes = {
  citationStyles: PropTypes.array.isRequired,
  record: PropTypes.object.isRequired,
  citationStyleDefault: PropTypes.string.isRequired,
};

export { CitationSection, CitationModal };
