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

import React, { Component } from "react";
import { Button, Message, Popup } from "semantic-ui-react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { http, withCancel } from "react-invenio-forms";
import PropTypes from "prop-types";

export class ManageDefaultBrandingAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: undefined,
    };
  }

  componentWillUnmount() {
    this.cancellableAction && this.cancellableAction.cancel();
  }

  handleSetBranding = async (value) => {
    const { recordCommunityEndpoint, updateRecordCallback } = this.props;
    this.setState({ loading: true });

    const payload = {
      default: value,
    };

    this.cancellableAction = withCancel(http.put(recordCommunityEndpoint, payload));

    try {
      const response = await this.cancellableAction.promise;
      this.setState({ loading: false });
      updateRecordCallback(response.data);
    } catch (error) {
      if (error === "UNMOUNTED") return;

      console.error(error);
      this.setState({
        error: error?.response?.data?.message || error?.message,
        loading: false,
      });
    }
  };

  renderCommunity = () => {
    const { loading } = this.state;
    const { result, isCommunityDefault } = this.props;
    const communityTitle = result.metadata.title;

    return isCommunityDefault ? (null
      // <Popup
      //   trigger={
      //     <Button
      //       size="tiny"
      //       labelPosition="left"
      //       icon="paint brush"
      //       floated="right"
      //       onClick={() => this.handleSetBranding("")}
      //       content={i18next.t("Remove branding")}
      //       aria-label={i18next.t(
      //         "{{communityTitle}} appears as the primary collection displayed for this record",
      //         {
      //           communityTitle,
      //         }
      //       )}
      //       loading={loading}
      //     />
      //   }
      //   content={i18next.t(
      //     "Remove this community from appearing on top of the record details page."
      //   )}
      //   position="top center"
      // />
    ) : (
      <Popup
        trigger={
          <Button
            size="tiny"
            labelPosition="left"
            icon="star"
            floated="right"
            onClick={() => this.handleSetBranding(result.id)}
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

  render() {
    const { error } = this.state;
    return error ? (
      <Message
        negative
        floated="right"
        className="community-branding-error"
        size="tiny"
      >
        {error}
      </Message>
    ) : (
      this.renderCommunity()
    );
  }
}

ManageDefaultBrandingAction.propTypes = {
  result: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.object.isRequired,
  updateRecordCallback: PropTypes.func.isRequired,
  isCommunityDefault: PropTypes.bool.isRequired,
};
