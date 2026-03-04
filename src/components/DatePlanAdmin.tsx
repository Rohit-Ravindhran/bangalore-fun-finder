import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  GripVertical,
  X,
  Save,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { 
  DatePlan, 
  DatePlanStop, 
  DatePlanVibe, 
  DatePlanTimeOfDay,
  StopType,
  formatCost,
  formatDuration,
  getVibeInfo,
  getStopTypeEmoji
} from '@/types/datePlan';
import { mockDatePlans, getAllAreas } from '@/data/datePlanData';

const VIBE_OPTIONS: { value: DatePlanVibe; label: string }[] = [
  { value: 'romantic', label: '💕 Romantic' },
  { value: 'adventurous', label: '🏃 Adventurous' },
  { value: 'chill', label: '😌 Chill' },
  { value: 'foodie', label: '🍴 Foodie' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'budget', label: '💰 Budget-Friendly' },
  { value: 'luxury', label: '✨ Luxury' },
];

const TIME_OPTIONS: { value: DatePlanTimeOfDay; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
  { value: 'all-day', label: 'All Day' },
];

const STOP_TYPE_OPTIONS: { value: StopType; label: string }[] = [
  { value: 'cafe', label: '☕ Cafe' },
  { value: 'restaurant', label: '🍽️ Restaurant' },
  { value: 'park', label: '🌳 Park' },
  { value: 'dessert', label: '🍨 Dessert' },
  { value: 'bar', label: '🍸 Bar' },
  { value: 'activity', label: '🎯 Activity' },
  { value: 'attraction', label: '📸 Attraction' },
  { value: 'shopping', label: '🛍️ Shopping' },
];

const AREA_OPTIONS = [
  'MG Road',
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Jayanagar',
  'JP Nagar',
  'Whitefield',
  'Electronic City',
  'Marathahalli',
  'Yelahanka',
  'Malleshwaram',
  'Basavanagudi',
  'Lalbagh',
  'UB City',
  'Brigade Road',
  'Commercial Street',
];

