import locationImages from '@/content/location-images.json';
/** Original AI-generated editorial images, not photographs of listed firms. */
export const legalImages = { library: '/images/legal-library.webp', family: '/images/family-advice.webp', property: '/images/property-law.webp', business: '/images/business-law.webp' };
export function groupImage(group?: string | null): string {
  if (group === 'wills') return '/images/estate-planning.webp';
  if (['family', 'injury'].includes(group ?? '')) return legalImages.family;
  if (['property', 'conveyancing'].includes(group ?? '')) return legalImages.property;
  if (['business', 'employment', 'immigration'].includes(group ?? '')) return legalImages.business;
  return legalImages.library;
}

export function locationImage(slug: string): string { return (locationImages as Record<string,string>)[slug] ?? legalImages.library; }
