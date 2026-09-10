import { z } from "zod";

export const siteTypeSchema = z.enum(["ecommerce", "blog", "news", "directory"]);
export type SiteType = z.infer<typeof siteTypeSchema>;

export const generateRequestSchema = z.object({
  url: z.string().url(),
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