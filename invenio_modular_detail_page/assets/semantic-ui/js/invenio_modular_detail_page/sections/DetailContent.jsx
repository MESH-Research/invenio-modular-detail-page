import React, { useContext } from "react";
import Overridable from "react-overridable";
import { componentsMap } from "../componentsMap";
import { DetailRightSidebar } from "./DetailRightSidebar";
import { DetailLeftSidebar } from "./DetailLeftSidebar";
import { MobileActionMenu } from "./DetailMobileActionMenu";
import { DetailMainTabs } from "./DetailMainTabs";
import { FlagNewerVersion } from "../components/FlagNewerVersion";
import { DraftBackButton } from "../components/DraftBackButton";
import { CommunitiesBanner } from "../components/CommunitiesBanner";
import { DetailContext } from "../contexts/DetailContext";

// React component for the main content of the detail page.
// This is the main content of the detail page, which includes a central
// column with the main record information, and optional left and right
// sidebars.
//
// The main column is divided into sections, which are either tabs or
// untabbed sections. These are defined in the mainSections prop which
// passes the object defined in the InvenioRDM config variable
// MODULAR_DETAIL_PAGE_MAIN_SECTIONS. Sections are displayed as tabs if they
// have a "tab" property defined with a true value.
//
// The left and right sidebars are defined in the sidebarSectionsLeft
// and sidebarSectionsRight props, which pass the objects defined in
// the InvenioRDM config variables MODULAR_DETAIL_PAGE_SIDEBAR_SECTIONS_LEFT
// and MODULAR_DETAIL_PAGE_SIDEBAR_SECTIONS_RIGHT.
//
// The config for each section includes a string with the name of the
// React component to use for the section, and a list of subsections to
// display in the section. The mapping of strings to components is
// defined in the componentsMap object in ../componentsMap.js.
//
// The following props are derived from the backend jinja template and made
// available to all components via the DetailContext state:
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
// - permissionsPerField: permissions per field for the record
// - previewFile: object with information about the default preview file
// - previewFileUrl: URL of the endpoint for file previews
// - previewableExtensions: list of previewable file extensions
// - record: record to display
// - sidebarSectionsLeft: list of left sidebar sections to display
// - sidebarSectionsRight: list of right sidebar sections to display
// - totalFileSize: total size of the files
//
// In addition, the following values are added to that context state by
// the DetailContextProvider component:
// - additional_descriptions: additional descriptions for the record
// - description: description of the record
// - hasFiles: whether the record has files
// - title: title of the record
// - creators: list of creators
// - contributors: list of contributors
// - canManage: whether the user can manage the record
// - showRecordManagementMenu: whether to show the record management menu
//
const DetailContent = () => {
  const contextStore = useContext(DetailContext);
  console.log("DetailContent contextStore", contextStore);

  return (
    <Overridable
      id="InvenioModularDetailPage.DetailContent.layout"
    >
      <div className="two column row top-padded">
        <article className="sixteen wide tablet eleven wide computer column main-record-content">
          {/* Mobile version of these two components. Computer version is in sidebar */}
          <DraftBackButton show={"mobile tablet only"} />
          <FlagNewerVersion show={"mobile tablet only"} />

          <CommunitiesBanner show={"mobile tablet only"} sectionIndex={0} />
          {contextStore.mainSections.map(
            ({ section, component_name, subsections, show }) => {
              const SectionComponent =
                component_name === "DetailMainTabs"
                  ? DetailMainTabs
                  : componentsMap[component_name];
              let passedProps = {
                section: section,
                show: show,
                subsections: subsections,
              };
              return <SectionComponent {...passedProps} key={section} />;
            }
          )}
        </article>
        <DetailRightSidebar />
        <DetailLeftSidebar />
        <MobileActionMenu />
      </div>
    </Overridable>
  );
};

export { DetailContent, DetailMainTabs };
