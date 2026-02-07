import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Activity } from "@/components/ActivityCard";
import {
  Plus,
  Edit,
  Trash,
  Loader2,
  Check,
  FileText,
  Upload,
  Sparkles,
  LogOut,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import {
  createActivity,
  deleteActivity,
  fetchActivities,
  updateActivity,
  fetchCategoriesFromTable,
  fetchTagsFromTable,
} from "@/services/activityService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import ActivityImageGenerator from "@/components/ActivityImageGenerator";

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
  const [jsonInput, setJsonInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingActivityIds, setDownloadingActivityIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

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
      console.error("Failed to load activities:", error);
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
      console.error("Failed to load categories or tags:", error);
      toast({
        title: "Error loading categories or tags",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentActivity({
      ...currentActivity,
      [name]: value,
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentActivity({
      ...currentActivity,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentActivity({
      ...currentActivity,
      categoryIds: e.target.value.split(",").map((id) => id.trim()),
    });
  };

  const updateCategoryIds = () => {
    const categoryIds = selectedCategories.map((id) => id.toString());
    setCurrentActivity({
      ...currentActivity,
      categoryIds,
    });
    return categoryIds;
  };

  const updateTagIds = () => {
    const tagIds = selectedTags.map((id) => id.toString());
    setCurrentActivity({
      ...currentActivity,
      tags: tagIds,
    });
    return tagIds;
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.includes(categoryId);
      const newSelected = isSelected
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId];

      // Update the currentActivity.categoryIds
      setCurrentActivity((prev) => ({
        ...prev,
        categoryIds: newSelected.map((id) => id.toString()),
      }));

      return newSelected;
    });
  };

  const handleTagSelect = (tagId: number) => {
    setSelectedTags((prevSelected) => {
      const isSelected = prevSelected.includes(tagId);
      const newSelected = isSelected
        ? prevSelected.filter((id) => id !== tagId)
        : [...prevSelected, tagId];

      // Update the currentActivity.tags
      setCurrentActivity((prev) => ({
        ...prev,
        tags: newSelected.map((id) => id.toString()),
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
      if (
        !activityToSave.categoryIds ||
        activityToSave.categoryIds.length === 0
      ) {
        activityToSave.categoryIds = selectedCategories.map((id) =>
          id.toString()
        );
      }

      if (!activityToSave.tags || activityToSave.tags.length === 0) {
        activityToSave.tags = selectedTags.map((id) => id.toString());
      }

      if (currentActivity.id) {
        // Update existing activity

        const updated = await updateActivity(
          currentActivity.id,
          activityToSave as Omit<Activity, "id" | "lastUpdated">
        );
        setActivities(
          activities.map((activity) =>
            activity.id === currentActivity.id ? updated : activity
          )
        );
        toast({
          title: "Activity updated",
          description: `${currentActivity.title} has been updated`,
        });
      } else {
        // Add new activity
        const { id, lastUpdated, ...activityData } = currentActivity;
        const created = await createActivity(
          activityData as Omit<Activity, "id" | "lastUpdated">
        );

        setActivities([created, ...activities]);
        toast({
          title: "Activity added",
          description: `${created.title} has been added`,
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast({
        title: "Error saving activity",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while saving. Please try again.",
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

    setSelectedCategories(
      categoryIds.map((id) => Number(id)).filter((id) => !isNaN(id))
    );
    setSelectedTags(tagIds.map((id) => Number(id)).filter((id) => !isNaN(id)));

    setCurrentActivity(activity);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      setActivities(activities.filter((activity) => activity.id !== id));
      toast({
        title: "Activity deleted",
        description: "The activity has been removed",
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
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

  // Auto-detect categories and tags from title and description
  const autoDetectCategoriesAndTags = (title: string, description: string) => {
    const content = `${title} ${description}`.toLowerCase();

    const detectedCategories: number[] = [];
    const detectedTags: number[] = [];

    // Category detection based on keywords
    const categoryKeywords = {
      1: [
        "outdoor",
        "nature",
        "park",
        "garden",
        "hiking",
        "trek",
        "adventure",
        "cycling",
      ],
      2: [
        "art",
        "paint",
        "draw",
        "craft",
        "creative",
        "workshop",
        "pottery",
        "sculpture",
      ],
      3: [
        "music",
        "concert",
        "festival",
        "show",
        "performance",
        "band",
        "dj",
        "live",
      ],
      4: [
        "sport",
        "football",
        "cricket",
        "tennis",
        "gym",
        "fitness",
        "yoga",
        "swimming",
      ],
      5: ["theatre", "drama", "play", "actor", "stage", "comedy", "standup"],
      6: ["unique", "special", "exclusive", "limited", "rare", "unusual"],
      7: [
        "wellness",
        "meditation",
        "spa",
        "massage",
        "relax",
        "mindful",
        "health",
      ],
      8: ["party", "celebration", "birthday", "dance", "club", "nightlife"],
      9: [
        "food",
        "restaurant",
        "cuisine",
        "dining",
        "cooking",
        "chef",
        "taste",
      ],
      10: ["trek", "trekking", "mountain", "hill", "camping", "backpack"],
      11: ["family", "kids", "children", "parents", "playground", "fun"],
    };

    // Tag detection based on keywords
    const tagKeywords = {
      1: ["free", "no cost", "complimentary"],
      2: ["premium", "luxury", "exclusive", "vip"],
      3: ["beginner", "starter", "introduction"],
      4: ["advanced", "expert", "professional"],
      5: ["weekend", "saturday", "sunday"],
      6: ["evening", "night", "after work"],
      7: ["morning", "early", "sunrise"],
      8: ["indoor", "inside", "covered"],
      9: ["couple", "romantic", "date", "valentine"],
      10: ["group", "team", "friends", "together"],
    };

    // Check for category matches
    Object.entries(categoryKeywords).forEach(([id, keywords]) => {
      if (keywords.some((keyword) => content.includes(keyword))) {
        detectedCategories.push(parseInt(id));
      }
    });

    // Check for tag matches
    Object.entries(tagKeywords).forEach(([id, keywords]) => {
      if (keywords.some((keyword) => content.includes(keyword))) {
        detectedTags.push(parseInt(id));
      }
    });

    return { categories: detectedCategories, tags: detectedTags };
  };

  // Handle JSON bulk import
  const handleJsonImport = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "No JSON provided",
        description: "Please paste your JSON data first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      const jsonData = JSON.parse(jsonInput);
      const activitiesArray = Array.isArray(jsonData) ? jsonData : [jsonData];

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const activityData of activitiesArray) {
        try {
          // Auto-detect categories and tags
          const detected = autoDetectCategoriesAndTags(
            activityData.title || "",
            activityData.description || ""
          );

          // Merge detected with provided categories/tags
          const categoryIds = [
            ...(activityData.categoryIds || []),
            ...detected.categories.map((id) => id.toString()),
          ].filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

          const tagIds = [
            ...(activityData.tags || []),
            ...detected.tags.map((id) => id.toString()),
          ].filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

          const processedActivity = {
            title: activityData.title || "",
            image: activityData.image || "",
            description: activityData.description || "",
            priceRange: activityData.priceRange || "Free",
            location: activityData.location || "Bangalore",
            date: activityData.date || "",
            time: activityData.time || "",
            mapLink: activityData.mapLink || "",
            contactInfo: activityData.contactInfo || "",
            url: activityData.url || "",
            categoryIds,
            tags: tagIds,
          };

          await createActivity(processedActivity);
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push(
            `Failed to import "${activityData.title || "Unknown"}": ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      setImportResults({ success: successCount, failed: failedCount, errors });

      if (successCount > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${successCount} activities${
            failedCount > 0 ? ` (${failedCount} failed)` : ""
          }`,
        });
        loadActivities(); // Refresh the activities list
        if (failedCount === 0) {
          setJsonInput(""); // Clear input only if all succeeded
        }
      }
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON format and try again",
        variant: "destructive",
      });
      setImportResults({
        success: 0,
        failed: 1,
        errors: ["Invalid JSON format"],
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Function to get the last 10 activities for image download
  const getLastTenActivities = () => {
    // Sort activities by creation date (newest first) and take the last 10
    return [...activities]
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated || 0);
        const dateB = new Date(b.lastUpdated || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
  };

  // Function to download all images
  const handleDownloadAll = async () => {
    const latestActivities = getLastTenActivities();
    if (latestActivities.length === 0) return;

    setIsDownloadingImages(true);
    setDownloadProgress(0);

    toast({
      title: "Starting bulk download",
      description: `Downloading ${latestActivities.length} images. Please wait...`,
    });

    for (let i = 0; i < latestActivities.length; i++) {
      const activity = latestActivities[i];
      setDownloadingActivityIds(new Set([activity.id]));
      
      // Wait for a small delay between downloads to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDownloadProgress(Math.round(((i + 1) / latestActivities.length) * 100));
    }

    setDownloadingActivityIds(new Set());
    setIsDownloadingImages(false);
    setDownloadProgress(0);

    toast({
      title: "Download complete!",
      description: `Successfully downloaded ${latestActivities.length} images`,
    });
  };

  const sampleJsonStructure = `[
  {
    "title": "Sunset Yoga Session",
    "image": "https://example.com/yoga-sunset.jpg",
    "description": "Join us for a peaceful outdoor yoga session as the sun sets over Bangalore. Perfect for beginners and experienced practitioners.",
    "priceRange": "₹300 - ₹500",
    "location": "Cubbon Park, Bangalore",
    "date": "December 15, 2025",
    "time": "5:30 PM - 6:30 PM",
    "mapLink": "https://maps.google.com/cubbon-park",
    "contactInfo": "+91 9876543210",
    "url": "https://yogastudio.com/sunset-session",
    "categoryIds": ["4", "7"],
    "tags": ["1", "8"]
  },
  {
    "title": "Food Truck Festival",
    "image": "https://example.com/food-truck.jpg",
    "description": "A weekend food festival featuring the best food trucks in the city. Family-friendly event with live music.",
    "priceRange": "₹200 - ₹800",
    "location": "Brigade Road, Bangalore",
    "date": "December 20-21, 2025",
    "time": "12:00 PM - 10:00 PM",
    "categoryIds": ["9", "11"],
    "tags": ["5", "10"]
  }
]`;

  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/bms-import">
                <FileText className="mr-2 h-4 w-4" /> Import from BMS
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="single" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single">Single Activity</TabsTrigger>
            <TabsTrigger value="bulk">Bulk JSON Import</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Images</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
              >
                {isEditing ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add Activity
                  </>
                )}
              </Button>
            </div>

            {isEditing && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-4">
                  {currentActivity.id ? "Edit Activity" : "Add New Activity"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Title *
                    </label>
                    <Input
                      name="title"
                      value={currentActivity.title || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Image URL *
                    </label>
                    <Input
                      name="image"
                      value={currentActivity.image || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Use https:// URLs only (avoid Facebook URLs which may be blocked)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Some image hosts (like Facebook) may block loading
                      images directly. Consider uploading to a different service
                      if images don't appear.
                    </p>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={currentActivity.description || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Price Range
                      </label>
                      <Input
                        name="priceRange"
                        value={currentActivity.priceRange || ""}
                        onChange={handleInputChange}
                        placeholder="₹100 - ₹500"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Location
                      </label>
                      <Input
                        name="location"
                        value={currentActivity.location || ""}
                        onChange={handleInputChange}
                        placeholder="Indiranagar, Bangalore"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Date
                      </label>
                      <Input
                        name="date"
                        value={currentActivity.date || ""}
                        onChange={handleInputChange}
                        placeholder="May 15, 2025"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Time
                      </label>
                      <Input
                        name="time"
                        value={currentActivity.time || ""}
                        onChange={handleInputChange}
                        placeholder="6:00 PM - 9:00 PM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Categories
                    </label>
                    <div className="bg-white p-3 border rounded-md max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() =>
                                handleCategorySelect(category.id)
                              }
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
                      <label className="block mb-1 text-xs text-gray-500">
                        Selected Category IDs:
                      </label>
                      <Input
                        name="categoryIds"
                        value={(currentActivity.categoryIds || []).join(", ")}
                        onChange={handleCategoryChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Tags
                    </label>
                    <div className="bg-white p-3 border rounded-md max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {tags.map((tag) => (
                          <div
                            key={tag.id}
                            className="flex items-center space-x-2"
                          >
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
                      <label className="block mb-1 text-xs text-gray-500">
                        Selected Tag IDs:
                      </label>
                      <Input
                        name="tags"
                        value={(currentActivity.tags || []).join(", ")}
                        onChange={handleTagsChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Map Link
                    </label>
                    <Input
                      name="mapLink"
                      value={currentActivity.mapLink || ""}
                      onChange={handleInputChange}
                      placeholder="https://maps.google.com/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Google Maps or other location link that opens in the map
                      view
                    </p>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Website URL
                    </label>
                    <Input
                      name="url"
                      value={currentActivity.url || ""}
                      onChange={handleInputChange}
                      placeholder="https://example.com/event"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Official website of the activity or event
                    </p>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Contact Info
                    </label>
                    <Input
                      name="contactInfo"
                      value={currentActivity.contactInfo || ""}
                      onChange={handleInputChange}
                      placeholder="Phone or email"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : currentActivity.id ? (
                        "Update Activity"
                      ) : (
                        "Add Activity"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="h-5 w-5" />
                <h2 className="text-xl font-bold">Bulk JSON Import</h2>
                <Sparkles
                  className="h-4 w-4 text-yellow-500"
                  title="Auto-detects categories and tags!"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    JSON Data
                  </label>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste your JSON data here..."
                    rows={18}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    <Sparkles className="inline h-3 w-3 mr-1 text-yellow-500" />
                    Categories and tags will be auto-detected from title and
                    description!
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleJsonImport}
                    disabled={isImporting || !jsonInput.trim()}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Activities
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setJsonInput(sampleJsonStructure)}
                  >
                    Load Sample JSON
                  </Button>
                  <Button variant="ghost" onClick={() => setJsonInput("")}>
                    Clear
                  </Button>
                </div>

                {importResults && (
                  <Alert>
                    <AlertDescription>
                      <div className="space-y-2">
                        <div>
                          <strong>Import Results:</strong>
                        </div>
                        <div className="text-sm">
                          ✅ Successfully imported: {importResults.success}{" "}
                          activities
                          <br />
                          {importResults.failed > 0 && (
                            <>❌ Failed: {importResults.failed} activities</>
                          )}
                        </div>
                        {importResults.errors.length > 0 && (
                          <div className="text-sm text-red-600 mt-2">
                            <strong>Errors:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {importResults.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Sample JSON Structure:</h3>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                  <code>{sampleJsonStructure}</code>
                </pre>
                <div className="mt-3 text-xs text-gray-600">
                  <p>
                    <strong>Field Descriptions:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>
                      <code>title</code>*: Activity name (required)
                    </li>
                    <li>
                      <code>image</code>*: Image URL (required, use https://
                      URLs)
                    </li>
                    <li>
                      <code>description</code>: Detailed description (used for
                      auto-detection)
                    </li>
                    <li>
                      <code>priceRange</code>: Price range (e.g., "₹300 - ₹500"
                      or "Free")
                    </li>
                    <li>
                      <code>location</code>: Activity location
                    </li>
                    <li>
                      <code>date</code>: Event date
                    </li>
                    <li>
                      <code>time</code>: Event time
                    </li>
                    <li>
                      <code>mapLink</code>: Google Maps or location link
                    </li>
                    <li>
                      <code>contactInfo</code>: Phone or email
                    </li>
                    <li>
                      <code>url</code>: Official website
                    </li>
                    <li>
                      <code>categoryIds</code>: Array of category IDs (will be
                      merged with auto-detected)
                    </li>
                    <li>
                      <code>tags</code>: Array of tag IDs (will be merged with
                      auto-detected)
                    </li>
                  </ul>
                  <p className="mt-2 text-yellow-700">
                    <Sparkles className="inline h-3 w-3 mr-1" />
                    <strong>Auto-Detection:</strong> Categories and tags are
                    automatically detected from title and description using
                    keyword matching!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5" />
                <h2 className="text-xl font-bold">Download Marketing Images</h2>
              </div>
              
              <Alert className="mb-6">
                <AlertDescription>
                  Download professionally formatted images of the latest activities for social media and marketing purposes. Each image includes the Happ'nin Bangalore branding and activity details.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">Latest 10 Activities</h3>
                    <p className="text-sm text-gray-600">
                      {activities.length > 0 
                        ? `${Math.min(10, activities.length)} images will be generated`
                        : 'No activities available'}
                    </p>
                    {isDownloadingImages && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{downloadProgress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    disabled={activities.length === 0 || isDownloadingImages}
                    onClick={handleDownloadAll}
                    className="gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    {isDownloadingImages ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Downloading {downloadProgress}%
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download All ({Math.min(10, activities.length)})
                      </>
                    )}
                  </Button>
                </div>

                {/* Display the last 10 activities with download buttons */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Activities:</h3>
                  <div className="grid gap-4">
                    {getLastTenActivities().map((activity, index) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center font-bold text-orange-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-gray-500">{activity.location} • {activity.priceRange}</p>
                          </div>
                        </div>
                        <ActivityImageGenerator 
                          activity={activity}
                          autoDownload={downloadingActivityIds.has(activity.id)}
                          onImageGenerated={() => {
                            if (!isDownloadingImages) {
                              toast({
                                title: "Image downloaded",
                                description: `${activity.title} image saved successfully`,
                              });
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {activities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No activities available. Add some activities first.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
                        <TableCell className="font-medium">
                          {activity.title}
                        </TableCell>
                        <TableCell>{activity.location}</TableCell>
                        <TableCell>{activity.priceRange}</TableCell>
                        <TableCell>{activity.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(activity)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(activity.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No activities found. Add some activities to see them
                        here.
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
