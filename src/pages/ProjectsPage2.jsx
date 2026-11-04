import { Link } from "react-router-dom";
import useHorizonSummary from "../hooks/useHorizonSummary";
import "./ProjectsPage2.css";

// Redesigned Projects page, shown at /projects2 for side-by-side review.
// Each project leads with a short "at a glance" block and the decisions
// that shaped it; the long case study is folded into a disclosure.

const PROJECTS = [
  {
    number: "01",
    name: "Recovery Community",
    type: "Stakeholder community platform",
    status: "Built with the community’s owner · 2026",
    media: "recovery",
    glance: [
      ["Role", "Solution designer and full-stack developer"],
      ["Worked with", "The community’s owner and staff"],
      ["Stack", "React · Express · PostgreSQL · Socket.IO · OpenAI moderation"],
    ],
    decisions: [
      ["AI flags, people decide.", "New Lounge messages are checked by OpenAI’s moderation model and queued for staff. Nothing is removed automatically."],
      ["The owner controls the AI.", "Checks stay off until the owner turns them on. The owner sets the cutoff for each of 13 categories, and every change is recorded with who made it."],
      ["Send as little as possible.", "Only the message text goes to the provider, with no name or account details, and saved results are deleted after 90 days."],
      ["Bring the history along.", "Facebook posts are imported under their original authors, with the importer recorded, so the community’s past moves with it."],
    ],
    result: "A complete platform shaped around how the community already works, being prepared for its move off Facebook.",
    caseStudy: [
      ["Problem", "An established Facebook recovery community wanted a home it owns: safer, moderated, and built around how its members actually support each other."],
      ["What I built", "Membership applications and admission, role-based access, a forum with polls and edit history, private messaging with photos, a real-time Lounge, notifications, staff chat and staff-only announcements, a moderation queue for member reports, and public pages the owner edits without a developer."],
      ["Moderation design", "AI checks run in a background queue that retries failures and recovers after crashes, so posting never waits on the AI. Staff see each flagged message with nearby context and choose to keep or delete it. A written runbook covers enabling, tuning, privacy, and rollback, and the feature has its own integration tests against an isolated database."],
      ["Account safety", "Server-side checks on every request for account status, role, ownership and conversation membership. Accounts are deactivated reversibly instead of deleted."],
    ],
    tags: ["React", "Express", "PostgreSQL", "Socket.IO", "OpenAI", "Product design"],
    links: [
      { label: "Visit the public site", href: "https://www.recoverywiththeexitdrug.org/" },
      { label: "Client code", href: "https://github.com/emillerjones/recovery-community-client" },
      { label: "Server code", href: "https://github.com/emillerjones/recovery-community-server" },
    ],
  },
  {
    number: "02",
    name: "Records Operations Platform",
    type: "Internal operational system",
    status: "TCEQ · 2016–2023",
    media: "records",
    glance: [
      ["Role", "PacoTech’s sole technical staff member on these systems"],
      ["Worked with", "TCEQ IT, the implementation vendor, and 30–50 operations staff"],
      ["Stack", "Access · VBA · SQL · Oracle · ODBC · WebCenter Content"],
    ],
    decisions: [
      ["One shared system.", "Imaging, public information, QC, redaction and records management each had their own tools. I brought them into one application while keeping each department’s requirements."],
      ["Validate at the door.", "I replaced purchased scanning software with automated imports that stopped incomplete work from moving forward."],
      ["Rehearse the migration.", "For the move to Oracle WebCenter Content, I mirrored the destination tables in staging and verified the transformed data with queries before the vendor’s final transfer."],
      ["Reuse what already works.", "A later redaction contract got a separate, improved application built on the proven parts of the original."],
    ],
    result: "The main daily application for 30–50 staff, and migration mapping and validation for 3,079,205 items.",
    caseStudy: [
      ["Problem", "Departments had their own software and workflows for imaging, public information, quality control, redaction, and records management. The operation needed those processes to work together, while preserving the requirements of each department."],
      ["What I built", "One centralized Access/VBA application connected to Oracle through ODBC. Automated imports, validation checks, work queues, dashboards, and reporting connected the work across departments."],
      ["Enterprise migration", "For the InSight-to-Oracle WebCenter Content migration, I developed the primary data map, mirrored destination tables in a staging environment, and wrote transformation queries to prepare data for the vendor’s final transfer. I designed test plans, coordinated staff testing, and verified results with database queries."],
      ["Separate DRR application", "A later Document Review and Redaction contract needed workflows for two departments. I reused the relevant parts of my original application and built an improved version tracking reviews, findings, errors, and staff productivity alongside WCC’s redaction module."],
    ],
    tags: ["Microsoft Access", "VBA", "SQL", "Oracle", "ODBC", "Workflow design"],
    links: [
      { label: "Employer case study: Migration", href: "https://www.pacotech.com/tceq-data-migration-to-oracle-webcenter-content/" },
      { label: "Employer case study: DRR", href: "https://www.pacotech.com/tceq-document-review-redaction/" },
    ],
  },
  {
    number: "03",
    name: "Horizon",
    type: "Independent product",
    status: "Live product · 2026",
    media: "horizon",
    live: true,
    glance: [
      ["Role", "Founder and full-stack developer"],
      ["Worked with", "Raid leaders and players across Discord communities"],
      ["Stack", "React · Express · PostgreSQL · Discord data · Chrome extension"],
    ],
    decisions: [
      ["Use what guilds already post.", "Horizon reads the raid posts guilds already make in Discord, so raid leaders don’t change how they work."],
      ["No account to see the schedule.", "Open a link and the calendar is there."],
      ["Read only raid posts.", "Nothing else from a server is collected."],
      ["One source, two views.", "The calendar and the live radar are fed by the same tracked posts, so they never disagree."],
    ],
    caseStudy: [
      ["Problem", "Raid schedules were scattered across many Discord servers, making it hard to see what was happening across a community."],
      ["What I built", "A React calendar and live radar backed by an Express API and PostgreSQL, with Discord imports, analytics, deployment, and a companion Chrome extension for importing Raid-Helper events."],
    ],
    tags: ["React", "Express", "PostgreSQL", "Discord", "Chrome APIs"],
    links: [
      { label: "Visit Horizon", href: "https://raidhelper-client.vercel.app/" },
      { label: "Install calendar extension", href: "https://chromewebstore.google.com/detail/horizon-raid-calendar/hpmdebjcifgnopndpbmeocgkllhklahd" },
      { label: "View code", href: "https://github.com/emillerjones/raidhelper-client" },
    ],
  },
];

