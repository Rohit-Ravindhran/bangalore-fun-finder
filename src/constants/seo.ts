/**
 * SEO metadata strings. Root/default metadata plus per-page overrides.
 */

import { BRAND, SITE } from './brand';

export const SEO_DEFAULTS = {
  title: `${BRAND.nameShort} | Discover Things To Do`,
  description:
    'Explore the best things to do in Bangalore – from unique date ideas, weekend events, and meetups to food trails. Curated experiences for everyone.',
  keywords:
    'Things to do in Bangalore, Bangalore activities, Bangalore date ideas, couple packages Bangalore, Bangalore weekend plans, curated experiences, what to do in Bangalore today, Bangalore outings',
  author: `${BRAND.nameShort} Team`,
  siteName: BRAND.nameShort,
  ogTitle: `${BRAND.nameShort} | Discover Curated Experiences`,
  ogDescription:
    "Plan your next day out in Bangalore with handpicked activities, events, and packages. From date ideas to fun with friends – we've got your weekend covered.",
  twitterDescription:
    'Plan your next day out in Bangalore with handpicked activities, events, and packages.',
  url: SITE.url,
  ogImage: SITE.ogImage,
  locale: SITE.locale,
  appTitle: 'Happenin',
  themeColor: '#234E52',
  googleVerification: 'SoqryeoxVNXgE9ehNMjuOGD3NqQfHYvVUEEovZcLcfY',
} as const;
