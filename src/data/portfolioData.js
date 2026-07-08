// Existing exports (PROJECTS, EXPERIENCE, SKILLS) left untouched below --
// NODES expanded into 8 story chapters, splitting each era into its real
// problem beat and solution beat rather than inventing extra roles.

export const NODES = [
  {
    id: "start",
    title: "Start",
  },
  {
    id: "paper-records",
    problem: "Paper records, tracked by hand.",
    title: "Paper records",
    org: "TCEQ",
    period: "2013 – 2016",
    desc: "Started in document imaging and public records — critical information lived in paper files, PDFs, and disconnected systems. Access was slow, and accuracy suffered.",
    tags: ["Document imaging", "Public records"],
    links: [],
  },
  {
    id: "workflow-automation",
    problem: "The manual process couldn't scale.",
    title: "Workflow automation",
    org: "TCEQ",
    period: "2016 – 2023",
    desc: "Promoted into building the fix — an enterprise workflow application in Microsoft Access, VBA, and Oracle WebCenter Content, replacing a purchased vendor system. Ran daily for 30–50 staff across imaging, redaction, and records management.",
    tags: ["Microsoft Access", "VBA", "Oracle", "ODBC"],
    links: [],
  },
  {
    id: "healthcare-communication",
    problem: "Patients missed appointments, and the system tracking them was breaking down.",
    title: "Healthcare communication",
    org: "AppointmentWave · Tejas HMA",
    period: "2023",
    desc: "Took ownership of a production healthcare platform in an unfamiliar stack — learning Blazor, Azure, SQL Server, and Twilio on the job to keep it running.",
    tags: ["Blazor", "Azure", "SQL Server"],
    links: [],
  },
  {
    id: "messaging-infrastructure",
    problem: "Response tracking couldn't tell you what actually happened.",
    title: "Messaging infrastructure",
    org: "AppointmentWave · Tejas HMA",
    period: "2023 – 2025",
    desc: "Redesigned the core campaign architecture into a configurable parent/child model, and rebuilt patient response tracking to preserve full communication history across voice, SMS, and email.",
    tags: ["Twilio", "SQL Server", "System design"],
    links: [],
  },
  {
    id: "independent-saas",
    problem: "Raid schedules scattered across Discord servers.",
    title: "Independent SaaS",
    org: "Horizon",
    period: "2026 – present",
    desc: "Solo-built SaaS platform consolidating Raid-Helper events from multiple Discord servers into a single scheduling app, with a companion Chrome extension. Currently tracking 28 guilds and 500+ raids.",
    tags: ["React", "Express", "PostgreSQL", "Discord API"],
    links: [
      { text: "Visit Horizon", href: "#" },
      { text: "View code", href: "#" },
    ],
    related: [
      {
        name: "LootLink",
        desc: "Fullstack Academy capstone, built with a four-person team in the same space — gamers finding teammates and organizing sessions.",
        tags: ["React", "Node.js", "PostgreSQL"],
      },
    ],
  },
  {
    id: "chrome-extensions",
    problem: "Small daily frictions nobody bothers to fix.",
    title: "Chrome extensions",
    org: "Volume by Site · Raid Helper Calendar",
    period: "2026",
    desc: "Two published Chrome extensions solving narrow, real annoyances — per-site volume memory, and Discord-to-calendar raid sync.",
    tags: ["JavaScript", "Chrome Extension APIs"],
    links: [],
  },
  {
    id: "community-platform",
    problem: "People in recovery need a place to find each other.",
    title: "Community platform",
    org: "Wellness Recovery Community",
    period: "2026 – present",
    desc: "Building a full-stack platform for a nonprofit — a public marketing site plus an authenticated community space for peer support and resources. In progress.",
    tags: ["React", "Vite", "Node (planned)"],
    links: [],
  },
  {
    id: "whats-next",
    title: "What's next",
  },
];

export const PROJECTS = [
  {
    id: "lootlink",
    label: "Capstone Project",
    name: "LootLink",
    desc: "A full-stack gamer matchmaking and session management platform. Players find teammates, schedule sessions, and build persistent squads — built with real gaming workflows in mind, not just as a demo.",
    tags: ["React", "Node.js", "PostgreSQL", "MUI", "REST API"],
    links: [
      { text: "Live Site", href: "#" },
      { text: "View Code", href: "#" },
    ],
    featured: true,
  },
  {
    id: "raidhelper",
    label: "Chrome Extension",
    name: "Raid Helper Calendar",
    desc: "A browser extension for raid teams to track schedules, set reminders, and sync events directly with Discord. Solved a real coordination problem for gaming communities.",
    tags: ["JavaScript", "Discord API", "Chrome APIs"],
    links: [
      { text: "Chrome Store", href: "#" },
      { text: "View Code", href: "#" },
    ],
    featured: false,
  },
  {
    id: "more",
    label: "Open Source",
    name: "More on GitHub",
    desc: "Experiments, practice builds, and smaller tools. Always iterating, always shipping.",
    tags: ["React", "JS", "CSS"],
    links: [{ text: "github.com/evanmillerjones", href: "https://github.com/emillerjones" }],
    featured: false,
  },
];

export const EXPERIENCE = [
  {
    role: "Full Stack Developer",
    company: "Fullstack Academy",
    period: "2024",
    type: "Education",
    desc: "Completed an intensive software engineering bootcamp. Built LootLink as capstone — a production-quality full-stack web app using React, Node.js, and PostgreSQL.",
  },
  {
    role: "Implementation Specialist",
    company: "AppointmentWave",
    period: "2023 – 2024",
    type: "Healthcare Tech",
    desc: "Implemented scheduling software for healthcare clients. Configured systems, designed workflows, and served as the technical bridge between product and end users. Gained deep exposure to real-world SaaS deployment.",
  },
  {
    role: "Technical Systems Analyst",
    company: "TCEQ",
    period: "2018 – 2023",
    type: "Government Tech",
    desc: "Built and maintained internal applications with Microsoft Access, VBA, and Oracle SQL. Managed enterprise content and document workflows using Open Text WebCenter Content — supporting regulatory operations at scale.",
  },
  {
    role: "Administrative & Operations",
    company: "Government & Corporate",
    period: "2014 – 2018",
    type: "Early Career",
    desc: "Built a foundation in process improvement, technical reporting, and cross-functional coordination across government and corporate environments.",
  },
];

export const SKILLS = [
  { name: "JavaScript / TypeScript", pct: 90 },
  { name: "React", pct: 88 },
  { name: "Node.js / Express", pct: 84 },
  { name: "PostgreSQL / SQL", pct: 80 },
  { name: "HTML / CSS", pct: 92 },
  { name: "Git / GitHub", pct: 86 },
  { name: "REST API Design", pct: 82 },
  { name: "Oracle / Access / VBA", pct: 75 },
];
