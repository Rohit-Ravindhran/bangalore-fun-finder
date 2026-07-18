/**
 * Settings screen copy and row config.
 */

import { ROUTES, EXTERNAL_URLS } from './routes';
import { BRAND } from './brand';

export const SETTINGS_STRINGS = {
  title: 'Settings',
  groups: {
    preferences: 'Preferences',
    support: 'Support',
  },
  version: `${BRAND.name} · v1.0.0`,
} as const;

/** Toggle rows in the Preferences group (icon resolved in the view). */
export const SETTINGS_TOGGLES = {
  theme: {
    key: 'theme',
    label: 'Dark mode',
    descOn: 'Using the dark theme',
    descOff: 'Using the light theme',
  },
  notifications: {
    key: 'notifications',
    label: 'Notifications',
    desc: 'Weekend picks & new events',
  },
  location: {
    key: 'location',
    label: 'Location access',
    desc: 'Show places near you',
  },
} as const;

/** localStorage keys for persisted toggles. */
export const SETTINGS_STORAGE_KEYS = {
  notifications: 'settings.notifications',
  location: 'settings.location',
} as const;

/** Support / navigation rows (icon resolved in the view). */
export const SETTINGS_LINKS = [
  { label: 'Favorites', desc: 'Places you saved', path: ROUTES.favorites, icon: 'heart' as const },
  { label: 'About', desc: 'Our story', path: ROUTES.about, icon: 'info' as const },
  { label: 'Contact', desc: 'Get in touch', path: ROUTES.contact, icon: 'mail' as const },
  { label: 'Privacy Policy', path: ROUTES.privacy, icon: 'shield' as const },
  { label: 'Terms & Conditions', path: ROUTES.terms, icon: 'file' as const },
] as const;

/** External "submit an activity" row. */
export const SETTINGS_EXTERNAL = {
  label: 'Submit an activity',
  desc: 'Know a spot worth sharing?',
  url: EXTERNAL_URLS.suggestionForm,
} as const;
