import React from "react";
import { Dropdown } from "semantic-ui-react";
import Overridable from "react-overridable";

const ExportDropdown = (props) => {
  const {
    asButton = true,
    asFluid = true,
    asItem = false,
    icon = "dropdown",
    id = "export-dropdown",
    text = "Export metadata as...",
    classNames = "",
    record,
    recordExporters,
    sectionIndex,
    isPreview,
  } = props;
  const formats = [];
  for (const [fmt, val] of Object.entries(recordExporters)) {
    const name = val.name || fmt;
    const exportUrl = isPreview
      ? `/records/${record.id}/export/${fmt}?preview=1`
      : `/records/${record.id}/export/${fmt}`;
    formats.push({ name, exportUrl });
  }

  return (
    <Overridable id="InvenioModularDetailPage.ExportDropdown.layout" {...props}>
      <Dropdown
        basic
        button={asButton}
        fluid={asFluid}
        id={id}
        item={asItem}
        text={text}
        icon={icon}
        className={classNames}
        tabIndex={sectionIndex}
        as="button"
        openOnFocus={false}
        closeOnBlur={false}
      >
        <Dropdown.Menu>
          {formats.map((format, index) => (
            <Dropdown.Item
              as="button"
              key={index}
              text={format.name}
              href={format.exportUrl}
              tabIndex={sectionIndex + index + 1}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Overridable>
  );
};

export { ExportDropdown };
