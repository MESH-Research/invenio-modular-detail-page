import React, { useContext, useEffect } from "react";
import { Tab, Menu } from "semantic-ui-react";
import { DetailMainTab } from "./DetailMainTab";
import { addPropsFromChildren, filterPropsToPass } from "../util";
import Overridable from "react-overridable";
import { DetailContext } from "../contexts/DetailContext";
import { componentsMap } from "../componentsMap";

const DetailMainTabs = () => {
  const contextStore = useContext(DetailContext);
  const panes = contextStore.tabbedSections.map(
    ({ section, component_name, subsections, show }, idx) => {
      // Because can't import DetailMainTab in componentsMap (circular)
      const TabComponent =
        component_name !== "DetailMainTab" ? componentsMap[component_name] : DetailMainTab;
      let passedProps = {
        section: section,
        subsections: subsections,
      };
      // `pane` (not `render`) is required when renderActiveOnly={false} so
      // inactive panes stay mounted; keeps Content preview iframe alive across
      // tab switches. Files preview lazy-mounts its iframe separately.
      return {
        menuItem: <Menu.Item key={section} className={show} as="button" content={section} />,
        pane: {
          key: section,
          className: `record-details-tab ${section} ${show}`,
          content: <TabComponent {...passedProps} key={section} />,
        },
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
    <Overridable id="InvenioModularDetailPage.DetailMainTabs.layout">
      <Tab
        id="detail-main-tabs"
        panes={panes}
        menu={{ secondary: true, pointing: true }}
        renderActiveOnly={false}
        activeIndex={contextStore.activeTab}
        onTabChange={(e, { activeIndex }) => contextStore.setActiveTab(activeIndex)}
      />
    </Overridable>
  );
};

export { DetailMainTabs };