const SUPPORTING = [
  {
    name: "Animation Lab",
    type: "AI-assisted R&D",
    result: "Procedural 3D environments, physics studies and rendering experiments. The orb field on this site’s home page came from here.",
    link: { label: "Open Animation Lab", href: "https://animation-lab-eight.vercel.app/" },
  },
  {
    name: "Volume Per Site",
    type: "Published Chrome extension",
    result: "Remembers a volume level per website and restores it in every tab, every time.",
    link: { label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/volume-per-site/bjemkhlmiagaegjmmnjbgehammfaiamp" },
  },
  {
    name: "LootLink",
    type: "Fullstack Academy capstone",
    result: "A four-person team project for finding teammates and organizing sessions, built with React, Node and PostgreSQL.",
  },
];

function RecoveryDiagram() {
  return (
    <div className="p2-diagram p2-diagram--recovery" role="img" aria-label="Recovery Community architecture: public site, admission, protected community spaces, and AI-assisted moderation with staff review">
      <span className="p2-diagram__label">Architecture · trust boundaries</span>
      <div className="p2-row">
        <div><b>Public site</b><small>Owner-edited pages</small></div><i>→</i>
        <div><b>Admission</b><small>Application · roles</small></div>
      </div>
      <i className="p2-down">↓</i>
      <div className="p2-core"><small>Members-only community</small><b>React · Express · PostgreSQL</b></div>
      <div className="p2-grid">
        <span>Forum</span><span>Messages</span><span>Lounge</span>
        <span>Notifications</span><span>Staff chat</span><span>Reports</span>
      </div>
      <div className="p2-ai">
        <span>Lounge message</span><i>→</i><span>AI check</span><i>→</i><span className="is-human">Staff decide</span>
      </div>
    </div>
  );
}

function RecordsDiagram() {
  return (
    <div className="p2-diagram p2-diagram--records" role="img" aria-label="Records workflow: intake, validate, route, track, connected to Oracle and WebCenter Content">
      <span className="p2-diagram__label">Daily operations · 30–50 staff</span>
      <div className="p2-flow">
        <div><b>Intake</b><small>Documents</small></div><i>→</i>
        <div><b>Validate</b><small>Imports</small></div><i>→</i>
        <div><b>Route</b><small>Queues</small></div><i>→</i>
        <div><b>Track</b><small>Output</small></div>
      </div>
      <p>Access + VBA <span>connected to</span> Oracle + WebCenter Content</p>
    </div>
  );
}

function HorizonShot() {
  return (
    <figure className="p2-shot">
      <img src="/projects/horizon-calendar.webp" width="1400" height="792" loading="lazy" alt="Horizon's live calendar: a week of raids from many Discord guilds, with a guild list on the left and raid counts by type across the top." />
      <figcaption>Horizon’s live calendar, captured November 4, 2026.</figcaption>
    </figure>
  );
}

function LiveCounts({ summary }) {
  const plus = summary.live ? "" : "+";
  return (
    <ul className="p2-live" aria-label="Horizon usage">
      {summary.live && <li className="p2-live__badge"><i aria-hidden="true" />Live</li>}
      <li><b>{summary.raids.toLocaleString()}{plus}</b> raids tracked</li>
      <li><b>{summary.guilds}{plus}</b> guilds</li>
      {summary.live && summary.upcomingWeek > 0 && <li><b>{summary.upcomingWeek}</b> this week</li>}
    </ul>
  );
}

function Project({ project, summary }) {
  return (
    <article className="p2-project" aria-labelledby={`p2-${project.number}`}>
      <header className="p2-project__head">
        <span className="p2-project__number">{project.number}</span>
        <div>
          <p className="p2-project__type">{project.type} <span>· {project.status}</span></p>
          <h2 id={`p2-${project.number}`}>{project.name}</h2>
        </div>
      </header>

      <div className="p2-project__body">
        <div className="p2-project__media">
          {project.media === "horizon" && <HorizonShot />}
          {project.media === "recovery" && <RecoveryDiagram />}
          {project.media === "records" && <RecordsDiagram />}
        </div>

        <div className="p2-project__text">
          <dl className="p2-glance">
            {project.glance.map(([term, value]) => (
              <div key={term}><dt>{term}</dt><dd>{value}</dd></div>
            ))}
          </dl>

          <h3 className="p2-section-label">Key decisions</h3>
          <ul className="p2-decisions">
            {project.decisions.map(([decision, why]) => (
              <li key={decision}><b>{decision}</b> {why}</li>
            ))}
          </ul>

          {project.live
            ? <LiveCounts summary={summary} />
            : <p className="p2-result">{project.result}</p>}

          <details className="p2-case">
            <summary>Read the full case study</summary>
            {project.caseStudy.map(([label, text]) => (
              <div key={label}><h4>{label}</h4><p>{text}</p></div>
            ))}
            <ul className="p2-tags" aria-label={`${project.name} technologies`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </details>

          <nav className="p2-links" aria-label={`${project.name} links`}>
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>
            ))}
          </nav>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage2() {
  const summary = useHorizonSummary();

  return (
    <main className="p2">
      <p className="p2-preview">
        Preview of a redesigned Projects page. <Link to="/projects">Compare with the current one →</Link>
      </p>

      <section className="p2-intro">
        <p className="p2-eyebrow">Selected work · 2013–present</p>
        <h1>Real processes.<br />Better systems.</h1>
        <p className="p2-lede">Three systems, each built by first understanding how the work actually moves. Every project starts with the decisions that shaped it; the full case study is one tap away.</p>
      </section>

      <section className="p2-projects" aria-label="Major projects">
        {PROJECTS.map((project) => <Project key={project.number} project={project} summary={summary} />)}
      </section>

      <section className="p2-supporting" aria-labelledby="p2-supporting-title">
        <h2 id="p2-supporting-title">Smaller tools and experiments</h2>
        <div>
          {SUPPORTING.map((item) => (
            <article key={item.name}>
              <p className="p2-project__type">{item.type}</p>
              <h3>{item.name}</h3>
              <p>{item.result}</p>
              {item.link && <a href={item.link.href} target="_blank" rel="noreferrer">{item.link.label} <span aria-hidden="true">↗</span></a>}
            </article>
          ))}
        </div>
      </section>

      <footer className="p2-footer">
        <div><p className="p2-eyebrow">Need the formal version?</p><h2>Start with the résumé.</h2></div>
        <a href="/resume.pdf" download>Download résumé <span aria-hidden="true">↓</span></a>
      </footer>
    </main>
  );
}
