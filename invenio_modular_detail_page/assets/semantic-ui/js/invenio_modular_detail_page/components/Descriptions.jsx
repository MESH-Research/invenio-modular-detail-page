import React, { useRef, useState } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button } from "semantic-ui-react";
import { useMeasuredHeightAnimation } from "../util/useMeasuredHeightAnimation";

const CLAMP_CLASS = "description-clamped";

/**
 * Record description block with optional CSS clamp when content sits below.
 *
 * Description HTML is sanitized on the backend (`SanitizedHTML` / bleach) at
 * create/update; this component renders it with `dangerouslySetInnerHTML`.
 *
 * Clamping applies when the Content tab shows a file preview (readable files)
 * or the metadata-only external-content message (`!hasFiles`). Overflow is
 * measured via {@link useMeasuredHeightAnimation} so Show more / Show less
 * only appear when needed. Expand/collapse animates measured height.
 *
 * Additional descriptions are shown only when the full description is open
 * (always, if clamping does not apply; after "Show more" when it does). The
 * toggle also appears when additional descriptions exist even if the main
 * description does not overflow the clamp.
 */
const Descriptions = ({ description, additionalDescriptions, hasFiles, permissions }) => {
  const [open, setOpen] = useState(false);
  const descriptionRef = useRef(null);

  // File preview when files are readable; metadata-only content message otherwise.
  const willClamp = Boolean(hasFiles ? permissions?.can_read_files : true);
  const hasAdditionalDescriptions = Boolean(additionalDescriptions?.length);

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

  // Offer expand when main text overflows *or* there is more content to reveal.
  const showToggle = willClamp && (isOverflowing || hasAdditionalDescriptions);

  return (
    <>
      {description && (
        <>
          <h2 id="description-heading">{i18next.t("Description")}</h2>
          <>
            <div
              ref={descriptionRef}
              className={`rich-input-content${showClampClass ? ` ${CLAMP_CLASS}` : ""}${
                isAnimating ? " description-height-animating" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </>
          {hasAdditionalDescriptions &&
            (open || !willClamp) &&
            additionalDescriptions.map((add_description, idx) => {
              return (
                <section
                  id={`additional-description-${idx}`}
                  key={`additional-description-${idx}`}
                  className="rel-mt-2"
                  aria-label={i18next.t(add_description.type.title_l10n)}
                >
                  <h2>
                    {i18next.t(add_description.type.title_l10n)}
                    <span className="text-muted language ml-10">
                      {add_description.lang ? `(${add_description.lang.title_l10n})` : ""}
                    </span>
                  </h2>
                  <div
                    className="rich-input-content"
                    dangerouslySetInnerHTML={{ __html: add_description.description }}
                  />
                </section>
              );
            })}
          {showToggle && (
            <Button onClick={!open ? expand : collapse} size="tiny" className="show-less mt-10">
              {!open ? i18next.t("Show more") : i18next.t("Show less")}
            </Button>
          )}
        </>
      )}
    </>
  );
};

export { Descriptions };
