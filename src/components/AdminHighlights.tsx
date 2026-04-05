import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus,
  Edit,
  Trash,
  Loader2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';
import {
  fetchAllHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
  updateHighlightsOrder,
  toggleHighlightActive,
  Highlight,
} from '@/services/highlightsService';

interface HighlightRowProps {
  highlight: Highlight;
  index: number;
  total: number;
  onEdit: (highlight: Highlight) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const HighlightRow: React.FC<HighlightRowProps> = ({
  highlight,
  index,
  total,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <TableRow>
      <TableCell className="w-20">
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {highlight.image_url ? (
            <img
              src={highlight.image_url}
              alt={highlight.title || 'Highlight'}
              className="w-16 h-9 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-9 bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <span className="font-medium">{highlight.title || '(No title)'}</span>
        </div>
      </TableCell>
      <TableCell>
        {highlight.link_url ? (
          <a
            href={highlight.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="truncate max-w-[200px]">{highlight.link_url}</span>
          </a>
        ) : (
          <span className="text-gray-400 text-sm">No link</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={highlight.is_active}
            onCheckedChange={(checked) => onToggleActive(highlight.id, checked)}
          />
          {highlight.is_active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(highlight)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(highlight.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const AdminHighlights: React.FC = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<Partial<Highlight>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllHighlights();
      setHighlights(data);
    } catch (error) {
      console.error('Failed to load highlights:', error);
      toast({
        title: 'Error loading highlights',
        description: 'Please check your connection and try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentHighlight({
      ...currentHighlight,
      [name]: name === 'display_order' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentHighlight.image_url) {
      toast({
        title: 'Missing required field',
        description: 'Image URL is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (currentHighlight.id) {
        // Update existing highlight
        const result = await updateHighlight(currentHighlight.id, {
          title: currentHighlight.title,
          image_url: currentHighlight.image_url,
          link_url: currentHighlight.link_url,
          display_order: currentHighlight.display_order,
          is_active: currentHighlight.is_active,
        });

        if (result.error || !result.data) {
          throw new Error(result.error || 'Failed to update highlight');
        }

        setHighlights(
          highlights.map((h) =>
            h.id === currentHighlight.id ? result.data! : h
          )
        );
        toast({
          title: 'Highlight updated',
          description: 'The highlight has been updated successfully',
        });
      } else {
        // Create new highlight
        const newDisplayOrder =
          highlights.length > 0
            ? Math.max(...highlights.map((h) => h.display_order)) + 1
            : 0;

        const result = await createHighlight({
          title: currentHighlight.title,
          image_url: currentHighlight.image_url!,
          link_url: currentHighlight.link_url,
          display_order: currentHighlight.display_order ?? newDisplayOrder,
          is_active: currentHighlight.is_active ?? true,
        });

        if (result.error || !result.data) {
          throw new Error(result.error || 'Failed to create highlight');
        }

        setHighlights([...highlights, result.data]);
        toast({
          title: 'Highlight created',
          description: 'The highlight has been created successfully',
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving highlight:', error);
      toast({
        title: 'Error saving highlight',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while saving. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (highlight: Highlight) => {
    setCurrentHighlight(highlight);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this highlight?')) return;

    try {
      const result = await deleteHighlight(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete highlight');
      }
      setHighlights(highlights.filter((h) => h.id !== id));
      toast({
        title: 'Highlight deleted',
        description: 'The highlight has been removed',
      });
    } catch (error) {
      console.error('Error deleting highlight:', error);
      toast({
        title: 'Error deleting highlight',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while deleting. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const result = await toggleHighlightActive(id, isActive);
      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle highlight status');
      }
      setHighlights(
        highlights.map((h) => (h.id === id ? { ...h, is_active: isActive } : h))
      );
      toast({
        title: isActive ? 'Highlight enabled' : 'Highlight disabled',
        description: isActive
          ? 'The highlight is now visible on the homepage'
          : 'The highlight is now hidden from the homepage',
      });
    } catch (error) {
      console.error('Error toggling highlight status:', error);
      toast({
        title: 'Error updating highlight',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newHighlights = [...highlights];
    [newHighlights[index - 1], newHighlights[index]] = [newHighlights[index], newHighlights[index - 1]];

    // Update display_order for all items
    const updatedHighlights = newHighlights.map((h, i) => ({
      ...h,
      display_order: i,
    }));

    setHighlights(updatedHighlights);

    // Save new order to database
    try {
      const result = await updateHighlightsOrder(
        updatedHighlights.map((h) => ({ id: h.id, display_order: h.display_order }))
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update order');
      }

      toast({
        title: 'Order updated',
        description: 'Highlight order has been saved',
      });
    } catch (error) {
      console.error('Error updating order:', error);
      loadHighlights();
      toast({
        title: 'Error updating order',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === highlights.length - 1) return;

    const newHighlights = [...highlights];
    [newHighlights[index], newHighlights[index + 1]] = [newHighlights[index + 1], newHighlights[index]];

    // Update display_order for all items
    const updatedHighlights = newHighlights.map((h, i) => ({
      ...h,
      display_order: i,
    }));

    setHighlights(updatedHighlights);

    // Save new order to database
    try {
      const result = await updateHighlightsOrder(
        updatedHighlights.map((h) => ({ id: h.id, display_order: h.display_order }))
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update order');
      }

      toast({
        title: 'Order updated',
        description: 'Highlight order has been saved',
      });
    } catch (error) {
      console.error('Error updating order:', error);
      loadHighlights();
      toast({
        title: 'Error updating order',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setCurrentHighlight({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Highlights Carousel</h2>
          <p className="text-sm text-gray-500">
            Manage the banner carousel on the homepage. Use arrows to reorder.
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} disabled={isSaving}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Highlight
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold mb-4">
            {currentHighlight.id ? 'Edit Highlight' : 'Add New Highlight'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Image URL *
              </label>
              <Input
                name="image_url"
                value={currentHighlight.image_url || ''}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended aspect ratio: 3:1 (e.g., 1200x400 px). Images are cropped to fill — avoid important content near the edges.
              </p>
            </div>

            {currentHighlight.image_url && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={currentHighlight.image_url}
                  alt="Preview"
                  className="max-w-md h-auto rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Title (Optional)
              </label>
              <Input
                name="title"
                value={currentHighlight.title || ''}
                onChange={handleInputChange}
                placeholder="Banner title"
              />
              <p className="text-xs text-gray-500 mt-1">
                Displayed as an overlay on the banner
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Link URL (Optional)
              </label>
              <Input
                name="link_url"
                value={currentHighlight.link_url || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/event or /activity/123"
              />
              <p className="text-xs text-gray-500 mt-1">
                Where users go when they click the banner. Use / for internal links.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Display Order
                </label>
                <Input
                  name="display_order"
                  type="number"
                  value={currentHighlight.display_order ?? 0}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Status
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <Switch
                    checked={currentHighlight.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setCurrentHighlight({ ...currentHighlight, is_active: checked })
                    }
                  />
                  <span className="text-sm">
                    {currentHighlight.is_active ?? true ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
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
                ) : currentHighlight.id ? (
                  'Update Highlight'
                ) : (
                  'Add Highlight'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : highlights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No highlights yet. Add your first highlight to display on the homepage carousel.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Order</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highlights.map((highlight, index) => (
                <HighlightRow
                  key={highlight.id}
                  highlight={highlight}
                  index={index}
                  total={highlights.length}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminHighlights;
