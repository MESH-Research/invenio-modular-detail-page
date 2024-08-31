# invenio-modular-detail-page
An InvenioRDM extension supplying a modular, React-based record detail page

This extension provides a jinja2 template which furnishes a single html entity with all of the necessary record data embedded as data-attributes. This entity is then used (in `index.js`) to render a top-level React.js component `DetailContent`. This parent component provides three configurable page regions: a central content column and two sidebars (left and right). These regions can then be filled with any React components, in any order, as declared in a set of Invenio config variables. Some of the components allow nesting of other components inside them, and

The extension provides a set of pre-made React components to render various pieces of a typical record detail page: record title, record contributors, file preview, etc. These are made available to the configuration by a mapping of component names to React components declared in `componentsMap.js`. These components can be overridden using InvenioRDM's mechanism for React component overriding. Alternately, one may add new components with different names. In order to be used in the invenio-modular-detail-page configuration, each custom React component must be mapped to a name string in ???

This extension does not use the UI layout declarations in InvenioRDM's custom fields section. The included components, however, can display values from custom fields.

## Installation

## Usage

There are three ways to use this package.

### Lay out built-in components via config variables

First, the default React components can be laid out and arranged using the config variables in your InvenioRDM instance config file. This gives you fine-grained control over where the components are placed and allows you to further control their visibility on different screen sizes.

### Override built-in components

