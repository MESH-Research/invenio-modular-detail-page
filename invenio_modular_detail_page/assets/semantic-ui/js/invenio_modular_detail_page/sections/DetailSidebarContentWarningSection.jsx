import React from "react";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import Overridable from "react-overridable";
import { ContentWarning } from "../components/ContentWarning";

const SidebarContentWarningSection = (props) => {
  const { record, section } = props;
  return (
    <Overridable
      id="InvenioModularDetailPage.SidebarContentWarningSection.layout"
      {...props}
    >
      {record.custom_fields["kcr:content_warning"] && (
        <div id="content-warning-container" className="sidebar-container">
          <h2
            id="content-warning-header"
            className="ui medium top attached header mt-0"
          >
            {section}
          </h2>
          <div
            id="content-warning-content"
            className="ui segment bottom attached rdm-sidebar"
          >
            <ContentWarning record={record} />
          </div>
        </div>
      )}
    </Overridable>
  );
};

export { SidebarContentWarningSection };
