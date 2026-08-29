export interface CertificationCategory {
  title: string;
  items: string[];
}

export const certifications: CertificationCategory[] = [
  {
    title: 'Client Approvals & Registrations',
    items: [
      'ARAMCO (PID, VID, QM approved)',
      'SABIC',
      'ADNOC',
      'ORPIC',
      'FLUOR',
      'Chevron'
    ]
  },
  {
    title: 'API Certified',
    items: [
      'API 510', 'API 570', 'API 653', 'API 580', 
      'API 571', 'API 936', 'API 982', 'API 1169', 
      'API 1104', 'API Q1 & Q2'
    ]
  },
  {
    title: 'Painting & Coating',
    items: [
      'NACE', 'BGAS', 'AMPP', 'FROSIO'
    ]
  },
  {
    title: 'Welding Inspector',
    items: [
      'CSWIP', 'AWS', 'CWI'
    ]
  },
  {
    title: 'ISO Standards',
    items: [
      'ISO 9001:2015', 'ISO 9712', 'ISO 22000'
    ]
  }
];

