import React from "react";
import Overridable from "react-overridable";

const DetailLeftSidebar = (props) => {
  return (
    <Overridable
      id="InvenioModularDetailPage.DetailLeftSidebar.layout"
      {...props}
    >
      <aside className="sixteen wide tablet five wide computer column left-sidebar"></aside>
    </Overridable>
  );
};

export { DetailLeftSidebar };
