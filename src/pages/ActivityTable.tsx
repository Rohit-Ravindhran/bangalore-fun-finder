
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActivitiesTable from '@/components/ActivitiesTable';
import { fetchActivities } from '@/services/activityService';
import { Activity } from '@/components/ActivityCard';
import { Loader2 } from 'lucide-react';

const ActivityTable = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const data = await fetchActivities();
        setActivities(data);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Activities Database</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-w2d-teal" />
            </div>
          ) : (
            <ActivitiesTable activities={activities} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ActivityTable;
