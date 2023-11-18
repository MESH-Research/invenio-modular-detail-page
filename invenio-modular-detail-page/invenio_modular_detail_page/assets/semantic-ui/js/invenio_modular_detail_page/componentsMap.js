import { Analytics } from "./components/Analytics";
import { Citation } from "./components/Citation";
import { CitationSection } from "./sections/DetailSidebarCitationSection";
import { CommunitiesBanner } from "./components/CommunitiesBanner";
import { ContentWarning } from "./components/ContentWarning";
import { Creatibutors, CreatibutorsShortList } from "./components/Creatibutors";
import { Descriptions } from "./components/Descriptions";
import { DetailMainTabs } from "./sections/DetailMainTabs";
import { FileListBox } from "./components/FileList";
import { FilePreview } from "./components/FilePreview";
import { FilePreviewWrapper } from "./sections/FilePreviewWrapper";
import { MainSubjectsSection } from "./sections/DetailMainSubjectsSection";
import { PublishingDetails } from "./components/PublishingDetails";
import { RecordTitle } from "./components/RecordTitle";
import { SidebarContentWarningSection } from "./sections/DetailSidebarContentWarningSection";
import { SidebarDetailsSection } from "./sections/DetailSidebarDetailsSection";
import { SidebarDownloadSection } from "./sections/DetailSidebarDownloadSection";
import { SidebarExportSection } from "./sections/DetailSidebarExportSection";
import { SidebarRightsSection } from "./sections/DetailSidebarRightsSection";
import { SidebarSharingSection } from "./sections/DetailSidebarSharingSection";
import { SidebarSubjectsSection } from "./sections/DetailSidebarSubjectsSection";
import { VersionsDropdownSection, VersionsListSection } from "./sections/DetailSidebarVersionsSection";


const componentsMap = {
    "Analytics": Analytics,
    "Citation": Citation,
    "CitationSection": CitationSection,
    "CommunitiesBanner": CommunitiesBanner,
    "ContentWarning": ContentWarning,
    "Creatibutors": Creatibutors,
    "CreatibutorsShortList": CreatibutorsShortList,
    "Descriptions": Descriptions,
    "DetailMainTabs": DetailMainTabs,
    "FileListBox": FileListBox,
    "FilePreview": FilePreview,
    "FilePreviewWrapper": FilePreviewWrapper,
    "MainSubjectsSection": MainSubjectsSection,
    "PublishingDetails": PublishingDetails,
    "RecordTitle": RecordTitle,
    "SidebarContentWarningSection": SidebarContentWarningSection,
    "SidebarDetailsSection": SidebarDetailsSection,
    "SidebarDownloadSection": SidebarDownloadSection,
    "SidebarExportSection": SidebarExportSection,
    "SidebarRightsSection": SidebarRightsSection,
    "SidebarSharingSection": SidebarSharingSection,
    "SidebarSubjectsSection": SidebarSubjectsSection,
    "VersionsListSection": VersionsListSection,
    "VersionsDropdownSection": VersionsDropdownSection,
};

export { componentsMap };