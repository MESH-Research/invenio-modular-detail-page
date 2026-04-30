import React, { useState, useEffect } from "react";
import { Message, Icon, Loader } from "semantic-ui-react";
import { FilePreview } from "../FilePreview";
import { useGlobusAccessStatus, GLOBUS_LOADING_STATES } from "./useGlobusAccessStatus";
import { FileTree } from "@templates/custom_fields/RemoteDataCollectionField"; 

const GlobusDetailViewer = (props) => {
  const { endpointId } = props;
  
  const { status, rootFiles, error } = useGlobusAccessStatus(endpointId);

  useEffect(() => {
    if (status === GLOBUS_LOADING_STATES.REDIRECT) {
      const currentURL = window.location.pathname + window.location.search;
      const nextUrl = encodeURIComponent(currentURL);
      window.location.href = `/globus/login/start?next=${nextUrl}`;
    }
  }, [status]);

  let content = null;

  if (status === GLOBUS_LOADING_STATES.LOADING || status === GLOBUS_LOADING_STATES.REDIRECT) {
    content = (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <Loader active inline="centered" content="Authenticating with Globus..." />
      </div>
    );
  } else if (status === GLOBUS_LOADING_STATES.FAILED_LOGIN) {
    content = (
      <Message warning icon style={{ marginBottom: "20px" }}>
        <Icon name="warning sign" />
        <Message.Content>
          <Message.Header>Authentication Failed</Message.Header>
          <p>We could not authenticate your Globus session. Please try logging in again to view these files.</p>
        </Message.Content>
      </Message>
    );
  } else if (status === GLOBUS_LOADING_STATES.NO_PERMISSION) {
    content = (
      <>
        <Message warning icon style={{ marginBottom: "20px" }}>
          <Icon name="lock" />
          <Message.Content>
            <Message.Header>Permission Denied</Message.Header>
            <p>
              {error || "You do not have permission to view the file tree for this Globus collection. Please contact the collection owner to request access."}
            </p>
          </Message.Content>
        </Message>
        {/* Render standard iframe if blocked */}
        <FilePreview {...props} useDynamicPreview={false} />
      </>
    );
  } else if (status === GLOBUS_LOADING_STATES.READY) {
    content = (
      <div className="ui segment globus-details-segment" style={{ marginTop: "15px", padding: "20px" }}>
        <FileTree
          initialFiles={rootFiles}
          endpointId={endpointId}
          fieldPath="globus_detail_tree"
        />
      </div>
    );
  }

  return content;
};

export { GlobusDetailViewer };