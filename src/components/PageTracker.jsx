import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_HORIZON_API;
const VISITOR_ID_KEY = "emj-portfolio-visitor-id";

const PAGE_NAMES = {
  "/": "portfolio_home",
  "/mystory": "portfolio_story",
  "/projects": "portfolio_projects",
};

function getVisitorId() {
  try {
    const existingId = localStorage.getItem(VISITOR_ID_KEY);
    if (existingId) return existingId;

    const newId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, newId);
    return newId;
  } catch {
    return null;
  }
}

export default function PageTracker() {
  const { pathname } = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    const page = PAGE_NAMES[pathname];
    if (!API || !page || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const visitorId = getVisitorId();

    fetch(`${API}/api/raidhelper/visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(visitorId ? { "X-Visitor-Id": visitorId } : {}),
      },
      body: JSON.stringify({ page }),
      keepalive: true,
    }).catch(() => {
      // Analytics should never interrupt the portfolio experience.
    });
  }, [pathname]);

  return null;
}
