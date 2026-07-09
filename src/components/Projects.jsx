import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { NODES } from "../data/portfolioData";
import "./Projects.css";

const RIGHT_RAIL_MODES = [
  { id: "proof", label: "Proof" },
  { id: "ghost", label: "Illustration" },
  { id: "combo", label: "Both" },
  { id: "vignette", label: "Vignette" },
  { id: "vignette-combo", label: "Vignette + Proof" },
];

const PROOF_ITEMS = {
  records: {
    metric: "100%",
    metricLabel: "accuracy mindset",
    artifact: "Records and scanning workflow",
    impact: "Built the habits behind reliable retrieval and public trust.",
    rows: [
      ["Scope", "document intake"],
      ["Evidence", "indexing + retrieval"],
      ["Standard", "accuracy-first"],
    ],
  },
  workflow: {
    metric: "30-50",
    metricLabel: "staff supported",
    artifact: "Internal Access/VBA workflow system",
    impact: "Replaced manual/vendor workflows with daily operational tools.",
    rows: [
      ["Built with", "Access, VBA, Oracle"],
      ["Verified by", "import validation"],
      ["Tracked", "productivity + queues"],
    ],
  },
  healthcare: {
    metric: "care",
    metricLabel: "context mattered",
    artifact: "Healthcare communication workflows",
    impact: "Worked where timing and clarity affected real appointments.",
    rows: [
      ["Domain", "healthcare tech"],
      ["Focus", "patient communication"],
      ["Risk", "missed context"],
    ],
  },
  messaging: {
    metric: "4",
    metricLabel: "message channels",
    artifact: "Multi-channel messaging infrastructure",
    impact: "Preserved delivery context across campaign and parent records.",
    rows: [
      ["Channels", "voice, SMS, email"],
      ["Logic", "campaign routing"],
      ["Signal", "traceability"],
    ],
  },
  saas: {
    metric: "500+",
    metricLabel: "raids tracked",
    artifact: "Horizon SaaS product",
    impact: "Shipped a full-stack product around a problem I felt personally.",
    rows: [
      ["Users", "28 guilds"],
      ["Built with", "React, Express, PostgreSQL"],
      ["Includes", "Discord + extension"],
    ],
  },
  extensions: {
    metric: "small",
    metricLabel: "surface, real friction",
    artifact: "Chrome extension tooling",
    impact: "Turned repeated browser friction into focused utility.",
    rows: [
      ["Surface", "browser workflow"],
      ["Built with", "Chrome APIs"],
      ["Measure", "speed + precision"],
    ],
  },
  community: {
    metric: "now",
    metricLabel: "in progress",
    artifact: "Wellness Recovery Community platform",
    impact: "Building a nonprofit platform with people and support at the center.",
    rows: [
      ["For", "nonprofit community"],
      ["Supports", "resources + peer support"],
      ["Principle", "people first"],
    ],
  },
};

