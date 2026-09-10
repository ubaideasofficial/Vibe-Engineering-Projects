import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().trim().max(50, 'Phone is too long').optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(200, 'Subject is too long'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
  hp_field: z.string().optional(), // Honeypot field for spam bots
});

export async function POST(request: Request) {
  // Rate limiting: max 5 requests per 10 minutes per IP
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);

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
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : 'Invalid form submission' },
        { status: 400 }
      );
    }

    // Silent discard for spam bots triggering honeypot
    if (parsed.data.hp_field) {
      return NextResponse.json({
        ok: true,
        message: 'Your message has been received. Our team will contact you shortly.',
      });
    }

    // Process valid contact inquiry (e.g. logging/SMTP integration)
    return NextResponse.json({
      ok: true,
      message: 'Your message has been received. Our team will contact you shortly.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

