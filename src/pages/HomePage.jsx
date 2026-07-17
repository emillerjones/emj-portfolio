import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { estimateOrbLightCount, estimateOrbTotalCount } from "../components/orbFieldConfig";
import "./HomePage.css";

const OrbField = lazy(() => import("../components/OrbField"));

// Mobile entrance sequence. Keep its pacing controls together so the opening
// light-up and interface reveal can be tuned without hunting through the page.
const MOBILE_INTRO = {
  initialDelayMs: 320,
  lightIntervalMs: 225,
  interfaceRevealLight: 6,
  interfaceFadeMs: 1500,
};

const FEATURED_PROJECTS = [
  { tag: "Live product", name: "Horizon", result: "A full-stack raid calendar now tracking 28 guilds and 500+ raids." },
  { tag: "In development", name: "Wellness Recovery Community", result: "A public foundation for a nonprofit recovery community, built for trust and accessibility." },
  { tag: "TCEQ · 2016–2023", name: "Enterprise Records Workflow System", result: "A daily workflow product supporting 30–50 records staff." },
];

export default function HomePage() {
  const mobile = useMemo(() => window.matchMedia("(max-width: 760px)").matches, []);
  const totalLights = useMemo(() => estimateOrbLightCount(mobile), [mobile]);
  const totalOrbs = useMemo(() => estimateOrbTotalCount(mobile), [mobile]);
  const [lightsOn, setLightsOn] = useState(() => (mobile ? 0 : 1));
  const [orbsOn, setOrbsOn] = useState(totalOrbs);
  const [orbsMoving, setOrbsMoving] = useState(true);
  const [stirSignal, setStirSignal] = useState({ id: 0, direction: 0, strength: 0 });
  const [pulseProgress, setPulseProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [mobileIntroReady, setMobileIntroReady] = useState(() => !mobile);
  const wheelTotalRef = useRef(0);
  const lastLightStepRef = useRef(0);
  const lastLightsRef = useRef(mobile ? 0 : 1);
  const ignitionLockRef = useRef(false);
  const ignitionTimerRef = useRef(null);
  const touchStartRef = useRef(null);
  const pointerStartRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const swipeHintRef = useRef(null);
  const pulseFrameRef = useRef(null);
  const fieldInteractionRef = useRef({ active: false, drag: 0, releaseId: 0, releasedAt: -Infinity });

  const stirField = (direction, strength) => {
    setStirSignal((current) => ({ id: current.id + 1, direction, strength }));
  };

  // A one-off "every light briefly comes on" flourish for the résumé
  // pill -- rises fast, holds barely a beat, eases back out. Reuses the
  // exact same `progress` channel the scroll/wheel interaction already
  // drives, just overridden for ~1.5s via requestAnimationFrame instead
  // of scroll position.
  const triggerLightPulse = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (pulseFrameRef.current) cancelAnimationFrame(pulseFrameRef.current);
    const start = performance.now();
    const duration = 2000;
    const riseEnd = duration * 0.35;
    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed >= duration) {
        setPulseProgress(0);
        pulseFrameRef.current = null;
        return;
      }
      let value;
      if (elapsed < riseEnd) {
        const t = elapsed / riseEnd;
        value = 1 - (1 - t) * (1 - t);
      } else {
        const t = (elapsed - riseEnd) / (duration - riseEnd);
        value = (1 - t) * (1 - t);
      }
      setPulseProgress(Math.max(0, Math.min(1, value)));
      pulseFrameRef.current = requestAnimationFrame(tick);
    };
    pulseFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (pulseFrameRef.current) cancelAnimationFrame(pulseFrameRef.current);
  }, []);

  useEffect(() => {
    if (!mobile || !sceneReady) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => {
        lastLightsRef.current = totalLights;
        setLightsOn(totalLights);
        setMobileIntroReady(true);
      });
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const nextLights = Math.min(
        totalLights,
        Math.max(0, Math.floor(
          (elapsed - MOBILE_INTRO.initialDelayMs) / MOBILE_INTRO.lightIntervalMs,
        )),
      );
      if (nextLights !== lastLightsRef.current) {
        lastLightsRef.current = nextLights;
        setLightsOn(nextLights);
      }
      if (nextLights >= MOBILE_INTRO.interfaceRevealLight) setMobileIntroReady(true);
      if (nextLights < totalLights) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mobile, sceneReady, totalLights]);

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
  //
  // The hero section is deliberately taller than one screen (see
  // HomePage.css) purely so there's scroll runway between "the hero
  // text has finished flying off" and "the reveal section's top edge
  // reaches the viewport" -- with the hero at exactly 100svh, the
  // reveal section's bottom starts creeping up from the first pixel of
  // scroll, while the still-fading hero text (anchored near the hero's
  // own bottom edge) is still on screen. `fraction` is the raw progress
  // across that whole tall box; lights and the text animation each
  // derive their own, faster-completing fraction from it.
  //
  // The hero text/hint motion is handled by a native CSS scroll-driven
  // animation where supported (see the @supports block in HomePage.css)
  // -- that runs on the compositor thread, immune to main-thread/JS
  // timing, which is the only way to actually match native scroll's
  // smoothness. Any JS approach here (state, refs, rAF -- all tried)
  // still has to wait for a `scroll` event to fire and a callback to
  // run before it can paint, and that round trip is what reads as
  // "choppy" next to elements (like the flanking buttons) that scroll
  // natively and never touch JS at all. The ref-writing fallback below
  // only runs on browsers that lack scroll-timeline support.
  useEffect(() => {
    if (!mobile) return;
    const supportsScrollTimeline = typeof CSS !== "undefined" && CSS.supports?.("(animation-timeline: scroll())");
    let ticking = false;
    const update = () => {
      ticking = false;
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
      const fraction = Math.max(0, Math.min(1, window.scrollY / heroHeight));

      if (supportsScrollTimeline) return;

      const textFraction = Math.min(1, fraction / 0.3);
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-textFraction * 46}vh)`;
        contentRef.current.style.opacity = String(Math.max(0, 1 - textFraction));
      }
      if (swipeHintRef.current) {
        swipeHintRef.current.style.opacity = String(Math.max(0, 1 - fraction / 0.12));
      }
    };
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobile]);

  const handleTouchStart = (event) => {
    if (event.target.closest?.("a, button, input")) return;
    const touch = event.touches[0];
    touchStartRef.current = touch ? {
      startX: touch.clientX,
      startY: touch.clientY,
      lastX: touch.clientX,
      lastTime: performance.now(),
      velocity: 0,
      mode: null,
    } : null;
  };

  // Only the horizontal "stir the field" gesture is hand-tracked here --
  // vertical movement is deliberately left alone so it becomes real
  // scroll instead of being hijacked.
  const handleTouchMove = (event) => {
    if (touchStartRef.current === null) return;
    const gesture = touchStartRef.current;
    const touch = event.touches[0];
    if (!touch) return;
    const horizontal = touch.clientX - gesture.startX;
    const vertical = touch.clientY - gesture.startY;
    const now = performance.now();
    const elapsed = Math.max(8, now - gesture.lastTime);
    gesture.velocity = (touch.clientX - gesture.lastX) / elapsed;
    gesture.lastX = touch.clientX;
    gesture.lastTime = now;

    if (gesture.mode === "horizontal") {
      fieldInteractionRef.current.drag = Math.max(-1, Math.min(1, horizontal / (window.innerWidth * 0.32)));
      return;
    }
    if (gesture.mode === "vertical") return;
    if (Math.abs(horizontal) > 32 && Math.abs(horizontal) > Math.abs(vertical) * 1.15) {
      gesture.mode = "horizontal";
      fieldInteractionRef.current.active = true;
      fieldInteractionRef.current.drag = Math.max(-1, Math.min(1, horizontal / (window.innerWidth * 0.32)));
    } else if (Math.abs(vertical) > 12) {
      gesture.mode = "vertical";
    }
  };

  const handleTouchEnd = () => {
    const gesture = touchStartRef.current;
    if (gesture?.mode === "horizontal") {
      const drag = fieldInteractionRef.current.drag;
      const direction = Math.sign(gesture.velocity || drag) || 1;
      const strength = Math.min(1.8, 0.85 + Math.abs(gesture.velocity) * 0.7 + Math.abs(drag) * 0.45);
      fieldInteractionRef.current.active = false;
      fieldInteractionRef.current.releaseId += 1;
      fieldInteractionRef.current.releasedAt = performance.now();
      stirField(direction, strength);
      navigator.vibrate?.(8);
    }
    touchStartRef.current = null;
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.target.closest("a, button, input")) return;
    pointerStartRef.current = { x: event.clientX, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
    fieldInteractionRef.current.active = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const gesture = pointerStartRef.current;
    if (!gesture || event.buttons !== 1) return;
    const distance = event.clientX - gesture.x;
    const now = performance.now();
    const elapsed = Math.max(8, now - gesture.lastTime);
    gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
    gesture.lastX = event.clientX;
    gesture.lastTime = now;
    fieldInteractionRef.current.drag = Math.max(-1, Math.min(1, distance / (window.innerWidth * 0.24)));
  };

  const handlePointerEnd = () => {
    const gesture = pointerStartRef.current;
    if (gesture) {
      const drag = fieldInteractionRef.current.drag;
      if (Math.abs(drag) > 0.06) {
        const direction = Math.sign(gesture.velocity || drag) || 1;
        const strength = Math.min(1.8, 0.85 + Math.abs(gesture.velocity) * 0.65 + Math.abs(drag) * 0.5);
        fieldInteractionRef.current.releaseId += 1;
        fieldInteractionRef.current.releasedAt = performance.now();
        stirField(direction, strength);
      }
    }
    fieldInteractionRef.current.active = false;
    pointerStartRef.current = null;
  };

  const lightProgress = totalLights > 0 ? lightsOn / totalLights : 0;
  const orbProgress = totalOrbs > 0 ? orbsOn / totalOrbs : 1;
  const effectiveLightProgress = Math.max(lightProgress, pulseProgress);

  return (
    <main
      className={`landing-page${mobileIntroReady ? " is-mobile-intro-ready" : ""}`}
      style={{ "--mobile-intro-fade-duration": `${MOBILE_INTRO.interfaceFadeMs}ms` }}
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
        <OrbField
          progress={effectiveLightProgress}
          orbProgress={orbProgress}
          motion={orbsMoving}
          stirSignal={stirSignal}
          interactionRef={fieldInteractionRef}
          onReady={() => setSceneReady(true)}
        />
      </Suspense>

      <a className="landing-resume-pill" href="/resume.pdf" download onClick={triggerLightPulse}>
        Résumé <span>↓</span>
      </a>

      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero__frame">
          <div className="landing-page__mobile-identity">
            <strong>Evan Miller-Jones</strong>
            <span>Portfolio · Product Builder &amp; Full-Stack Developer</span>
          </div>

          <section
            className="landing-page__content"
            aria-labelledby="landing-title"
            ref={contentRef}
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
            </div>
          </section>

          <div className="landing-page__flank-row">
            <Link className="landing-page__flank-action" to="/projects">
              <i>↗</i>
              <span>Projects</span>
            </Link>

            <div className="landing-page__swipe-hint" aria-hidden="true" ref={swipeHintRef}>
              <i />
              <span>Swipe up · drag sideways</span>
            </div>

            <Link className="landing-page__flank-action" to="/mystory">
              <i>↗</i>
              <span>My Story</span>
            </Link>
          </div>
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
