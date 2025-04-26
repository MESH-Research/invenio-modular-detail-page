import React from "react";
import ReactDOM from "react-dom";
import { DetailContent } from "./sections/DetailContent";
import { DetailContextProvider } from "./contexts/DetailContextProvider";
import { _isEmpty } from "lodash/isEmpty";

const detailMainDiv = document.getElementById("detail-main-content");

let community = JSON.parse(detailMainDiv.dataset.community);
if ( Object.keys(community).length === 0 ) {
  community = undefined;
}
const recordCommunitySearchConfig = JSON.parse(
  detailMainDiv.dataset.recordCommunitySearchConfig
);
const pendingCommunitiesSearchConfig = JSON.parse(
  detailMainDiv.dataset.pendingCommunitiesSearchConfig
);

ReactDOM.render(
  <DetailContextProvider
    backPage={detailMainDiv.dataset.backPage}
    canManageRecord={JSON.parse(detailMainDiv.dataset.canManageRecord)}
    community={community}
    citationStyles={JSON.parse(detailMainDiv.dataset.citationStyles)}
    citationStyleDefault={detailMainDiv.dataset.citationStyleDefault}
    currentUserId={detailMainDiv.dataset.currentUserId}
    customFieldsUi={JSON.parse(detailMainDiv.dataset.customFieldsUi)}
    doiBadgeUrl={detailMainDiv.dataset.doiBadgeUrl}
    downloadFileUrl={detailMainDiv.dataset.downloadFileUrl}
    externalResources={JSON.parse(detailMainDiv.dataset.externalResources)}
    files={JSON.parse(detailMainDiv.dataset.files)}
    isDraft={JSON.parse(detailMainDiv.dataset.isDraft)}
    isPreview={JSON.parse(detailMainDiv.dataset.isPreview)}
    hasPreviewableFiles={
      JSON.parse(detailMainDiv.dataset.hasPreviewableFiles) === "true"
        ? true
        : false
    }
    iconsRor={detailMainDiv.dataset.iconsRor}
    iconsOrcid={detailMainDiv.dataset.iconsOrcid}
    iconsGnd={detailMainDiv.dataset.iconsGnd}
    iconsKcUsername={detailMainDiv.dataset.iconsKcUsername}
    iconsIsni={detailMainDiv.dataset.iconsIsni}
    identifierSchemes={JSON.parse(detailMainDiv.dataset.identifierSchemes)}
    isPreviewSubmissionRequest={JSON.parse(
      detailMainDiv.dataset.isPreviewSubmissionRequest
    ) === true ? true : false }
    landingUrls={JSON.parse(detailMainDiv.dataset.landingUrls)}
    localizedStats={JSON.parse(detailMainDiv.dataset.localizedStats)}
    mainSections={JSON.parse(detailMainDiv.dataset.mainSections)}
    permissions={JSON.parse(detailMainDiv.dataset.permissions)}
    permissionsPerField={JSON.parse(detailMainDiv.dataset.permissionsPerField)}
    defaultPreviewFile={JSON.parse(detailMainDiv.dataset.defaultPreviewFile) === 'undefined' ? undefined : JSON.parse(detailMainDiv.dataset.defaultPreviewFile)}
    previewableExtensions={JSON.parse(detailMainDiv.dataset.previewableExtensions)}
    previewFileUrl={detailMainDiv.dataset.previewFileUrl === 'undefined' ? undefined : detailMainDiv.dataset.previewFileUrl}
    record={JSON.parse(detailMainDiv.dataset.record)}
    recordCommunityEndpoint={
      detailMainDiv.dataset.recordCommunityEndpoint
    }
    recordCommunitySearchConfig={recordCommunitySearchConfig}
    recordExporters={JSON.parse(detailMainDiv.dataset.recordExporters)}
    recordUserCommunitySearchConfig={JSON.parse(
      detailMainDiv.dataset.recordUserCommunitySearchConfig
    )}
    searchConfig={pendingCommunitiesSearchConfig}
    showDecimalSizes={JSON.parse(detailMainDiv.dataset.showDecimalSizes)}
    showRecordManagementMenu={JSON.parse(
      detailMainDiv.dataset.showRecordManagementMenu
    )}
    sidebarSectionsLeft={JSON.parse(detailMainDiv.dataset.sidebarSectionsLeft)}
    sidebarSectionsRight={JSON.parse(
      detailMainDiv.dataset.sidebarSectionsRight
    )}
    totalFileSize={detailMainDiv.dataset.totalFileSize}
    userCommunitiesMemberships={JSON.parse(
      detailMainDiv.dataset.userCommunitiesMemberships
    )}

    // badge_png
    // badge_svg
    // breadcrumbs
    // current_theme_icons
    // currentMenu={JSON.parse(detailMainDiv.dataset.currentMenu)}
    // currentUser={JSON.parse(detailMainDiv.dataset.currentUser)}
    // currentUserprofile={JSON.parse(detailMainDiv.dataset.currentUserprofile)}
    // g={JSON.parse(detailMainDiv.dataset.g)}
    // jwt
    // jwt_token
    // request={JSON.parse(detailMainDiv.dataset.request)}
    // search_app_communities_config
    // search_app_communities_invitations_config
    // search_app_communities_members_config
    // search_app_communities_records_config
    // search_app_communities_requests_config
  >
    <DetailContent />
  </DetailContextProvider>,
  detailMainDiv
);
