'use client'

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Palette,
  Wand2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Copy,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Format = "portrait" | "square";
type Variant = "content" | "cover" | "end";

interface Chip {
  label: string;
  bg: string;
  fg: string;
}

interface Slide {
  id: string;
  variant: Variant;
  image: string | null;
  headline: string;    // use **word** to mark accent words
  subheadline: string;
  badge: string;
  footer: string;      // e.g. "@happeninbangalore"
  cta: string;         // e.g. "swipe →"
  // Cover-only
  topBadge?: string;        // e.g. "THIS WEEK'S"
  dateLine?: string;        // e.g. "11 – 13 April, 2026"
  chips?: Chip[];           // category pills
  curatedBy?: string;       // e.g. "Happenin Bangalore"
  // End-only
  handle?: string;          // e.g. "@happeningsbangalore"
  website?: string;         // e.g. "happeningsbangalore.com"
  endTitle?: string;        // e.g. "Save this for later"
}

type HeadlineStyle = "normal" | "bold" | "italic" | "bold-italic";

interface Theme {
  bgColor: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
  badgeFg: string;
  font: string;
  headlineStyle: HeadlineStyle;
  format: Format;
}

const FONT_OPTIONS = [
  { label: "Baloo 2 (Default)", value: "Baloo 2", url: "Baloo+2:wght@400;500;600;700;800" },
  { label: "Nunito", value: "Nunito", url: "Nunito:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900" },
  { label: "Fredoka", value: "Fredoka", url: "Fredoka:wght@400;500;600;700" },
  { label: "Archivo Black (Bold display)", value: "Archivo Black", url: "Archivo+Black" },
  { label: "Poppins", value: "Poppins", url: "Poppins:ital,wght@0,400;0,600;0,800;0,900;1,400;1,600;1,800;1,900" },
  { label: "Inter", value: "Inter", url: "Inter:ital,wght@0,400;0,600;0,800;0,900;1,400;1,600;1,800;1,900" },
  { label: "Montserrat", value: "Montserrat", url: "Montserrat:ital,wght@0,400;0,600;0,800;0,900;1,400;1,600;1,800;1,900" },
  { label: "Bebas Neue", value: "Bebas Neue", url: "Bebas+Neue" },
  { label: "Space Grotesk", value: "Space Grotesk", url: "Space+Grotesk:wght@400;600;700" },
  { label: "Work Sans", value: "Work Sans", url: "Work+Sans:ital,wght@0,400;0,600;0,800;0,900;1,400;1,600;1,800;1,900" },
];

const PRESET_THEMES: { name: string; theme: Partial<Theme> }[] = [
  { name: "Bangalore Yellow", theme: { bgColor: "#FFD60A", accentColor: "#6D5DFF", textColor: "#0a0a0a", badgeBg: "#0a0a0a", badgeFg: "#FFD60A" } },
  { name: "Mint & Coral",     theme: { bgColor: "#C7F0D8", accentColor: "#FF6B6B", textColor: "#0f172a", badgeBg: "#0f172a", badgeFg: "#C7F0D8" } },
  { name: "Sunset Peach",     theme: { bgColor: "#FFB78B", accentColor: "#6B2BFF", textColor: "#2b1055", badgeBg: "#2b1055", badgeFg: "#FFB78B" } },
  { name: "Night Neon",       theme: { bgColor: "#0a0a0a", accentColor: "#00E5A0", textColor: "#ffffff", badgeBg: "#00E5A0", badgeFg: "#0a0a0a" } },
  { name: "Paper Cream",      theme: { bgColor: "#FAF3E0", accentColor: "#E85A4F", textColor: "#1f2937", badgeBg: "#1f2937", badgeFg: "#FAF3E0" } },
];

const DEFAULT_THEME: Theme = {
  bgColor: "#FFD60A",
  accentColor: "#6D5DFF",
  textColor: "#0a0a0a",
  badgeBg: "#0a0a0a",
  badgeFg: "#FFD60A",
  font: "Baloo 2",
  headlineStyle: "bold",
  format: "portrait",
};

