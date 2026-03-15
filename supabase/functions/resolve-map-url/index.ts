// Supabase Edge Function: resolve-map-url
// Follows Google Maps short URLs (maps.app.goo.gl, goo.gl/maps, etc.)
// and extracts latitude / longitude from the final URL.
//
// Deploy: supabase functions deploy resolve-map-url

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  // Format 1: /@lat,lng,zoom  (most common in share links)
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  // Format 2: ?q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

  // Format 3: ll=lat,lng
  const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };

  // Format 4: daddr=lat,lng
  const daddrMatch = url.match(/[?&](?:daddr|saddr|center)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (daddrMatch) return { lat: parseFloat(daddrMatch[1]), lng: parseFloat(daddrMatch[2]) };

  // Format 5: !3dlat!4dlng (embed format)
  const embedMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (embedMatch) return { lat: parseFloat(embedMatch[1]), lng: parseFloat(embedMatch[2]) };

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try client-parseable full URLs first (no fetch needed)
    const directCoords = extractCoordsFromUrl(url);
    if (directCoords) {
      return new Response(
        JSON.stringify({ success: true, ...directCoords, finalUrl: url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For short URLs, follow the redirect chain server-side (avoids CORS)
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      },
    });

    const finalUrl = response.url;
    const coords = extractCoordsFromUrl(finalUrl);

    if (!coords) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Could not extract coordinates from this URL',
          finalUrl,
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ...coords, finalUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
