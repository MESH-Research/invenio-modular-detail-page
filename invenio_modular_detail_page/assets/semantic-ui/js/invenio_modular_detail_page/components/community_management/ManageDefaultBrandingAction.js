/*
* This file is part of Knowledge Commons Works.
*   Copyright (C) 2024 Mesh Research.
*
* Knowledge Commons Works is based on InvenioRDM, and
* this file is based on code from InvenioRDM. InvenioRDM is
*   Copyright (C) 2020-2024 CERN.
*   Copyright (C) 2020-2024 Northwestern University.
*   Copyright (C) 2020-2024 T U Wien.
*
* InvenioRDM and Knowledge Commons Works are both free software;
* you can redistribute and/or modify them under the terms of the
* MIT License; see LICENSE file for more details.
*/

import React, { useEffect, useState } from "react";
import { Button, Message, Popup } from "semantic-ui-react";
import { i18next } from "@translations/i18next";
import { Trans } from "react-i18next";
import { http, withCancel } from "react-invenio-forms";
import PropTypes from "prop-types";

const ManageDefaultBrandingAction = ({
  brandingRestricted,
  currentDefaultCommunity,
  isCommunityDefault,
  result,
  recordCommunityEndpoint,
  updateRecordCallback,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [cancellableAction, setCancellableAction] = useState(null);

  useEffect(() => {
    return () => {
      if (cancellableAction) {
        cancellableAction.cancel();
      }
    };
  }, [cancellableAction]);

  const handleSetBranding = async (value) => {
    setLoading(true);

    const payload = {
      default: value,
    };

    const action = withCancel(http.put(recordCommunityEndpoint, payload));
    setCancellableAction(action);

    try {
      const response = await action.promise;
      setLoading(false);
      updateRecordCallback(response.data);
    } catch (error) {
      if (error === "UNMOUNTED") return;

      console.error(error);
      setError(error?.response?.data?.message || error?.message);
      setLoading(false);
    }
  };

  const renderCommunity = () => {
    const communityTitle = result.metadata.title;

    return isCommunityDefault ? null : (
      <Popup
        trigger={
          <Button
            size="tiny"
            labelPosition="left"
            icon="star"
            floated="right"
            onClick={() => handleSetBranding(result.id)}
            content={i18next.t("Set as primary")}
            aria-label={i18next.t(
              "Make {{communityTitle}} appear as the primary displayed collection for this record",
              {
                communityTitle,
              }
            )}
            loading={loading}
          />
        }
        content={i18next.t(
          "Make {{communityTitle}} appear as the primary displayed collection for this record",
          {
            communityTitle,
          }
        )}
        position="top center"
      />
    );
  };

  return error ? (
    <Message
      negative
      floated="right"
      className="community-branding-error"
      size="tiny"
    >
      {brandingRestricted ?
        <Trans
          i18n={i18next}
          components={{ bold: <b /> }}
          defaults="The <bold>{{collection}}</bold> community does not allow you to set a different primary display collection. Please contact the collection owner or managers for assistance."
          values={{ collection: currentDefaultCommunity?.metadata?.title || currentDefaultCommunity?.slug }}
        />
        : error
      }
    </Message>
  ) : (
    renderCommunity()
  );
};

ManageDefaultBrandingAction.propTypes = {
  result: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.object.isRequired,
  updateRecordCallback: PropTypes.func.isRequired,
  isCommunityDefault: PropTypes.bool.isRequired,
};

export { ManageDefaultBrandingAction };
