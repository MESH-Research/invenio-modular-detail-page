import React, { useState } from "react";
import { Icon, Menu, Popup } from "semantic-ui-react";
import { CitationModal } from "./DetailSidebarCitationSection";
import { ExportDropdown } from "../components/ExportDropdown";
import { FileListItemDropdown } from "../components/FileList";
import { RecordManagementMenu } from "../components/RecordManagementMenu";
import { ShareModal } from "../components/ShareModal";
import { SidebarSharingSection } from "./DetailSidebarSharingSection";
import Overridable from "react-overridable";

const MobileActionMenu = (props) => {
  const {
    canManage,
    citationStyles,
    citationStyleDefault,
    currentUserId,
    defaultPreviewFile,
    files,
    fileCountToShow,
    fileTabIndex,
    isPreview,
    isDraft,
    isPreviewSubmissionRequest,
    permissions,
    previewFileUrl,
    record,
    recordExporters,
    setActiveTab,
    totalFileSize,
  } = props;
  const [activeItem, setActiveItem] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const handleManageOpen = () => setManageOpen(true);
  const handleManageClose = () => setManageOpen(false);
  const handleShareModalOpen = () => setShareModalOpen(true);
  const handleShareModalClose = () => setShareModalOpen(false);
  const handleMobileMenuClick = (e, { name }) => {
    activeItem === name ? setActiveItem(null) : setActiveItem(name);
  };
  return (
    <Overridable
      id="InvenioModularDetailPage.MobileActionMenu.layout"
      {...props}
    >
      <Menu
        className="mobile tablet only sixteen wide sticky bottom"
        compact
        icon="labeled"
        size="mini"
        inverted
      >
        {canManage && (
          <>
            {/* here to avoid the modal being closed on popup close */}
            <ShareModal
              recid={record.id}
              open={shareModalOpen}
              handleClose={handleShareModalClose}
            />
            <Popup
              content={
                <RecordManagementMenu
                  record={record}
                  permissions={permissions}
                  isDraft={isDraft}
                  isPreviewSubmissionRequest={isPreviewSubmissionRequest}
                  currentUserId={currentUserId}
                  handleShareModalOpen={handleShareModalOpen}
                  handleParentPopupClose={handleManageClose}
                />
              }
              trigger={
                <Menu.Item
                  name="manage"
                  active={activeItem === "manage"}
                  onClick={handleMobileMenuClick}
                >
                  <Icon name="cog" />
                  Manage
                </Menu.Item>
              }
              onClose={() => setActiveItem(null) && handleManageClose()}
              on="click"
              open={manageOpen}
              onOpen={handleManageOpen}
            />
          </>
        )}
        <ExportDropdown
          id="record-details-export"
          {...{
            asItem: true,
            asButton: false,
            asFluid: false,
            icon: null,
            record,
            text: (
              <>
                <Icon name="share" />
                Export
              </>
            ),
            isPreview,
            recordExporters,
            classNames: "pointing",
          }}
        />

        <CitationModal
          record={record}
          trigger={
            <Menu.Item
              name="cite"
              active={activeItem === "cite"}
              onClick={handleMobileMenuClick}
            >
              <Icon name="quote right" />
              Cite
            </Menu.Item>
          }
          citationStyles={citationStyles}
          citationStyleDefault={citationStyleDefault}
          onCloseHandler={() => setActiveItem(null)}
        />

        <Popup
          content={<SidebarSharingSection record={record} />}
          trigger={
            <Menu.Item
              name="share"
              active={activeItem === "share"}
              onClick={handleMobileMenuClick}
            >
              <Icon name="paper plane" />
              Share
            </Menu.Item>
          }
          onClose={() => setActiveItem(null)}
          on="click"
        />

        <FileListItemDropdown
          asItem={true}
          id="record-details-download"
          defaultPreviewFile={defaultPreviewFile}
          files={files}
          fileCountToShow={3}
          fileTabIndex={fileTabIndex}
          isPreview={isPreview}
          permissions={permissions}
          previewFileUrl={previewFileUrl}
          record={record}
          setActiveTab={setActiveTab}
          totalFileSize={totalFileSize}
        />
      </Menu>
    </Overridable>
  );
};

export { MobileActionMenu };
