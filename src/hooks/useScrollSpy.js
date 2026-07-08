import { useEffect, useRef, useState } from "react";

/**
 * Tracks which section id is currently most visible, and separately
 * accumulates every id that has ever been scrolled into view. The
 * revealed set only grows -- scrolling back up doesn't un-reveal a star.
 */
export function useScrollSpy(sectionIds, options = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] || null);
  const [revealedIds, setRevealedIds] = useState(() =>
    sectionIds[0] ? [sectionIds[0]] : []
  );
  const revealedRef = useRef(new Set(revealedIds));

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        let didReveal = false;

        entries.forEach((entry) => {
          if (entry.isIntersecting && !revealedRef.current.has(entry.target.id)) {
            revealedRef.current.add(entry.target.id);
            didReveal = true;
          }
        });

        if (didReveal) {
          setRevealedIds(Array.from(revealedRef.current));
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: options.rootMargin || "-15% 0px -55% 0px",
        threshold: options.threshold || [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds, options.rootMargin, options.threshold]);

  const revealNow = (id) => {
    if (!revealedRef.current.has(id)) {
      revealedRef.current.add(id);
      setRevealedIds(Array.from(revealedRef.current));
    }
    setActiveId(id);
  };

  return { activeId, revealedIds, revealNow };
}
