(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ActivityMapView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// User location marker — blue pulsing dot + "You are here" label
const userIcon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
    className: '',
    iconAnchor: [
        12,
        12
    ],
    popupAnchor: [
        0,
        -16
    ],
    html: '\n    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">\n      <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center">\n        <div style="\n          position:absolute;width:24px;height:24px;border-radius:50%;\n          background:rgba(59,130,246,0.25);\n          animation:pulse-ring 1.8s ease-out infinite;\n        "></div>\n        <div style="\n          width:14px;height:14px;border-radius:50%;\n          background:#3b82f6;border:2.5px solid #fff;\n          box-shadow:0 2px 6px rgba(59,130,246,0.55);\n          position:relative;z-index:1;\n        "></div>\n      </div>\n      <div style="\n        background:#3b82f6;color:#fff;\n        font-size:10px;font-weight:700;\n        padding:2px 6px;border-radius:4px;\n        box-shadow:0 1px 4px rgba(0,0,0,0.18);\n        white-space:nowrap;line-height:1.3;\n      ">You are here</div>\n    </div>\n    <style>\n      @keyframes pulse-ring {\n        0%   { transform:scale(0.8); opacity:0.8; }\n        100% { transform:scale(2.2); opacity:0; }\n      }\n    </style>'
});
// Build a custom DivIcon that shows a pin dot + activity name label beneath it
function makeActivityIcon(title) {
    const short = title.length > 22 ? title.slice(0, 20) + '…' : title;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
        className: '',
        iconAnchor: [
            10,
            10
        ],
        popupAnchor: [
            0,
            -14
        ],
        html: '\n      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">\n        <div style="\n          width:20px;height:20px;border-radius:50%;\n          background:#f97316;border:2.5px solid #fff;\n          box-shadow:0 2px 6px rgba(0,0,0,0.30);\n        "></div>\n        <div style="\n          background:rgba(255,255,255,0.95);\n          color:#111;font-size:10px;font-weight:600;\n          padding:2px 5px;border-radius:4px;\n          box-shadow:0 1px 4px rgba(0,0,0,0.18);\n          white-space:nowrap;max-width:130px;\n          overflow:hidden;text-overflow:ellipsis;\n          line-height:1.3;\n        ">'.concat(short, "</div>\n      </div>")
    });
}
// Approximate coordinates for Bangalore areas
const AREA_COORDS = {
    indiranagar: [
        12.9784,
        77.6408
    ],
    koramangala: [
        12.9352,
        77.6245
    ],
    hsr: [
        12.9116,
        77.6389
    ],
    'hsr layout': [
        12.9116,
        77.6389
    ],
    whitefield: [
        12.9698,
        77.7499
    ],
    jayanagar: [
        12.9299,
        77.5826
    ],
    'jaya nagar': [
        12.9299,
        77.5826
    ],
    malleshwaram: [
        13.004,
        77.57
    ],
    'mg road': [
        12.9757,
        77.6097
    ],
    'brigade road': [
        12.9719,
        77.6074
    ],
    'church street': [
        12.9736,
        77.6087
    ],
    'ulsoor': [
        12.9825,
        77.6199
    ],
    'richmond': [
        12.9632,
        77.6050
    ],
    'lavelle': [
        12.9680,
        77.5982
    ],
    'cunningham': [
        12.9916,
        77.5870
    ],
    'hebbal': [
        13.0358,
        77.5970
    ],
    'electronic city': [
        12.8458,
        77.6603
    ],
    'marathahalli': [
        12.9591,
        77.6983
    ],
    'bellandur': [
        12.9262,
        77.6780
    ],
    'sarjapur': [
        12.8669,
        77.7064
    ],
    'jp nagar': [
        12.9087,
        77.5804
    ],
    'bannerghatta': [
        12.8984,
        77.5755
    ],
    'rajajinagar': [
        12.9904,
        77.5530
    ],
    'yeshwanthpur': [
        13.0284,
        77.5375
    ],
    'basavanagudi': [
        12.9413,
        77.5754
    ],
    'banashankari': [
        12.9245,
        77.5548
    ],
    'btm': [
        12.9166,
        77.6101
    ],
    'btm layout': [
        12.9166,
        77.6101
    ],
    'richmond town': [
        12.9632,
        77.6050
    ],
    'shivajinagar': [
        12.9870,
        77.6009
    ],
    'yelahanka': [
        13.1003,
        77.5963
    ],
    'bagalur': [
        13.0971,
        77.6596
    ],
    'domlur': [
        12.9607,
        77.6408
    ],
    'ejipura': [
        12.9407,
        77.6270
    ],
    'cambridge': [
        12.9858,
        77.6212
    ]
};
const BANGALORE_CENTER = [
    12.9716,
    77.5946
];
function getActivityCoords(activity) {
    // Use real coordinates from DB first (extracted from map link)
    if (activity.latitude != null && activity.longitude != null) {
        return [
            activity.latitude,
            activity.longitude
        ];
    }
    // Fall back to area-name lookup for older activities without stored coords
    if (!activity.location) return null;
    const loc = activity.location.toLowerCase();
    for (const [key, coords] of Object.entries(AREA_COORDS)){
        if (loc.includes(key)) return coords;
    }
    return null;
}
// Component to recenter map when user location changes
function MapCenterUpdater(param) {
    let { center } = param;
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapCenterUpdater.useEffect": ()=>{
            map.setView(center, 13, {
                animate: true
            });
        }
    }["MapCenterUpdater.useEffect"], [
        center,
        map
    ]);
    return null;
}
_s(MapCenterUpdater, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c = MapCenterUpdater;
const ActivityMapView = (param)=>{
    let { activities, userLocation } = param;
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const center = userLocation ? [
        userLocation.lat,
        userLocation.lng
    ] : BANGALORE_CENTER;
    // Only include activities that have mappable locations
    const mappableActivities = activities.filter((a)=>getActivityCoords(a) !== null);
    const unmappableCount = activities.length - mappableActivities.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: center,
                zoom: 12,
                style: {
                    height: '60vh',
                    width: '100%'
                },
                scrollWheelZoom: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ActivityMapView.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    userLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapCenterUpdater, {
                                center: [
                                    userLocation.lat,
                                    userLocation.lng
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/ActivityMapView.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                                position: [
                                    userLocation.lat,
                                    userLocation.lng
                                ],
                                icon: userIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm font-medium text-blue-600",
                                        children: "You are here"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ActivityMapView.tsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ActivityMapView.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ActivityMapView.tsx",
                                lineNumber: 169,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true),
                    mappableActivities.map((activity)=>{
                        const coords = getActivityCoords(activity);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                            position: coords,
                            icon: makeActivityIcon(activity.title),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                maxWidth: 240,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        activity.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: activity.image,
                                            alt: activity.title,
                                            className: "w-full h-24 object-cover rounded",
                                            onError: (e)=>{
                                                e.currentTarget.style.display = 'none';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ActivityMapView.tsx",
                                            lineNumber: 184,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-bold text-gray-900 text-sm leading-tight",
                                            children: activity.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ActivityMapView.tsx",
                                            lineNumber: 191,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-gray-500",
                                            children: activity.location
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ActivityMapView.tsx",
                                            lineNumber: 192,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        activity.priceRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs font-semibold text-gray-800",
                                            children: activity.priceRange
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ActivityMapView.tsx",
                                            lineNumber: 194,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>router.push("/activity/".concat(activity.slug)),
                                            className: "mt-1 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors",
                                            children: "View Details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ActivityMapView.tsx",
                                            lineNumber: 196,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ActivityMapView.tsx",
                                    lineNumber: 182,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ActivityMapView.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, activity.id, false, {
                            fileName: "[project]/src/components/ActivityMapView.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ActivityMapView.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-gray-600 shadow-md border border-gray-100 pointer-events-none",
                children: [
                    mappableActivities.length,
                    " activities on map",
                    unmappableCount > 0 && " · ".concat(unmappableCount, " without exact location")
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ActivityMapView.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ActivityMapView.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ActivityMapView, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = ActivityMapView;
const __TURBOPACK__default__export__ = ActivityMapView;
var _c, _c1;
__turbopack_context__.k.register(_c, "MapCenterUpdater");
__turbopack_context__.k.register(_c1, "ActivityMapView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ActivityMapView.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/ActivityMapView.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_ActivityMapView_tsx_06730b5e._.js.map