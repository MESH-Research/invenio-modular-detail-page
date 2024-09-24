import React from "react";
import Overridable from "react-overridable";
import { Button, Icon, Message } from "semantic-ui-react";
import _truncate from "lodash/truncate";

const ContentWarning = ({ record, section }) => {
  const [visible, setVisible] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const contentWarning = record.custom_fields["kcr:content_warning"];
  const hasLongText = contentWarning?.length > 60;
  const shortText =
    ( !hasLongText || !contentWarning )
      ? contentWarning
      : _truncate(contentWarning, {
          length: 60,
          separator: " ",
        });
  const descriptionText = expanded && !!contentWarning ? contentWarning : shortText;

  return !(visible && contentWarning) ? null : (
    <Overridable
      id="InvenioModularDetailPage.ContentWarning.layout"
      {...{ record, section }}
    >
      <Message
        warning
        className="content-warning"
        onDismiss={() => setVisible(false)}
      >
        <Message.Content>
          <Message.Header>
            <Icon name="exclamation triangle" /> {section}
          </Message.Header>
          <p>{descriptionText}</p>
          {hasLongText && (
            <div class="buttons row">
              <Button
                as="a"
                onClick={() => setExpanded(!expanded)}
                basic
                compact
                className="warning"
              >
                {expanded ? "Show less" : "Show more"}
              </Button>
            </div>
          )}
        </Message.Content>
      </Message>
    </Overridable>
  );
};

export { ContentWarning };
