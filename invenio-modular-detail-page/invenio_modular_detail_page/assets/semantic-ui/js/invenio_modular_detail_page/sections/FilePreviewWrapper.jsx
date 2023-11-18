import React from "react";
import { FilePreview } from "../components/FilePreview";
import Overridable from "react-overridable";

const FilePreviewWrapper = (props) => {
  const {
    activePreviewFile,
    previewFileUrl,
    files,
    hasFiles,
    hasPreviewableFiles,
    isPreview,
    permissions,
    defaultPreviewFile,
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
        previewFileUrl={previewFileUrl}
        files={files}
        hasFiles={hasFiles}
        hasPreviewableFiles={hasPreviewableFiles}
        isPreview={isPreview}
        permissions={permissions}
        defaultPreviewFile={defaultPreviewFile}
        record={record}
        setActivePreviewFile={setActivePreviewFile}
        totalFileSize={totalFileSize}
        useDynamicPreview={false}
      />
    </Overridable>
  );
};

export { FilePreviewWrapper };
