import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFilteredActivitiesBySection,
  getFilteredActivities,
  fetchCategories,
  getActivityById,
} from '@/services/activityService';
import { Activity } from '@/components/ActivityCard';

// Query keys for cache management
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (section: string, sortOption: string) =>
    [...activityKeys.lists(), { section, sortOption }] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
  categories: ['categories'] as const,
};

// Hook for fetching activities by section with caching
export function useActivitiesBySection(
  sectionType: string,
  sortOption: string = 'newest',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: activityKeys.list(sectionType, sortOption),
    queryFn: () => getFilteredActivitiesBySection(sectionType, sortOption),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for fetching all section data in parallel
export function useAllSections(sortOption: string = 'newest') {
  const allActivitiesQuery = useQuery({
    queryKey: activityKeys.list('all', sortOption),
    queryFn: () => getFilteredActivitiesBySection('all', sortOption),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const uniqueExperiencesQuery = useQuery({
    queryKey: activityKeys.list('unique', sortOption),
    queryFn: () => getFilteredActivitiesBySection('unique', sortOption),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const dateIdeasQuery = useQuery({
    queryKey: activityKeys.list('date', sortOption),
    queryFn: () => getFilteredActivitiesBySection('date', sortOption),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    allActivities: allActivitiesQuery,
    uniqueExperiences: uniqueExperiencesQuery,
    dateIdeas: dateIdeasQuery,
    isLoading:
      allActivitiesQuery.isLoading ||
      uniqueExperiencesQuery.isLoading ||
      dateIdeasQuery.isLoading,
    isError:
      allActivitiesQuery.isError ||
      uniqueExperiencesQuery.isError ||
      dateIdeasQuery.isError,
  };
}

// Hook for fetching categories with caching
export function useCategories() {
  return useQuery({
    queryKey: activityKeys.categories,
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // Categories are stable, cache for 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });
}

// Hook for fetching a single activity with caching
export function useActivity(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: activityKeys.detail(id!),
    queryFn: () => getActivityById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    // Use any cached list data that includes this activity
    initialData: () => {
      // Try to find this activity in any cached list
      const allQueries = queryClient.getQueriesData<Activity[]>({
        queryKey: activityKeys.lists(),
      });

      for (const [, data] of allQueries) {
        if (data) {
          const activity = data.find((a) => a.id === id);
          if (activity) return activity;
        }
      }
      return undefined;
    },
  });
}

// Hook to prefetch activity details (for better UX on hover)
export function usePrefetchActivity() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: activityKeys.detail(id),
      queryFn: () => getActivityById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

// Utility to invalidate all activity caches
export function useInvalidateActivities() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: activityKeys.all });
  };
}
