import React from 'react';
import { IndustriesMaximalist } from '../../components/sections/IndustriesMaximalist';
import { CallToAction } from '../../components/sections/CallToAction';

export const metadata = {
  title: 'Industries We Serve | AKMEC LLP',
  description: 'AKMEC serves 33 diverse industrial sectors including Oil & Gas, Refinery, Petrochemical, Nuclear, Marine, and Renewable Energy.',
};

export default function IndustriesPage() {
  return (
    <div className="pt-20">
      <IndustriesMaximalist />
      <CallToAction />
    </div>
  );
}

