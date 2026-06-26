"use client";

import { FormEvent, useState } from "react";
import { Bot, MessageCircle, SendHorizonal, X } from "lucide-react";
import { askAssistant } from "@/lib/api";
import { localAssistantAnswer } from "@/lib/local-ai";
import type { ChatMessage } from "@/lib/types";

import { disasterEvents } from "@/lib/mock-data";

type Props = {
  token?: string;
  onNavigate?: (view: string, projectId?: string) => void;
};

const seed: ChatMessage[] = [
  {
    id: "seed",
    role: "assistant",
    content: "Ask about flood risk in Pune, earthquake impact zones, shelter allocation, anomaly detection, or report summaries."
  }
];

export function AIAssistant({ token, onNavigate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { id: crypto.randomUUID(), role: "user" as const, content }];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);

    try {
      if (!token || token === "offline-demo-token") {
        throw new Error("Use local assistant");
      }
      const result = await Promise.race([
        askAssistant(nextMessages, token),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("AI timeout")), 1400))
      ]);
      setMessages([...nextMessages, { id: crypto.randomUUID(), role: "assistant", content: result.answer }]);
    } catch {
      const local = localAssistantAnswer(nextMessages);
      setMessages([...nextMessages, { id: crypto.randomUUID(), role: "assistant", content: `${local.answer}\n\nActions: ${local.actions.join(", ")}` }]);
    } finally {
      setLoading(false);
    }
  }

  function askPreset(content: string, projectId?: string) {
    if (projectId) {
      const event = disasterEvents.find(e => e.id === projectId);
      if (event) {
        const nextMessages: ChatMessage[] = [
          ...messages,
          { id: crypto.randomUUID(), role: "user", content },
          { 
            id: crypto.randomUUID(), 
            role: "assistant", 
            content: `I've analyzed the latest operations data for **${event.name}**. The current risk score is ${event.riskScore} with a status of '${event.status}'. Multi-modal sensors indicate immediate attention is required within the ${event.radiusKm}km radius.\n\n[ACTION:ANALYZE:${event.id}]`
          }
        ];
        setMessages(nextMessages);
        return;
      }
    }
    setDraft(content);
  }

  return (
    <>
      {/* Sidebar removed to fix "always open" issue, now using a floating toggle on all screens */}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 grid h-12 w-12 place-items-center rounded-lg bg-cyan text-ink shadow-glow xl:bottom-6"
        title="Open AI assistant"
      >
        <MessageCircle size={22} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/55 p-3 backdrop-blur-sm">
          <div className="glass ml-auto flex h-full max-w-md flex-col rounded-lg p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.08]" title="Close AI assistant">
                <X size={18} />
              </button>
            </div>
            <AssistantPanel messages={messages} draft={draft} loading={loading} onDraftChange={setDraft} onSubmit={submit} onPreset={askPreset} compact onNavigate={onNavigate} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function AssistantPanel({
  messages,
  draft,
  loading,
  onDraftChange,
  onSubmit,
  onPreset,
  compact = false,
  onNavigate
}: {
  messages: ChatMessage[];
  draft: string;
  loading: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onPreset: (value: string, projectId?: string) => void;
  compact?: boolean;
  onNavigate?: (view: string, projectId?: string) => void;
}) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/15 text-cyan">
          <Bot size={22} />
        </div>
        <div>
          <h2 className="font-semibold">AI operations assistant</h2>
          <p className="text-xs text-slate-400">LLM plus decision workflow layer</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto thin-scrollbar">
        {disasterEvents.map((event) => (
          <button key={event.id} onClick={() => onPreset(`Give me an update on ${event.name}`, event.id)} className="rounded-lg border border-white/10 bg-white/[0.055] px-2 py-1 text-xs text-slate-300 hover:border-cyan/50 hover:bg-cyan/10 transition">
            Analyze {event.name}
          </button>
        ))}
      </div>

      <div className={`thin-scrollbar space-y-3 overflow-y-auto pr-1 ${compact ? "h-[calc(100%-11rem)]" : "h-[calc(100%-12rem)]"}`}>
        {messages.map((message) => {
          const hasAction = message.content.includes("[ACTION:ANALYZE:");
          const cleanContent = message.content.replace(/\[ACTION:ANALYZE:.*\]/, "");
          const projectId = hasAction ? message.content.match(/\[ACTION:ANALYZE:(.*?)\]/)?.[1] : null;

          return (
            <div key={message.id} className={`whitespace-pre-wrap rounded-lg p-3 text-sm leading-6 ${message.role === "assistant" ? "border border-cyan/20 bg-cyan/10 text-slate-200" : "border border-white/10 bg-white/[0.055] text-slate-100"}`}>
              {cleanContent}
              {hasAction && projectId && (
                <button 
                  onClick={() => onNavigate?.("analysis", projectId)}
                  className="mt-3 w-full block rounded-lg bg-cyan px-4 py-2 text-center text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
                >
                  Direct to Data Analysis
                </button>
              )}
            </div>
          );
        })}
        {loading ? <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-slate-400">Analyzing live context...</div> : null}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/25 px-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan/50"
          placeholder="Show flood risk in Pune"
        />
        <button className="grid h-11 w-11 place-items-center rounded-lg bg-cyan text-ink shadow-glow" title="Send">
          <SendHorizonal size={18} />
        </button>
      </form>
    </>
  );
}
