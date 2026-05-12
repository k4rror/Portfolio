import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FloatingNav from "./components/Navigation";
import HeroSection from "./components/Hero";
import ProjectsSection from "./components/Projects";
import JourneySection from "./components/Journey";
import StackSection from "./components/Stack";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <FloatingNav />
      <HeroSection/>
      <ProjectsSection/>
      <StackSection/>
      <JourneySection/>
  </StrictMode>,
)
