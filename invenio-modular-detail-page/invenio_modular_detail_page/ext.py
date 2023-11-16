# -*- coding: utf-8 -*-
#
# Copyright (C) 2023 MESH Research.
#
# Invenio Modular Detail Page is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file for
# more details.

"""Invenio extension that adds a modular record detail page."""

from invenio_i18n import gettext as _
from flask import Blueprint

from . import config


def create_blueprint(app):
    """Blueprint for the routes and resources provided by Invenio-App-RDM."""
    # routes = app.config.get("APP_RDM_ROUTES")

    blueprint = Blueprint(
        "invenio_modular_detail_page",
        __name__,
        template_folder="templates",
        static_folder="static",
    )

    return blueprint


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
        for k in dir(config):
            if k.startswith("INVENIO_MODULAR_DETAIL_PAGE_"):
                app.config.setdefault(k, getattr(config, k))
