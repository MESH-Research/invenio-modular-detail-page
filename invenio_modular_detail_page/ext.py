# -*- coding: utf-8 -*-
#
# Copyright (C) 2023 MESH Research.
#
# Invenio Modular Detail Page is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file for
# more details.

"""Invenio extension that adds a modular record detail page."""

from flask import Blueprint, current_app
from invenio_i18n import gettext as _

from . import config
from .filters.previewable_extensions import previewable_extensions


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


class _InvenioModularDetailPageState(object):
    """Invenio Modular Detail Page state object."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app


class InvenioModularDetailPage(object):
    """Invenio Modular Detail Page extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)

        app.add_template_filter(previewable_extensions)

        state = _InvenioModularDetailPageState(app)

        app.extensions["invenio-modular-detail-page"] = state

        return state

    def init_config(self, app):
        for k in dir(config):
            if k.startswith("MODULAR_DETAIL_PAGE_"):
                app.config.setdefault(k, getattr(config, k))
