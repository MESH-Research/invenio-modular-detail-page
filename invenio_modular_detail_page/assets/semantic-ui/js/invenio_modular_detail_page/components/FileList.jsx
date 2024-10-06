import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Button, Dropdown, Icon, Menu } from "semantic-ui-react";
import { formatBytes, getFileTypeIconName } from "../util";
import { EmbargoMessage } from "./EmbargoMessage";

/**
 * The file list table row.
 *
 * @param {Object} props
 * @param {Object} props.activePreviewFile - The active preview file.
 * @param {Object} props.file - The file.
 * @param {boolean} props.fullWordButtons - Whether to display the full word buttons.
 * @param {boolean} props.isPreview - Whether the file is a preview.
 * @param {function} props.setActivePreviewFile - The function to set the active preview file.
 * @param {boolean} props.showChecksum - Whether to show the checksum.
 * @param {boolean} props.stackedRows - Whether to stack the rows.
 * @param {boolean} props.withPreview - Whether to display the preview.
 */
const FileListTableRow = ({
  activePreviewFile,
  downloadFileUrl,
  file,
  fullWordButtons,
  isPreview,
  setActivePreviewFile,
  showChecksum,
  stackedRows,
  withPreview,
}) => {
  const file_type = file.key.split(".").pop().toLowerCase();
  const previewUrlFlag = isPreview ? "&preview=1" : "";
  const downloadUrl = `${downloadFileUrl}${previewUrlFlag}`;
  const fileTypeIcon = getFileTypeIconName(file_type);
  const isCurrentPreview = activePreviewFile?.key === file.key;

  const handlePreviewChange = (file) => {
    // this was originally used when files list was on a different tab
    // from the preview box
    // setActiveTab(previewTabIndex);
    setActivePreviewFile(file);
  };

  return (
    <tr className={!!isCurrentPreview ? "active" : ""}>
      <td>
        <Icon name={fileTypeIcon} size="large" />
      </td>
      <td
        className={`${!!stackedRows ? "fourteen" : "nine"} wide ${
          !!showChecksum && "with-checksum"
        }`}
      >
        <span className="mobile only download-button-wrapper">
          {withPreview && (
            <Button
              role="button"
              className="ui compact mini button preview-link"
              target="preview-iframe"
              data-file-key={file.key}
              size="mini"
              onClick={() => handlePreviewChange(file)}
              compact
            >
              <i className="eye icon"></i>
              <span className="tablet computer only">
                {" "}
                {i18next.t("Preview")}
              </span>
            </Button>
          )}
          <Button
            role="button"
            className="ui compact mini button"
            href={downloadUrl.replace("xxxx", file.key)}
          >
            <i className="download icon"></i>
            <span className="tablet computer only">
              {!!fullWordButtons && i18next.t("Download")}
            </span>
          </Button>
        </span>
        <div>
          <a href={downloadUrl.replace("xxxx", file.key)} className="filename">
            {file.key}
          </a>
        </div>
        <small
          className={`ui text-muted ${
            !stackedRows ? "mobile only" : ""
          } filesize`}
        >
          {formatBytes(file.size)}
        </small>{" "}
        {!!showChecksum && (
          <small className="ui text-muted font-tiny checksum">
            {file.checksum}
            <div
              className="ui icon inline-block"
              data-tooltip={i18next.t(
                "This is the file fingerprint (checksum), which can be used to verify the file integrity."
              )}
            >
              <i className="question circle checksum icon"></i>
            </div>
          </small>
        )}
      </td>
      <td
        className={`single line ${!stackedRows ? "tablet computer only" : ""}`}
      >
        {formatBytes(file.size)}
      </td>
      <td className="right aligned collapsing tablet computer only">
        <span>
          {/* FIXME: restrict to previewable file types */}
          {withPreview && (
            <Button
              role="button"
              className="ui compact mini button preview-link"
              target="preview-iframe"
              data-file-key={file.key}
              size="mini"
              onClick={() => handlePreviewChange(file)}
              compact
            >
              <i className="eye icon"></i>
              <span className="tablet computer only">
                {" "}
                {i18next.t("Preview")}
              </span>
            </Button>
          )}
          <Button
            role="button"
            className="ui compact mini button"
            href={downloadUrl.replace("xxxx", file.key)}
            compact
          >
            <i className="download icon"></i>
            <span className="tablet computer only">
              {!!fullWordButtons && i18next.t("Download")}
            </span>
          </Button>
        </span>
      </td>
    </tr>
  );
};

