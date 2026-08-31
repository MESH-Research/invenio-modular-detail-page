// This file is part of Invenio-Modular-Detail-Page
// Copyright (C) 2026 MESH Research
//
// Invenio-Modular-Detail-Page is free software; you can redistribute it
// and/or modify it under the terms of the MIT License; see LICENSE file
// for more details.

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  animateElementHeight,
  DEFAULT_HEIGHT_TRANSITION_MS,
  prefersReducedMotion,
} from "./animateElementHeight";

/**
 * React wrapper around {@link animateElementHeight}: schedule a measured-height
 * tween to run in `useLayoutEffect` after the next render (so className / open
 * state updates apply before paint), and track `isAnimating`.
 *
 * @param {React.RefObject<HTMLElement | null>} elementRef
 * @param {object} [options]
 * @param {number} [options.durationMs]
 * @returns {{
 *   isAnimating: boolean,
 *   scheduleHeightAnimation: (fromPx: number, toPx: number) => void,
 *   prefersReducedMotion: () => boolean,
 * }}
 */
export function useMeasuredHeightAnimation(elementRef, options = {}) {
  const { durationMs = DEFAULT_HEIGHT_TRANSITION_MS } = options;
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationRequestId, setAnimationRequestId] = useState(0);
  /** @type {React.MutableRefObject<{ fromPx: number, toPx: number } | null>} */
  const pendingRef = useRef(null);
  const cancelRef = useRef(null);

  const cancelInFlight = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  const scheduleHeightAnimation = useCallback((fromPx, toPx) => {
    pendingRef.current = { fromPx, toPx };
    setIsAnimating(true);
    setAnimationRequestId((id) => id + 1);
  }, []);

  useLayoutEffect(() => {
    const pending = pendingRef.current;
    const el = elementRef.current;
    if (!pending || !el) {
      return undefined;
    }
    pendingRef.current = null;
    cancelInFlight();
    cancelRef.current = animateElementHeight(el, pending.fromPx, pending.toPx, {
      durationMs,
      onComplete: () => {
        cancelRef.current = null;
        setIsAnimating(false);
      },
    });
    return undefined;
  }, [animationRequestId, cancelInFlight, durationMs, elementRef]);

  useLayoutEffect(() => {
    return () => {
      cancelInFlight();
    };
  }, [cancelInFlight]);

  return {
    isAnimating,
    scheduleHeightAnimation,
    prefersReducedMotion,
  };
}
