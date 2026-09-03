import { Link } from "react-router-dom";
import "./ProjectsPage.css";

const MAJOR_PROJECTS = [
  {
    number: "01",
    name: "Recovery Community",
    type: "Stakeholder community platform",
    status: "Preparing for private beta · 2026",
    role: "Solution designer and full-stack developer",
    problem: "An established Facebook-based recovery community needed an owned, safer, and more intentional home for peer support and future growth.",
    built: "A React and Express platform covering membership admissions, role-based access, protected discussion, private messaging, notifications, moderation, media, analytics, owner administration, and a real-time Lounge.",
    outcome: "A working PostgreSQL-backed platform being hardened, tested, and prepared for real-user validation and a coordinated community migration.",
    tags: ["React", "Express", "PostgreSQL", "Socket.IO", "Authentication", "Product Design"],
    artifact: "recovery",
    links: [
      { label: "Client code", href: "https://github.com/emillerjones/recovery-community-client" },
      { label: "Server code", href: "https://github.com/emillerjones/recovery-community-server" },
    ],
  },
  {
    number: "02",
    name: "Records Operations Platform",
    type: "Internal operational product",
    status: "TCEQ · 2016—2023",
    role: "Technical Analyst and workflow developer",
    problem: "Document imaging, redaction, public-information, and records teams depended on manual steps and vendor tools that did not support the full operation.",
    built: "Access, VBA, SQL, and Oracle-connected applications layered around WebCenter Content to validate imports, route work, track productivity, and give staff a dependable operational view.",
    outcome: "Replaced vendor workflows and became the main daily system for 30–50 staff across multiple records functions.",
    tags: ["Microsoft Access", "VBA", "SQL", "Oracle", "ODBC", "Workflow Design"],
    artifact: "records",
    links: [],
  },
  {
    number: "03",
    name: "Horizon",
    type: "Independent product",
    status: "Live product · 2026",
    role: "Product owner and full-stack developer",
    problem: "Raid schedules were scattered across too many Discord servers, making it difficult to see what was happening across a community.",
    built: "A React calendar and live activity view backed by an Express API and PostgreSQL, with Discord imports, deployment, analytics, and a companion Chrome extension.",
    outcome: "Used by 30+ guilds to organize and track more than 500 raids.",
    tags: ["React", "Express", "PostgreSQL", "Discord API", "Chrome APIs"],
    artifact: "horizon",
    links: [
      { label: "Visit Horizon", href: "https://raidhelper-client.vercel.app/" },
      { label: "Install calendar extension", href: "https://chromewebstore.google.com/detail/horizon-raid-calendar/hpmdebjcifgnopndpbmeocgkllhklahd" },
      { label: "View code", href: "https://github.com/emillerjones/raidhelper-client" },
    ],
  },
];

const SUPPORTING_PROJECTS = [
  {
    number: "04",
    name: "Animation Lab",
    type: "AI-assisted R&D",
    result: "Procedural 3D environments, physics studies, particles, and rendering experiments used to develop stronger browser art direction.",
    tags: ["Three.js", "WebGPU", "Rapier", "React Three Fiber"],
    links: [
      { label: "Open Animation Lab", href: "https://animation-lab-eight.vercel.app/" },
    ],
  },
  {
    number: "05",
    name: "Focused Browser Tools",
    type: "Published Chrome extensions",
    result: "Small utilities for per-site volume memory and faster Discord raid-scheduling workflows.",
    tags: ["JavaScript", "Chrome APIs", "UX"],
    links: [
      { label: "View Volume Per Site", href: "https://chromewebstore.google.com/detail/volume-per-site/bjemkhlmiagaegjmmnjbgehammfaiamp" },
    ],
  },
  {
    number: "06",
    name: "LootLink",
    type: "Fullstack Academy capstone",
    result: "A four-person full-stack matchmaking and session-management product that helped establish the ideas later developed in Horizon.",
    tags: ["React", "Node.js", "PostgreSQL", "Team Development"],
    links: [],
  },
];

