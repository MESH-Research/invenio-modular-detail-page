import React from "react";
import PropTypes from "prop-types";
import { CommunityCompactItem } from "@js/kcworks/collections/community/communitiesItems/CommunityCompactItem";
import { RequestActionController } from "@js/invenio_requests";

const PendingCommunityRequestItem = ({
  result,
  successCallback,
  permissionsPerField,
}) => {
  const {
    expanded: { receiver: community },
    links: { self_html: requestLinkSelf },
  } = result;
  const requestLink = requestLinkSelf.replace("/requests", "/me/requests"); //We should use self_html once the following issue is fixed: https://github.com/inveniosoftware/invenio-requests/issues/332

  const actions = (
    <RequestActionController
      request={result}
      actionSuccessCallback={successCallback}
    />
  );

  return (
    <CommunityCompactItem
      result={community}
      actions={actions}
      detailUrl={requestLink}
      permissionsPerField={permissionsPerField}
    />
  );
};

PendingCommunityRequestItem.propTypes = {
  result: PropTypes.object.isRequired,
  successCallback: PropTypes.func.isRequired,
  permissionsPerField: PropTypes.object,
};

export { PendingCommunityRequestItem };
