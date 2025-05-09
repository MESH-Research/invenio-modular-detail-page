from invenio_previewer.proxies import current_previewer


def previewable_extensions(value):
    """Provide the list of previewable extensions in templates.

    The value argument is a dummy argument that is required by jinja to
    use a template filter.

    use like `{{ "" | previewable_extensions }}`
    """
    extensions = list(current_previewer.previewable_extensions)
    return extensions
