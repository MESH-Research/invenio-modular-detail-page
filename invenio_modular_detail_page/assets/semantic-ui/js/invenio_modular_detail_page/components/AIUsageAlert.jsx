import React, { useRef, useState } from "react";
import Overridable from "react-overridable";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button, Icon } from "semantic-ui-react";
import { FadeCollapse } from "@js/invenio_modular_deposit_form/helpers/FadeCollapse";
import { useMeasuredHeightAnimation } from "../util/useMeasuredHeightAnimation";

const CLAMP_CLASS = "ai-usage-clamped";
/** Match deposit-form action toast exit timing. */
const DISMISS_MS = 400;

/**
 * Sidebar AI-usage warning with optional measured-height expand/collapse.
 *
 * Long descriptions are CSS line-clamped when collapsed. Show more / Show less
 * only appears when the clamped text overflows (same approach as Subjects /
 * Descriptions). Dismiss uses the same fade-collapse exit as deposit toasts.
 *
 * @param {object} props
 * @param {object} props.record
 * @param {string} [props.section]
 */
const AIUsageAlert = ({ record, section }) => {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const descriptionRef = useRef(null);

  const AIUsage = !record.custom_fields["kcr:ai_usage"]?.ai_used
    ? undefined
    : record.custom_fields["kcr:ai_usage"];
  const description = AIUsage?.ai_description;
  const willClamp = Boolean(description && description.length > 60);

  const { isAnimating, expand, collapse, isOverflowing, showClampClass } =
    useMeasuredHeightAnimation(descriptionRef, {
      open,
      onOpen: () => setOpen(true),
      onClose: () => setOpen(false),
      openMeasure: { removeClass: CLAMP_CLASS },
      closeMeasure: { addClass: CLAMP_CLASS },
      clampEnabled: willClamp,
      contentKey: description,
    });

  const showToggle = willClamp && isOverflowing;

  if (!AIUsage) {
    return null;
  }

  return (
    <Overridable
      id="InvenioModularDetailPage.AIUsageAlert.layout"
      {...{ record, section }}
    >
      <FadeCollapse
        visible={visible}
        durationMs={DISMISS_MS}
        className="detail-alert-fade-collapse"
      >
        <div className="ai-usage-alert ui message warning">
          <i
            aria-hidden="true"
            className="close icon"
            onClick={() => setVisible(false)}
          ></i>
          <div className="content">
            <div className="header">
              <Icon name="microchip" /> {section}
            </div>
            {description && (
              <p
                ref={descriptionRef}
                className={`ai-usage-description${
                  showClampClass ? ` ${CLAMP_CLASS}` : ""
                }${isAnimating ? " ai-usage-height-animating" : ""}`}
              >
                {description}
              </p>
            )}
            {showToggle && (
              <div className="buttons row">
                <Button
                  as="a"
                  onClick={!open ? expand : collapse}
                  basic
                  compact
                  className="warning"
                >
                  {!open ? i18next.t("Show more") : i18next.t("Show less")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </FadeCollapse>
    </Overridable>
  );
};

export { AIUsageAlert };
