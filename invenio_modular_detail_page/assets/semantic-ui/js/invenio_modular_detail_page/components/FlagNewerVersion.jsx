import React, { useContext } from "react";
import { Message, Icon } from "semantic-ui-react";
import { DetailContext } from "../contexts/DetailContext";

const FlagNewerVersion = ({ show }) => {
  const contextStore = useContext(DetailContext);
  const isPublished = contextStore.isPublished;
  const isLatest = contextStore.isLatest;
  const latestHtml = contextStore.latestHtml;

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
