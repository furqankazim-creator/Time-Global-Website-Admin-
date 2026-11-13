import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { logger } from "../lib/logger.js";
import { publicChatLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";

const SYSTEM_PROMPT = `
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
const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(4000),
  })).min(1).max(10),
});
export const chatRouter = Router();

chatRouter.post("/", publicChatLimiter, validate({ body: chatSchema }), asyncHandler(async (req, res) => {
  if (!env.GROQ_API_KEY) {
    return res.status(503).json({ error: { code: "CHAT_UNAVAILABLE", message: "Chat is temporarily unavailable." } });
  }
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...req.body.messages],
        temperature: 0.6,
        max_tokens: 450,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Provider status ${response.status}`);
    const body = await response.json() as { choices?: { message?: { content?: string } }[] };
    const reply = body.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("Empty provider reply");
    return res.json({ reply });
  } catch {
    logger.warn("Chat provider unavailable");
    return res.status(502).json({ error: { code: "CHAT_UNAVAILABLE", message: "Chat is temporarily unavailable. Please contact our team." } });
  }
}));
