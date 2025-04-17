import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const start = (page - 1) * limit;
  const integers = Array.from({ length: limit }, (_, i) => start + i + 1);

  return NextResponse.json({ integers, nextPage: page + 1 });
}