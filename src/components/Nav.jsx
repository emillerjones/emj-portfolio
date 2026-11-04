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
  const isHome = ["/", "/home-lab", "/home-lab2"].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <header className={`site-nav${isHome ? " site-nav--home" : ""}`}>
      <NavLink to="/" className="site-nav__brand" aria-label="Evan Miller-Jones home" onClick={() => setOpen(false)}>
        <span>{isHome ? "Evan Miller-Jones" : "EMJ"}</span>
        <small>{isHome ? "Solutions & Systems · Texas" : "Solutions & Systems Engineer"}</small>
      </NavLink>

      {isHome && (
        <a className="site-nav__mobile-resume" href="/resume.pdf" download>
          Résumé <span aria-hidden="true">↓</span>
        </a>
      )}

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
