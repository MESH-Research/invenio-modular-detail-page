import React, { useState } from "react";
import Overridable from "react-overridable";
import { componentsMap } from "../componentsMap";
import { DetailRightSidebar } from "./DetailRightSidebar";
import { DetailLeftSidebar } from "./DetailLeftSidebar";
import { MobileActionMenu } from "./DetailMobileActionMenu";
import { DetailMainTabs } from "./DetailMainTabs";
import { FlagNewerVersion } from "../components/FlagNewerVersion";
import { DraftBackButton } from "../components/DraftBackButton";
import { CommunitiesBanner } from "../components/CommunitiesBanner";
import { addPropsFromChildren, filterPropsToPass } from "../util";

// React component for the main content of the detail page.
// This is the main content of the detail page, which includes a central
// column with the main record information, and optional left and right
// sidebars.
//
// The main column is divided into sections, which are either tabs or
// untabbed sections. These are defined in the mainSections prop which
// passes the object defined in the InvenioRDM config variable
// APP_RDM_DETAIL_MAIN_SECTIONS. Sections are displayed as tabs if they
// have a "tab" property defined with a true value.
//
// The left and right sidebars are defined in the sidebarSectionsLeft
// and sidebarSectionsRight props, which pass the objects defined in
// the InvenioRDM config variables APP_RDM_DETAIL_SIDEBAR_SECTIONS_LEFT
// and APP_RDM_DETAIL_SIDEBAR_SECTIONS_RIGHT.
//
// The config for each section includes a string with the name of the
// React component to use for the section, and a list of subsections to
// display in the section. The mapping of strings to components is
// defined in the componentsMap object in ../componentsMap.js.
//
// The props passed to each component are defined in the "props"
// property of the section config.
// Available props are:
// - backPage: URL of the previous (editing) page when previewing a draft
// - citationStyles: list of citation styles
// - citationStyleDefault: default citation style
// - community: community of the record
// - customFieldsUi: custom fields UI
// - doiBadgeUrl: URL of the DOI badge image
// - externalResources: list of external resources
// - files: list of files
// - hasPreviewableFiles: whether the record has previewable files
// - iconsRor: path to the ROR icon
// - iconsGnd: path to the GND icon
// - iconsKcUsername: path to the Knowledge Commons username icon
// - iconsOrcid: path to the ORCID icon
// - isDraft: whether the record is in draft mode
// - isPreview: whether the record is in preview mode
// - isPreviewSubmissionRequest: whether the record is in preview mode
// - landingUrls: list of URLs for landing pages for various third
//     party services
// - mainSections: list of main sections to display
// - permissions: permissions for the record
// - previewFile: object with information about the default preview file
// - previewFileUrl: URL of the endpoint for file previews
// - record: record to display
// - sidebarSectionsLeft: list of left sidebar sections to display
// - sidebarSectionsRight: list of right sidebar sections to display
// - totalFileSize: total size of the files
//
// In addition, the following values are added to `props` in this component
// and are available to all components:
// - additional_descriptions: additional descriptions for the record
// - description: description of the record
// - hasFiles: whether the record has files
// - title: title of the record
// - creators: list of creators
// - contributors: list of contributors
// - canManage: whether the user can manage the record
// - showRecordManagementMenu: whether to show the record management menu
//
const DetailContent = (rawProps) => {
  const [activePreviewFile, setActivePreviewFile] = useState(
    rawProps.defaultPreviewFile
  );
  const [activeTab, setActiveTab] = useState(0);

  const tabbedSections = rawProps.mainSections.filter(
    ({ component_name }) => component_name === "DetailMainTabs"
  )[0].subsections;
  const record = rawProps.record;
  const canManageFlag =
    rawProps.permissions !== undefined &&
    (rawProps.permissions.can_edit || rawProps.permissions.can_review);

  const extraProps = {
    activePreviewFile: activePreviewFile,
    additionalDescriptions: record.ui.additional_descriptions
      ? record.ui.additional_descriptions
      : null,
    additionalCommunities: record.parent.communities.ids?.length > 1 ? (
      record.parent.communities.entries.filter(e => e.id != record.parent.communities.default))
      : null,
    creators: record.ui.creators,
    contributors: record.ui.contributors,
    canManage: canManageFlag,
    description: record.metadata.description,
    fileTabIndex: tabbedSections.findIndex(
      ({ section }) => section === "Files"
    ),
    hasFiles: record.files.enabled,
    previewTabIndex: tabbedSections.findIndex(({ subsections }) =>
      subsections
        .map(({ component_name }) => component_name)
        .includes("FilePreview")
    ),
    rights: record.ui.rights,
    showRecordManagementMenu:
      canManageFlag &&
      (!rawProps.isPreview || rawProps.isPreviewSubmissionRequest),
    setActivePreviewFile: setActivePreviewFile,
    setActiveTab: setActiveTab,
    title: record.metadata.title,
  };
  const topLevelProps = { ...rawProps, ...extraProps };
  console.log("DetailContent", topLevelProps);

  return (
    <Overridable
      id="InvenioModularDetailPage.DetailContent.layout"
      {...rawProps}
    >
      <div className="two column row top-padded">
        <article className="sixteen wide tablet eleven wide computer column main-record-content">
          {/* Mobile version of these components. Computer version is in sidebar */}
          <DraftBackButton
            backPage={`${topLevelProps.backPage}?depositFormPage=page-7`}
            isPreview={topLevelProps.isPreview}
            isDraft={topLevelProps.isDraft}
            canManage={topLevelProps.canManage}
            currentUserId={topLevelProps.currentUserId}
            isPreviewSubmissionRequest={
              topLevelProps.isPreviewSubmissionRequest
            }
            show={"mobile tablet only"}
          />
          <FlagNewerVersion
            isLatest={topLevelProps.record.versions.is_latest}
            isPublished={topLevelProps.record.is_published}
            latestHtml={topLevelProps.record.links.latest_html}
            show={"mobile tablet only"}
          />
          <CommunitiesBanner
            community={topLevelProps.community}
            additionalCommunities={topLevelProps.additionalCommunities}
            isPreviewSubmissionRequest={
              topLevelProps.isPreviewSubmissionRequest
            }
            show={"mobile tablet only"}
          />
          {rawProps.mainSections.map(
            ({ section, component_name, subsections, props, show }) => {
              const SectionComponent =
                component_name === "DetailMainTabs"
                  ? DetailMainTabs
                  : componentsMap[component_name];
              let passedProps;
              if (component_name === "DetailMainTabs") {
                passedProps = topLevelProps;
              } else {
                props = addPropsFromChildren(subsections, props);
                passedProps =
                  !!props && props.length
                    ? filterPropsToPass(topLevelProps, props)
                    : {};
              }
              passedProps = {
                ...passedProps,
                activePreviewFile: activePreviewFile,
                activeTab: activeTab,
                setActivePreviewFile: setActivePreviewFile,
                setActiveTab: setActiveTab,
                section: section,
                show: show,
                tabbedSections: tabbedSections,
                subsections: subsections,
              };
              return <SectionComponent {...passedProps} key={section} />;
            }
          )}
        </article>
        <DetailRightSidebar
          activeTab={activeTab}
          activePreviewFile={activePreviewFile}
          {...topLevelProps}
        />
        <DetailLeftSidebar
          activeTab={activeTab}
          activePreviewFile={activePreviewFile}
          {...topLevelProps}
        />{" "}
        <MobileActionMenu
          canManage={topLevelProps.canManage}
          citationStyleDefault={topLevelProps.citationStyleDefault}
          citationStyles={topLevelProps.citationStyles}
          defaultPreviewFile={topLevelProps.defaultPreviewFile}
          files={topLevelProps.files}
          fileCountToShow={topLevelProps.fileCountToShow}
          fileTabIndex={topLevelProps.fileTabIndex}
          isPreview={topLevelProps.isPreview}
          isDraft={topLevelProps.isDraft}
          isPreviewSubmissionRequest={topLevelProps.isPreviewSubmissionRequest}
          permissions={topLevelProps.permissions}
          previewFileUrl={topLevelProps.previewFileUrl}
          record={topLevelProps.record}
          recordExporters={topLevelProps.recordExporters}
          setActiveTab={topLevelProps.setActiveTab}
          totalFileSize={topLevelProps.totalFileSize}
        />
      </div>
    </Overridable>
  );
};

export { DetailContent, DetailMainTabs, filterPropsToPass };