function styleToCss(s: HeadlineStyle): { fontWeight: number; fontStyle: "normal" | "italic" } {
  switch (s) {
    case "normal":      return { fontWeight: 500, fontStyle: "normal" };
    case "bold":        return { fontWeight: 900, fontStyle: "normal" };
    case "italic":      return { fontWeight: 500, fontStyle: "italic" };
    case "bold-italic": return { fontWeight: 900, fontStyle: "italic" };
  }
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const newContentSlide = (): Slide => ({
  id: uid(),
  variant: "content",
  image: null,
  headline: "From a private garden\nto **Bengaluru's green heart.**",
  subheadline: "155 years later, it's still the reason we're called the",
  badge: "Garden City",
  footer: "@happeningsbangalore",
  cta: "swipe →",
});

const newCoverSlide = (): Slide => ({
  id: uid(),
  variant: "cover",
  image: null,
  topBadge: "THIS WEEK'S",
  dateLine: "11 – 13 April, 2026",
  headline: "Top Picks\nAround **Bengaluru**",
  subheadline: "Things you can't miss this week",
  chips: [
    { label: "EVENTS",     bg: "#E63946", fg: "#ffffff" },
    { label: "ACTIVITIES", bg: "#1D6FE0", fg: "#ffffff" },
    { label: "FOOD",       bg: "#0a0a0a", fg: "#FFD60A" },
  ],
  curatedBy: "Happenin Bangalore",
  badge: "",
  footer: "#happeningsbangalore",
  cta: "swipe →",
});

const newEndSlide = (): Slide => ({
  id: uid(),
  variant: "end",
  image: null,
  headline: "Thanks for **swiping!**",
  subheadline: "Save, share and tag a friend who'd love this.",
  endTitle: "Follow for more",
  handle: "@happeningsbangalore",
  website: "happeningsbangalore.com",
  badge: "",
  footer: "",
  cta: "",
});

const newSlide = newContentSlide;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Parse headline: text with **accent** markers → array of {text, accent}
function parseAccent(text: string): { text: string; accent: boolean }[] {
  const parts: { text: string; accent: boolean }[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), accent: false });
    parts.push({ text: m[1], accent: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), accent: false });
  return parts;
}

