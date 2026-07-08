function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-main">
        <p className="hero-eyebrow">Full Stack Developer &middot; Texas</p>

        <h1 className="hero-headline">
          Ten years of systems thinking.
          <br />
          <em>This is where that story starts.</em>
        </h1>

        <p className="hero-sub">
          I came up through enterprise systems analysis and healthcare tech,
          then went all-in on modern web development. Every stop is mapped out
          to the left &mdash; start at the beginning, or jump to whatever
          catches your eye.
        </p>

        <p className="hero-quote">
          "I don't just write code &mdash; I understand the business problem behind it."
        </p>

        <div className="hero-actions">
          <a href="#paper-records" className="btn btn--primary">See how it unfolds</a>
          <a href="/resume.pdf" download className="btn btn--ghost">Download Resume &darr;</a>
        </div>

        <div className="hero-social">
          <a href="https://github.com/emillerjones" target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a href="https://www.linkedin.com/in/evan-miller-jones-30762a28/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a href="mailto:emj.studioworks@gmail.com" aria-label="Email">
            <EmailIcon />
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <svg viewBox="0 0 300 300" className="hero-visual__svg">
          <circle cx="150" cy="150" r="90" className="hero-visual__ring" />
          <circle cx="150" cy="150" r="60" className="hero-visual__ring hero-visual__ring--inner" />
          <line x1="150" y1="60" x2="150" y2="20" className="hero-visual__spoke" />
          <line x1="220" y1="150" x2="270" y2="150" className="hero-visual__spoke" />
          <line x1="150" y1="240" x2="150" y2="280" className="hero-visual__spoke" />
          <line x1="80" y1="150" x2="30" y2="150" className="hero-visual__spoke" />
          <circle cx="150" cy="150" r="10" className="hero-visual__core" />
        </svg>
      </div>
    </section>
  );
}
