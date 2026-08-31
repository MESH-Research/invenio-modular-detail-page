import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button } from "semantic-ui-react";
import {
  measureClientHeightWithClass,
  measureScrollHeightWithoutClass,
} from "../util/animateElementHeight";
import { useMeasuredHeightAnimation } from "../util/useMeasuredHeightAnimation";

const CLAMP_CLASS = "description-clamped";

/**
 * Record description block with optional CSS clamp when files are present.
 *
 * Description HTML is sanitized on the backend (`SanitizedHTML` / bleach) at
 * create/update; this component renders it with `dangerouslySetInnerHTML`.
 *
 * When clamping is allowed, a `ResizeObserver` measures whether the clamped
 * content overflows so Show more / Show less only appear when needed. The
 * overflow flag stays sticky while expanded (measurement is only valid while
 * the clamp class is applied). Expand/collapse animates measured height.
 */
const Descriptions = ({ description, additionalDescriptions, hasFiles, permissions }) => {
  const [open, setOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);
  const { isAnimating, scheduleHeightAnimation, prefersReducedMotion } =
    useMeasuredHeightAnimation(descriptionRef);

  const willClamp = Boolean(hasFiles && permissions?.can_read_files);
  const showToggle = willClamp && isOverflowing;
  // Defer re-applying clamp until collapse animation finishes so height can tween.
  const showClampClass = willClamp && !open && !isAnimating;

  const expand = useCallback(
    (event) => {
      event.preventDefault();
      const el = descriptionRef.current;
      if (!el || open || isAnimating) {
        return;
      }
      if (prefersReducedMotion()) {
        setOpen(true);
        return;
      }

      const fromPx = el.getBoundingClientRect().height;
      const toPx = measureScrollHeightWithoutClass(el, CLAMP_CLASS);
      scheduleHeightAnimation(fromPx, toPx);
      setOpen(true);
    },
    [open, isAnimating, prefersReducedMotion, scheduleHeightAnimation]
  );

  const collapse = useCallback(() => {
    const el = descriptionRef.current;
    if (!el || !open || isAnimating) {
      return;
    }
    if (prefersReducedMotion()) {
      setOpen(false);
      return;
    }

    const fromPx = el.getBoundingClientRect().height;
    const toPx = measureClientHeightWithClass(el, CLAMP_CLASS);
    scheduleHeightAnimation(fromPx, toPx);
    setOpen(false);
  }, [open, isAnimating, prefersReducedMotion, scheduleHeightAnimation]);

  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (!el || !willClamp) {
      setIsOverflowing(false);
      return undefined;
    }

    const measure = () => {
      // Overflow is only detectable while clamped; keep sticky value when expanded
      // or mid-animation.
      if (open || isAnimating || !el.classList.contains(CLAMP_CLASS)) {
        return;
      }
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [description, willClamp, open, isAnimating]);

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
          {additionalDescriptions &&
            ((open && showToggle) || !willClamp) &&
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
                    <span className="text-muted language">
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
          {willClamp && (
            <Button onClick={!open ? expand : collapse} size="tiny" className="show-less">
              {!open ? i18next.t("Show more") : i18next.t("Show less")}
            </Button>
          )}
        </>
      )}
    </>
  );
};

export { Descriptions };
