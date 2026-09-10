"use client";

import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const siteTypes = ["ecommerce", "blog", "news", "directory"] as const;

type EventItem = { phase: string; message: string; timestamp: string };
type Result = { siteId: string; mcpUrl: string };

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [siteType, setSiteType] = useState<(typeof siteTypes)[number]>("blog");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setEvents([]);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, siteType })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Generation could not start");

      const stream = new EventSource(`${API_URL}/api/status/${body.jobId}/stream`);
      stream.onmessage = (message) => setEvents((current) => [...current, JSON.parse(message.data)]);
      stream.addEventListener("complete", (message) => {
        const job = JSON.parse((message as MessageEvent).data);
        setResult(job.result ?? null);
        setLoading(false);
        stream.close();
      });
      stream.onerror = () => {
        stream.close();
        setLoading(false);
        setError("The progress stream disconnected. Check that the local API is running.");
      };
    } catch (caught) {
      setLoading(false);
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    }
  }

  return (
    <main className="shell">
      <nav className="topbar"><span className="mark">MF</span><span>MCP Forge <small>LOCAL MVP</small></span><span className="status"><i /> discovery engine online</span></nav>
      <section className="hero">
        <div className="eyebrow">Website intelligence / 01</div>
        <h1>Give any public site<br /><em>a useful interface.</em></h1>
        <p className="lede">MCP Forge finds the site&apos;s own data pathways, then shapes them into two focused tools you can bring into Claude or Cursor.</p>
        <form onSubmit={generate} className="forge-form">
          <label htmlFor="url">Public website URL</label>
          <div className="url-row"><input id="url" type="url" required placeholder="https://your-site.com" value={url} onChange={(event) => setUrl(event.target.value)} /><button type="submit" disabled={loading}>{loading ? "Working..." : "Forge endpoint"}<span>↗</span></button></div>
          <div className="form-foot"><div><span className="label">Site shape</span><div className="type-picker">{siteTypes.map((type) => <button type="button" className={siteType === type ? "selected" : ""} key={type} onClick={() => setSiteType(type)}>{type}</button>)}</div></div><span className="hint">Public pages only · robots respected</span></div>
        </form>
        {error && <div className="error">{error}</div>}
      </section>
      <section className="workspace">
        <div className="panel progress-panel"><div className="panel-head"><span>Pipeline log</span><span className="mono">{events.length ? `${events.length.toString().padStart(2, "0")} events` : "awaiting input"}</span></div><div className="log">{events.length === 0 ? <div className="empty"><span>01</span><p>Your discovery trace will appear here.</p></div> : events.map((item, index) => <div className="log-item" key={`${item.timestamp}-${index}`}><span className="log-index">{String(index + 1).padStart(2, "0")}</span><span className="log-phase">{item.phase}</span><span>{item.message}</span></div>)}</div></div>
        <div className="panel result-panel"><div className="panel-head"><span>Generated connection</span><span className="dot-label">{result ? "ready" : "standby"}</span></div>{result ? <div className="result-content"><div className="ready-icon">✓</div><p className="result-title">Your remote MCP route is ready.</p><div className="mcp-url">{result.mcpUrl}</div><div className="config"><span>Claude / Cursor URL</span><code>{`{\n  "url": "${result.mcpUrl}"\n}`}</code></div></div> : <div className="empty result-empty"><div className="route-line" /><p>Forge a site to receive a<br />paste-ready MCP connection.</p></div>}</div>
      </section>
      <footer><span>Built for the open web</span><span>LOCAL HOST · :4000</span></footer>
    </main>
  );
}