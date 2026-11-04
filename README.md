# emj-portfolio

Personal portfolio for Evan Miller-Jones, a solutions and systems engineer. It has three pages:

- **Home** (`/`): introduction over an interactive WebGL light field.
- **My Story** (`/mystory`): career narrative, from TCEQ records operations to independent product work.
- **Projects** (`/projects`): case studies for Recovery Community, the TCEQ records operations platform, and Horizon, plus smaller tools.

## Stack

React 19, React Router 7, Vite 8, three.js with react-three-fiber and `@react-three/postprocessing` (bloom). Deployed on Vercel. `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh.

## The orb field

[`src/components/OrbField.jsx`](src/components/OrbField.jsx) renders a field of point-light orbs. Visitors raise or lower the overall brightness by swiping or scrolling vertically, or with the arrow keys once the page has focus. Group sizes and lighting limits are in [`orbFieldConfig.js`](src/components/orbFieldConfig.js).

- **Lazy loading.** The scene is lazy-loaded and wrapped in an error boundary, so the page's text and navigation still work if WebGL is unavailable.
- **Reduced motion.** The scene respects `prefers-reduced-motion`, and the home page has a pause control.

## Structure

```
src/
  App.jsx               routes (old variant URLs redirect to the canonical pages)
  App.css               design tokens, fonts, global reset
  pages/                HomePage, StoryPage, ProjectsPage (each with its own CSS)
  components/
    Nav.jsx             site header and mobile menu
    OrbField.jsx        WebGL hero scene
    PageTracker.jsx     anonymous page-visit analytics (optional, see below)
public/
  resume.pdf            linked from the nav and Projects page
```

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run lint
```

### Analytics (optional)

`PageTracker` sends a page name and a random per-browser visitor ID to the Horizon API (`VITE_HORIZON_API`). Copy `.env.example` to `.env` to enable it. If the variable isn't set, no requests are made.
