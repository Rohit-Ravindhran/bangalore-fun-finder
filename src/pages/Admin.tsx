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
import { Plus, Edit, Trash, Loader2, Check } from 'lucide-react';
import { createActivity, deleteActivity, fetchActivities, updateActivity, fetchCategoriesFromTable, fetchTagsFromTable } from '@/services/activityService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";

type CategoryItem = {
  id: number;
  name: string;
};

type TagItem = {
  id: number;
  name: string;
};

const Admin = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
    loadCategoriesAndTags();
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

  const loadCategoriesAndTags = async () => {
    try {
      const categoriesData = await fetchCategoriesFromTable();
      const tagsData = await fetchTagsFromTable();
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load categories or tags:', error);
      toast({
        title: "Error loading categories or tags",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
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

  const updateCategoryIds = () => {
    const categoryIds = selectedCategories.map(id => id.toString());
    setCurrentActivity({
      ...currentActivity,
      categoryIds
    });
    return categoryIds;
  };

  const updateTagIds = () => {
    const tagIds = selectedTags.map(id => id.toString());
    setCurrentActivity({
      ...currentActivity,
      tags: tagIds
    });
    return tagIds;
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prevSelected => {
      const isSelected = prevSelected.includes(categoryId);
      const newSelected = isSelected
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId];
      
      // Update the currentActivity.categoryIds
      setCurrentActivity(prev => ({
        ...prev,
        categoryIds: newSelected.map(id => id.toString())
      }));
      
      return newSelected;
    });
  };

  const handleTagSelect = (tagId: number) => {
    setSelectedTags(prevSelected => {
      const isSelected = prevSelected.includes(tagId);
      const newSelected = isSelected
        ? prevSelected.filter(id => id !== tagId)
        : [...prevSelected, tagId];
      
      // Update the currentActivity.tags
      setCurrentActivity(prev => ({
        ...prev,
        tags: newSelected.map(id => id.toString())
      }));
      
      return newSelected;
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
      let activityToSave = { ...currentActivity };
      
      // Make sure categoryIds and tags are set properly
      if (!activityToSave.categoryIds || activityToSave.categoryIds.length === 0) {
        activityToSave.categoryIds = selectedCategories.map(id => id.toString());
      }
      
      if (!activityToSave.tags || activityToSave.tags.length === 0) {
        activityToSave.tags = selectedTags.map(id => id.toString());
      }

      if (currentActivity.id) {
        // Update existing activity

        
        const updated = await updateActivity(
          currentActivity.id, 
          activityToSave as Omit<Activity, 'id' | 'lastUpdated'>
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
        const { id, lastUpdated, ...activityData } = currentActivity;
const created = await createActivity(activityData as Omit<Activity, 'id' | 'lastUpdated'>);

      
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
        description: error instanceof Error ? error.message : "An error occurred while saving. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    // Convert string IDs to numbers for the selects
    const categoryIds = activity.categoryIds || [];
    const tagIds = activity.tags || [];
    
    setSelectedCategories(categoryIds.map(id => Number(id)).filter(id => !isNaN(id)));
    setSelectedTags(tagIds.map(id => Number(id)).filter(id => !isNaN(id)));
    
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
    setSelectedCategories([]);
    setSelectedTags([]);
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
                  placeholder="Use https:// URLs only (avoid Facebook URLs which may be blocked)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Note: Some image hosts (like Facebook) may block loading images directly.
                  Consider uploading to a different service if images don't appear.
                </p>
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
                <label className="block mb-1 text-sm font-medium">Categories</label>
                <div className="bg-white p-3 border rounded-md max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategorySelect(category.id)}
                        />
                        <label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block mb-1 text-xs text-gray-500">Selected Category IDs:</label>
                  <Input
                    name="categoryIds"
                    value={(currentActivity.categoryIds || []).join(', ')}
                    onChange={handleCategoryChange}
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Tags</label>
                <div className="bg-white p-3 border rounded-md max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag.id}`} 
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => handleTagSelect(tag.id)}
                        />
                        <label 
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tag.name} (ID: {tag.id})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block mb-1 text-xs text-gray-500">Selected Tag IDs:</label>
                  <Input
                    name="tags"
                    value={(currentActivity.tags || []).join(', ')}
                    onChange={handleTagsChange}
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Map Link</label>
                <Input
                  name="mapLink"
                  value={currentActivity.mapLink || ''}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Google Maps or other location link that opens in the map view
                </p>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Website URL</label>
                <Input
                  name="url"
                  value={currentActivity.url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/event"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Official website of the activity or event
                </p>
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
