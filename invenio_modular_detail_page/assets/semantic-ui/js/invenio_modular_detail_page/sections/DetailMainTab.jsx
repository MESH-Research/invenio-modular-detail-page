import React, { useContext } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { componentsMap } from "../componentsMap";
import { DetailContext } from "../contexts/DetailContext";

/**
 * Component for the default content section (tab) of the record detail page.
 *
 * @component
 * @param {} param0
 * @returns
 */
const DetailMainTab = ({ section, subsections }) => {
  const contextStore = useContext(DetailContext);
  return (
    <>
      {!!subsections.length &&
        subsections.map(
          ({ section, component_name, subsections }, idx) => {
            const SubSectionComponent = componentsMap[component_name];
            return (
              <section
                id={`${section}-tab-section`}
                className="rel-mt-0"
                aria-label={i18next.t(section)}
                key={idx}
              >
                <SubSectionComponent
                  {...contextStore}
                  section={section}
                  subsections={subsections}
                />
              </section>
            );
          }
        )}
    </>
  );
};

export { DetailMainTab };
