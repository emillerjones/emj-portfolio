import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { estimateOrbLightCount, estimateOrbTotalCount } from "../components/orbFieldConfig";
import "./HomePage.css";

const OrbField = lazy(() => import("../components/OrbField"));

const FEATURED_PROJECTS = [
  { tag: "Live product", name: "Horizon", result: "A full-stack raid calendar now tracking 28 guilds and 500+ raids." },
  { tag: "In development", name: "Wellness Recovery Community", result: "A public foundation for a nonprofit recovery community, built for trust and accessibility." },
  { tag: "TCEQ · 2016–2023", name: "Enterprise Records Workflow System", result: "A daily workflow product supporting 30–50 records staff." },
];

export default function HomePage() {
  const mobile = useMemo(() => window.matchMedia("(max-width: 760px)").matches, []);
  const totalLights = useMemo(() => estimateOrbLightCount(mobile), [mobile]);
  const totalOrbs = useMemo(() => estimateOrbTotalCount(mobile), [mobile]);
  const [lightsOn, setLightsOn] = useState(() => (mobile ? 1 : 0));
  const [orbsOn, setOrbsOn] = useState(totalOrbs);
  const [orbsMoving, setOrbsMoving] = useState(true);
  const [stirSignal, setStirSignal] = useState({ id: 0, direction: 0, strength: 0 });
  const [heroScroll, setHeroScroll] = useState(0);
  const wheelTotalRef = useRef(0);
  const lastLightStepRef = useRef(0);
  const ignitionLockRef = useRef(false);
  const ignitionTimerRef = useRef(null);
  const touchStartRef = useRef(null);
  const pointerStartRef = useRef(null);
  const heroRef = useRef(null);

  const stirField = (direction, strength) => {
    setStirSignal((current) => ({ id: current.id + 1, direction, strength }));
  };

  // Desktop: a single fixed screen, mouse wheel hijacked entirely to
  // drive the lights -- unchanged from before.
  useEffect(() => {
    if (mobile) return;
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
  }, [mobile, lightsOn, totalLights]);

  useEffect(() => () => window.clearTimeout(ignitionTimerRef.current), []);

  // Mobile: real document scroll drives both the lights and the hero
  // text's bottom-to-top travel. Native touch/momentum/accessibility --
  // nothing hand-rolled here, the browser does the actual scrolling.
  useEffect(() => {
    if (!mobile) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
      const fraction = Math.max(0, Math.min(1, window.scrollY / heroHeight));
      setHeroScroll(fraction);
      setLightsOn(Math.round(fraction * totalLights));
    };
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobile, totalLights]);

  const handleTouchStart = (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
    const touch = event.touches[0];
    touchStartRef.current = touch ? { startX: touch.clientX, startY: touch.clientY, mode: null } : null;
  };

  // Only the horizontal "stir the field" gesture is hand-tracked here --
  // vertical movement is deliberately left alone so it becomes real
  // scroll instead of being hijacked.
  const handleTouchMove = (event) => {
    if (touchStartRef.current === null) return;
    const gesture = touchStartRef.current;
    if (gesture.mode !== null) return;
    const touch = event.touches[0];
    if (!touch) return;
    const horizontal = touch.clientX - gesture.startX;
    const vertical = touch.clientY - gesture.startY;
    if (Math.abs(horizontal) > 32 && Math.abs(horizontal) > Math.abs(vertical) * 1.15) {
      gesture.mode = "horizontal";
      stirField(horizontal > 0 ? 1 : -1, Math.min(1.55, 0.85 + Math.abs(horizontal) / 160));
    } else if (Math.abs(vertical) > 12) {
      gesture.mode = "vertical";
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.target.closest("a, button, input")) return;
    pointerStartRef.current = { x: event.clientX, triggered: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const gesture = pointerStartRef.current;
    if (!gesture || gesture.triggered || event.buttons !== 1) return;
    const distance = event.clientX - gesture.x;
    if (Math.abs(distance) < 36) return;
    gesture.triggered = true;
    stirField(distance > 0 ? 1 : -1, Math.min(1.65, 0.95 + Math.abs(distance) / 220));
  };

  const handlePointerEnd = () => {
    pointerStartRef.current = null;
  };

  const lightProgress = totalLights > 0 ? lightsOn / totalLights : 0;
  const orbProgress = totalOrbs > 0 ? orbsOn / totalOrbs : 1;

  // Hero copy starts at its normal resting spot and flies up/out as you
  // scroll through the hero's own height, fading before the reveal
  // section takes over -- and stops accepting clicks once it's mostly
  // gone so it can't shadow the reveal content underneath it.
  const heroShiftVh = mobile ? -heroScroll * 70 : 0;
  const heroOpacity = mobile ? Math.max(0, 1 - heroScroll / 0.85) : 1;
  const heroPointerEvents = mobile && heroScroll > 0.6 ? "none" : undefined;
  const hintOpacity = mobile ? Math.max(0, 1 - heroScroll / 0.12) : 1;
  // The pill only needs to bridge the gap while the hero's own résumé
  // link is fading away -- once the reveal section is reachable it has
  // its own résumé link, so the pill steps aside instead of sitting on
  // top of that section's text for the rest of the scroll.
  const pillOpacity = mobile ? Math.max(0, 1 - Math.max(0, heroScroll - 0.88) / 0.12) : 1;
  const pillPointerEvents = mobile && heroScroll >= 1 ? "none" : undefined;

  return (
    <main
      className="landing-page"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
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

      <a
        className="landing-resume-pill"
        href="/resume.pdf"
        download
        style={mobile ? { opacity: pillOpacity, pointerEvents: pillPointerEvents } : undefined}
      >
        Résumé <span>↓</span>
      </a>

      <section className="landing-hero" ref={heroRef}>
        <div className="landing-page__mobile-identity">
          <strong>Evan Miller-Jones</strong>
          <span>Portfolio · Product Builder &amp; Full-Stack Developer</span>
        </div>

        <section
          className="landing-page__content"
          aria-labelledby="landing-title"
          style={mobile ? { transform: `translateY(${heroShiftVh}vh)`, opacity: heroOpacity, pointerEvents: heroPointerEvents } : undefined}
        >
          <p className="landing-page__eyebrow">Full-Stack Developer &amp; Product Builder · Texas</p>
          <h1 id="landing-title">Better software starts<br />with the real process.</h1>
          <p className="landing-page__intro">
            I work close to the workflow—find where people lose time or context, understand the surrounding system, build something better, then watch real use and improve it.
          </p>
          <ol className="landing-page__method" aria-label="Product building process">
            <li><small>01</small><span>Notice the friction</span></li>
            <li><small>02</small><span>Understand the workflow</span></li>
            <li><small>03</small><span>Build, watch, improve</span></li>
          </ol>
          <div className="landing-page__actions">
            <Link className="landing-page__primary" to="/projects">View Projects <span>→</span></Link>
            <Link to="/mystory">My Story <span>→</span></Link>
            <a href="/resume.pdf" download>Résumé <span>↓</span></a>
          </div>
        </section>

        <div className="landing-page__swipe-hint" aria-hidden="true" style={mobile ? { opacity: hintOpacity } : undefined}>
          <i />
          <span>Swipe up for more</span>
        </div>

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
      </section>

      <section className="landing-reveal">
        <div className="landing-reveal__about">
          <span className="landing-reveal__eyebrow">About</span>
          <p>
            I&rsquo;ve spent over a decade turning messy, manual processes&mdash;paper records, spreadsheets, scattered Discord
            threads&mdash;into software people actually rely on. These days that&rsquo;s full-stack product work: React and Node
            on the front end and API layer, PostgreSQL underneath, shipped and improved from real use.
          </p>
          <Link to="/mystory">Read the full story <span>→</span></Link>
        </div>

        <div className="landing-reveal__projects">
          <span className="landing-reveal__eyebrow">Selected work</span>
          <ul>
            {FEATURED_PROJECTS.map((project) => (
              <li key={project.name}>
                <b>{project.tag}</b>
                <h3>{project.name}</h3>
                <p>{project.result}</p>
              </li>
            ))}
          </ul>
          <Link to="/projects">View all projects <span>→</span></Link>
        </div>

        <nav className="landing-reveal__nav" aria-label="Site sections">
          <div className="landing-reveal__links">
            <Link to="/mystory">My Story</Link>
            <Link to="/projects">All Projects</Link>
            <a href="/resume.pdf" download>Résumé</a>
          </div>
          <div className="landing-reveal__social">
            <a href="mailto:emj.studioworks@gmail.com">Email</a>
            <a href="https://www.linkedin.com/in/evan-miller-jones-30762a28/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/emillerjones" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </nav>
      </section>

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
