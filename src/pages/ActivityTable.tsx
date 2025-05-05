
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActivitiesTable from '@/components/ActivitiesTable';
import { activities } from '@/data/mockData';

const ActivityTable = () => {
  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Activities Database</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <ActivitiesTable activities={activities} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ActivityTable;
