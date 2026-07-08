import { useEffect, useState } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import "./Constellation.css";

const LAYOUT_ORDER = [
  { x: 40, y: 0 },
  { x: 22, y: 10 },
  { x: 50, y: 19 },
  { x: 25, y: 29 },
  { x: 56, y: 38 },
  { x: 30, y: 58 },
  { x: 58, y: 67 },
  { x: 32, y: 77 },
  { x: 46, y: 97 },
];

const DUST = [
  { x: 8, y: 18, r: 0.5, d: 0 },
  { x: 82, y: 8, r: 0.4, d: 0.4 },
  { x: 90, y: 26, r: 0.6, d: 0.8 },
  { x: 12, y: 40, r: 0.4, d: 1.2 },
  { x: 88, y: 45, r: 0.5, d: 0.2 },
  { x: 70, y: 55, r: 0.4, d: 0.9 },
  { x: 10, y: 62, r: 0.5, d: 1.5 },
  { x: 90, y: 72, r: 0.4, d: 0.5 },
  { x: 66, y: 85, r: 0.5, d: 1.0 },
  { x: 30, y: 30, r: 0.35, d: 1.7 },
  { x: 20, y: 80, r: 0.4, d: 0.3 },
  { x: 78, y: 18, r: 0.35, d: 1.3 },
];

const WAVE_STEP_MS = 90;

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1.5l2.7 6.4 6.9.6-5.2 4.6 1.6 6.8L12 16.3l-6 3.6 1.6-6.8-5.2-4.6 6.9-.6z" />
    </svg>
  );
}

function useStoryComplete() {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setComplete(entry.isIntersecting),
      { threshold: 0.5, rootMargin: "-15% 0px -10% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return complete;
}

export default function Constellation({ nodes, className = "" }) {
  const sectionIds = nodes.map((n) => n.id);
  const { activeId, revealNow } = useScrollSpy(sectionIds);
  const complete = useStoryComplete();
  const [atTop, setAtTop] = useState(true);
  const [introWave, setIntroWave] = useState(false);
  const [completionWave, setCompletionWave] = useState(false);

  const waveDuration = nodes.length * WAVE_STEP_MS + 500;

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // One-time gentle sweep shortly after the page loads, so the chart
  // reads as an interactive thing rather than a static illustration.
  useEffect(() => {
    const start = setTimeout(() => setIntroWave(true), 900);
    const end = setTimeout(() => setIntroWave(false), 900 + waveDuration);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [waveDuration]);

  // A current traveling Start -> What's Next the moment the closing
  // section is reached, layered on top of the persistent lit state.
  useEffect(() => {
    if (!complete) return undefined;
    setCompletionWave(true);
    const t = setTimeout(() => setCompletionWave(false), waveDuration);
    return () => clearTimeout(t);
  }, [complete, waveDuration]);

  const wave = introWave || completionWave;

  const stars = nodes.map((node, i) => ({ ...node, ...LAYOUT_ORDER[i] }));
  const effectiveActiveId = atTop ? nodes[0].id : activeId;
  const activeIndex = stars.findIndex((s) => s.id === effectiveActiveId);

  const goTo = (id, index) => {
    revealNow(id);

    if (index === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (index === stars.length - 1) {
      const contactEl = document.getElementById("contact") || document.getElementById("footer");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      }
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`constellation ${className}`} aria-label="Career navigation">
      <div className="constellation__chart">
        <svg
          className="constellation__lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {DUST.map((d, i) => (
            <circle
              key={`dust-${i}`}
              cx={d.x}
              cy={d.y}
              r={d.r}
              className="constellation__dust"
              style={{ animationDelay: `${d.d}s` }}
            />
          ))}

          {stars.slice(1).map((star, i) => {
            const prev = stars[i];
            const lit = complete || activeIndex > i;
            return (
              <line
                key={`edge-${star.id}`}
                x1={prev.x}
                y1={prev.y}
                x2={star.x}
                y2={star.y}
                className={`constellation__edge ${lit ? "is-drawn" : ""} ${wave ? "is-wave" : ""}`}
                style={{ animationDelay: `${i * WAVE_STEP_MS}ms` }}
              />
            );
          })}
        </svg>

        {stars.length > 5 && (
          <div
            className="constellation__edge-label"
            style={{
              left: `${(stars[4].x + stars[5].x) / 2 + 8}%`,
              top: `${(stars[4].y + stars[5].y) / 2}%`,
            }}
          >
            <span className="constellation__edge-label-title">Fullstack Academy</span>
            <span className="constellation__edge-label-sub">2025 &ndash; 2026</span>
          </div>
        )}

        {stars.map((star, i) => {
          const isActive = star.id === effectiveActiveId;
          const isFinal = i === stars.length - 1;
          const bright = isActive || complete;
          const labelRight = star.x < 55;
          const arrived = isFinal && bright;

          return (
            <button
              key={star.id}
              type="button"
              className={`constellation__star-btn ${bright ? "is-active" : ""} ${labelRight ? "label-right" : "label-left"} ${isFinal ? "is-final" : ""} ${wave ? "is-wave" : ""} ${arrived ? "is-arrived" : ""}`}
              style={{ left: `${star.x}%`, top: `${star.y}%`, animationDelay: `${i * WAVE_STEP_MS}ms` }}
              onClick={() => goTo(star.id, i)}
            >
              <span className="constellation__dot-wrap">
                <span className="constellation__idle-ring" />
                {isFinal ? (
                  <StarIcon className="constellation__star-icon" />
                ) : (
                  <span className="constellation__dot" />
                )}
                {bright && <span className="constellation__halo" />}
                {arrived && <span className="constellation__burst" />}
              </span>
              <span className="constellation__label">{star.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
