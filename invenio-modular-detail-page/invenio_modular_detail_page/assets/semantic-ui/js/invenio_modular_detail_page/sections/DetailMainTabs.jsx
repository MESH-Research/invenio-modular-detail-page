import React from "react";
import { Tab, Menu } from "semantic-ui-react";
import { DetailMainTab } from "./DetailMainTab";
import { addPropsFromChildren, filterPropsToPass } from "../util";
import Overridable from "react-overridable";

const DetailMainTabs = (topLevelProps) => {
  const panes = topLevelProps.tabbedSections.map(
    ({ section, component_name, subsections, props, show }, idx) => {
      // Because can't import DetailMainTab in componentsMap (circular)
      const TabComponent =
        component_name !== "DetailMainTab"
          ? componentsMap[component_name]
          : DetailMainTab;
      props = addPropsFromChildren(subsections, props);
      let passedProps =
        !!props && props.length ? filterPropsToPass(topLevelProps, props) : {};
      passedProps = {
        ...passedProps,
        section: section,
        subsections: subsections,
      };
      return {
        menuItem: (
          <Menu.Item key={section} className={show} tabIndex={idx}>
            {section}
          </Menu.Item>
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

  return (
    <Overridable
      id="InvenioModularDetailPage.DetailMainTabs.layout"
      {...topLevelProps}
    >
      <Tab
        id="detail-main-tabs"
        panes={panes}
        menu={{ secondary: true, pointing: true }}
        activeIndex={topLevelProps.activeTab}
        onTabChange={(e, { activeIndex }) =>
          topLevelProps.setActiveTab(activeIndex)
        }
      />
    </Overridable>
  );
};

export { DetailMainTabs };
