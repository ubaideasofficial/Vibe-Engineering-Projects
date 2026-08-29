export interface Client {
  id: string;
  name: string;
  logo: string;
  isUnknown?: boolean;
}

export const clients: Client[] = [
  { id: 'adnoc', name: 'ADNOC', logo: '/media/clients/adnoc.png' },
  { id: 'alfred-h-knight', name: 'Alfred H Knight', logo: '/media/clients/alfred-h-knight.png' },
  { id: 'apave', name: 'Apave', logo: '/media/clients/apave.png' },
  { id: 'applus-velosi', name: 'Applus Velosi', logo: '/media/clients/applus-velosi.png' },
  { id: 'beumer-group', name: 'BEUMER Group', logo: '/media/clients/beumer-group.png' },
  { id: 'bharat-petroleum', name: 'Bharat Petroleum', logo: '/media/clients/bharat-petroleum.png' },
  { id: 'bureau-veritas', name: 'Bureau Veritas', logo: '/media/clients/bureau-veritas.png' },
  { id: 'dangote', name: 'Dangote', logo: '/media/clients/dangote.png' },
  { id: 'decpl', name: 'DECPL', logo: '/media/clients/decpl.png' },
  { id: 'dnv', name: 'DNV', logo: '/media/clients/dnv.png' },
  { id: 'eil', name: 'EIL', logo: '/media/clients/eil.jpg' },
  { id: 'fulkrum', name: 'Fulkrum', logo: '/media/clients/fulkrum.png' },
  { id: 'hrrl', name: 'HRRL', logo: '/media/clients/hrrl.png' },
  { id: 'ics', name: 'ICS', logo: '/media/clients/ics.png' },
  { id: 'indian-oil', name: 'Indian Oil', logo: '/media/clients/indian-oil.png' },
  { id: 'k2m-consultant', name: 'K2M Consultant & Services', logo: '/media/clients/k2m-consultant.jpg' },
  { id: 'kti', name: 'KTI', logo: '/media/clients/kti.png' },
  { id: 'larsen-toubro', name: 'Larsen & Toubro', logo: '/media/clients/larsen-toubro.png' },
  { id: 'lrqa', name: 'LRQA', logo: '/media/clients/lrqa.png' },
  { id: 'miltec-engineering', name: 'MILTEC Engineering', logo: '/media/clients/miltec-engineering.png' },
  { id: 'ongc-mrpl', name: 'ONGC MRPL', logo: '/media/clients/ongc-mrpl.jpg' },
  { id: 'resc', name: 'RESC', logo: '/media/clients/resc.jpg' },
  { id: 'rotostat', name: 'Rotostat', logo: '/media/clients/rotostat.png' },
  { id: 'sez', name: 'SEZ', logo: '/media/clients/sez.png' },
  { id: 'sgs', name: 'SGS', logo: '/media/clients/sgs.png' },
  { id: 'thermax', name: 'Thermax', logo: '/media/clients/thermax.png' },
  { id: 'tuv-sud', name: 'TÜV SÜD', logo: '/media/clients/tuv-sud.png' },
  { id: 'vasant-group', name: 'Vasant Group', logo: '/media/clients/vasant-group.jpg' },
  { id: 'vcs-energising-quality', name: 'VCS (Energising Quality)', logo: '/media/clients/vcs-energising-quality.png' },
  
  // TODO: confirm company name with AKMEC
  { id: 'unknown-01', name: 'Client logo', logo: '/media/clients/logo-unknown-01.png', isUnknown: true },
  { id: 'unknown-02', name: 'Client logo', logo: '/media/clients/logo-unknown-02.png', isUnknown: true },
  { id: 'unknown-03', name: 'Client logo', logo: '/media/clients/logo-unknown-03.jpg', isUnknown: true },
  { id: 'unknown-04', name: 'Client logo', logo: '/media/clients/logo-unknown-04.png', isUnknown: true },
  { id: 'unknown-05', name: 'Client logo', logo: '/media/clients/logo-unknown-05.png', isUnknown: true },
];

