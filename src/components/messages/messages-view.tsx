"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Clock3, MessagesSquare, RotateCw, Search, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage, ConversationSummary } from "@/lib/messages";

const THREAD_POLL_MS = 4000;
const LIST_POLL_MS = 10000;
const MAX_LENGTH = 2000;

type LocalMessage = ChatMessage & { status?: "sending" | "failed" };

// ---------------------------------------------------------------- helpers

/**
 * Runs `fn` every `ms` while the tab is visible (and once when it comes back),
 * skipping a tick if the previous call is still in flight so slow responses
 * never stack up.
 */
function useVisiblePolling(fn: () => Promise<void>, ms: number, enabled = true) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    if (!enabled) return;
    let inFlight = false;
    const tick = () => {
      if (inFlight || document.visibilityState !== "visible") return;
      inFlight = true;
      fnRef.current().finally(() => {
        inFlight = false;
      });
    };
    const timer = window.setInterval(tick, ms);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [ms, enabled]);
}

function relativeTime(iso: string, now: number) {
  const date = new Date(iso);
  const mins = Math.floor((now - date.getTime()) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (mins < 24 * 60) return `${Math.floor(mins / 60)}h`;
  if (mins < 7 * 24 * 60) return date.toLocaleDateString(undefined, { weekday: "short" });
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

// ------------------------------------------------------------------- view

export function MessagesView({
  role,
  initialConversations,
  initialActiveId,
  initialMessages,
}: {
  role: "COMPANY" | "CREATOR";
  initialConversations: ConversationSummary[];
  initialActiveId: string | null;
  initialMessages: ChatMessage[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);
  const [messages, setMessages] = useState<LocalMessage[]>(initialMessages);
  const [loadingThread, setLoadingThread] = useState(false);
  const [query, setQuery] = useState("");
  // Dates render in the viewer's timezone, so they only appear after mount
  // (server and first client render must match).
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(t);
  }, []);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  // ---- read receipts
  const markRead = useCallback((id: string) => {
    setConversations((list) => list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    fetch(`/api/conversations/${id}/read`, { method: "POST" }).catch(() => {});
  }, []);

  // ---- list polling
  const refreshList = useCallback(async () => {
    const res = await fetch("/api/conversations", { cache: "no-store" }).catch(() => null);
    if (!res?.ok) return;
    const data: { conversations: ConversationSummary[] } = await res.json();
    setConversations(data.conversations);
  }, []);
  useVisiblePolling(refreshList, LIST_POLL_MS);

  // ---- open a thread
  const skipInitialFetch = useRef(initialActiveId !== null);
  useEffect(() => {
    if (!activeId) return;
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
    } else {
      setMessages([]);
      setLoadingThread(true);
      fetch(`/api/conversations/${activeId}/messages`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then((data: { messages: ChatMessage[] }) => setMessages(data.messages))
        .catch(() => toast.error("Couldn't load this conversation."))
        .finally(() => setLoadingThread(false));
    }
    markRead(activeId);
  }, [activeId, markRead]);

  function openConversation(id: string | null) {
    setActiveId(id);
    // Keep the URL shareable/refreshable without a server round trip.
    window.history.replaceState(null, "", id ? `/messages?c=${id}` : "/messages");
  }

  // ---- thread polling: only fetch what's newer than the last saved message
  const pollThread = useCallback(async () => {
    if (!activeId) return;
    const lastSaved = [...messages].reverse().find((m) => !m.status);
    const url = `/api/conversations/${activeId}/messages${lastSaved ? `?after=${encodeURIComponent(lastSaved.createdAt)}` : ""}`;
    const res = await fetch(url, { cache: "no-store" }).catch(() => null);
    if (!res?.ok) return;
    const data: { messages: ChatMessage[] } = await res.json();
    if (data.messages.length === 0) return;
    setMessages((current) => {
      const known = new Set(current.map((m) => m.id));
      const fresh = data.messages.filter((m) => !known.has(m.id));
      return fresh.length ? [...current.filter((m) => !m.status), ...fresh, ...current.filter((m) => m.status)] : current;
    });
    if (data.messages.some((m) => !m.fromMe)) markRead(activeId);
  }, [activeId, messages, markRead]);
  useVisiblePolling(pollThread, THREAD_POLL_MS, activeId !== null && !loadingThread);

  // ---- send
  async function send(body: string, retryOf?: string) {
    if (!activeId) return;
    const conversationId = activeId;
    const tempId = retryOf ?? `temp-${Date.now()}`;
    const optimistic: LocalMessage = { id: tempId, body, createdAt: new Date().toISOString(), fromMe: true, status: "sending" };
    setMessages((m) => (retryOf ? m.map((x) => (x.id === retryOf ? optimistic : x)) : [...m, optimistic]));

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    }).catch(() => null);

    if (!res?.ok) {
      const data = await res?.json().catch(() => ({}));
      toast.error(data?.error || "Message not sent. Check your connection and retry.");
      setMessages((m) => m.map((x) => (x.id === tempId ? { ...x, status: "failed" } : x)));
      return;
    }
    const { message }: { message: ChatMessage } = await res.json();
    setMessages((m) => {
      // A poll may already have picked the saved message up - don't show it twice.
      const withoutTemp = m.filter((x) => x.id !== tempId);
      return withoutTemp.some((x) => x.id === message.id) ? withoutTemp : [...withoutTemp.filter((x) => !x.status), message, ...withoutTemp.filter((x) => x.status)];
    });
    setConversations((list) => {
      const updated = list.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: { body: message.body, createdAt: message.createdAt, fromMe: true }, updatedAt: message.createdAt }
          : c
      );
      return [...updated].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      [c.counterpart.name, c.counterpart.subtitle, c.lastMessage?.body].some((v) => v?.toLowerCase().includes(q))
    );
  }, [conversations, query]);

  return (
    <div className="grid h-[calc(100dvh-11rem)] min-h-[440px] overflow-hidden rounded-2xl border border-border bg-card md:h-[calc(100dvh-5rem-3px)] lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
      {/* ------------------------------------------------ conversation list */}
      <aside className={cn("flex min-h-0 min-w-0 flex-col border-border lg:border-r", activeId && "max-lg:hidden")}>
        <div className="space-y-3 p-4 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <label className="relative block">
            <span className="sr-only">Search conversations</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="h-9 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto pb-2">
          {filtered.map((c) => {
            const selected = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => openConversation(c.id)}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                    selected ? "bg-primary-soft" : "hover:bg-muted"
                  )}
                >
                  {selected && <span aria-hidden className="bg-brand-gradient absolute inset-y-2 left-0 w-1 rounded-r-full" />}
                  <PersonAvatar name={c.counterpart.name} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate font-heading text-sm", c.unread ? "font-semibold" : "font-medium")}>
                        {c.counterpart.name}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {now !== null && relativeTime(c.lastMessage?.createdAt ?? c.updatedAt, now)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={cn("truncate text-xs", c.unread ? "text-foreground" : "text-muted-foreground")}>
                        {c.lastMessage
                          ? `${c.lastMessage.fromMe ? "You: " : ""}${c.lastMessage.body}`
                          : "New booking — say hello"}
                      </span>
                      {c.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] font-semibold text-primary-foreground">
                          <span className="sr-only">Unread messages: </span>
                          {c.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {conversations.length === 0 ? (
          <p className="px-4 pb-6 text-sm text-muted-foreground">
            No conversations yet — a thread opens with your first booking.
          </p>
        ) : (
          filtered.length === 0 && <p className="px-4 pb-6 text-sm text-muted-foreground">No conversations match “{query}”.</p>
        )}
      </aside>

      {/* ------------------------------------------------------ thread pane */}
      <section className={cn("flex min-h-0 min-w-0 flex-col bg-background/40", !activeId && "max-lg:hidden")}>
        {active ? (
          <Thread
            key={active.id}
            conversation={active}
            messages={messages}
            loading={loadingThread}
            mounted={now !== null}
            onBack={() => openConversation(null)}
            onSend={(body) => send(body)}
            onRetry={(m) => send(m.body, m.id)}
          />
        ) : (
          <EmptyPane role={role} hasConversations={conversations.length > 0} />
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------- pieces

function EmptyPane({ role, hasConversations }: { role: "COMPANY" | "CREATOR"; hasConversations: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
        <MessagesSquare className="size-6" />
      </div>
      {hasConversations ? (
        <>
          <p className="font-heading font-medium">Select a conversation</p>
          <p className="max-w-xs text-sm text-muted-foreground">Pick a thread on the left to read and reply.</p>
        </>
      ) : (
        <>
          <p className="font-heading font-medium">No conversations yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {role === "COMPANY"
              ? "Book a creator and a private thread with them opens here."
              : "When a company books you, your private thread with them opens here."}
          </p>
          {role === "COMPANY" && (
            <Button className="mt-1" nativeButton={false} render={<Link href="/marketplace" />}>
              Browse marketplace
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function Thread({
  conversation,
  messages,
  loading,
  mounted,
  onBack,
  onSend,
  onRetry,
}: {
  conversation: ConversationSummary;
  messages: LocalMessage[];
  loading: boolean;
  mounted: boolean;
  onBack: () => void;
  onSend: (body: string) => void;
  onRetry: (m: LocalMessage) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // Follow new messages only if the reader is already at the bottom (or it's theirs).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    if (stickToBottom.current || last?.fromMe) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const { name, subtitle, profileHref } = conversation.counterpart;

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="-ml-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" />
        </button>
        <PersonAvatar name={name} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading font-medium">{name}</p>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {profileHref && (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={profileHref} prefetch={false} />}>
            View profile
          </Button>
        )}
      </header>

      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6"
        aria-live="polite"
      >
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading messages…</p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="font-heading font-medium">No messages yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Say hello to {name}. Only the two of you can see this conversation.
            </p>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const newDay = mounted && (!prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString());
              return (
                <li key={m.id}>
                  {newDay && (
                    <p className="py-3 text-center font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      {dayLabel(m.createdAt)}
                    </p>
                  )}
                  <div className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm",
                        m.fromMe
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border bg-card",
                        m.status === "failed" && "bg-destructive/10 text-foreground ring-1 ring-destructive/40"
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">{m.body}</p>
                      {/* Status text always uses the bubble's own foreground (never the
                          muted grey, which disappears on the primary-colour bubble). */}
                      <p
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 font-mono text-[10px]",
                          m.status === "failed"
                            ? "font-medium text-foreground"
                            : m.fromMe
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                        )}
                      >
                        {m.status === "sending" ? (
                          <>
                            <Clock3 aria-hidden className="size-3" />
                            Sending…
                          </>
                        ) : m.status === "failed" ? (
                          <>
                            <AlertCircle aria-hidden className="size-3 text-destructive" />
                            Not sent
                          </>
                        ) : mounted ? (
                          clockTime(m.createdAt)
                        ) : null}
                      </p>
                    </div>
                  </div>
                  {m.status === "failed" && (
                    <div className="mt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onRetry(m)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                      >
                        <RotateCw aria-hidden className="size-3 text-destructive" /> Retry
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <Composer onSend={onSend} />
    </>
  );
}

function Composer({ onSend }: { onSend: (body: string) => void }) {
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Grow with the text up to ~6 lines, then scroll.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
  }, [draft]);

  const trimmed = draft.trim();
  const tooLong = trimmed.length > MAX_LENGTH;

  function submit() {
    if (!trimmed || tooLong) return;
    onSend(trimmed);
    setDraft("");
    ref.current?.focus();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-border bg-card p-3"
    >
      <div className="flex items-end gap-2">
        <label className="flex-1">
          <span className="sr-only">Write a message</span>
          <textarea
            ref={ref}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // Enter sends, Shift+Enter adds a line (and don't fire mid-IME composition).
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Write a message…"
            className="block max-h-40 min-h-10 w-full resize-none rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <Button type="submit" size="icon-lg" className="size-10 shrink-0 rounded-xl" disabled={!trimmed || tooLong} aria-label="Send message">
          <SendHorizontal className="size-4" />
        </Button>
      </div>
      <p className={cn("mt-1.5 flex justify-between px-1 text-[11px] text-muted-foreground", tooLong && "text-destructive")}>
        <span className="max-sm:hidden">Enter to send · Shift + Enter for a new line</span>
        {trimmed.length > MAX_LENGTH - 200 && (
          <span className="ml-auto font-mono">
            {trimmed.length}/{MAX_LENGTH}
          </span>
        )}
      </p>
    </form>
  );
}
