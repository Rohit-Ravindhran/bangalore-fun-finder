// Supabase Edge Function: trigger-crawl
// Dispatches the GitHub Actions crawl-events workflow.
// PAT never leaves the server — only admins can call this function.
//
// Setup:
//   1. Create a GitHub PAT (Settings → Developer settings → Fine-grained tokens)
//      Permissions: Actions → Read & Write  (that's all it needs)
//   2. supabase secrets set GITHUB_PAT=github_pat_...
//   3. supabase functions deploy trigger-crawl

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const OWNER    = 'Rohit-Ravindhran';
const REPO     = 'bangalore-fun-finder';
const WORKFLOW = 'crawl-events.yml';
const REF      = 'main'; // branch to run on

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const respond = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  const GITHUB_PAT = Deno.env.get('GITHUB_PAT');
  if (!GITHUB_PAT) return respond({ error: 'GITHUB_PAT secret not configured' }, 500);

  try {
    const body = await req.json().catch(() => ({}));
    const { dry_run = false, query = '' } = body as { dry_run?: boolean; query?: string };

    // Build workflow_dispatch inputs (matches the workflow's inputs section)
    const inputs: Record<string, string> = {
      dry_run: String(dry_run),
    };
    if (query) inputs.query = query;

    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_PAT}`,
          'Accept':        'application/vnd.github+json',
          'Content-Type':  'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ ref: REF, inputs }),
        signal: AbortSignal.timeout(15_000),
      }
    );

    // GitHub returns 204 No Content on success
    if (res.status === 204) {
      return respond({
        success: true,
        message: 'Workflow dispatched. Check GitHub Actions for progress.',
        workflow_url: `https://github.com/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}`,
      });
    }

    const errBody = await res.json().catch(() => ({}));
    return respond(
      { error: errBody?.message ?? `GitHub API returned ${res.status}` },
      res.status
    );
  } catch (err: unknown) {
    return respond({ error: (err as Error).message }, 500);
  }
});
