import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Activity } from '@/components/ActivityCard';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityImageGeneratorProps {
  activity: Activity;
  onImageGenerated?: () => void;
  autoDownload?: boolean;
}

// Fetch any remote image through our own /api/image-proxy so html2canvas can
// render it without tainting the canvas. Returns a data URL, or null on failure.
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  // Already a data URL — nothing to do.
  if (url.startsWith('data:')) return url;

  try {
    const proxied = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxied);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Ask OpenAI (via supabase edge function) to create an image for events that don't have one.
async function generateAIImage(activity: Activity): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-activity-image', {
      body: {
        title: activity.title,
        description: activity.description,
        location: activity.location,
        size: '1024x1536',
      },
    });
    if (error) return null;
    if (!data?.success) return null;
    const img = data.image as string;
    // If it came back as an http URL, pull it through the proxy to get a data URL.
    if (img.startsWith('data:')) return img;
    return await fetchImageAsDataUrl(img);
  } catch {
    return null;
  }
}

export const ActivityImageGenerator: React.FC<ActivityImageGeneratorProps> = ({
  activity,
  onImageGenerated,
  autoDownload = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [resolvedImage, setResolvedImage] = React.useState<string | null>(null);
  const [usedAI, setUsedAI] = React.useState(false);

  // Resolve a render-safe image: proxy the existing one, or ask AI if missing / failing.
  const resolveImage = React.useCallback(async (): Promise<string> => {
    if (activity.image) {
      const proxied = await fetchImageAsDataUrl(activity.image);
      if (proxied) {
        setResolvedImage(proxied);
        setUsedAI(false);
        return proxied;
      }
    }
    const ai = await generateAIImage(activity);
    if (ai) {
      setResolvedImage(ai);
      setUsedAI(true);
      return ai;
    }
    // Last resort — render with placeholder.
    const placeholder = '/placeholder.svg';
    setResolvedImage(placeholder);
    return placeholder;
  }, [activity]);

  const generateImage = React.useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      // 1. Make sure the image in the hidden card is a data URL (CORS-safe).
      const safeSrc = await resolveImage();
      // Directly set the <img> src to the resolved (data URL) before html2canvas runs.
      const imgEl = cardRef.current.querySelector<HTMLImageElement>('img[data-activity-image]');
      if (imgEl) {
        imgEl.src = safeSrc;
        // Wait for it to actually finish decoding.
        if (!imgEl.complete) {
          await new Promise<void>((resolve) => {
            imgEl.onload = () => resolve();
            imgEl.onerror = () => resolve();
          });
        }
        try { await imgEl.decode(); } catch { /* ignore */ }
      }

      // 2. Wait for fonts.
      if (document.fonts && document.fonts.ready) await document.fonts.ready;

      // 3. Snapshot.
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${activity.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_happenin_bangalore.png`;
      link.href = downloadUrl;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      onImageGenerated?.();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [activity.title, onImageGenerated, resolveImage]);

  React.useEffect(() => {
    if (autoDownload) {
      generateImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload]);

  return (
    <>
      {/* Hidden card for image generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
        <div
          ref={cardRef}
          style={{
            width: '1080px',
            height: '1920px',
            backgroundColor: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '60px 80px',
              borderBottom: '2px solid #e5e7eb',
              flexShrink: 0,
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                letterSpacing: '-1px',
              }}
            >
              Happ'nin <span style={{ color: '#f97316' }}>Bangalore</span>
            </h1>
          </div>

          {/* Activity Image */}
          <div
            style={{
              width: '100%',
              height: '600px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              data-activity-image
              src={resolvedImage ?? '/placeholder.svg'}
              alt={activity.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
            {usedAI && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  fontSize: '20px',
                  color: '#6b7280',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                AI generated
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '80px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2
                style={{
                  fontSize: '56px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '32px',
                  lineHeight: '1.2',
                }}
              >
                {activity.title}
              </h2>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: '36px',
                  marginBottom: '60px',
                  lineHeight: '1.5',
                  maxHeight: '180px',
                  overflow: 'hidden',
                }}
              >
                {activity.description.length > 150
                  ? activity.description.substring(0, 150) + '...'
                  : activity.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  marginBottom: '60px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ fontSize: '48px' }}>📍</span>
                  <span style={{ fontSize: '36px', color: '#6b7280', fontWeight: '500' }}>
                    {activity.location}
                  </span>
                </div>

                {activity.date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontSize: '48px' }}>📅</span>
                    <span style={{ fontSize: '36px', color: '#6b7280', fontWeight: '500' }}>
                      {activity.date}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '48px',
                borderTop: '3px solid #e5e7eb',
              }}
            >
              <div>
                <span style={{ fontSize: '64px', fontWeight: '700', color: '#111827' }}>
                  {activity.priceRange}
                </span>
              </div>
              <div
                style={{
                  color: '#f97316',
                  fontSize: '40px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                Show me more →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visible trigger button */}
      <Button
        onClick={generateImage}
        disabled={isGenerating}
        size="sm"
        variant="outline"
        className="gap-2"
        title={activity.image ? 'Download marketing image' : 'No image on record — AI will generate one'}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : activity.image ? (
          <>
            <Download className="h-4 w-4" />
            Download Image
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </>
        )}
      </Button>
    </>
  );
};

export default ActivityImageGenerator;
