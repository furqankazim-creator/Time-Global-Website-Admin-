import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Zap,
  ArrowUpRight,
  User,
  Bot,
  Calendar,
  Mail,
} from "lucide-react";
import { useContactModal } from "@/hooks/use-contact-modal";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const GROQ_CLIENT_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "qwen/qwen3.8-27b";

const COMPANY_SYSTEM_PROMPT = `
You are the official AI Assistant for Time Global — an AI-first digital agency and software engineering company.
Guide users warmly, accurately, and concisely about Time Global.

### About Time Global:
- Founded: 2013 (13+ years of software engineering excellence).
- Track Record: 150+ successfully delivered digital products, web apps, SaaS systems, and AI workflows.
- Global Footprint: Clients across 16+ countries worldwide (United States, UK, Japan, Germany, Canada, Australia, UAE, Saudi Arabia, Singapore, France, etc.).
- Philosophy: "Quick delivery, efficient execution, and measurable results."

### Core Services:
1. AI & Automation: Custom LLM integration, autonomous AI agents, workflow automations (Make, n8n, LangChain, Python), document intelligence, support bots.
2. Web & Full-Stack Development: Modern web apps with React, Next.js, TypeScript, Node.js, Python.
3. SaaS Product Engineering: Multi-tenant SaaS architecture, billing, auth, dashboards.
4. Mobile App Development: Cross-platform iOS & Android apps (React Native, Flutter) & native Swift/Kotlin.
5. Cloud & DevOps: AWS, GCP, Docker, Kubernetes, Terraform, CI/CD pipelines, database engineering (Postgres, Mongo, Redis).
6. UI/UX Design: Conversion-optimized product design, Figma prototypes.

### Rules:
- Keep responses friendly, concise, and structured with bullet points.
- Always encourage the user to click "Schedule a Consultation" or email timeglobaltech@gmail.com for custom roadmaps & quotes within 24 hours.
`;

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: string;
  timestamp: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Hello! 👋 I'm **Time Global's AI Assistant**.\n\n" +
      "We help businesses build high-performance **Web & SaaS Platforms**, deploy **AI & Workflow Automations**, and launch scalable digital products.\n\n" +
      "How can I help you bring your vision to life?",
    action: "open_contact",
    timestamp: "Just now",
  },
];

const SUGGESTIONS = [
  "💡 What services do you offer?",
  "🤖 How does AI & Automation work?",
  "💰 How much does a custom SaaS cost?",
  "🚀 How do we start a project?",
];

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-primary mt-1 text-[8px]">●</span>
              <span>{renderBold(content)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-primary font-mono text-[11px] font-bold">{numMatch[1]}.</span>
              <span>{renderBold(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{renderBold(trimmed)}</p>;
      })}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useContactModal();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(scrollToBottom, 120);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Try backend API first
      let assistantReply = "";

      try {
        const historyForApi = newMessages.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(`${API_BASE}/api/v1/public/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyForApi }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            assistantReply = data.reply;
          }
        }
      } catch {
        // Backend not responding, proceed to direct Groq call
      }

      // 2. Direct Groq API fallback if backend wasn't running
      if (!assistantReply && GROQ_CLIENT_KEY) {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_CLIENT_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              { role: "system", content: COMPANY_SYSTEM_PROMPT },
              ...newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.6,
            max_tokens: 450,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          assistantReply = groqData.choices?.[0]?.message?.content || "";
        }
      }

      if (!assistantReply) {
        assistantReply =
          "At **Time Global**, we specialize in **Web & SaaS Development**, **AI & Automation**, and **Cloud Infrastructure**.\n\n" +
          "Since 2013, our team has launched **150+ digital platforms** across **16+ countries**.\n\n" +
          "Would you like to schedule a free technical consultation with our engineering leads?";
      }

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: assistantReply,
        action: "open_contact",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          "Thank you for contacting Time Global! We are ready to help launch your software or AI project.\n\n" +
          "Click below to book a free consultation or email us at **timeglobaltech@gmail.com**.",
        action: "open_contact",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
      {/* ─── Chat Window ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[82vh] rounded-[24px] overflow-hidden flex flex-col shadow-2xl border border-border/80 dark:border-white/10 bg-card/95 dark:bg-[#0c0c16]/95 backdrop-blur-2xl mb-4 transition-colors"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-border/70 dark:border-white/[0.08] bg-secondary/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card dark:border-[#0c0c16]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground dark:text-white leading-none">
                    Time Global AI
                  </h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Instant replies • 13+ yrs expertise
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Restart chat"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold shadow-xs ${
                        isUser
                          ? "bg-primary text-white"
                          : "bg-gradient-to-tr from-purple-600 to-blue-500 text-white"
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[82%] space-y-1.5 ${isUser ? "items-end" : "items-start"}`}>
                      {/* Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl shadow-xs transition-colors ${
                          isUser
                            ? "bg-primary text-white rounded-tr-xs"
                            : "bg-secondary/70 dark:bg-white/[0.06] border border-border/70 dark:border-white/10 text-foreground dark:text-slate-100 rounded-tl-xs"
                        }`}
                      >
                        <FormattedMessage text={m.content} />
                      </div>

                      {/* Interactive Action Button */}
                      {!isUser && m.action === "open_contact" && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow transition-all duration-200 group cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule Consultation</span>
                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>

                          <a
                            href="mailto:timeglobaltech@gmail.com"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-card dark:bg-white/[0.05] border border-border/80 dark:border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Us</span>
                          </a>
                        </div>
                      )}

                      <span className="text-[9px] text-muted-foreground/70 px-1 font-mono block">
                        {m.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-secondary/70 dark:bg-white/[0.06] border border-border/70 dark:border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-3 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-border/50 dark:border-white/[0.05]">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSend(sug)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary/80 dark:bg-white/[0.05] hover:bg-primary/10 hover:text-primary border border-border/60 dark:border-white/10 text-muted-foreground hover:border-primary/30 transition-all text-left truncate max-w-full cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border/70 dark:border-white/[0.08] bg-secondary/30 dark:bg-black/20 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services, pricing, tech stack..."
                disabled={isLoading}
                className="flex-1 bg-card dark:bg-[#151524] border border-border/80 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Permanent Launcher & Floating Greeting Pill ─────────────────────── */}
      <div className="flex items-center gap-3 justify-end">
        {!isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/95 dark:bg-[#10101f]/95 border border-purple-500/30 dark:border-purple-400/25 shadow-xl backdrop-blur-xl text-left cursor-pointer hover:border-primary/60 hover:shadow-2xl transition-all group"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground dark:text-white leading-none group-hover:text-primary transition-colors flex items-center gap-1">
                Chat with Time Global AI
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Online now • Ask anything
              </p>
            </div>
          </motion.button>
        )}

        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative group w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl focus:outline-hidden focus:ring-4 focus:ring-purple-500/30 cursor-pointer overflow-hidden shrink-0"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          }}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {/* Ambient glow effect behind launcher */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* Inner surface */}
          <div className="relative w-full h-full rounded-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-spin [animation-duration:6s]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Unread Ping Badge */}
          {!isOpen && hasUnread && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-black" />
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
export default ChatWidget;

