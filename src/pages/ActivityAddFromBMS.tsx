
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PreviewData {
  title: string;
  image: string;
  description: string;
  price_range: string;
  location: string;
  date: string;
  time: string;
  map_link: string;
  url: string;
  tags: string[];
  category_ids: string[];
  enabled: boolean;
}

const ActivityAddFromBMS = () => {
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePreview = () => {
    setLoading(true);
    try {
      const $ = cheerio.load(html);

      const title = $('h1.sc-7o7nez-0').first().text().trim();
      const image = $('img[src*="media-desktop-"]').first().attr('src') || '';
      const descNodes = $('div.sc-omw9zj-1').find('p');
      const description = descNodes.map((i, el) => $(el).text().trim()).get().join(' ');
      const priceText = $('body').text().match(/₹\d+/)?.[0] || '₹0';
      const location = $('body').text().match(/Bangalore|Bengaluru/i)?.[0] || 'Bangalore';
      const date = $('body').text().match(/\d{1,2}[a-z]{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)?.[0] || '';
      const time = $('body').text().match(/\d{1,2}:\d{2}\s*(AM|PM)/i)?.[0] || '';

      const previewData: PreviewData = {
        title,
        image,
        description,
        price_range: priceText,
        location,
        date,
        time,
        map_link: `https://maps.google.com/?q=${location.replace(/\s+/g, '+')}`,
        url: '',
        tags: ['5'], // Assuming "5" is the tag ID for "Event"
        category_ids: ['6'], // Assuming "6" is the category ID for Events
        enabled: true
      };

      setPreview(previewData);
      
      // Show toast if extraction was successful
      if (title) {
        toast({
          title: "Preview generated",
          description: "Event information extracted successfully!",
        });
      } else {
        toast({
          title: "Extraction incomplete",
          description: "Some fields couldn't be extracted. Please check the preview.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error parsing HTML:', error);
      toast({
        title: "Parsing error",
        description: "Failed to parse HTML. Please check the content and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!preview) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('activities').insert([preview]);
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "Event has been added to the database",
      });
      
      // Reset form
      setHtml('');
      setPreview(null);
    } catch (error: any) {
      console.error('Error saving to Supabase:', error);
      toast({
        title: "Error saving event",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-w2d-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add Events from BookMyShow</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Admin
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <p className="mb-4 text-gray-600">
            Paste the full HTML from a BookMyShow event page to automatically extract event details.
          </p>
          
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={15}
            className="w-full mb-4 font-mono text-sm"
            placeholder="Paste full HTML from BookMyShow event page here..."
          />
          
          <Button 
            onClick={handlePreview} 
            disabled={loading || !html.trim()}
            className="mb-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing...
              </>
            ) : (
              'Generate Preview'
            )}
          </Button>

          {preview && (
            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Event Preview</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">Title:</p>
                    <p>{preview.title || "Not extracted"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">Date:</p>
                    <p>{preview.date || "Not extracted"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">Time:</p>
                    <p>{preview.time || "Not extracted"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">Location:</p>
                    <p>{preview.location || "Not extracted"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">Price:</p>
                    <p>{preview.price_range || "Not extracted"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">Description:</p>
                    <p className="text-sm">{preview.description || "Not extracted"}</p>
                  </div>
                </div>
                
                <div>
                  {preview.image ? (
                    <img 
                      src={preview.image} 
                      alt="event banner" 
                      className="w-full h-auto max-h-80 object-contain rounded-md mb-4" 
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-48 flex items-center justify-center rounded-md mb-4">
                      <p className="text-gray-500">No image extracted</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Submit to Database'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ActivityAddFromBMS;
