import React from 'react';
import { CertificationsWall } from '../../components/sections/CertificationsWall';
import { CallToAction } from '../../components/sections/CallToAction';

export const metadata = {
  title: 'Certifications & Standards | AKMEC LLP',
  description: 'View our industry certifications, client approvals, and compliance standards including API, ISO, NACE, and CSWIP.',
};

export default function CertificationsPage() {
  return (
    <div className="pt-20">
      <CertificationsWall />
      <CallToAction />
    </div>
  );
}

