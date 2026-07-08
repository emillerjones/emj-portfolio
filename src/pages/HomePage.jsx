import Starfield from "../components/Starfield";
import Hero from "../components/Hero";
import Constellation from "../components/Constellation";
import Projects from "../components/Projects";
import About from "../components/About";
import { NODES } from "../data/portfolioData";

export default function HomePage() {
  return (
    <>
      <Starfield />
      <Constellation nodes={NODES} />
      <main>
        <Hero />
        <Projects />
        <About />
      </main>
    </>
  );
}
