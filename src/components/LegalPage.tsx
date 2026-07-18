'use client'

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { COMMON } from '@/constants';

/** A content section: either a prose `body`, or an `intro` with `bullets`. */
export interface LegalSection {
  heading: string;
  body?: string;
  intro?: string;
  bullets?: readonly string[];
}

interface LegalPageProps {
  title: string;
  /** Optional "Last updated: …" date shown above the content. */
  lastUpdated?: string;
  sections: readonly LegalSection[];
}

/**
 * Shared shell for static legal / marketing pages (About, Privacy, Terms).
 * Renders Header + a titled white card of sections + Footer so each view only
 * has to supply its copy from `@/constants`.
 */
const LegalPage: React.FC<LegalPageProps> = ({ title, lastUpdated, sections }) => {
  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />

      <main className="container px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6 text-primary">{title}</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-6">
              {COMMON.lastUpdatedLabel}: {lastUpdated}
            </p>
          )}

          {sections.map((section, i) => (
            <section key={section.heading} className={i < sections.length - 1 ? 'mb-6' : undefined}>
              <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
              {section.intro && <p className="mb-3">{section.intro}</p>}
              {section.bullets && (
                <ul className="list-disc pl-5 mb-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.body && <p>{section.body}</p>}
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
