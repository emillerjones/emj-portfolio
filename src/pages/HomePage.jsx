import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const OrbField = lazy(() => import("../components/OrbField"));
const HORIZON_API = import.meta.env.VITE_HORIZON_API || "https://raidhelper-server.onrender.com";

// Shown until the live request returns (Render can take ~30s to wake).
const HORIZON_FALLBACK = { raids: 2700, guilds: 60, upcomingWeek: null, live: false };

const STOPS = [
  {
    eyebrow: "Solutions engineer · Austin, TX",
    title: <>Real workflows.<br /><em>Useful software.</em></>,
    body: "I go into messy, scattered processes, learn how the work really moves, and build the software that ties it together.",
  },
  {
    eyebrow: "01 · TCEQ records operation · 2013–2023",
    title: "Separate departmental tools became one system.",
    body: "Imaging, public information, QC, redaction and records management, connected in one Access and Oracle application.",
    facts: ["Migration mapping & validation · 3.1M items", "30–50 staff used it daily"],
  },
  {
    eyebrow: "02 · Horizon · 2026–present",
    title: "Raids scattered across Discord became one calendar.",
    body: "My own product: React, Express and PostgreSQL, with Discord imports and a Chrome extension.",
    live: true,
  },
  {
    eyebrow: "03 · Recovery Community · 2026–present",
    title: "A Facebook group is getting a home of its own.",
    body: "Built with the community’s owner: admissions, moderation, private messaging and a real-time lounge.",
    facts: ["Preparing for private beta"],
  },
];
const LAST = STOPS.length - 1;

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function useHorizonSummary() {
  const [summary, setSummary] = useState(HORIZON_FALLBACK);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    fetch(`${HORIZON_API}/api/raidhelper/summary`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        if (Number.isFinite(data.raids) && Number.isFinite(data.guilds)) setSummary({ ...data, live: true });
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);
  return summary;
}

function HorizonFact({ summary }) {
  const plus = summary.live ? "" : "+";
  return (
    <ul className="home-story__facts">
      {summary.live && <li className="home-story__live"><i aria-hidden="true" />Live</li>}
      <li>{summary.raids.toLocaleString()}{plus} raids</li>
      <li>{summary.guilds}{plus} guilds</li>
      {summary.live && summary.upcomingWeek > 0 && <li>{summary.upcomingWeek} this week</li>}
    </ul>
  );
}

export default function HomePage() {
  const [stop, setStop] = useState(0);
  const [entrance, setEntrance] = useState(0.18);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [area, setArea] = useState(null);
  const surfaceRef = useRef(null);
  const captionRef = useRef(null);
  const introRef = useRef(null);
  const gestureRef = useRef(null);
  const wheelRef = useRef({ total: 0, lockedUntil: 0 });
  const summary = useHorizonSummary();

  const go = useCallback((direction) => {
    setStop((current) => Math.max(0, Math.min(LAST, current + direction)));
  }, []);

  // Short light-up entrance for the opening view, as on the current home page.
  useEffect(() => {
    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const fraction = Math.min(1, (now - start) / 1600);
      setEntrance(0.18 + 0.4 * (1 - (1 - fraction) ** 3));
      if (fraction < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  // The formations fill the screen space the text leaves free.
  useLayoutEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width <= 760) {
        const captionTop = captionRef.current?.getBoundingClientRect().top ?? height * 0.55;
        setArea({ top: 96, bottom: Math.max(240, captionTop - 18), left: 18, right: width - 18 });
      } else {
        const introRight = introRef.current?.getBoundingClientRect().right ?? width * 0.42;
        setArea({ top: 120, bottom: height - 110, left: Math.min(introRight + 56, width * 0.55), right: width - 72 });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (surface.scrollHeight > surface.clientHeight + 2) return;
      event.preventDefault();
      const wheel = wheelRef.current;
      const now = performance.now();
      if (now < wheel.lockedUntil) return;
      wheel.total += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(wheel.total) > 50) {
        go(Math.sign(wheel.total));
        wheel.total = 0;
        wheel.lockedUntil = now + 700;
      }
    };
    surface.addEventListener("wheel", onWheel, { passive: false });
    return () => surface.removeEventListener("wheel", onWheel);
  }, [go]);

  const startGesture = (event) => {
    if (!event.isPrimary || event.target.closest("a, button")) return;
    gestureRef.current = { y: event.clientY, x: event.clientX };
  };
  const endGesture = (event) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (!gesture) return;
    const dy = gesture.y - event.clientY;
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(gesture.x - event.clientX)) go(dy > 0 ? 1 : -1);
  };

  const current = STOPS[stop];
  const Heading = stop === 0 ? "h1" : "h2";
  const hint = stop === 0 ? "Swipe up to see how" : stop === LAST ? "Swipe down to go back" : "Swipe up for the next one";

  return (
    <main
      className={`home-page home-story home-story--stop-${stop}`}
      ref={surfaceRef}
      aria-label="Evan Miller-Jones, solutions engineer"
      tabIndex={0}
      onPointerDown={startGesture}
      onPointerUp={endGesture}
      onPointerCancel={() => { gestureRef.current = null; }}
      onKeyDown={(event) => {
        if (event.target.closest("a, button")) return;
        const next = ["ArrowDown", "PageDown", " "].includes(event.key);
        const previous = ["ArrowUp", "PageUp"].includes(event.key);
        if (!next && !previous) return;
        event.preventDefault();
        go(next ? 1 : -1);
      }}
    >
      <div className="home-page__scene" aria-hidden="true">
        <SceneBoundary>
          <Suspense fallback={null}>
            <OrbField
              progress={stop === 0 ? entrance : 1}
              motion={!paused}
              formation={stop}
              formationArea={area}
              onReady={() => setReady(true)}
            />
          </Suspense>
        </SceneBoundary>
      </div>

      <section className="home-story__caption" ref={captionRef} aria-live="polite">
        <div className="home-story__intro" ref={introRef}>
          <nav className="home-story__steps" aria-label="Story steps">
            {STOPS.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                className={index === stop ? "is-active" : ""}
                aria-current={index === stop ? "step" : undefined}
                aria-label={index === 0 ? "Introduction" : item.eyebrow}
                onClick={() => setStop(index)}
              />
            ))}
          </nav>
          <div className="home-story__panel" key={stop}>
            <p className="home-story__eyebrow">{current.eyebrow}</p>
            <Heading className="home-story__title">{current.title}</Heading>
            <p className="home-story__body">{current.body}</p>
            {current.facts && <ul className="home-story__facts">{current.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>}
            {current.live && <HorizonFact summary={summary} />}
          </div>
          <nav className="home-page__actions" aria-label="Explore my work">
            <Link className="home-page__primary" to="/projects">View projects <span aria-hidden="true">↗</span></Link>
            <Link to="/mystory">My story <span aria-hidden="true">→</span></Link>
          </nav>
        </div>
      </section>

      <p className="home-story__hint" aria-hidden="true">
        <span className="home-story__hint-arrow">{stop === LAST ? "↓" : "↑"}</span>{hint}
      </p>

      <footer className="home-page__footer home-story__footer">
        <a className="home-page__contact" href="mailto:evan.millerjones@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
        <nav aria-label="Professional profiles">
          <a href="https://www.linkedin.com/in/evan-miller-jones-30762a28/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/emillerjones" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <button className="home-page__motion" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume motion" : "Pause motion"}</button>
      </footer>
    </main>
  );
}
