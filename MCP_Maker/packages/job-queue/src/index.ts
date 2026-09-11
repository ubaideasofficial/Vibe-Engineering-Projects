import { Queue, Worker, type Job as BullJob, type ConnectionOptions, type Processor } from "bullmq";

export const GENERATION_QUEUE = "mcp-forge-generation";

export type GenerationJob = {
  jobId: string;
  ownerId: string;
  url: string;
  siteType: "ecommerce" | "blog" | "news" | "directory";
};

export type QueueMode = "local" | "redis";

export type GenerationQueue = {
  add(job: GenerationJob): Promise<void>;
};

export class LocalGenerationQueue implements GenerationQueue {
  constructor(private readonly processor: (job: GenerationJob) => Promise<void>) {}

  async add(job: GenerationJob): Promise<void> {
    queueMicrotask(() => void this.processor(job));
  }
}

export class BullMqGenerationQueue implements GenerationQueue {
  private readonly queue: Queue<GenerationJob>;

  constructor(connection: ConnectionOptions, queueName = GENERATION_QUEUE) {
    this.queue = new Queue<GenerationJob>(queueName, { connection, defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: 100, removeOnFail: 500 } });
  }

  async add(job: GenerationJob): Promise<void> {
    await this.queue.add(job.jobId, job);
  }
}

export function createRedisConnection(redisUrl: string): ConnectionOptions {
  const parsed = new URL(redisUrl);
  return { host: parsed.hostname, port: Number(parsed.port || 6379), username: parsed.username || undefined, password: parsed.password || undefined, tls: parsed.protocol === "rediss:" ? {} : undefined, maxRetriesPerRequest: null };
}

export function createGenerationWorker(connection: ConnectionOptions, processor: Processor<GenerationJob>, queueName = GENERATION_QUEUE): Worker<GenerationJob> {
  return new Worker<GenerationJob>(queueName, processor, { connection, concurrency: 2 });
}

export function unwrapBullJob(job: BullJob<GenerationJob>): GenerationJob {
  return job.data;
}