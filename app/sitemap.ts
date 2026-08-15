import { MetadataRoute } from 'next'
import { localAreas } from './lib/localAreas'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aleksandrawejer.pl'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...localAreas.map((area) => ({
      url: `${baseUrl}/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
