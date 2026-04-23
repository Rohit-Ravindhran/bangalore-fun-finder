// Supabase Edge Function: generate-carousel-content
// Uses OpenAI GPT-4o to generate Instagram carousel slide copy.
//
// Setup:
//   supabase secrets set OPENAI_API_KEY=your_key_here
//   supabase functions deploy generate-carousel-content

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, slideCount = 3 } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'prompt (string) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const count = Math.max(1, Math.min(10, Number(slideCount) || 3));

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OPENAI_API_KEY not configured. Run: supabase secrets set OPENAI_API_KEY=your_key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You write punchy Instagram carousel copy for "Happenin' Bangalore" — an events and activities listing for Bangalore. Tone: warm, conversational, confident, lightly witty. Never cheesy. Use Indian English.`;

    const userPrompt = `Generate exactly ${count} slides for an Instagram carousel about: "${prompt}".

For each slide return:
- "headline": 1-2 short lines, max 10 words total. Wrap the MOST EMOTIONAL 1-3 words in **double asterisks** — these will be coloured as accent. Line breaks with \\n are allowed.
- "subheadline": ONE short supporting line (max 14 words). No emojis. Optional.
- "badge": ONE very short pill phrase (1-3 words) highlighted below subheadline. Optional but preferred.

Return ONLY a valid JSON object in this exact shape — no markdown, no commentary:
{
  "slides": [
    { "headline": "...", "subheadline": "...", "badge": "..." }
  ]
}

Rules:
- First slide is the HOOK (biggest claim, most curiosity).
- Middle slides build the story with one idea each.
- Last slide is the CTA / payoff (e.g. "save this", "drop by", "tag a friend").
- Keep every string under 100 characters.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 900,
        temperature: 0.9,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
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

    let parsed: { slides?: Array<{ headline: string; subheadline: string; badge: string }> };
    try {
      const clean = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not parse GPT response as JSON', raw: rawText.slice(0, 500) }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No slides in response', raw: rawText.slice(0, 500) }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, slides: parsed.slides }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
