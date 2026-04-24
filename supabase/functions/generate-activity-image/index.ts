// Supabase Edge Function: generate-activity-image
// Uses OpenAI's Image API (gpt-image-1 / dall-e-3) to generate a visual
// when an activity has no image. Returns a data URL ready to drop into <img src>.
//
// Setup:
//   supabase secrets set OPENAI_API_KEY=your_key_here
//   supabase functions deploy generate-activity-image

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { title, description, location, size = '1024x1536' } = await req.json();

    if (!title || typeof title !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'title is required' }),
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

    const prompt = [
      `Editorial-style photograph for a Bangalore events listing.`,
      `Event: "${title}".`,
      description ? `Context: ${String(description).slice(0, 240)}.` : '',
      location ? `Location: ${location}.` : '',
      `Bright, warm, friendly. Rich natural light. People enjoying the moment when appropriate.`,
      `No text, no watermarks, no logos, no captions. Clean composition suitable for a poster background.`,
    ].filter(Boolean).join(' ');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size,        // "1024x1536" portrait, "1024x1024" square, "1536x1024" landscape
        n: 1,
        quality: 'high',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ success: false, error: `OpenAI API error: ${response.status}`, detail: errText.slice(0, 400) }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const b64: string | undefined = result.data?.[0]?.b64_json;
    const url: string | undefined = result.data?.[0]?.url;

    const dataUrl = b64
      ? `data:image/png;base64,${b64}`
      : url
      ? url
      : null;

    if (!dataUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image in response' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, image: dataUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
