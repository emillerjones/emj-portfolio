import { useEffect, useRef, useState } from "react";

// True once the element has scrolled at least `threshold` into view.
// Stays true afterwards, so an entrance animation plays only once.
export default function useInViewOnce({ threshold = 0.45, enabled = true } = {}) {
  const ref = useRef(null);
  // Without IntersectionObserver, treat it as already seen (final state).
  const [seen, setSeen] = useState(() => !("IntersectionObserver" in window));

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || seen) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, seen, threshold]);

  return [ref, seen];
}
