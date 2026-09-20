import React from "react";
import { FilePreview } from "../components/FilePreview";
import Overridable from "react-overridable";

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
  return (
    <Overridable
      id="InvenioModularDetailPage.FilePreviewWrapper.layout"
      {...props}
    >
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
    </Overridable>
  );
};

export { FilePreviewWrapper };
