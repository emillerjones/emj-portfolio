import { useRef, useState, useEffect } from "react";

export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const { root = null, rootMargin = "0px", threshold = 0.15 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [root, rootMargin, threshold]);

  return [ref, inView];
}
