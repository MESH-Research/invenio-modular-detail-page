import React from "react";
import { ExportDropdown } from "../components/ExportDropdown";
import Overridable from "react-overridable";

const SidebarExportSection = (props) => {
  const { isPreview, recordExporters, record, sectionIndex, show } = props;
  return (
    <Overridable
      id="InvenioModularDetailPage.SidebarExportSection.layout"
      {...props}
    >
      <div className={`sidebar-container ${show}`} id="record-export" aria-label="Record export">
        {/* <h2 className="ui medium top attached header mt-0">Export</h2>
      <div
        id="export-record"
        className="ui segment bottom attached exports rdm-sidebar"
      > */}
        <ExportDropdown
          {...{
            record,
            isPreview,
            recordExporters,
            sectionIndex,
            pointing: "right",
          }}
        />
        {/* </div> */}
      </div>
    </Overridable>
  );
};

export { SidebarExportSection };
