import React from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import Overridable from "react-overridable";
import { AIUsageAlert } from "../components/AIUsageAlert";

const SidebarAISection = (props) => {
  const { record, section } = props;
  return (
    <Overridable
      id="InvenioModularDetailPage.SidebarAISection.layout"
      {...props}
    >
      {record.custom_fields["kcr:ai_usage"] && (
        <div id="ai-alert-container" className="sidebar-container">
          <h2
            id="ai-alert-header"
            className="ui medium top attached header mt-0"
          >
            {section}
          </h2>
          <div
            id="ai-alert-content"
            className="ui segment bottom attached rdm-sidebar"
          >
            <AIUsageAlert record={record} />
          </div>
        </div>
      )}
    </Overridable>
  );
};

export { SidebarAISection };