// Empty stop template
const createEmptyStop = (): DatePlanStop => ({
  id: `stop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  type: 'cafe',
  description: '',
  estimatedCost: 0,
  duration: 30,
  address: '',
  coordinates: { lat: 12.9716, lng: 77.5946 },
  tips: '',
  googleMapsUrl: '',
});

// Empty date plan template
const createEmptyDatePlan = (): Partial<DatePlan> => ({
  title: '',
  subtitle: '',
  heroImage: '',
  totalCost: 0,
  duration: 0,
  area: '',
  vibe: 'romantic',
  timeOfDay: 'evening',
  stops: [],
  tags: [],
  isFeatured: false,
  views: 0,
  likes: 0,
});

interface DatePlanAdminProps {
  onSave?: (plan: DatePlan) => void;
  onDelete?: (id: string) => void;
}

const DatePlanAdmin: React.FC<DatePlanAdminProps> = ({ onSave, onDelete }) => {
  const { toast } = useToast();
  
  // State
  const [datePlans, setDatePlans] = useState<DatePlan[]>(mockDatePlans);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<DatePlan>>(createEmptyDatePlan());
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  
  // Calculate totals when stops change
  useEffect(() => {
    if (currentPlan.stops && currentPlan.stops.length > 0) {
      const totalCost = currentPlan.stops.reduce((sum, stop) => sum + (stop.estimatedCost || 0), 0);
      const totalDuration = currentPlan.stops.reduce((sum, stop) => sum + (stop.duration || 0), 0);
      setCurrentPlan(prev => ({
        ...prev,
        totalCost,
        duration: totalDuration,
      }));
    }
  }, [currentPlan.stops?.map(s => `${s.estimatedCost}-${s.duration}`).join(',')]);
  
  // Handlers
  const handleAddNew = () => {
    setCurrentPlan(createEmptyDatePlan());
    setTagsInput('');
    setIsEditing(false);
    setIsFormOpen(true);
  };
  
  const handleEdit = (plan: DatePlan) => {
    setCurrentPlan({ ...plan });
    setTagsInput(plan.tags.join(', '));
    setIsEditing(true);
    setIsFormOpen(true);
    setExpandedStops(new Set());
  };
  
  const handleDelete = (id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (planToDelete) {
      setDatePlans(plans => plans.filter(p => p.id !== planToDelete));
      onDelete?.(planToDelete);
      toast({
        title: 'Date plan deleted',
        description: 'The date plan has been removed.',
      });
    }
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };
  
  const handleInputChange = (field: keyof DatePlan, value: any) => {
    setCurrentPlan(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleStopChange = (stopId: string, field: keyof DatePlanStop, value: any) => {
    setCurrentPlan(prev => ({
      ...prev,
      stops: prev.stops?.map(stop => 
        stop.id === stopId ? { ...stop, [field]: value } : stop
      ),
    }));
  };
  
  const handleAddStop = () => {
    const newStop = createEmptyStop();
    setCurrentPlan(prev => ({
      ...prev,
      stops: [...(prev.stops || []), newStop],
    }));
    setExpandedStops(prev => new Set([...prev, newStop.id]));
  };
  
  const handleRemoveStop = (stopId: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      stops: prev.stops?.filter(stop => stop.id !== stopId),
    }));
  };
  
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const stops = [...(currentPlan.stops || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;
    
    [stops[index], stops[newIndex]] = [stops[newIndex], stops[index]];
    setCurrentPlan(prev => ({ ...prev, stops }));
  };
  
  const toggleStopExpanded = (stopId: string) => {
    setExpandedStops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stopId)) {
        newSet.delete(stopId);
      } else {
        newSet.add(stopId);
      }
      return newSet;
    });
  };
  
  const handleSave = async () => {
    // Validation
    if (!currentPlan.title?.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    if (!currentPlan.subtitle?.trim()) {
      toast({ title: 'Subtitle is required', variant: 'destructive' });
      return;
    }
    if (!currentPlan.heroImage?.trim()) {
      toast({ title: 'Hero image URL is required', variant: 'destructive' });
      return;
    }
    if (!currentPlan.area) {
      toast({ title: 'Area is required', variant: 'destructive' });
      return;
    }
    if (!currentPlan.stops || currentPlan.stops.length < 2) {
      toast({ title: 'At least 2 stops are required', variant: 'destructive' });
      return;
    }
    
    // Check stops have names
    for (const stop of currentPlan.stops) {
      if (!stop.name.trim()) {
        toast({ title: 'All stops must have a name', variant: 'destructive' });
        return;
      }
    }
    
    setIsSaving(true);
    
    try {
      const planToSave: DatePlan = {
        ...(currentPlan as DatePlan),
        id: currentPlan.id || `plan-${Date.now()}`,
        tags: tagsInput.split(',').map(t => t.trim()).filter(t => t),
        createdAt: currentPlan.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (isEditing) {
        setDatePlans(plans => plans.map(p => p.id === planToSave.id ? planToSave : p));
        toast({ title: 'Date plan updated', description: `"${planToSave.title}" has been updated.` });
      } else {
        setDatePlans(plans => [planToSave, ...plans]);
        toast({ title: 'Date plan created', description: `"${planToSave.title}" has been created.` });
      }
      
      onSave?.(planToSave);
      setIsFormOpen(false);
      setCurrentPlan(createEmptyDatePlan());
    } catch (error) {
      toast({ 
        title: 'Error saving date plan', 
        description: 'Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setIsFormOpen(false);
    setCurrentPlan(createEmptyDatePlan());
    setTagsInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Date Plans ({datePlans.length})</h2>
        <Button onClick={handleAddNew} className="bg-rose-500 hover:bg-rose-600">
          <Plus className="mr-2 h-4 w-4" /> Add Date Plan
        </Button>
      </div>
      
      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl border border-rose-100 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Date Plan' : 'Create New Date Plan'}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={currentPlan.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., MG Road Romantic Evening"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Subtitle / Story *</label>
              <Input
                value={currentPlan.subtitle || ''}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="e.g., The Classic Cubbon Park Date"
              />
              <p className="text-xs text-gray-500 mt-1">Make it catchy and shareable!</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Hero Image URL *</label>
              <Input
                value={currentPlan.heroImage || ''}
                onChange={(e) => handleInputChange('heroImage', e.target.value)}
                placeholder="https://..."
              />
              {currentPlan.heroImage && (
                <div className="mt-2 rounded-lg overflow-hidden h-32 w-48">
                  <img 
                    src={currentPlan.heroImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.currentTarget.src = '/placeholder.svg'}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Area *</label>
              <Select
                value={currentPlan.area || ''}
                onValueChange={(value) => handleInputChange('area', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {AREA_OPTIONS.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Vibe *</label>
              <Select
                value={currentPlan.vibe || 'romantic'}
                onValueChange={(value) => handleInputChange('vibe', value as DatePlanVibe)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIBE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Time of Day *</label>
              <Select
                value={currentPlan.timeOfDay || 'evening'}
                onValueChange={(value) => handleInputChange('timeOfDay', value as DatePlanTimeOfDay)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="romantic, dinner, outdoor (comma separated)"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="isFeatured"
                checked={currentPlan.isFeatured || false}
                onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
              />
              <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                Featured Plan (shown prominently)
              </label>
            </div>
          </div>
          
          {/* Auto-calculated totals */}
          <div className="bg-rose-50 rounded-lg p-4 flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500">Total Cost (auto)</p>
              <p className="text-lg font-bold text-rose-600">{formatCost(currentPlan.totalCost || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Duration (auto)</p>
              <p className="text-lg font-bold">{formatDuration(currentPlan.duration || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Stops</p>
              <p className="text-lg font-bold">{currentPlan.stops?.length || 0}</p>
            </div>
          </div>
          
          {/* Stops Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Stops ({currentPlan.stops?.length || 0})</h4>
              <Button variant="outline" size="sm" onClick={handleAddStop}>
                <Plus className="mr-1 h-3 w-3" /> Add Stop
              </Button>
            </div>
            
            {(!currentPlan.stops || currentPlan.stops.length === 0) && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No stops added yet</p>
                <Button variant="outline" size="sm" onClick={handleAddStop}>
                  <Plus className="mr-1 h-3 w-3" /> Add First Stop
                </Button>
              </div>
            )}
            
            <div className="space-y-3">
              {currentPlan.stops?.map((stop, index) => (
                <div 
                  key={stop.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Stop Header */}
                  <div 
                    className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleStopExpanded(stop.id)}
                  >
                    <div className="flex items-center gap-1 text-gray-400">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMoveStop(index, 'up'); }}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMoveStop(index, 'down'); }}
                        disabled={index === (currentPlan.stops?.length || 0) - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <span className="text-lg">{getStopTypeEmoji(stop.type)}</span>
                    <span className="font-medium flex-1">
                      {stop.name || `Stop ${index + 1}`}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatCost(stop.estimatedCost)} • {stop.duration} mins
                    </span>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveStop(stop.id); }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    {expandedStops.has(stop.id) ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Stop Details */}
                  {expandedStops.has(stop.id) && (
                    <div className="p-4 space-y-3 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Name *</label>
                          <Input
                            value={stop.name}
                            onChange={(e) => handleStopChange(stop.id, 'name', e.target.value)}
                            placeholder="e.g., Cafe Noir"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <Select
                            value={stop.type}
                            onValueChange={(value) => handleStopChange(stop.id, 'type', value as StopType)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STOP_TYPE_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Cost (₹)</label>
                          <Input
                            type="number"
                            value={stop.estimatedCost}
                            onChange={(e) => handleStopChange(stop.id, 'estimatedCost', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Duration (mins)</label>
                          <Input
                            type="number"
                            value={stop.duration}
                            onChange={(e) => handleStopChange(stop.id, 'duration', parseInt(e.target.value) || 0)}
                            placeholder="30"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <Textarea
                            value={stop.description}
                            onChange={(e) => handleStopChange(stop.id, 'description', e.target.value)}
                            placeholder="Short description of this stop"
                            rows={2}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Address</label>
                          <Input
                            value={stop.address}
                            onChange={(e) => handleStopChange(stop.id, 'address', e.target.value)}
                            placeholder="Full address"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                          <Input
                            type="number"
                            step="any"
                            value={stop.coordinates.lat}
                            onChange={(e) => handleStopChange(stop.id, 'coordinates', { ...stop.coordinates, lat: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                          <Input
                            type="number"
                            step="any"
                            value={stop.coordinates.lng}
                            onChange={(e) => handleStopChange(stop.id, 'coordinates', { ...stop.coordinates, lng: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Google Maps URL</label>
                          <Input
                            value={stop.googleMapsUrl || ''}
                            onChange={(e) => handleStopChange(stop.id, 'googleMapsUrl', e.target.value)}
                            placeholder="https://maps.google.com/?q=..."
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Tips (optional)</label>
                          <Input
                            value={stop.tips || ''}
                            onChange={(e) => handleStopChange(stop.id, 'tips', e.target.value)}
                            placeholder="Pro tip for visitors"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Plan' : 'Create Plan'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Plans Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[300px]">Plan</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Vibe</TableHead>
              <TableHead className="text-center">Stops</TableHead>
              <TableHead className="text-center">Cost</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" /> Views
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datePlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No date plans yet. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              datePlans.map(plan => {
                const vibeInfo = getVibeInfo(plan.vibe);
                return (
                  <TableRow key={plan.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={plan.heroImage} 
                            alt={plan.title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.currentTarget.src = '/placeholder.svg'}
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{plan.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{plan.subtitle}</p>
                          {plan.isFeatured && (
                            <span className="inline-block text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded mt-1">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{plan.area}</span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                        vibeInfo.color
                      )}>
                        {vibeInfo.emoji} {vibeInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{plan.stops.length}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-rose-600">{formatCost(plan.totalCost)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{(plan.views || 0).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Date Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the date plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DatePlanAdmin;
