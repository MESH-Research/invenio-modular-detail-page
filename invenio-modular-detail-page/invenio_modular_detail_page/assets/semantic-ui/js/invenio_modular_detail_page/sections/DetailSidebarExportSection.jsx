import React from "react";
import { ExportDropdown } from "../components/ExportDropdown";
import Overridable from "react-overridable";

const SidebarExportSection = (props) => {
  const { isPreview, recordExporters, record, show } = props;
  return (
    <Overridable
      id="InvenioModularDetailPage.SidebarExportSection.layout"
      {...props}
    >
      <div className={`sidebar-container ${show}`} id="record-export">
        {/* <h2 className="ui medium top attached header mt-0">Export</h2>
      <div
        id="export-record"
        className="ui segment bottom attached exports rdm-sidebar"
      > */}
        <ExportDropdown {...{ record, isPreview, recordExporters }} />
        {/* </div> */}
      </div>
    </Overridable>
  );
};

export { SidebarExportSection };
