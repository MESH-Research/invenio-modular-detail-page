# -*- coding: utf-8 -*-
#
# Copyright (C) 2023 MESH Research.
#
# Invenio Modular Detail Page is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file for
# more details.

"""Invenio extension that adds a modular record detail page."""

from invenio_i18n import gettext as _

from . import config


class InvenioModularDetailPage(object):
    """Invenio Modular Detail Page extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        # TODO: This is an example of translation string with comment. Please
        # remove it.
        # NOTE: This is a note to a translator.
        _("A translation string")
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        app.extensions["invenio-modular-detail-page"] = self

    def init_config(self, app):
        """Initialize configuration."""
        # Use theme's base template if theme is installed
        if "BASE_TEMPLATE" in app.config:
            app.config.setdefault(
                "INVENIO_MODULAR_DETAIL_PAGE_BASE_TEMPLATE",
                app.config["BASE_TEMPLATE"],
            )
        for k in dir(config):
            if k.startswith("INVENIO_MODULAR_DETAIL_PAGE_"):
                app.config.setdefault(k, getattr(config, k))
