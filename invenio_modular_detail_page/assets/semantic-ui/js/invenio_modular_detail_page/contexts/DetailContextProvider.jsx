import React, { useState } from 'react';
import { DetailContext } from './DetailContext';

export const DetailContextProvider = ({ children, ...rawProps }) => {
  const [activePreviewFile, setActivePreviewFile] = useState(rawProps.defaultPreviewFile);
  const [activeTab, setActiveTab] = useState(0);

  const tabbedSections = rawProps.mainSections.filter(
    ({ component_name }) => component_name === "DetailMainTabs"
  )[0].subsections;
  const record = rawProps.record;
  const canManageFlag =
    rawProps.permissions !== undefined &&
    (rawProps.permissions.can_edit || rawProps.permissions.can_review);

  const extraProps = {
    activePreviewFile: activePreviewFile,
    additionalDescriptions: record.ui.additional_descriptions
      ? record.ui.additional_descriptions
      : null,
    additionalCommunities: record.parent.communities.ids?.length > 1 ? (
      record.parent.communities.entries.filter(e => e.id != record.parent.communities.default))
      : null,
    creators: record.ui.creators,
    contributors: record.ui.contributors,
    canManage: canManageFlag,
    description: record.metadata.description,
    fileTabIndex: tabbedSections.findIndex(
      ({ section }) => section === "Files"
    ),
    hasFiles: record.files.enabled,
    previewTabIndex: tabbedSections.findIndex(({ subsections }) =>
      subsections
        .map(({ component_name }) => component_name)
        .includes("FilePreview")
    ),
    rights: record.ui.rights,
    showRecordManagementMenu:
      canManageFlag &&
      (!rawProps.isPreview || rawProps.isPreviewSubmissionRequest),
    setActivePreviewFile: setActivePreviewFile,
    setActiveTab: setActiveTab,
    tabbedSections: tabbedSections,
    title: record.metadata.title,
  };

  const topLevelProps = { ...rawProps, ...extraProps };

  return (
    <DetailContext.Provider value={topLevelProps}>
      {children}
    </DetailContext.Provider>
  );
};