function RightRailToggle({ mode, onChange }) {
  return (
    <div className="right-rail-toggle" aria-label="Right rail display">
      {RIGHT_RAIL_MODES.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`right-rail-toggle__button${mode === option.id ? " is-active" : ""}`}
          aria-pressed={mode === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ProofPanel({ type }) {
  const proof = PROOF_ITEMS[type] || PROOF_ITEMS.workflow;

  return (
    <aside className={`proof-panel proof-panel--${type}`} aria-label="Proof from this chapter">
      <p className="proof-panel__eyebrow">Proof</p>
      <div className="proof-panel__metric">
        <span className="proof-panel__metric-value">{proof.metric}</span>
        <span className="proof-panel__metric-label">{proof.metricLabel}</span>
      </div>
      <dl className="proof-panel__rows">
        <div>
          <dt>Artifact</dt>
          <dd>{proof.artifact}</dd>
        </div>
        <div>
          <dt>Impact</dt>
          <dd>{proof.impact}</dd>
        </div>
        {proof.rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function GhostDiagram({ type }) {
  return (
    <div className={`ghost-diagram ghost-diagram--${type}`} aria-hidden="true">
      <svg className="ghost-diagram__art" viewBox="0 0 240 240">
        {type === "records" && (
          <>
            <path d="M82 64h70l24 25v92H82z" />
            <path d="M151 64v27h25" />
            <path d="M64 82h18M64 102h18M64 122h18" />
            <path d="M100 112h54M100 132h42M100 152h62" />
            <path d="M74 76c-16 13-22 31-19 54 3 24 16 42 38 53" className="ghost-diagram__soft" />
          </>
        )}

        {type === "workflow" && (
          <>
            <path d="M48 118h40M88 118l14-14M88 118l14 14" />
            <rect x="104" y="82" width="48" height="28" rx="3" />
            <rect x="104" y="126" width="48" height="28" rx="3" />
            <path d="M152 96h32v44h-32" />
            <path d="M184 118h20M204 118l-12-12M204 118l-12 12" />
            <path d="M116 96h24M116 140h24" className="ghost-diagram__soft" />
          </>
        )}

        {type === "healthcare" && (
          <>
            <rect x="66" y="70" width="82" height="92" rx="7" />
            <path d="M66 94h82M86 58v24M128 58v24" />
            <path d="M107 116v32M91 132h32" />
            <path d="M146 126c22-10 40-5 48 10 7 14 0 31-18 38" className="ghost-diagram__soft" />
            <path d="M172 174l-1-18 18 6" className="ghost-diagram__soft" />
          </>
        )}

        {type === "messaging" && (
          <>
            <path d="M58 86h52v36H58zM58 86l26 22 26-22" />
            <path d="M130 58h52v36h-52zM130 58l26 22 26-22" />
            <path d="M132 146h52v36h-52zM132 146l26 22 26-22" />
            <path d="M110 104c22 0 28-28 20-28M110 104c22 0 25 58 22 58" className="ghost-diagram__soft" />
            <circle cx="110" cy="104" r="5" />
          </>
        )}

        {type === "saas" && (
          <>
            <rect x="60" y="74" width="120" height="82" rx="8" />
            <path d="M60 98h120" />
            <path d="M82 124h34M82 140h52" />
            <circle cx="154" cy="128" r="13" />
            <path d="M120 156v28M83 184h74" className="ghost-diagram__soft" />
            <path d="M82 58c33-19 69-17 101 5" className="ghost-diagram__soft" />
          </>
        )}

        {type === "extensions" && (
          <>
            <rect x="54" y="74" width="132" height="90" rx="8" />
            <path d="M54 98h132M76 86h1M92 86h1M108 86h1" />
            <path d="M108 120h26v18h18v24h-44z" />
            <path d="M151 120c16 3 27 12 34 27" className="ghost-diagram__soft" />
            <path d="M178 147h-18l9-15" className="ghost-diagram__soft" />
          </>
        )}

        {type === "community" && (
          <>
            <circle cx="120" cy="84" r="20" />
            <circle cx="82" cy="146" r="18" />
            <circle cx="158" cy="146" r="18" />
            <path d="M108 99l-16 31M132 99l16 31M100 146h40" />
            <path d="M68 180c32 19 72 19 104 0" className="ghost-diagram__soft" />
            <path d="M72 174l-5 16 16-4M168 174l5 16-16-4" className="ghost-diagram__soft" />
          </>
        )}
      </svg>
    </div>
  );
}

// A storybook chapter-plate: one small, ghosted, hand-feel scene per
// chapter that gestures at something in the story without diagramming
// it. Every scene is drawn twice -- a crisp trace plus a faint, offset
// "ghost" retrace via <use> -- and both pass through a shared turbulence
// filter so the line wobbles like ink instead of sitting die-straight.
function VignetteArt({ type, variant = "main" }) {
  const id = `vignette-${type}-${variant}`;

  return (
    <div className={`vignette-art vignette-art--${type}`} aria-hidden="true">
      <svg className="vignette-art__scene" viewBox="0 0 200 200">
        <g filter="url(#ink-wobble)">
          <g id={id} className="vignette-art__trace">
            {type === "records" && (
              <>
                <path d="M100,60 C100,58 98,56 94,56 C82,56 66,60 58,68 C55,71 55,74 55,78 L55,150 C55,154 58,156 62,154 C72,148 86,145 96,146 C98,146 100,144 100,142 Z" />
                <path d="M100,60 C100,58 102,56 106,56 C118,56 134,60 142,68 C145,71 145,74 145,78 L145,150 C145,154 142,156 138,154 C128,148 114,145 104,146 C102,146 100,144 100,142 Z" />
                <path d="M100,60 L100,142" />
                <path d="M66,80 L88,78 M66,94 L92,92 M66,108 L86,106" />
                <path d="M112,78 L134,80 M108,92 L134,94 M114,106 L134,108" />
                <path d="M118,150 L146,96" />
                <path d="M146,96 C150,92 154,90 158,86 M142,104 C147,102 151,100 155,96 M138,112 C143,111 147,108 151,104" />
              </>
            )}

            {type === "workflow" && (
              <>
                <path d="M78,55 L122,55 L100,100 L122,145 L78,145 L100,100 Z" />
                <path d="M100,90 C102,94 102,96 100,100 C98,96 98,94 100,90 Z" />
                <circle cx="146" cy="66" r="12" />
                <path d="M146,50 L146,56 M146,76 L146,82 M130,66 L136,66 M156,66 L162,66 M135,55 L139,59 M153,73 L157,77 M157,55 L153,59 M139,73 L135,77" />
              </>
            )}

            {type === "healthcare" && (
              <>
                <path d="M100,55 C82,55 72,70 72,88 C72,100 68,108 62,114 L138,114 C132,108 128,100 128,88 C128,70 118,55 100,55 Z" />
                <path d="M90,114 C90,120 95,124 100,124 C105,124 110,120 110,114" />
                <path d="M144,80 C148,84 148,92 144,96 M152,74 C160,82 160,98 152,106" />
                <path d="M96,132 C92,126 82,126 80,134 C78,142 88,150 96,156 C104,150 114,142 112,134 C110,126 100,126 96,132 Z" />
              </>
            )}

            {type === "messaging" && (
              <>
                <path d="M60,90 C74,78 90,74 100,80 C110,74 126,78 140,90 C126,86 112,90 100,98 C88,90 74,86 60,90 Z" />
                <path d="M100,80 L100,70 M100,70 L94,74 M100,70 L106,74" />
                <path d="M100,98 L100,112" />
                <path d="M84,112 L116,112 L116,132 L84,132 Z M84,112 L100,124 L116,112" />
                <path d="M50,84 C56,82 60,80 64,76 M148,84 C142,82 138,80 134,76" />
              </>
            )}

            {type === "saas" && (
              <>
                <path d="M50,120 L150,120" />
                <path d="M78,120 A22,22 0 1 1 122,120" />
                <circle cx="72" cy="68" r="1.6" />
                <circle cx="128" cy="60" r="1.4" />
                <circle cx="100" cy="52" r="1.3" />
                <circle cx="100" cy="142" r="14" />
                <path d="M100,130 L100,154 M88,142 L112,142" />
              </>
            )}

            {type === "extensions" && (
              <>
                <path d="M64,70 L100,70 C100,62 108,62 108,70 L136,70 L136,98 C144,98 144,106 136,106 L136,134 L108,134 C108,142 100,142 100,134 L64,134 L64,106 C56,106 56,98 64,98 Z" />
                <circle cx="150" cy="150" r="14" />
                <path d="M160,160 L172,172" />
              </>
            )}

            {type === "community" && (
              <>
                <path d="M88,70 C88,64 112,64 112,70 L112,124 C112,132 88,132 88,124 Z" />
                <path d="M94,70 L94,124 M106,70 L106,124" />
                <path d="M96,58 C96,52 104,52 104,58" />
                <path d="M97,90 C97,84 103,84 103,90 C103,96 100,100 100,104 C100,100 97,96 97,90 Z" />
                <path d="M76,84 L84,88 M124,88 L132,84 M78,110 L86,106 M122,106 L130,110" />
              </>
            )}
          </g>
          <use href={`#${id}`} className="vignette-art__trace vignette-art__trace--ghost" transform="translate(1.6,1.1) scale(1.015)" />
        </g>
      </svg>
      <span className="vignette-art__rule" aria-hidden="true" />
    </div>
  );
}

function RightRail({ type, mode }) {
  return (
    <div className={`right-rail right-rail--${mode}`}>
      {(mode === "ghost" || mode === "combo") && <GhostDiagram type={type} />}
      {(mode === "vignette" || mode === "vignette-combo") && <VignetteArt type={type} />}
      {(mode === "proof" || mode === "combo" || mode === "vignette-combo") && <ProofPanel type={type} />}
    </div>
  );
}

function InkDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="ink-wobble" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

function NodeCard({ node, index, total, rightRailMode }) {
  const [ref, inView] = useInView();

  return (
    <article
      ref={ref}
      id={node.id}
      className={`node-card ${inView ? "is-visible" : ""}`}
    >
      <div className="node-card__body">
        <p className="node-chapter">
          Chapter {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <p className="node-problem">{node.problem}</p>
        <h3 className="node-title">{node.title}</h3>
        <p className="node-meta">
          {node.org} &middot; {node.period}
        </p>
        <p className="node-desc">{node.desc}</p>

        {node.takeaway && (
          <div className="node-takeaway">
            <p className="node-takeaway__label">What changed</p>
            <p className="node-takeaway__text">{node.takeaway}</p>
          </div>
        )}

        <div className="node-tags">
          {node.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {node.links && node.links.length > 0 && (
          <div className="node-links">
            {node.links.map((l) => (
              <a key={l.text} href={l.href} className="proj-link">
                {l.text} &rarr;
              </a>
            ))}
          </div>
        )}

        {node.related && node.related.length > 0 && (
          <div className="node-related">
            {node.related.map((r) => (
              <div key={r.name} className="node-related__item">
                <p className="node-related__name">{r.name}</p>
                <p className="node-related__desc">{r.desc}</p>
                <div className="node-tags">
                  {r.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RightRail type={node.artifact} mode={rightRailMode} />
    </article>
  );
}

const BOOKEND_IDS = new Set(["start", "whats-next"]);

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1.5l2.7 6.4 6.9.6-5.2 4.6 1.6 6.8L12 16.3l-6 3.6 1.6-6.8-5.2-4.6 6.9-.6z" />
    </svg>
  );
}

function useIsMobileStory() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function MobileProofStrip({ type }) {
  const proof = PROOF_ITEMS[type] || PROOF_ITEMS.workflow;

  return (
    <div className="mobile-proof-strip" aria-label="Proof from this chapter">
      <span className="mobile-proof-strip__label">Proof</span>
      <span className="mobile-proof-strip__metric">
        {proof.metric} <span>{proof.metricLabel}</span>
      </span>
      <span className="mobile-proof-strip__artifact">{proof.artifact}</span>
    </div>
  );
}

function MobileChapter({ node, index, isOpen, onToggle }) {
  return (
    <details
      id={node.id}
      className="mobile-chapter"
      open={isOpen}
      onToggle={(event) => onToggle(node.id, event.currentTarget.open)}
    >
      <summary className="mobile-chapter__summary">
        <span className="mobile-story__star">
          <StarIcon className="mobile-story__star-icon" />
        </span>
        <span className="mobile-chapter__ornament">
          <VignetteArt type={node.artifact} variant={`${node.id}-summary`} />
        </span>
        <span className="mobile-chapter__intro">
          <span className="mobile-chapter__number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mobile-chapter__title">{node.title}</span>
          <span className="mobile-chapter__problem">{node.problem}</span>
        </span>
        <span className="mobile-chapter__arrow" aria-hidden="true" />
      </summary>

      <div className="mobile-chapter__panel">
        <div className="mobile-chapter__watermark">
          <VignetteArt type={node.artifact} variant={`${node.id}-watermark`} />
        </div>
        <p className="mobile-chapter__meta">
          {node.org} &middot; {node.period}
        </p>
        <p className="mobile-chapter__desc">{node.desc}</p>

        <MobileProofStrip type={node.artifact} />

        {node.takeaway && (
          <div className="node-takeaway">
            <p className="node-takeaway__label">What changed</p>
            <p className="node-takeaway__text">{node.takeaway}</p>
          </div>
        )}

        <div className="node-tags">
          {node.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {node.links && node.links.length > 0 && (
          <div className="node-links">
            {node.links.map((l) => (
              <a key={l.text} href={l.href} className="proj-link">
                {l.text} &rarr;
              </a>
            ))}
          </div>
        )}

        {node.related && node.related.length > 0 && (
          <div className="node-related">
            {node.related.map((r) => (
              <div key={r.name} className="node-related__item">
                <p className="node-related__name">{r.name}</p>
                <p className="node-related__desc">{r.desc}</p>
                <div className="node-tags">
                  {r.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

function MobileStory({ chapters }) {
  const [openId, setOpenId] = useState(null);

  const onToggle = (id, open) => {
    // Controlled <details>: when React closes the previously-open card
    // programmatically (to open a new one), the browser still fires a
    // native "toggle" event for that close. Without the guard below,
    // that stale event arrives after the new card's "open" update and
    // clobbers it back to closed. Only honor a close if it's for the
    // card we currently think is open.
    setOpenId((current) => {
      if (open) return id;
      return current === id ? null : current;
    });
  };

  return (
    <section className="mobile-story" id="projects" aria-label="Story chapters">
      <InkDefs />
      <div className="mobile-story__rail" aria-hidden="true" />

      <a href="#hero" className="mobile-story__bookend mobile-story__bookend--start">
        <span className="mobile-story__star is-active">
          <StarIcon className="mobile-story__star-icon" />
        </span>
        <span>
          <span className="mobile-story__eyebrow">Start</span>
          <span className="mobile-story__title">The beginning</span>
        </span>
      </a>

      <div className="mobile-story__chapters">
        {chapters.map((node, index) => (
          <MobileChapter
            key={node.id}
            node={node}
            index={index}
            isOpen={openId === node.id}
            onToggle={onToggle}
          />
        ))}
      </div>

      <div className="mobile-story__arrival">
        <a href="#contact" className="mobile-story__bookend mobile-story__bookend--final">
          <span className="mobile-story__star is-final">
            <StarIcon className="mobile-story__star-icon" />
          </span>
          <span>
            <span className="mobile-story__eyebrow">The next chapter</span>
            <span className="mobile-story__title">What's next</span>
          </span>
        </a>
      </div>
    </section>
  );
}

export default function Projects() {
  const [ref, inView] = useInView();
  const [rightRailMode, setRightRailMode] = useState("ghost");
  const isMobileStory = useIsMobileStory();
  const chapters = NODES.filter((n) => !BOOKEND_IDS.has(n.id));

  if (isMobileStory) {
    return <MobileStory chapters={chapters} />;
  }

  return (
    <section className="section" id="projects">
      <InkDefs />

      <RightRailToggle mode={rightRailMode} onChange={setRightRailMode} />

      <div className="section-header" ref={ref}>
        <p className={`section-eyebrow${inView ? " is-visible" : ""}`}>
          Problems I've solved
        </p>
        <h2 className={`section-heading${inView ? " is-visible" : ""}`}>
          A decade of workflows, one pattern
        </h2>
      </div>

      <div className="constellation-content">
        {chapters.map((node, index) => (
          <NodeCard
            key={node.id}
            node={node}
            index={index}
            total={chapters.length}
            rightRailMode={rightRailMode}
          />
        ))}
      </div>

      <div className="chapter-transition" aria-hidden="true" />
    </section>
  );
}
