"""JS/CSS Webpack bundles for Invenio Modular Detail Page."""

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={
                "invenio-modular-detail-page": "./js/invenio_modular_detail_page/index.js",
                "invenio-modular-detail-page-theme": "./js/invenio_modular_detail_page/theme.js",
            },
            dependencies={},
        ),
    },
)
