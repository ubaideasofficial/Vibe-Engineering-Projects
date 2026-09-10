import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

const quoteSchema = z.object({
  serviceType: z.string().trim().min(1, 'Please select a service category').max(100),
  urgency: z.enum(['low', 'medium', 'high', 'emergency']),
  details: z.string().trim().min(10, 'Please provide more details').max(5000, 'Details too long'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  company: z.string().trim().min(2, 'Company name is required').max(150, 'Company name too long'),
  phone: z.string().trim().min(5, 'Phone number is required').max(50, 'Phone number too long'),
  hp_field: z.string().optional(), // Honeypot field for spam bots
});

export async function POST(request: Request) {
  // Rate limiting: max 5 requests per 10 minutes per IP
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`quote_${ip}`, 5, 10 * 60 * 1000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many submissions. Please try again in ${rateLimit.retryAfterSeconds} seconds.` },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  try {
    const json = await request.json();
    const parsed = quoteSchema.safeParse(json);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : 'Invalid quote submission' },
        { status: 400 }
      );
    }

    // Silent discard for spam bots triggering honeypot
    if (parsed.data.hp_field) {
      return NextResponse.json({
        ok: true,
        message: 'Your quote request has been received. Our team will contact you within 24 hours.',
      });
    }

    // Return sanitized confirmation without reflecting raw payload
    return NextResponse.json({
      ok: true,
      message: 'Your quote request has been received. Our technical team will review your requirements and respond within 24 hours.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

