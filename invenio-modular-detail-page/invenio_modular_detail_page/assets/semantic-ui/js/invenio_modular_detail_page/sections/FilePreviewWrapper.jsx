import React from "react";
import { FilePreview } from "../components/FilePreview";
import Overridable from "react-overridable";

const FilePreviewWrapper = (props) => {
  const {
    activePreviewFile,
    defaultPreviewFile,
    files,
    hasFiles,
    hasPreviewableFiles,
    isPreview,
    permissions,
    previewableExtensions,
    previewFileUrl,
    record,
    setActivePreviewFile,
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
        hasFiles={hasFiles}
        hasPreviewableFiles={hasPreviewableFiles}
        isPreview={isPreview}
        permissions={permissions}
        previewableExtensions={previewableExtensions}
        previewFileUrl={previewFileUrl}
        record={record}
        setActivePreviewFile={setActivePreviewFile}
        totalFileSize={totalFileSize}
        useDynamicPreview={false}
      />
    </Overridable>
  );
};

export { FilePreviewWrapper };
