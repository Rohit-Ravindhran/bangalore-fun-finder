module.exports = [
"[project]/.next-internal/server/app/activity/[slug]/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/data/mockData.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "quickFilters",
    ()=>quickFilters
]);
const categories = [
    {
        id: 'outdoor',
        name: 'Outdoor',
        emoji: '🏞️'
    },
    {
        id: 'arts',
        name: 'Arts',
        emoji: '🎨'
    },
    {
        id: 'events',
        name: 'Events',
        emoji: '🎶'
    },
    {
        id: 'sports',
        name: 'Sports',
        emoji: '⚽'
    },
    {
        id: 'theatre',
        name: 'Theatre',
        emoji: '🎭'
    },
    {
        id: 'unique',
        name: 'Unique',
        emoji: '🎯'
    },
    {
        id: 'wellness',
        name: 'Wellness',
        emoji: '🧘'
    },
    {
        id: 'parties',
        name: 'Parties',
        emoji: '🎉'
    },
    {
        id: 'foodie',
        name: 'Foodie',
        emoji: '🍽️'
    },
    {
        id: 'trek',
        name: 'Trek',
        emoji: '🏕️'
    },
    {
        id: 'families',
        name: 'For Families',
        emoji: '👨‍👩‍👧'
    }
];
const quickFilters = [
    {
        id: 'today',
        label: 'Today'
    },
    {
        id: 'free',
        label: 'Free'
    },
    {
        id: 'creative',
        label: 'Creative'
    },
    {
        id: 'solo',
        label: 'Solo'
    },
    {
        id: 'plans',
        label: 'Plans'
    },
    {
        id: 'mindful',
        label: 'Mindful'
    }
]; // No more activities array or getActivityById function here
 // All data is now fetched from the database via activityService
}),
"[project]/src/integrations/supabase/client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
const SUPABASE_URL = ("TURBOPACK compile-time value", "https://qphujgdfenhxyniidetd.supabase.co");
const SUPABASE_ANON_KEY = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHVqZ2RmZW5oeHluaWlkZXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjkzMjksImV4cCI6MjA3OTQ0NTMyOX0.G86KD72Py6YsZsBy5YJGZLwVxStzWVVmK-gvHD5oers");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(SUPABASE_URL, SUPABASE_ANON_KEY);
}),
"[project]/src/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activitySlug",
    ()=>activitySlug,
    "cn",
    ()=>cn,
    "idFromSlug",
    ()=>idFromSlug,
    "slugify",
    ()=>slugify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function slugify(text) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
}
function activitySlug(title, id) {
    const s = slugify(title);
    return s ? `${s}-${id}` : String(id);
}
function idFromSlug(slug) {
    const parts = slug.split('-');
    return parts[parts.length - 1];
}
}),
"[project]/src/services/activityService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createActivity",
    ()=>createActivity,
    "deleteActivity",
    ()=>deleteActivity,
    "fetchActivities",
    ()=>fetchActivities,
    "fetchCategories",
    ()=>fetchCategories,
    "fetchCategoriesFromTable",
    ()=>fetchCategoriesFromTable,
    "fetchTagsFromTable",
    ()=>fetchTagsFromTable,
    "getActivityById",
    ()=>getActivityById,
    "getActivityBySlug",
    ()=>getActivityBySlug,
    "getCategoryNames",
    ()=>getCategoryNames,
    "getFilteredActivities",
    ()=>getFilteredActivities,
    "getFilteredActivitiesBySection",
    ()=>getFilteredActivitiesBySection,
    "subscribeUser",
    ()=>subscribeUser,
    "updateActivity",
    ()=>updateActivity,
    "uploadActivityImage",
    ()=>uploadActivityImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/mockData.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/integrations/supabase/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
