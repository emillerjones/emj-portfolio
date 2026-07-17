import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  return (
    <div className="site-shell">
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mystory" element={<StoryPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