function loadGoogleFont(font: string): Promise<void> {
  const opt = FONT_OPTIONS.find((f) => f.value === font);
  if (!opt) return Promise.resolve();
  const id = `gfont-${opt.value.replace(/\s+/g, "-")}`;
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${opt.url}&display=swap`;
    document.head.appendChild(link);
  }
  // Explicitly request each weight + italic variant we use so the browser fetches them.
  const weights = ["400", "500", "600", "700", "800", "900"];
  const styles = ["normal", "italic"] as const;
  if (!("fonts" in document)) return Promise.resolve();
  const requests: Promise<unknown>[] = [];
  for (const w of weights) {
    for (const s of styles) {
      requests.push(
        document.fonts.load(`${s} ${w} 48px "${opt.value}"`).catch(() => undefined)
      );
    }
  }
  return Promise.all(requests).then(() => undefined);
}

// ─── Slide canvas (the actual rendered slide) ────────────────────────────────

const SlideCanvas = React.forwardRef<
  HTMLDivElement,
  { slide: Slide; theme: Theme; width: number; height: number; scale: number }
>(({ slide, theme, width, height, scale }, ref) => {
  const padding = Math.round(width * 0.06);
  const innerRadius = Math.round(width * 0.06);
  const fontStack = `"${theme.font}", sans-serif`;

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        fontFamily: fontStack,
        background: "#000",
        padding,
        boxSizing: "border-box",
        position: "relative",
        color: theme.textColor,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: innerRadius,
          background: theme.bgColor,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {slide.variant === "cover"
          ? <CoverBody slide={slide} theme={theme} width={width} />
          : slide.variant === "end"
          ? <EndBody slide={slide} theme={theme} width={width} />
          : <ContentBody slide={slide} theme={theme} width={width} />}

        {/* Bottom utility row */}
        {(slide.footer || slide.cta) && (
          <div
            style={{
              fontFamily: fontStack,
              position: "absolute",
              bottom: Math.round(width * 0.03),
              left: Math.round(width * 0.06),
              right: Math.round(width * 0.06),
              display: "flex",
              justifyContent: "space-between",
              fontSize: Math.round(width * 0.028),
              color: theme.textColor,
              opacity: 0.55,
              fontWeight: 600,
            }}
          >
            <span>{slide.footer}</span>
            <span>{slide.cta}</span>
          </div>
        )}
      </div>
    </div>
  );
});
SlideCanvas.displayName = "SlideCanvas";

// ─── Body variants ───────────────────────────────────────────────────────────

function ContentBody({ slide, theme, width }: { slide: Slide; theme: Theme; width: number }) {
  const headlineParts = parseAccent(slide.headline);
  const fontStack = `"${theme.font}", sans-serif`;
  return (
    <>
      {/* Image region (top ~50%) */}
      <div style={{ width: "100%", height: "50%", position: "relative", background: slide.image ? "transparent" : "#222" }}>
        {slide.image && (
          <img src={slide.image} alt="" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "55%", background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${theme.bgColor} 100%)` }} />
      </div>
      {/* Text region */}
      <div style={{ flex: 1, padding: `${Math.round(width * 0.03)}px ${Math.round(width * 0.06)}px ${Math.round(width * 0.08)}px`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: Math.round(width * 0.03) }}>
        <h1 style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.075), lineHeight: 1.1, ...styleToCss(theme.headlineStyle), margin: 0, color: theme.textColor, whiteSpace: "pre-wrap", letterSpacing: "-0.02em" }}>
          {headlineParts.map((p, i) => (
            <span key={i} style={{ color: p.accent ? theme.accentColor : theme.textColor }}>{p.text}</span>
          ))}
        </h1>
        {(slide.subheadline || slide.badge) && (
          <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.034), fontWeight: 600, color: theme.accentColor, lineHeight: 1.4, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: Math.round(width * 0.015) }}>
            <span>{slide.subheadline}</span>
            {slide.badge && (
              <span style={{ fontFamily: fontStack, background: theme.badgeBg, color: theme.badgeFg, padding: `${Math.round(width * 0.012)}px ${Math.round(width * 0.028)}px`, borderRadius: 9999, fontWeight: 800, whiteSpace: "nowrap" }}>
                {slide.badge}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function CoverBody({ slide, theme, width }: { slide: Slide; theme: Theme; width: number }) {
  const headlineParts = parseAccent(slide.headline);
  const fontStack = `"${theme.font}", sans-serif`;
  return (
    <div style={{ flex: 1, padding: `${Math.round(width * 0.14)}px ${Math.round(width * 0.06)}px ${Math.round(width * 0.14)}px`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: Math.round(width * 0.035) }}>
      {/* Top pill badge */}
      {slide.topBadge && (
        <span style={{ fontFamily: fontStack, background: theme.badgeBg, color: theme.badgeFg, padding: `${Math.round(width * 0.02)}px ${Math.round(width * 0.05)}px`, borderRadius: 9999, fontWeight: 800, letterSpacing: "0.15em", fontSize: Math.round(width * 0.032), whiteSpace: "nowrap" }}>
          {slide.topBadge}
        </span>
      )}
      {slide.dateLine && (
        <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.036), fontWeight: 600, color: theme.textColor, opacity: 0.55 }}>
          {slide.dateLine}
        </div>
      )}

      <h1 style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.1), lineHeight: 1.05, ...styleToCss(theme.headlineStyle), margin: `${Math.round(width * 0.015)}px 0`, color: theme.textColor, whiteSpace: "pre-wrap", letterSpacing: "-0.02em" }}>
        {headlineParts.map((p, i) => (
          <span key={i} style={{ color: p.accent ? theme.accentColor : theme.textColor }}>{p.text}</span>
        ))}
      </h1>

      {slide.subheadline && (
        <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.036), fontWeight: 600, color: theme.textColor, opacity: 0.6, maxWidth: "85%" }}>
          {slide.subheadline}
        </div>
      )}

      {/* Chip row */}
      {slide.chips && slide.chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: Math.round(width * 0.02), marginTop: Math.round(width * 0.02) }}>
          {slide.chips.map((c, i) => (
            <span key={i} style={{ fontFamily: fontStack, background: c.bg, color: c.fg, padding: `${Math.round(width * 0.016)}px ${Math.round(width * 0.038)}px`, borderRadius: 9999, fontWeight: 800, letterSpacing: "0.08em", fontSize: Math.round(width * 0.032), whiteSpace: "nowrap" }}>
              {c.label}
            </span>
          ))}
        </div>
      )}

      {slide.curatedBy && (
        <div style={{ marginTop: Math.round(width * 0.04), textAlign: "center" }}>
          <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.03), fontWeight: 500, color: theme.textColor, opacity: 0.55 }}>Curated by</div>
          <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.042), fontWeight: 800, color: theme.textColor }}>{slide.curatedBy}</div>
        </div>
      )}
    </div>
  );
}

