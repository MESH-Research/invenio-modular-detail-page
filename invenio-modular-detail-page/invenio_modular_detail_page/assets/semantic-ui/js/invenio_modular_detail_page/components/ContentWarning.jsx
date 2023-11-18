import React from "react";
import Overridable from "react-overridable";
import { Header, Icon, Message } from "semantic-ui-react";

const ContentWarning = ({ record, section }) => {
  const [visible, setVisible] = React.useState(true);
  const contentWarning = record.custom_fields["kcr:content_warning"];

  return (
    visible &&
    contentWarning && (
      <Overridable
        id="InvenioModularDetailPage.ContentWarning.layout"
        {...{ record, section }}
      >
        <Message
          warning
          className="content-warning"
          onDismiss={() => setVisible(false)}
          header={section}
          content={contentWarning}
        />
      </Overridable>
    )
  );
};

export { ContentWarning };