// =============================================
// Input Validation Schemas
// =============================================
const urlSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(''));
const activitySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Title is required').max(200, 'Title too long'),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000, 'Description too long').optional(),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    priceRange: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional(),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    categoryIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    mapLink: urlSchema,
    contactInfo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
    url: urlSchema
});
// Returns true if the activity's date clearly indicates it has already passed
const isExpiredActivity = (dateStr)=>{
    if (!dateStr || dateStr.trim() === '') return false;
    const lower = dateStr.toLowerCase().trim();
    // Clearly ongoing / evergreen — never expired
    const ongoingTerms = [
        'ongoing',
        'anytime',
        'everyday',
        'daily',
        'weekly',
        'monthly',
        'always',
        'open',
        'permanent',
        'year round',
        'coming soon'
    ];
    if (ongoingTerms.some((t)=>lower.includes(t))) return false;
    // Future-pointing terms — not expired
    const futureTerms = [
        'today',
        'tonight',
        'tomorrow',
        'this weekend',
        'this week',
        'upcoming',
        'next'
    ];
    if (futureTerms.some((t)=>lower.includes(t))) return false;
    // Try native Date parse — only trust it when the year is explicit (avoids false positives)
    const hasYear = /\b(202\d|203\d)\b/.test(dateStr);
    if (hasYear) {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return parsed < today;
        }
    }
    return false;
};
// Helper to log errors only in development
const logError = (message, error)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        console.error(message, error);
    }
};
const getCategoryNames = (categoryIds)=>{
    if (!categoryIds || !Array.isArray(categoryIds)) return [];
    return categoryIds.map((id)=>{
        const category = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categories"].find((cat)=>cat.id === id);
        return category ? category.name : '';
    }).filter(Boolean);
};
// Helper to transform database activities to frontend format
const transformActivities = (activities)=>{
    return activities.map((act)=>({
            id: String(act.id),
            slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["activitySlug"])(act.title || '', act.id),
            title: act.title || '',
            image: act.image || '',
            tags: act.tags || [],
            priceRange: act.price_range || 'Free',
            location: act.location || 'Bangalore',
            lastUpdated: act.updated_at ? new Date(act.updated_at).toLocaleDateString() : 'today',
            categoryIds: act.category_ids || [],
            categoryNames: getCategoryNames(act.category_ids || []),
            description: act.description || '',
            date: act.date || '',
            time: act.time || '',
            mapLink: act.map_link || '',
            contactInfo: act.contact_info || '',
            url: act.url || '',
            latitude: act.latitude ?? undefined,
            longitude: act.longitude ?? undefined
        }));
};
const fetchCategories = async ()=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*');
        if (error) {
            logError('Error fetching categories:', error);
            // Fallback to local data
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categories"].map((cat)=>({
                    id: cat.id,
                    name: cat.name,
                    emoji: cat.emoji || '✨' // Add a default emoji if not present
                }));
        }
        // Transform database categories to match frontend format
        return data.map((cat)=>({
                id: String(cat.id),
                name: cat.name,
                emoji: '✨' // Add a default emoji since it might not be in the database
            }));
    } catch (error) {
        logError('Error in fetchCategories:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["categories"];
    }
};
async function getFilteredActivitiesBySection(sectionType, sortOption = 'newest') {
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*');
        if (sectionType !== 'all') {
            query = query.eq('section_type', sectionType);
        }
        // Apply sorting
        switch(sortOption){
            case 'popular':
                // Assuming we have a popularity field or using tags to determine popularity
                query = query.contains('tags', [
                    'trending'
                ]);
                break;
            case 'price_low_high':
                // This is simplistic - in reality you'd need a more sophisticated approach
                query = query.order('price_range', {
                    ascending: true
                });
                break;
            case 'price_high_low':
                query = query.order('price_range', {
                    ascending: false
                });
                break;
            case 'newest':
            default:
                query = query.order('created_at', {
                    ascending: false
                });
                break;
        }
        const { data, error } = await query;
        if (error) {
            logError('Error fetching activities by section:', error);
            // Return empty array as fallback
            return [];
        }
        // Transform activities to frontend format, filtering out expired events
        return transformActivities(data).filter((a)=>!isExpiredActivity(a.date));
    } catch (error) {
        logError('Error in getFilteredActivitiesBySection:', error);
        return [];
    }
}
async function getFilteredActivities(filter = {}, sortOption = 'newest') {
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*');
        // Apply category filter if it exists
        if (filter && typeof filter === 'object' && 'categoryId' in filter && filter.categoryId) {
            query = query.contains('category_ids', [
                filter.categoryId
            ]);
        }
        // Apply sorting
        switch(sortOption){
            case 'popular':
                query = query.contains('tags', [
                    'trending'
                ]);
                break;
            case 'price_low_high':
                query = query.order('price_range', {
                    ascending: true
                });
                break;
            case 'price_high_low':
                query = query.order('price_range', {
                    ascending: false
                });
                break;
            case 'newest':
            default:
                query = query.order('created_at', {
                    ascending: false
                });
                break;
        }
        const { data, error } = await query;
        if (error) {
            logError('Error fetching filtered activities:', error);
            return [];
        }
        // Transform activities to frontend format, filtering out expired events
        return transformActivities(data).filter((a)=>!isExpiredActivity(a.date));
    } catch (error) {
        logError('Error in getFilteredActivities:', error);
        return [];
    }
}
async function fetchActivities() {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*').order('created_at', {
            ascending: false
        });
        if (error) {
            logError('Error fetching activities:', error);
            return [];
        }
        return transformActivities(data);
    } catch (error) {
        logError('Error in fetchActivities:', error);
        return [];
    }
}
async function getActivityById(id) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*').eq('id', parseInt(id, 10)).single();
        if (error) {
            logError('Error fetching activity by ID:', error);
            return null;
        }
        if (!data) {
            return null;
        }
        // Transform to frontend format
        return {
            id: String(data.id),
            slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["activitySlug"])(data.title || '', data.id),
            title: data.title,
            image: data.image,
            tags: data.tags || [],
            priceRange: data.price_range,
            location: data.location,
            lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'today',
            categoryIds: data.category_ids || [],
            categoryNames: getCategoryNames(data.category_ids || []),
            description: data.description || '',
            date: data.date || '',
            time: data.time || '',
            mapLink: data.map_link || '',
            contactInfo: data.contact_info || '',
            url: data.url || ''
        };
    } catch (error) {
        logError('Error in getActivityById:', error);
        return null;
    }
}
async function getActivityBySlug(slug) {
    const parts = slug.split('-');
    const id = parts[parts.length - 1];
    if (!id || isNaN(Number(id))) return null;
    return getActivityById(id);
}
const uploadActivityImage = async (file)=>{
    try {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            body
        });
        const json = await res.json();
        if (!res.ok) {
            logError('Image upload API error:', json.error);
            return {
                url: null,
                error: json.error || 'Upload failed'
            };
        }
        return {
            url: json.url,
            error: null
        };
    } catch (error) {
        logError('Error in uploadActivityImage:', error);
        return {
            url: null,
            error: 'Upload failed unexpectedly'
        };
    }
};
const createActivity = async (activity, adminId)=>{
    try {
        // Validate input
        const parseResult = activitySchema.safeParse(activity);
        if (!parseResult.success) {
            logError('Validation error:', parseResult.error);
            return {
                data: null,
                error: parseResult.error.errors[0]?.message || 'Invalid input'
            };
        }
        // If adminId provided, use secure RPC function
        if (adminId) {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].rpc('admin_create_activity', {
                p_admin_id: adminId,
                p_title: activity.title || '',
                p_description: activity.description || null,
                p_image: activity.image || null,
                p_price_range: activity.priceRange || null,
                p_location: activity.location || null,
                p_date: activity.date || null,
                p_time: activity.time || null,
                p_map_link: activity.mapLink || null,
                p_contact_info: activity.contactInfo || null,
                p_url: activity.url || null,
                p_category_ids: activity.categoryIds || [],
                p_tags: activity.tags || [],
                p_section_type: 'all',
                p_enabled: true,
                p_latitude: activity.latitude ?? null,
                p_longitude: activity.longitude ?? null
            });
            if (error) {
                logError('Error creating activity:', error);
                return {
                    data: null,
                    error: 'Failed to create activity'
                };
            }
            const result = data;
            if (!result.success) {
                return {
                    data: null,
                    error: result.message
                };
            }
            // Fetch the created activity
            if (result.activity_id) {
                const created = await getActivityById(String(result.activity_id));
                return {
                    data: created,
                    error: null
                };
            }
            return {
                data: null,
                error: null
            };
        }
        // Fallback: direct insert (will fail with new RLS policies)
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').insert([
            {
                title: activity.title,
                description: activity.description,
                image: activity.image,
                price_range: activity.priceRange,
                location: activity.location,
                tags: activity.tags,
                category_ids: activity.categoryIds,
                date: activity.date,
                time: activity.time,
                map_link: activity.mapLink,
                contact_info: activity.contactInfo,
                url: activity.url
            }
        ]).select();
        if (error) {
            logError('Error creating activity:', error);
            return {
                data: null,
                error: 'Unauthorized or failed to create activity'
            };
        }
        return {
            data: data ? transformActivities(data)[0] : null,
            error: null
        };
    } catch (error) {
        logError('Error in createActivity:', error);
        return {
            data: null,
            error: 'An unexpected error occurred'
        };
    }
};
const updateActivity = async (id, activity, adminId)=>{
    try {
        // Validate input (partial validation for updates)
        const partialSchema = activitySchema.partial();
        const parseResult = partialSchema.safeParse(activity);
        if (!parseResult.success) {
            logError('Validation error:', parseResult.error);
            return {
                data: null,
                error: parseResult.error.errors[0]?.message || 'Invalid input'
            };
        }
        // If adminId provided, use secure RPC function
        if (adminId) {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].rpc('admin_update_activity', {
                p_admin_id: adminId,
                p_activity_id: parseInt(id, 10),
                p_title: activity.title || null,
                p_description: activity.description !== undefined ? activity.description : null,
                p_image: activity.image !== undefined ? activity.image : null,
                p_price_range: activity.priceRange !== undefined ? activity.priceRange : null,
                p_location: activity.location !== undefined ? activity.location : null,
                p_date: activity.date !== undefined ? activity.date : null,
                p_time: activity.time !== undefined ? activity.time : null,
                p_map_link: activity.mapLink !== undefined ? activity.mapLink : null,
                p_contact_info: activity.contactInfo !== undefined ? activity.contactInfo : null,
                p_url: activity.url !== undefined ? activity.url : null,
                p_category_ids: activity.categoryIds !== undefined ? activity.categoryIds : null,
                p_tags: activity.tags !== undefined ? activity.tags : null,
                p_section_type: null,
                p_enabled: null,
                p_latitude: activity.latitude !== undefined ? activity.latitude : null,
                p_longitude: activity.longitude !== undefined ? activity.longitude : null
            });
            if (error) {
                logError('Error updating activity:', error);
                return {
                    data: null,
                    error: 'Failed to update activity'
                };
            }
            const result = data;
            if (!result.success) {
                return {
                    data: null,
                    error: result.message
                };
            }
            // Fetch the updated activity
            const updated = await getActivityById(id);
            return {
                data: updated,
                error: null
            };
        }
        // Fallback: direct update (will fail with new RLS policies)
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').update({
            title: activity.title,
            description: activity.description,
            image: activity.image,
            price_range: activity.priceRange,
            location: activity.location,
            tags: activity.tags,
            category_ids: activity.categoryIds,
            date: activity.date,
            time: activity.time,
            map_link: activity.mapLink,
            contact_info: activity.contactInfo,
            url: activity.url
        }).eq('id', parseInt(id, 10)).select();
        if (error) {
            logError('Error updating activity:', error);
            return {
                data: null,
                error: 'Unauthorized or failed to update activity'
            };
        }
        return {
            data: data ? transformActivities(data)[0] : null,
            error: null
        };
    } catch (error) {
        logError('Error in updateActivity:', error);
        return {
            data: null,
            error: 'An unexpected error occurred'
        };
    }
};
const deleteActivity = async (id, adminId)=>{
    try {
        // If adminId provided, use secure RPC function
        if (adminId) {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].rpc('admin_delete_activity', {
                p_admin_id: adminId,
                p_activity_id: parseInt(id, 10)
            });
            if (error) {
                logError('Error deleting activity:', error);
                return {
                    success: false,
                    error: 'Failed to delete activity'
                };
            }
            const result = data;
            return {
                success: result.success,
                error: result.success ? null : result.message
            };
        }
        // Fallback: direct delete (will fail with new RLS policies)
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('activities').delete().eq('id', parseInt(id, 10));
        if (error) {
            logError('Error deleting activity:', error);
            return {
                success: false,
                error: 'Unauthorized or failed to delete activity'
            };
        }
        return {
            success: true,
            error: null
        };
    } catch (error) {
        logError('Error in deleteActivity:', error);
        return {
            success: false,
            error: 'An unexpected error occurred'
        };
    }
};
const subscribeUser = async (email)=>{
    try {
        // First check if email already exists
        const { data: existingUsers, error: checkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('email', email);
        if (checkError) {
            logError('Error checking for existing user:', checkError);
            return {
                success: false,
                message: 'Error checking database'
            };
        }
        if (existingUsers && existingUsers.length > 0) {
            return {
                success: false,
                message: 'This email is already subscribed'
            };
        }
        // Insert new user
        const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('users').insert([
            {
                email
            }
        ]);
        if (insertError) {
            logError('Error subscribing user:', insertError);
            return {
                success: false,
                message: 'Could not subscribe at this time'
            };
        }
        return {
            success: true,
            message: 'Subscribed successfully!'
        };
    } catch (error) {
        logError('Error in subscribeUser:', error);
        return {
            success: false,
            message: 'An unexpected error occurred'
        };
    }
};
const fetchCategoriesFromTable = async ()=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*');
        if (error) {
            logError('Error fetching categories:', error);
            return [];
        }
        return data;
    } catch (error) {
        logError('Error in fetchCategoriesFromTable:', error);
        return [];
    }
};
const fetchTagsFromTable = async ()=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabase"].from('tags').select('*');
        if (error) {
            logError('Error fetching tags:', error);
            return [];
        }
        return data;
    } catch (error) {
        logError('Error in fetchTagsFromTable:', error);
        return [];
    }
};
}),
"[project]/src/views/ActivityDetail.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/views/ActivityDetail.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/views/ActivityDetail.tsx <module evaluation>", "default");
}),
"[project]/src/views/ActivityDetail.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/views/ActivityDetail.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/views/ActivityDetail.tsx", "default");
}),
"[project]/src/views/ActivityDetail.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$ActivityDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/views/ActivityDetail.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$ActivityDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/views/ActivityDetail.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$ActivityDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/activity/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/activityService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$ActivityDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/views/ActivityDetail.tsx [app-rsc] (ecmascript)");
;
;
;
;
const revalidate = 3600 // 1 hour
;
async function generateStaticParams() {
    const activities = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchActivities"])();
    return activities.map((a)=>({
            slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["activitySlug"])(a.title, a.id)
        }));
}
async function generateMetadata({ params }) {
    const { slug } = await params;
    const activity = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActivityBySlug"])(slug);
    if (!activity) return {
        title: 'Activity Not Found | Happenings Bangalore'
    };
    const description = activity.description || `${activity.title} at ${activity.location}${activity.priceRange ? ` · ${activity.priceRange}` : ''}`;
    return {
        title: `${activity.title} | Happenings Bangalore`,
        description,
        keywords: [
            activity.title,
            activity.location,
            'Bangalore',
            ...activity.tags ?? []
        ].join(', '),
        openGraph: {
            title: activity.title,
            description,
            type: 'article',
            url: `https://happeningsbangalore.com/activity/${slug}`,
            images: activity.image ? [
                {
                    url: activity.image,
                    alt: activity.title
                }
            ] : [
                {
                    url: 'https://happeningsbangalore.com/assets/og-image.jpg'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: activity.title,
            description,
            images: activity.image ? [
                activity.image
            ] : []
        }
    };
}
async function Page({ params }) {
    const { slug } = await params;
    const activity = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActivityBySlug"])(slug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$views$2f$ActivityDetail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        initialActivity: activity
    }, void 0, false, {
        fileName: "[project]/src/app/activity/[slug]/page.tsx",
        lineNumber: 52,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/activity/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/activity/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c79cc7ee._.js.map