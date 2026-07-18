import type { Metadata } from 'next'
import Script from 'next/script'
import { Providers } from './providers'
import { SEO_DEFAULTS } from '@/constants'
import '../index.css'

export const metadata: Metadata = {
  title: SEO_DEFAULTS.title,
  description: SEO_DEFAULTS.description,
  keywords: SEO_DEFAULTS.keywords,
  authors: [{ name: SEO_DEFAULTS.author }],
  openGraph: {
    title: SEO_DEFAULTS.ogTitle,
    description: SEO_DEFAULTS.ogDescription,
    type: 'website',
    url: SEO_DEFAULTS.url,
    images: [{ url: SEO_DEFAULTS.ogImage }],
    locale: SEO_DEFAULTS.locale,
    siteName: SEO_DEFAULTS.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_DEFAULTS.ogTitle,
    description: SEO_DEFAULTS.twitterDescription,
    images: [SEO_DEFAULTS.ogImage],
  },
  verification: {
    google: SEO_DEFAULTS.googleVerification,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/lovable-uploads/6dacec0d-a286-4f09-ae43-9cb52365856b.png',
  },
  other: {
    'theme-color': SEO_DEFAULTS.themeColor,
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': SEO_DEFAULTS.appTitle,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NNPWQ2QZ');`}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "udp6047ffc");`}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EFGR0JV14G"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          if (!window.location.search.includes('noTrack=true')) {
            gtag('config', 'G-EFGR0JV14G');
          }`}
        </Script>
        {/* Service Worker */}
        <Script id="sw" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }`}
        </Script>
      </head>
      <body>
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NNPWQ2QZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
