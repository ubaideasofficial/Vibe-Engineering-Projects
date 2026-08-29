import React from 'react';
import { ServicesBento } from '../../components/sections/ServicesBento';
import { CallToAction } from '../../components/sections/CallToAction';

export const metadata = {
  title: 'Our Services | AKMEC LLP',
  description: 'Explore our complete range of industrial services including Inspection, Audit, NDT Testing, Asset Integrity, Manpower Supply, and Training.',
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <ServicesBento />
      <CallToAction />
    </div>
  );
}

