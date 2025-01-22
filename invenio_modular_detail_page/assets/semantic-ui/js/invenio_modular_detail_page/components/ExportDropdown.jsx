import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";
import Overridable from "react-overridable";
import { i18next } from "@translations/invenio_app_rdm/i18next";
import PropTypes from "prop-types";

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
    floating = true,
    pointing = "bottom",
  } = props;
  const formats = [];
  for (const [fmt, val] of Object.entries(recordExporters)) {
    const name = val.name || fmt;
    const exportUrl = isPreview
      ? `/records/${record.id}/export/${fmt}?preview=1`
      : `/records/${record.id}/export/${fmt}`;
    formats.push({ id: name, value: exportUrl, text: name });
  }

  const [activeFormat, setActiveFormat] = useState(formats[0].value);

  const handleFormatChange = (e, { value }) => {
    setActiveFormat(value);
    window.location.href = value;
  };

  return (
    <Overridable id="InvenioModularDetailPage.ExportDropdown.layout" {...props}>
      <Dropdown
        as="button"
        id={id}
        className={`${classNames} export-dropdown primary-sidebar`}
        aria-label={i18next.t("Export metadata as...")}
        aria-haspopup="menu"
        basic
        floating={floating}
        pointing={pointing}
        button={asButton}
        fluid={asFluid}
        item={asItem}
        text={text}
        icon={icon}
        options={formats}
        openOnFocus={false}
        closeOnBlur={true}
        selectOnBlur={false}
        selectOnNavigation={false}
        scrolling
        value={activeFormat}
        onChange={handleFormatChange}
      />
    </Overridable>
  );
};


ExportDropdown.propTypes = {
  record: PropTypes.object.isRequired,
  recordExporters: PropTypes.object.isRequired,
  asButton: PropTypes.bool,
  asFluid: PropTypes.bool,
  asItem: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.string,
  text: PropTypes.string,
  classNames: PropTypes.string,
  isPreview: PropTypes.bool,
};

export { ExportDropdown };
