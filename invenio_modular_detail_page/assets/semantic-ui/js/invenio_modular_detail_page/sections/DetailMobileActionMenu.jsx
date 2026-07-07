import React, { useState, useContext } from "react";
import { Icon, Menu, Popup } from "semantic-ui-react";
import { CitationModal } from "./DetailSidebarCitationSection";
import { ExportDropdown } from "../components/ExportDropdown";
import { FileListItemDropdown } from "../components/FileList";
import { RecordManagementMenu } from "../components/RecordManagementMenu";
import { RecordModerationMenu } from "../components/RecordModerationMenu";
import { ShareModal } from "../components/ShareModal";
import { SidebarSharingSection } from "./DetailSidebarSharingSection";
import Overridable from "react-overridable";
import { DetailContext } from "../contexts/DetailContext";

const MobileActionMenu = () => {
  const topLevelProps = useContext(DetailContext);
  const [activeItem, setActiveItem] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const handleManageOpen = () => setManageOpen(true);
  const handleManageClose = () => {
    setManageOpen(false);
  };
  const handleShareModalOpen = () => {
    setShareModalOpen(true);
    setManageOpen(false);
    setActiveItem(null);
  };
  const handleShareModalClose = () => setShareModalOpen(false);
  const handleMobileMenuClick = (e, { name }) => {
    activeItem === name ? setActiveItem(null) : setActiveItem(name);
  };
  return (
    <Overridable id="InvenioModularDetailPage.MobileActionMenu.layout" {...topLevelProps}>
      <Menu
        className="mobile tablet only sixteen wide sticky bottom"
        compact
        icon="labeled"
        size="mini"
        inverted
      >
        {topLevelProps.canManage && (
          <>
            {/* here to avoid the modal being closed on popup close */}
            {topLevelProps.permissions?.can_manage ? (
              <ShareModal
                open={shareModalOpen}
                handleClose={handleShareModalClose}
                record={topLevelProps.record}
                permissions={topLevelProps.permissions}
                groupsEnabled={topLevelProps.groupsEnabled}
              />
            ) : null}
            <Popup
              content={
                <>
                  {topLevelProps.permissions?.can_moderate ? (
                    <RecordModerationMenu
                      recid={topLevelProps.record.id}
                      recordOwnerID={topLevelProps.recordOwnerId || ""}
                      pointingDirection="bottom"
                      classNames="mb-5"
                    />
                  ) : null}
                  <RecordManagementMenu
                    record={topLevelProps.record}
                    permissions={topLevelProps.permissions}
                    isDraft={topLevelProps.isDraft}
                    isPreviewSubmissionRequest={topLevelProps.isPreviewSubmissionRequest}
                    currentUserId={topLevelProps.currentUserId}
                    handleShareModalOpen={handleShareModalOpen}
                    handleParentPopupClose={handleManageClose}
                    sectionIndex={70}
                    pointingDirection="bottom"
                  />
                </>
              }
              trigger={
                <Menu.Item
                  as="button"
                  name="manage"
                  active={activeItem === "manage"}
                  onClick={handleMobileMenuClick}
                >
                  <Icon name="cog" />
                  Manage
                </Menu.Item>
              }
              open={manageOpen}
              onClose={() => {
                setActiveItem(null);
                handleManageClose();
              }}
              on="click"
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
            pointing: "bottom",
            icon: null,
            record: topLevelProps.record,
            text: (
              <>
                <Icon name="share" />
                Export
              </>
            ),
            isPreview: topLevelProps.isPreview,
            recordExporters: topLevelProps.recordExporters,
            classNames: "pointing",
            sectionIndex: 70,
          }}
        />

        <CitationModal
          record={topLevelProps.record}
          trigger={
            <Menu.Item
              as="button"
              name="cite"
              active={activeItem === "cite"}
              onClick={handleMobileMenuClick}
            >
              <Icon name="quote right" />
              Cite
            </Menu.Item>
          }
          citationStyles={topLevelProps.citationStyles}
          citationStyleDefault={topLevelProps.citationStyleDefault}
          onCloseHandler={() => setActiveItem(null)}
          sectionIndex={80}
        />

        <Popup
          content={<SidebarSharingSection record={topLevelProps.record} />}
          trigger={
            <Menu.Item
              as="button"
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
          sectionIndex={90}
        />

        <FileListItemDropdown
          asItem={true}
          asButton={false}
          id="record-details-download"
          defaultPreviewFile={topLevelProps.defaultPreviewFile}
          files={topLevelProps.files}
          fileCountToShow={3}
          fileTabIndex={topLevelProps.fileTabIndex}
          isPreview={topLevelProps.isPreview}
          permissions={topLevelProps.permissions}
          previewFileUrl={topLevelProps.previewFileUrl}
          record={topLevelProps.record}
          setActiveTab={topLevelProps.setActiveTab}
          totalFileSize={topLevelProps.totalFileSize}
          sectionIndex={100}
          pointing="bottom"
        />
      </Menu>
    </Overridable>
  );
};

export { MobileActionMenu };
