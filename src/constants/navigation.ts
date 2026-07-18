/**
 * Navigation labels and link tables shared by Header, BottomNav, SideMenu and Footer.
 * Icons stay in the components; only the strings/paths live here.
 */

import { ROUTES } from './routes';

export const NAV_LABELS = {
  home: 'Home',
  explore: 'Explore',
  guide: 'Guide',
  dateIdeas: 'Date Ideas',
  food: 'Food Spots',
  meetups: 'Meetups',
  favorites: 'Favorites',
  about: 'About Us',
  contact: 'Contact Us',
  privacy: 'Privacy Policy',
  terms: 'Terms and Conditions',
  settings: 'Settings',
} as const;

/** Left / right clusters of the bottom tab bar (icons attached in the component). */
export const BOTTOM_NAV = {
  left: [
    { id: 'blog', label: NAV_LABELS.guide, path: ROUTES.blog },
    { id: 'date-ideas', label: NAV_LABELS.dateIdeas, path: ROUTES.dateIdeas },
  ],
  right: [
    { id: 'food', label: NAV_LABELS.food, path: ROUTES.food },
    { id: 'meetups', label: NAV_LABELS.meetups, path: ROUTES.meetups },
  ],
  center: { id: 'explore', label: NAV_LABELS.explore, path: ROUTES.home },
} as const;

/** Slide-out side menu links. `icon` names an optional leading icon. */
export interface SideMenuLink {
  label: string;
  path: string;
  icon?: 'heart';
}

export const SIDE_MENU_LINKS: readonly SideMenuLink[] = [
  { label: NAV_LABELS.home, path: ROUTES.home },
  { label: NAV_LABELS.favorites, path: ROUTES.favorites, icon: 'heart' },
  { label: NAV_LABELS.about, path: ROUTES.about },
  { label: NAV_LABELS.contact, path: ROUTES.contact },
  { label: NAV_LABELS.privacy, path: ROUTES.privacy },
  { label: NAV_LABELS.terms, path: ROUTES.terms },
];

/** Footer link row. */
export const FOOTER_LINKS = [
  { label: 'About', path: ROUTES.about },
  { label: 'Contact', path: ROUTES.contact },
  { label: 'Privacy', path: ROUTES.privacy },
  { label: 'Terms', path: ROUTES.terms },
  { label: 'Favorites', path: ROUTES.favorites },
] as const;

/** Hero tag pills shown under the header brand. */
export const HEADER_TAGS = ['Dates', 'Meetups', 'Food', 'Events', 'Friends'] as const;

/** Header-specific copy. */
export const HEADER_STRINGS = {
  heroTitle: 'Discover things to do in Bangalore',
  searchPlaceholder: 'Search places, events, food...',
  settingsAriaLabel: NAV_LABELS.settings,
} as const;

/** Footer newsletter + CTA copy. */
export const FOOTER_STRINGS = {
  newsletterHeading: 'Weekend plans every Friday',
  newsletterPlaceholder: 'Email or phone',
  subscribe: 'Subscribe',
  suggestPrompt: 'Have something to add to the list?',
  submitActivity: 'Submit an Activity',
} as const;
