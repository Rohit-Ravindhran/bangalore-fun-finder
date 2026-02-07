import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Activity } from '@/components/ActivityCard';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ActivityImageGeneratorProps {
  activity: Activity;
  onImageGenerated?: () => void;
  autoDownload?: boolean;
}

export const ActivityImageGenerator: React.FC<ActivityImageGeneratorProps> = ({ 
  activity,
  onImageGenerated,
  autoDownload = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${activity.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_happenin_bangalore.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      if (onImageGenerated) {
        onImageGenerated();
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (autoDownload) {
      generateImage();
    }
  }, [autoDownload]);

  return (
    <>
      {/* Hidden card for image generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
        <div ref={cardRef} style={{ width: '1080px', height: '1920px', backgroundColor: 'white', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '60px 80px',
            borderBottom: '2px solid #e5e7eb',
            flexShrink: 0
          }}>
            <h1 style={{ 
              fontSize: '72px', 
              fontWeight: '600', 
              color: '#111827',
              margin: 0,
              letterSpacing: '-1px'
            }}>
              Happ'nin <span style={{ color: '#f97316' }}>Bangalore</span>
            </h1>
          </div>

          {/* Activity Image */}
          <div style={{ 
            width: '100%', 
            height: '600px', 
            overflow: 'hidden', 
            backgroundColor: '#f3f4f6', 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={activity.image || '/placeholder.svg'} 
              alt={activity.title}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center'
              }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Content */}
          <div style={{ padding: '80px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Title */}
              <h2 style={{ 
                fontSize: '56px', 
                fontWeight: '700', 
                color: '#111827',
                marginBottom: '32px',
                lineHeight: '1.2'
              }}>
                {activity.title}
              </h2>

              {/* Description */}
              <p style={{ 
                color: '#6b7280', 
                fontSize: '36px',
                marginBottom: '60px',
                lineHeight: '1.5',
                maxHeight: '180px',
                overflow: 'hidden'
              }}>
                {activity.description.length > 150 
                  ? activity.description.substring(0, 150) + '...' 
                  : activity.description}
              </p>

              {/* Details - Location and Date */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '32px',
                marginBottom: '60px' 
              }}>
                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ fontSize: '48px' }}>📍</span>
                  <span style={{ fontSize: '36px', color: '#6b7280', fontWeight: '500' }}>
                    {activity.location}
                  </span>
                </div>

                {/* Date */}
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

            {/* Price and Button */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '48px',
              borderTop: '3px solid #e5e7eb'
            }}>
              <div>
                <span style={{ 
                  fontSize: '64px', 
                  fontWeight: '700', 
                  color: '#111827'
                }}>
                  {activity.priceRange}
                </span>
              </div>
              <div style={{
                color: '#f97316',
                fontSize: '40px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
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
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download Image
          </>
        )}
      </Button>
    </>
  );
};

export default ActivityImageGenerator;
