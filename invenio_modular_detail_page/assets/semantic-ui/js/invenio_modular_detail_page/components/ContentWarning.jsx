import React, { useRef, useState } from "react";
import Overridable from "react-overridable";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button, Icon, Message } from "semantic-ui-react";
import { FadeCollapse } from "@js/invenio_modular_deposit_form/helpers/FadeCollapse";
import { useMeasuredHeightAnimation } from "../util/useMeasuredHeightAnimation";

const CLAMP_CLASS = "content-warning-clamped";
/** Match deposit-form action toast exit timing. */
const DISMISS_MS = 400;

/**
 * Sidebar content warning with optional measured-height expand/collapse.
 *
 * Long warnings are CSS line-clamped when collapsed. Show more / Show less
 * only appears when the clamped text overflows (same approach as AIUsageAlert /
 * Subjects / Descriptions). Dismiss uses the same fade-collapse exit as deposit
 * toasts.
 *
 * @param {object} props
 * @param {object} props.record
 * @param {string} [props.section]
 */
const ContentWarning = ({ record, section }) => {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const descriptionRef = useRef(null);

  const contentWarning = record.custom_fields["kcr:content_warning"];
  const willClamp = Boolean(contentWarning && contentWarning.length > 60);

  const { isAnimating, expand, collapse, isOverflowing, showClampClass } =
    useMeasuredHeightAnimation(descriptionRef, {
      open,
      onOpen: () => setOpen(true),
      onClose: () => setOpen(false),
      openMeasure: { removeClass: CLAMP_CLASS },
      closeMeasure: { addClass: CLAMP_CLASS },
      clampEnabled: willClamp,
      contentKey: contentWarning,
    });

  const showToggle = willClamp && isOverflowing;

  if (!contentWarning) {
    return null;
  }

  return (
    <Overridable
      id="InvenioModularDetailPage.ContentWarning.layout"
      {...{ record, section }}
    >
      <FadeCollapse
        visible={visible}
        durationMs={DISMISS_MS}
        className="detail-alert-fade-collapse"
      >
        <Message
          warning
          className="content-warning"
          onDismiss={() => setVisible(false)}
        >
          <Message.Content>
            <Message.Header>
              <Icon name="exclamation triangle" /> {section}
            </Message.Header>
            <p
              ref={descriptionRef}
              className={`content-warning-description${
                showClampClass ? ` ${CLAMP_CLASS}` : ""
              }${isAnimating ? " content-warning-height-animating" : ""}`}
            >
              {contentWarning}
            </p>
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
          </Message.Content>
        </Message>
      </FadeCollapse>
    </Overridable>
  );
};

export { ContentWarning };
