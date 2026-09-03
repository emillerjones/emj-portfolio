import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./StoryPage2.css";

const CHAPTERS = [
  {
    number: "Chapter Three",
    period: "2017 — 2023",
    title: "I got the title for the work I was already doing.",
    org: "TCEQ · Technical Analyst",
    body: [
      "After the migration, I laid out the responsibilities I had taken on and compared them with the Technical Analyst job description. The company agreed that my role should match the work and promoted me. It was a promotion I had helped make happen by doing the work first, documenting the evidence, and advocating for the recognition I had earned.",
      "Technical improvement became my formal, full-time focus for the next six years. I supported WebCenter Content and improved the operation one area at a time, building Access, VBA, SQL, and Oracle-connected tools that replaced vendor software and workflows, validated imports, routed work, tracked productivity, and became the main daily system for 30–50 staff across imaging, redaction, public information, and records management.",
    ],
    quote: "One area at a time, I built a better version of what we had been given.",
    note: { label: "Daily reach", before: "Built for ", strong: "30–50 staff", after: " across the records operation." },
  },
  {
    number: "Chapter Four",
    period: "2023 — 2025",
    title: "I learned to see the whole stack.",
    org: "AppointmentWave · Tejas HMA",
    body: [
      "Healthcare introduced me to Visual Studio, SQL Server Management Studio, Blazor, Azure, Twilio, and the layers of a modern web application. My responsibilities began with individual tickets and gradually expanded. By my final project, the assignment was much broader: get AppointmentWave into a shippable state.",
      "I was the sole human developer implementing the required changes. The two largest were restructuring campaign data into a parent-child model and rebuilding how user responses were tracked across voice, SMS, email, replies, and keypresses. Both were full-stack changes, moving from the interface through the API, integrations, and database, then back to the interface.",
      "This was also my first time using AI for development. ChatGPT helped me interpret an unfamiliar codebase and understand application layers that had not existed in my Access environment. Over time, I could trace a message end to end, diagnose where delivery failed, and implement features we had discussed. I leaned heavily on AI, while remaining responsible for understanding how the system fit together and getting the work ready to ship.",
    ],
    quote: "I could finally trace the whole system, not just the screen in front of me.",
    note: { label: "Unified", before: "Response history across ", strong: "5 channels", after: ": voice, SMS, email, reply, and keypress." },
  },
  {
    number: "Chapter Five",
    period: "2026 — present",
    title: "I strengthened the foundation. The leverage grew.",
    org: "Fullstack Academy · Independent product work",
    body: [
      "When the AppointmentWave engagement ended, I enrolled in Fullstack Academy's software-engineering program. I expected stronger fundamentals might make AI less necessary. The program strengthened my understanding of JavaScript and full-stack systems. Afterward, I began working with Codex, which expanded the scale and complexity of work I could take on. AI did not recede; I became better equipped to use it.",
      "Since boot camp, I have built Recovery Community, Horizon, this portfolio, Animation Lab, and focused browser extensions. Recovery Community is a stakeholder-led, full-stack platform with membership admissions, authenticated forums, messaging, moderation, notifications, and a real-time community Lounge. Horizon is a deployed React, Express, PostgreSQL, and Discord product used by 30+ guilds to organize more than 500 raids.",
      "Today I work as an AI-augmented developer. AI accelerates implementation and gives me more room to focus on architecture, product behavior, usability, and creative decisions. I remain responsible for understanding the system, inspecting the implementation, testing the behavior, explaining the decisions, and what ultimately ships—while continuing to strengthen my independent skills.",
    ],
    quote: "I build with leverage. I remain accountable for the result.",
    note: { label: "In active use", before: "Horizon serves ", strong: "30+ guilds", after: " and has tracked 500+ raids." },
    links: [
      { label: "View projects", to: "/projects" },
      { label: "Visit Horizon", href: "https://raidhelper-client.vercel.app/" },
    ],
  },
];

