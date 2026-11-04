import { useEffect, useState } from "react";

const HORIZON_API = import.meta.env.VITE_HORIZON_API || "https://raidhelper-server.onrender.com";

// Shown until the live request returns (Render can take ~30s to wake).
export const HORIZON_FALLBACK = { raids: 2700, guilds: 60, upcomingWeek: null, live: false };

// Live public counts from Horizon's /summary endpoint (counts only).
export default function useHorizonSummary() {
  const [summary, setSummary] = useState(HORIZON_FALLBACK);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    fetch(`${HORIZON_API}/api/raidhelper/summary`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        if (Number.isFinite(data.raids) && Number.isFinite(data.guilds)) setSummary({ ...data, live: true });
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, []);
  return summary;
}
