import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { estimateOrbLightCount, estimateOrbTotalCount } from "../components/orbFieldConfig";
import "./HomePage.css";

const OrbField = lazy(() => import("../components/OrbField"));

export default function HomePage() {
  const mobile = useMemo(() => window.matchMedia("(max-width: 760px)").matches, []);
  const totalLights = useMemo(() => estimateOrbLightCount(mobile), [mobile]);
  const totalOrbs = useMemo(() => estimateOrbTotalCount(mobile), [mobile]);
  const [lightsOn, setLightsOn] = useState(() => (mobile ? 1 : 0));
  const [orbsOn, setOrbsOn] = useState(totalOrbs);
  const [orbsMoving, setOrbsMoving] = useState(true);
  const [stirSignal, setStirSignal] = useState({ id: 0, direction: 0, strength: 0 });
  const wheelTotalRef = useRef(0);
  const lastLightStepRef = useRef(0);
  const ignitionLockRef = useRef(false);
  const ignitionTimerRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      if (ignitionLockRef.current) {
        window.clearTimeout(ignitionTimerRef.current);
        ignitionTimerRef.current = window.setTimeout(() => {
          ignitionLockRef.current = false;
        }, 140);
        return;
      }
      const firstIgnition = lightsOn === 0 && event.deltaY > 0;
      if (firstIgnition && performance.now() - lastLightStepRef.current < 160) return;
      wheelTotalRef.current += event.deltaY;
      if (Math.abs(wheelTotalRef.current) < (firstIgnition ? 40 : 14)) return;
      const direction = wheelTotalRef.current > 0 ? 1 : -1;
      wheelTotalRef.current = 0;
      if (firstIgnition) {
        lastLightStepRef.current = performance.now();
        ignitionLockRef.current = true;
        ignitionTimerRef.current = window.setTimeout(() => {
          ignitionLockRef.current = false;
        }, 140);
      }
      setLightsOn((current) => Math.max(0, Math.min(totalLights, current + direction)));
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [lightsOn, totalLights]);

  useEffect(() => () => window.clearTimeout(ignitionTimerRef.current), []);

  const handleTouchStart = (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
    const touch = event.touches[0];
    touchStartRef.current = touch ? {
      startX: touch.clientX,
      startY: touch.clientY,
      lastY: touch.clientY,
      mode: null,
    } : null;
  };

  const handleTouchMove = (event) => {
    if (touchStartRef.current === null) return;
    const touch = event.touches[0];
    if (!touch) return;
    const gesture = touchStartRef.current;
    const horizontal = touch.clientX - gesture.startX;
    const vertical = touch.clientY - gesture.startY;

    if (mobile && gesture.mode === null && Math.abs(horizontal) > 32 && Math.abs(horizontal) > Math.abs(vertical) * 1.15) {
      gesture.mode = "horizontal";
      setStirSignal((current) => ({
        id: current.id + 1,
        direction: horizontal > 0 ? 1 : -1,
        strength: Math.min(1.35, 0.65 + Math.abs(horizontal) / 180),
      }));
      return;
    }
    if (gesture.mode === "horizontal") return;

    gesture.mode = "vertical";
    const distance = gesture.lastY - touch.clientY;
    if (Math.abs(distance) < 16) return;
    if (lightsOn === 0 && distance > 0) touchStartRef.current = null;
    else gesture.lastY = touch.clientY;
    setLightsOn((value) => Math.max(0, Math.min(totalLights, value + (distance > 0 ? 1 : -1))));
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const lightProgress = totalLights > 0 ? lightsOn / totalLights : 0;
  const orbProgress = totalOrbs > 0 ? orbsOn / totalOrbs : 1;

  return (
    <main
      className="landing-page"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="landing-page__paper" aria-hidden="true" />
      <Suspense
        fallback={(
          <div className="landing-page__loading" aria-hidden="true">
            <span>Assembling scene</span>
            <i />
          </div>
        )}
      >
        <OrbField progress={lightProgress} orbProgress={orbProgress} motion={orbsMoving} stirSignal={stirSignal} />
      </Suspense>

      <section className="landing-page__content" aria-labelledby="landing-title">
        <p className="landing-page__eyebrow">Full-Stack Developer &amp; Product Builder · Texas</p>
        <h1 id="landing-title">I turn complicated work<br />into software people trust.</h1>
        <p className="landing-page__intro">
          I work close to real processes, find where people lose time or context, and build a better system—then improve it by watching how people actually use it.
        </p>
        <ol className="landing-page__method" aria-label="Product building process">
          <li><small>01</small><span>Find the friction</span></li>
          <li><small>02</small><span>Build the system</span></li>
          <li><small>03</small><span>Learn from use</span></li>
        </ol>
        <div className="landing-page__actions">
          <a className="landing-page__primary" href="/resume.pdf" download>Download Résumé <span>↓</span></a>
          <Link to="/projects">View Projects <span>→</span></Link>
          <Link to="/mystory">My Story <span>→</span></Link>
        </div>
      </section>

      <div className="landing-controls">
        <label className="landing-control">
          <span><b>Orbs</b><output>{orbsOn} / {totalOrbs}</output></span>
          <input
            type="range"
            min={0}
            max={totalOrbs}
            step="1"
            value={orbsOn}
            onChange={(event) => setOrbsOn(Number(event.target.value))}
          />
        </label>
        <div className="landing-motion-control">
          <b>Orbs in motion</b>
          <div role="group" aria-label="Orbs in motion">
            <button type="button" className={orbsMoving ? "is-active" : ""} onClick={() => setOrbsMoving(true)}>Yes</button>
            <button type="button" className={!orbsMoving ? "is-active" : ""} onClick={() => setOrbsMoving(false)}>No</button>
          </div>
        </div>
        <label className="landing-control">
          <span><b>Lights</b><output>{lightsOn} / {totalLights}</output></span>
          <input
            type="range"
            min={0}
            max={totalLights}
            step="1"
            value={lightsOn}
            onChange={(event) => setLightsOn(Number(event.target.value))}
          />
          <small>Scroll or swipe — there's no further down, only more lights</small>
        </label>
      </div>

      <footer className="landing-page__footer">
        <span>Available for full-stack opportunities</span>
        <nav aria-label="Social links">
          <a href="mailto:emj.studioworks@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/evan-miller-jones-30762a28/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/emillerjones" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </footer>
    </main>
  );
}
