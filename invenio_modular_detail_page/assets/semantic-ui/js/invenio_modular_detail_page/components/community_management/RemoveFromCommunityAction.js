/*
* This file is part of Knowledge Commons Works.
*   Copyright (C) 2024 Mesh Research.
*
* Knowledge Commons Works is based on InvenioRDM, and
* this file is based on code from InvenioRDM. InvenioRDM is
*   Copyright (C) 2020-2024 CERN.
*   Copyright (C) 2023 KTH Royal Institute of Technology
*
* InvenioRDM and Knowledge Commons Works are both free software;
* you can redistribute and/or modify them under the terms of the
* MIT License; see LICENSE file for more details.
*/

import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal, Message, Icon, Checkbox } from "semantic-ui-react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { http, ErrorMessage } from "react-invenio-forms";
import PropTypes from "prop-types";
import { DetailContext } from "@js/invenio_modular_detail_page/contexts/DetailContext";

const RemoveFromCommunityAction = ({
  result,
  recordCommunityEndpoint,
  successCallback
}) => {
  const { permissionsPerField } = useContext(DetailContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [checkboxMembers, setCheckboxMembers] = useState(false);
  const [checkboxRecords, setCheckboxRecords] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const communityTitle = result.metadata.title;

  const checkBoxRef = useRef(null);

  let removalRestricted = false;
  const currentCommunityPermissions = permissionsPerField?.[result.slug]?.policy;
  if (currentCommunityPermissions) {
    const restrictedFields = Array.isArray(currentCommunityPermissions)
      ? currentCommunityPermissions
      : Object.keys(currentCommunityPermissions);
    removalRestricted = restrictedFields.some(
      (field) => field.replace("|", ".").startsWith("parent.communities.default")
    );
  }

  useEffect(() => {
    if (modalOpen && checkBoxRef.current) {
      const {
        current: { inputRef },
      } = checkBoxRef;
      inputRef?.current?.focus(); // A11y: Focus first interactive element when modal opens
    }
  }, [modalOpen, checkBoxRef]);

  const openConfirmModal = () => setModalOpen(true);
  const closeConfirmModal = () => setModalOpen(false);

  const handleDelete = async () => {
    setLoading(true);
    const payload = {
      communities: [{ id: result.id }],
    };

    try {
      const response = await http.delete(recordCommunityEndpoint, {
        data: payload,
      });
      successCallback(response.data);
      closeConfirmModal();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e, { id, checked }) => {
    if (id === "members-confirm") {
      setCheckboxMembers(checked);
      setButtonDisabled(!(checked && checkboxRecords));
    }
    if (id === "records-confirm") {
      setCheckboxRecords(checked);
      setButtonDisabled(!(checkboxMembers && checked));
    }
  };

  return (
    <>
      <Button
        size="tiny"
        negative
        labelPosition="left"
        icon="trash"
        floated="right"
        onClick={openConfirmModal}
        content={i18next.t("Remove")}
        aria-label={i18next.t("Remove {{communityTitle}} from this record", {
          communityTitle,
        })}
      />
      <Modal size="tiny" dimmer="blurring" open={modalOpen}>
        <Modal.Header as="h2">{i18next.t("Remove collection")}</Modal.Header>
        <Modal.Content>
          <p>
            {i18next.t(
              "Are you sure you want to remove the record from the collection?"
            )}
          </p>
          {removalRestricted && (
            <Message>
              <Message.Header className="rel-mb-1">
                <Icon name="warning sign" className="rel-mr-1" />
                {i18next.t("Only authorized users can remove works")}
              </Message.Header>
              <p>
                {i18next.t(
                  "This collection restricts the ability to remove works. If you are not able to remove the work, please contact the collection owner or managers."
                )}
              </p>
            </Message>
          )}
          {!error && (
            <Message negative>
              <Message.Header className="rel-mb-1">
                <Icon name="warning sign" className="rel-mr-1" />
                {i18next.t("I understand the consequences:")}
              </Message.Header>
              <>
                <Checkbox
                  ref={checkBoxRef}
                  id="members-confirm"
                  label={
                    /* eslint-disable-next-line jsx-a11y/label-has-associated-control */
                    <label>
                      {i18next.t(
                        "Members of the collection {{communityTitle}} will lose their access to the record if it is not public",
                        { communityTitle }
                      )}
                    </label>
                  }
                  checked={checkboxMembers}
                  onChange={handleCheckboxChange}
                  className="mb-5"
                />
                <Checkbox
                  id="records-confirm"
                  label={i18next.t(
                    "The record can only be re-included in the collection by going through a new review by the collection curators."
                  )}
                  checked={checkboxRecords}
                  onChange={handleCheckboxChange}
                  className="mb-5"
                />
              </>
            </Message>
          )}
        </Modal.Content>

        <Modal.Actions>
          {error && (
            <ErrorMessage
              header={i18next.t("Something went wrong")}
              content={error.response?.data?.errors[0]?.message || error.message}
              icon="exclamation"
              className="text-align-left"
              negative
            />
          )}
          <Button
            onClick={() => closeConfirmModal()}
            floated="left"
            disabled={loading}
            loading={loading}
            aria-label={i18next.t("Cancel removal")}
          >
            {i18next.t("Cancel")}
          </Button>
          <Button
            disabled={buttonDisabled || loading || error}
            negative
            onClick={() => handleDelete()}
            loading={loading}
            content={i18next.t("Remove")}
            aria-label={i18next.t("Confirm removal")}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

RemoveFromCommunityAction.propTypes = {
  result: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.object.isRequired,
  successCallback: PropTypes.func.isRequired,
};

export { RemoveFromCommunityAction };
