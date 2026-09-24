import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Icon, Message } from "semantic-ui-react";

/**
 * Prominent Content-tab panel for metadata-only records (no files).
 *
 * Shows external content links from `metadata.identifiers` with scheme `url`,
 * or an empty-state message when none are present. Replaces the file preview
 * slot via `FilePreviewWrapper`.
 *
 * @param {object} props
 * @param {object} props.record - Record UI payload from DetailContext.
 */
const MetadataOnlyContentMessage = ({ record }) => {
  const contentUrls = (record?.metadata?.identifiers || [])
    .filter(({ scheme, identifier }) => scheme === "url" && identifier)
    .map(({ identifier }) => identifier);

  return (
    <section
      id="record-metadata-only-content"
      aria-label={i18next.t("External content")}
      className="rel-mt-1"
    >
      <Message info size="large" icon className="metadata-only-content-message">
        <Icon name="external alternate" />
        <Message.Content className="mt-5">
          {contentUrls.length > 0 ? (
            <>
              <Message.Header>{i18next.t("You can find this work's content here:")}</Message.Header>
              <Message.List>
                {contentUrls.map((url) => (
                  <Message.Item key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={i18next.t("Opens in new tab")}
                    >
                      {url}
                    </a>
                  </Message.Item>
                ))}
              </Message.List>
            </>
          ) : (
            <Message.Header>
              {i18next.t("No files or external link to this work are available.")}
            </Message.Header>
          )}
        </Message.Content>
      </Message>
    </section>
  );
};

export { MetadataOnlyContentMessage };
