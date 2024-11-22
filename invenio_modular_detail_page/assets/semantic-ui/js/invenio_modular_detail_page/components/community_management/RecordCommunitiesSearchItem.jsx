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

import { RemoveFromCommunityAction } from "./RemoveFromCommunityAction";
import React, { Component } from "react";
import { CommunityCompactItem } from "./CommunityCompactItem";
import PropTypes from "prop-types";
import { ManageDefaultBrandingAction } from "./ManageDefaultBrandingAction";

export class RecordCommunitiesSearchItem extends Component {
  render() {
    const {
      result,
      successCallback,
      updateRecordCallback,
      recordCommunityEndpoint,
      recordParent,
      permissions: { can_manage: canManage },
    } = this.props;

    const isCommunityDefault = recordParent?.communities?.default === result?.id;
    const actions = canManage && (
      <>
        <ManageDefaultBrandingAction
          result={result}
          recordCommunityEndpoint={recordCommunityEndpoint}
          updateRecordCallback={updateRecordCallback}
          isCommunityDefault={isCommunityDefault}
        />
        <RemoveFromCommunityAction
          result={result}
          recordCommunityEndpoint={recordCommunityEndpoint}
          successCallback={successCallback}
        />
      </>
    );
    return (
      <CommunityCompactItem
        actions={actions}
        result={result}
        isCommunityDefault={isCommunityDefault}
      />
    );
  }
}

RecordCommunitiesSearchItem.propTypes = {
  result: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.string.isRequired,
  successCallback: PropTypes.func.isRequired,
  updateRecordCallback: PropTypes.func.isRequired,
  permissions: PropTypes.object.isRequired,
  recordParent: PropTypes.object.isRequired,
};
