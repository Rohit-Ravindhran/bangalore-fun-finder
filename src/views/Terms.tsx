'use client'


import React from 'react';
import LegalPage from '@/components/LegalPage';
import { TERMS_PAGE, LEGAL_LAST_UPDATED } from '@/constants';

const Terms = () => (
  <LegalPage
    title={TERMS_PAGE.title}
    lastUpdated={LEGAL_LAST_UPDATED}
    sections={TERMS_PAGE.sections}
  />
);

export default Terms;
