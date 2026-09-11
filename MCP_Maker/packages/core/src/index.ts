import { z } from "zod";

export const siteTypeSchema = z.enum(["ecommerce", "blog", "news", "directory"]);
export type SiteType = z.infer<typeof siteTypeSchema>;

export const generateRequestSchema = z.object({
  url: z.string().url().refine((value) => {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    const privateHost = host === "localhost" || host === "::1" || host.endsWith(".local") || host.startsWith("127.") || host.startsWith("10.") || host.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && !privateHost;
  }, "Only public http and https URLs are supported"),
  siteType: siteTypeSchema.default("blog")
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export type JobPhase = "queued" | "crawling" | "sniffing" | "classifying" | "synthesizing" | "ready" | "failed";

export type JobEvent = {
  phase: JobPhase;
  message: string;
  timestamp: string;
};

export type Job = {
  id: string;
  ownerId?: string;
  url: string;
  siteType: SiteType;
  status: "running" | "ready" | "failed";
  events: JobEvent[];
  result?: {
    siteId: string;
    mcpUrl: string;
  };
  error?: string;
};

export const apiTemplateSchema = z.object({
  method: z.enum(["GET", "POST"]),
  urlPattern: z.string().url(),
  headers: z.record(z.string()).default({}),
  responsePath: z.string().optional()
});

export const browserScriptSchema = z.object({
  urlPattern: z.string().min(1),
  selectors: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    links: z.string().optional()
  })
});

export const capabilitySchema = z.object({
  toolName: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/),
  description: z.string().min(1),
  inputSchema: z.record(z.unknown()),
  executionStrategy: z.enum(["api-call", "browser-automation"]),
  apiTemplate: apiTemplateSchema.optional(),
  browserScript: browserScriptSchema.optional()
});

export const capabilitySpecSchema = z.object({
  site: z.object({
    url: z.string().url(),
    name: z.string().min(1),
    authRequired: z.boolean().default(false),
    rateLimitHintMs: z.number().int().positive().default(1000)
  }),
  capabilities: z.array(capabilitySchema).min(2).max(2)
});

export type CapabilitySpec = z.infer<typeof capabilitySpecSchema>;