'use client';

import { FormEvent, useState } from 'react';
import { Bot, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const starterPrompts = [
  'What services does AKMEC provide?',
  'Which NDT methods are available?',
  'Where are your offices located?',
];

const initialMessage: ChatMessage = {
  role: 'assistant',
  content: 'Hello. I can answer questions about AKMEC LLP, its services, industries, standards, offices, and published capabilities. I can also suggest technical discussion topics for your team.',
};

export function AKMECAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);

  async function askAssistant(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmedQuestion };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'The assistant is unavailable.');
      }

      setMessages((current) => [...current, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'The assistant is unavailable. Please contact inquiry@akmecgroup.com.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askAssistant(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="AKMEC Assistant"
          className="mb-4 flex h-[min(680px,calc(100vh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border border-white/15 bg-[rgba(10,14,20,0.96)] text-white shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-safety)] text-white">
                <Bot size={21} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold uppercase tracking-wide">AKMEC Assistant</h2>
                <p className="text-xs text-[var(--color-steel-300)]">Company knowledge, clearly sourced</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AKMEC Assistant"
              className="rounded-lg p-2 text-[var(--color-steel-300)] transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-safety)]"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-sm bg-[var(--color-safety)] text-white' : 'rounded-bl-sm border border-white/10 bg-white/[0.08] text-[var(--color-steel-100)]'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-steel-300)]">
                <LoaderCircle className="animate-spin" size={15} aria-hidden="true" />
                Checking the AKMEC knowledge base...
              </div>
            )}
            {messages.length === 1 && (
              <div className="space-y-2 pt-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-signal)]">Try a question</p>
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void askAssistant(prompt)}
                    className="block w-full rounded-lg border border-white/10 px-3 py-2 text-left text-xs text-[var(--color-steel-300)] transition hover:border-[var(--color-safety)]/60 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/20 p-3">
            <label htmlFor="akmec-assistant-input" className="sr-only">Ask AKMEC Assistant</label>
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.06] p-2 focus-within:border-[var(--color-safety)]">
              <textarea
                id="akmec-assistant-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about AKMEC..."
                rows={1}
                maxLength={4000}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-[var(--color-steel-300)]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-safety)] text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="px-2 pt-2 text-[10px] text-[var(--color-steel-300)]">Answers are limited to published AKMEC information.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close AKMEC Assistant' : 'Open AKMEC Assistant'}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-safety)] text-white shadow-[0_12px_28px_rgba(255,106,0,0.35)] transition hover:-translate-y-1 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-safety)] focus:ring-offset-2 focus:ring-offset-[var(--color-steel-950)]"
      >
        {open ? <X size={23} aria-hidden="true" /> : <MessageCircle size={23} aria-hidden="true" />}
      </button>
    </div>
  );
}
