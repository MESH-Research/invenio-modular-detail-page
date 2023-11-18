import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { RecordVersionsList } from "../components/RecordVersionList";
import Overridable from "react-overridable";

const VersionsListSection = (props) => {
  const { isPreview, record, showHeader = false } = props;
  return (
    <Overridable
      id="InvenioModularDetailPage.VersionsListSection.layout"
      {...props}
    >
      <div id="record-versions" className="sidebar-container">
        <h2 className="ui medium top attached header mt-0">
          {i18next.t("Versions")}
        </h2>
        <div className="ui segment rdm-sidebar bottom attached pl-0 pr-0 pt-0">
          <div className="versions">
            <div
              id="recordVersions"
              data-record={record}
              data-preview={isPreview}
            >
              <RecordVersionsList record={record} isPreview={isPreview} />
            </div>
          </div>
        </div>
      </div>
    </Overridable>
  );
};

const VersionsDropdownSection = (props) => {
  const { isPreview, record } = props;
  return (
    <Overridable
      id="InvenioModularDetailPage.VersionsDropdownSection.layout"
      {...props}
    >
      <div className="sidebar-container" id="record-versions">
        <RecordVersionsList
          record={record}
          isPreview={isPreview}
          widgetStyle="dropdown"
        />
      </div>
    </Overridable>
  );
};

export { VersionsListSection, VersionsDropdownSection };
