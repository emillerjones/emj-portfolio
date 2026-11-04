import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const OrbField = lazy(() => import("../components/OrbField"));
const clamp = (value) => Math.max(0, Math.min(1, value));

// Keep the introduction and navigation usable even when WebGL is unavailable.
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HomePage() {
  const [brightness, setBrightness] = useState(0.18);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const surfaceRef = useRef(null);
  const gestureRef = useRef(null);
  const touchedRef = useRef(false);
  const brightnessRef = useRef(brightness);

  const adjust = (value) => {
    touchedRef.current = true;
    brightnessRef.current = clamp(value);
    setBrightness(brightnessRef.current);
    setInteracted(true);
  };

  // A short entrance only affects the scene, never access to the content.
  useEffect(() => {
    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      if (touchedRef.current) return;
      const fraction = Math.min(1, (now - start) / 1600);
      brightnessRef.current = 0.18 + 0.4 * (1 - (1 - fraction) ** 3);
      setBrightness(brightnessRef.current);
      if (fraction < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  useEffect(() => {
    const surface = surfaceRef.current;
    const onWheel = (event) => {
      if (event.ctrlKey || event.target.closest("a, button, input") || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // At high zoom / very short heights, let visitors scroll the content.
      if (surface.scrollHeight > surface.clientHeight + 2) return;
      event.preventDefault();
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1);
      adjust(brightnessRef.current + Math.max(-0.12, Math.min(0.12, pixels / 1000)));
    };
    surface.addEventListener("wheel", onWheel, { passive: false });
    return () => surface.removeEventListener("wheel", onWheel);
  }, []);

  const startGesture = (event) => {
    if (!event.isPrimary || event.target.closest("a, button, input") || surfaceRef.current.scrollHeight > surfaceRef.current.clientHeight + 2) return;
    gestureRef.current = { y: event.clientY, brightness: brightnessRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveGesture = (event) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    const distance = gesture.y - event.clientY;
    if (Math.abs(distance) < 6) return;
    adjust(gesture.brightness + distance / Math.max(220, window.innerHeight * 0.48));
  };
  const endGesture = () => { gestureRef.current = null; };

  return (
    <main className="home-page" ref={surfaceRef} aria-labelledby="home-page-title">
      <div className="home-page__scene" aria-hidden="true">
        <SceneBoundary>
          <Suspense fallback={null}>
            <OrbField progress={brightness} motion={!paused} onReady={() => setReady(true)} />
          </Suspense>
        </SceneBoundary>
      </div>
      <div className="home-page__gesture" aria-hidden="true" onPointerDown={startGesture} onPointerMove={moveGesture} onPointerUp={endGesture} onPointerCancel={endGesture} onLostPointerCapture={endGesture} />

      <section className="home-page__intro">
        <p className="home-page__eyebrow">Evan Miller-Jones <span> / Texas</span></p>
        <p className="home-page__role">Solutions &amp; Systems Engineer</p>
        <h1 id="home-page-title">Software that fits<br />the way people<br /><em>actually work.</em></h1>
        <p className="home-page__description">I turn real workflows into useful software.<br className="home-page__desktop-break" /> From records operations to community platforms, I build around the people using it.</p>
        <nav className="home-page__actions" aria-label="Explore my work">
          <Link className="home-page__primary" to="/projects">View projects <span aria-hidden="true">↗</span></Link>
          <Link to="/mystory">My story <span aria-hidden="true">→</span></Link>
        </nav>
        <a className="home-page__proof" href="/projects"><span aria-hidden="true">01 —</span> Explore the systems, decisions, and results <span aria-hidden="true">↗</span></a>
      </section>

      <aside className="home-page__instrument" aria-label="Scene controls">
        <div className="home-page__instrument-heading"><span>Light study</span><button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume motion" : "Pause motion"}</button></div>
        <label htmlFor="home-page-brightness">Brightness <output>{Math.round(brightness * 100)}%</output></label>
        <input id="home-page-brightness" type="range" min="0" max="100" value={Math.round(brightness * 100)} onChange={(event) => adjust(Number(event.target.value) / 100)} />
        <p className={interacted ? "is-used" : ""}>Swipe up to illuminate. Down to dim.</p>
      </aside>

      <footer className="home-page__footer">
        <a className="home-page__contact" href="mailto:evan.millerjones@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
        <nav aria-label="Professional profiles">
          <a href="https://www.linkedin.com/in/evan-miller-jones-30762a28/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/emillerjones" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </footer>
    </main>
  );
}
