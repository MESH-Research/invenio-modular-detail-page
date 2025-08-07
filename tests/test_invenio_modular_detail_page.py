# -*- coding: utf-8 -*-
#
# Copyright (C) 2023 MESH Research.
#
# Invenio Modular Detail Page is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file for
# more details.

"""Module tests."""

from flask import Flask
from invenio_modular_detail_page import InvenioModularDetailPage


def test_version():
    """Test version import."""
    from invenio_modular_detail_page import __version__

    assert __version__


def test_init():
    """Test extension initialization."""
    app = Flask("testapp")
    ext = InvenioModularDetailPage(app)
    assert "invenio-modular-detail-page" in app.extensions

    app = Flask("testapp")
    ext = InvenioModularDetailPage()
    assert "invenio-modular-detail-page" not in app.extensions
    ext.init_app(app)
    assert "invenio-modular-detail-page" in app.extensions


def test_view(base_client):
    """Test view."""
    res = base_client.get("/")
    assert res.status_code == 200
    assert "Welcome to Invenio Modular Detail Page" in str(res.data)
