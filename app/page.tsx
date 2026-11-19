import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import DataDemo from "@/components/DataDemo";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Workflow from "@/components/Workflow";
import Experience from "@/components/Experience";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <DataDemo />
        <Skills />
        <Projects />
        <Workflow />
        <Experience />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
