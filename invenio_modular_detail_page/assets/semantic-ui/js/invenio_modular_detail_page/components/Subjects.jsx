import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { i18next } from "@translations/invenio_modular_detail_page/i18next";
import { Button } from "semantic-ui-react";
import { Keywords } from "./Keywords";
import {
  measureClientHeightWithClass,
  measureScrollHeightWithoutClass,
} from "../util/animateElementHeight";
import { useMeasuredHeightAnimation } from "../util/useMeasuredHeightAnimation";

const CLAMP_CLASS = "subjects-clamped";

/**
 * Subject labels (and optional keywords) for the record detail page.
 *
 * When `collapsible` is true, the block is clamped to ~8rem with a Show more /
 * Show less control that only appears when content overflows. Expand/collapse
 * animates measured height (same approach as Descriptions).
 *
 * @param {object} props
 * @param {string} [props.passedClassNames]
 * @param {Array<{id: string, scheme: string, subject: string}>} props.subjectHeadings
 * @param {string[]} [props.keywords]
 * @param {boolean} [props.showKeywords]
 * @param {boolean} [props.collapsible] When true, clamp tall lists with an animated toggle.
 */
function SubjectHeadings({
  passedClassNames,
  subjectHeadings,
  keywords,
  showKeywords,
  collapsible = false,
}) {
  const [open, setOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const { isAnimating, scheduleHeightAnimation, prefersReducedMotion } =
    useMeasuredHeightAnimation(contentRef);

  const showToggle = collapsible && isOverflowing;
  // Defer re-applying clamp until collapse animation finishes so height can tween.
  const showClampClass = collapsible && !open && !isAnimating;

  const expand = useCallback(
    (event) => {
      event.preventDefault();
      const el = contentRef.current;
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
    const el = contentRef.current;
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
    const el = contentRef.current;
    if (!el || !collapsible) {
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
  }, [subjectHeadings, keywords, showKeywords, collapsible, open, isAnimating]);

  const content = (
    <>
      {subjectHeadings.map(({ id, scheme, subject }) => (
        <ul className="ui horizontal list no-bullets subjects" key={id}>
          <li className="item">
            <a
              href={`/search?q=metadata.subjects.id:"${id}"`}
              className="subject ui label basic secondary"
              title={i18next.t("Search results for ") + subject}
            >
              {subject}
            </a>
          </li>
        </ul>
      ))}
      {!!showKeywords && keywords?.length && keywords[0] ? (
        <>
          <h3 className="ui header tiny mt-10">User-defined Keywords</h3>
          <Keywords
            passedClassNames="ui bottom attached segment rdm-sidebar pr-0 pt-0"
            keywords={keywords}
          />
        </>
      ) : (
        ""
      )}
    </>
  );

  if (!collapsible) {
    return <div className={`record-subjects ui ${passedClassNames}`}>{content}</div>;
  }

  return (
    <div className={`record-subjects ui ${passedClassNames}`}>
      <div
        ref={contentRef}
        className={`subjects-collapsible-content${
          showClampClass ? ` ${CLAMP_CLASS}` : ""
        }${isAnimating ? " subjects-height-animating" : ""}`}
      >
        {content}
      </div>
      {showToggle && (
        <Button onClick={!open ? expand : collapse} size="tiny" className="show-less compact mb-0">
          {!open ? i18next.t("Show more") : i18next.t("Show less")}
        </Button>
      )}
    </div>
  );
}

export { SubjectHeadings };
