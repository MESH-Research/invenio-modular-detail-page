import React from "react";
import { Message, Icon } from "semantic-ui-react";

const FlagNewerVersion = ({ isPublished, isLatest, latestHtml, show }) => {
  if (isPublished && !isLatest) {
    return (
      <Message warning icon className={show ? show : ""}>
        <Icon name="exclamation circle" size="large" />
        <Message.Content>
          There is a{" "}
          <a href={latestHtml}>
            <b>newer version</b>
          </a>{" "}
          of this work.
        </Message.Content>
      </Message>
    );
  } else {
    return null;
  }
};

export { FlagNewerVersion };