function EndBody({ slide, theme, width }: { slide: Slide; theme: Theme; width: number }) {
  const headlineParts = parseAccent(slide.headline);
  const fontStack = `"${theme.font}", sans-serif`;
  return (
    <div style={{ flex: 1, padding: `${Math.round(width * 0.14)}px ${Math.round(width * 0.08)}px`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: Math.round(width * 0.035) }}>
      <h1 style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.09), lineHeight: 1.1, ...styleToCss(theme.headlineStyle), margin: 0, color: theme.textColor, whiteSpace: "pre-wrap", letterSpacing: "-0.02em" }}>
        {headlineParts.map((p, i) => (
          <span key={i} style={{ color: p.accent ? theme.accentColor : theme.textColor }}>{p.text}</span>
        ))}
      </h1>

      {slide.subheadline && (
        <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.036), fontWeight: 600, color: theme.textColor, opacity: 0.6, maxWidth: "90%" }}>
          {slide.subheadline}
        </div>
      )}

      <div style={{ marginTop: Math.round(width * 0.06), display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(width * 0.025) }}>
        {slide.endTitle && (
          <div style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.034), fontWeight: 600, color: theme.textColor, opacity: 0.6, letterSpacing: "0.05em" }}>
            {slide.endTitle}
          </div>
        )}
        {/* Instagram row */}
        {slide.handle && (
          <div style={{ display: "flex", alignItems: "center", gap: Math.round(width * 0.022), background: theme.badgeBg, color: theme.badgeFg, padding: `${Math.round(width * 0.022)}px ${Math.round(width * 0.05)}px`, borderRadius: 9999, fontWeight: 800 }}>
            <InstagramGlyph size={Math.round(width * 0.05)} color={theme.badgeFg} />
            <span style={{ fontFamily: fontStack, fontSize: Math.round(width * 0.04) }}>{slide.handle}</span>
          </div>
        )}
        {slide.website && (
          <div style={{ display: "flex", alignItems: "center", gap: Math.round(width * 0.018), fontFamily: fontStack, fontSize: Math.round(width * 0.038), fontWeight: 700, color: theme.accentColor }}>
            <GlobeGlyph size={Math.round(width * 0.042)} color={theme.accentColor} />
            <span>{slide.website}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function InstagramGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill={color} />
    </svg>
  );
}

function GlobeGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ─── Main view ───────────────────────────────────────────────────────────────

