/**
 * Static page copy for legal / marketing pages (About, Privacy, Terms, Contact).
 * Prose that is genuinely unique to a page lives here so the views stay structural.
 */

import { BRAND, CONTACT } from './brand';

export const LEGAL_LAST_UPDATED = 'May 5, 2025';

export const ABOUT_PAGE = {
  title: 'About Us',
  sections: [
    {
      heading: `What is ${BRAND.name}?`,
      body: `${BRAND.name} is your personal city guide to discover hidden gems and trending experiences in Bangalore. We curate unique activities, events, and places that locals love but tourists often miss.`,
    },
    {
      heading: 'Our Mission',
      body: 'Our mission is to help everyone discover the soul of Bangalore through authentic, local experiences. We believe that the best way to experience a city is through the eyes of those who call it home.',
    },
    {
      heading: 'How We Curate',
      body: 'Our team of local enthusiasts constantly explores the city to find unique activities. We personally verify each listing to ensure quality and authenticity. From hidden cafes to underground music scenes, we bring you the best of Bangalore.',
    },
    {
      heading: 'Join Our Community',
      body: "Have a suggestion? Found a hidden gem? We'd love to hear from you! Contact us to share your discoveries and help us build a more vibrant community.",
    },
  ],
} as const;

export const PRIVACY_PAGE = {
  title: 'Privacy Policy',
  sections: [
    {
      heading: '1. Introduction',
      body: `${BRAND.name} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.`,
    },
    {
      heading: '2. Information We Collect',
      intro: 'We may collect information about you in various ways, including:',
      bullets: [
        'Information you provide when using our services, such as your name, email address, and phone number.',
        'Information about your device, including IP address, browser type, and operating system.',
        'Your activity on our platform, including pages visited and features used.',
      ],
    },
    {
      heading: '3. How We Use Your Information',
      intro: 'We may use the information we collect for various purposes, including:',
      bullets: [
        'Providing and improving our services.',
        'Communicating with you about our services, updates, and promotional offers.',
        'Analyzing usage patterns to enhance user experience.',
        'Protecting our rights and preventing fraud.',
      ],
    },
    {
      heading: '9. Contact Us',
      body: `If you have questions or concerns about this Privacy Policy, please contact us at ${CONTACT.privacyEmail}.`,
    },
  ],
} as const;

export const TERMS_PAGE = {
  title: 'Terms and Conditions',
  sections: [
    {
      heading: '1. Acceptance of Terms',
      body: `By accessing or using ${BRAND.name}'s website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`,
    },
    {
      heading: '2. Use of Our Services',
      intro:
        'You agree to use our services only for purposes that are permitted by these Terms and any applicable laws. You may not:',
      bullets: [
        'Use our services in any way that could damage or disable them.',
        'Attempt to gain unauthorized access to any part of our services.',
        'Use our services for any illegal or unauthorized purpose.',
      ],
    },
    {
      heading: '3. Content and Information',
      body: 'We strive to provide accurate and up-to-date information about activities and events in Bangalore. However, we do not guarantee the accuracy, completeness, or reliability of any content. You acknowledge that any reliance on such information is at your own risk.',
    },
    {
      heading: '10. Contact Us',
      body: `If you have any questions about these Terms and Conditions, please contact us at ${CONTACT.termsEmail}.`,
    },
  ],
} as const;

export const CONTACT_PAGE = {
  title: 'Contact Us',
  intro:
    "Have questions, suggestions, or want to partner with us? We'd love to hear from you! Fill out the form below and your email client will open with the message pre-filled.",
  successTitle: 'Thank You!',
  successBody: 'We have received your message and will get back to you soon.',
  sendAnother: 'Send Another Message',
  submit: 'Send Message',
  submitting: 'Sending...',
  connectHeading: 'Connect With Us',
  emailLabel: (email: string) => `Email: ${email}`,
  rateLimit: 'Please wait 30 seconds before submitting again.',
  submitError: 'There was an error submitting your message. Please try again.',
  mailSubject: `Message from ${BRAND.name}`,
  fields: {
    name: 'Name',
    emailOrPhone: 'Email or Phone',
    emailOrPhonePlaceholder: 'your.email@example.com or +91 98765 43210',
    message: 'Message',
  },
} as const;