function ProjectArtifact({ type }) {
  if (type === "horizon") {
    return (
      <div className="project-artifact project-artifact--horizon" aria-label="Horizon system flow diagram">
        <span className="project-artifact__label">SYSTEM FLOW / LIVE PRODUCT</span>
        <div className="artifact-horizon__sources">
          <div><b>Discord</b><span>Raid events</span></div>
          <div><b>Extension</b><span>Import workflow</span></div>
        </div>
        <i className="artifact-flow-line" aria-hidden="true">↓</i>
        <div className="artifact-horizon__core"><span>Express API</span><b>Horizon</b><small>PostgreSQL</small></div>
        <i className="artifact-flow-line" aria-hidden="true">↓</i>
        <div className="artifact-horizon__outputs">
          <div>Calendar</div><div>Live radar</div><div>Guild activity</div>
        </div>
      </div>
    );
  }

  if (type === "recovery") {
    return (
      <div className="project-artifact project-artifact--recovery" aria-label="Recovery Community architecture diagram">
        <span className="project-artifact__label">COMMUNITY ARCHITECTURE / TRUST BOUNDARIES</span>
        <div className="artifact-recovery__entry">
          <div><b>Public site</b><span>Stories and resources</span></div>
          <i>→</i>
          <div><b>Admission</b><span>Identity and roles</span></div>
        </div>
        <i className="artifact-flow-line" aria-hidden="true">↓</i>
        <div className="artifact-recovery__core"><span>Protected community</span><b>React + Express + PostgreSQL</b></div>
        <div className="artifact-recovery__spaces">
          <div>Forum</div><div>Messages</div><div>Lounge</div>
          <div>Notifications</div><div>Moderation</div><div>Analytics</div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-artifact project-artifact--records" aria-label="Records operations workflow diagram">
      <span className="project-artifact__label">DAILY OPERATIONS / 30–50 STAFF</span>
      <div className="artifact-records__flow">
        <div><b>Intake</b><span>Documents</span></div><i>→</i>
        <div><b>Validate</b><span>Imports</span></div><i>→</i>
        <div><b>Route</b><span>Queues</span></div><i>→</i>
        <div><b>Track</b><span>Output</span></div>
      </div>
      <p>Access + VBA <span>connected to</span> Oracle + WebCenter Content</p>
    </div>
  );
}

function MajorProject({ project }) {
  return (
    <article className="major-project">
      <header className="major-project__rail">
        <span>{project.number}</span>
        <div><p>{project.type}</p><small>{project.status}</small></div>
      </header>

      <div className="major-project__content">
        <div className="major-project__heading">
          <h2>{project.name}</h2>
          <p><span>My role</span>{project.role}</p>
        </div>

        <ProjectArtifact type={project.artifact} />

        <div className="major-project__case">
          <div><span>Problem</span><p>{project.problem}</p></div>
          <div><span>What I built</span><p>{project.built}</p></div>
          <div className="major-project__outcome"><span>Outcome</span><p>{project.outcome}</p></div>
        </div>

        <div className="major-project__footer">
          <ul aria-label={`${project.name} technologies`}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          {project.links.length > 0 && (
            <nav aria-label={`${project.name} links`}>
              {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <span>↗</span></a>)}
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <section className="projects-page__intro">
        <p>Selected work · 2013—present</p>
        <h1>Real processes.<br />Better systems.</h1>
        <div>
          <p>Three projects that show how I work: understand the real process, build through the full system, and remain close enough to see whether the result actually helps.</p>
          <Link to="/mystory">For the career behind the work, read My Story <span>→</span></Link>
        </div>
      </section>

      <aside className="projects-page__principle">
        <span>How I work</span>
        <p>Stay close to the problem <i>→</i> understand the workflow <i>→</i> build the tool <i>→</i> learn from real use.</p>
      </aside>

      <section className="projects-page__major" aria-label="Major projects">
        {MAJOR_PROJECTS.map((project) => <MajorProject project={project} key={project.name} />)}
      </section>

      <section className="projects-page__supporting" aria-labelledby="supporting-projects-title">
        <header><span>Additional work</span><h2 id="supporting-projects-title">Experiments and focused tools</h2></header>
        <div>
          {SUPPORTING_PROJECTS.map((project) => (
            <article key={project.name}>
              <span>{project.number}</span>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
              <div>{project.result}</div>
              <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              {project.links.length > 0 && (
                <nav aria-label={`${project.name} links`}>
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label} <span>↗</span>
                    </a>
                  ))}
                </nav>
              )}
            </article>
          ))}
        </div>
      </section>

      <footer className="projects-page__footer">
        <div><p>Need the formal version?</p><h2>Start with the résumé.</h2></div>
        <a href="/resume.pdf" download>Download Résumé <span>↓</span></a>
      </footer>
    </main>
  );
}
