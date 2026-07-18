/**
 * User-facing UI copy: toasts, empty states, loading and common labels.
 * Grouped by concern. Reused strings are declared once here.
 */

/** Toast notification copy. */
export const TOASTS = {
  seenAllActivities: {
    title: "You've seen all activities",
    description: 'Circling back to the beginning',
  },
  removedFromFavorites: { title: 'Removed from favorites' },
  addedToFavorites: {
    title: 'Added to favorites',
    description: 'You can find this in your saved collection',
  },
  shareSuccess: { title: 'Shared successfully!' },
  linkCopied: { title: 'Link copied!', description: 'Share it with your friends' },
  shareFailed: { title: 'Sharing failed', description: 'Please try again later' },
  shuffled: { title: 'Shuffled activities', description: 'Finding something random for you' },
} as const;

/** Empty-state copy used across listings. */
export const EMPTY_STATES = {
  noActivities: {
    title: 'No activities found',
    description: 'Try a different filter',
  },
  noActivitiesLocation: {
    title: 'No activities found',
    description: 'Try a different filter or location',
  },
  comingSoon: {
    title: 'Coming Soon',
    description: 'Sign up to get updates!',
  },
} as const;

/** Generic reusable labels. */
export const COMMON = {
  clearAllFilters: 'Clear all filters',
  loading: 'Loading…',
  lastUpdatedLabel: 'Last updated',
} as const;
