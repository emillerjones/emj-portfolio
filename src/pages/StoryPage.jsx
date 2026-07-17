import { useMemo } from "react";
import Starfield from "../components/Starfield";
import Hero from "../components/Hero";
import Constellation from "../components/Constellation";
import Projects from "../components/Projects";
import About from "../components/About";
import { NODES } from "../data/portfolioData";
import { useChapterScroller } from "../hooks/useChapterScroller";
import "./StoryPage.css";

export default function StoryPage() {
  const scrollStops = useMemo(
    () => [
      "hero",
      ...NODES.filter((node) => !["start", "whats-next"].includes(node.id)).map((node) => node.id),
      "contact",
    ],
    [],
  );

  useChapterScroller(scrollStops);

  return (
    <div className="story-page">
      <Starfield />
      <Constellation nodes={NODES} />
      <main>
        <Hero />
        <Projects />
        <About />
      </main>
    </div>
  );
}
