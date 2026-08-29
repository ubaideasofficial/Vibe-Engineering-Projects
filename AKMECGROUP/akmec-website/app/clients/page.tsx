import React from 'react';
import { ClientLogos } from '../../components/sections/ClientLogos';
import { CallToAction } from '../../components/sections/CallToAction';

export const metadata = {
  title: 'Our Clients & Partners | AKMEC LLP',
  description: 'View the global industrial operators and enterprises that trust AKMEC for uncompromised quality and reliability.',
};

export default function ClientsPage() {
  return (
    <div className="pt-20">
      <ClientLogos />
      <CallToAction />
    </div>
  );
}

