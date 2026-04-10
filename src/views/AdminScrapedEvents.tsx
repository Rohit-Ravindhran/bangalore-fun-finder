'use client'

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Eye, Check, X, Edit, Loader2, RefreshCw, ArrowLeft,
  ExternalLink, MapPin, Calendar, Clock, Tag, DollarSign,
  Image as ImageIcon, Info, Wand2, Play, Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ScrapedActivity,
  listScrapedActivities,
  approveScrapedActivity,
  rejectScrapedActivity,
  updateScrapedActivity,
} from "@/services/scrapedActivityService";
import { uploadActivityImage } from "@/services/activityService";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "duplicate";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function QualityBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 40 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-500 tabular-nums">{score}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: ScrapedActivity["status"] }) {
  const map = {
    pending:   "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved:  "bg-green-100 text-green-800 border-green-200",
    rejected:  "bg-red-100 text-red-800 border-red-200",
    duplicate: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const isCrawler = source === "google-crawler";
  const cls = isCrawler
    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
    : source === "bms"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {source}
    </span>
  );
}

function Thumb({ src, title }: { src?: string; title: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <ImageIcon className="h-5 w-5 text-gray-300" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      className="w-14 h-14 object-cover rounded-lg shrink-0"
      onError={() => setErr(true)}
    />
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function DetailModal({
  item,
  onClose,
  onApprove,
  onReject,
  onEdit,
  isActing,
}: {
  item: ScrapedActivity;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
  isActing: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
        {/* Hero image */}
        {item.image && !imgErr ? (
          <div className="relative w-full h-52 bg-gray-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="text-white text-xl font-semibold leading-tight drop-shadow">
                {item.title}
              </h2>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <StatusBadge status={item.status} />
                <SourceBadge source={item.source} />
                <QualityBar score={item.quality_score} />
              </div>
            </div>
          </div>
        ) : (
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg pr-8">{item.title}</DialogTitle>
            <div className="flex gap-2 mt-2 flex-wrap">
              <StatusBadge status={item.status} />
              <SourceBadge source={item.source} />
              <QualityBar score={item.quality_score} />
            </div>
          </DialogHeader>
        )}

        <div className="px-6 py-5 space-y-5">
          {/* Key fields grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Date" value={item.date} />
            <Field icon={<Clock className="h-3.5 w-3.5" />} label="Time" value={item.time} />
            <Field icon={<DollarSign className="h-3.5 w-3.5" />} label="Price" value={item.price_range} />
            <Field icon={<MapPin className="h-3.5 w-3.5" />} label="Venue" value={item.location} span />
            {item.reviewed_by_name && (
              <Field icon={<Info className="h-3.5 w-3.5" />} label="Reviewed by" value={item.reviewed_by_name} />
            )}
          </div>

          {/* Description */}
          {item.description && (
            <Section label="Description">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </Section>
          )}

          {/* Image URL */}
          {item.image && (
            <Section label="Image URL">
              <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 px-3 py-2 rounded">
                {item.image}
              </p>
              {imgErr && (
                <p className="text-xs text-red-500 mt-1">⚠ Image failed to load</p>
              )}
            </Section>
          )}

          {/* Links */}
          {(item.map_link || item.url) && (
            <Section label="Links">
              <div className="flex gap-3 flex-wrap">
                {item.map_link && (
                  <a
                    href={item.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Open in Maps
                  </a>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Source / Booking URL
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* Coordinates */}
          {(item.latitude || item.longitude) && (
            <Section label="Coordinates">
              <p className="text-sm font-mono text-gray-600">
                {item.latitude}, {item.longitude}
              </p>
            </Section>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <Section label="Tags">
              <div className="flex gap-1.5 flex-wrap">
                {item.tags.map((t) => (
                  <span key={t} className="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Categories */}
          {item.category_ids?.length > 0 && (
            <Section label="Category IDs">
              <div className="flex gap-1.5 flex-wrap">
                {item.category_ids.map((c) => (
                  <span key={c} className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <strong>Rejection notes:</strong> {item.notes}
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-3 flex gap-4 text-xs text-gray-400 flex-wrap">
            <span>ID: {item.id}</span>
            {item.scraped_at && <span>Scraped: {new Date(item.scraped_at).toLocaleString("en-IN")}</span>}
            {item.reviewed_at && <span>Reviewed: {new Date(item.reviewed_at).toLocaleString("en-IN")}</span>}
            <span>Section: {item.section_type}</span>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t gap-2 flex-wrap bg-gray-50">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          {(item.status === "pending" || item.status === "duplicate") && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit} disabled={isActing}>
                <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit & Approve
              </Button>
              <Button
                variant="destructive" size="sm" onClick={onReject} disabled={isActing}
              >
                {isActing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <X className="h-3.5 w-3.5 mr-1.5" />}
                Reject
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={onApprove}
                disabled={isActing}
              >
                {isActing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Check className="h-3.5 w-3.5 mr-1.5" />}
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  icon, label, value, span,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
        {icon} {label}
      </p>
      <p className="text-sm font-medium text-gray-800">{value || <span className="text-gray-300">—</span>}</p>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
      {children}
    </div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditModal({
  item,
  onClose,
  onSave,
  isSaving,
}: {
  item: ScrapedActivity;
  onClose: () => void;
  onSave: (fields: Record<string, string>, approve: boolean) => void;
  isSaving: boolean;
}) {
  const [f, setF] = useState({
    title:       item.title,
    description: item.description || "",
    location:    item.location || "",
    date:        item.date || "",
    time:        item.time || "",
    price_range: item.price_range || "",
    url:         item.url || "",
    map_link:    item.map_link || "",
    image:       item.image || "",
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setUploadError(null);
    const { url, error } = await uploadActivityImage(file);
    setIsUploadingImage(false);
    if (url) setF((p) => ({ ...p, image: url }));
    if (error) setUploadError(error);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit before approving</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <LabeledInput label="Title" value={f.title} onChange={set("title")} />
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <Textarea value={f.description} onChange={set("description")} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Date" value={f.date} onChange={set("date")} />
            <LabeledInput label="Time" value={f.time} onChange={set("time")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Location / Venue" value={f.location} onChange={set("location")} />
            <LabeledInput label="Price" value={f.price_range} onChange={set("price_range")} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Image URL</label>
            <div className="flex gap-2">
              <Input value={f.image} onChange={set("image")} placeholder="https://... or upload" className="flex-1" />
              <label className="flex-shrink-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); e.target.value = ""; }}
                />
                <Button type="button" variant="outline" size="sm" disabled={isUploadingImage} className="h-10 gap-1.5 pointer-events-none">
                  {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploadingImage ? "Uploading…" : "Upload"}
                </Button>
              </label>
            </div>
            {uploadError && (
              <p className="text-xs text-red-600 mt-1">{uploadError}</p>
            )}
          </div>
          {f.image && (
            <img
              src={f.image}
              alt="preview"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <LabeledInput label="Map Link" value={f.map_link} onChange={set("map_link")} />
          <LabeledInput label="Booking / Source URL" value={f.url} onChange={set("url")} />
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="outline" onClick={() => onSave(f, false)} disabled={isSaving}>
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
            Save only
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => onSave(f, true)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Check className="h-3.5 w-3.5 mr-1.5" />}
            Save & Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LabeledInput({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <Input value={value} onChange={onChange} />
    </div>
  );
}

// ─── Reject modal ─────────────────────────────────────────────────────────────

function RejectModal({
  onClose,
  onConfirm,
  isRejecting,
}: {
  onClose: () => void;
  onConfirm: (notes: string) => void;
  isRejecting: boolean;
}) {
  const [notes, setNotes] = useState("");
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reject this event?</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Optional rejection notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isRejecting}>Cancel</Button>
          <Button variant="destructive" onClick={() => onConfirm(notes)} disabled={isRejecting}>
            {isRejecting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Date filter config ───────────────────────────────────────────────────────

type DateFilter = "all" | "today" | "week" | "month";

function dateFilterToSince(f: DateFilter): string | undefined {
  if (f === "all") return undefined;
  const d = new Date();
  if (f === "today") d.setHours(0, 0, 0, 0);
  else if (f === "week")  d.setDate(d.getDate() - 7);
  else if (f === "month") d.setDate(d.getDate() - 30);
  return d.toISOString();
}

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all:   "All time",
  today: "Today",
  week:  "Last 7 days",
  month: "Last 30 days",
};

type SortOption = "newest" | "oldest" | "quality_desc" | "quality_asc";

const SORT_LABELS: Record<SortOption, string> = {
  newest:       "Newest first",
  oldest:       "Oldest first",
  quality_desc: "Quality: High → Low",
  quality_asc:  "Quality: Low → High",
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminScrapedEvents() {
  const { getAdminId } = useAuth();
  const { toast } = useToast();

  const [items, setItems]               = useState<ScrapedActivity[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter]     = useState<DateFilter>("all");
  const [sortBy, setSortBy]             = useState<SortOption>("newest");
  const [page, setPage]                 = useState(0);
  const PAGE_SIZE = 25;

  // Multi-select
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkRejecting, setBulkRejecting] = useState(false);
  const [bulkWorking, setBulkWorking]     = useState(false);

  const [viewing, setViewing]         = useState<ScrapedActivity | null>(null);
  const [editing, setEditing]         = useState<ScrapedActivity | null>(null);
  const [rejecting, setRejecting]     = useState<ScrapedActivity | null>(null);
  const [actingId, setActingId]       = useState<number | null>(null);
  const [fetchingImages, setFetchingImages] = useState(false);
  const [triggeringCrawl, setTriggeringCrawl] = useState(false);

  const adminId = getAdminId() || "";

  const WORKFLOW_URL = "https://github.com/Rohit-Ravindhran/bangalore-fun-finder/actions/workflows/crawl-events.yml";

  const handleTriggerCrawl = async () => {
    setTriggeringCrawl(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/trigger-crawl`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${anonKey}`,
          "apikey":        anonKey,
        },
        body: JSON.stringify({ dry_run: false }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Unknown error");
      toast({
        title: "Crawl started!",
        description: (
          <span>
            Running on GitHub Actions.{" "}
            <a href={WORKFLOW_URL} target="_blank" rel="noopener noreferrer"
              className="underline font-medium">
              View progress ↗
            </a>
          </span>
        ) as unknown as string,
      });
    } catch (err: unknown) {
      toast({
        title: "Failed to start crawl",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setTriggeringCrawl(false);
    }
  };

  const missingImageCount = items.filter((i) => !i.image).length;
  const selectableItems   = items.filter(
    (i) => i.status === "pending" || i.status === "duplicate"
  );
  const allSelected = selectableItems.length > 0 && selectableItems.every((i) => selected.has(i.id));

  // ── Image fetch helper ──────────────────────────────────────────────────────

  const callFetchImages = async (body: object) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const res = await fetch(`${supabaseUrl}/functions/v1/fetch-event-images`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${anonKey}`,
        "apikey":        anonKey,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error ?? "Unknown error");
    return data as { updated: number; failed: number };
  };

  const handleFetchImages = async (idsOnly?: number[]) => {
    setFetchingImages(true);
    try {
      const data = await callFetchImages(
        idsOnly?.length
          ? { ids: idsOnly }
          : { fetch_all_missing: true, limit: 100 }
      );
      toast({ title: "Images updated", description: `${data.updated} updated · ${data.failed} not found` });
      load();
    } catch (err: unknown) {
      toast({ title: "Fetch images failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setFetchingImages(false);
    }
  };

  // ── Load ────────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    if (!adminId) return;
    setLoading(true);
    const { data, total: t, error } = await listScrapedActivities(
      adminId,
      {
        status:       statusFilter === "all" ? undefined : statusFilter,
        source:       sourceFilter === "all" ? undefined : sourceFilter,
        sort:         sortBy,
        scrapedSince: dateFilterToSince(dateFilter),
      },
      { limit: PAGE_SIZE, offset: page * PAGE_SIZE }
    );
    if (error) toast({ title: "Failed to load", description: error, variant: "destructive" });
    setItems(data);
    setTotal(t);
    setSelected(new Set()); // clear selection on reload
    setLoading(false);
  }, [adminId, statusFilter, sourceFilter, dateFilter, sortBy, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [statusFilter, sourceFilter, dateFilter, sortBy]);

  // ── Single actions ──────────────────────────────────────────────────────────

  const handleApprove = async (item: ScrapedActivity) => {
    setActingId(item.id);
    const { error } = await approveScrapedActivity(adminId, item.id);
    setActingId(null);
    if (error) toast({ title: "Approve failed", description: error, variant: "destructive" });
    else { toast({ title: "✅ Published!", description: item.title }); setViewing(null); load(); }
  };

  const handleReject = async (item: ScrapedActivity, notes: string) => {
    setActingId(item.id);
    const { error } = await rejectScrapedActivity(adminId, item.id, notes || undefined);
    setActingId(null);
    setRejecting(null);
    if (error) toast({ title: "Reject failed", description: error, variant: "destructive" });
    else { toast({ title: "Rejected", description: item.title }); setViewing(null); load(); }
  };

  const handleEditSave = async (item: ScrapedActivity, fields: Record<string, string>, approve: boolean) => {
    setActingId(item.id);
    const { error: updateErr } = await updateScrapedActivity(adminId, item.id, {
      title: fields.title || undefined, description: fields.description || undefined,
      location: fields.location || undefined, date: fields.date || undefined,
      time: fields.time || undefined, priceRange: fields.price_range || undefined,
      url: fields.url || undefined, mapLink: fields.map_link || undefined, image: fields.image || undefined,
    });
    if (updateErr) { setActingId(null); toast({ title: "Update failed", description: updateErr, variant: "destructive" }); return; }
    if (approve) {
      const { error } = await approveScrapedActivity(adminId, item.id);
      setActingId(null);
      if (error) toast({ title: "Approve failed", description: error, variant: "destructive" });
      else { toast({ title: "✅ Updated & Published!", description: fields.title || item.title }); setEditing(null); load(); }
    } else {
      setActingId(null); toast({ title: "Saved" }); setEditing(null); load();
    }
  };

  // ── Bulk actions ────────────────────────────────────────────────────────────

  const handleBulkApprove = async () => {
    const ids = [...selected];
    setBulkWorking(true);
    let ok = 0, fail = 0;
    for (const id of ids) {
      const { error } = await approveScrapedActivity(adminId, id);
      error ? fail++ : ok++;
    }
    setBulkWorking(false);
    toast({ title: `Bulk approve: ${ok} published${fail ? `, ${fail} failed` : ""}` });
    load();
  };

  const handleBulkReject = async (notes: string) => {
    const ids = [...selected];
    setBulkWorking(true);
    let ok = 0, fail = 0;
    for (const id of ids) {
      const { error } = await rejectScrapedActivity(adminId, id, notes || undefined);
      error ? fail++ : ok++;
    }
    setBulkWorking(false);
    setBulkRejecting(false);
    toast({ title: `Bulk reject: ${ok} rejected${fail ? `, ${fail} failed` : ""}` });
    load();
  };

  const handleBulkFetchImages = async () => {
    const ids = [...selected].filter((id) => !items.find((i) => i.id === id)?.image);
    if (!ids.length) { toast({ title: "All selected events already have images" }); return; }
    setFetchingImages(true);
    try {
      const data = await callFetchImages({ ids });
      toast({ title: "Images updated", description: `${data.updated} updated · ${data.failed} not found` });
      load();
    } catch (err: unknown) {
      toast({ title: "Fetch images failed", description: (err as Error).message, variant: "destructive" });
    } finally { setFetchingImages(false); }
  };

  // ── Select helpers ──────────────────────────────────────────────────────────

  const toggleSelect = (id: number) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleSelectAll = () =>
    setSelected(allSelected ? new Set() : new Set(selectableItems.map((i) => i.id)));

  const pendingCount = items.filter((i) => i.status === "pending" || i.status === "duplicate").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <span className="text-gray-600">·</span>
        <span className="text-sm font-medium">Scraped Events</span>
      </div>

      <main className="container mx-auto px-6 py-6 max-w-screen-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Scraped Events</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total · {pendingCount} pending review</p>
          </div>
          <div className="flex gap-2">
            {missingImageCount > 0 && (
              <Button variant="outline" size="sm" onClick={() => handleFetchImages()}
                disabled={fetchingImages || loading}
                title={`Fetch images for ${missingImageCount} events`}>
                {fetchingImages ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Fetch Images ({missingImageCount})
              </Button>
            )}
            <Button
              variant="outline" size="sm"
              onClick={handleTriggerCrawl}
              disabled={triggeringCrawl}
              title="Dispatch the GitHub Actions crawl workflow now"
            >
              {triggeringCrawl
                ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                : <Play className="h-4 w-4 mr-2 fill-current" />}
              Run Scrape Now
            </Button>
            <a
              href={WORKFLOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="View workflow runs on GitHub"
            >
              <Button variant="ghost" size="sm" className="px-2">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>

        {/* ── Filters row ─────────────────────────────────────────────────── */}
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          {/* Status tabs */}
          <div className="flex rounded-lg border bg-white overflow-hidden text-sm shadow-sm">
            {(["all", "pending", "approved", "rejected", "duplicate"] as StatusFilter[]).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 capitalize font-medium transition-colors
                  ${statusFilter === s ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Date filter */}
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(DATE_FILTER_LABELS) as DateFilter[]).map((k) => (
                <SelectItem key={k} value={k}>{DATE_FILTER_LABELS[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source filter */}
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="google-crawler">Google Crawler</SelectItem>
              <SelectItem value="bms">BMS</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="meetup">Meetup</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-44 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                <SelectItem key={k} value={k}>{SORT_LABELS[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Bulk action bar (appears when items selected) ────────────────── */}
        {selected.size > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-indigo-800">
              {selected.size} selected
            </span>
            <div className="flex gap-2 ml-1">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                onClick={handleBulkApprove} disabled={bulkWorking}>
                {bulkWorking ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                Approve all
              </Button>
              <Button size="sm" variant="destructive" className="h-7 text-xs"
                onClick={() => setBulkRejecting(true)} disabled={bulkWorking}>
                <X className="h-3 w-3 mr-1" /> Reject all
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs"
                onClick={handleBulkFetchImages} disabled={fetchingImages || bulkWorking}>
                {fetchingImages ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
                Fetch images
              </Button>
            </div>
            <button onClick={() => setSelected(new Set())}
              className="ml-auto text-xs text-indigo-600 hover:underline">
              Clear selection
            </button>
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[1160px]">
            <thead>
              <tr className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wide">
                {/* Select all */}
                <th className="py-3 pl-4 pr-2 w-8">
                  <input type="checkbox" checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded accent-orange-500 cursor-pointer"
                    title="Select all pending" />
                </th>
                <th className="py-3 pl-2 pr-2 text-left font-medium w-16">Image</th>
                <th className="py-3 px-3 text-left font-medium min-w-[220px]">Title & Description</th>
                <th className="py-3 px-3 text-left font-medium w-36">Date & Time</th>
                <th className="py-3 px-3 text-left font-medium min-w-[150px]">Venue</th>
                <th className="py-3 px-3 text-left font-medium w-28">Price</th>
                <th className="py-3 px-3 text-left font-medium w-24">Links</th>
                <th className="py-3 px-3 text-left font-medium w-30">Source</th>
                <th className="py-3 px-3 text-left font-medium w-28">Quality</th>
                <th className="py-3 px-3 text-left font-medium w-24">Status</th>
                <th className="py-3 pr-4 pl-2 text-right font-medium w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" /> Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-gray-400">
                    No scraped events found
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isSelectable = item.status === "pending" || item.status === "duplicate";
                  const isSelected   = selected.has(item.id);
                  return (
                    <tr key={item.id}
                      className={`hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-indigo-50/40" : ""}`}
                      onClick={() => setViewing(item)}
                    >
                      {/* Checkbox */}
                      <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                        {isSelectable && (
                          <input type="checkbox" checked={isSelected}
                            onChange={() => toggleSelect(item.id)}
                            className="rounded accent-orange-500 cursor-pointer" />
                        )}
                      </td>

                      {/* Image */}
                      <td className="py-3 pl-2 pr-2" onClick={(e) => e.stopPropagation()}>
                        <div className="relative group w-14">
                          <Thumb src={item.image} title={item.title} />
                          {!item.image && (
                            <button
                              title="Fetch image"
                              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleFetchImages([item.id])}
                              disabled={fetchingImages}>
                              {fetchingImages
                                ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                                : <Wand2 className="h-4 w-4 text-white" />}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Title + description */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900 leading-snug line-clamp-1">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                        )}
                      </td>

                      {/* Date & time */}
                      <td className="py-3 px-3">
                        <p className="text-gray-700 leading-snug">{item.date || <span className="text-gray-300">—</span>}</p>
                        {item.time && (
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.time}
                          </p>
                        )}
                      </td>

                      {/* Venue */}
                      <td className="py-3 px-3">
                        <p className="text-gray-700 line-clamp-2 leading-snug">
                          {item.location || <span className="text-gray-300">—</span>}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3">
                        <span className="text-gray-700 font-medium">
                          {item.price_range || <span className="text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Links */}
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-1">
                          {item.map_link && (
                            <a href={item.map_link} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                              <MapPin className="h-3 w-3" /> Map
                            </a>
                          )}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                              <ExternalLink className="h-3 w-3" /> URL
                            </a>
                          )}
                          {!item.map_link && !item.url && <span className="text-gray-300 text-xs">—</span>}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3 px-3"><SourceBadge source={item.source} /></td>

                      {/* Quality */}
                      <td className="py-3 px-3"><QualityBar score={item.quality_score} /></td>

                      {/* Status */}
                      <td className="py-3 px-3"><StatusBadge status={item.status} /></td>

                      {/* Actions */}
                      <td className="py-3 pr-4 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <ActionBtn title="View details" onClick={() => setViewing(item)}>
                            <Eye className="h-3.5 w-3.5" />
                          </ActionBtn>
                          {isSelectable && (
                            <>
                              <ActionBtn title="Edit & Approve" className="text-blue-600 hover:bg-blue-50"
                                onClick={() => setEditing(item)}>
                                <Edit className="h-3.5 w-3.5" />
                              </ActionBtn>
                              <ActionBtn title="Approve" className="text-green-600 hover:bg-green-50"
                                disabled={actingId === item.id} onClick={() => handleApprove(item)}>
                                {actingId === item.id
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  : <Check className="h-3.5 w-3.5" />}
                              </ActionBtn>
                              <ActionBtn title="Reject" className="text-red-500 hover:bg-red-50"
                                disabled={actingId === item.id} onClick={() => setRejecting(item)}>
                                <X className="h-3.5 w-3.5" />
                              </ActionBtn>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * PAGE_SIZE >= total}>
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {viewing && (
        <DetailModal item={viewing} onClose={() => setViewing(null)}
          onApprove={() => handleApprove(viewing)}
          onReject={() => { setViewing(null); setRejecting(viewing); }}
          onEdit={() => { setViewing(null); setEditing(viewing); }}
          isActing={actingId === viewing.id} />
      )}
      {editing && (
        <EditModal item={editing} onClose={() => setEditing(null)}
          onSave={(fields, approve) => handleEditSave(editing, fields, approve)}
          isSaving={actingId === editing.id} />
      )}
      {rejecting && (
        <RejectModal onClose={() => setRejecting(null)}
          onConfirm={(notes) => handleReject(rejecting, notes)}
          isRejecting={actingId === rejecting.id} />
      )}
      {bulkRejecting && (
        <RejectModal onClose={() => setBulkRejecting(false)}
          onConfirm={handleBulkReject}
          isRejecting={bulkWorking} />
      )}
    </div>
  );
}

// ─── Tiny reusable action button ──────────────────────────────────────────────

function ActionBtn({
  children, onClick, title, className = "", disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button title={title} disabled={disabled} onClick={onClick}
      className={`h-7 w-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-40 ${className}`}>
      {children}
    </button>
  );
}
