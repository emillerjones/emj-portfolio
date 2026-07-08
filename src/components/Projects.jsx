import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { NODES } from "../data/portfolioData";
import "./Projects.css";

function NodeCard({ node, index, total }) {
  const [ref, inView] = useInView();

  return (
    <article
      ref={ref}
      id={node.id}
      className={`node-card ${inView ? "is-visible" : ""}`}
    >
      <p className="node-chapter">
        Chapter {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <p className="node-problem">{node.problem}</p>
      <h3 className="node-title">{node.title}</h3>
      <p className="node-meta">
        {node.org} &middot; {node.period}
      </p>
      <p className="node-desc">{node.desc}</p>

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
        <p className="mobile-chapter__meta">
          {node.org} &middot; {node.period}
        </p>
        <p className="mobile-chapter__desc">{node.desc}</p>

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
    setOpenId(open ? id : null);
  };

  return (
    <section className="mobile-story" id="projects" aria-label="Story chapters">
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
  const isMobileStory = useIsMobileStory();
  const chapters = NODES.filter((n) => !BOOKEND_IDS.has(n.id));

  if (isMobileStory) {
    return <MobileStory chapters={chapters} />;
  }

  return (
    <section className="section" id="projects">
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
          <NodeCard key={node.id} node={node} index={index} total={chapters.length} />
        ))}
      </div>

      <div className="chapter-transition" aria-hidden="true" />
    </section>
  );
}
