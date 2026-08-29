import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesBento } from '../components/sections/ServicesBento';
import { KPIPanel } from '../components/sections/KPIPanel';
import { AboutTeaser } from '../components/sections/AboutTeaser';
import { IndustriesMaximalist } from '../components/sections/IndustriesMaximalist';
import { CertificationsWall } from '../components/sections/CertificationsWall';
import { ClientLogos } from '../components/sections/ClientLogos';
import { MissionVision } from '../components/sections/MissionVision';
import { CallToAction } from '../components/sections/CallToAction';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Spatial hero with offshore platform image */}
      <HeroSection />
      
      {/* 4. Services Bento Grid (moved up based on sequence from spec, but let's follow the anchor rule) */}
      <ServicesBento />

      {/* 5. Skeuomorphic KPI panel */}
      <KPIPanel />

      {/* 3. Minimal About teaser */}
      <AboutTeaser />

      {/* 7. Maximalist industries section */}
      <IndustriesMaximalist />

      {/* 8. Brutalist certifications wall */}
      <CertificationsWall />

      {/* 9. Approved / Registered With and client logo wall */}
      <ClientLogos />

      {/* 10. Clay Mission and Vision cards */}
      <MissionVision />

      {/* 11. Liquid-glass CTA */}
      <CallToAction />
    </div>
  );
}
