import React, { useState, useEffect } from "react";
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
  MapPin,
  Database,
  LayoutDashboard,
  Star,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  createActivity,
  deleteActivity,
  fetchActivities,
  updateActivity,
  fetchCategoriesFromTable,
  fetchTagsFromTable,
} from "@/services/activityService";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import ActivityImageGenerator from "@/components/ActivityImageGenerator";
import AdminHighlights from "@/components/AdminHighlights";

// Client-side extractor for full Google Maps URLs (no network call needed)
function extractGoogleMapsCoords(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  const embedMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (embedMatch) return { lat: parseFloat(embedMatch[1]), lng: parseFloat(embedMatch[2]) };
  return null;
}

type Section = "activities" | "import" | "bulk" | "highlights" | "marketing";

type CategoryItem = { id: number; name: string };
type TagItem = { id: number; name: string };

// ─── Avatar ────────────────────────────────────────────────────────────────────
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/[\s._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const colors = [
    "bg-orange-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-pink-500",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-sm font-semibold select-none`}>
      {initials || "A"}
    </div>
  );
}

const Admin = () => {
  const [section, setSection] = useState<Section>("activities");
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
    success: number; failed: number; errors: string[];
  } | null>(null);
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingActivityIds, setDownloadingActivityIds] = useState<Set<string>>(new Set());
  const [marketingPage, setMarketingPage] = useState(0);
  const MARKETING_PAGE_SIZE = 20;
  const [isResolvingMap, setIsResolvingMap] = useState(false);
  const [coordsPreview, setCoordsPreview] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { toast } = useToast();
  const { logout, getAdminId, adminUsername } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
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
    } catch {
      toast({ title: "Error loading activities", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategoriesAndTags = async () => {
    try {
      const [cats, tgs] = await Promise.all([fetchCategoriesFromTable(), fetchTagsFromTable()]);
      setCategories(cats);
      setTags(tgs);
    } catch {
      // non-fatal
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentActivity((p) => ({ ...p, [name]: value }));
  };

  const resolveMapLink = async (url: string) => {
    if (!url || !url.startsWith("http")) return;
    setIsResolvingMap(true);
    setCoordsPreview(null);
    const clientCoords = extractGoogleMapsCoords(url);
    if (clientCoords) {
      setCurrentActivity((p) => ({ ...p, latitude: clientCoords.lat, longitude: clientCoords.lng }));
      setCoordsPreview(clientCoords);
      setIsResolvingMap(false);
      return;
    }
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
      const res = await fetch(`${supabaseUrl}/functions/v1/resolve-map-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (result.success && result.lat != null) {
        setCurrentActivity((p) => ({ ...p, latitude: result.lat, longitude: result.lng }));
        setCoordsPreview({ lat: result.lat, lng: result.lng });
      } else {
        toast({ title: "Could not extract location", description: result.error || "Try a full Google Maps URL", variant: "destructive", duration: 3000 });
      }
    } catch {
      toast({ title: "Location extraction failed", variant: "destructive", duration: 3000 });
    } finally {
      setIsResolvingMap(false);
    }
  };

  const handleCategorySelect = (id: number) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setCurrentActivity((p) => ({ ...p, categoryIds: next.map(String) }));
      return next;
    });
  };

  const handleTagSelect = (id: number) => {
    setSelectedTags((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setCurrentActivity((p) => ({ ...p, tags: next.map(String) }));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActivity.title || !currentActivity.image) {
      toast({ title: "Title and image are required", variant: "destructive" });
      return;
    }
    if (!currentActivity.mapLink) {
      toast({ title: "Map link is required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const activityToSave = {
        ...currentActivity,
        categoryIds: currentActivity.categoryIds?.length ? currentActivity.categoryIds : selectedCategories.map(String),
        tags: currentActivity.tags?.length ? currentActivity.tags : selectedTags.map(String),
      };
      if (currentActivity.id) {
        const result = await updateActivity(currentActivity.id, activityToSave as Omit<Activity, "id" | "lastUpdated">, getAdminId() || undefined);
        if (result.error || !result.data) throw new Error(result.error || "Failed to update");
        setActivities((prev) => prev.map((a) => (a.id === currentActivity.id ? result.data! : a)));
        toast({ title: "Activity updated" });
      } else {
        const { id, lastUpdated, ...activityData } = currentActivity;
        const result = await createActivity(activityData as Omit<Activity, "id" | "lastUpdated">, getAdminId() || undefined);
        if (result.error || !result.data) throw new Error(result.error || "Failed to create");
        setActivities((prev) => [result.data!, ...prev]);
        toast({ title: "Activity added", description: result.data!.title });
      }
      resetForm();
    } catch (err) {
      toast({ title: "Error saving", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setSelectedCategories((activity.categoryIds || []).map(Number).filter((n) => !isNaN(n)));
    setSelectedTags((activity.tags || []).map(Number).filter((n) => !isNaN(n)));
    setCurrentActivity(activity);
    setIsEditing(true);
    setCoordsPreview(activity.latitude != null && activity.longitude != null ? { lat: activity.latitude, lng: activity.longitude } : null);
    setSection("activities");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    try {
      const result = await deleteActivity(id, getAdminId() || undefined);
      if (!result.success) throw new Error(result.error || "Failed to delete");
      setActivities((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Activity deleted" });
    } catch (err) {
      toast({ title: "Error deleting", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setCurrentActivity({});
    setSelectedCategories([]);
    setSelectedTags([]);
    setIsEditing(false);
    setCoordsPreview(null);
  };

  const autoDetectCategoriesAndTags = (title: string, description: string) => {
    const content = `${title} ${description}`.toLowerCase();
    const categoryKeywords: Record<number, string[]> = {
      1: ["outdoor", "nature", "park", "garden", "hiking", "trek", "adventure", "cycling"],
      2: ["art", "paint", "draw", "craft", "creative", "workshop", "pottery", "sculpture"],
      3: ["music", "concert", "festival", "show", "performance", "band", "dj", "live"],
      4: ["sport", "football", "cricket", "tennis", "gym", "fitness", "yoga", "swimming"],
      5: ["theatre", "drama", "play", "actor", "stage", "comedy", "standup"],
      6: ["unique", "special", "exclusive", "limited", "rare", "unusual"],
      7: ["wellness", "meditation", "spa", "massage", "relax", "mindful", "health"],
      8: ["party", "celebration", "birthday", "dance", "club", "nightlife"],
      9: ["food", "restaurant", "cuisine", "dining", "cooking", "chef", "taste"],
      10: ["trek", "trekking", "mountain", "hill", "camping", "backpack"],
      11: ["family", "kids", "children", "parents", "playground", "fun"],
    };
    const tagKeywords: Record<number, string[]> = {
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
    const cats = Object.entries(categoryKeywords)
      .filter(([, kws]) => kws.some((kw) => content.includes(kw)))
      .map(([id]) => parseInt(id));
    const tgs = Object.entries(tagKeywords)
      .filter(([, kws]) => kws.some((kw) => content.includes(kw)))
      .map(([id]) => parseInt(id));
    return { categories: cats, tags: tgs };
  };

  const handleJsonImport = async () => {
    if (!jsonInput.trim()) { toast({ title: "No JSON provided", variant: "destructive" }); return; }
    setIsImporting(true);
    setImportResults(null);
    try {
      const jsonData = JSON.parse(jsonInput);
      const activitiesArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      let successCount = 0, failedCount = 0;
      const errors: string[] = [];
      for (const activityData of activitiesArray) {
        try {
          const detected = autoDetectCategoriesAndTags(activityData.title || "", activityData.description || "");
          const categoryIds = [...new Set([...(activityData.categoryIds || []), ...detected.categories.map(String)])];
          const tagIds = [...new Set([...(activityData.tags || []), ...detected.tags.map(String)])];
          const result = await createActivity({ ...activityData, categoryIds, tags: tagIds }, getAdminId() || undefined);
          if (result.error) throw new Error(result.error);
          successCount++;
        } catch (err) {
          failedCount++;
          errors.push(`"${activityData.title || "Unknown"}": ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      }
      setImportResults({ success: successCount, failed: failedCount, errors });
      if (successCount > 0) {
        toast({ title: "Import complete", description: `${successCount} imported${failedCount > 0 ? `, ${failedCount} failed` : ""}` });
        loadActivities();
        if (failedCount === 0) setJsonInput("");
      }
    } catch {
      toast({ title: "Invalid JSON", variant: "destructive" });
      setImportResults({ success: 0, failed: 1, errors: ["Invalid JSON format"] });
    } finally {
      setIsImporting(false);
    }
  };

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
  );
  const marketingTotalPages = Math.ceil(sortedActivities.length / MARKETING_PAGE_SIZE);
  const marketingPageItems  = sortedActivities.slice(
    marketingPage * MARKETING_PAGE_SIZE,
    (marketingPage + 1) * MARKETING_PAGE_SIZE
  );

  const handleDownloadAll = async () => {
    const latest = marketingPageItems;
    if (!latest.length) return;
    setIsDownloadingImages(true);
    setDownloadProgress(0);
    for (let i = 0; i < latest.length; i++) {
      setDownloadingActivityIds(new Set([latest[i].id]));
      await new Promise((r) => setTimeout(r, 1500));
      setDownloadProgress(Math.round(((i + 1) / latest.length) * 100));
    }
    setDownloadingActivityIds(new Set());
    setIsDownloadingImages(false);
    setDownloadProgress(0);
    toast({ title: "Download complete!", description: `${latest.length} images downloaded` });
  };

  const filteredActivities = activities.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.title?.toLowerCase().includes(q) || a.location?.toLowerCase().includes(q);
  });

  const sampleJsonStructure = `[
  {
    "title": "Sunset Yoga Session",
    "image": "https://example.com/yoga-sunset.jpg",
    "description": "Join us for a peaceful outdoor yoga session as the sun sets over Bangalore.",
    "priceRange": "₹300 - ₹500",
    "location": "Cubbon Park, Bangalore",
    "date": "December 15, 2025",
    "time": "5:30 PM - 6:30 PM",
    "mapLink": "https://maps.google.com/cubbon-park",
    "contactInfo": "+91 9876543210",
    "url": "https://yogastudio.com/sunset-session",
    "categoryIds": ["4", "7"],
    "tags": ["1", "8"]
  }
]`;

  // ─── Sidebar nav items ──────────────────────────────────────────────────────
  const navItems: { id: Section; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "activities", label: "Activities", icon: <Database className="h-4 w-4" /> },
    { id: "import",     label: "Import from BMS", icon: <FileText className="h-4 w-4" /> },
    { id: "bulk",       label: "Bulk JSON Import", icon: <Upload className="h-4 w-4" /> },
    { id: "highlights", label: "Highlights", icon: <Star className="h-4 w-4" /> },
    { id: "marketing",  label: "Marketing Images", icon: <ImageIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Admin</p>
          <h1 className="text-lg font-bold text-white leading-tight">
            Happ'nin <span className="text-orange-400">Bangalore</span>
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 pb-2 pt-1">Content</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); resetForm(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                ${section === item.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 pb-2">Tools</p>
            <Link
              to="/admin/scraped-events"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Scraped Events
              <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
            </Link>
            <Link
              to="/"
              target="_blank"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Site
            </Link>
          </div>
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-2.5 mb-3">
            <UserAvatar name={adminUsername || "Admin"} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{adminUsername || "Admin"}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {section === "activities" && "Activities Database"}
              {section === "import"     && "Import from BookMyShow"}
              {section === "bulk"       && "Bulk JSON Import"}
              {section === "highlights" && "Highlights"}
              {section === "marketing"  && "Marketing Images"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {section === "activities" && `${activities.length} total activities`}
              {section === "import"     && "Auto-fill from a BMS event link"}
              {section === "bulk"       && "Import multiple activities at once"}
              {section === "highlights" && "Manage featured content on the homepage"}
              {section === "marketing"  && "Generate social media images"}
            </p>
          </div>
          {section === "activities" && (
            <Button
              onClick={() => setIsEditing((v) => !v)}
              className="bg-orange-500 hover:bg-orange-600 gap-2"
              disabled={isSaving}
            >
              {isEditing ? "Cancel" : <><Plus className="h-4 w-4" /> Add Activity</>}
            </Button>
          )}
        </div>

        <div className="px-8 py-6">

          {/* ── ACTIVITIES SECTION ── */}
          {section === "activities" && (
            <div className="space-y-6">
              {/* Add / Edit form */}
              {isEditing && (
                <div className="bg-white rounded-xl border shadow-sm p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-5">
                    {currentActivity.id ? "Edit Activity" : "New Activity"}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block mb-1 text-xs font-medium text-gray-600">Title *</label>
                        <Input name="title" value={currentActivity.title || ""} onChange={handleInputChange} required />
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-1 text-xs font-medium text-gray-600">Image URL *</label>
                        <Input name="image" value={currentActivity.image || ""} onChange={handleInputChange} required placeholder="https://..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-1 text-xs font-medium text-gray-600">Description</label>
                        <Textarea name="description" value={currentActivity.description || ""} onChange={handleInputChange} rows={3} />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Price Range</label>
                        <Input name="priceRange" value={currentActivity.priceRange || ""} onChange={handleInputChange} placeholder="₹100 - ₹500" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Location</label>
                        <Input name="location" value={currentActivity.location || ""} onChange={handleInputChange} placeholder="Indiranagar, Bangalore" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Date</label>
                        <Input name="date" value={currentActivity.date || ""} onChange={handleInputChange} placeholder="May 15, 2025" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Time</label>
                        <Input name="time" value={currentActivity.time || ""} onChange={handleInputChange} placeholder="6:00 PM - 9:00 PM" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Categories</label>
                        <div className="border rounded-lg p-3 max-h-36 overflow-y-auto space-y-1.5">
                          {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => handleCategorySelect(cat.id)} />
                              {cat.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Tags</label>
                        <div className="border rounded-lg p-3 max-h-36 overflow-y-auto space-y-1.5">
                          {tags.map((tag) => (
                            <label key={tag.id} className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox checked={selectedTags.includes(tag.id)} onCheckedChange={() => handleTagSelect(tag.id)} />
                              {tag.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-xs font-medium text-gray-600">Map Link <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <Input
                          name="mapLink"
                          value={currentActivity.mapLink || ""}
                          onChange={handleInputChange}
                          onBlur={(e) => resolveMapLink(e.target.value)}
                          placeholder="https://maps.app.goo.gl/... or full Google Maps URL"
                          className={!currentActivity.mapLink ? "border-orange-300" : ""}
                          required
                        />
                        <Button type="button" variant="outline" size="sm" disabled={isResolvingMap || !currentActivity.mapLink} onClick={() => resolveMapLink(currentActivity.mapLink || "")}>
                          {isResolvingMap ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                        </Button>
                      </div>
                      {coordsPreview ? (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Check className="h-3 w-3" /> {coordsPreview.lat.toFixed(5)}, {coordsPreview.lng.toFixed(5)}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">Paste a Google Maps link to auto-extract coordinates</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Website URL</label>
                        <Input name="url" value={currentActivity.url || ""} onChange={handleInputChange} placeholder="https://..." />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Contact Info</label>
                        <Input name="contactInfo" value={currentActivity.contactInfo || ""} onChange={handleInputChange} placeholder="+91 9876543210" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                      <Button type="submit" disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : currentActivity.id ? "Update Activity" : "Add Activity"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Activities table */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center gap-3">
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs h-8 text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={loadActivities} className="ml-auto gap-1.5 text-gray-500">
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-16 text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity) => (
                          <TableRow key={activity.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-sm">{activity.title}</TableCell>
                            <TableCell className="text-sm text-gray-600">{activity.location}</TableCell>
                            <TableCell className="text-sm text-gray-600">{activity.priceRange}</TableCell>
                            <TableCell className="text-sm text-gray-400">{activity.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleEdit(activity)}>
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(activity.id)}>
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                            {searchQuery ? "No activities match your search" : "No activities yet. Add one above."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}

          {/* ── IMPORT FROM BMS ── */}
          {section === "import" && (
            <div className="max-w-lg">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Auto-fill event details from a BookMyShow link. The event will be added to the
                  <strong> Scraped Events</strong> queue for review before publishing.
                </p>
                <Link to="/admin/bms-import">
                  <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                    <FileText className="h-4 w-4" /> Open BMS Import Tool
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ── BULK JSON IMPORT ── */}
          {section === "bulk" && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm text-gray-600">Categories and tags are auto-detected from title and description.</p>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-600">JSON Data</label>
                  <Textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder="Paste your JSON array here..." rows={16} className="font-mono text-sm" />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleJsonImport} disabled={isImporting || !jsonInput.trim()} className="bg-orange-500 hover:bg-orange-600">
                    {isImporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Importing...</> : <><Upload className="mr-2 h-4 w-4" />Import</>}
                  </Button>
                  <Button variant="outline" onClick={() => setJsonInput(sampleJsonStructure)}>Load Sample</Button>
                  <Button variant="ghost" onClick={() => setJsonInput("")}>Clear</Button>
                </div>

                {importResults && (
                  <Alert className={importResults.failed === 0 ? "border-green-200 bg-green-50" : ""}>
                    <AlertDescription>
                      <p className="font-medium mb-1">Import Results</p>
                      <p className="text-sm">✅ {importResults.success} imported{importResults.failed > 0 ? ` · ❌ ${importResults.failed} failed` : ""}</p>
                      {importResults.errors.length > 0 && (
                        <ul className="text-xs text-red-600 mt-2 list-disc list-inside space-y-0.5">
                          {importResults.errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800">View JSON structure reference</summary>
                  <pre className="mt-3 bg-gray-50 border rounded p-3 overflow-x-auto text-xs">{sampleJsonStructure}</pre>
                </details>
              </div>
            </div>
          )}

          {/* ── HIGHLIGHTS ── */}
          {section === "highlights" && <AdminHighlights />}

          {/* ── MARKETING IMAGES ── */}
          {section === "marketing" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">
                      All Activities ({activities.length})
                    </h3>
                    <p className="text-sm text-gray-500">
                      Showing {marketingPage * MARKETING_PAGE_SIZE + 1}–
                      {Math.min((marketingPage + 1) * MARKETING_PAGE_SIZE, sortedActivities.length)} of{" "}
                      {sortedActivities.length} · newest first
                    </p>
                  </div>
                  <Button
                    disabled={marketingPageItems.length === 0 || isDownloadingImages}
                    onClick={handleDownloadAll}
                    className="bg-orange-500 hover:bg-orange-600 gap-2"
                  >
                    {isDownloadingImages ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />{downloadProgress}%</>
                    ) : (
                      <><Download className="h-4 w-4" />Download Page ({marketingPageItems.length})</>
                    )}
                  </Button>
                </div>

                {/* Progress bar */}
                {isDownloadingImages && (
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{downloadProgress}%</span>
                  </div>
                )}

                {/* List */}
                <div className="space-y-2">
                  {marketingPageItems.map((activity, i) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <span className="w-8 text-sm font-bold text-gray-300 text-center shrink-0">
                        {marketingPage * MARKETING_PAGE_SIZE + i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-gray-400">
                          {activity.location} · {activity.priceRange}
                        </p>
                      </div>
                      <ActivityImageGenerator
                        activity={activity}
                        autoDownload={downloadingActivityIds.has(activity.id)}
                        onImageGenerated={() => {
                          if (!isDownloadingImages)
                            toast({ title: "Image saved", description: activity.title });
                        }}
                      />
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-center py-8 text-gray-400 text-sm">
                      No activities available yet.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {marketingTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                    <span>
                      Page {marketingPage + 1} of {marketingTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline" size="sm"
                        onClick={() => setMarketingPage((p) => p - 1)}
                        disabled={marketingPage === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline" size="sm"
                        onClick={() => setMarketingPage((p) => p + 1)}
                        disabled={marketingPage >= marketingTotalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
