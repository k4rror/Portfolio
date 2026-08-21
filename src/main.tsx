import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./i18n/LanguageContext";
import FloatingNav from "./components/Navigation";
import HeroSection from "./components/Hero";
import ProjectsSection from "./components/Projects";
import StackSection from "./components/Stack";
import JourneySection from "./components/Journey";
import ContactSection from "./components/Contact";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-obsidian focus:text-chalk focus:px-4 focus:py-2 focus:rounded-[800px]"
      >
        Skip to content
      </a>
      <div className="bg-pumice min-h-screen text-obsidian font-body font-medium">
        <FloatingNav />
        <main>
          <HeroSection />
          <ProjectsSection />
          <StackSection />
          <JourneySection />
          <ContactSection />
        </main>
      </div>
    </LanguageProvider>
  </StrictMode>
);
