import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.akmecgroup.com';

  return [
    '',
    '/about',
    '/services',
    '/services/inspection-and-audit',
    '/services/ndt-testing',
    '/services/asset-integrity',
    '/services/manpower-outsourcing',
    '/services/training-certification',
    '/services/heat-treatment',
    '/industries',
    '/certifications',
    '/clients',
    '/contact',
    '/quote',
    '/privacy',
    '/terms',
    '/style-guide',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
