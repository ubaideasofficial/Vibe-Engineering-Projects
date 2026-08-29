export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export const stats: Stat[] = [
  {
    id: 'inspectors',
    value: '50+',
    label: 'Competent Inspectors',
    icon: '/media/icons/stat-inspectors.png'
  },
  {
    id: 'years',
    value: '5+',
    label: 'Years Empowering Industries',
    icon: '/media/icons/stat-years.png'
  },
  {
    id: 'projects',
    value: '100+',
    label: 'Successful Projects',
    icon: '/media/icons/stat-projects.png'
  },
  {
    id: 'footprint',
    value: 'Global',
    label: 'Service Footprint',
    icon: '/media/icons/stat-global-service.png'
  },
  {
    id: 'services',
    value: 'Wide Range',
    label: 'Of Services',
    icon: '/media/icons/stat-wide-range.png'
  }
];

