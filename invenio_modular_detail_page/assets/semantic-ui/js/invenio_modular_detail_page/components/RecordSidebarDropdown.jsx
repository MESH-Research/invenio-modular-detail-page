import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Dropdown, Grid, Message } from "semantic-ui-react";

/**
 * Shared sidebar flyout dropdown chrome for record management menus.
 *
 * @param {object} props
 * @param {boolean} props.asButton - Render the dropdown trigger as a button.
 * @param {string} props.classNames - Extra classes on the dropdown trigger.
 * @param {string} props.containerId - `#record-management` or `#record-moderation`.
 * @param {string} props.dropdownAriaLabel - Accessible name for the trigger.
 * @param {string} props.dropdownId - DOM id for the dropdown trigger.
 * @param {string} props.icon - Icon name on the trigger button.
 * @param {string} props.pointingDirection - Semantic UI pointing direction.
 * @param {Array<object>} props.options - Dropdown menu options.
 * @param {function} props.onChange - Dropdown `onChange` handler.
 * @param {string} props.sectionAriaLabel - Accessible name for the section.
 * @param {string} props.sectionId - DOM id for the wrapping section.
 * @param {boolean} props.sidebarContainer - Wrap in desktop sidebar container.
 * @param {string} props.text - Trigger button label.
 * @param {string|null} props.error - Optional error message below the menu.
 * @param {React.ReactNode} props.children - Siblings after the dropdown (e.g. modals).
 */
function RecordSidebarDropdown({
  asButton = true,
  children,
  classNames = "",
  containerId,
  dropdownAriaLabel,
  dropdownId,
  error = null,
  icon = "cog",
  onChange,
  options,
  pointingDirection = "right",
  sectionAriaLabel,
  sectionId,
  sidebarContainer = false,
  text,
}) {
  const dropdownRef = useRef(null);

  if (options.length === 0 && !error) {
    return null;
  }

  const menu = (
    <section id={sectionId} aria-label={sectionAriaLabel} className="ui">
      <Dropdown
        ref={dropdownRef}
        as={asButton ? "button" : undefined}
        id={dropdownId}
        className={`button record-management-dropdown fluid secondary sidebar-secondary icon ${classNames}`}
        options={options}
        aria-label={dropdownAriaLabel}
        aria-haspopup="menu"
        basic
        pointing={pointingDirection}
        closeOnChange
        floating
        closeOnBlur={true}
        openOnFocus={false}
        selectOnBlur={false}
        selectOnNavigation={false}
        onChange={onChange}
        icon={icon}
        value={null}
        text={text}
      />
      {error ? (
        <Grid.Row className="record-management">
          <Grid.Column>
            <Message negative>{error}</Message>
          </Grid.Column>
        </Grid.Row>
      ) : null}
      {children}
    </section>
  );

  if (sidebarContainer && containerId) {
    return (
      <div className="sidebar-container computer large-monitor widescreen only" id={containerId}>
        {menu}
      </div>
    );
  }

  return menu;
}

RecordSidebarDropdown.propTypes = {
  asButton: PropTypes.bool,
  children: PropTypes.node,
  classNames: PropTypes.string,
  containerId: PropTypes.string,
  dropdownAriaLabel: PropTypes.string.isRequired,
  dropdownId: PropTypes.string.isRequired,
  error: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  pointingDirection: PropTypes.string,
  sectionAriaLabel: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  sidebarContainer: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export { RecordSidebarDropdown };
