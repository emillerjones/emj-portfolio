import { useInView } from "../hooks/useInView";
import { SKILLS } from "../data/portfolioData";

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section className="section about-section" id="contact">
      <div className="about-inner" ref={ref}>
        <p className={`section-eyebrow${inView ? " is-visible" : ""}`}>The story so far</p>
        <h2 className={`about-heading${inView ? " is-visible" : ""}`}>
          Ten years, one thread, still being written.
        </h2>
        <div className={`about-body${inView ? " is-visible" : ""}`}>
          <p>
            That decade in technical roles &mdash; building internal tools with
            Access and Oracle, managing enterprise document workflows, implementing
            SaaS solutions for healthcare clients &mdash; is why I approach development
            the way I do. I know what it's like to be the person who has to
            <em> use</em> the software, not just ship it.
          </p>
          <p>
            I think about edge cases because I've hit them. I care about
            documentation because I've been the one reading it at 11pm.
          </p>
          <p>
            If you've read this far, you've seen the whole map. I'm looking for
            the next problem worth solving &mdash; and I'd like to hear about yours.
          </p>
        </div>

        <div className="about-skills">
          <p className="about-skills-label">Tools I reach for</p>
          <div className="about-skills-list">
            {SKILLS.map((s) => (
              <span key={s.name} className="tag">{s.name}</span>
            ))}
          </div>
        </div>

        <div className="about-cta-row">
          <a href="/resume.pdf" download className="btn btn--primary">Download Resume &darr;</a>
          <a href="mailto:emj.studioworks@gmail.com" className="btn btn--ghost">Let's talk &rarr;</a>
        </div>

        <div className="about-contact">
          <div className="footer-links">
            <a href="mailto:emj.studioworks@gmail.com">emj.studioworks@gmail.com</a>
            <a href="https://www.linkedin.com/in/evan-miller-jones-30762a28/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/emillerjones" target="_blank" rel="noreferrer">GitHub</a>
            <p className="footer-copy">&copy; 2026 EMJ &middot; Texas, USA</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
