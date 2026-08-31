// This file is part of Invenio-Modular-Detail-Page
// Copyright (C) 2026 MESH Research
//
// Invenio-Modular-Detail-Page is free software; you can redistribute it
// and/or modify it under the terms of the MIT License; see LICENSE file
// for more details.

/**
 * Measured-height expand/collapse helpers for overflow-clamped content.
 *
 * Line-clamp / max-height cannot interpolate cleanly, so callers measure start
 * and end pixel heights and tween `style.height`. Respects
 * `prefers-reduced-motion` at the call site via {@link prefersReducedMotion}.
 */

export const DEFAULT_HEIGHT_TRANSITION_MS = 300;

/**
 * Whether the user has requested reduced motion at the OS/browser level.
 *
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Clear inline styles applied by {@link animateElementHeight}.
 *
 * @param {HTMLElement} el
 */
export function clearHeightAnimationStyles(el) {
  el.style.height = "";
  el.style.overflow = "";
  el.style.transition = "";
}

/**
 * Animate an element's height between two measured pixel values.
 *
 * @param {HTMLElement} el
 * @param {number} fromPx
 * @param {number} toPx
 * @param {object} [options]
 * @param {number} [options.durationMs]
 * @param {() => void} [options.onComplete]
 * @returns {() => void} Cancel function (clears listeners/timers/styles; does not call onComplete).
 */
export function animateElementHeight(el, fromPx, toPx, options = {}) {
  const { durationMs = DEFAULT_HEIGHT_TRANSITION_MS, onComplete } = options;

  el.style.overflow = "hidden";
  el.style.transition = "none";
  el.style.height = `${fromPx}px`;
  // Force reflow so the browser commits the start height before transitioning.
  void el.offsetHeight;
  el.style.transition = `height ${durationMs}ms ease`;
  el.style.height = `${toPx}px`;

  let finished = false;
  const finish = (callComplete) => {
    if (finished) {
      return;
    }
    finished = true;
    el.removeEventListener("transitionend", onTransitionEnd);
    window.clearTimeout(fallbackTimer);
    clearHeightAnimationStyles(el);
    if (callComplete && onComplete) {
      onComplete();
    }
  };

  const onTransitionEnd = (event) => {
    if (event.target !== el || event.propertyName !== "height") {
      return;
    }
    finish(true);
  };

  const fallbackTimer = window.setTimeout(() => finish(true), durationMs + 50);
  el.addEventListener("transitionend", onTransitionEnd);

  return () => finish(false);
}

/**
 * Temporarily remove a class, measure `scrollHeight`, then restore the class.
 *
 * Useful for expand: measure full content height while still visually clamped.
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @returns {number}
 */
export function measureScrollHeightWithoutClass(el, className) {
  const hadClass = el.classList.contains(className);
  el.classList.remove(className);
  const height = el.scrollHeight;
  if (hadClass) {
    el.classList.add(className);
  }
  return height;
}

/**
 * Temporarily add a class, measure bounding height, then restore prior class state.
 *
 * Useful for collapse: measure the clamped target height while still expanded.
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @returns {number}
 */
export function measureClientHeightWithClass(el, className) {
  const hadClass = el.classList.contains(className);
  el.classList.add(className);
  const height = el.getBoundingClientRect().height;
  if (!hadClass) {
    el.classList.remove(className);
  }
  return height;
}
