import { Link } from "react-router-dom";
import "./ProjectsPage.css";

const PROJECTS = [
  {
    number: "01",
    name: "Horizon",
    type: "Independent SaaS",
    status: "Live product · 2026",
    problem: "Raid schedules were scattered across too many Discord servers.",
    result: "A full-stack calendar now tracking 28 guilds and more than 500 raids.",
    detail: "React frontend, Express API, PostgreSQL, Discord integrations, deployment, and a companion Chrome extension—owned from the first problem through production feedback.",
    tags: ["React", "Express", "PostgreSQL", "Discord API"],
    links: [
      { label: "Visit Horizon", href: "https://raidhelper-client.vercel.app/" },
      { label: "View code", href: "https://github.com/emillerjones/raidhelper-client" },
    ],
  },
  {
    number: "02",
    name: "Wellness Recovery Community",
    type: "Nonprofit platform",
    status: "In development · 2026",
    problem: "People in recovery need a safer, clearer way to find support and one another.",
    result: "A responsive public foundation for resources, stories, and future authenticated community spaces.",
    detail: "The product direction prioritizes trust, accessibility, mobile usability, and a calm interface over conventional marketing pressure.",
    tags: ["React", "Vite", "Product Design", "Accessibility"],
    links: [],
  },
  {
    number: "03",
    name: "Enterprise Records Workflow System",
    type: "Internal operational product",
    status: "TCEQ · 2016—2023",
    problem: "Document imaging, redaction, public-information, and records work depended on manual steps and vendor software that could not support the full operation.",
    result: "A daily workflow product supporting 30–50 staff across multiple records-management functions.",
    detail: "Designed and maintained in Microsoft Access with VBA and SQL, using a read-only ODBC connection to an Oracle database. The system coordinated work queues, validated imports, tracked productivity, and gave staff a reliable view of where work needed to go next.",
    tags: ["Microsoft Access", "VBA", "SQL", "Oracle", "ODBC", "Workflow Design"],
    links: [],
    featured: true,
  },
  {
    number: "04",
    name: "Animation Lab",
    type: "AI-assisted R&D",
    status: "Experimental · 2026",
    problem: "How far can code-only browser animation go when visual direction is treated as an iterative system?",
    result: "A curated collection of procedural 3D environments, physics studies, particles, and interactive rendering experiments.",
    detail: "Built through repeated comparison, deletion, art direction, mobile tuning, and technical integration using Three.js, WebGPU, and Rapier.",
    tags: ["Three.js", "WebGPU", "Rapier", "React Three Fiber"],
    links: [],
  },
  {
    number: "05",
    name: "Focused Browser Tools",
    type: "Chrome extensions",
    status: "Published · 2026",
    problem: "Small repeated browser frustrations often remain unfixed because each one looks too narrow.",
    result: "Focused extensions for per-site volume memory and faster Discord raid scheduling workflows.",
    detail: "Small surface area, deliberate permissions, and immediate utility at the exact point where friction occurs.",
    tags: ["JavaScript", "Chrome APIs", "UX", "Integrations"],
    links: [],
  },
  {
    number: "06",
    name: "LootLink",
    type: "Team capstone",
    status: "Fullstack Academy · 2026",
    problem: "Players needed a clearer way to find teammates and organize gaming sessions.",
    result: "A collaborative full-stack matchmaking and session-management platform.",
    detail: "Built with a four-person team and grounded in the same coordination space that later informed Horizon.",
    tags: ["React", "Node.js", "PostgreSQL", "Team Development"],
    links: [],
  },
];

function ProjectCard({ project }) {
  return (
    <article className={`project-dossier${project.featured ? " project-dossier--featured" : ""}`}>
      <header>
        <span>{project.number}</span>
        <p>{project.type}</p>
        <small>{project.status}</small>
      </header>
      <div className="project-dossier__body">
        <h2>{project.name}</h2>
        <div className="project-dossier__outcome">
          <p><b>Problem</b>{project.problem}</p>
          <p><b>Result</b>{project.result}</p>
        </div>
        <p className="project-dossier__detail">{project.detail}</p>
        <ul aria-label={`${project.name} technologies`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        {project.links.length > 0 && (
          <nav aria-label={`${project.name} links`}>
            {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <span>↗</span></a>)}
          </nav>
        )}
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
          <p>These projects did not begin with a framework. Each began with someone losing time, context, access, or connection—and a belief that the process could work better.</p>
          <Link to="/mystory">For the career behind the work, read My Story <span>→</span></Link>
        </div>
      </section>

      <aside className="projects-page__principle">
        <span>How I work</span>
        <p>Stay close to the problem <i>→</i> understand the workflow <i>→</i> build the tool <i>→</i> learn from real use.</p>
      </aside>

      <section className="projects-page__list" aria-label="Selected projects">
        {PROJECTS.map((project) => <ProjectCard project={project} key={project.name} />)}
      </section>

      <footer className="projects-page__footer">
        <div><p>Need the formal version?</p><h2>Start with the résumé.</h2></div>
        <a href="/resume.pdf" download>Download Résumé <span>↓</span></a>
      </footer>
    </main>
  );
}
