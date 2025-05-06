
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Activity } from '@/components/ActivityCard';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { createActivity, deleteActivity, fetchActivities, updateActivity } from '@/services/activityService';

const Admin = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
      toast({
        title: "Error loading activities",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentActivity({
      ...currentActivity,
      [name]: value,
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentActivity({
      ...currentActivity,
      tags: e.target.value.split(',').map(tag => tag.trim()),
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentActivity({
      ...currentActivity,
      categoryIds: e.target.value.split(',').map(id => id.trim()),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentActivity.title || !currentActivity.image) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      if (currentActivity.id) {
        // Update existing activity
        const updated = await updateActivity(
          currentActivity.id, 
          currentActivity as Omit<Activity, 'id' | 'lastUpdated'>
        );
        setActivities(activities.map(activity => 
          activity.id === currentActivity.id ? updated : activity
        ));
        toast({
          title: "Activity updated",
          description: `${currentActivity.title} has been updated`,
        });
      } else {
        // Add new activity
        const created = await createActivity(
          currentActivity as Omit<Activity, 'id' | 'lastUpdated'>
        );
        setActivities([created, ...activities]);
        toast({
          title: "Activity added",
          description: `${created.title} has been added`,
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error saving activity",
        description: "An error occurred while saving. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setCurrentActivity(activity);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter(activity => activity.id !== id));
      toast({
        title: "Activity deleted",
        description: "The activity has been removed",
      });
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Error deleting activity",
        description: "An error occurred while deleting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCurrentActivity({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setIsEditing(!isEditing)} disabled={isSaving}>
            {isEditing ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Activity</>}
          </Button>
        </div>
        
        {isEditing && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">{currentActivity.id ? 'Edit Activity' : 'Add New Activity'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title *</label>
                <Input
                  name="title"
                  value={currentActivity.title || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Image URL *</label>
                <Input
                  name="image"
                  value={currentActivity.image || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={currentActivity.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Price Range</label>
                  <Input
                    name="priceRange"
                    value={currentActivity.priceRange || ''}
                    onChange={handleInputChange}
                    placeholder="₹100 - ₹500"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">Location</label>
                  <Input
                    name="location"
                    value={currentActivity.location || ''}
                    onChange={handleInputChange}
                    placeholder="Indiranagar, Bangalore"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Date</label>
                  <Input
                    name="date"
                    value={currentActivity.date || ''}
                    onChange={handleInputChange}
                    placeholder="May 15, 2025"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">Time</label>
                  <Input
                    name="time"
                    value={currentActivity.time || ''}
                    onChange={handleInputChange}
                    placeholder="6:00 PM - 9:00 PM"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  name="tags"
                  value={currentActivity.tags?.join(', ') || ''}
                  onChange={handleTagsChange}
                  placeholder="outdoor, family-friendly, weekend"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Category IDs (comma-separated)</label>
                <Input
                  name="categoryIds"
                  value={currentActivity.categoryIds?.join(', ') || ''}
                  onChange={handleCategoryChange}
                  placeholder="cat1, cat2, cat3"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Map Link</label>
                <Input
                  name="mapLink"
                  value={currentActivity.mapLink || ''}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Contact Info</label>
                <Input
                  name="contactInfo"
                  value={currentActivity.contactInfo || ''}
                  onChange={handleInputChange}
                  placeholder="Phone or email"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    currentActivity.id ? 'Update Activity' : 'Add Activity'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold mb-4">Activities Database</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.title}</TableCell>
                        <TableCell>{activity.location}</TableCell>
                        <TableCell>{activity.priceRange}</TableCell>
                        <TableCell>{activity.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(activity)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(activity.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No activities found. Add some activities to see them here.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
