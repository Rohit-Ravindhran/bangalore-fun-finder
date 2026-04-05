(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/BottomNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const BottomNav = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const leftItems = [
        {
            id: 'blog',
            label: 'Guide',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
            path: '/blog',
            comingSoon: false
        },
        {
            id: 'date-ideas',
            label: 'Date Ideas',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
            path: '/date-ideas',
            comingSoon: false
        }
    ];
    const rightItems = [
        {
            id: 'food',
            label: 'Food Spots',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"],
            path: '/food',
            comingSoon: false
        },
        {
            id: 'meetups',
            label: 'Meetups',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
            path: '/meetups',
            comingSoon: false
        }
    ];
    const NavButton = (param)=>{
        let { item } = param;
        const isActive = pathname === item.path;
        const Icon = item.icon;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>router.push(item.path),
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center flex-1 h-full relative", isActive ? "text-[#FFD60A]" : "text-gray-500 dark:text-gray-500"),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5", isActive && "text-[#FFD60A]")
                }, void 0, false, {
                    fileName: "[project]/src/components/BottomNav.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] mt-1 font-medium", isActive && "text-[#FFD60A]"),
                    children: item.label
                }, void 0, false, {
                    fileName: "[project]/src/components/BottomNav.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/BottomNav.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    const isExploreActive = pathname === '/';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0D0D0F] border-t border-gray-200 dark:border-white/[0.06] z-50 pb-safe",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-around h-16 max-w-lg mx-auto relative",
            children: [
                leftItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavButton, {
                        item: item
                    }, item.id, false, {
                        fileName: "[project]/src/components/BottomNav.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/'),
                        className: "absolute -top-6 flex flex-col items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200", isExploreActive ? "bg-gradient-to-br from-[#FFD60A] to-[#FFAA00] shadow-[0_0_24px_rgba(255,214,10,0.45)]" : "bg-white dark:bg-[#1A1A1C] border-2 border-[#FFD60A]/30 dark:border-[#FFD60A]/20 hover:border-[#FFD60A]/70 dark:hover:border-[#FFD60A]/50 shadow-md"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-6 w-6 transition-colors", isExploreActive ? "text-black" : "text-[#FFD60A]")
                                }, void 0, false, {
                                    fileName: "[project]/src/components/BottomNav.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/BottomNav.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] mt-1.5 font-semibold", isExploreActive ? "text-[#FFD60A]" : "text-gray-500 dark:text-gray-500"),
                                children: "Explore"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BottomNav.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BottomNav.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/BottomNav.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                rightItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavButton, {
                        item: item
                    }, item.id, false, {
                        fileName: "[project]/src/components/BottomNav.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/BottomNav.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/BottomNav.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(BottomNav, "gA9e4WsoP6a20xDgQgrFkfMP8lc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = BottomNav;
const __TURBOPACK__default__export__ = BottomNav;
var _c;
__turbopack_context__.k.register(_c, "BottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ActivityGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const ActivityGrid = (param)=>{
    let { activities, onLike, likedActivities, onShare, columns = 2, sectionType } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleCardClick = (activityId)=>{
        router.push("/activity/".concat(activityId));
    };
    // Function to handle image loading error - use title-based placeholder
    const handleImageError = (e, title)=>{
        if (title) {
            let hash = 0;
            for(let i = 0; i < title.length; i++){
                hash = title.charCodeAt(i) + ((hash << 5) - hash);
            }
            const backgroundColor = Math.abs(hash).toString(16).substring(0, 6);
            e.currentTarget.src = "https://via.placeholder.com/400x300/".concat(backgroundColor, "/FFFFFF?text=").concat(encodeURIComponent(title.substring(0, 20)));
        } else {
            e.currentTarget.src = '/placeholder.svg';
        }
    };
    // Improved format time to 12-hour format with better validation
    const formatTimeTo12Hour = (timeString)=>{
        if (!timeString) return '';
        if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
            const hourMatch = timeString.match(/^(\d{1,2}):/);
            if (hourMatch) {
                const hour = parseInt(hourMatch[1], 10);
                if (hour >= 50 && hour <= 59) return '';
            }
            return timeString;
        }
        try {
            const timeParts = timeString.split(':');
            if (timeParts.length < 2) return timeString;
            let hours = parseInt(timeParts[0], 10);
            let minutes = parseInt(timeParts[1], 10);
            if (hours >= 50 && hours <= 59) return '';
            if (isNaN(hours) || hours < 0 || hours > 23) return '';
            if (isNaN(minutes) || minutes < 0 || minutes > 59) return '';
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return "".concat(hours, ":").concat(minutes < 10 ? '0' + minutes : minutes, " ").concat(ampm);
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };
    // Function to truncate text
    const truncateText = (text, maxLength)=>{
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        children: activities.map((activity)=>{
            const formattedTime = formatTimeTo12Hour(activity.time);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700",
                onClick: ()=>handleCardClick(activity.id),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative aspect-[16/10] overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: activity.image || '/placeholder.svg',
                            alt: activity.title,
                            className: "w-full h-full object-cover",
                            loading: "lazy",
                            onError: (e)=>handleImageError(e, activity.title)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ActivityGrid.tsx",
                            lineNumber: 101,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ActivityGrid.tsx",
                        lineNumber: 100,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight",
                                children: activity.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            activity.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400 dark:text-gray-500 mb-3 line-clamp-2",
                                children: truncateText(activity.description, 100)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                lineNumber: 119,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        className: "h-3.5 w-3.5 text-orange-400"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ActivityGrid.tsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: activity.location
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ActivityGrid.tsx",
                                        lineNumber: 127,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3",
                                children: [
                                    activity.date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                className: "h-3.5 w-3.5 text-gray-400 dark:text-gray-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                                lineNumber: 134,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: activity.date
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                                lineNumber: 135,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ActivityGrid.tsx",
                                        lineNumber: 133,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    formattedTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "h-3.5 w-3.5 text-gray-400 dark:text-gray-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                                lineNumber: 140,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formattedTime
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                                lineNumber: 141,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ActivityGrid.tsx",
                                        lineNumber: 139,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                lineNumber: 131,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-sm text-gray-900 dark:text-white",
                                        children: activity.priceRange || 'Free'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ActivityGrid.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-xs",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            handleCardClick(activity.id);
                                        },
                                        children: [
                                            "Details",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                                lineNumber: 159,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ActivityGrid.tsx",
                                        lineNumber: 151,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ActivityGrid.tsx",
                                lineNumber: 147,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ActivityGrid.tsx",
                        lineNumber: 111,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, activity.id, true, {
                fileName: "[project]/src/components/ActivityGrid.tsx",
                lineNumber: 94,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/components/ActivityGrid.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ActivityGrid, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ActivityGrid;
const __TURBOPACK__default__export__ = ActivityGrid;
var _c;
__turbopack_context__.k.register(_c, "ActivityGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/mockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/activityService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    "getCategoryNames",
    ()=>getCategoryNames,
    "getFilteredActivities",
    ()=>getFilteredActivities,
    "getFilteredActivitiesBySection",
    ()=>getFilteredActivitiesBySection,
    "subscribeUser",
    ()=>subscribeUser,
    "updateActivity",
    ()=>updateActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/mockData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/integrations/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
;
;
// =============================================
// Input Validation Schemas
// =============================================
const urlSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(''));
const activitySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Title is required').max(200, 'Title too long'),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(5000, 'Description too long').optional(),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    priceRange: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional(),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    categoryIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    mapLink: urlSchema,
    contactInfo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
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
        const category = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].find((cat)=>cat.id === id);
        return category ? category.name : '';
    }).filter(Boolean);
};
// Helper to transform database activities to frontend format
const transformActivities = (activities)=>{
    return activities.map((act)=>{
        var _act_latitude, _act_longitude;
        return {
            id: String(act.id),
            title: act.title || '',
            image: act.image || '/placeholder.svg',
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
            latitude: (_act_latitude = act.latitude) !== null && _act_latitude !== void 0 ? _act_latitude : undefined,
            longitude: (_act_longitude = act.longitude) !== null && _act_longitude !== void 0 ? _act_longitude : undefined
        };
    });
};
const fetchCategories = async ()=>{
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*');
        if (error) {
            logError('Error fetching categories:', error);
            // Fallback to local data
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].map((cat)=>({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"];
    }
};
async function getFilteredActivitiesBySection(sectionType) {
    let sortOption = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'newest';
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*');
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
async function getFilteredActivities() {
    let filter = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, sortOption = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'newest';
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*');
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*').order('created_at', {
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').select('*').eq('id', parseInt(id, 10)).single();
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
const createActivity = async (activity, adminId)=>{
    try {
        // Validate input
        const parseResult = activitySchema.safeParse(activity);
        if (!parseResult.success) {
            var _parseResult_error_errors_;
            logError('Validation error:', parseResult.error);
            return {
                data: null,
                error: ((_parseResult_error_errors_ = parseResult.error.errors[0]) === null || _parseResult_error_errors_ === void 0 ? void 0 : _parseResult_error_errors_.message) || 'Invalid input'
            };
        }
        // If adminId provided, use secure RPC function
        if (adminId) {
            var _activity_latitude, _activity_longitude;
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('admin_create_activity', {
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
                p_latitude: (_activity_latitude = activity.latitude) !== null && _activity_latitude !== void 0 ? _activity_latitude : null,
                p_longitude: (_activity_longitude = activity.longitude) !== null && _activity_longitude !== void 0 ? _activity_longitude : null
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').insert([
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
            var _parseResult_error_errors_;
            logError('Validation error:', parseResult.error);
            return {
                data: null,
                error: ((_parseResult_error_errors_ = parseResult.error.errors[0]) === null || _parseResult_error_errors_ === void 0 ? void 0 : _parseResult_error_errors_.message) || 'Invalid input'
            };
        }
        // If adminId provided, use secure RPC function
        if (adminId) {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('admin_update_activity', {
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').update({
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
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('admin_delete_activity', {
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
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('activities').delete().eq('id', parseInt(id, 10));
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
        const { data: existingUsers, error: checkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('email', email);
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
        const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').insert([
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*');
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('tags').select('*');
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useActivities.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activityKeys",
    ()=>activityKeys,
    "useActivitiesBySection",
    ()=>useActivitiesBySection,
    "useActivity",
    ()=>useActivity,
    "useAllSections",
    ()=>useAllSections,
    "useCategories",
    ()=>useCategories,
    "useInvalidateActivities",
    ()=>useInvalidateActivities,
    "usePrefetchActivity",
    ()=>usePrefetchActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/activityService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
;
;
const activityKeys = {
    all: [
        'activities'
    ],
    lists: ()=>[
            ...activityKeys.all,
            'list'
        ],
    list: (section, sortOption)=>[
            ...activityKeys.lists(),
            {
                section,
                sortOption
            }
        ],
    details: ()=>[
            ...activityKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...activityKeys.details(),
            id
        ],
    categories: [
        'categories'
    ]
};
function useActivitiesBySection(sectionType) {
    let sortOption = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'newest', enabled = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: activityKeys.list(sectionType, sortOption),
        queryFn: {
            "useActivitiesBySection.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredActivitiesBySection"])(sectionType, sortOption)
        }["useActivitiesBySection.useQuery"],
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });
}
_s(useActivitiesBySection, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useAllSections() {
    let sortOption = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'newest';
    _s1();
    const allActivitiesQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: activityKeys.list('all', sortOption),
        queryFn: {
            "useAllSections.useQuery[allActivitiesQuery]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredActivitiesBySection"])('all', sortOption)
        }["useAllSections.useQuery[allActivitiesQuery]"],
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });
    const uniqueExperiencesQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: activityKeys.list('unique', sortOption),
        queryFn: {
            "useAllSections.useQuery[uniqueExperiencesQuery]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredActivitiesBySection"])('unique', sortOption)
        }["useAllSections.useQuery[uniqueExperiencesQuery]"],
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });
    const dateIdeasQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: activityKeys.list('date', sortOption),
        queryFn: {
            "useAllSections.useQuery[dateIdeasQuery]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredActivitiesBySection"])('date', sortOption)
        }["useAllSections.useQuery[dateIdeasQuery]"],
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });
    return {
        allActivities: allActivitiesQuery,
        uniqueExperiences: uniqueExperiencesQuery,
        dateIdeas: dateIdeasQuery,
        isLoading: allActivitiesQuery.isLoading || uniqueExperiencesQuery.isLoading || dateIdeasQuery.isLoading,
        isError: allActivitiesQuery.isError || uniqueExperiencesQuery.isError || dateIdeasQuery.isError
    };
}
_s1(useAllSections, "cWjSRT0t98CAurt+UZ8aTURTFEM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCategories() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: activityKeys.categories,
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCategories"],
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000
    });
}
_s2(useCategories, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useActivity(id) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: activityKeys.detail(id),
        queryFn: {
            "useActivity.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActivityById"])(id)
        }["useActivity.useQuery"],
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        // Use any cached list data that includes this activity
        initialData: {
            "useActivity.useQuery": ()=>{
                // Try to find this activity in any cached list
                const allQueries = queryClient.getQueriesData({
                    queryKey: activityKeys.lists()
                });
                for (const [, data] of allQueries){
                    if (data) {
                        const activity = data.find({
                            "useActivity.useQuery.activity": (a)=>a.id === id
                        }["useActivity.useQuery.activity"]);
                        if (activity) return activity;
                    }
                }
                return undefined;
            }
        }["useActivity.useQuery"]
    });
}
_s3(useActivity, "BLZt64a2VVrVbN4W5DyNUDE4KQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePrefetchActivity() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: activityKeys.detail(id),
            queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$activityService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActivityById"])(id),
            staleTime: 5 * 60 * 1000
        });
    };
}
_s4(usePrefetchActivity, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
function useInvalidateActivities() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return ()=>{
        queryClient.invalidateQueries({
            queryKey: activityKeys.all
        });
    };
}
_s5(useInvalidateActivities, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/use-toast.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/views/DateIdeas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BottomNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ActivityGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ActivityGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useActivities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useActivities.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/use-toast.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const DateIdeas = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [likedActivities, setLikedActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Try date-specific section first, fall back to 'all'
    const { data: activities = [], isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useActivities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActivitiesBySection"])('date');
    const handleLike = (id)=>{
        setLikedActivities((prev)=>{
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                toast({
                    title: 'Removed from favorites',
                    duration: 1500
                });
            } else {
                next.add(id);
                toast({
                    title: 'Added to favorites',
                    duration: 1500
                });
            }
            return next;
        });
    };
    const handleShare = async (id)=>{
        const url = "".concat(window.location.origin, "/activity/").concat(id);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Date Ideas in Bangalore',
                    url
                });
            } else {
                navigator.clipboard.writeText(url);
                toast({
                    title: 'Link copied!',
                    duration: 1500
                });
            }
        } catch (e) {
        // share cancelled
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 [transform:translateZ(0)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push('/'),
                            className: "p-2 -ml-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-5 w-5 text-gray-700 dark:text-gray-300"
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/views/DateIdeas.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "font-semibold text-gray-900 dark:text-white",
                            children: "Date Ideas"
                        }, void 0, false, {
                            fileName: "[project]/src/views/DateIdeas.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-9"
                        }, void 0, false, {
                            fileName: "[project]/src/views/DateIdeas.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/views/DateIdeas.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "px-4 pt-4 pb-8 max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400 mb-4",
                        children: "Curated spots & experiences perfect for a date in Bangalore."
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center items-center py-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "h-8 w-8 animate-spin text-orange-500"
                        }, void 0, false, {
                            fileName: "[project]/src/views/DateIdeas.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : activities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 dark:text-gray-400 text-sm",
                            children: "No date ideas found. Check back soon!"
                        }, void 0, false, {
                            fileName: "[project]/src/views/DateIdeas.tsx",
                            lineNumber: 70,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ActivityGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        activities: activities,
                        onLike: handleLike,
                        likedActivities: likedActivities,
                        onShare: handleShare,
                        columns: 2,
                        sectionType: "Date Ideas"
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/DateIdeas.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DateIdeas, "UH55IpgYFQslG0ulGPyMSGm2zto=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useActivities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActivitiesBySection"]
    ];
});
_c = DateIdeas;
const __TURBOPACK__default__export__ = DateIdeas;
var _c;
__turbopack_context__.k.register(_c, "DateIdeas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_da1820c6._.js.map