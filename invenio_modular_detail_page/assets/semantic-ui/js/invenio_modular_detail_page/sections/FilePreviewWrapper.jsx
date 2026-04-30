import React from "react";
import Overridable from "react-overridable";
import { FilePreview } from "../components/FilePreview";
import { GlobusDetailViewer } from "../components/GlobusDetailViewer/GlobusDetailViewer";
import { MetadataOnlyContentMessage } from "../components/MetadataOnlyContentMessage";

/**
 * Content-tab preview slot: file iframe when files are enabled, otherwise a
 * prominent message with external content URL(s) for metadata-only records.
 */
const FilePreviewWrapper = (props) => {
  const {
    activePreviewFile,
    defaultPreviewFile,
    files,
    fileTabIndex,
    hasFiles,
    hasPreviewableFiles,
    isPreview,
    permissions,
    previewableExtensions,
    previewFileUrl,
    record,
    setActivePreviewFile,
    setActiveTab,
    totalFileSize,
  } = props;

  const globusEndpointId = record?.custom_fields?.["kcr:remote_data_collection"];

  return (
    <Overridable id="InvenioModularDetailPage.FilePreviewWrapper.layout" {...props}>
      {globusEndpointId ? (
        <GlobusDetailViewer endpointId={globusEndpointId} {...props} />
      ) : hasFiles ? (
        <FilePreview
          activePreviewFile={activePreviewFile}
          defaultPreviewFile={defaultPreviewFile}
          files={files}
          fileTabIndex={fileTabIndex}
          hasFiles={hasFiles}
          hasPreviewableFiles={hasPreviewableFiles}
          isPreview={isPreview}
          permissions={permissions}
          previewableExtensions={previewableExtensions}
          previewFileUrl={previewFileUrl}
          record={record}
          setActivePreviewFile={setActivePreviewFile}
          setActiveTab={setActiveTab}
          totalFileSize={totalFileSize}
          useDynamicPreview={true}
        />
      ) : (
        <MetadataOnlyContentMessage record={record} />
      )}
    </Overridable>
  );
};

export { FilePreviewWrapper };