/**
 * The file list table.
 *
 * Intended to be the main child component of FileListBox if the files
 * are accessible.
 *
 * @param {Object} props
 * @param {Object} props.activePreviewFile - The active preview file.
 * @param {string} props.downloadFileUrl - The URL for downloading files.
 * @param {number} props.fileCountToShow - The number of files to show.
 * @param {Object} props.files - The list of files.
 * @param {boolean} props.fullWordButtons - Whether to display the full word buttons.
 * @param {boolean} props.isPreview - Whether the file is a preview.
 * @param {Object} props.permissions - The permissions for the files.
 * @param {string} props.previewFileUrl - The URL for previewing files.
 * @param {Object} props.record - The record.
 * @param {function} props.setActivePreviewFile - The function to set the active preview file.
 * @param {function} props.setActiveTab - The function to set the active tab.
 * @param {boolean} props.showChecksum - Whether to show the checksum.
 * @param {boolean} props.showTableHeader - Whether to show the table header.
 * @param {boolean} props.showTotalSize - Whether to show the total size.
 * @param {boolean} props.stackedRows - Whether to stack the rows.
 * @param {string} props.totalFileSize - The total file size.
 * @param {boolean} props.withPreview - Whether to display the preview.
 */
const FileListTable = ({
  activePreviewFile,
  downloadFileUrl,
  fileCountToShow,
  files,
  // fileTabIndex,
  fullWordButtons,
  isPreview,
  previewFileUrl,
  // previewTabIndex,
  record,
  setActivePreviewFile,
  setActiveTab,
  showChecksum,
  showTableHeader,
  showTotalSize,
  stackedRows,
  totalFileSize,
  withPreview,
}) => {
  const displayFiles =
    fileCountToShow > 0 ? files.slice(0, fileCountToShow) : files;
  return (
    <>
      <table className="ui table files fluid unstackable">
        {!!showTableHeader && (
          <thead>
            <tr>
              <th></th> {/* filetype icon column */}
              <th>{i18next.t("Name")}</th>
              <th className="computer tablet only">{i18next.t("Size")}</th>
              <th className="computer tablet only"></th>
            </tr>
          </thead>
        )}
        <tbody>
          {!!showTotalSize && files.length > 1 && (
            <tr
              className={`title ${record.ui.access_status.id} total-files`}
              tabIndex="0"
            >
              <td></td> {/* filetype icon column */}
              <td>
                {i18next.t(`All ${files.length} files (as zip archive)`)}
                <a
                  role="button"
                  className="ui compact mini button right floated archive-link mobile only"
                  href={record.links.archive}
                >
                  <i className="file archive icon button"></i>
                  <span className="tablet computer only">
                    {" "}
                    {i18next.t("Download all")}
                  </span>
                </a>
              </td>
              <td className="tablet computer only">{totalFileSize} in total</td>
              <td className="tablet computer only">
                <a
                  role="button"
                  className="ui compact mini button right floated archive-link"
                  href={record.links.archive}
                >
                  <i className="file archive icon button"></i>
                  <span className="tablet computer only">
                    {" "}
                    {i18next.t("Download all")}
                  </span>
                </a>
              </td>
            </tr>
          )}
          {displayFiles.map((file) => (
            <FileListTableRow
              activePreviewFile={activePreviewFile}
              downloadFileUrl={downloadFileUrl}
              key={file.key}
              file={file}
              // fileTabIndex={fileTabIndex}
              fullWordButtons={fullWordButtons}
              isPreview={isPreview}
              // previewTabIndex={previewTabIndex}
              previewFileUrl={previewFileUrl}
              setActivePreviewFile={setActivePreviewFile}
              // setActiveTab={setActiveTab}
              showChecksum={showChecksum}
              stackedRows={stackedRows}
              withPreview={withPreview}
            />
          ))}
        </tbody>
      </table>
      {fileCountToShow > 0 && fileCountToShow < files.length && (
        <Button
          role="button"
          floated="right"
          size="mini"
          className="ui compact archive-link"
          aria-label="See more files"
          compact
          onClick={() => setActiveTab(fileTabIndex)}
        >
          <i className="file archive icon button"></i>{" "}
          {i18next.t("See more files")}
        </Button>
      )}
    </>
  );
};

