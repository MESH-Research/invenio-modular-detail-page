import React, { useEffect, useRef, useState } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Icon, Label, Placeholder } from "semantic-ui-react";
import { EmbargoMessage } from "./EmbargoMessage";
import { AccessRequestPanel } from "./AccessRequestPanel";
import { FileListDropdownMenu } from "./FileList.jsx";
import { getFileTypeIconName } from "../util";

/** Component for previewing selected record files.
 *
 * Used on the files tab as well as for the main content tab preview.
 *
 * @param props
 */
const FilePreview = ({
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
  useDynamicPreview = true,
}) => {
  const [loading, setLoading] = useState(true);
  const previewUrlFlag = isPreview ? "preview=1" : "";
  const fileToShow =
    useDynamicPreview && !!activePreviewFile
      ? activePreviewFile
      : !!defaultPreviewFile
        ? defaultPreviewFile
        : files?.[0];
  // URL-encode filename for path segment - Flask's <path:filename> will decode it back
  const encodedFilename = fileToShow?.key ? encodeURIComponent(fileToShow.key) : "";
  const baseUrl = previewFileUrl ? previewFileUrl.replace("xxxx", encodedFilename) : "";
  // Only append preview flag if it exists, using & if URL already has query params
  const previewUrl = baseUrl
    ? previewUrlFlag
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${previewUrlFlag}`
      : baseUrl
    : "";
  const fileExtension = !!hasPreviewableFiles
    ? fileToShow?.key?.split(".").pop()?.toLowerCase()
    : "no-preview";
  const currentIsPreviewable = previewableExtensions?.includes(fileExtension);

  const iFrameRef = useRef(null);
  useEffect(() => {
    setLoading(true);
    const iframe = iFrameRef.current;
    if (!iframe) {
      return;
    }
    const onLoad = () => setLoading(false);
    iframe.addEventListener("load", onLoad);
    return () => {
      iframe.removeEventListener("load", onLoad);
    };
  }, [previewUrl]);

  const handleMenuItemClick = (e, { value }) => {
    e.preventDefault();
    const previewFile = files.find((f) => f.key === value);
    if (previewFile) {
      setActivePreviewFile(previewFile);
    }
  };

  const renderPreviewItemContent = ({ key }) => {
    const extension = key?.split(".").pop()?.toLowerCase();
    const isPreviewable = previewableExtensions?.includes(extension);

    return (
      <>
        {!isPreviewable && (
          <Label size="mini" basic className="right floated">
            {i18next.t("No preview")}
          </Label>
        )}
        <Icon name={getFileTypeIconName(key)} />
        <span className="breakable-text">{key}</span>
      </>
    );
  };

  return (
    <>
      {!permissions?.can_read_files && hasFiles ? (
        record?.access_state?.is_embargoed ? (
          <AccessRequestPanel />
        ) : (
          <EmbargoMessage record={record}>
            <AccessRequestPanel />
          </EmbargoMessage>
        )
      ) : null}
      {!!hasFiles && permissions.can_read_files && (
        <section id="record-file-preview" aria-label={i18next.t("File preview")}>
          {!!hasPreviewableFiles && files.length > 1 && (
            <FileListDropdownMenu
              icon="dropdown"
              files={files}
              fileTabIndex={fileTabIndex}
              handleItemClick={handleMenuItemClick}
              id="record-file-preview-menu"
              record={record}
              previewUrlFlag={previewUrlFlag}
              renderItemContent={renderPreviewItemContent}
              setActiveTab={setActiveTab}
              downloadFileUrl={null}
              text="Select a file to view"
              totalFileSize={totalFileSize}
              asButton={true}
              asLabeled={false}
              asFluid={true}
              asItem={false}
              pointing="top"
              includeArchiveItem={false}
              includeDetailsDivider={true}
              classnames="top attached basic small"
            />
          )}
          <>
            {!!loading && (
              <>
                <div className="placeholder-header-bar" />
                <Placeholder fluid>
                  {[...Array(8).keys()].map((e) => (
                    <Placeholder.Paragraph key={e}>
                      {[...Array(8).keys()].map((e) => (
                        <Placeholder.Line key={e} />
                      ))}
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  ))}
                </Placeholder>
              </>
            )}
            <iframe
              title={i18next.t("Preview")}
              className={`preview-iframe ${fileExtension} ${!currentIsPreviewable ? "no-preview" : ""} ${
                loading ? "hidden" : ""
              }`}
              id={"preview-iframe"}
              ref={iFrameRef}
              name={record.id}
              src={previewUrl}
              width="100%"
              // height="800"
            ></iframe>
          </>
        </section>
      )}
    </>
  );
};

export { FilePreview };
