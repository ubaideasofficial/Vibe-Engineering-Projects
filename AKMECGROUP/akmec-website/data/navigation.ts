export interface NavLink {
  title: string;
  href: string;
}

export interface NavMenu {
  title: string;
  items: NavLink[];
}

export const navigation: (NavLink | NavMenu)[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'About',
    href: '/about'
  },
  {
    title: 'Services',
    items: [
      { title: 'Inspection & Audit', href: '/services/inspection-and-audit' },
      { title: 'Examination & Testing (NDT)', href: '/services/ndt-testing' },
      { title: 'Asset Integrity & Tech Solutions', href: '/services/asset-integrity' },
      { title: 'Manpower Supply', href: '/services/manpower-outsourcing' },
      { title: 'Training & Certification', href: '/services/training-certification' },
      { title: 'Heat Treatment', href: '/services/heat-treatment' }
    ]
  },
  {
    title: 'Industries',
    href: '/industries'
  },
  {
    title: 'Certifications',
    href: '/certifications'
  },
  {
    title: 'Clients',
    href: '/clients'
  },
  {
    title: 'Contact',
    href: '/contact'
  }
];