/**
 * The dropdown menu for the sidebar file list.
 *
 * Intended to appear in the sidebar when the record includes multiple
 * files. A child of FileListDropdown, which decides whether to
 * display this based on the number of files in the record.
 *
 * @param {Object} props
 * @param {boolean} props.asButton - Whether to display the button.
 * @param {boolean} props.asLabeled - Whether to display the labeled.
 * @param {boolean} props.asFluid - Whether to display the fluid.
 * @param {boolean} props.asItem - Whether to display the item.
 * @param {string} props.classNames - The class names.
 * @param {string} props.downloadFileUrl - The URL for downloading files.
 * @param {Object} props.files - The list of files.
 * @param {number} props.fileTabIndex - The index of the file tab.
 * @param {string} props.id - The ID.
 * @param {Object} props.record - The record.
 * @param {string} props.previewFileUrl - The URL for previewing files.
 * @param {string} props.previewUrlFlag - The preview URL flag.
 * @param {function} props.setActiveTab - The function to set the active tab.
 * @param {string} props.text - The text.
 * @param {string} props.totalFileSize - The total file size.
 */
const FileListDropdownMenu = ({
  asButton = true,
  asLabeled = true,
  asFluid = true,
  asItem = false,
  classNames = "icon primary right labeled",
  downloadFileUrl,
  files,
  fileCountToShow,
  fileTabIndex,
  icon = "download",
  id,
  previewUrlFlag,
  record,
  sectionIndex,
  setActiveTab,
  text = i18next.t("Download"),
  totalFileSize,
}) => {
  const downloadUrl = `${downloadFileUrl}${previewUrlFlag}`;

  return (
    <Dropdown
      id={id}
      text={text}
      button={asButton}
      icon={icon}
      labeled={asLabeled}
      fluid={asFluid}
      className={classNames}
      item={asItem}
      tabIndex={sectionIndex}
      openOnFocus={false}
      closeOnBlur={false}
    >
      <Dropdown.Menu>
        {/* <Dropdown.Header>Choose a file</Dropdown.Header> */}
        {files.slice(0, fileCountToShow).map(({ key, size, links }, idx) => {
          return (
            <Dropdown.Item
              href={downloadUrl.replace("xxxx", key)}
              as="a"
              tabIndex={idx + sectionIndex + 1}
              key={idx}
            >
              <span className="text">{key}</span>
              <small className="description filesize">
                <Icon name={getFileTypeIconName(key)} />
                {formatBytes(size)}
              </small>
            </Dropdown.Item>
          );
        })}
        {files.length > fileCountToShow && (
          <Dropdown.Item as="a" onClick={() => setActiveTab(fileTabIndex)}>
            and {files.length - fileCountToShow} more files
          </Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item
          href={record.links.archive}
          icon={"archive"}
          text={i18next.t(`Download all`)}
          description={totalFileSize}
          as="a"
          tabIndex={files.length + sectionIndex + 1}
        ></Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          text={i18next.t("File details and previews")}
          icon={"eye"}
          onClick={() => setActiveTab(fileTabIndex)}
          as="a"
          tabIndex={files.length + 1 + sectionIndex + 1}
        ></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

/**
 * DEPRECATED: The dropdown menu for the sidebar file list.
 *
 * Intended to appear in the sidebar when the record includes multiple
 * files. A child of FileListDropdown, which decides whether to
 * display this based on the number of files in the record.
 *
 * @param {Object} props
 * @param {Object} props.defaultPreviewFile - The default preview file.
 * @param {string} props.downloadFileUrl - The URL for downloading files.
 * @param {number} props.fileCountToShow - The number of files to show.
 * @param {Object} props.files - The list of files.
 * @param {number} props.fileTabIndex - The index of the file tab.
 * @param {function} props.handleMobileMenuClick - The function to handle the mobile menu click.
 * @param {boolean} props.hasFiles - Whether there are files.
 * @param {string} props.id - The ID.
 * @param {boolean} props.isPreview - Whether the file is a preview.
 * @param {Object} props.permissions - The permissions for the files.
 * @param {string} props.previewFileUrl - The URL for previewing files.
 * @param {Object} props.record - The record.
 * @param {function} props.setActiveTab - The function to set the active tab.
 * @param {boolean} props.showEmbargoMessage - Whether to show the embargo message.
 * @param {string} props.totalFileSize - The total file size.
 */
const FileListItemDropdown = ({
  defaultPreviewFile,
  fileCountToShow,
  files,
  fileTabIndex,
  handleMobileMenuClick,
  hasFiles,
  id,
  isPreview,
  permissions,
  previewFileUrl,
  record,
  setActiveTab,
  showEmbargoMessage,
  totalFileSize,
}) => {
  const previewUrlFlag = isPreview ? "&preview=1" : "";
  const downloadUrl =
    defaultPreviewFile !== undefined
      ? defaultPreviewFile?.links?.content
      : files?.[0]?.links.content;

  return (
    <>
      {/* access is "restricted" also if record is metadata-only */}
      {!!permissions.can_read_files &&
        hasFiles !== false &&
        files?.length !== undefined &&
        (files?.length < 2 ? (
          <Menu.Item
            id={id}
            as="a"
            href={downloadUrl}
            name="download"
            // active={activeItem === "video play"}
            onClick={handleMobileMenuClick}
          >
            <Icon name="download" />
            {i18next.t("Download")}
          </Menu.Item>
        ) : (
          <FileListDropdownMenu
            {...{
              icon: false,
              files,
              fileTabIndex,
              id,
              record,
              previewFileUrl,
              previewUrlFlag,
              setActiveTab,
              text: (
                <>
                  <Icon name="download" />
                  Download
                </>
              ),
              totalFileSize,
              asButton: false,
              asLabeled: false,
              asFluid: false,
              asItem: true,
              classNames: "pointing",
            }}
          />
        ))}
    </>
  );
};

/**
 * The top-level dropdown menu for the sidebar file list.
 *
 * @param {Object} props
 * @param {Object} props.defaultPreviewFile - The default preview file.
 * @param {string} props.downloadFileUrl - The URL for downloading files.
 * @param {number} props.fileCountToShow - The number of files to show.
 * @param {Object} props.files - The list of files.
 * @param {number} props.fileTabIndex - The index of the file tab.
 * @param {boolean} props.hasFiles - Whether there are files.
 * @param {boolean} props.isPreview - Whether the file is a preview.
 * @param {Object} props.permissions - The permissions for the files.
 * @param {string} props.previewFileUrl - The URL for previewing files.
 * @param {number} props.sectionIndex - The index of the section.
 * @param {function} props.setActiveTab - The function to set the active tab.
 * @param {boolean} props.showEmbargoMessage - Whether to show the embargo message.
 * @param {string} props.totalFileSize - The total file size.
 */
const FileListDropdown = ({
  defaultPreviewFile,
  downloadFileUrl,
  fileCountToShow,
  files,
  fileTabIndex,
  hasFiles,
  isPreview,
  permissions,
  previewFileUrl,
  record,
  sectionIndex,
  setActiveTab,
  showEmbargoMessage = true,
  totalFileSize,
}) => {
  const previewUrlFlag = isPreview ? "&preview=1" : "";
  const downloadUrl = downloadFileUrl + "&preview=1";

  return (
    <>
      {/* access is "restricted" also if record is metadata-only */}
      {(record.access.files === "restricted" || files.enabled === false) &&
        showEmbargoMessage && <EmbargoMessage record={record} />}
      {!!permissions.can_read_files &&
        !!hasFiles &&
        (files?.length < 2 ? (
          <Button
            id="record-details-download"
            primary
            fluid
            as="button"
            href={downloadUrl.replace("xxxx", files?.[0]?.key)}
            content={i18next.t("Download")}
            icon="download"
            labelPosition="right"
            tabIndex={sectionIndex}
          ></Button>
        ) : (
          <FileListDropdownMenu
            {...{
              downloadFileUrl,
              files,
              fileCountToShow,
              fileTabIndex,
              hasFiles,
              previewFileUrl,
              previewUrlFlag,
              record,
              sectionIndex,
              setActiveTab,
              totalFileSize,
            }}
          />
        ))}
    </>
  );
};

/**
 * The file list box.
 *
 * Intended to be the top-level component displaying the file list.
 *
 * @param {Object} props
 * @param {string} props.downloadFileUrl - The URL for downloading files.
 * @param {Object} props.activePreviewFile - The active preview file.
 * @param {number} props.fileCountToShow - The number of files to show.
 * @param {Object} props.files - The list of files.
 * @param {number} props.fileTabIndex - The index of the file tab.
 * @param {boolean} props.fullWordButtons - Whether to display the full word buttons.
 * @param {boolean} props.isPreview - Whether the file is a preview.
 * @param {Object} props.permissions - The permissions for the files.
 * @param {string} props.previewFileUrl - The URL for previewing files.
 * @param {number} props.previewTabIndex - The index of the preview tab.
 * @param {Object} props.record - The record.
 * @param {function} props.setActiveTab - The function to set the active tab.
 * @param {function} props.setActivePreviewFile - The function to set the active preview file.
 * @param {boolean} props.showChecksum - Whether to show the checksum.
 * @param {boolean} props.showEmbargoMessage - Whether to show the embargo message.
 * @param {boolean} props.showTableHeader - Whether to show the table header.
 * @param {boolean} props.showTotalSize - Whether to show the total size.
 * @param {boolean} props.stackedRows - Whether to stack the rows.
 * @param {string} props.totalFileSize - The total file size.
 * @param {boolean} props.withPreview - Whether to display the preview.
 */
const FileListBox = ({
  activePreviewFile,
  downloadFileUrl,
  fileCountToShow = 0,
  files,
  fileTabIndex,
  fullWordButtons = true,
  isPreview,
  permissions,
  previewFileUrl,
  previewTabIndex,
  record,
  setActiveTab,
  setActivePreviewFile,
  showChecksum = true,
  showEmbargoMessage = true,
  showTableHeader = true,
  showTotalSize = true,
  stackedRows = false,
  totalFileSize,
  withPreview,
}) => {
  return (
    <div className={`ui mb-10 ${record.ui.access_status.id}`}>
      <div className="content pt-0">
        {/* Note: "restricted" is the value also for metadata-only records */}
        {(record.access.files === "restricted" || files?.enabled === false || !files) &&
          showEmbargoMessage && <EmbargoMessage record={record} />}
        {!!permissions.can_read_files && files?.enabled !== false && !!files && (
          <FileListTable
            activePreviewFile={activePreviewFile}
            downloadFileUrl={downloadFileUrl}
            fileCountToShow={fileCountToShow}
            files={files}
            fileTabIndex={fileTabIndex}
            fullWordButtons={fullWordButtons}
            isPreview={isPreview}
            permissions={permissions}
            pid={record.id}
            previewFileUrl={previewFileUrl}
            previewTabIndex={previewTabIndex}
            record={record}
            setActivePreviewFile={setActivePreviewFile}
            setActiveTab={setActiveTab}
            showChecksum={showChecksum}
            showTableHeader={showTableHeader}
            showTotalSize={showTotalSize}
            stackedRows={stackedRows}
            totalFileSize={totalFileSize}
            withPreview={withPreview !== undefined ? withPreview : true}
          />
        )}
      </div>
    </div>
  );
};

export {
  FileListBox,
  FileListDropdown,
  FileListItemDropdown,
  FileListTable,
  FileListTableRow,
  EmbargoMessage,
};
