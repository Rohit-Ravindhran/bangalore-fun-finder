/**
 * Home (Index) view strings: filters, tabs, sort options and section headers.
 */

export const QUICK_FILTERS = [
  { id: 'free', label: 'Free' },
  { id: 'today', label: 'Today' },
  { id: 'weekend', label: 'This Weekend' },
] as const;

export const TIME_FILTERS = [
  { id: 'today', label: 'Today', icon: '📅' },
  { id: 'weekend', label: 'This Weekend', icon: '🗓️' },
  { id: 'week', label: 'This Week', icon: '📆' },
  { id: 'anytime', label: 'Anytime', icon: '✨' },
] as const;

export const SORT_OPTIONS = [
  { id: 'popular', label: '🔥 Popular' },
  { id: 'price_low_high', label: '💸 Budget low to high' },
  { id: 'price_high_low', label: '💸 Budget high to low' },
  { id: 'newest', label: '🆕 New' },
] as const;

export const HOME_TABS = {
  all: 'All',
  uniqueExperiences: 'Unique Experiences',
  dateIdeas: 'Date Ideas',
} as const;

export const HOME_STRINGS = {
  sectionTitle: 'Events & Activities',
  /** navigator.share title/text fallbacks. */
  shareTitle: (activityTitle: string) =>
    `Check out ${activityTitle || 'this activity'} on What2Do Bangalore`,
  shareTextFallback: 'Discover fun activities in Bangalore',
} as const;
