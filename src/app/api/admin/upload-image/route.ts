import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'activity_images'

// Uses the service role key so RLS is bypassed entirely.
// This key must never be exposed to the browser.
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = adminClient()

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Ensure the bucket exists (no-op if already there)
    const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    })
    // Ignore "already exists" – any other error is real
    if (bucketError && !bucketError.message.toLowerCase().includes('already exists')) {
      return NextResponse.json({ error: `Bucket error: ${bucketError.message}` }, { status: 500 })
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const bytes = await file.arrayBuffer()

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, bytes, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
