'use client'


import React from 'react';
import LegalPage from '@/components/LegalPage';
import { ABOUT_PAGE } from '@/constants';

const About = () => (
  <LegalPage title={ABOUT_PAGE.title} sections={ABOUT_PAGE.sections} />
);

export default About;
