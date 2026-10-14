import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import PageTracker from "./components/PageTracker";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  return (
    <div className="site-shell">
      <PageTracker />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mystory" element={<StoryPage />} />
        <Route path="/mystory2" element={<Navigate to="/mystory" replace />} />
        <Route path="/mystory3" element={<Navigate to="/mystory" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/mystory-b" element={<Navigate to="/mystory" replace />} />
        <Route path="/projects-b" element={<Navigate to="/projects" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
