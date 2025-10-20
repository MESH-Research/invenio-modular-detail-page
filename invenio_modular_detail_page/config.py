#
# Copyright (C) 2023 MESH Research.
#
# Invenio Modular Detail Page is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file for
# more details.

"""Invenio extension that adds a modular record detail page."""

from invenio_i18n import lazy_gettext as _

# top-level objects are sections in sidebar
# available sections defined in DetailRightSidebar.jsx:
# "details", "manage_menu", "downloads", "sidebar_details", "versions", "citation", "communities", "keywords_subjects", "export", "social_share"
MODULAR_DETAIL_PAGE_SIDEBAR_SECTIONS_RIGHT = [
    {"section": _("Manage")},
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
        "show": "computer large-monitor widescreen only",
    },
    {
        "section": _("Communities"),
        "component_name": "CommunitiesBanner",
        "props": ["community", "isPreviewSubmissionRequest"],
        "show": "computer large-monitor widescreen only",
    },
    {
        "section": _("Versions"),
        "component_name": "VersionsDropdownSection",
        "props": ["isPreview", "record"],
        "show_heading": False,
    },
    {
        "section": _("Content Warning"),
        "component_name": "ContentWarning",
        "props": ["record"],
    },
    {
        "section": _("Keywords & Subjects"),
        "component_name": "DetailSidebarSubjectsSection",
        "props": ["record"],
        "show": "computer large-monitor widescreen only",
    },
    {
        "section": _("Cite this"),
        "component_name": "CitationSection",
        "props": ["record", "citationStyles", "citationStyleDefault"],
        "show": "computer large-monitor widescreen only",
    },
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
            # {"section": "Resource type"},
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
        "show_heading": False,
        "show": "computer large-monitor widescreen only",
    },
    {
        "section": _("Export"),
        "component_name": "SidebarExportSection",
        "props": ["isPreview", "recordExporters", "record"],
        "show": "computer large-monitor widescreen only",
    },
    {
        "section": _("Share"),
        "component_name": "SidebarSharingSection",
        "props": ["record"],
        "show": "computer large-monitor widescreen only",
    },
]
MODULAR_DETAIL_PAGE_SIDEBAR_SECTIONS_LEFT = []

