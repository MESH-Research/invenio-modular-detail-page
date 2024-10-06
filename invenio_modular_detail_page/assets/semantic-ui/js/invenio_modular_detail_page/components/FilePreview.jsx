import React, { useEffect, useRef, useState } from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Placeholder } from "semantic-ui-react";
import { EmbargoMessage } from "./EmbargoMessage";

const FilePreview = ({
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
  useDynamicPreview = true,
}) => {
  const [loading, setLoading] = useState(true);
  const previewUrlFlag = isPreview ? "&preview=1" : "";
  const fileToShow = (useDynamicPreview && !!activePreviewFile) ? activePreviewFile : (!!defaultPreviewFile ? defaultPreviewFile : files?.[0]);
  const previewUrl = !!previewFileUrl ? `${previewFileUrl.replace("xxxx", fileToShow.key)}?${previewUrlFlag}` : "";
  const fileExtension = !!hasPreviewableFiles ? fileToShow?.key?.split(".").pop() : "no-preview";
  const currentIsPreviewable = previewableExtensions?.includes(fileExtension);


  const iFrameRef = useRef(null);
  useEffect(() => {
    iFrameRef.current?.addEventListener("load", () => setLoading(false));
    return () => {
      iFrameRef.current?.removeEventListener("load", () => setLoading(false));
    };
  }, [iFrameRef.current]);

  return (
    <>
      {record.access.files === "restricted" && (
        <EmbargoMessage record={record} />
      )}
      {!!hasFiles && permissions.can_read_files && (
        <section
          id="record-file-preview"
          aria-label={i18next.t("File preview")}
        >
          {/* {!!hasPreviewableFiles && ( */}
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
          {/* )} */}
        </section>
      )}
    </>
  );
};

export { FilePreview };
