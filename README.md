# invenio-modular-detail-page
An InvenioRDM extension supplying a modular, React-based record detail page

This extension provides a jinja2 template which furnishes a single html entity with all of the necessary record data embedded as data-attributes. This entity is then used (in `index.js`) to render a top-level React.js component DetailContent. This parent component provides three configurable page regions: a central content column and two sidebars (left and right). These regions can then be filled with any React components, in any order, as declared in a set of Invenio config variables.

The extension provides a set of pre-made React components to render various pieces of a typical record detail page: record title, record contributors, file preview, etc. These are made available to the configuration by a mapping of component names to React components declared in `componentsMap.js`. These components can be overridden using InvenioRDM's mechanism for React component overriding. Alternately, one may add new components with different names. In order to be used in the invenio-modular-detail-page configuration, each custom React component must be mapped to a name string in ???

## Installation

## Configuration

To activate this modular detail page in your InvenioRDM instance, in your invenio.cfg file you will need to set the following variable:
```
APP_RDM_RECORD_LANDING_PAGE_TEMPLATE = (
    "invenio_modular_detail_page/detail.html"
)
```
This replaces the default InvenioRDM detail page template with the template provided by this extension.

The configuration of the detail page contents and layout is then set via three config variables in the same file:

```
APP_RDM_DETAIL_SIDEBAR_SECTIONS_RIGHT
APP_RDM_DETAIL_SIDEBAR_SECTIONS_LEFT
APP_RDM_DETAIL_MAIN_SECTIONS
```

