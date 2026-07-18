/**
 * Internal route paths and external URLs — declared once.
 * Import ROUTES instead of hardcoding path strings so links stay in sync.
 */

export const ROUTES = {
  home: '/',
  blog: '/blog',
  settings: '/settings',
  favorites: '/favorites',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  dateIdeas: '/date-ideas',
  food: '/food',
  meetups: '/meetups',
  dayOut: '/day-out',
  network: '/network',
  profile: '/profile',
  activity: (slug: string) => `/activity/${slug}`,
} as const;

export const EXTERNAL_URLS = {
  /** Google Form for community activity suggestions. */
  suggestionForm:
    'https://docs.google.com/forms/d/e/1FAIpQLSfwejAJIbXP5oC3UdZUOoYM0AQLf4ZqjuPm4nRBKAsB_FdcBg/viewform?usp=header',
} as const;
