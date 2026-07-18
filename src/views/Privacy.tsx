'use client'


import React from 'react';
import LegalPage from '@/components/LegalPage';
import { PRIVACY_PAGE, LEGAL_LAST_UPDATED } from '@/constants';

const Privacy = () => (
  <LegalPage
    title={PRIVACY_PAGE.title}
    lastUpdated={LEGAL_LAST_UPDATED}
    sections={PRIVACY_PAGE.sections}
  />
);

export default Privacy;