export default function ContentHub() {
  const router = useRouter();
  const { toast } = useToast();

  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [slides, setSlides] = useState<Slide[]>([newSlide()]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const renderRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const dims = theme.format === "portrait" ? { w: 1080, h: 1920 } : { w: 1080, h: 1080 };

  const [fontTick, setFontTick] = useState(0); // force preview re-render after font loads
  useEffect(() => {
    loadGoogleFont(theme.font).then(() => setFontTick((t) => t + 1));
  }, [theme.font]);

  const active = slides[activeIdx];

  const updateActive = (patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s, i) => (i === activeIdx ? { ...s, ...patch } : s)));
  };

  const addSlide = () => {
    const s = newSlide();
    setSlides((prev) => [...prev, s]);
    setActiveIdx(slides.length);
  };

  const duplicateSlide = () => {
    const copy: Slide = { ...active, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
    const next = [...slides];
    next.splice(activeIdx + 1, 0, copy);
    setSlides(next);
    setActiveIdx(activeIdx + 1);
  };

  const removeSlide = (idx: number) => {
    if (slides.length === 1) return;
    const next = slides.filter((_, i) => i !== idx);
    setSlides(next);
    setActiveIdx(Math.max(0, Math.min(activeIdx, next.length - 1)));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      updateActive({ image: dataUrl });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

  const renderSlideToCanvas = async (slide: Slide): Promise<HTMLCanvasElement> => {
    // Ensure font is fully loaded before render
    await loadGoogleFont(theme.font);
    // Build an off-screen wrapper at full resolution
    const holder = document.createElement("div");
    holder.style.position = "fixed";
    holder.style.left = "-99999px";
    holder.style.top = "0";
    holder.style.width = `${dims.w}px`;
    holder.style.height = `${dims.h}px`;
    document.body.appendChild(holder);

    // Use React 18 createRoot for off-screen render
    const ReactDOM = await import("react-dom/client");
    const root = ReactDOM.createRoot(holder);
    await new Promise<void>((resolve) => {
      root.render(
        <SlideCanvas slide={slide} theme={theme} width={dims.w} height={dims.h} scale={1} />
      );
      setTimeout(resolve, 80);
    });

    // Wait for fonts + images
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const imgs = Array.from(holder.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.onload = () => res();
              img.onerror = () => res();
            })
      )
    );

    const canvas = await html2canvas(holder.firstElementChild as HTMLElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 1,
      width: dims.w,
      height: dims.h,
    });

    root.unmount();
    document.body.removeChild(holder);
    return canvas;
  };

  const downloadSlide = async (slide: Slide, idx: number) => {
    setIsDownloading(true);
    try {
      const canvas = await renderSlideToCanvas(slide);
      const a = document.createElement("a");
      a.download = `happenin-slide-${idx + 1}-${theme.format}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (err) {
      toast({ title: "Download failed", description: String(err), variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const canvas = await renderSlideToCanvas(slides[i]);
        const a = document.createElement("a");
        a.download = `happenin-slide-${i + 1}-${theme.format}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
        await new Promise((r) => setTimeout(r, 250));
      }
      toast({ title: `Downloaded ${slides.length} slide(s)` });
    } catch (err) {
      toast({ title: "Download failed", description: String(err), variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Describe what you want", description: "Tell AI the topic for the carousel." });
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-carousel-content", {
        body: { prompt: aiPrompt, slideCount: Math.max(1, slides.length) },
      });
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error ?? "AI generation failed");

      const generated: Array<{ headline: string; subheadline: string; badge: string }> = data.slides;
      if (!Array.isArray(generated) || generated.length === 0) throw new Error("No slides returned");

      setSlides((prev) =>
        generated.map((g, i) => {
          const base = prev[i] ?? newSlide();
          return {
            ...base,
            id: base.id ?? `${Date.now()}-${i}`,
            headline: g.headline || base.headline,
            subheadline: g.subheadline || base.subheadline,
            badge: g.badge || base.badge,
          };
        })
      );
      setActiveIdx(0);
      toast({ title: "AI filled your slides", description: `${generated.length} slide(s) updated.` });
    } catch (err) {
      toast({
        title: "AI generation failed",
        description: err instanceof Error ? err.message : "Check that OPENAI_API_KEY is set on the edge function.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Preview scale — fit in right pane
  const previewMaxH = 640;
  const previewScale = previewMaxH / dims.h;
  const previewW = dims.w * previewScale;
  const previewH = dims.h * previewScale;

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-900"
      style={{
        // Force light-theme shadcn CSS vars within this page
        ["--background" as string]: "0 0% 100%",
        ["--foreground" as string]: "222.2 84% 4.9%",
        ["--muted" as string]: "210 40% 96.1%",
        ["--muted-foreground" as string]: "215.4 16.3% 46.9%",
        ["--border" as string]: "214.3 31.8% 91.4%",
        ["--input" as string]: "214.3 31.8% 91.4%",
        ["--ring" as string]: "222.2 84% 4.9%",
        ["--popover" as string]: "0 0% 100%",
        ["--popover-foreground" as string]: "222.2 84% 4.9%",
        ["--accent" as string]: "210 40% 96.1%",
        ["--accent-foreground" as string]: "222.2 47.4% 11.2%",
      }}
    >
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="gap-1 text-gray-600">
          <ArrowLeft className="h-4 w-4" /> Admin
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-1.5">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Content Creation Hub</h1>
            <p className="text-xs text-gray-500">Design Instagram-ready carousels</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        {/* ─── Controls panel ─── */}
        <div className="space-y-5">
          {/* Format + Theme */}
          <section className="bg-white rounded-xl border p-4 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2"><Palette className="h-4 w-4" /> Design</h2>

            <div>
              <label className="text-xs font-medium text-gray-600">Format</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setTheme((t) => ({ ...t, format: "portrait" }))}
                  className={`py-2 text-sm rounded-lg border transition ${theme.format === "portrait" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                >Portrait 1080×1920</button>
                <button
                  onClick={() => setTheme((t) => ({ ...t, format: "square" }))}
                  className={`py-2 text-sm rounded-lg border transition ${theme.format === "square" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                >Square 1080×1080</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Font</label>
              <Select value={theme.font} onValueChange={(v) => setTheme((t) => ({ ...t, font: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Headline style</label>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {([
                  { v: "normal",      label: "Normal",    fw: 500, fs: "normal" as const },
                  { v: "bold",        label: "Bold",      fw: 900, fs: "normal" as const },
                  { v: "italic",      label: "Italic",    fw: 500, fs: "italic" as const },
                  { v: "bold-italic", label: "Bold Italic", fw: 900, fs: "italic" as const },
                ] as { v: HeadlineStyle; label: string; fw: number; fs: "normal" | "italic" }[]).map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setTheme((t) => ({ ...t, headlineStyle: s.v }))}
                    style={{ fontWeight: s.fw, fontStyle: s.fs }}
                    className={`py-2 text-sm rounded-lg border transition ${theme.headlineStyle === s.v ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Preset themes</label>
              <div className="grid grid-cols-5 gap-2 mt-1">
                {PRESET_THEMES.map((p) => (
                  <button
                    key={p.name}
                    title={p.name}
                    onClick={() => setTheme((t) => ({ ...t, ...p.theme }))}
                    className="h-10 rounded-lg border border-gray-200 overflow-hidden flex"
                  >
                    <span className="flex-1" style={{ background: p.theme.bgColor }} />
                    <span className="flex-1" style={{ background: p.theme.accentColor }} />
                    <span className="flex-1" style={{ background: p.theme.textColor }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Background" value={theme.bgColor} onChange={(v) => setTheme((t) => ({ ...t, bgColor: v }))} />
              <ColorField label="Accent" value={theme.accentColor} onChange={(v) => setTheme((t) => ({ ...t, accentColor: v }))} />
              <ColorField label="Text" value={theme.textColor} onChange={(v) => setTheme((t) => ({ ...t, textColor: v }))} />
              <ColorField label="Badge bg" value={theme.badgeBg} onChange={(v) => setTheme((t) => ({ ...t, badgeBg: v }))} />
              <ColorField label="Badge text" value={theme.badgeFg} onChange={(v) => setTheme((t) => ({ ...t, badgeFg: v }))} />
            </div>
          </section>

          {/* AI */}
          <section className="bg-white rounded-xl border p-4 space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2"><Wand2 className="h-4 w-4" /> Generate with AI</h2>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. A 3-slide carousel about the best cafés in Koramangala for remote work"
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={generateWithAI}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
            >
              {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</> : <><Sparkles className="h-4 w-4" /> Fill slides with AI</>}
            </Button>
            <p className="text-[11px] text-gray-400 leading-tight">
              Requires <code>OPENAI_API_KEY</code> on the Supabase edge function <code>generate-carousel-content</code>.
            </p>
          </section>

          {/* Slide editor */}
          <section className="bg-white rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Slide {activeIdx + 1} of {slides.length}</h2>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))} disabled={activeIdx === 0}><ChevronLeft className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setActiveIdx(Math.min(slides.length - 1, activeIdx + 1))} disabled={activeIdx === slides.length - 1}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Headline <span className="text-gray-400">(wrap accent words in **like this**)</span></label>
              <Textarea
                value={active.headline}
                onChange={(e) => updateActive({ headline: e.target.value })}
                rows={3}
                className="text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Subheadline</label>
              <Textarea
                value={active.subheadline}
                onChange={(e) => updateActive({ subheadline: e.target.value })}
                rows={2}
                className="text-sm mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Pill badge</label>
                <Input value={active.badge} onChange={(e) => updateActive({ badge: e.target.value })} className="mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">CTA (bottom-right)</label>
                <Input value={active.cta} onChange={(e) => updateActive({ cta: e.target.value })} className="mt-1 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Footer handle</label>
                <Input value={active.footer} onChange={(e) => updateActive({ footer: e.target.value })} className="mt-1 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Image</label>
              <div className="flex gap-2 mt-1">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
                  />
                  <Button type="button" variant="outline" size="sm" className="w-full gap-1.5" asChild>
                    <span className="cursor-pointer"><Upload className="h-3.5 w-3.5" /> Upload</span>
                  </Button>
                </label>
                {active.image && (
                  <Button size="sm" variant="outline" onClick={() => updateActive({ image: null })} className="gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button size="sm" variant="outline" onClick={addSlide} className="gap-1 flex-1"><Plus className="h-3.5 w-3.5" /> Add</Button>
              <Button size="sm" variant="outline" onClick={duplicateSlide} className="gap-1 flex-1"><Copy className="h-3.5 w-3.5" /> Duplicate</Button>
              <Button size="sm" variant="outline" onClick={() => removeSlide(activeIdx)} disabled={slides.length === 1} className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </section>
        </div>

        {/* ─── Preview panel ─── */}
        <div className="space-y-4">
          {/* Thumbnail strip */}
          <div className="bg-white border rounded-xl p-3 flex gap-2 overflow-x-auto">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveIdx(i)}
                className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition ${i === activeIdx ? "border-yellow-500" : "border-transparent hover:border-gray-300"}`}
                style={{ width: 64, height: theme.format === "portrait" ? 114 : 64 }}
              >
                <div className="w-full h-full" style={{ background: theme.bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: theme.textColor, fontWeight: 700 }}>
                  {i + 1}
                </div>
              </button>
            ))}
            <button onClick={addSlide} className="flex-shrink-0 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-400" style={{ width: 64, height: theme.format === "portrait" ? 114 : 64 }}>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Big preview */}
          <div className="bg-white border rounded-xl p-4 flex flex-col items-center">
            <div data-font-tick={fontTick} style={{ width: previewW, height: previewH, position: "relative" }}>
              <SlideCanvas
                key={`${theme.font}-${fontTick}`}
                slide={active}
                theme={theme}
                width={dims.w}
                height={dims.h}
                scale={previewScale}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => downloadSlide(active, activeIdx)}
                disabled={isDownloading}
                className="bg-gray-900 hover:bg-black text-white gap-2"
              >
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Download this slide
              </Button>
              <Button
                onClick={downloadAll}
                disabled={isDownloading}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" /> Download all ({slides.length})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Color field sub-component ──────────────────────────────────────────────

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex gap-1 mt-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 rounded border border-gray-200 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs h-9 font-mono"
        />
      </div>
    </div>
  );
}