// Two independent "ink" fills let the ruled line break around the migration.
// Chapter Two is still numbered, but its different layout marks the moment
// when the career changed direction instead of treating it like another job.
function useSpineFill(sectionRef, fillRef) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      const section = sectionRef.current;
      const fill = fillRef.current;
      if (!section || !fill) return;
      const rect = section.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.5;
      const passed = Math.min(section.offsetHeight, Math.max(0, viewportMid - rect.top));
      fill.style.height = `${passed}px`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef, fillRef]);
}

function Note({ note }) {
  return (
    <div className="story2-note">
      <span className="story2-note__label">{note.label}</span>
      <p>{note.before}<b>{note.strong}</b>{note.after}</p>
    </div>
  );
}

function ChapterLink({ link }) {
  if (link.to) {
    return <Link className="story2-chapter__link" to={link.to}>{link.label} <span>→</span></Link>;
  }
  return (
    <a className="story2-chapter__link" href={link.href} target="_blank" rel="noreferrer">
      {link.label} <span>↗</span>
    </a>
  );
}

export default function StoryPage2() {
  const ledgerTopRef = useRef(null);
  const spineTopFillRef = useRef(null);
  const ledgerBottomRef = useRef(null);
  const spineBottomFillRef = useRef(null);

  useSpineFill(ledgerTopRef, spineTopFillRef);
  useSpineFill(ledgerBottomRef, spineBottomFillRef);

  return (
    <main className="story2">
      <header className="story2-hero">
        <div className="story2-hero__intro">
          <span className="story2-hero__eyebrow">Working history · 2013—present</span>
          <h1>I learned software <em>from the work</em> outward.</h1>
          <p>
            I didn&apos;t begin with a framework. I began by watching people lose time to systems that
            didn&apos;t fit how they actually worked — and I&apos;ve spent every chapter since trying to
            close that gap.
          </p>
        </div>
        <aside className="story2-hero__card" aria-label="Profile summary">
          <span>Profile</span>
          <dl>
            <div><dt>Based in</dt><dd>Austin, Texas</dd></div>
            <div><dt>Focus</dt><dd>Solutions and systems</dd></div>
            <div><dt>Approach</dt><dd>Practical, human, shipped</dd></div>
          </dl>
        </aside>
      </header>

      <div className="story2-ledger" ref={ledgerTopRef}>
        <div className="story2-spine" aria-hidden="true">
          <div className="story2-spine__fill" ref={spineTopFillRef} />
        </div>
        <div className="story2-ledger__content">
          <article className="story2-chapter">
            <div className="story2-chapter__row">
              <div>
                <div className="story2-chapter__head">
                  <span className="story2-chapter__index">Chapter One</span>
                  <span className="story2-chapter__period">2013 — 2015</span>
                </div>
                <h2>I learned the work from both sides.</h2>
                <p className="story2-chapter__org">TCEQ · Records &amp; Document Imaging</p>
                <p>
                  I joined TCEQ&apos;s records operation as a clerk in 2013, working with paper files,
                  scanned documents, public-information requests, and the software that kept
                  everything moving. I advanced to team lead and then assistant supervisor,
                  learning the same tools first as the person using them and later as the manager
                  responsible for the process.
                </p>
                <p>
                  Seeing the work from both perspectives changed what interested me. I became
                  increasingly drawn to the tools themselves—how information moved, where the
                  systems slowed people down, and how better software could improve the work for
                  everyone using it.
                </p>
              </div>
              <div className="story2-ladder" aria-label="Title history, 2013 to 2016">
                <span className="story2-ladder__label">Title, 2013–2016</span>
                <div className="story2-ladder__item">
                  <span className="story2-ladder__year">&apos;13</span>
                  <span className="story2-ladder__title">Clerk</span>
                </div>
                <div className="story2-ladder__item">
                  <span className="story2-ladder__year">&nbsp;</span>
                  <span className="story2-ladder__title">Team Lead</span>
                </div>
                <div className="story2-ladder__item story2-ladder__item--current">
                  <span className="story2-ladder__year">&nbsp;</span>
                  <span className="story2-ladder__title">Assistant Supervisor</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <section className="story2-interstitial">
        <div className="story2-interstitial__inner">
          <span className="story2-interstitial__eyebrow">Chapter Two · Records Analyst · 2016</span>
          <h2>I chose the system over management.</h2>
          <p className="story2-interstitial__sub">
            Moving into the Records Analyst role was both a promotion and a deliberate technical
            pivot. It gave me room to move from ideas to implementation—working directly with
            Access, SQL, queries, and the tables behind our screens. The role lasted roughly a year
            and was dominated by one enormous project: TCEQ&apos;s agency-wide migration from InSight
            to Oracle WebCenter Content.
          </p>

          <div className="story2-system-map" aria-label="TCEQ, the vendor, and the contractor team working around WebCenter Content">
            <svg viewBox="0 0 520 270" fill="none" aria-hidden="true">
              <line x1="260" y1="51" x2="260" y2="102" />
              <line x1="100" y1="218" x2="218" y2="160" />
              <line x1="420" y1="218" x2="302" y2="160" />
            </svg>
            <div className="story2-system-map__node story2-system-map__node--agency"><b>TCEQ</b><span>Owner</span></div>
            <div className="story2-system-map__node story2-system-map__node--contractor"><b>Contractor team</b><span>Daily operation</span></div>
            <div className="story2-system-map__node story2-system-map__node--vendor"><b>Vendor</b><span>Build and customization</span></div>
            <div className="story2-system-map__product"><span>Shared product</span><b>WebCenter<br />Content</b></div>
          </div>

          <p className="story2-interstitial__body">
            By then, I was our subject-matter expert on InSight. I understood how records were
            defined, where the data lived, how parent-child classifications worked, and how actions
            on screen changed the tables underneath. For the migration, I learned WebCenter
            Content&apos;s very different structure, developed the primary data map, built a staging
            environment that mirrored its tables, and wrote the queries that transformed our
            existing data for the vendor&apos;s final transfer.
          </p>
          <p className="story2-interstitial__body">
            I also translated between the agency, the vendor, and the people doing the daily work.
            I designed test plans, coordinated staff testing, and used database queries to verify
            the results. After close to a year, we turned the key: InSight went away and WebCenter
            Content took its place.
          </p>

          <p className="story2-interstitial__climax">
            I had spent the year doing technical work. Next, I made the case that my role should
            finally reflect it.
          </p>
        </div>
      </section>

      <div className="story2-ledger" ref={ledgerBottomRef}>
        <div className="story2-spine" aria-hidden="true">
          <div className="story2-spine__fill" ref={spineBottomFillRef} />
        </div>
        <div className="story2-ledger__content">
          {CHAPTERS.map((chapter) => (
            <article className="story2-chapter" key={chapter.number}>
              <div className="story2-chapter__row">
                <div>
                  <div className="story2-chapter__head">
                    <span className="story2-chapter__index">{chapter.number}</span>
                    <span className="story2-chapter__period">{chapter.period}</span>
                  </div>
                  <h2>{chapter.title}</h2>
                  <p className="story2-chapter__org">{chapter.org}</p>
                  {chapter.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  <blockquote>{chapter.quote}</blockquote>
                  {chapter.links && (
                    <nav className="story2-chapter__links" aria-label={`${chapter.number} related links`}>
                      {chapter.links.map((link) => <ChapterLink link={link} key={link.label} />)}
                    </nav>
                  )}
                </div>
                {chapter.note && <Note note={chapter.note} />}
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="story2-closing">
        <div>
          <span className="story2-closing__eyebrow">What I&apos;m looking for</span>
          <h2>Work worth understanding before it&apos;s built.</h2>
          <p>
            A team where I can keep growing while bringing the judgment I&apos;ve earned from years
            spent close to real workflows and real users.
          </p>
        </div>
        <nav aria-label="Next steps">
          <Link to="/projects">View selected projects <span>→</span></Link>
          <a href="mailto:evan.millerjones@gmail.com">Start a conversation <span>→</span></a>
        </nav>
      </footer>
    </main>
  );
}