Second, you can go further to customize individual components by overriding them in your instance with your own React code. The method for overriding components in general is laid out in the InvenioRDM documentation [here](https://inveniordm.docs.cern.ch/develop/howtos/override_components/). These overridden components can still be laid out using config variables.

### Add your own new components

Third, you can create your own React components and include them in your configuration ???

## Configuration

### Activation

To activate this modular detail page in your InvenioRDM instance, in your invenio.cfg file you will need to set the following variable:
```
APP_RDM_RECORD_LANDING_PAGE_TEMPLATE = (
    "invenio_modular_detail_page/detail.html"
)
```
This replaces the default InvenioRDM detail page template with the template provided by this extension.

### Layout config variables

By default the page is divided into three regions: a central column of content and two sidebars, one on either side. The order and contents of each region is set via three config variables in the same file:

```
MODULAR_DETAIL_PAGE_SIDEBAR_SECTIONS_RIGHT
MODULAR_DETAIL_PAGE_SIDEBAR_SECTIONS_LEFT
MODULAR_DETAIL_PAGE_MAIN_SECTIONS
```

### Configuration of individual components

Each of these variables is a list of Python dictionaries representing React components. In each region the components will be included in the order they are declared in the corresponding config list, from top to bottom.

Each component dictionary in these lists looks like this:

```
    {
        "section": _("Download"),
        "component_name": "SidebarDownloadSection",
        "props": [
            "defaultPreviewFile",
            "files",
            "fileTabIndex",
            "hasFiles",
            "isPreview",
            "permissions",
            "previewFileUrl",
            "record",
            "setActivePreviewFile",
            "setActiveTab",
            "tabbedSections",
            "totalFileSize",
        ],
        "show": "computer large monitor widescreen only",
        "show_heading": False,
    }
```

- `section` (str, required): provides a (translated) name for the section. This name will appear as the header text if a header is displayed. This title may be any string, although it is recommended that the string be translated.
- `component_name` (str, required): corresponds to the name of the React component to be rendered. This string component name is mapped to a React component in the `componentsMap.js` file. The names of built-in components is provided in the description of built-in components below.
- `props` (list, required): provides a list of the built-in props that will be passed to the React component. This avoids passing around unnecessary values. It also allows you, in overridden components, to change the props that are provided to the component. The values of these props, however, are determined by the view function and `detail.html` template file. The required props for each component are listed in the description of the built-in components below.
- `show` (str, optional): this string allows control over the component's visibility on different sized displays. It is injected into the list of css classes in the rendered component.
- `show_heading` (bool, optional): this flag determines whether a header title will be displayed for the component. Not every component includes the option of a header title, so this will sometimes be ignored.

### Nested components

Some components allow other components to be nested inside them. In these cases, you can add a `subsections` value to the component dictionary. This value is a list of component dictionaries, each of which mirrors the structure of the top-level dictionaries.

In some cases, nested component dictionaries need only a `section` value because their React component and props are hard-coded in the parent component. This is the case, for example, in the SidebarDetailsSection component.

```
    {
        "section": _("Details"),
        "component_name": "SidebarDetailsSection",
        "props": [
            "customFieldsUi",
            "doiBadgeUrl",
            "identifierSchemes",
            "landingUrls",
            "record",
        ],
        "subsections": [
            {"section": "Published in"},
            {"section": "Imprint"},
            {"section": "Publisher"},
            {"section": "Awarding university"},
            {"section": "Conference"},
            {"section": "Publication date"},
            {"section": "Languages"},
            {"section": "Formats"},
            {"section": "Sizes"},
            {"section": "DOI badge"},
        ],
    },
```

## Built-in Components

### Layout components

In theory these components are available to be overridden, but generally this should be done with **extreme caution**. You will likely break the basic configurable framework of the modular page.

#### DetailContent

- override label: `InvenioModularDetailPage.DetailContent.layout`

#### MobileActionMenu

- override label: InvenioModularDetailPage.MobileActionMenu.layout`

#### DetailSidebarRight

- override label: `InvenioModularDetailPage.DetailRightSidebar.layout`

#### DetailSidebarLeft

- override label: `InvenioModularDetailPage.DetailLeftSidebar.layout`

### Configurable layout components

#### DetailMainTab

#### DetailMainTabs

- override label: `InvenioModularDetailPage.DetailMainTabs.layout`

### Analytics

- override id: `InvenioModularDetailPage.Analytics.layout`

### Citation


### CitationSection

- override id: `InvenioModularDetailPage.CitationSection.layout`
- required props: "record", "citationStyles", "citationStyleDefault", "show"
- does not allow nesting

### CommunitiesBanner


### ContentWarning

- override id: `InvenioModularDetailPage.ContentWarning.layout`
- required props: "record"
- does not allow nesting

### Creatibutors


### CreatibutorsShortList


### Descriptions

### ExportDropdown

- override id: `InvenioModularDetailPage.ExportDropdown.layout`
- required props: "record", "recordExporters", "isPreview"
- does not allow nesting

### FileListBox


### FilePreview


### FilePreviewWrapper

- override id: `InvenioModularDetailPage.FilePreviewWrapper.layout`

### MainSubjectsSection

- override id: `InvenioModularDetailPage.MainSubjectsSection.layout`

### PublishingDetails


### RecordTitle

### SidebarContentWarningSection

- override id: `InvenioModularDetailPage.SidebarContentWarningSection.layout`
- required props: "record"
- does not allow nesting

### SidebarDetailsSection

- override id: `InvenioModularDetailPage.SidebarDetailsSection.layout`
- required props: "customFieldsUi", "doiBadgeUrl", "identifierSchemes", "landingUrls", "record", "subsections", "show", "show_heading"
- **allows nesting**

### SidebarDownloadSection

- override id: `InvenioModularDetailPage.SidebarDownloadSection.layout`

### SidebarExportSection

This section provides a dropdown list of export formats. When a user selects an item from the dropdown, the record metadata is serialized appropriately and downloaded.

- override id: `InvenioModularDetailPage.SidebarExportSection.layout`
- required props: "isPreview", "recordExporters", "record"
- does not allow nesting

### SidebarRightsSection

- override id: `InvenioModularDetailPage.SidebarRightsSection.layout`
- required props: "rights"
- does not allow nesting

### SidebarSharingSection

- override id: `InvenioModularDetailPage.SidebarSharingSection.layout`
- required props: "record"
- does not allow nesting

### SidebarSubjectsSection

- override id: `InvenioModularDetailPage.SidebarSubjectsSection.layout`
- required props: "record", "show"
- does not allow nesting

### VersionsListSection

- override id: `InvenioModularDetailPage.VersionsListSection.layout`
- required props: "isPreview", "record"

### VersionsDropdownSection

- override id: `InvenioModularDetailPage.VersionsDropdownSection.layout`
- required props: "isPreview", "record"

## Overriding and Creating New Components

### Variables available to components

- backPage (string): the url for the "back" button displayed when the user is previewing a draft record.
- community (Object):
- citationStyles
- citationStyleDefault
- currentUserId (number): the InvenioRDM id number for the user currently logged in
- customFieldsUi (Object):
- doiBadgeUrl (string): url for fetching the DOI badge
- externalResources
- files (Array | Object)
- isDraft (boolean): a flag indicating whether the record being viewed is a draft
- isPreview (boolean): a flag indicating whether the record being viewed is a preview
- hasPreviewableFiles (boolean): a flag indicating whether the record has any files that can be previewed using the invenio_previewer package
- iconsRor (string): url for the ROR icon
- iconsOrcid (string): url for the ORDIC icon
- iconsGnd (string): url for the GND icon
- iconsKcUsername (string): url for the Knowledge Commons icon
- identifierSchemes
- isPreviewSubmissionRequest (boolean)
- landingUrls
- localizedStats (Object)
- mainSections (Object)
- permissions
- defaultPreviewFile
- previewFileUrl
- record
- recordExporters
- showDecimalSizes
- showRecordManagementMenu
- sidebarSectionsLeft
- sidebarSectionsRight
- totalFileSize