# top-level objects are tabs in main detail page column
# available subsections defined in DetailMainTab.jsx:
# "descriptions", "preview"
MODULAR_DETAIL_PAGE_MAIN_SECTIONS = [
    {
        "section": _("Title"),
        "component_name": "RecordTitle",
        "props": ["title"],
    },
    {
        "section": _("Contributors"),
        "component_name": "CreatibutorsShortList",
        "props": [
            "creators",
            "contributors",
            "iconsRor",
            "iconsOrcid",
            "iconsGnd",
            "iconsKcUsername",
            "landingUrls",
        ],
    },
    {
        "section": "Tabs",
        "component_name": "DetailMainTabs",
        "subsections": [
            {
                "section": _("Content"),
                "component_name": "DetailMainTab",
                "subsections": [
                    {
                        "section": _("Descriptions"),
                        "component_name": "Descriptions",
                        "props": [
                            "description",
                            "additionalDescriptions",
                            "hasFiles",
                            "permissions",
                        ],
                    },
                    {
                        "section": _("Preview"),
                        "component_name": "FilePreviewWrapper",
                        "props": [
                            "activePreviewFile",
                            "defaultPreviewFile",
                            "files",
                            "isPreview",
                            "hasFiles",
                            "hasPreviewableFiles",
                            "permissions",
                            "previewFile",
                            "previewFileUrl",
                            "record",
                            "setActivePreviewFile",
                            "totalFileSize",
                        ],
                    },
                ],
                "tab": True,
                "props": [],
            },
            {
                "section": _("Details"),
                "component_name": "DetailMainTab",
                "subsections": [
                    {
                        "section": _("Publication"),
                        "component_name": "PublishingDetails",
                        "props": [
                            "customFieldsUi",
                            "doiBadgeUrl",
                            "hasFiles",
                            "iconsKcUsername",
                            "iconsGnd",
                            "iconsOrcid",
                            "iconsRor",
                            "identifierSchemes",
                            "landingUrls",
                            "localizedStats",
                            "record",
                            "showDecimalSizes",
                        ],
                        "subsections": [
                            {
                                "section": _("Contributors"),
                                "subsections": [
                                    {"section": "Contributors"},
                                ],
                                "show": "mobile only",
                            },
                            {
                                "section": _("Publication"),
                                "subsections": [
                                    {"section": "URLs"},
                                    {"section": "Published in"},
                                    {"section": "Imprint"},
                                    {"section": "Publisher"},
                                    {"section": "Awarding university"},
                                    {"section": "Conference"},
                                    {"section": "Languages"},
                                    {"section": "Publication date"},
                                    {"section": "Additional dates"},
                                    {"section": "Formats"},
                                    {"section": "Sizes"},
                                ],
                            },
                            {
                                "section": _("Additional titles"),
                                "subsections": [
                                    {"section": "Additional titles"},
                                ],
                            },
                            {
                                "section": _("Funding"),
                                "subsections": [{"section": "Funding"}],
                            },
                            {
                                "section": _("Identifiers"),
                                "subsections": [
                                    {"section": "DOI"},
                                    {"section": "Alternate identifiers"},
                                ],
                            },
                            {
                                "section": _("Related"),
                                "subsections": [
                                    {"section": "Related identifiers"},
                                ],
                            },
                            {
                                "section": _("References"),
                                "subsections": [
                                    {"section": "References"},
                                ],
                            },
                            {
                                "section": _("AI Usage"),
                                "subsections": [
                                    {
                                        "section": "kcr:ai_usage",
                                        "subsections": [
                                            {"section": "ai_used"},
                                            {"section": "ai_description"},
                                        ],
                                    }
                                ],
                            },
                            {
                                "section": _("Analytics"),
                                "subsections": [
                                    {
                                        "section": "Analytics",
                                    }
                                ],
                                "show": "mobile only",
                            },
                        ],
                    }
                ],
                "tab": True,
                "props": [],
            },
            {
                "section": _("Contributors"),
                "component_name": "DetailMainTab",
                "subsections": [
                    {
                        "section": "Contributors",
                        "component_name": "Creatibutors",
                        "subsections": [],
                        "props": [
                            "creators",
                            "contributors",
                            "iconsRor",
                            "iconsOrcid",
                            "iconsGnd",
                            "iconsKcUsername",
                            "landingUrls",
                        ],
                    }
                ],
                "tab": True,
                "props": [],
                "show": "tablet computer only",
            },
            {
                "section": _("Analytics"),
                "component_name": "DetailMainTab",
                "subsections": [
                    {
                        "section": "Analytics",
                        "component_name": "Analytics",
                        "props": [
                            "hasFiles",
                            "localizedStats",
                            "showDecimalSizes",
                            "record",
                        ],
                    }
                ],
                "tab": True,
                "props": [],
                "show": "tablet computer only",
            },
            {
                "section": _("Subjects"),
                "component_name": "DetailMainTab",
                "subsections": [
                    {
                        "component_name": "DetailMainSubjectsSection",
                        "props": ["record"],
                    }
                ],
                "tab": True,
                "props": [],
                "show": "mobile tablet only",
            },
            {
                "section": _("Files"),
                "component_name": "DetailMainTab",
                "subsections": [
                    {
                        "section": "FilesPreview",
                        "component_name": "FilePreview",
                        "props": [
                            "activePreviewFile",
                            "files",
                            "isPreview",
                            "hasFiles",
                            "hasPreviewableFiles",
                            "permissions",
                            "previewFile",
                            "previewFileUrl",
                            "record",
                            "setActivePreviewFile",
                            "totalFileSize",
                        ],
                    },
                    {
                        "section": "FilesBox",
                        "component_name": "FileListBox",
                        "props": [
                            "files",
                            "isPreview",
                            "hasFiles",
                            "permissions",
                            "previewFile",
                            "previewFileUrl",
                            "previewTabIndex",
                            "record",
                            "setActivePreviewFile",
                            "setActiveTab",
                            "showDecimalSizes",
                            "totalFileSize",
                        ],
                    },
                ],
                "tab": True,
                "props": [],
            },
        ],
    },
]
