import { useEffect, useRef } from "react";

const WHEEL_THRESHOLD = 28;

function canUseMotion() {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(max-width: 640px)").matches
  );
}

function getTop(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function getCurrentIndex(sections) {
  const viewportAnchor = window.scrollY + Math.min(32, window.innerHeight * 0.08);
  const containingIndex = sections.findIndex((section) => {
    const top = getTop(section);
    const bottom = top + section.offsetHeight;
    return viewportAnchor >= top - 2 && viewportAnchor < bottom - 2;
  });

  if (containingIndex !== -1) {
    return containingIndex;
  }

  const probe = window.scrollY + window.innerHeight * 0.32;

  return sections.reduce((closestIndex, section, index) => {
    const closestDistance = Math.abs(getTop(sections[closestIndex]) - probe);
    const distance = Math.abs(getTop(section) - probe);
    return distance < closestDistance ? index : closestIndex;
  }, 0);
}

function canScrollWithinSection(section, direction) {
  const rect = section.getBoundingClientRect();
  const oversized = rect.height > window.innerHeight + 1;

  if (!oversized) return false;

  if (direction > 0) {
    return rect.bottom > window.innerHeight + 2;
  }

  return rect.top < -2;
}

export function useChapterScroller(sectionIds) {
  const lockRef = useRef(false);
  const unlockCleanupRef = useRef(null);

  useEffect(() => {
    if (!canUseMotion()) return undefined;

    const getSections = () =>
      sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const goToIndex = (nextIndex) => {
      const sections = getSections();
      if (sections.length === 0) return;

      const clamped = Math.max(0, Math.min(nextIndex, sections.length - 1));
      const target = sections[clamped];
      lockRef.current = true;
      unlockCleanupRef.current?.();

      let frameId;
      let safetyTimer;
      let finished = false;

      const unlock = () => {
        if (finished) return;
        finished = true;
        lockRef.current = false;
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(safetyTimer);
        window.removeEventListener("scrollend", unlock);
        unlockCleanupRef.current = null;
      };

      const watchTarget = () => {
        if (Math.abs(target.getBoundingClientRect().top) <= 2) {
          unlock();
          return;
        }
        frameId = window.requestAnimationFrame(watchTarget);
      };

      window.addEventListener("scrollend", unlock, { once: true });
      frameId = window.requestAnimationFrame(watchTarget);
      // Safety only: releases the input if a browser cancels smooth scrolling
      // without firing scrollend or ever landing exactly on the target.
      safetyTimer = window.setTimeout(unlock, 1800);
      unlockCleanupRef.current = unlock;

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onWheel = (event) => {
      const sections = getSections();
      if (sections.length === 0 || Math.abs(event.deltaY) < WHEEL_THRESHOLD) {
        return;
      }

      const currentIndex = getCurrentIndex(sections);
      const direction = event.deltaY > 0 ? 1 : -1;
      const currentSection = sections[currentIndex];

      if (canScrollWithinSection(currentSection, direction)) {
        return;
      }

      event.preventDefault();
      if (lockRef.current) return;

      goToIndex(currentIndex + direction);
    };

    const onKeyDown = (event) => {
      const downKeys = ["ArrowDown", "PageDown", " "];
      const upKeys = ["ArrowUp", "PageUp"];

      if (![...downKeys, ...upKeys].includes(event.key) || lockRef.current) {
        return;
      }

      const sections = getSections();
      const currentIndex = getCurrentIndex(sections);
      const direction = downKeys.includes(event.key) ? 1 : -1;

      if (canScrollWithinSection(sections[currentIndex], direction)) {
        return;
      }

      event.preventDefault();
      goToIndex(currentIndex + direction);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockCleanupRef.current?.();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sectionIds]);
}
