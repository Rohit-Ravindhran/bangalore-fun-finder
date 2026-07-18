/**
 * Brand identity strings — declared once, reused everywhere.
 * Prefer these over hardcoding the product name, taglines, or contact emails.
 */

const EMAIL_DOMAIN = 'happeningsbangalore.com';

export const BRAND = {
  /** Two-word brand used in the header logo: "Happenings" + "Bengaluru". */
  namePrimary: 'Happenings',
  nameSecondary: 'Bengaluru',
  /** Full brand name, e.g. for headings and legal copy. */
  name: 'Happenings Bengaluru',
  /** Marketing name used in metadata / OG tags. */
  nameShort: 'Happenings Bengaluru',
  tagline:
    'Your personal city guide to hidden and trending things to do in Bengaluru – curated just for you.',
  copyright: (year: number = new Date().getFullYear()) =>
    `© ${year} Happenings Bengaluru`,
} as const;

export const CONTACT = {
  connectEmail: `connect@${EMAIL_DOMAIN}`,
  privacyEmail: `privacy@${EMAIL_DOMAIN}`,
  termsEmail: `terms@${EMAIL_DOMAIN}`,
} as const;

export const SITE = {
  url: 'https://happeningsbangalore.com',
  ogImage: 'https://happeningsbangalore.com/assets/og-image.jpg',
  locale: 'en_IN',
} as const;
