import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Check,
  X,
  Edit,
  Loader2,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ScrapedActivity,
  listScrapedActivities,
  approveScrapedActivity,
  rejectScrapedActivity,
  updateScrapedActivity,
} from "@/services/scrapedActivityService";

// ─── Types ──────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "duplicate";

// ─── Quality bar ─────────────────────────────────────────────────────────────

function QualityBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-500" : score >= 40 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-500">{score}</span>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ScrapedActivity["status"] }) {
  const map = {
    pending:   "bg-yellow-100 text-yellow-800",
    approved:  "bg-green-100 text-green-800",
    rejected:  "bg-red-100 text-red-800",
    duplicate: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

// ─── Source badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: string }) {
  const map: Record<string, string> = {
    bms:       "bg-blue-100 text-blue-800",
    instagram: "bg-pink-100 text-pink-800",
    meetup:    "bg-orange-100 text-orange-800",
    manual:    "bg-gray-100 text-gray-700",
  };
  const cls = map[source] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{source}</span>
  );
}

// ─── Preview modal ────────────────────────────────────────────────────────────

function PreviewModal({
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
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Date</span>
              <p className="font-medium">{item.date || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500">Time</span>
              <p className="font-medium">{item.time || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500">Location</span>
              <p className="font-medium">{item.location || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500">Price</span>
              <p className="font-medium">{item.price_range || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500">Source</span>
              <SourceBadge source={item.source} />
            </div>
            <div>
              <span className="text-gray-500">Quality</span>
              <QualityBar score={item.quality_score} />
            </div>
            <div>
              <span className="text-gray-500">Status</span>
              <StatusBadge status={item.status} />
            </div>
            {item.reviewed_by_name && (
              <div>
                <span className="text-gray-500">Reviewed by</span>
                <p className="font-medium">{item.reviewed_by_name}</p>
              </div>
            )}
          </div>

          {item.description && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{item.description}</p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {item.map_link && (
              <a href={item.map_link} target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                <MapPin className="h-3 w-3" /> Map
              </a>
            )}
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                <ExternalLink className="h-3 w-3" /> Source URL
              </a>
            )}
          </div>

          {item.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {item.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          )}

          {item.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              <strong>Notes:</strong> {item.notes}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          {item.status === "pending" || item.status === "duplicate" ? (
            <>
              <Button variant="outline" size="sm" onClick={onEdit} disabled={isActing}>
                <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit & Approve
              </Button>
              <Button variant="destructive" size="sm" onClick={onReject} disabled={isActing}>
                {isActing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <X className="h-3.5 w-3.5 mr-1.5" />}
                Reject
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onApprove} disabled={isActing}>
                {isActing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Check className="h-3.5 w-3.5 mr-1.5" />}
                Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit before approving</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Title</label>
            <Input value={f.title} onChange={set("title")} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <Textarea value={f.description} onChange={set("description")} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date</label>
              <Input value={f.date} onChange={set("date")} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Time</label>
              <Input value={f.time} onChange={set("time")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Location</label>
              <Input value={f.location} onChange={set("location")} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price</label>
              <Input value={f.price_range} onChange={set("price_range")} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Image URL</label>
            <Input value={f.image} onChange={set("image")} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Map Link</label>
            <Input value={f.map_link} onChange={set("map_link")} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Source URL</label>
            <Input value={f.url} onChange={set("url")} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="outline" onClick={() => onSave(f, false)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
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
          <DialogTitle>Reject activity</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Optional rejection notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isRejecting}>Cancel</Button>
          <Button variant="destructive" onClick={() => onConfirm(notes)} disabled={isRejecting}>
            {isRejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminScrapedEvents() {
  const { getAdminId } = useAuth();
  const { toast } = useToast();

  const [items, setItems] = useState<ScrapedActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  const [previewing, setPreviewing] = useState<ScrapedActivity | null>(null);
  const [editing, setEditing]       = useState<ScrapedActivity | null>(null);
  const [rejecting, setRejecting]   = useState<ScrapedActivity | null>(null);
  const [actingId, setActingId]     = useState<number | null>(null);

  const adminId = getAdminId() || "";

  const load = useCallback(async () => {
    if (!adminId) return;
    setLoading(true);
    const { data, total: t, error } = await listScrapedActivities(
      adminId,
      {
        status: statusFilter === "all" ? undefined : statusFilter,
        source: sourceFilter === "all" ? undefined : sourceFilter,
      },
      { limit: PAGE_SIZE, offset: page * PAGE_SIZE }
    );
    if (error) toast({ title: "Failed to load", description: error, variant: "destructive" });
    setItems(data);
    setTotal(t);
    setLoading(false);
  }, [adminId, statusFilter, sourceFilter, page]);

  useEffect(() => { load(); }, [load]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [statusFilter, sourceFilter]);

  const handleApprove = async (item: ScrapedActivity) => {
    setActingId(item.id);
    const { error } = await approveScrapedActivity(adminId, item.id);
    setActingId(null);
    if (error) {
      toast({ title: "Approve failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Published!", description: item.title });
      setPreviewing(null);
      load();
    }
  };

  const handleReject = async (item: ScrapedActivity, notes: string) => {
    setActingId(item.id);
    const { error } = await rejectScrapedActivity(adminId, item.id, notes || undefined);
    setActingId(null);
    setRejecting(null);
    if (error) {
      toast({ title: "Reject failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: item.title });
      setPreviewing(null);
      load();
    }
  };

  const handleEditSave = async (
    item: ScrapedActivity,
    fields: Record<string, string>,
    approve: boolean
  ) => {
    setActingId(item.id);
    const { error: updateErr } = await updateScrapedActivity(adminId, item.id, {
      title:       fields.title       || undefined,
      description: fields.description || undefined,
      location:    fields.location    || undefined,
      date:        fields.date        || undefined,
      time:        fields.time        || undefined,
      priceRange:  fields.price_range || undefined,
      url:         fields.url         || undefined,
      mapLink:     fields.map_link    || undefined,
      image:       fields.image       || undefined,
    });

    if (updateErr) {
      setActingId(null);
      toast({ title: "Update failed", description: updateErr, variant: "destructive" });
      return;
    }

    if (approve) {
      const { error: approveErr } = await approveScrapedActivity(adminId, item.id);
      setActingId(null);
      if (approveErr) {
        toast({ title: "Approve failed", description: approveErr, variant: "destructive" });
      } else {
        toast({ title: "Updated & Published!", description: fields.title || item.title });
        setEditing(null);
        load();
      }
    } else {
      setActingId(null);
      toast({ title: "Saved" });
      setEditing(null);
      load();
    }
  };

  const pendingCount = items.filter((i) => i.status === "pending" || i.status === "duplicate").length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin top bar */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center gap-4">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <span className="text-gray-600">·</span>
        <span className="text-sm font-medium">Scraped Events</span>
      </div>

      <main className="container mx-auto px-6 py-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Scraped Events</h1>
            <p className="text-sm text-gray-500">
              {total} total · {pendingCount} pending review
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          {/* Status tabs */}
          <div className="flex rounded-lg border bg-white overflow-hidden text-sm">
            {(["all", "pending", "approved", "rejected", "duplicate"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 capitalize font-medium transition-colors
                  ${statusFilter === s ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Source filter */}
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="bms">BMS</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="meetup">Meetup</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading…
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-gray-400">
                    No scraped events found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    {/* Thumbnail */}
                    <TableCell>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">?</div>
                      )}
                    </TableCell>

                    {/* Title */}
                    <TableCell className="max-w-xs">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      {item.contact_info && (
                        <p className="text-xs text-gray-400 truncate">{item.contact_info}</p>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {item.date || <span className="text-gray-300">—</span>}
                    </TableCell>

                    {/* Venue */}
                    <TableCell className="text-sm text-gray-600 max-w-[160px] truncate">
                      {item.location || <span className="text-gray-300">—</span>}
                    </TableCell>

                    {/* Source */}
                    <TableCell>
                      <SourceBadge source={item.source} />
                    </TableCell>

                    {/* Quality */}
                    <TableCell>
                      <QualityBar score={item.quality_score} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0"
                          title="Preview"
                          onClick={() => setPreviewing(item)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {(item.status === "pending" || item.status === "duplicate") && (
                          <>
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit & Approve"
                              onClick={() => setEditing(item)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Approve"
                              disabled={actingId === item.id}
                              onClick={() => handleApprove(item)}
                            >
                              {actingId === item.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Check className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Reject"
                              disabled={actingId === item.id}
                              onClick={() => setRejecting(item)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                Previous
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * PAGE_SIZE >= total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {previewing && (
        <PreviewModal
          item={previewing}
          onClose={() => setPreviewing(null)}
          onApprove={() => handleApprove(previewing)}
          onReject={() => { setPreviewing(null); setRejecting(previewing); }}
          onEdit={() => { setPreviewing(null); setEditing(previewing); }}
          isActing={actingId === previewing.id}
        />
      )}

      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(fields, approve) => handleEditSave(editing, fields, approve)}
          isSaving={actingId === editing.id}
        />
      )}

      {rejecting && (
        <RejectModal
          onClose={() => setRejecting(null)}
          onConfirm={(notes) => handleReject(rejecting, notes)}
          isRejecting={actingId === rejecting.id}
        />
      )}
    </div>
  );
}
