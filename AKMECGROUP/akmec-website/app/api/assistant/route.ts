import { NextResponse } from 'next/server';
import { z } from 'zod';
import { certifications } from '../../../data/certifications';
import { clients } from '../../../data/clients';
import { industries } from '../../../data/industries';
import { offices } from '../../../data/offices';
import { services } from '../../../data/services';
import { stats } from '../../../data/stats';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(4000),
  })).min(1).max(12),
});

const model = process.env.OPEN_ROUTER_MODEL || 'z-ai/glm-5.2:free';

function getApiKey(): string | undefined {
  return process.env.OPEN_ROUTER_API_KEY;
}

function buildCompanyContext() {
  return JSON.stringify({
    company: {
      legalName: 'AKMEC LLP',
      brand: 'AKMEC / AKMEC GROUP',
      tagline: 'Committed to Value, Committed to Excellence',
      positioning: 'Empowering Industries with Quality & Trust',
      mission: 'Deliver end-to-end industrial services while ensuring safety, compliance and client satisfaction in every project.',
      vision: 'Build a safer, smarter, more sustainable industrial future through innovation, integrity and trusted partnerships.',
      operatingSince: '2021',
      certification: 'ISO 9001:2015',
      contact: {
        email: 'inquiry@akmecgroup.com',
        phones: ['+91 9226112227', '+91 9920702095'],
        website: 'www.akmecgroup.com',
      },
    },
    stats,
    services,
    industries,
    certifications,
    offices,
    approvedOrRegisteredWith: ['ARAMCO (PID, VID, QM approved)', 'SABIC', 'ADNOC', 'ORPIC', 'FLUOR', 'Chevron'],
    namedClients: clients.filter((client) => !client.isUnknown).map((client) => client.name),
  }, null, 2);
}

const systemPrompt = `You are the AKMEC Assistant, a precise and personable company representative for AKMEC LLP.

Your job:
- Answer questions about AKMEC LLP, its published services, industries, locations, standards, approvals, clients, capabilities, and contact details.
- Use only the VERIFIED COMPANY CONTEXT below for factual claims about AKMEC.
- Never invent projects, client relationships, results, prices, timelines, employee details, certifications, technical procedures, or regulatory approvals.
- Do not present an approval/registration as a client. Use the label "Approved / Registered With" when discussing ARAMCO, SABIC, ADNOC, ORPIC, FLUOR, or Chevron.
- When a detail is not in the context, say: "That detail is not published on the AKMEC website yet. Please contact inquiry@akmecgroup.com for confirmation." Then provide the closest verified information if useful.
- Expand technical acronyms the first time you use them when practical. Preserve technical accuracy and do not give safety-critical instructions as a substitute for an engineered procedure.
- Keep answers easy to scan: short paragraphs, bullets for lists, and direct links such as /services or /contact when helpful.
- For technical or research questions, you may suggest useful questions AKMEC can discuss based on its published services and capabilities. Label these as "Suggested discussion topics" rather than claiming AKMEC has completed unlisted work.
- If asked something unrelated to AKMEC, politely explain that you can help with AKMEC's company, services, industries, inspection/testing, asset integrity, manpower, training, heat treatment, or contact information.

VERIFIED COMPANY CONTEXT:
${buildCompanyContext()}`;

export async function POST(request: Request) {
  // Rate limiting: max 10 requests per minute per IP to protect against token exhaustion
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`assistant_${ip}`, 10, 60 * 1000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please wait ${rateLimit.retryAfterSeconds} seconds before asking another question.` },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json({
      error: 'The assistant service is currently unavailable. Please contact inquiry@akmecgroup.com.',
    }, { status: 503 });
  }

  try {
    const body = requestSchema.parse(await request.json());
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.akmecgroup.com',
        'X-Title': 'AKMEC Assistant',
      },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...body.messages,
        ],
        temperature: 0.2,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter assistant error status:', response.status);
      return NextResponse.json(
        { error: 'The assistant is temporarily unavailable. Please try again or contact inquiry@akmecgroup.com.' },
        { status: 502 }
      );
    }

    const result = await response.json();
    const answer = result.choices?.[0]?.message?.content;

    if (typeof answer !== 'string' || !answer.trim()) {
      return NextResponse.json({ error: 'The assistant returned an empty answer.' }, { status: 502 });
    }

    return NextResponse.json({ answer: answer.trim() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please send a question under 4,000 characters.' }, { status: 400 });
    }

    console.error('Assistant request error:', error);
    return NextResponse.json({ error: 'Unable to process that question right now.' }, { status: 400 });
  }
}
