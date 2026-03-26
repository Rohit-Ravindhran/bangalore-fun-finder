// Supabase Edge Function: extract-from-instagram
// Accepts base64 screenshot images, calls GPT-4o vision API to extract activity details.
//
// Setup:
//   supabase secrets set OPENAI_API_KEY=your_key_here
//   supabase functions deploy extract-from-instagram

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'images array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (images.length > 6) {
      return new Response(
        JSON.stringify({ success: false, error: 'Maximum 6 images allowed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OPENAI_API_KEY not configured. Run: supabase secrets set OPENAI_API_KEY=your_key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build OpenAI message content: images + prompt
    const userContent: unknown[] = [];

    for (const img of images) {
      const mediaType = img.mediaType || 'image/jpeg';
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mediaType)) {
        return new Response(
          JSON.stringify({ success: false, error: `Unsupported media type: ${mediaType}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      userContent.push({
        type: 'image_url',
        image_url: { url: `data:${mediaType};base64,${img.data}`, detail: 'high' },
      });
    }

    userContent.push({
      type: 'text',
      text: `You are helping populate a Bangalore events/activities listing called "Happenin' Bangalore".

Analyze these Instagram post screenshot(s) carefully and extract structured event/activity information.

Return ONLY a JSON object with these fields (use null for anything you cannot determine):
{
  "title": "Event or activity name — short and descriptive",
  "description": "Full description — use caption/text from the post if available. If no caption is present, WRITE a 2-3 sentence description based on the title, visuals, location, and any other details you can infer. Never leave this null.",
  "image_url": "If a clear flyer/poster image URL is visible or embedded in the screenshot, return it. Otherwise null.",
  "price_range": "Price info e.g. '₹500', 'Free', '₹200 - ₹500', 'Pay what you can'",
  "location": "Venue name and area in Bangalore e.g. 'Koramangala Social, Koramangala'",
  "date": "Human-readable date e.g. 'April 5, 2025' or 'Every Saturday'",
  "time": "Time range e.g. '7:00 PM - 10:00 PM' or '6:30 PM onwards'",
  "contact_info": "Phone number, email, or WhatsApp number if visible",
  "url": "Any registration/booking link or website URL mentioned",
  "instagram_handle": "Instagram handle or profile if visible e.g. '@happeninbangalore'",
  "suggested_category_ids": ["Category IDs — pick from: 1=Outdoor, 2=Arts, 3=Events, 4=Sports, 5=Theatre, 6=Unique, 7=Wellness, 8=Parties, 9=Foodie, 10=Trek, 11=Families"],
  "suggested_tags": ["2-5 short lowercase tags relevant to this activity e.g. 'workshop', 'live-music', 'beginner-friendly'"]
}

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- Use null (not empty string) for fields you cannot find — EXCEPT description, which you must always generate
- For suggested_category_ids, return string numbers like ["3", "8"], not integers
- If this does not appear to be a Bangalore event/activity, return: {"error": "Not a recognizable event or activity"}
- Extract ALL text visible in the screenshots to find details`,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ success: false, error: `OpenAI API error: ${response.status}`, detail: errText.slice(0, 300) }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const rawText: string = result.choices?.[0]?.message?.content ?? '';

    let extracted: Record<string, unknown>;
    try {
      const clean = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      extracted = JSON.parse(clean);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not parse GPT response as JSON', raw: rawText.slice(0, 500) }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (extracted.error) {
      return new Response(
        JSON.stringify({ success: false, error: String(extracted.error) }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: extracted }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
