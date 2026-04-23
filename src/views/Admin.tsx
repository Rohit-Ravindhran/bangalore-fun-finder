'use client'

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
  Instagram,
  TrendingUp,
  X,
  BarChart2,
  Users,
  Eye,
  Clock,
  MousePointerClick,
} from "lucide-react";
import {
  createActivity,
  deleteActivity,
  fetchActivities,
  updateActivity,
  fetchCategoriesFromTable,
  fetchTagsFromTable,
  uploadActivityImage,
} from "@/services/activityService";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import ActivityImageGenerator from "@/components/ActivityImageGenerator";
import AdminHighlights from "@/components/AdminHighlights";
import { listTrending, addTrending, removeTrending, TrendingActivity } from "@/services/trendingService";

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

type Section = "activities" | "import" | "instagram" | "bulk" | "highlights" | "marketing" | "trending" | "insights";

type AnalyticsEvent = {
  id: string
  event_type: string
  session_id: string
  pathname: string | null
  activity_id: string | null
  activity_title: string | null
  os: string | null
  referrer: string | null
  landing_method: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  duration_seconds: number | null
  created_at: string
}

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
  const [trendingList, setTrendingList] = useState<TrendingActivity[]>([]);
  const [trendingIds, setTrendingIds] = useState<Set<number>>(new Set());
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingSearch, setTrendingSearch] = useState("");
  const [isResolvingMap, setIsResolvingMap] = useState(false);
  const [coordsPreview, setCoordsPreview] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[] | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsDays, setAnalyticsDays] = useState(30);

  const { toast } = useToast();
  const { logout, getAdminId, adminUsername } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
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

  const loadTrending = async () => {
    setIsTrendingLoading(true);
    try {
      const { data, error } = await listTrending();
      if (error) throw new Error(error);
      setTrendingList(data);
      setTrendingIds(new Set(data.map((t) => t.activity_id)));
    } catch {
      toast({ title: "Error loading trending list", variant: "destructive" });
    } finally {
      setIsTrendingLoading(false);
    }
  };

  const loadAnalytics = async (days = analyticsDays) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setAnalyticsData(json.data);
    } catch {
      toast({ title: "Error loading analytics", variant: "destructive" });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAddTrending = async (activityId: string) => {
    const adminId = getAdminId();
    if (!adminId) return;
    const { error } = await addTrending(activityId, adminId, trendingList.length);
    if (error) {
      toast({ title: "Failed to add to trending", description: error, variant: "destructive" });
    } else {
      toast({ title: "Added to trending" });
      loadTrending();
    }
  };

  const handleRemoveTrending = async (activityId: number) => {
    const adminId = getAdminId();
    if (!adminId) return;
    const { error } = await removeTrending(activityId, adminId);
    if (error) {
      toast({ title: "Failed to remove from trending", description: error, variant: "destructive" });
    } else {
      toast({ title: "Removed from trending" });
      loadTrending();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentActivity((p) => ({ ...p, [name]: value }));
  };

  const resolveMapLink = async (url: string) => {
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') return;
      const isGoogleMaps = parsed.hostname === 'maps.google.com' ||
        parsed.hostname === 'www.google.com' ||
        parsed.hostname === 'goo.gl' ||
        parsed.hostname === 'maps.app.goo.gl';
      if (!isGoogleMaps) return;
    } catch {
      return;
    }
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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
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

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    const { url, error } = await uploadActivityImage(file);
    setIsUploadingImage(false);
    if (error) {
      toast({ title: "Image upload failed", description: error, variant: "destructive" });
    } else if (url) {
      setCurrentActivity((p) => ({ ...p, image: url }));
      toast({ title: "Image uploaded" });
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
    { id: "trending",   label: "Trending", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "insights",   label: "Insights", icon: <BarChart2 className="h-4 w-4" /> },
    { id: "import",     label: "Import from BMS", icon: <FileText className="h-4 w-4" /> },
    { id: "instagram",  label: "Import from Screenshots", icon: <Instagram className="h-4 w-4" /> },
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
            Happenin <span className="text-[#FFD60A]">Bangalore</span>
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 pb-2 pt-1">Content</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); resetForm(); if (item.id === "trending") loadTrending(); if (item.id === "insights") loadAnalytics(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                ${section === item.id
                  ? "bg-[#FFD60A] text-black"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="pt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 pb-2">Tools</p>
            <Link
              href="/admin/scraped-events"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Scraped Events
              <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
            </Link>
            <Link
              href="/"
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
              {section === "trending"   && "Trending Activities"}
              {section === "insights"   && "Insights"}
              {section === "import"     && "Import from BookMyShow"}
              {section === "instagram"  && "Import from Screenshots"}
              {section === "bulk"       && "Bulk JSON Import"}
              {section === "highlights" && "Highlights"}
              {section === "marketing"  && "Marketing Images"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {section === "activities" && `${activities.length} total activities`}
              {section === "trending"   && `${trendingList.length} activities currently trending`}
              {section === "insights"   && `Analytics for the last ${analyticsDays} days`}
              {section === "import"     && "Auto-fill from a BMS event link"}
              {section === "instagram"  && "Paste screenshots and let AI extract event details"}
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
                        <label className="block mb-1 text-xs font-medium text-gray-600">Image *</label>
                        <div className="flex gap-2">
                          <Input name="image" value={currentActivity.image || ""} onChange={handleInputChange} placeholder="https://... or upload below" className="flex-1" />
                          <label className="flex-shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
                            />
                            <Button type="button" variant="outline" size="sm" disabled={isUploadingImage} className="h-10 gap-1.5" asChild>
                              <span className="cursor-pointer">
                                {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {isUploadingImage ? "Uploading…" : "Upload"}
                              </span>
                            </Button>
                          </label>
                        </div>
                        {currentActivity.image && (
                          <img src={currentActivity.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
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

          {/* ── TRENDING ── */}
          {section === "trending" && (
            <div className="space-y-6 max-w-4xl">
              {/* Current trending list */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Current Trending List</h3>
                  <Button variant="ghost" size="sm" onClick={loadTrending} className="gap-1.5 text-gray-500">
                    <RefreshCw className={`h-3.5 w-3.5 ${isTrendingLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
                {isTrendingLoading ? (
                  <div className="flex justify-center py-10 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : trendingList.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No trending activities yet. Mark some below.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-8">#</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right w-20">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trendingList.map((t, i) => (
                        <TableRow key={t.trending_id} className="hover:bg-gray-50">
                          <TableCell className="text-sm text-gray-400 font-mono">{i + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {t.image && (
                                <img src={t.image} alt={t.title} className="h-9 w-14 object-cover rounded" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                              )}
                              <span className="text-sm font-medium text-gray-900">{t.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">{t.location}</TableCell>
                          <TableCell className="text-sm text-gray-500">{t.date}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveTrending(t.activity_id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Add activities to trending */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add Activity to Trending</h3>
                <Input
                  placeholder="Search activities..."
                  value={trendingSearch}
                  onChange={(e) => setTrendingSearch(e.target.value)}
                  className="mb-4 max-w-sm h-8 text-sm"
                />
                {isLoading ? (
                  <div className="flex justify-center py-8 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right w-28">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities
                        .filter((a) => {
                          if (!trendingSearch) return true;
                          const q = trendingSearch.toLowerCase();
                          return a.title?.toLowerCase().includes(q) || a.location?.toLowerCase().includes(q);
                        })
                        .slice(0, 50)
                        .map((activity) => {
                          const isT = trendingIds.has(Number(activity.id));
                          return (
                            <TableRow key={activity.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-sm">{activity.title}</TableCell>
                              <TableCell className="text-sm text-gray-500">{activity.location}</TableCell>
                              <TableCell className="text-sm text-gray-500">{activity.date}</TableCell>
                              <TableCell className="text-right">
                                {isT ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                    <TrendingUp className="h-3 w-3" /> Trending
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => handleAddTrending(activity.id)}
                                  >
                                    <TrendingUp className="h-3 w-3" /> Mark Trending
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
                <Link href="/admin/bms-import">
                  <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                    <FileText className="h-4 w-4" /> Open BMS Import Tool
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ── IMPORT FROM INSTAGRAM ── */}
          {section === "instagram" && (
            <div className="max-w-lg">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Import from Screenshots</p>
                    <p className="text-xs text-gray-500">Powered by Claude AI vision</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-5">
                  Paste or drag screenshots from an Instagram post — the AI will extract the title, date, location, price, and other details automatically.
                  The event is added to the <strong>Scraped Events</strong> queue for review before publishing.
                </p>
                <Link href="/admin/instagram-import">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2">
                    <Instagram className="h-4 w-4" /> Open Screenshot Import
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

          {/* ── INSIGHTS ── */}
          {section === "insights" && (() => {
            const topN = (map: Map<string, number>, n = 10) =>
              [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

            const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

            let statCards = { sessions: 0, pageViews: 0, clicks: 0, avgDuration: "—" };
            let topPages: [string, number][] = [];
            let topActivities: [string, number][] = [];
            let sources: [string, number][] = [];
            let osCounts: [string, number][] = [];
            let eventTypeCounts: [string, number][] = [];
            let dailyViews: { date: string; count: number }[] = [];

            if (analyticsData) {
              const sessions = new Set(analyticsData.map((e) => e.session_id));
              const pageViews = analyticsData.filter((e) => e.event_type === "page_view");
              const clicks = analyticsData.filter((e) => e.event_type === "activity_click" || e.event_type === "click");
              const durations = analyticsData
                .filter((e) => e.duration_seconds != null && e.duration_seconds > 0)
                .map((e) => e.duration_seconds as number);
              const avgSec = durations.length
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : null;
              const avgDurationStr = avgSec != null
                ? avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`
                : "—";

              const pageMap = new Map<string, number>();
              pageViews.forEach((e) => {
                const key = e.pathname ?? "(unknown)";
                pageMap.set(key, (pageMap.get(key) ?? 0) + 1);
              });

              const actMap = new Map<string, number>();
              analyticsData
                .filter((e) => e.activity_title)
                .forEach((e) => {
                  const key = e.activity_title!;
                  actMap.set(key, (actMap.get(key) ?? 0) + 1);
                });

              const srcMap = new Map<string, number>();
              analyticsData.forEach((e) => {
                const src = e.utm_source ?? (e.referrer ? new URL(e.referrer.startsWith("http") ? e.referrer : `https://${e.referrer}`).hostname.replace(/^www\./, "") : null) ?? "Direct";
                srcMap.set(src, (srcMap.get(src) ?? 0) + 1);
              });

              const osMap = new Map<string, number>();
              analyticsData.forEach((e) => {
                const key = e.os ?? "Unknown";
                osMap.set(key, (osMap.get(key) ?? 0) + 1);
              });

              const etMap = new Map<string, number>();
              analyticsData.forEach((e) => {
                etMap.set(e.event_type, (etMap.get(e.event_type) ?? 0) + 1);
              });

              // Daily page views (last N days buckets)
              const buckets = new Map<string, number>();
              pageViews.forEach((e) => {
                const day = e.created_at.slice(0, 10);
                buckets.set(day, (buckets.get(day) ?? 0) + 1);
              });
              const sortedDays = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
              dailyViews = sortedDays.map(([date, count]) => ({ date, count }));

              statCards = { sessions: sessions.size, pageViews: pageViews.length, clicks: clicks.length, avgDuration: avgDurationStr };
              topPages = topN(pageMap);
              topActivities = topN(actMap);
              sources = topN(srcMap, 8);
              osCounts = topN(osMap, 6);
              eventTypeCounts = topN(etMap, 8);
            }

            const maxDailyCount = Math.max(...dailyViews.map((d) => d.count), 1);

            return (
              <div className="space-y-6">
                {/* Controls */}
                <div className="flex items-center gap-3">
                  <select
                    value={analyticsDays}
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setAnalyticsDays(d);
                      loadAnalytics(d);
                    }}
                    className="text-sm border rounded-lg px-3 py-1.5 bg-white shadow-sm"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadAnalytics()}
                    disabled={analyticsLoading}
                    className="gap-1.5"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${analyticsLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  {analyticsData && (
                    <span className="text-xs text-gray-400">{analyticsData.length.toLocaleString()} events loaded</span>
                  )}
                </div>

                {analyticsLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
                  </div>
                ) : !analyticsData ? (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                    <BarChart2 className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No data loaded yet — click Refresh to load analytics.</p>
                  </div>
                ) : analyticsData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                    <BarChart2 className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No events recorded in this period.</p>
                  </div>
                ) : (
                  <>
                    {/* ── Stat cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Unique Sessions", value: fmt(statCards.sessions), icon: <Users className="h-4 w-4 text-blue-500" /> },
                        { label: "Page Views", value: fmt(statCards.pageViews), icon: <Eye className="h-4 w-4 text-green-500" /> },
                        { label: "Activity Clicks", value: fmt(statCards.clicks), icon: <MousePointerClick className="h-4 w-4 text-orange-500" /> },
                        { label: "Avg Session Duration", value: statCards.avgDuration, icon: <Clock className="h-4 w-4 text-purple-500" /> },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4">
                          <div className="p-2.5 bg-gray-50 rounded-lg">{icon}</div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Daily page views sparkline ── */}
                    {dailyViews.length > 1 && (
                      <div className="bg-white rounded-xl border shadow-sm p-6">
                        <p className="text-sm font-semibold text-gray-700 mb-4">Page Views Over Time</p>
                        <div className="flex items-end gap-1 h-24">
                          {dailyViews.map(({ date, count }) => (
                            <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                              <div
                                className="w-full bg-orange-400 rounded-t group-hover:bg-orange-500 transition-colors"
                                style={{ height: `${Math.max(4, Math.round((count / maxDailyCount) * 88))}px` }}
                              />
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                                {date}: {count}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                          <span>{dailyViews[0]?.date}</span>
                          <span>{dailyViews[dailyViews.length - 1]?.date}</span>
                        </div>
                      </div>
                    )}

                    {/* ── Two-column tables ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Top Pages */}
                      <div className="bg-white rounded-xl border shadow-sm p-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Top Pages</p>
                        <div className="space-y-2">
                          {topPages.map(([page, count]) => {
                            const pct = Math.round((count / (topPages[0]?.[1] ?? 1)) * 100);
                            return (
                              <div key={page} className="space-y-0.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700 truncate max-w-[70%]" title={page}>{page}</span>
                                  <span className="text-gray-500 font-medium">{count.toLocaleString()}</span>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full">
                                  <div className="h-1 bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Top Activities */}
                      <div className="bg-white rounded-xl border shadow-sm p-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Most Viewed Activities</p>
                        <div className="space-y-2">
                          {topActivities.length === 0 ? (
                            <p className="text-xs text-gray-400">No activity views recorded.</p>
                          ) : topActivities.map(([title, count]) => {
                            const pct = Math.round((count / (topActivities[0]?.[1] ?? 1)) * 100);
                            return (
                              <div key={title} className="space-y-0.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700 truncate max-w-[70%]" title={title}>{title}</span>
                                  <span className="text-gray-500 font-medium">{count.toLocaleString()}</span>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full">
                                  <div className="h-1 bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Traffic Sources */}
                      <div className="bg-white rounded-xl border shadow-sm p-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Traffic Sources</p>
                        <div className="space-y-2">
                          {sources.map(([src, count]) => {
                            const pct = Math.round((count / (sources[0]?.[1] ?? 1)) * 100);
                            return (
                              <div key={src} className="space-y-0.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700 truncate max-w-[70%]">{src}</span>
                                  <span className="text-gray-500 font-medium">{count.toLocaleString()}</span>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full">
                                  <div className="h-1 bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* OS & Event Types */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl border shadow-sm p-6">
                          <p className="text-sm font-semibold text-gray-700 mb-3">OS Breakdown</p>
                          <div className="flex flex-wrap gap-2">
                            {osCounts.map(([os, count]) => (
                              <span key={os} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                                {os}
                                <span className="bg-white rounded-full px-1.5 py-0.5 text-gray-500">{count}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border shadow-sm p-6">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Event Types</p>
                          <div className="flex flex-wrap gap-2">
                            {eventTypeCounts.map(([et, count]) => (
                              <span key={et} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-xs font-medium text-orange-700">
                                {et.replace(/_/g, " ")}
                                <span className="bg-orange-100 rounded-full px-1.5 py-0.5">{count}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

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
