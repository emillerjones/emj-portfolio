import { useInView } from "../hooks/useInView";

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section className="section about-section" id="contact">
      <div className="about-inner" ref={ref}>
        <p className={`section-eyebrow${inView ? " is-visible" : ""}`}>What's next</p>
        <h2 className={`about-heading${inView ? " is-visible" : ""}`}>
          The Next Chapter
        </h2>
        <div className={`about-body${inView ? " is-visible" : ""}`}>
          <p>
            Thank you... for listening to my story.
          </p>
          <p>
            Every success built confidence. Every setback built perspective. 
            Every lesson earned became another thread woven into the story you've just read.
          </p>
          <p>
            Across every chapter, one way of working kept repeating: stay close to the real process,
            notice where people lose time or context, understand the surrounding workflow, and build the better system.
          </p>
          <p className="about-thesis">            
            There has to be a better way.
          </p>
          <p>
            Not simply a better way to write software, but a better way to solve the problem in front of us.
          </p>
          <p>
            That belief continues to shape every tool I build. Ship it, watch people use it,
            and keep improving it until the software fits the work—not the other way around.
          </p>
          <p>
            But the story doesn't end here, the next chapter is ours to write together.
          </p>
          <p>
            I'd love to hear from you.
          </p>
        </div>

        {/* <div className="about-skills">
          <p className="about-skills-label">Tools I bring with me</p>
          <div className="about-skills-list">
            {SKILLS.map((s) => (
              <span key={s.name} className="tag">{s.name}</span>
            ))}
          </div>
        </div> */}

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
