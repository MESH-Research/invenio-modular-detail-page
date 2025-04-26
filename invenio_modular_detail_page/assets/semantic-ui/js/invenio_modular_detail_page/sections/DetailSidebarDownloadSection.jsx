import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button, Icon } from "semantic-ui-react";
import { FileListDropdown } from "../components/FileList";
import Overridable from "react-overridable";

const SidebarDownloadSection = (props) => {
  const {
    defaultPreviewFile,
    downloadFileUrl,
    files,
    fileTabIndex,
    hasFiles,
    isPreview,
    permissions,
    previewFileUrl,
    previewTabIndex,
    record,
    sectionIndex,
    setActiveTab,
    show,
    show_heading,
    totalFileSize,
  } = props;
  return hasFiles ? (
    <Overridable
      id="InvenioModularDetailPage.SidebarDownloadSection.layout"
      {...props}
    >
      <div
        id="download"
        className={`sidebar-container ${show}`}
        aria-label={i18next.t("File download")}
      >
        {show_heading === true && (
          <h2 className="ui medium top attached header mt-0">
            {i18next.t("Download")}
          </h2>
        )}
        <FileListDropdown
          id="record-details-download"
          defaultPreviewFile={defaultPreviewFile}
          downloadFileUrl={downloadFileUrl}
          files={files}
          fileCountToShow={5}
          fileTabIndex={fileTabIndex}
          fullWordButtons={false}
          hasFiles={hasFiles}
          withPreview={false}
          isPreview={isPreview}
          permissions={permissions}
          pointing="right"
          previewFileUrl={previewFileUrl}
          previewTabIndex={previewTabIndex}
          record={record}
          sectionIndex={sectionIndex}
          setActiveTab={setActiveTab}
          showChecksum={false}
          showHeading={show_heading}
          showTableHeader={false}
          showTotalSize={false}
          stackedRows={true}
          totalFileSize={totalFileSize}
        />
      </div>
    </Overridable>
  ) : null;
};

export { SidebarDownloadSection };
