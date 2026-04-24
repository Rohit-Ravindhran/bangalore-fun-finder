import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Fetches a remote image server-side so the client can use it without CORS restrictions
// (html2canvas needs clean, untainted canvases). Returns the image bytes with
// permissive CORS + caching headers.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'url query param required' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  // Only allow http(s) to prevent SSRF via file:// etc.
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return NextResponse.json({ error: 'only http(s) allowed' }, { status: 400 })
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        // Some CDNs gate on UA/referrer
        'User-Agent': 'Mozilla/5.0 (compatible; HappeninBangaloreBot/1.0)',
        Accept: 'image/*,*/*;q=0.8',
      },
      // 15s upper-bound
      signal: AbortSignal.timeout(15000),
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `upstream ${upstream.status}` },
        { status: 502 }
      )
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'not an image' }, { status: 415 })
    }

    const buf = await upstream.arrayBuffer()
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'fetch failed' },
      { status: 502 }
    )
  }
}
