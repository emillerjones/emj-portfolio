import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Nav.css";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "My Story", to: "/mystory" },
  { label: "Projects", to: "/projects" },
];

export default function Nav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header className={`site-nav${location.pathname === "/" ? " site-nav--home" : ""}`}>
      <NavLink to="/" className="site-nav__brand" aria-label="Evan Miller-Jones home" onClick={() => setOpen(false)}>
        <span>EMJ</span>
        <small>Full-Stack Developer · Product Builder</small>
      </NavLink>

      <button
        className={`site-nav__menu${open ? " is-open" : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <i /><i />
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <nav id="primary-navigation" className={`site-nav__links${open ? " is-open" : ""}`} aria-label="Primary navigation">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={() => setOpen(false)}>
            {({ isActive }) => <span className={isActive ? "is-active" : ""}>{link.label}</span>}
          </NavLink>
        ))}
        <a className="site-nav__resume" href="/resume.pdf" download onClick={() => setOpen(false)}>Résumé <b>↓</b></a>
      </nav>
    </header>
  );
}
