import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FloatingNav from "./components/Navigation";
import HeroSection from "./components/Hero";
import ProjectsSection from "./components/Projects";
import StackSection from "./components/Stack";
import JourneySection from "./components/Journey";
import ContactSection from "./components/Contact";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="bg-pumice min-h-screen text-obsidian font-body font-medium">
      <FloatingNav />
      <HeroSection />
      <ProjectsSection />
      <StackSection />
      <JourneySection />
      <ContactSection />
    </div>
  </StrictMode>
);