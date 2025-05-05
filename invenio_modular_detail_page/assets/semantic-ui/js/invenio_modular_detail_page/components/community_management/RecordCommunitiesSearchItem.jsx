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
import React from "react";
import { CommunityCompactItem } from "@js/kcworks/collections/community/communitiesItems/CommunityCompactItem";
import PropTypes from "prop-types";
import { ManageDefaultBrandingAction } from "./ManageDefaultBrandingAction";


/**
 * Check if the default community has a restriction on the default community field
 *
 * @param {Object} permissionsPerField - The permissions per field
 * @param {Object} currentDefaultCommunity - The current default community
 * @returns {boolean} True if the default community has a branding restriction, false otherwise
 */
function isBrandingRestricted(permissionsPerField, currentDefaultCommunity) {
  const defaultCommunityPermissions =
    permissionsPerField?.[currentDefaultCommunity?.slug]?.policy;
  if (defaultCommunityPermissions) {
    const restrictedFields = Array.isArray(defaultCommunityPermissions)
      ? defaultCommunityPermissions
      : Object.keys(defaultCommunityPermissions);
    return !!restrictedFields.some((field) =>
      field.replace("|", ".").startsWith("parent.communities.default")
    );
  }
  return false;
}


const RecordCommunitiesSearchItem = ({
  result,
  successCallback,
  updateRecordCallback,
  recordCommunityEndpoint,
  recordParent,
  permissions: { can_manage: canManage },
  permissionsPerField,
}) => {
  const isCommunityDefault = recordParent?.communities?.default === result?.id;

  const currentDefaultCommunity = recordParent?.communities?.entries?.find(
    (community) => community.id === recordParent?.communities?.default
  );
  const brandingRestricted = isBrandingRestricted(
    permissionsPerField,
    currentDefaultCommunity
  );

  const actions = canManage && (
    <>
      {/* {!brandingRestricted && ( */}
        <ManageDefaultBrandingAction
          brandingRestricted={brandingRestricted}
          currentDefaultCommunity={currentDefaultCommunity}
          isCommunityDefault={isCommunityDefault}
          result={result}
          recordCommunityEndpoint={recordCommunityEndpoint}
          updateRecordCallback={updateRecordCallback}
        />
      {/* )} */}
      {/* {!(brandingRestricted && isCommunityDefault) && ( */}
        <RemoveFromCommunityAction
          result={result}
          recordCommunityEndpoint={recordCommunityEndpoint}
          successCallback={successCallback}
        />
      {/* )} */}
    </>
  );
  return (
    <CommunityCompactItem
      actions={actions}
      result={result}
      isCommunityDefault={isCommunityDefault}
      permissionsPerField={permissionsPerField}
    />
  );
};

RecordCommunitiesSearchItem.propTypes = {
  result: PropTypes.object.isRequired,
  recordCommunityEndpoint: PropTypes.string.isRequired,
  successCallback: PropTypes.func.isRequired,
  updateRecordCallback: PropTypes.func.isRequired,
  permissions: PropTypes.object.isRequired,
  recordParent: PropTypes.object.isRequired,
};

export { RecordCommunitiesSearchItem };
