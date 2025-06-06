// This file is part of Knowledge Commons Repository
// Copyright (C) 2023 MESH Research
//
// It is modified from files provided in InvenioRDM (Invenio-App-RDM)
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Graz University of Technology.
// Copyright (C) 2021 TU Wien
//
// Knowledge Commons Repository and InvenioRDM are both free software;
// you can redistribute them and/or modify them under the terms of the MIT
// License; see LICENSE file for more details.

import React, { useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Icon, Message } from "semantic-ui-react";
import Overridable from "react-overridable";
import { componentsMap } from "../componentsMap";
import { filterPropsToPass } from "../util";
import {
  RecordManagementMenu,
} from "../components/RecordManagementMenu";
import { ShareModal } from "../components/ShareModal";
import { DraftBackButton } from "../components/DraftBackButton";
import { FlagNewerVersion } from "../components/FlagNewerVersion";
import { DetailContext } from "../contexts/DetailContext";

/** Component for the right sidebar of the detail page.
 *
 * @param {object} props
 *
 * Expects document context with the following properties:
 * - sidebarSections: list of sidebar sections to display
 * - record: record to display
 * - citationStyles: list of citation styles
 * - citationStyleDefault: default citation style
 * - doiBadgeUrl: URL of the DOI badge image
 * - isPreview: whether the record is in preview mode
 * - community: community of the record
 *
 */
const DetailRightSidebar = () => {
  const topLevelProps = useContext(DetailContext);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const handleShareModalClose = () => setShareModalOpen(false);
  const handleShareModalOpen = () => setShareModalOpen(true);
  let activeSidebarSections = topLevelProps.sidebarSectionsRight.filter(
    ({ component_name }) => {
      return (
        component_name !== undefined &&
        componentsMap[component_name] !== undefined
      );
    }
  );
  return (
    <Overridable
      id="InvenioModularDetailPage.DetailRightSidebar.layout"
      {...{
        ...topLevelProps,
        handleShareModalOpen,
        handleShareModalClose,
        shareModalOpen,
        activeSidebarSections,
      }}
    >
      <aside className="sixteen wide tablet five wide computer column right-sidebar">
        <DraftBackButton
          backPage={`${topLevelProps.backPage}?depositFormPage=page-7`}
          isPreview={topLevelProps.isPreview}
          isDraft={topLevelProps.isDraft}
          canManage={topLevelProps.canManage}
          isPreviewSubmissionRequest={topLevelProps.isPreviewSubmissionRequest}
          show={"computer large-monitor widescreen only"}
        />
        <FlagNewerVersion
          isLatest={topLevelProps.record.versions.is_latest}
          isPublished={topLevelProps.record.is_published}
          latestHtml={topLevelProps.record.links.latest_html}
          show={"computer large-monitor widescreen only"}
        />
        {topLevelProps.showRecordManagementMenu ? (
          <div
            className={`sidebar-container computer large-monitor widescreen only`}
            id="record-management"
          >
            <RecordManagementMenu
              record={topLevelProps.record}
              permissions={topLevelProps.permissions}
              isDraft={topLevelProps.isDraft}
              isPreviewSubmissionRequest={
                topLevelProps.isPreviewSubmissionRequest
              }
              currentUserId={topLevelProps.currentUserId}
              handleShareModalOpen={handleShareModalOpen}
            />
            {/* here to avoid the modal being closed on popup close */}
            <ShareModal
              recid={topLevelProps.record.id}
              open={shareModalOpen}
              handleClose={handleShareModalClose}
            />
          </div>
        ) : null}
        {activeSidebarSections.map(
          (
            { section, component_name, props, subsections, show_heading, show },
            idx
          ) => {
            const SidebarSectionComponent = componentsMap[component_name];
            return (
              <SidebarSectionComponent
                {...topLevelProps}
                section={section}
                subsections={subsections}
                key={section}
                show_heading={show_heading}
                show={show}
                sectionIndex={
                  60 + idx + idx + idx + idx + idx + idx + idx + idx + idx + idx
                }
              />
            );
          }
        )}
      </aside>
    </Overridable>
  );
};

export { DetailRightSidebar };
