import { useInView } from "../hooks/useInView";
import { EXPERIENCE, SKILLS } from "../data/portfolioData";

function SkillBar({ name, pct, delay }) {
  const [ref, inView] = useInView();

  return (
    <div className="skill-row" ref={ref}>
      <div className="skill-meta">
        <span className="skill-name">{name}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            width: inView ? `${pct}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Experience() {
  const [ref, inView] = useInView();

  return (
    <section className="section section--alt" id="experience">
      <div className="two-col">

        {/* ── Timeline ── */}
        <div>
          <div ref={ref}>
            <p className={`section-eyebrow${inView ? " is-visible" : ""}`}>Career</p>
            <h2 className={`section-heading${inView ? " is-visible" : ""}`}>Where I've been</h2>
          </div>
          <div className="timeline">
            {EXPERIENCE.map((e, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-body">
                  <div className="timeline-meta">
                    <span className="timeline-type">{e.type}</span>
                    <span className="timeline-period">{e.period}</span>
                  </div>
                  <p className="timeline-role">{e.role}</p>
                  <p className="timeline-company">{e.company}</p>
                  <p className="timeline-desc">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills ── */}
        <div>
          <p className="section-eyebrow is-visible">Skills</p>
          <h2 className="section-heading is-visible">What I work with</h2>
          <div className="skills-list">
            {SKILLS.map((s, i) => (
              <SkillBar key={s.name} name={s.name} pct={s.pct} delay={i * 60} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
