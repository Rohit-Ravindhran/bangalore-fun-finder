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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-client] (ecmascript) <export default as IndianRupee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BottomNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const sections = [
    {
        id: 'dinner',
        label: 'Romantic Dinners',
        emoji: '🍽️',
        tagline: 'Places that set the mood without trying too hard',
        spots: [
            {
                name: 'Karavalli',
                area: 'Gateway Hotel, Residency Road',
                vibe: 'Fine dining',
                description: 'Authentic coastal Karnataka and South Indian cuisine served in a blue-lit heritage courtyard. Candlelit tables, antique wood, and a menu that rewards the curious — the Coorgi pandi curry and Mangalorean prawn gassi are benchmarks. Book a courtyard table specifically.',
                price: '₹3,000 – 5,000',
                bestTime: 'Dinner, 7:30 – 9 PM',
                mapLink: 'https://maps.google.com/?q=Karavalli+Gateway+Hotel+Bangalore',
                img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75'
            },
            {
                name: 'Caperberry',
                area: 'Lavelle Road',
                vibe: 'Modern European',
                description: "Chef Abhijit Saha's flagship — modern European with Asian inflections. Small, intimate dining room, thoughtful wine list, and a kitchen that actually cares about each plate. The tasting menu is the move if you want to hand control to the chef for the evening.",
                price: '₹3,500 – 6,000',
                bestTime: 'Dinner, Fri–Sat',
                mapLink: 'https://maps.google.com/?q=Caperberry+Lavelle+Road+Bangalore',
                img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=75'
            },
            {
                name: 'Olive Beach',
                area: 'Defence Colony, Indiranagar',
                vibe: 'Garden & fairy lights',
                description: "Mediterranean food in a garden setting with fairy lights overhead. Olive has been setting the tone for Bangalore date nights for over a decade without getting tired. The pizzas from the wood-fired oven, the wine selection, and the outdoor seating on a cool Bangalore evening — hard to beat.",
                price: '₹2,500 – 4,000',
                bestTime: 'Dinner, weekday recommended',
                mapLink: 'https://maps.google.com/?q=Olive+Beach+Defence+Colony+Bangalore',
                img: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=75'
            },
            {
                name: 'Fava',
                area: 'UB City, Vittal Mallya Road',
                vibe: 'Rooftop + views',
                description: 'Mediterranean on the UB City terrace with a view over one of the most manicured courtyards in the city. The wood-fired mezze platter is shareable and excellent. This is a dress-up occasion — the setting earns it. Try to arrive at dusk when the lighting transitions.',
                price: '₹3,000 – 5,000',
                bestTime: 'Dusk, 6:30 – 9 PM',
                mapLink: 'https://maps.google.com/?q=Fava+UB+City+Bangalore',
                img: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=75'
            },
            {
                name: 'The Fatty Bao',
                area: 'Indiranagar & Koramangala',
                vibe: 'Buzzy & intimate',
                description: 'Asian gastropub with a serious dim sum program and a cocktail list that actually complements the food. Loud enough that the conversation feels private, small enough that you notice the details. The pork bao and the crispy okra are non-negotiables.',
                price: '₹1,500 – 2,500',
                bestTime: 'Dinner, 7 – 9 PM',
                mapLink: 'https://maps.google.com/?q=The+Fatty+Bao+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=75'
            },
            {
                name: 'Windmills Craftworks',
                area: 'HSR Layout',
                vibe: 'Live jazz + craft beer',
                description: 'Live jazz and blues most nights of the week, some of the best in-house craft beer in the city, and a crowd that actually listens to the music. Book a table in advance, order the Hefeweizen, and let the band set the pace for the evening. Unpretentious and genuinely good.',
                price: '₹1,200 – 2,000',
                bestTime: 'Show nights ~8 PM',
                mapLink: 'https://maps.google.com/?q=Windmills+Craftworks+HSR+Bangalore',
                img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=75'
            }
        ]
    },
    {
        id: 'rooftop',
        label: 'Rooftop & Sunset',
        emoji: '🌅',
        tagline: 'The city looks better from up here',
        spots: [
            {
                name: 'SKYYE',
                area: 'UB City, 13th Floor',
                vibe: 'Statement evening',
                description: "Glass walls, city panorama, and lighting that actually earns its Instagram reputation. The cocktail menu is expansive and well-made; the mocktail menu is underrated. Arrive at dusk (around 6:30 PM) when the sky shifts from orange to indigo and the city lights begin to come on below you.",
                price: '₹2,500 – 4,000',
                bestTime: 'Dusk, 6:30 – 8 PM',
                mapLink: 'https://maps.google.com/?q=SKYYE+UB+City+Bangalore',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75'
            },
            {
                name: 'Toit Brewpub',
                area: 'Indiranagar, 100 Feet Road',
                vibe: 'Casual rooftop classic',
                description: "One of the original craft beer bars in India and still arguably the best. Reserve the terrace table specifically — the view over the Indiranagar canopy at golden hour is the reason to be there. The Weiss and Witbier on tap are benchmarks. Book ahead on Fridays.",
                price: '₹1,200 – 2,000',
                bestTime: 'Friday evening, 6 – 8 PM',
                mapLink: 'https://maps.google.com/?q=Toit+Brewpub+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=75'
            },
            {
                name: 'Vapour Bar Exchange',
                area: 'Koramangala 5th Block',
                vibe: 'Quirky + views',
                description: "Real-time fluctuating drinks prices on a screen — it's a gimmick that never really wears off, especially with someone new. The view over the Koramangala tree canopy at golden hour is genuinely beautiful. Good for a first date where you need something to talk about.",
                price: '₹1,000 – 2,000',
                bestTime: '7 – 9 PM weekends',
                mapLink: 'https://maps.google.com/?q=Vapour+Bar+Exchange+Koramangala+Bangalore',
                img: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=75'
            },
            {
                name: 'The Leela Sky Bar',
                area: 'Old Airport Road',
                vibe: 'Luxury + polish',
                description: "The most polished rooftop in the city. Hotel-quality cocktails made meticulously, a skyline view over a surprisingly green east Bangalore, and an atmosphere that makes any occasion feel considered. Expensive, but the experience justifies it for a birthday or anniversary.",
                price: '₹3,000 – 5,000',
                bestTime: 'Sunset to 10 PM',
                mapLink: 'https://maps.google.com/?q=The+Leela+Palace+Bangalore',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=75'
            },
            {
                name: 'Arbor Brewing Company',
                area: 'Indiranagar',
                vibe: 'Relaxed terrace',
                description: "Three floors of craft beer culture, rooftop terrace on top. The IPA is brewed on-site and the Thursday evening crowd is the sweet spot — busy enough to have energy, quiet enough to hold a real conversation. No reservations for the terrace, so arrive by 6 PM.",
                price: '₹800 – 1,400',
                bestTime: '6 – 8 PM weekdays',
                mapLink: 'https://maps.google.com/?q=Arbor+Brewing+Company+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=75'
            }
        ]
    },
    {
        id: 'unique',
        label: 'Something Different',
        emoji: '✨',
        tagline: 'Dates worth remembering because they were unlike anything else',
        spots: [
            {
                name: 'Pottery Class at The Pottery House',
                area: 'Indiranagar',
                vibe: 'Hands-on & tactile',
                description: "Two hours at the potter's wheel together. No experience needed — that's actually what makes it interesting. You'll make something, ruin it, remake it, and end up with clay-covered hands and a genuinely shared memory. Classes run on weekends; book at least a week ahead.",
                price: '₹1,500 – 2,000 / person',
                bestTime: 'Weekend afternoon',
                mapLink: 'https://maps.google.com/?q=The+Pottery+House+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=75'
            },
            {
                name: 'Kayaking at Ulsoor Lake',
                area: 'Ulsoor, Central Bangalore',
                vibe: 'Active & surprising',
                description: "Karnataka Windsurfing Association runs kayaking and windsurfing sessions on Ulsoor Lake at very reasonable rates. The view of the city skyline from the water is something you genuinely won't get anywhere else. Book in advance on weekends. Early morning sessions are the best — the lake is still and the city is quiet.",
                price: '₹500 – 800 / person',
                bestTime: 'Early morning, 7 – 9 AM',
                mapLink: 'https://maps.google.com/?q=Karnataka+Windsurfing+Association+Ulsoor+Lake+Bangalore',
                img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=75'
            },
            {
                name: 'Art Jamming at Rang De Neela',
                area: 'Koramangala / Indiranagar',
                vibe: 'Creative & free-form',
                description: 'Open canvas, acrylic paints, no instructions — just create something together. Rang De Neela runs guided art sessions and open studios for first-timers. You leave with a canvas you painted and a conversation that wouldn\'t have happened otherwise. Book the "date night" slot for a slightly more curated experience.',
                price: '₹800 – 1,500 / person',
                bestTime: 'Evening sessions',
                mapLink: 'https://maps.google.com/?q=Rang+De+Neela+Bangalore',
                img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=75'
            },
            {
                name: 'Standup Comedy at Punchline Bangalore',
                area: 'Various venues, Koramangala / Indiranagar',
                vibe: 'Shared laughter',
                description: "Punchline Bangalore runs intimate comedy nights across the city with a rotating roster of local and national acts. 45–60 minutes of comedy in a small room where everyone is close to the stage — genuinely different from a cinema date. Check their Instagram for venue and schedule before booking.",
                price: '₹400 – 700 / person',
                bestTime: 'Friday or Saturday evenings',
                mapLink: 'https://maps.google.com/?q=Punchline+Bangalore+Comedy',
                img: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=75'
            },
            {
                name: 'Escape Room at Clue Hunt',
                area: 'Koramangala & Indiranagar',
                vibe: 'Teamwork & tension',
                description: "60 minutes inside a locked room solving puzzles together. Clue Hunt has been Bangalore's most consistent escape room operator since 2016 — multiple themed rooms, well-maintained, reliably challenging. A two-person team can clear most rooms if you communicate. See who cracks under pressure.",
                price: '₹600 – 900 / person',
                bestTime: 'Weekday evening',
                mapLink: 'https://maps.google.com/?q=Clue+Hunt+Escape+Room+Bangalore',
                img: 'https://images.unsplash.com/photo-1590642916589-592bca10dfaa?w=800&q=75'
            },
            {
                name: 'Natrani Open-Air Theatre',
                area: 'Hebbala / Sadashivanagar',
                vibe: 'Cultural & atmospheric',
                description: "Part of the Ranga Shankara complex, Natrani is an open-air theatre that hosts experimental plays, acoustic concerts, and curated performances under the stars. Tickets are affordable, the atmosphere is unlike any other venue in the city, and the post-show walk through the quiet Hebbala lanes is its own reward.",
                price: '₹200 – 500 / person',
                bestTime: 'Check Ranga Shankara calendar',
                mapLink: 'https://maps.google.com/?q=Natrani+Open+Air+Theatre+Bangalore',
                img: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=75'
            }
        ]
    },
    {
        id: 'cozy',
        label: 'Slow & Cozy',
        emoji: '☕',
        tagline: 'For when the point is the conversation, not the activity',
        spots: [
            {
                name: 'Matteo Coffea',
                area: '100 Feet Road, Indiranagar',
                vibe: 'Third-wave, serious',
                description: "The cafe that started Bangalore's third-wave coffee obsession. Small, no-frills, serious about the beans. Their cold brew sells out by noon on weekends. The lack of ambient music means you'll actually talk. Best on a weekday morning when the space is quiet and the baristas have time.",
                price: '₹400 – 700',
                bestTime: 'Weekday morning, 9 – 11 AM',
                mapLink: 'https://maps.google.com/?q=Matteo+Coffea+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75'
            },
            {
                name: 'Blossom Book House + Koshy\'s',
                area: 'Church Street, Central Bangalore',
                vibe: 'Old Bangalore charm',
                description: "Browse together at Blossom Book House (three floors of second-hand books at throw-away prices), then walk to Koshy's — Bangalore's oldest continuously running restaurant — for a pot of tea and something from the colonial-era menu. This is old Bangalore at its most unhurried.",
                price: '₹300 – 600',
                bestTime: 'Weekend afternoon',
                mapLink: 'https://maps.google.com/?q=Blossom+Book+House+Church+Street+Bangalore',
                img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75'
            },
            {
                name: 'Dialogues Cafe',
                area: '100 Feet Road, Indiranagar',
                vibe: 'Live music evenings',
                description: "More than a cafe — Dialogues hosts live music nights, open mics, and art exhibitions alongside genuinely good food and coffee. Shared tables, no individual screens encouraged, a community board. Come for evenings when you want something that feels like the city, not just a backdrop to scrolling.",
                price: '₹600 – 1,000',
                bestTime: 'Evening, especially Fri–Sat',
                mapLink: 'https://maps.google.com/?q=Dialogues+Cafe+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=75'
            },
            {
                name: 'Corridor Seven Coffee Roasters',
                area: '12th Main, Indiranagar',
                vibe: 'Quiet & focused',
                description: "A serious roastery that is also a great place to spend two hours. Pour-overs take five minutes each — which tells you everything about the approach. Minimal decor, no background music, strong wifi. Order the Ethiopian natural process if it's on the menu. The crowd is designers, founders, and writers.",
                price: '₹500 – 800',
                bestTime: 'Weekday, any time',
                mapLink: 'https://maps.google.com/?q=Corridor+Seven+Coffee+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=75'
            },
            {
                name: 'The Brik Oven',
                area: '80 Feet Road, Indiranagar',
                vibe: 'Bakery & pastries',
                description: "Part bakery, part neighbourhood institution. The croissants are made from scratch each morning and gone by 11 AM. Exposed brick walls, natural light, and a cortado that competes with anyone in the city. Come early, share a pastry, and stay for coffee. The afternoon shift is calmer and the bread selection opens up.",
                price: '₹500 – 900',
                bestTime: 'Weekend morning, before 11 AM',
                mapLink: 'https://maps.google.com/?q=The+Brik+Oven+Indiranagar+Bangalore',
                img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=75'
            },
            {
                name: 'Blue Tokai',
                area: 'Indiranagar / Church Street',
                vibe: 'Specialty & unhurried',
                description: "India's finest specialty coffee roaster with multiple Bangalore cafes, each slightly different. The Church Street outlet has the most character. The Attikan estate pour-over is exceptional. No rush, reliable wifi, and a crowd that respects the quiet. A genuinely good spot for a second date where you actually want to get to know someone.",
                price: '₹400 – 700',
                bestTime: 'Any time',
                mapLink: 'https://maps.google.com/?q=Blue+Tokai+Coffee+Bangalore',
                img: 'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=800&q=75'
            }
        ]
    },
    {
        id: 'outdoors',
        label: 'Outdoors Together',
        emoji: '🌿',
        tagline: 'The best conversations happen while walking somewhere',
        spots: [
            {
                name: 'Cubbon Park Morning + MTR Breakfast',
                area: 'CBD / Lalbagh Road',
                vibe: 'Classic Bangalore morning',
                description: "Start with an early walk through Cubbon Park (before 8 AM on a weekday it's almost meditative — joggers, chess players, rain trees). Then drive to MTR on Lalbagh Road for a proper South Indian breakfast: masala dosa, rava idli, filter coffee. This is Bangalore at its most unguarded.",
                price: 'Under ₹500',
                bestTime: '7 – 10 AM weekday',
                mapLink: 'https://maps.google.com/?q=Cubbon+Park+Bangalore',
                img: 'https://images.unsplash.com/photo-1583912268183-a34d35532de4?w=800&q=75'
            },
            {
                name: 'Nandi Hills Sunrise Drive',
                area: '~60 km north of Bangalore',
                vibe: 'Sunrise above clouds',
                description: "Leave the city by 4:30 AM, arrive before sunrise, and watch the sun come up above a sea of clouds. Nandi Hills sits at 1,478 metres — high enough that on a clear morning you're above the cloud layer looking down on an invisible Bangalore. Bring a flask of coffee and a light fleece.",
                price: 'Under ₹500 (fuel + entry)',
                bestTime: 'Arrive by 6 AM, Oct–Feb',
                mapLink: 'https://maps.google.com/?q=Nandi+Hills+Karnataka',
                img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=75'
            },
            {
                name: 'Lalbagh Botanical Garden',
                area: 'Mavalli, South Bangalore',
                vibe: 'Slow & historic',
                description: "240 years old, over 1,800 plant species, and the famous Crystal Palace–inspired glass house. Lalbagh is Bangalore's finest garden and one of the few places in the city where you can walk for an hour without retracing your steps. The lake section at the back is quieter and more intimate than the main paths.",
                price: '₹20 entry',
                bestTime: 'Morning, 7 – 10 AM',
                mapLink: 'https://maps.google.com/?q=Lalbagh+Botanical+Garden+Bangalore',
                img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=75'
            },
            {
                name: 'Manchanabele Reservoir Picnic',
                area: '~40 km west (near Savandurga)',
                vibe: 'Silence & water',
                description: "Pack food, drive 40 minutes west, and sit by one of the most peaceful stretches of water near the city. Manchanabele reservoir sits below the Savandurga granite hill — glinting blue-green in winter morning light, almost deserted on weekdays. Bring a mat, your playlist, and nothing urgent.",
                price: 'Nearly free',
                bestTime: 'Weekday morning',
                mapLink: 'https://maps.google.com/?q=Manchanabele+Reservoir+Bangalore',
                img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=75'
            },
            {
                name: 'Turahalli Forest Trail',
                area: 'Kanakapura Road, South Bangalore',
                vibe: 'Urban forest, rare',
                description: "The last surviving dry forest inside Bangalore city limits. A 2 km loop trail through scrub forest with occasional spotted deer sightings. Almost no one goes there on weekdays. The entry point is about 20 km from Jayanagar — close enough for a 7 AM outing before the city heats up.",
                price: 'Free',
                bestTime: 'Early morning, 6:30 – 9 AM',
                mapLink: 'https://maps.google.com/?q=Turahalli+Forest+Bangalore',
                img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=75'
            },
            {
                name: 'Hesaraghatta Grasslands & Lake',
                area: '~40 km northwest of Bangalore',
                vibe: 'Birding + open sky',
                description: "The Hesaraghatta grasslands are a migratory bird magnet in winter — flamingos, harriers, cranes — spread across open terrain that feels nothing like the city 40 minutes away. The lake at the edge catches the morning light dramatically. Virtually no infrastructure, virtually no other visitors on weekdays.",
                price: 'Under ₹200',
                bestTime: 'Oct – Feb, 6:30 – 9 AM',
                mapLink: 'https://maps.google.com/?q=Hesaraghatta+Lake+Bangalore',
                img: 'https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?w=800&q=75'
            }
        ]
    }
];
// ─── Sub-components ───────────────────────────────────────────────────────────
const SpotCard = (param)=>{
    let { spot } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-white/[0.05]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: spot.img,
                    alt: spot.name,
                    className: "w-full h-full object-cover",
                    loading: "lazy"
                }, void 0, false, {
                    fileName: "[project]/src/views/DateIdeas.tsx",
                    lineNumber: 398,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 397,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-2 mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-bold text-gray-900 dark:text-white leading-snug",
                                children: spot.name
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 409,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-0.5 rounded-full shrink-0 mt-0.5 whitespace-nowrap",
                                children: spot.vibe
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 410,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 408,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-3 w-3 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 416,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            spot.area
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 415,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3",
                        children: spot.description
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 420,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1.5 mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] px-2 py-0.5 rounded-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__["IndianRupee"], {
                                        className: "h-2.5 w-2.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/DateIdeas.tsx",
                                        lineNumber: 427,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    spot.price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 426,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] px-2 py-0.5 rounded-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "h-2.5 w-2.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/DateIdeas.tsx",
                                        lineNumber: 431,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    spot.bestTime
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 430,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 425,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: spot.mapLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center gap-1 text-[10px] font-semibold text-[#FFD60A] hover:underline",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 442,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Open in Maps"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 436,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 407,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/DateIdeas.tsx",
        lineNumber: 395,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SpotCard;
// ─── Main View ────────────────────────────────────────────────────────────────
const DateIdeas = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(sections[0].id);
    const sectionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const scrollToSection = (id)=>{
        setActiveSection(id);
        const el = sectionRefs.current[id];
        if (el) {
            const offset = 120 // header + nav height
            ;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-[#0D0D0F] pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-40 bg-white dark:bg-[#0D0D0F] border-b border-gray-100 dark:border-white/[0.06] [transform:translateZ(0)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD60A]/40 to-transparent pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-4 py-3 max-w-2xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/'),
                                className: "p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "h-5 w-5 text-gray-700 dark:text-gray-300"
                                }, void 0, false, {
                                    fileName: "[project]/src/views/DateIdeas.tsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 472,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-semibold text-gray-900 dark:text-white",
                                children: "Date Ideas"
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9"
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 479,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 471,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 px-4 pb-2.5 overflow-x-auto max-w-2xl mx-auto",
                        style: {
                            scrollbarWidth: 'none'
                        },
                        children: sections.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>scrollToSection(s.id),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all', activeSection === s.id ? 'bg-[#FFD60A] text-black border-[#FFD60A]' : 'bg-white dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/[0.08] hover:border-[#FFD60A]/40'),
                                children: [
                                    s.emoji,
                                    " ",
                                    s.label
                                ]
                            }, s.id, true, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 485,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 483,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 469,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto px-4 pt-5 pb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500 dark:text-gray-400",
                    children: "Curated spots & experiences for dates in Bangalore — researched, not guessed."
                }, void 0, false, {
                    fileName: "[project]/src/views/DateIdeas.tsx",
                    lineNumber: 503,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 502,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-2xl mx-auto px-4 pb-8 space-y-10 pt-4",
                children: sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        ref: (el)=>{
                            sectionRefs.current[section.id] = el;
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl",
                                                children: section.emoji
                                            }, void 0, false, {
                                                fileName: "[project]/src/views/DateIdeas.tsx",
                                                lineNumber: 518,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-base font-bold text-gray-900 dark:text-white",
                                                children: section.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/views/DateIdeas.tsx",
                                                lineNumber: 519,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/views/DateIdeas.tsx",
                                        lineNumber: 517,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400 dark:text-gray-500 pl-8",
                                        children: section.tagline
                                    }, void 0, false, {
                                        fileName: "[project]/src/views/DateIdeas.tsx",
                                        lineNumber: 521,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: section.spots.map((spot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpotCard, {
                                        spot: spot
                                    }, spot.name, false, {
                                        fileName: "[project]/src/views/DateIdeas.tsx",
                                        lineNumber: 527,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/views/DateIdeas.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, section.id, true, {
                        fileName: "[project]/src/views/DateIdeas.tsx",
                        lineNumber: 511,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 509,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/views/DateIdeas.tsx",
                lineNumber: 534,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/views/DateIdeas.tsx",
        lineNumber: 467,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DateIdeas, "E3siXCHBWzPsXeVvDloQurC+8xE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = DateIdeas;
const __TURBOPACK__default__export__ = DateIdeas;
var _c, _c1;
__turbopack_context__.k.register(_c, "SpotCard");
__turbopack_context__.k.register(_c1, "DateIdeas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>ArrowLeft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ArrowLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ArrowLeft", [
    [
        "path",
        {
            d: "m12 19-7-7 7-7",
            key: "1l729n"
        }
    ],
    [
        "path",
        {
            d: "M19 12H5",
            key: "x3x0zl"
        }
    ]
]);
;
 //# sourceMappingURL=arrow-left.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>MapPin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const MapPin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("MapPin", [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
            key: "1r0f0z"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "10",
            r: "3",
            key: "ilqhr7"
        }
    ]
]);
;
 //# sourceMappingURL=map-pin.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapPin",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Clock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Clock", [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "polyline",
        {
            points: "12 6 12 12 16 14",
            key: "68esgv"
        }
    ]
]);
;
 //# sourceMappingURL=clock.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Clock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>IndianRupee
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const IndianRupee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("IndianRupee", [
    [
        "path",
        {
            d: "M6 3h12",
            key: "ggurg9"
        }
    ],
    [
        "path",
        {
            d: "M6 8h12",
            key: "6g4wlu"
        }
    ],
    [
        "path",
        {
            d: "m6 13 8.5 8",
            key: "u1kupk"
        }
    ],
    [
        "path",
        {
            d: "M6 13h3",
            key: "wdp6ag"
        }
    ],
    [
        "path",
        {
            d: "M9 13c6.667 0 6.667-10 0-10",
            key: "1nkvk2"
        }
    ]
]);
;
 //# sourceMappingURL=indian-rupee.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-client] (ecmascript) <export default as IndianRupee>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndianRupee",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>ExternalLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ExternalLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ExternalLink", [
    [
        "path",
        {
            d: "M15 3h6v6",
            key: "1q9fwt"
        }
    ],
    [
        "path",
        {
            d: "M10 14 21 3",
            key: "gplh6r"
        }
    ],
    [
        "path",
        {
            d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
            key: "a6xqqp"
        }
    ]
]);
;
 //# sourceMappingURL=external-link.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExternalLink",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Compass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Compass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Compass", [
    [
        "path",
        {
            d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
            key: "9ktpf1"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ]
]);
;
 //# sourceMappingURL=compass.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Compass",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Users
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Users", [
    [
        "path",
        {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }
    ],
    [
        "path",
        {
            d: "M22 21v-2a4 4 0 0 0-3-3.87",
            key: "kshegd"
        }
    ],
    [
        "path",
        {
            d: "M16 3.13a4 4 0 0 1 0 7.75",
            key: "1da9ce"
        }
    ]
]);
;
 //# sourceMappingURL=users.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Users",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Utensils
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Utensils = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Utensils", [
    [
        "path",
        {
            d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
            key: "cjf0a3"
        }
    ],
    [
        "path",
        {
            d: "M7 2v20",
            key: "1473qp"
        }
    ],
    [
        "path",
        {
            d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",
            key: "j28e5"
        }
    ]
]);
;
 //# sourceMappingURL=utensils.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript) <export default as Utensils>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Utensils",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>BookOpen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const BookOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("BookOpen", [
    [
        "path",
        {
            d: "M12 7v14",
            key: "1akyts"
        }
    ],
    [
        "path",
        {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
        }
    ]
]);
;
 //# sourceMappingURL=book-open.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Heart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Heart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Heart", [
    [
        "path",
        {
            d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
            key: "c3ymky"
        }
    ]
]);
;
 //# sourceMappingURL=heart.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Heart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_65294d55._.js.map