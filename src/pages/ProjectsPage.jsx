import { Link } from "react-router-dom";
import useHorizonSummary from "../hooks/useHorizonSummary";
import useInViewOnce from "../hooks/useInViewOnce";
import "./ProjectsPage.css";

// Selected projects and the decisions behind their implementation.
// Lead with the problem and result, then show the decisions behind the work.

const PROJECTS = [
  {
    number: "01",
    name: "Recovery Community",
    type: "Stakeholder community platform",
    status: "Preparing for private beta · 2026",
    problem: "An established Facebook-based recovery community needed a home it could own—built around peer support, member privacy, and the staff’s work of running the community.",
    media: "recovery",
    glance: [
      ["Role", "Solution designer and full-stack developer"],
      ["Worked with", "The community’s owner and staff"],
      ["Stack", "React · Express · PostgreSQL · Socket.IO"],
    ],
    decisions: [
      ["Protecting different kinds of spaces.", "Public pages, member discussions, private conversations, and staff spaces need different access rules. I enforced those boundaries on the server and in real-time connections, so hiding a link is never the only protection."],
      ["Giving staff a workable moderation process.", "Member reports, review queues, and staff-only spaces support human oversight; optional AI flagging helps surface Lounge messages for staff to assess."],
      ["Keeping routine changes out of the codebase.", "Administration screens let the owner edit public content and manage community settings directly, without requesting code changes."],
    ],
    result: "A working community platform with member admissions, protected spaces, human moderation, and owner administration. Preparing for private beta and real-user validation.",
    caseStudy: [
      ["What I built", "Membership applications and admission, role-based access, a forum with polls and edit history, private messaging with photos, a real-time Lounge, notifications, staff chat and staff-only announcements, a moderation queue for member reports, and public pages the owner edits without a developer."],
      ["Human moderation and optional AI assistance", "Members can report content for staff review. Staff use moderation queues and private working spaces to manage the community. Optional Lounge AI checks run in a background queue with retries and crash recovery, so posting does not wait on the provider. Flagged messages include nearby context for staff to assess. The owner controls the AI settings; changes to thresholds and review modes are recorded with who made them."],
      ["Account safety", "Server-side checks on every request for account status, role, ownership and conversation membership. Accounts are deactivated reversibly instead of deleted."],
    ],
    tags: ["React", "Express", "PostgreSQL", "Socket.IO", "OpenAI moderation", "Product design"],
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
    problem: "Departments relied on separate tools for imaging, public information, quality control, redaction, and records management. Their work needed to connect without losing each department’s requirements.",
    media: "records",
    glance: [
      ["Role", "PacoTech’s sole technical staff member on these systems"],
      ["Worked with", "TCEQ IT, the implementation vendor, and 30–50 operations staff"],
      ["Stack", "Access · VBA · SQL · Oracle · ODBC · WebCenter Content"],
    ],
    decisions: [
      ["Connecting departments without flattening their work.", "I brought departmental workflows into one Access/VBA application connected to Oracle, while retaining the steps each team needed."],
      ["Catching incomplete work before it moved forward.", "An upload was not enough to prove processing was finished. I replaced purchased scanning software with automated imports and validation checks that kept incomplete work from advancing."],
      ["Verifying migration data before the final transfer.", "The source data had to fit a different system. I mapped it into staging tables that mirrored the destination, wrote transformation queries, coordinated staff testing, and checked results before the vendor’s transfer."],
    ],
    result: "The shared application became the main daily tool for 30–50 staff. Separately, I developed migration mapping and validation for a project covering 3,079,205 inventory items.",
    caseStudy: [
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
    problem: "Players had to check multiple Discord servers to find raids. Raid leaders already had a scheduling workflow, so a shared view needed to work with it.",
    result: "A deployed calendar and live radar that bring tracked Raid-Helper events into one place, with a companion extension for importing events.",
    media: "horizon",
    live: true,
    glance: [
      ["Role", "Founder and full-stack developer"],
      ["Worked with", "Raid leaders and players across Discord communities"],
      ["Stack", "React · Express · PostgreSQL · Discord data · Chrome extension"],
    ],
    decisions: [
      ["Working with the scheduling habit already in place.", "Asking every guild to adopt another calendar would add work. I built around existing Raid-Helper events and a companion import extension, bringing schedules together without replacing how leaders create them."],
      ["Making the schedule easy to reach.", "The calendar can be opened from a shared link without creating a Horizon account."],
      ["Handling repeat imports without duplicate events.", "The same event can be imported again as its details change. The database uses the source event ID to update the existing record rather than create another copy."],
    ],
    caseStudy: [
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
    result: "A four-person full-stack capstone for finding teammates and organising sessions. Ideas from this project later developed into Horizon.",
  },
];

// Diagrams illuminate once when they enter the viewport.
function useDiagramFlow() {
  const [ref, seen] = useInViewOnce();
  return [ref, ` is-flow${seen ? " is-flowing" : ""}`];
}

function RecoveryDiagram() {
  const [ref, flowClass] = useDiagramFlow();
  return (
    <div ref={ref} className={`selected-work-diagram selected-work-diagram--recovery${flowClass}`} role="img" aria-label="Recovery Community architecture: public site, admission, protected member spaces, and human moderation supported by reports and optional AI flags">
      <span className="selected-work-diagram__label">Architecture · trust boundaries</span>
      <div className="selected-work-row">
        <div><b>Public site</b><small>Owner-edited pages</small></div><i>→</i>
        <div><b>Admission</b><small>Application · roles</small></div>
      </div>
      <i className="selected-work-down">↓</i>
      <div className="selected-work-core"><small>Members-only community</small><b>React · Express · PostgreSQL</b></div>
      <div className="selected-work-grid">
        <span>Forum</span><span>Messages</span><span>Lounge</span>
        <span>Notifications</span><span>Staff chat</span><span>Reports</span>
      </div>
      <div className="selected-work-moderation">
        <div><span>Member reports</span><span>Optional AI flags</span></div><i>→</i><span className="is-human">Staff review</span>
      </div>
    </div>
  );
}

function RecordsDiagram() {
  const [ref, flowClass] = useDiagramFlow();
  return (
    <div ref={ref} className={`selected-work-diagram selected-work-diagram--records${flowClass}`} role="img" aria-label="Records workflow: intake, validate, route, track, connected to Oracle and WebCenter Content">
      <span className="selected-work-diagram__label">Daily operations · 30–50 staff</span>
      <div className="selected-work-flow">
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
    <figure className="selected-work-shot">
      <img src="/projects/horizon-calendar.webp" width="1400" height="792" loading="lazy" alt="Horizon's live calendar: a week of raids from many Discord guilds, with a guild list on the left and raid counts by type across the top." />
      <figcaption>Horizon’s live calendar, captured November 4, 2026.</figcaption>
    </figure>
  );
}

function LiveCounts({ summary }) {
  const plus = summary.live ? "" : "+";
  return (
    <ul className="selected-work-live" aria-label="Horizon usage">
      {summary.live && <li className="selected-work-live__badge"><i aria-hidden="true" />Live</li>}
      <li><b>{summary.raids.toLocaleString()}{plus}</b> raids tracked</li>
      <li><b>{summary.guilds}{plus}</b> guilds</li>
      {summary.live && summary.upcomingWeek > 0 && <li><b>{summary.upcomingWeek}</b> this week</li>}
    </ul>
  );
}

function Project({ project, summary }) {
  return (
    <article className="selected-work-project" aria-labelledby={`selected-work-${project.number}`}>
      <header className="selected-work-project__head">
        <span className="selected-work-project__number">{project.number}</span>
        <div>
          <p className="selected-work-project__type">{project.type} <span>· {project.status}</span></p>
          <h2 id={`selected-work-${project.number}`}>{project.name}</h2>
        </div>
      </header>

      <div className="selected-work-summary">
        <div><h3>The problem</h3><p>{project.problem}</p></div>
        <div className="selected-work-summary__outcome"><h3>{project.live ? "In use" : project.media === "records" ? "Result" : "Result & status"}</h3><p>{project.result}</p>{project.live && <LiveCounts summary={summary} />}</div>
      </div>

      <div className="selected-work-project__body">
        <div className="selected-work-project__media">
          {project.media === "horizon" && <HorizonShot />}
          {project.media === "recovery" && <RecoveryDiagram />}
          {project.media === "records" && <RecordsDiagram />}
        </div>

        <div className="selected-work-project__text">
          <dl className="selected-work-glance">
            {project.glance.map(([term, value]) => (
              <div key={term}><dt>{term}</dt><dd>{value}</dd></div>
            ))}
          </dl>

          <h3 className="selected-work-section-label">Challenges &amp; decisions</h3>
          <ol className="selected-work-decisions">
            {project.decisions.map(([decision, why], index) => (
              <li key={decision}><span className="selected-work-decision-number" aria-hidden="true">0{index + 1}</span><div><h4>{decision}</h4><p>{why}</p></div></li>
            ))}
          </ol>

          <details className="selected-work-case">
            <summary>Read the technical detail</summary>
            {project.caseStudy.map(([label, text]) => (
              <div key={label}><h4>{label}</h4><p>{text}</p></div>
            ))}
            <ul className="selected-work-tags" aria-label={`${project.name} technologies`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </details>

          <nav className="selected-work-links" aria-label={`${project.name} links`}>
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>
            ))}
          </nav>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const summary = useHorizonSummary();

  return (
    <main className="selected-work">
      <section className="selected-work-intro">
        <p className="selected-work-eyebrow">Selected work · 2013–present</p>
        <h1>Real processes.<br />Better systems.</h1>
        <p className="selected-work-lede">Three systems built around the people doing the work: understanding the process, building across the full stack, and staying close enough to see whether the result helps.</p>
        <Link className="selected-work-story-link" to="/mystory">For the career behind the work, read My Story <span aria-hidden="true">→</span></Link>
      </section>

      <section className="selected-work-projects" aria-label="Major projects">
        {PROJECTS.map((project) => <Project key={project.number} project={project} summary={summary} />)}
      </section>

      <section className="selected-work-supporting" aria-labelledby="selected-work-supporting-title">
        <h2 id="selected-work-supporting-title">Smaller tools and experiments</h2>
        <div>
          {SUPPORTING.map((item) => (
            <article key={item.name}>
              <p className="selected-work-project__type">{item.type}</p>
              <h3>{item.name}</h3>
              <p>{item.result}</p>
              {item.link && <a href={item.link.href} target="_blank" rel="noreferrer">{item.link.label} <span aria-hidden="true">↗</span></a>}
            </article>
          ))}
        </div>
      </section>

      <footer className="selected-work-footer">
        <div><p className="selected-work-eyebrow">Need the formal version?</p><h2>Start with the résumé.</h2></div>
        <a href="/resume.pdf" download>Download résumé <span aria-hidden="true">↓</span></a>
      </footer>
    </main>
  );
}
