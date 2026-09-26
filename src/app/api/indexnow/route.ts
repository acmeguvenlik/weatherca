import { NextResponse } from 'next/server';
import { submitUrlsToIndexNow } from '@/lib/indexnow';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const urls = Array.isArray(body?.urls) ? body.urls : ['https://weatherca.net'];

    const result = await submitUrlsToIndexNow(urls);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'IndexNow dispatch failed',
      },
      { status: 500 }
    );
  }
}
