import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload?.serviceType || !payload?.name || !payload?.email) {
      return NextResponse.json({ error: 'Missing required quote fields' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Quote request submitted successfully.',
      data: payload,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
