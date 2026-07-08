import { useInView } from "../hooks/useInView";
import { NODES } from "../data/portfolioData";
import "./Projects.css";

function NodeCard({ node }) {
  const [ref, inView] = useInView();

  return (
    <article
      ref={ref}
      id={node.id}
      className={`node-card ${inView ? "is-visible" : ""}`}
    >
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

export default function Projects() {
  const [ref, inView] = useInView();
  const chapters = NODES.filter((n) => !BOOKEND_IDS.has(n.id));

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
        {chapters.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
}
