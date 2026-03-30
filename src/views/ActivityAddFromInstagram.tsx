'use client'

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { saveScrapedActivity } from "@/services/scrapedActivityService";
import { fetchCategoriesFromTable, fetchTagsFromTable } from "@/services/activityService";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Instagram,
  ImagePlus,
  Sparkles,
  CheckCircle2,
  X,
  ArrowLeft,
  Send,
  AlertCircle,
  Upload,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ExtractedData {
  title: string | null;
  description: string | null;
  image_url: string | null;
  price_range: string | null;
  location: string | null;
  date: string | null;
  time: string | null;
  contact_info: string | null;
  url: string | null;
  instagram_handle: string | null;
  suggested_category_ids: string[] | null;
  suggested_tags: string[] | null;
}

interface UploadedImage {
  id: string;
  dataUrl: string;   // for preview
  base64: string;    // just the base64 data (no prefix)
  mediaType: string;
  name: string;
}

type CategoryItem = { id: number; name: string };
type TagItem = { id: number; name: string };

// ─── Helpers ────────────────────────────────────────────────────────────────

function dataUrlToBase64(dataUrl: string): { base64: string; mediaType: string } {
  const [header, base64] = dataUrl.split(",");
  const mediaType = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  return { base64, mediaType };
}

async function fileToUploadedImage(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const { base64, mediaType } = dataUrlToBase64(dataUrl);
      resolve({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dataUrl,
        base64,
        mediaType,
        name: file.name,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

const ActivityAddFromInstagram = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state (pre-filled from extraction)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [url, setUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState("");

  // Category / tag data
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [dbTags, setDbTags] = useState<TagItem[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const { getAdminId } = useAuth();
  const router = useRouter();

  // Load categories and tags on mount
  useEffect(() => {
    fetchCategoriesFromTable().then(setCategories).catch(() => {});
    fetchTagsFromTable().then(setDbTags).catch(() => {});
  }, []);

  // ─── Paste handler (Ctrl+V anywhere on the page) ─────────────────────────
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (showReviewDialog) return; // Don't capture paste inside dialog
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        await addFiles(imageFiles);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [images, showReviewDialog]);

  // ─── File helpers ────────────────────────────────────────────────────────

  const addFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    const remaining = 6 - images.length;
    const toProcess = imageFiles.slice(0, remaining);

    const newImages = await Promise.all(toProcess.map(fileToUploadedImage));
    setImages((prev) => [...prev, ...newImages]);

    if (imageFiles.length > remaining) {
      toast({ title: "Max 6 screenshots", description: `Only the first ${remaining} were added.`, variant: "destructive" });
    }
  }, [images.length, toast]);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // ─── Drag & drop ─────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await addFiles(files);
  };

  // ─── Extraction ──────────────────────────────────────────────────────────

  const handleExtract = async () => {
    if (images.length === 0) return;
    setIsExtracting(true);

    try {
      const { data, error } = await supabase.functions.invoke("extract-from-instagram", {
        body: {
          images: images.map((img) => ({
            data: img.base64,
            mediaType: img.mediaType,
          })),
        },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error ?? "Extraction failed");

      const extracted: ExtractedData = data.data;

      // Pre-fill form
      setTitle(extracted.title ?? "");
      setDescription(extracted.description ?? "");
      setImageUrl(extracted.image_url ?? "");
      setMapLink("");
      setPriceRange(extracted.price_range ?? "");
      setLocation(extracted.location ?? "");
      setDate(extracted.date ?? "");
      setTime(extracted.time ?? "");
      setContactInfo(extracted.contact_info ?? "");
      setUrl(extracted.url ?? (extracted.instagram_handle ? `https://instagram.com/${extracted.instagram_handle.replace(/^@/, "")}` : ""));
      setSelectedCategories(extracted.suggested_category_ids ?? []);

      // Map suggested tags to DB tag IDs where possible, rest as custom
      if (extracted.suggested_tags && dbTags.length > 0) {
        const matched: string[] = [];
        const unmatched: string[] = [];
        for (const tag of extracted.suggested_tags) {
          const dbTag = dbTags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
          if (dbTag) matched.push(String(dbTag.id));
          else unmatched.push(tag);
        }
        setSelectedTagIds(matched);
        setCustomTags(unmatched.join(", "));
      } else if (extracted.suggested_tags) {
        setCustomTags(extracted.suggested_tags.join(", "));
      }

      setShowReviewDialog(true);
    } catch (err: unknown) {
      toast({
        title: "Extraction failed",
        description: err instanceof Error ? err.message : "Could not extract details from the screenshots.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  // ─── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    const adminId = getAdminId();
    setIsSaving(true);

    try {
      // Merge selected DB tag ids with custom tags as strings
      const allTags = [
        ...selectedTagIds,
        ...customTags.split(",").map((t) => t.trim()).filter(Boolean),
      ];

      const result = await saveScrapedActivity(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          image: imageUrl.trim() || undefined,
          priceRange: priceRange.trim() || undefined,
          location: location.trim() || undefined,
          date: date.trim() || undefined,
          time: time.trim() || undefined,
          mapLink: mapLink.trim() || undefined,
          contactInfo: contactInfo.trim() || undefined,
          url: url.trim() || undefined,
          categoryIds: selectedCategories,
          tags: allTags,
          source: "instagram",
          sectionType: "all",
        },
        adminId ?? undefined
      );

      if (result.error) throw new Error(result.error);

      setSavedSuccess(true);
      setShowReviewDialog(false);
      toast({
        title: "Saved for review",
        description: `Quality score: ${result.qualityScore ?? "—"}. Check Scraped Events to approve.`,
      });
    } catch (err: unknown) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setShowReviewDialog(false);
    setSavedSuccess(false);
    setTitle(""); setDescription(""); setImageUrl(""); setMapLink("");
    setPriceRange(""); setLocation(""); setDate(""); setTime("");
    setContactInfo(""); setUrl("");
    setSelectedCategories([]); setSelectedTagIds([]); setCustomTags("");
  };

  // ─── Category helpers ────────────────────────────────────────────────────

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // ─── Missing field detection ──────────────────────────────────────────────

  const missingFields = [
    !title.trim() && "Title",
    !imageUrl.trim() && "Image URL",
    !mapLink.trim() && "Map Link",
    !location.trim() && "Location",
    !date.trim() && "Date",
    !priceRange.trim() && "Price",
  ].filter(Boolean) as string[];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="gap-1 text-gray-600">
          <ArrowLeft className="h-4 w-4" /> Admin
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-1.5">
            <Instagram className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Import from Screenshots</h1>
            <p className="text-xs text-gray-500">Paste screenshots → AI extracts details → review & save</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 flex gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
          <p>
            <strong>How to use:</strong> Take screenshots of the Instagram post (caption, flyer, story) and paste or drag them below.
            You can add up to 6 images. The AI will extract the event details automatically.
          </p>
        </div>

        {/* Drop zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => images.length < 6 && fileInputRef.current?.click()}
          className={[
            "relative border-2 border-dashed rounded-2xl transition-all cursor-pointer",
            isDragging
              ? "border-purple-400 bg-purple-50"
              : images.length === 0
              ? "border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50/30"
              : "border-gray-200 bg-white",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              if (e.target.files) await addFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />

          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <ImagePlus className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Drop screenshots here</p>
                <p className="text-sm text-gray-400 mt-0.5">or click to browse · or press <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-xs font-mono">Ctrl+V</kbd> to paste</p>
              </div>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP · up to 6 images</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 flex items-center justify-center bg-gray-50 cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Extract button */}
        {images.length > 0 && !savedSuccess && (
          <Button
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-base gap-2"
          >
            {isExtracting ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Analysing screenshots…</>
            ) : (
              <><Sparkles className="h-5 w-5" /> Extract Details with AI</>
            )}
          </Button>
        )}

        {savedSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-800">Saved to Scraped Events queue</p>
              <p className="text-sm text-green-700 mt-0.5">The activity is pending review. Go to <strong>Scraped Events</strong> to approve it.</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => router.push("/admin/scraped-events")} className="border-green-300 text-green-800 hover:bg-green-100">
                  Review queue
                </Button>
                <Button size="sm" variant="outline" onClick={handleReset} className="border-gray-300">
                  Import another
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Review & Complete Dialog ──────────────────────────────────────── */}
      <Dialog open={showReviewDialog} onOpenChange={(open) => !isSaving && setShowReviewDialog(open)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Review Extracted Details
            </DialogTitle>
            <DialogDescription>
              AI-extracted fields are pre-filled below. Fill in any missing or incorrect details before saving.
            </DialogDescription>
          </DialogHeader>

          {/* Missing fields banner */}
          {missingFields.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
              <span>
                <strong>Missing: </strong>{missingFields.join(", ")}
                <span className="text-amber-600"> — you can still save and fill these in the review queue.</span>
              </span>
            </div>
          )}

          <div className="space-y-4 pt-1">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Title <span className="text-red-500">*</span>
                {title.trim() ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" /> : <AlertCircle className="h-3.5 w-3.5 text-amber-400 ml-1" />}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event or activity name"
                className="mt-1"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Image URL <span className="text-red-500">*</span>
                {imageUrl.trim() ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" /> : <AlertCircle className="h-3.5 w-3.5 text-amber-400 ml-1" />}
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (flyer or event image URL)"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Description
                {description.trim() && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />}
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Activity description from the post"
                rows={4}
                className="mt-1 text-sm"
              />
            </div>

            {/* Row: Price + Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Price
                  {priceRange.trim() ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" /> : <AlertCircle className="h-3.5 w-3.5 text-amber-400 ml-1" />}
                </label>
                <Input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="₹500 or Free" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Location
                  {location.trim() ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" /> : <AlertCircle className="h-3.5 w-3.5 text-amber-400 ml-1" />}
                </label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue, Bangalore" className="mt-1" />
              </div>
            </div>

            {/* Row: Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Date
                  {date.trim() ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" /> : <AlertCircle className="h-3.5 w-3.5 text-amber-400 ml-1" />}
                </label>
                <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="April 5, 2025" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Time
                  {time.trim() && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />}
                </label>
                <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="7:00 PM - 10:00 PM" className="mt-1" />
              </div>
            </div>

            {/* Map Link */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Map Link <span className="text-red-500">*</span>
                {mapLink.trim() ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" /> : <AlertCircle className="h-3.5 w-3.5 text-amber-400 ml-1" />}
              </label>
              <Input
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                placeholder="https://maps.app.goo.gl/... or full Google Maps URL"
                className="mt-1"
              />
            </div>

            {/* Contact + URL */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Contact Info
                  {contactInfo.trim() && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />}
                </label>
                <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Phone or email" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Website / Link
                  {url.trim() && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />}
                </label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="mt-1" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categories
                {selectedCategories.length > 0 && (
                  <span className="ml-2 text-xs text-gray-400">({selectedCategories.length} selected)</span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white cursor-pointer text-sm">
                    <Checkbox
                      checked={selectedCategories.includes(String(cat.id))}
                      onCheckedChange={() => toggleCategory(String(cat.id))}
                    />
                    <span className="truncate">{cat.name}</span>
                  </label>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCategories.map((id) => {
                    const cat = categories.find((c) => String(c.id) === id);
                    return cat ? (
                      <Badge key={id} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {cat.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
              {dbTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {dbTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(String(tag.id))}
                      className={[
                        "px-2.5 py-0.5 rounded-full text-xs border transition-colors",
                        selectedTagIds.includes(String(tag.id))
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-purple-300",
                      ].join(" ")}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
              <Input
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
                placeholder="Additional tags, comma-separated (e.g. rooftop, live-music)"
                className="text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t mt-2">
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSaving}
            >
              Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
              ) : (
                <><Send className="h-4 w-4" /> Save for Review</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityAddFromInstagram;
