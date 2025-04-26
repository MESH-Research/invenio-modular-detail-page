import React, { useContext } from "react";
import Overridable from "react-overridable";
import { DetailContext } from "../contexts/DetailContext";

const DetailLeftSidebar = () => {
  const topLevelProps = useContext(DetailContext);
  return (
    <Overridable
      id="InvenioModularDetailPage.DetailLeftSidebar.layout"
      {...topLevelProps}
    >
      <aside className="sixteen wide tablet five wide computer column left-sidebar"></aside>
    </Overridable>
  );
};

export { DetailLeftSidebar };
