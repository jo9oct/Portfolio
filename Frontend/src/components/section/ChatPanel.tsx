import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowLeft,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { aboutFacts, heroBio, profile } from "@/lib/portfolio-data";
import { useVisitorCounter } from "@/hooks/useVisitorCounter";

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3422").replace(/\/+$/, "");

type View = "profile" | "telegram" | "ai";
type Msg = { id: string; from: "me" | "bot"; text: string; time: string };

const TG_GREETING: Msg[] = [
  { id: "tg1", from: "bot", text: "Hey 👋 — thanks for stopping by!", time: now() },
  {
    id: "tg2",
    from: "bot",
    text: "Send a message and include your Telegram username or email so I can get back to you.",
    time: now(),
  },
];
const AI_GREETING: Msg[] = [
  { id: "ai1", from: "bot", text: "Hi! I'm Yohannis's AI assistant. Ask me anything about his work, skills, or projects.", time: now() },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function renderText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 break-all text-sky-400 hover:text-sky-300"
      >
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function ChatPanel() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [view, setView] = useState<View>("profile");
  const [tgMsgs, setTgMsgs] = useState<Msg[]>(TG_GREETING);
  const [aiMsgs, setAiMsgs] = useState<Msg[]>(AI_GREETING);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = view === "ai" ? aiMsgs : tgMsgs;
  const setMessages = view === "ai" ? setAiMsgs : setTgMsgs;

  useEffect(() => {
    if (view !== "profile" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || sending) return;

    const mine: Msg = {
      id: uid(),
      from: "me",
      text,
      time: now(),
    };

    setMessages((m) => [...m, mine]);
    setDraft("");
    setSending(true);

    try {
      if (view === "ai") {
        const history = [...aiMsgs, mine]
          .filter((m) => m.id !== "ai1")
          .map((m) => ({
            role: m.from === "me" ? "user" : "assistant",
            content: m.text,
          }));

        const response = await axios.post(`${backendUrl}/ai/send`, {
          messages: history,
        });

        const result = response.data;

        if (!result.ok) throw new Error(result.error || "AI request failed");

        setAiMsgs((m) => [
          ...m,
          {
            id: uid(),
            from: "bot",
            text: result.reply,
            time: now(),
          },
        ]);
      } else {
        const response = await axios.post(
          `${backendUrl}/telegram/send`,
          {
            name: "",
            text,
          }
        );

        const result = response.data;

        if (!result.ok) throw new Error(result.error || "Telegram request failed");

        setTgMsgs((m) => [
          ...m,
          {
            id: uid(),
            from: "bot",
            text:
              "Message received! ✅\nI'll get back to you soon. If you'd like a faster response, feel free to message me on Telegram 👉 https://t.me/jo9oct",
            time: now(),
          },
        ]);
      }
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  // Message: chat slides in from LEFT (exits to LEFT). Ask AI: from RIGHT (exits to RIGHT).
  // Profile stays underneath; only the chat overlay animates.
  const panel = (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex flex-col">
        <ProfileCard
          onMessage={() => setView("telegram")}
          onAI={() => setView("ai")}
          onClose={() => setOpen(false)}
        />
      </div>
      <AnimatePresence initial={false}>
        {view !== "profile" && (
          <motion.div
            key={view}
            initial={{ x: view === "ai" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: view === "ai" ? "100%" : "-100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-[color:var(--chat-bg)]"
          >
            <ChatView
              view={view}
              messages={messages}
              draft={draft}
              setDraft={setDraft}
              onSend={handleSend}
              sending={sending}
              scrollRef={scrollRef}
              onBack={() => setView("profile")}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop fixed panel */}
      <aside className="hidden lg:flex fixed top-0 right-0 h-screen w-[380px] xl:w-[420px] border-l border-border bg-[color:var(--chat-bg)]">
        {panel}
      </aside>

      {/* Mobile floating button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 h-14 w-14 inline-flex items-center justify-center rounded-full text-white shadow-lg shadow-black/40 bg-gradient-to-br from-violet-500 to-fuchsia-600"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 z-50 bg-[color:var(--chat-bg)]"
          >
            <div className="h-full">{panel}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


function ProfileCard({
  onMessage,
  onAI,
  onClose,
}: {
  onMessage: () => void;
  onAI: () => void;
  onClose: () => void;
}) {
  const { totalVisitors, isLoading } = useVisitorCounter();
  return (
    <div className="flex-1 flex flex-col px-6 pt-3 lg:pt-6 pb-5 overflow-y-auto no-scrollbar text-center">
      <button
        onClick={onClose}
        className="lg:hidden self-start -ml-1 mb-1 p-1 rounded-full hover:bg-accent"
        aria-label="Close"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="mx-auto relative mt-1 lg:mt-2 h-48 w-48">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.18_280/35%),transparent_70%)]" />
        <div className="absolute inset-2 rounded-full border border-white/10" />
        <div className="absolute inset-3 rounded-full overflow-hidden bg-background border border-white/10">
          <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-background" />
        </div>
        <TechBadgeMini className="-top-1 left-4" bg="#1f2937" fg="#61DAFB">⚛</TechBadgeMini>
        <TechBadgeMini className="top-6 -right-2" bg="#0f172a" fg="#38BDF8">≋</TechBadgeMini>
        <TechBadgeMini className="top-1/2 -left-3" bg="#facc15" fg="#000">JS</TechBadgeMini>
        <TechBadgeMini className="-bottom-1 left-7" bg="#0b3d2e" fg="#84cc16">⬢</TechBadgeMini>
        <TechBadgeMini className="bottom-5 -right-3" bg="#052e16" fg="#22c55e">🍃</TechBadgeMini>
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-foreground">{profile.name}</h2>
      <div className="mt-1 text-sm text-muted-foreground">Full-Stack Developer · UI/UX Designer</div>
      <div className="mt-1 text-sm text-muted-foreground">Cybersecurity Enthusiast</div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
        {heroBio}
      </p>

      <a
        href={profile.cv}
        target="_blank"
        rel="noreferrer"
        className="btn-sweep-ghost mt-5 self-center"
      >
        <ArrowDownToLine className="h-4 w-4" />
        <span>View CV</span>
      </a>

      <div className="mt-5 flex items-center justify-center gap-3">
        <SocialMini href={profile.github} label="GitHub"><FaGithub className="h-4 w-4" /></SocialMini>
        <SocialMini href={profile.linkedin} label="LinkedIn"><FaLinkedin className="h-4 w-4" /></SocialMini>
        <SocialMini href={profile.telegram} label="Telegram"><Send className="h-4 w-4" /></SocialMini>
      </div>

      <div className="mt-6 pt-5 border-t border-border grid grid-cols-3 gap-3 text-center">
        {aboutFacts.slice(0, 3).map((f) => {
          const isVisitorCard = f.label.toLowerCase() === "visitors";
          const displayValue = isVisitorCard
            ? typeof totalVisitors === "number"
              ? totalVisitors.toLocaleString()
              : isLoading
              ? "..."
              : "—"
            : f.value;

          return (
            <div key={f.label}>
              <div className="text-lg font-semibold text-foreground">
                {isVisitorCard && isLoading && totalVisitors === null ? (
                  <span className="inline-block w-8 h-4 rounded bg-zinc-800 animate-pulse" />
                ) : (
                  displayValue
                )}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                {f.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6 flex gap-2">
        <button
          onClick={onMessage}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-white transition hover:brightness-95"
          style={{ backgroundColor: "#229ED9" }}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Message</span>
        </button>
        <button
          onClick={onAI}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium bg-white text-zinc-900 transition hover:brightness-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
}

function TechBadgeMini({
  className,
  bg,
  fg,
  children,
}: {
  className?: string;
  bg: string;
  fg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`absolute h-9 w-9 rounded-xl shadow-lg shadow-black/40 flex items-center justify-center text-[13px] font-bold border border-white/10 ${className ?? ""}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

function SocialMini({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:bg-accent transition"
    >
      {children}
    </a>
  );
}

function ChatView({
  view,
  messages,
  draft,
  setDraft,
  onSend,
  sending,
  scrollRef,
  onBack,
}: {
  view: View;
  messages: Msg[];
  draft: string;
  setDraft: (s: string) => void;
  onSend: () => void;
  sending: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  onClose: () => void;
}) {
  const isAI = view === "ai";
  const title = isAI ? "AI Assistant" : profile.shortName;
  const handle = isAI ? "@portfolio_ai" : profile.username;

  return (
    <div className="flex h-full flex-col min-h-0">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-accent shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        {isAI ? (
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-foreground text-background shrink-0">
            <Sparkles className="h-4 w-4" />
          </span>
        ) : (
          <img
            src={profile.avatar}
            alt={title}
            className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{title}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            online
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0">{handle}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-2 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
          {sending && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="rounded-2xl rounded-bl-md bg-[color:var(--chat-bubble-other)] px-3.5 py-2 text-xs text-muted-foreground">
                typing…
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Composer
        draft={draft}
        setDraft={setDraft}
        onSend={onSend}
        sending={sending}
        placeholder={isAI ? "Ask anything…" : "Write a message…"}
      />
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.from === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={[
          "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
          mine
            ? "bg-[color:var(--chat-bubble-me)] text-[color:var(--chat-bubble-me-fg)] rounded-br-md"
            : "bg-[color:var(--chat-bubble-other)] text-[color:var(--chat-bubble-other-fg)] rounded-bl-md",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap break-words">{renderText(msg.text)}</p>
        <div
          className={`text-[10px] mt-1 ${mine ? "text-[color:var(--chat-bubble-me-fg)]/60" : "text-muted-foreground"} text-right`}
        >
          {msg.time}
        </div>
      </div>
    </motion.div>
  );
}

function Composer({
  draft,
  setDraft,
  onSend,
  sending,
  placeholder,
}: {
  draft: string;
  setDraft: (s: string) => void;
  onSend: () => void;
  sending: boolean;
  placeholder: string;
}) {
  return (
    <div className="border-t border-border p-3 flex items-center gap-2">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={placeholder}
        maxLength={2000}
        className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-white/30 transition"
      />
      <button
        onClick={onSend}
        disabled={sending || !draft.trim()}
        className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40 transition hover:brightness-90"
        aria-label="Send"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}