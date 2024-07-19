import React from "react";
import Overridable from "react-overridable";
import { Button, Icon } from "semantic-ui-react";
import _truncate from "lodash/truncate";

const AIUsageAlert = ({ record, section }) => {
  const [visible, setVisible] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const AIUsage = !record.custom_fields["kcr:ai_usage"]?.ai_used ? undefined : record.custom_fields["kcr:ai_usage"];
  const hasLongText = AIUsage?.ai_description?.length > 60;
  const shortText =
    !hasLongText
      ? AIUsage?.ai_description
      : _truncate(AIUsage?.ai_description, {
          length: 60,
          separator: " ",
        });
  const descriptionText = expanded ? AIUsage?.ai_description : shortText;

  return !(visible && !!AIUsage) ? null : (
    <Overridable
      id="InvenioModularDetailPage.AIUsageAlert.layout"
      {...{ record, section }}
    >
      <div class="ai-usage-alert ui message warning">
        <i aria-hidden="true" class="close icon"
          onClick={() => setVisible(false)}
        ></i>
        <div class="content">
          <div class="header"><Icon name="microchip" /> {section}</div>
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
        </div>
      </div>
    </Overridable>

  );
};

export { AIUsageAlert };
