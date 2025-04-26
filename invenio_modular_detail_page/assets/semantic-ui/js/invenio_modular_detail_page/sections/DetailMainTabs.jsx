import React, { useContext, useEffect } from "react";
import { Tab, Menu } from "semantic-ui-react";
import { DetailMainTab } from "./DetailMainTab";
import { addPropsFromChildren, filterPropsToPass } from "../util";
import Overridable from "react-overridable";
import { DetailContext } from "../contexts/DetailContext";

const DetailMainTabs = () => {
  const contextStore = useContext(DetailContext);
  const panes = contextStore.tabbedSections.map(
    ({ section, component_name, subsections, show }, idx) => {
      // Because can't import DetailMainTab in componentsMap (circular)
      const TabComponent =
        component_name !== "DetailMainTab"
          ? componentsMap[component_name]
          : DetailMainTab;
      let passedProps = {
        section: section,
        subsections: subsections,
      };
      return {
        menuItem: (
          <Menu.Item key={section} className={show} as="button" content={section} />
        ),
        render: () => (
          <Tab.Pane
            key={section}
            className={`record-details-tab ${section} ${show}`}
          >
            <TabComponent {...passedProps} key={section} />
          </Tab.Pane>
        ),
      };
    }
  );

  useEffect(() => {
    const firstTab = document.querySelector("#detail-main-tabs > .menu > .item.active");
    if (firstTab) {
      firstTab.focus();
    }
  }, []);

  return (
    <Overridable
      id="InvenioModularDetailPage.DetailMainTabs.layout"
    >
      <Tab
        id="detail-main-tabs"
        panes={panes}
        menu={{ secondary: true, pointing: true }}
        activeIndex={contextStore.activeTab}
        onTabChange={(e, { activeIndex }) =>
          contextStore.setActiveTab(activeIndex)
        }
      />
    </Overridable>
  );
};

export { DetailMainTabs };
