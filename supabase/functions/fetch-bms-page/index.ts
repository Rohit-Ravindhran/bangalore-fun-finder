// Supabase Edge Function: fetch-bms-page
// Fetches a BookMyShow event page via ScrapingBee (renders JS, bypasses Cloudflare).
//
// Setup:
//   1. Sign up at https://www.scrapingbee.com — free tier: 1000 credits
//   2. supabase secrets set SCRAPINGBEE_API_KEY=your_key_here
//   3. supabase functions deploy fetch-bms-page

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    if (!url.includes('bookmyshow.com')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only BookMyShow URLs are supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('SCRAPINGBEE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'SCRAPINGBEE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // render_js=true: runs Cloudflare JS challenge + hydrates React/Next.js
    // wait=2000: give the page 2s to settle after JS execution
    // block_ads=true: skip ad network requests to speed up rendering
    const scrapeUrl = new URL('https://app.scrapingbee.com/api/v1/');
    scrapeUrl.searchParams.set('api_key', apiKey);
    scrapeUrl.searchParams.set('url', url);
    scrapeUrl.searchParams.set('render_js', 'true');
    scrapeUrl.searchParams.set('wait', '2000');
    scrapeUrl.searchParams.set('block_ads', 'true');

    const response = await fetch(scrapeUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          success: false,
          error: `ScrapingBee returned ${response.status}`,
          detail: errorText.slice(0, 300),
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();

    // Sanity check: make sure we got actual BMS content
    if (!html.toLowerCase().includes('bookmyshow')) {
      return new Response(
        JSON.stringify({ success: false, error: 'ScrapingBee returned unexpected content' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, html }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
